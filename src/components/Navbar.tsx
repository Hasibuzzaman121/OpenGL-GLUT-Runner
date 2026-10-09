import { Play, Square, RotateCcw, Download } from "lucide-react";
import type { ProjectTemplate } from "../data/templates";

interface NavbarProps {
  currentProject: ProjectTemplate;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onSelectProject: (template: ProjectTemplate) => void;
  onDownloadCpp: () => void;
  templates: ProjectTemplate[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  isRunning,
  onRun,
  onStop,
  onReset,
  onSelectProject,
  onDownloadCpp,
  templates
}) => {
  return (
    <header className="top-bar">
      {/* Brand & Project Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="logo-brand">
          <span style={{ color: "#58a6ff" }}>OpenGL</span>
          <span>GLUT Runner</span>
        </div>

        {/* Clean Project Dropdown */}
        <select
          className="select-input"
          value={currentProject.id}
          onChange={(e) => {
            const found = templates.find((t) => t.id === e.target.value);
            if (found) onSelectProject(found);
          }}
        >
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button className="btn btn-run" onClick={onRun} title="Run (F9)">
          <Play size={13} fill="#fff" />
          <span>Run (F9)</span>
        </button>

        {isRunning && (
          <button className="btn btn-stop" onClick={onStop} title="Stop">
            <Square size={13} fill="currentColor" />
            <span>Stop</span>
          </button>
        )}

        <button className="btn btn-secondary" onClick={onReset} title="Reset">
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        <button className="btn btn-secondary" onClick={onDownloadCpp} title="Export C++ file">
          <Download size={13} />
          <span>Export .cpp</span>
        </button>

        {/* Branding: Created by Hasib - optigridcode.com */}
        <a
          href="https://optigridcode.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            textDecoration: "none",
            color: "#8b949e",
            fontSize: "0.75rem",
            padding: "5px 10px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-ui)",
            transition: "all 0.15s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#58a6ff";
            e.currentTarget.style.borderColor = "#388bfd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#8b949e";
            e.currentTarget.style.borderColor = "var(--border-ui)";
          }}
          title="Created by Hasib | optigridcode.com"
        >
          <span style={{ color: "var(--text-muted)" }}>Created by</span>
          <strong style={{ color: "#f0f6fc", fontWeight: 600 }}>Hasib</strong>
          <span style={{ color: "var(--text-muted)" }}>•</span>
          <span style={{ color: "#58a6ff" }}>optigridcode.com</span>
        </a>
      </div>
    </header>
  );
};
