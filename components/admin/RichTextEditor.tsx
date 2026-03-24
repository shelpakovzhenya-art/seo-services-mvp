"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RichTextEditorProps = {
  content?: string | null;
  onChange: (content: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Начните вводить текст...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (document.activeElement === editorRef.current) {
      return;
    }

    editorRef.current.innerHTML = content || "";
  }, [content]);

  const runCommand = (command: string, value?: string) => {
    if (mode !== "visual") {
      return;
    }

    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onChange(editorRef.current?.innerHTML || "");
  };

  const setLink = () => {
    const url = window.prompt("Введите URL");
    if (!url) {
      return;
    }
    runCommand("createLink", url);
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("formatBlock", "<blockquote>")}>
            <Quote className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={setLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("removeFormat")}>
            <RemoveFormatting className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("undo")}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => runCommand("redo")}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "visual" ? "default" : "outline"}
            onClick={() => setMode("visual")}
          >
            Визуально
          </Button>
          <Button
            type="button"
            variant={mode === "html" ? "default" : "outline"}
            onClick={() => setMode("html")}
          >
            HTML
          </Button>
        </div>
      </div>

      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="admin-editor-surface"
          data-placeholder={placeholder}
          onInput={() => onChange(editorRef.current?.innerHTML || "")}
        />
      ) : (
        <textarea
          className="admin-input min-h-[320px] font-mono text-sm"
          value={content || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
