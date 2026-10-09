import { useRef, useEffect } from "react";

export interface LogEntry {
  id: string;
  text: string;
  type: "stdout" | "stderr" | "system";
  timestamp: string;
}

interface TerminalConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onJumpToLine?: (line: number) => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ logs, onClearLogs, onJumpToLine }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        background: "var(--bg-terminal)",
        overflow: "hidden"
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 12px",
          background: "#161b22",
          borderBottom: "1px solid var(--border-ui)",
          fontSize: "0.75rem",
          userSelect: "none"
        }}
      >
        <span style={{ fontWeight: 600, color: "var(--text-dim)" }}>
          Terminal Output
        </span>
        <button
          onClick={onClearLogs}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.72rem"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f6fc")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Clear
        </button>
      </div>

      {/* Logs View */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.76rem",
          lineHeight: "1.5",
          color: "#e6edf3"
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
            Console ready. Press "Run (F9)" to execute the GLUT project.
          </div>
        ) : (
          logs.map((log) => {
            let textColor = "#e6edf3";
            if (log.type === "stderr") textColor = "#f85149";
            if (log.type === "system") textColor = "#58a6ff";

            const lineMatch = log.text.match(/\bLine\s+(\d+)\b/i);
            const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : null;

            return (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  wordBreak: "break-all",
                  cursor: lineNum && onJumpToLine ? "pointer" : "default"
                }}
                onClick={() => {
                  if (lineNum && onJumpToLine) {
                    onJumpToLine(lineNum);
                  }
                }}
                title={lineNum ? `Click to jump to line ${lineNum}` : undefined}
              >
                <span style={{ color: "var(--text-muted)", userSelect: "none", flexShrink: 0 }}>
                  {log.timestamp}
                </span>
                <span style={{ color: textColor }}>
                  {log.text}
                  {lineNum && onJumpToLine && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "0.68rem",
                        color: "#58a6ff",
                        textDecoration: "underline"
                      }}
                    >
                      [Jump to Line {lineNum}]
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
