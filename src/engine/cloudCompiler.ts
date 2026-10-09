// ============================================================================
// Cloud C++ Compiler Engine (Piston Public API Integration)
// Allows running standard C/C++ Console projects or verifying GCC compilation
// ============================================================================

export interface CloudRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  output: string;
  exitCode?: number;
  executionTimeMs?: number;
  error?: string;
}

export async function runCloudCpp(sourceCode: string, stdin: string = ""): Promise<CloudRunResult> {
  const startTime = performance.now();
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: "c++",
        version: "10.2.0",
        files: [
          {
            name: "main.cpp",
            content: sourceCode
          }
        ],
        stdin: stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000
      })
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      throw new Error(`Cloud server responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const run = data.run || {};
    const compile = data.compile || {};

    let stderr = (compile.stderr || "") + (run.stderr || "");
    let stdout = run.stdout || "";
    let output = (compile.output || "") + (run.output || "");

    return {
      success: run.code === 0 && !compile.stderr,
      stdout,
      stderr,
      output: output || (stderr ? stderr : stdout),
      exitCode: run.code !== undefined ? run.code : compile.code,
      executionTimeMs: elapsed
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      success: false,
      stdout: "",
      stderr: err.message,
      output: `[Cloud Execution Error]: ${err.message}`,
      executionTimeMs: elapsed,
      error: err.message
    };
  }
}
