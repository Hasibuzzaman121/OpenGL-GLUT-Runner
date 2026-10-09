import { BookOpen, Download, Cpu, X } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "85vh",
          background: "#0f1627",
          border: "1px solid var(--border-highlight)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "#131c31",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BookOpen size={20} color="var(--accent-amber)" />
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>
              Code::Blocks & FreeGLUT Setup Guide for Students
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ borderRadius: "50%", padding: "6px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.85rem", lineHeight: "1.6" }}>
          {/* Section 1 */}
          <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.25)", padding: "14px", borderRadius: "10px" }}>
            <h3 style={{ color: "var(--accent-cyan)", fontSize: "0.92rem", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Cpu size={16} />
              Why this Online Runner?
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Running GLUT/OpenGL in Code::Blocks on modern Windows / Mac / Linux often throws errors like <code>cannot find -lglut</code>, missing <code>freeglut.dll</code>, or compiler incompatibility.
              This Online Web Runner provides a <strong>100% zero-install, zero-delay WebGL execution sandbox</strong> so you can code, test, and demonstrate your university computer graphics assignments directly in any browser!
            </p>
          </div>

          {/* Section 2: Setup in Code::Blocks */}
          <div>
            <h3 style={{ color: "#fff", fontSize: "0.92rem", fontWeight: 700, marginBottom: "10px" }}>
              How to setup FreeGLUT in Code::Blocks on Windows (Desktop):
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  1
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Download FreeGLUT for MinGW</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Download <code>freeglut-MinGW.zip</code> (from freeglut official or Martin Pahr's transmission). Extract the zip folder.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  2
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Copy Header Files</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Copy all files from <code>freeglut/include/GL/</code> (including <code>glut.h</code>, <code>freeglut.h</code>) to your MinGW directory:
                    <br />
                    <code>C:\Program Files\CodeBlocks\MinGW\include\GL\</code>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  3
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Copy Library Files</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Copy <code>libfreeglut.a</code> or <code>libfreeglut_static.a</code> from <code>freeglut/lib/</code> to:
                    <br />
                    <code>C:\Program Files\CodeBlocks\MinGW\lib\</code>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  4
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Place freeglut.dll in System32 / SysWOW64</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Copy <code>freeglut.dll</code> from <code>freeglut/bin/</code> into:
                    <br />
                    <code>C:\Windows\System32\</code> (and <code>C:\Windows\SysWOW64\</code> on 64-bit Windows) OR keep it directly inside your project folder next to <code>main.cpp</code>.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  5
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Configure Linker Settings in Code::Blocks</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Go to <strong>Project &gt; Build options &gt; Linker settings &gt; Other linker options</strong> and paste:
                    <div style={{ background: "#060911", padding: "6px 10px", borderRadius: "6px", fontFamily: "var(--font-mono)", color: "#38bdf8", marginTop: "4px" }}>
                      -lfreeglut -lopengl32 -lglu32
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 1-Click Export */}
          <div style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.25)", padding: "14px", borderRadius: "10px" }}>
            <h3 style={{ color: "#c084fc", fontSize: "0.92rem", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Download size={16} />
              1-Click Code::Blocks .cbp Project Export
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              You don't need to manually configure build flags! Simply click <strong>Export &gt; Download .cbp Project</strong> from the top navbar. Double click the downloaded <code>.cbp</code> file to open it directly in Code::Blocks with all compiler and linker settings automatically wired up!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", background: "#131c31", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it, Let's Code!
          </button>
        </div>
      </div>
    </div>
  );
};
