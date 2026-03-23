import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { renderSeoMonthlyReportPreview } from '@/lib/seo-report-preview'
import { SEO_MONTHLY_REPORT_JOB_TYPE, type SeoMonthlyReportConfig, type SeoMonthlyReportStoredResult } from '@/lib/seo-report-types'

type PythonCommand = {
  command: string
  argsPrefix: string[]
}

const PYTHON_COMMANDS: PythonCommand[] =
  process.platform === 'win32'
    ? [
        { command: 'python', argsPrefix: [] },
        { command: 'py', argsPrefix: ['-3'] },
      ]
    : [
        { command: 'python3', argsPrefix: [] },
        { command: 'python', argsPrefix: [] },
      ]

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function makeBaseName(config: SeoMonthlyReportConfig) {
  const hostname = sanitizeSegment(new URL(config.siteUrl).hostname || config.projectName || 'site')
  const date = new Date().toISOString().slice(0, 10)
  return `${hostname}-seo-report-${date}`
}

function createTempDir(jobId: string) {
  return path.join(os.tmpdir(), 'shelpakov-digital-seo-reports', jobId)
}

function runChild(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          [stderr.trim(), stdout.trim(), `${command} exited with code ${code}`]
            .filter(Boolean)
            .join('\n')
        )
      )
    })
  })
}

async function runPythonExportGenerator(inputPath: string, outputDir: string, baseName: string) {
  const scriptPath = path.join(process.cwd(), 'scripts', 'seo_report', 'generate_report.py')
  const scriptArgs = [
    scriptPath,
    '--input',
    inputPath,
    '--output-dir',
    outputDir,
    '--base-name',
    baseName,
  ]

  let lastError: unknown = null

  for (const candidate of PYTHON_COMMANDS) {
    try {
      await runChild(candidate.command, [...candidate.argsPrefix, ...scriptArgs])
      return
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(
    `Не удалось запустить генератор месячного SEO-отчета. ${
      lastError instanceof Error ? lastError.message : 'Проверьте наличие Python в среде.'
    }`
  )
}

async function buildStoredResult(config: SeoMonthlyReportConfig, tempDir: string): Promise<SeoMonthlyReportStoredResult> {
  const baseName = makeBaseName(config)
  const inputPath = path.join(tempDir, 'report.json')
  const docxPath = path.join(tempDir, `${baseName}.docx`)
  const pdfPath = path.join(tempDir, `${baseName}.pdf`)

  await fs.writeFile(inputPath, JSON.stringify(config, null, 2), 'utf-8')
  await runPythonExportGenerator(inputPath, tempDir, baseName)

  const [docxBuffer, pdfBuffer] = await Promise.all([fs.readFile(docxPath), fs.readFile(pdfPath)])
  const previewHtml = renderSeoMonthlyReportPreview(config)

  return {
    kind: 'seo_monthly_report',
    generatedAt: new Date().toISOString(),
    fileBaseName: baseName,
    previewHtml,
    pdfBase64: pdfBuffer.toString('base64'),
    docxBase64: docxBuffer.toString('base64'),
    report: config,
  }
}

export function runSeoMonthlyReportJob(jobId: string, config: SeoMonthlyReportConfig) {
  void (async () => {
    const tempDir = createTempDir(jobId)

    try {
      await fs.mkdir(tempDir, { recursive: true })
      const result = await buildStoredResult(config, tempDir)

      await prisma.parserJob.update({
        where: { id: jobId },
        data: {
          type: SEO_MONTHLY_REPORT_JOB_TYPE,
          status: 'completed',
          config: JSON.stringify({
            ...config,
            updatedAt: new Date().toISOString(),
            lastGeneratedAt: new Date().toISOString(),
          }),
          result: JSON.stringify(result),
          error: null,
          completedAt: new Date(),
        },
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось собрать месячный SEO-отчет. Проверьте исходники и Python-окружение.'

      await prisma.parserJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          error: message.slice(0, 2000),
          completedAt: new Date(),
        },
      })
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
    }
  })().catch((error) => {
    console.error('SEO monthly report background job crashed:', error)
  })
}
