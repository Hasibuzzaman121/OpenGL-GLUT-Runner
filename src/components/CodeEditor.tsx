import { useState, useRef, useEffect, useCallback } from "react";
import { AlertCircle, ArrowDown } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  fileName: string;
  onRun: () => void;
  errorLine?: number | null;
  errorMessage?: string | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  fileName,
  onRun,
  errorLine,
  errorMessage
}) => {
  const [fontSize, setFontSize] = useState<number>(13);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [scrollTop, setScrollTop] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split("\n");
  const lineCount = lines.length;
  const lineHeightPx = Math.round(fontSize * 1.55);

  const jumpToLine = useCallback((lineNum: number) => {
    if (!textareaRef.current) return;
    const containerHeight = textareaRef.current.clientHeight || 400;
    const targetScroll = Math.max(0, 10 + (lineNum - 1) * lineHeightPx - containerHeight / 3);
    textareaRef.current.scrollTo({ top: targetScroll, behavior: "smooth" });

    // Focus & set cursor to beginning of that line
    const lineStartIndex = lines.slice(0, lineNum - 1).reduce((acc, l) => acc + l.length + 1, 0);
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(lineStartIndex, lineStartIndex);
  }, [lines, lineHeightPx]);

  useEffect(() => {
    if (errorLine && errorLine >= 1 && errorLine <= lineCount) {
      jumpToLine(errorLine);
    }
  }, [errorLine, jumpToLine, lineCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // F9 or Ctrl+Enter -> Run
    if (e.key === "F9" || (e.ctrlKey && e.key === "Enter")) {
      e.preventDefault();
      onRun();
      return;
    }

    // Ctrl+S -> Run / Save
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      onRun();
      return;
    }

    // Tab key -> Insert 4 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split("\n").length;
    const col = pos - textBefore.lastIndexOf("\n");
    setCursorPos({ line, col });
  }, [code]);

  useEffect(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Editor Tab Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "#161b22",
          borderBottom: "1px solid var(--border-ui)",
          fontSize: "0.78rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 600, color: "#f0f6fc" }}>{fileName}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>({lineCount} lines)</span>
        </div>

        {/* Font size adjustments */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={() => setFontSize(Math.max(11, fontSize - 1))}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.72rem",
              padding: "2px 4px"
            }}
          >
            A-
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(18, fontSize + 1))}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.72rem",
              padding: "2px 4px"
            }}
          >
            A+
          </button>
        </div>
      </div>

      {/* Prominent Error Line Banner */}
      {errorMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            background: "rgba(218, 54, 51, 0.16)",
            borderBottom: "1px solid rgba(218, 54, 51, 0.35)",
            color: "#f85149",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono)",
            gap: "10px",
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", minWidth: 0 }}>
            <AlertCircle size={15} style={{ flexShrink: 0, color: "#f85149" }} />
            {errorLine && (
              <span
                style={{
                  background: "#f85149",
                  color: "#ffffff",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                Line {errorLine}
              </span>
            )}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {errorMessage}
            </span>
          </div>

          {errorLine && (
            <button
              onClick={() => jumpToLine(errorLine)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(248, 81, 73, 0.25)",
                border: "1px solid rgba(248, 81, 73, 0.5)",
                color: "#ff7b72",
                padding: "3px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.72rem",
                fontWeight: 600,
                flexShrink: 0
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248, 81, 73, 0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248, 81, 73, 0.25)")}
            >
              <ArrowDown size={12} />
              <span>Jump to Line {errorLine}</span>
            </button>
          )}
        </div>
      )}

      {/* Editor Core Container */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          position: "relative",
          background: "var(--bg-editor)",
          overflow: "hidden"
        }}
      >
        {/* Full-width Active Error Line Highlight Layer behind text */}
        {errorLine && errorLine >= 1 && errorLine <= lineCount && (
          <div
            style={{
              position: "absolute",
              top: `${10 + (errorLine - 1) * lineHeightPx - scrollTop}px`,
              left: "48px",
              right: 0,
              height: `${lineHeightPx}px`,
              background: "linear-gradient(90deg, rgba(248, 81, 73, 0.22) 0%, rgba(248, 81, 73, 0.08) 60%, transparent 100%)",
              borderLeft: "3px solid #f85149",
              pointerEvents: "none",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "16px"
            }}
          >
            <span
              style={{
                background: "#f85149",
                color: "#ffffff",
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "3px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap"
              }}
            >
              Error on Line {errorLine}
            </span>
          </div>
        )}

        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          style={{
            width: "48px",
            background: "#090d13",
            borderRight: "1px solid var(--border-ui)",
            padding: "10px 0",
            fontFamily: "var(--font-mono)",
            fontSize: `${fontSize}px`,
            color: "var(--text-muted)",
            userSelect: "none",
            overflow: "hidden",
            flexShrink: 0
          }}
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const num = i + 1;
            const isErr = errorLine === num;
            return (
              <div
                key={i}
                onClick={() => isErr && jumpToLine(num)}
                style={{
                  height: `${lineHeightPx}px`,
                  lineHeight: `${lineHeightPx}px`,
                  paddingRight: "8px",
                  color: isErr ? "#ff7b72" : "var(--text-muted)",
                  fontWeight: isErr ? 800 : 400,
                  background: isErr ? "rgba(248, 81, 73, 0.3)" : "transparent",
                  borderLeft: isErr ? "3px solid #f85149" : "3px solid transparent",
                  cursor: isErr ? "pointer" : "default",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "4px"
                }}
                title={isErr ? `Error on line ${num} (Click to jump)` : undefined}
              >
                {isErr && (
                  <span style={{ color: "#f85149", fontSize: "0.6rem" }}>●</span>
                )}
                <span>{num}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          spellCheck={false}
          style={{
            flex: 1,
            position: "relative",
            zIndex: 2,
            background: "transparent",
            color: "#e6edf3",
            border: "none",
            outline: "none",
            resize: "none",
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeightPx}px`,
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
            overflowY: "auto",
            tabSize: 4
          }}
        />
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3px 12px",
          background: "#161b22",
          borderTop: "1px solid var(--border-ui)",
          fontSize: "0.7rem",
          color: "var(--text-muted)"
        }}
      >
        <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {errorLine && (
            <span style={{ color: "#ff7b72", fontWeight: 600 }}>
              ● Error at Line {errorLine}
            </span>
          )}
          <span>C++ (GLUT / OpenGL 1.1)</span>
          <a
            href="https://optigridcode.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#58a6ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Created by <span style={{ color: "#58a6ff" }}>Hasib</span> • optigridcode.com
          </a>
        </div>
      </div>
    </div>
  );
};
