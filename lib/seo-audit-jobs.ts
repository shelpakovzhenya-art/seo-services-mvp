import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { prisma } from '@/lib/prisma'

export type SeoAuditJobConfig = {
  url: string
  company: string
  sampleSize: number
}

type SeoAuditStoredResult = {
  kind: 'seo_audit'
  domain: string
  company: string
  generatedAt: string
  fileName: string
  score: number
  issuesCount: number
  growthPoints: string[]
  strengths: string[]
  auditJson: Record<string, unknown>
  previewHtml: string
  docxBase64: string
}

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

export function deriveAuditCompanyName(rawUrl: string) {
  try {
    const hostname = new URL(rawUrl).hostname.replace(/^www\./, '')
    const base = hostname.split('.').filter(Boolean)[0] || hostname
    return base
      .split(/[-_]/g)
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' ')
  } catch {
    return 'Проект'
  }
}

function makeAuditFileName(rawUrl: string) {
  const hostname = sanitizeSegment(new URL(rawUrl).hostname || 'site')
  const date = new Date().toISOString().slice(0, 10)
  return `${hostname}-seo-audit-${date}.docx`
}

function createAuditTempDir(jobId: string) {
  return path.join(os.tmpdir(), 'shelpakov-digital-audits', jobId)
}

function runChild(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
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
        resolve({ stdout, stderr })
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

async function runPythonGenerator(config: SeoAuditJobConfig, outputPath: string) {
  const scriptPath = path.join(process.cwd(), 'scripts', 'seo_audit', 'generate_audit.py')
  const scriptArgs = [
    scriptPath,
    '--url',
    config.url,
    '--company',
    config.company,
    '--sample-size',
    String(config.sampleSize),
    '--output',
    outputPath,
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
    `Не удалось запустить Python-генератор аудита. ${
      lastError instanceof Error ? lastError.message : 'Проверьте наличие Python в среде.'
    }`
  )
}

function fileToDataUrl(filePath: string, mimeType: string) {
  return fs.readFile(filePath).then((buffer) => `data:${mimeType};base64,${buffer.toString('base64')}`)
}

async function embedPreviewAssets(html: string, baseDir: string) {
  const matches = Array.from(html.matchAll(/src="([^"]+)"/g))
  let result = html

  for (const match of matches) {
    const originalSrc = match[1]

    if (!originalSrc || originalSrc.startsWith('http') || originalSrc.startsWith('data:')) {
      continue
    }

    const assetPath = path.resolve(baseDir, originalSrc)
    const extension = path.extname(assetPath).toLowerCase()
    const mimeType =
      extension === '.png'
        ? 'image/png'
        : extension === '.jpg' || extension === '.jpeg'
          ? 'image/jpeg'
          : extension === '.webp'
            ? 'image/webp'
            : null

    if (!mimeType) {
      continue
    }

    try {
      const dataUrl = await fileToDataUrl(assetPath, mimeType)
      result = result.split(`src="${originalSrc}"`).join(`src="${dataUrl}"`)
    } catch {
      // Keep the original src if the asset is unavailable.
    }
  }

  return result
}

async function buildStoredResult(config: SeoAuditJobConfig, tempDir: string): Promise<SeoAuditStoredResult> {
  const fileName = makeAuditFileName(config.url)
  const outputPath = path.join(tempDir, fileName)
  const outputStem = fileName.replace(/\.docx$/i, '')
  const htmlPath = path.join(tempDir, `${outputStem}.html`)
  const jsonPath = path.join(tempDir, `${outputStem}.json`)

  await runPythonGenerator(config, outputPath)

  const [docxBuffer, htmlRaw, jsonRaw] = await Promise.all([
    fs.readFile(outputPath),
    fs.readFile(htmlPath, 'utf-8'),
    fs.readFile(jsonPath, 'utf-8'),
  ])

  const previewHtml = await embedPreviewAssets(htmlRaw, tempDir)
  const auditJson = JSON.parse(jsonRaw) as Record<string, unknown>

  return {
    kind: 'seo_audit',
    domain: String(auditJson.domain || new URL(config.url).hostname),
    company: config.company,
    generatedAt: new Date().toISOString(),
    fileName,
    score: Number(auditJson.score || 0),
    issuesCount: Array.isArray(auditJson.issues) ? auditJson.issues.length : 0,
    growthPoints: Array.isArray(auditJson.growth_points)
      ? auditJson.growth_points.map((item) => String(item))
      : [],
    strengths: Array.isArray(auditJson.strengths) ? auditJson.strengths.map((item) => String(item)) : [],
    auditJson,
    previewHtml,
    docxBase64: docxBuffer.toString('base64'),
  }
}

export function parseSeoAuditJobResult(value: string | null) {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<SeoAuditStoredResult>
    if (parsed.kind !== 'seo_audit' || !parsed.docxBase64) {
      return null
    }

    return parsed as SeoAuditStoredResult
  } catch {
    return null
  }
}

export function runSeoAuditJob(jobId: string, config: SeoAuditJobConfig) {
  void (async () => {
    const tempDir = createAuditTempDir(jobId)

    try {
      await fs.mkdir(tempDir, { recursive: true })
      const result = await buildStoredResult(config, tempDir)

      await prisma.parserJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          result: JSON.stringify(result),
          completedAt: new Date(),
        },
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось собрать SEO-аудит. Проверьте Python-окружение и доступность сайта.'

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
    console.error('SEO audit background job crashed:', error)
  })
}
