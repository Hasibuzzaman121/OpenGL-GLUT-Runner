import { useState, useEffect, useRef, useCallback } from "react";
import { GlutEngine } from "./engine/glutCore";
import { CppGlutTranspiler, extractLineFromStack } from "./engine/cppTranspiler";
import { CODEBLOCKS_TEMPLATES, type ProjectTemplate } from "./data/templates";
import { Navbar } from "./components/Navbar";
import { CodeEditor } from "./components/CodeEditor";
import { GlutViewport } from "./components/GlutViewport";
import { TerminalConsole, type LogEntry } from "./components/TerminalConsole";

export function App() {
  const [currentProject, setCurrentProject] = useState<ProjectTemplate>(CODEBLOCKS_TEMPLATES[0]);
  const [code, setCode] = useState<string>(CODEBLOCKS_TEMPLATES[0].sourceCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    return [
      {
        id: "init",
        text: "[GLUT Runner] Ready. Created by Hasib — optigridcode.com",
        type: "system",
        timestamp: timeStr
      }
    ];
  });

  // Single GlutEngine instance
  const [engine] = useState(() => new GlutEngine());

  const addLog = useCallback((text: string, type: "stdout" | "stderr" | "system" = "stdout") => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setLogs((prev) => [...prev, { id: Math.random().toString(), text, type, timestamp: timeStr }]);
  }, []);

  // Hook up engine's output message & runtime error listener
  useEffect(() => {
    engine.setOutputListener((msg, isError) => {
      addLog(msg, isError ? "stderr" : "stdout");
    });

    engine.setRuntimeErrorListener((err, stack) => {
      setIsRunning(false);
      const totalLines = code.split("\n").length;
      const line = extractLineFromStack(stack, totalLines);
      setErrorLine(line);
      const msg = line ? `Line ${line}: ${err.message}` : err.message;
      setErrorMessage(msg);
      addLog(`[Runtime Error]: ${msg}`, "stderr");
    });

    return () => {
      engine.setOutputListener(null);
      engine.setRuntimeErrorListener(null);
    };
  }, [engine, code, addLog]);

  // Track FPS from engine
  useEffect(() => {
    const timer = setInterval(() => {
      setFps(engine.fps);
    }, 500);
    return () => clearInterval(timer);
  }, [engine]);

  // Unified execute pipeline
  const runCode = useCallback((sourceCode: string, projectName: string) => {
    setErrorLine(null);
    setErrorMessage(null);

    try {
      addLog(`[Compiling] ${projectName}...`, "system");
      const transpileRes = CppGlutTranspiler.transpile(sourceCode);

      if (!transpileRes.success || !transpileRes.jsCode) {
        setIsRunning(false);
        setErrorLine(transpileRes.line ?? null);
        setErrorMessage(transpileRes.error || "Syntax error in C++ code");
        addLog(`[Error]: ${transpileRes.error || "Syntax error in C++ code"}`, "stderr");
        return;
      }

      const execRes = CppGlutTranspiler.execute(transpileRes.jsCode, engine);
      if (!execRes.success) {
        setIsRunning(false);
        setErrorLine(execRes.line ?? null);
        setErrorMessage(execRes.error || "Runtime execution failed");
        addLog(`[Error]: ${execRes.error || "Runtime execution failed"}`, "stderr");
        return;
      }

      setIsRunning(true);
      addLog(`[Ready] Running in WebGL immediate mode.`, "system");
    } catch (err: any) {
      setIsRunning(false);
      const totalLines = sourceCode.split("\n").length;
      const line = extractLineFromStack(err.stack, totalLines);
      setErrorLine(line);
      const msg = line ? `Line ${line}: ${err.message}` : err.message;
      setErrorMessage(msg);
      addLog(`[Error]: ${msg}`, "stderr");
    }
  }, [engine, addLog]);

  // Handle Run
  const handleRun = useCallback(() => {
    runCode(code, currentProject.name);
  }, [code, currentProject.name, runCode]);

  // Handle Stop
  const handleStop = useCallback(() => {
    engine.stopLoop();
    setIsRunning(false);
    addLog(`[Stopped] Process terminated.`, "system");
  }, [engine, addLog]);

  // Handle Reset
  const handleReset = useCallback(() => {
    engine.reset();
    setIsRunning(false);
    addLog(`[Reset] Viewport cleared.`, "system");
  }, [engine, addLog]);

  // Handle template selection
  const handleSelectTemplate = useCallback((tpl: ProjectTemplate) => {
    engine.reset();
    setIsRunning(false);
    setCurrentProject(tpl);
    setCode(tpl.sourceCode);
    setErrorLine(null);
    setErrorMessage(null);
    addLog(`[Loaded] "${tpl.name}"`, "system");

    // Automatically run the selected template
    setTimeout(() => {
      runCode(tpl.sourceCode, tpl.name);
    }, 50);
  }, [engine, addLog, runCode]);

  // Export .cpp file
  const handleDownloadCpp = useCallback(() => {
    const blob = new Blob([code], { type: "text/x-c++src;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentProject.defaultFile || "main.cpp";
    a.click();
    URL.revokeObjectURL(url);
    addLog(`[Export] Downloaded ${a.download}`, "system");
  }, [code, currentProject, addLog]);

  // Global F9 shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleRun]);

  // Auto-run on first mount
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      const timer = setTimeout(() => {
        handleRun();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [handleRun]);

  return (
    <div className="app-container">
      {/* Top Bar */}
      <Navbar
        currentProject={currentProject}
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onReset={handleReset}
        onSelectProject={handleSelectTemplate}
        onDownloadCpp={handleDownloadCpp}
        templates={CODEBLOCKS_TEMPLATES}
      />

      {/* Main Workspace */}
      <main className="workspace-grid">
        {/* Left: Code Editor */}
        <section className="editor-pane">
          <CodeEditor
            code={code}
            onChange={(newCode) => {
              setCode(newCode);
              if (errorMessage) {
                setErrorLine(null);
                setErrorMessage(null);
              }
            }}
            fileName={currentProject.defaultFile || "main.cpp"}
            onRun={handleRun}
            errorLine={errorLine}
            errorMessage={errorMessage}
          />
        </section>

        {/* Right: Canvas + Terminal */}
        <section className="preview-pane">
          <GlutViewport
            engine={engine}
            isRunning={isRunning}
            fps={fps}
            projectTitle={currentProject.name}
          />

          <TerminalConsole
            logs={logs}
            onClearLogs={() => setLogs([])}
            onJumpToLine={(line) => setErrorLine(line)}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
