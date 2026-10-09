import { useRef, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { GlutEngine } from "../engine/glutCore";

interface GlutViewportProps {
  engine: GlutEngine;
  isRunning: boolean;
  fps: number;
  projectTitle: string;
}

export const GlutViewport: React.FC<GlutViewportProps> = ({
  engine,
  isRunning,
  fps,
  projectTitle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (canvasRef.current) {
      engine.setCanvas(canvasRef.current);
      canvasRef.current.focus();
    }
  }, [engine]);

  // Track native fullscreen change (e.g. Esc key pressed)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        background: "#0d1117",
        borderBottom: "1px solid var(--border-ui)",
        overflow: "hidden",
        position: "relative"
      }}
      onClick={() => {
        if (canvasRef.current) {
          canvasRef.current.focus();
        }
      }}
    >
      {/* Minimal Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "#161b22",
          borderBottom: "1px solid var(--border-ui)",
          fontSize: "0.78rem",
          userSelect: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 600, color: "#f0f6fc" }}>
            {projectTitle || "GLUT OpenGL Viewport"}
          </span>
          {isRunning && (
            <span
              style={{
                fontSize: "0.68rem",
                color: "#3fb950",
                background: "rgba(63, 185, 80, 0.15)",
                padding: "1px 6px",
                borderRadius: "10px",
                fontWeight: 600
              }}
            >
              Running
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", fontSize: "0.72rem" }}>
          <span>{fps} FPS</span>
          <span>{engine.windowWidth}x{engine.windowHeight}</span>
          <span style={{ color: isFocused ? "#58a6ff" : "var(--text-muted)" }}>
            {isFocused ? "Keys Active" : "Click to focus keys"}
          </span>

          {/* Fullscreen Icon Button (No Text) */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: isFullscreen ? "rgba(88, 166, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid",
              borderColor: isFullscreen ? "#388bfd" : "var(--border-ui)",
              color: isFullscreen ? "#58a6ff" : "#f0f6fc",
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: "5px",
              transition: "all 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#21262d";
              e.currentTarget.style.color = "#58a6ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isFullscreen ? "rgba(88, 166, 255, 0.15)" : "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.color = isFullscreen ? "#58a6ff" : "#f0f6fc";
            }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#010409",
          position: "relative",
          overflow: "hidden",
          padding: isFullscreen ? "0" : "8px"
        }}
      >
        <canvas
          ref={canvasRef}
          width={engine.windowWidth}
          height={engine.windowHeight}
          tabIndex={0}
          onDoubleClick={toggleFullscreen}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          title="Double-click to toggle fullscreen"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            outline: isFocused ? "1px solid #388bfd" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: isFullscreen ? "none" : "0 4px 20px rgba(0, 0, 0, 0.5)",
            background: "#000",
            cursor: "crosshair"
          }}
        />

        {/* Floating Escape indicator in fullscreen mode */}
        {isFullscreen && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(16, 22, 34, 0.8)",
              backdropFilter: "blur(6px)",
              border: "1px solid var(--border-ui)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "0.72rem",
              color: "#f0f6fc",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              pointerEvents: "auto",
              cursor: "pointer"
            }}
            onClick={toggleFullscreen}
          >
            <Minimize2 size={12} color="#58a6ff" />
            <span>Press Esc or Click to Exit</span>
          </div>
        )}
      </div>
    </div>
  );
};
