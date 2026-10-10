// ============================================================================
// C++ OpenGL / FreeGLUT Transpiler & Execution Runner
// Converts C++ OpenGL/GLUT source code into sandboxed JavaScript for the GlutEngine
// Accurately tracks source code line numbers for syntax and runtime errors
// ============================================================================

import * as acorn from "acorn";
import {
  GlutEngine,
  GL_POINTS, GL_LINES, GL_LINE_STRIP, GL_LINE_LOOP,
  GL_TRIANGLES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, GL_QUADS, GL_QUAD_STRIP, GL_POLYGON,
  GL_MODELVIEW, GL_PROJECTION,
  GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT,
  GL_DEPTH_TEST, GL_LIGHTING, GL_LIGHT0, GL_LIGHT1, GL_COLOR_MATERIAL, GL_NORMALIZE,
  GL_AMBIENT, GL_DIFFUSE, GL_SPECULAR, GL_POSITION, GL_SHININESS,
  GL_FRONT, GL_FRONT_AND_BACK,
  GLUT_RGB, GLUT_RGBA, GLUT_SINGLE, GLUT_DOUBLE, GLUT_DEPTH,
  GLUT_KEY_LEFT, GLUT_KEY_RIGHT, GLUT_KEY_UP, GLUT_KEY_DOWN,
  GLUT_KEY_F1, GLUT_KEY_F2, GLUT_KEY_F3, GLUT_KEY_F4,
  GLUT_LEFT_BUTTON, GLUT_RIGHT_BUTTON, GLUT_MIDDLE_BUTTON, GLUT_UP, GLUT_DOWN,
  GLUT_BITMAP_HELVETICA_10, GLUT_BITMAP_HELVETICA_12, GLUT_BITMAP_HELVETICA_18
} from "./glutCore";

export interface TranspileResult {
  success: boolean;
  jsCode?: string;
  error?: string;
  line?: number;
  column?: number;
}

export interface ExecuteResult {
  success: boolean;
  error?: string;
  line?: number;
}

export function extractLineFromStack(stack?: string, maxLine?: number): number | null {
  if (!stack) return null;
  // Match <anonymous>:LINE:COL or Function:LINE:COL or eval code:LINE:COL
  const matches = stack.matchAll(/(?:<anonymous>|Function|eval code):(\d+)(?::(\d+))?/gi);
  for (const match of matches) {
    const line = parseInt(match[1], 10);
    if (!isNaN(line) && line > 0 && (!maxLine || line <= maxLine)) {
      return line;
    }
  }
  const lineWordMatch = stack.match(/\bline\s+(\d+)\b/i);
  if (lineWordMatch) {
    const line = parseInt(lineWordMatch[1], 10);
    if (!isNaN(line) && line > 0 && (!maxLine || line <= maxLine)) {
      return line;
    }
  }
  return null;
}

export class CppGlutTranspiler {
  public static transpile(cppCode: string): TranspileResult {
    try {
      let code = cppCode;
      code = code.replace(/\r\n/g, "\n");

      // 1. Remove all C/C++ preprocessor directives line by line to preserve line count
      code = code.replace(/^\s*#(?:include|ifdef|ifndef|else|endif|if|elif|pragma|undef|error)\b.*$/gm, "// [preprocessor stripped]");

      // 2. Convert #define MACRO VALUE
      code = code.replace(/^\s*#define\s+([A-Za-z0-9_]+)\s+([^\n]+)/gm, (_match, name, val) => {
        if (name.includes("(")) return `// [macro ${name}]`;
        return `var ${name} = ${val.trim()};`;
      });

      // 3. Remove function prototypes / forward declarations (lines ending with ;)
      // e.g. void update(int value); or static void display(void);
      code = code.replace(/^\s*(?:static\s+|extern\s+|inline\s+)?(?:void|int|float|double|bool|GLvoid|GLint|GLfloat|[A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*;/gm, "// [prototype stripped: $1]");

      // 4. Strip static / extern / inline qualifiers
      code = code.replace(/\b(static|extern|inline)\s+/g, "");

      // 5. Remove 'using namespace std;'
      code = code.replace(/using\s+namespace\s+std\s*;/g, "// using namespace std");

      // 6. std::cout, printf, and std::cin
      code = code.replace(/(std::)?cout\s*(<<\s*[^;\n]+);/g, (_match, _ns, chain) => {
        const parts = chain
          .split("<<")
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0)
          .map((p: string) => {
            if (p === "endl" || p === "std::endl" || p === "'\\n'" || p === '"\\n"') return '"\\n"';
            return p;
          });
        return `__print(${parts.join(", ")});`;
      });
      code = code.replace(/\bprintf\s*\(/g, "__printf(");

      // 7. Strip 'f' / 'F' suffix from numbers: e.g. 0.5f, 1.0f, -0.15f, 3.1415f
      code = code.replace(/(\b\d+\.?\d*|\.\d+)[fF]\b/g, "$1");

      // 8. Strip C-style casts: (float)x, (int)x, (GLfloat)x -> clean no-op
      // Ensure we do NOT strip parameter lists like (int) in void update(int) or (int, int)
      code = code.replace(/\((float|double|int|long|short|unsigned int|GLfloat|GLint)\)(?!\s*[,;{})])/g, "");
      code = code.replace(/\b(float|double|int|long|short|unsigned|GLfloat|GLint)\s*\(([^)]+)\)/g, "Number($2)");

      // 9. Math functions & std::max / std::min
      code = code.replace(/\bstd::max\s*\(/g, "Math.max(");
      code = code.replace(/\bstd::min\s*\(/g, "Math.min(");
      code = code.replace(/\bstd::abs\s*\(/g, "Math.abs(");
      code = code.replace(/\bfmodf?\s*\(/g, "fmod(");
      code = code.replace(/\bfabsf?\s*\(/g, "Math.abs(");

      const mathFuncs = [
        "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
        "sqrt", "pow", "abs", "floor", "ceil", "round", "min", "max",
        "hypot", "exp", "log", "log10"
      ];
      for (const fn of mathFuncs) {
        const regex = new RegExp(`(?<!Math\\.)\\b${fn}f?\\s*\\(`, "g");
        code = code.replace(regex, `Math.${fn}(`);
      }
      code = code.replace(/(?<!\b(?:var|const|float|double)\s+)M_PI\b/g, "Math.PI");

      // 10. Replace (void) in parameter lists -> ()
      code = code.replace(/\(\s*void\s*\)/g, "()");

      // 11. Function definitions:
      // Match (return_type) funcName (args) followed by {
      // Must NOT match control flow (if, while, for, else if, switch, catch) or non-types
      const reservedControl = /^(if|else|while|for|switch|catch)$/;
      const knownTypes = new Set([
        "void", "int", "float", "double", "bool", "char", "long", "short",
        "unsigned", "signed", "auto", "size_t", "GLfloat", "GLint", "GLdouble",
        "GLboolean", "GLenum", "GLvoid", "GLclampf", "GLubyte", "GLbyte", "GLuint",
        "GLshort", "GLushort"
      ]);
      code = code.replace(/^\s*(?:static\s+|extern\s+|inline\s+)?(?:void|int|float|double|bool|char|long|short|unsigned\s+int|unsigned\s+char|GLvoid|GLint|GLfloat|GLdouble|GLboolean|GLenum|auto|[A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(\s*)\{/gm, (match, funcName, args, ws) => {
        if (reservedControl.test(funcName) || /^\s*(?:else|return|case|break)\b/.test(match)) {
          return match;
        }
        const cleanArgs = args
          .split(",")
          .map((a: string, idx: number) => {
            const cleaned = a.trim().replace(/[*&[\]]/g, "").trim();
            if (!cleaned || cleaned === "void") return "";
            const tokens = cleaned.split(/\s+/);
            const lastToken = tokens[tokens.length - 1];
            if (knownTypes.has(lastToken)) {
              return `_arg${idx}`;
            }
            return lastToken || `_arg${idx}`;
          })
          .filter((a: string) => a.length > 0)
          .join(", ");
        return `function ${funcName}(${cleanArgs})${ws}{`;
      });

      // 12. C++ Variable type replacements to 'var'
      code = code.replace(/\b(?:std::)?vector\s*<[^>]+>\s+/g, "var ");
      code = code.replace(/\b(?:std::)?string\s+/g, "var ");
      const typeList = [
        "float", "double", "int", "unsigned int", "short", "long", "char", "unsigned char",
        "bool", "GLfloat", "GLint", "GLdouble", "GLboolean", "GLenum", "GLvoid", "GLclampf",
        "size_t"
      ];
      const typeRegex = new RegExp(`\\b(${typeList.join("|")})\\s+`, "g");
      code = code.replace(typeRegex, "var ");
      code = code.replace(/\bconst\s+var\s+/g, "var ");
      code = code.replace(/\bconst\s+/g, "var ");

      // 13. Range-based for loop: for (var x : collection) -> for (var x of collection)
      code = code.replace(/for\s*\(\s*(?:var\s+)?([A-Za-z0-9_]+)\s*:\s*([^)]+)\)/g, "for (var $1 of $2)");

      // 14. Array initialization
      code = code.replace(/var\s+([A-Za-z0-9_]+)(?:\s*\[\s*\d*\s*\])+\s*=\s*\{([^;]+)\}\s*;/g, (_m, name, body) => {
        const jsonArr = body.replace(/\{/g, "[").replace(/\}/g, "]");
        return `var ${name} = [${jsonArr}];`;
      });
      code = code.replace(/=\s*\{([^;]+)\}\s*;/g, (_m, body) => {
        const jsonArr = body.replace(/\{/g, "[").replace(/\}/g, "]");
        return `= [${jsonArr}];`;
      });
      code = code.replace(/var\s+([^;]+);/g, (match, body) => {
        if (!body.includes("[")) return match;
        const parts = body.split(",").map((p: string) => p.trim());
        const transformed = parts.map((part: string) => {
          const arrMatch = part.match(/^([A-Za-z0-9_]+)\s*\[\s*(\d*)\s*\]$/);
          if (arrMatch) {
            const arrName = arrMatch[1];
            const arrSize = arrMatch[2] ? parseInt(arrMatch[2], 10) : 0;
            return arrSize > 0 ? `${arrName} = new Array(${arrSize}).fill(0)` : `${arrName} = []`;
          }
          return part;
        });
        return `var ${transformed.join(", ")};`;
      });

      // 15. Replace glutInit(&argc, argv) -> glutInit()
      code = code.replace(/glutInit\s*\([^)]*\)/g, "glutInit()");

      // 16. Common C constants
      code = code.replace(/\bEXIT_SUCCESS\b/g, "0");
      code = code.replace(/\bEXIT_FAILURE\b/g, "1");
      code = code.replace(/\bNULL\b/g, "null");

      // 17. Add loop guard with exact line numbers
      let loopId = 0;
      code = code.split("\n").map((lineContent, lineIdx) => {
        const lineNum = lineIdx + 1;
        return lineContent.replace(/\b(while\s*\([^)]+\)|for\s*\([^)]+\))\s*\{/g, (match) => {
          loopId++;
          return `${match} let __loopGuard_${loopId} = 0; if (++__loopGuard_${loopId} > 50000) { throw new Error("Infinite loop detected on line ${lineNum}!"); }`;
        });
      }).join("\n");

      // 18. SYNTAX VALIDATION using Acorn parser to find exact line & column
      try {
        acorn.parse(code, {
          ecmaVersion: "latest",
          locations: true,
          sourceType: "script"
        });
      } catch (acornErr: any) {
        const errLine = acornErr.loc ? acornErr.loc.line : null;
        const errCol = acornErr.loc ? acornErr.loc.column + 1 : null;
        const rawMsg = (acornErr.message || "Syntax error").replace(/\s*\(\d+:\d+\)$/, "");
        const formattedMsg = errLine ? `Line ${errLine}: ${rawMsg}` : rawMsg;
        return {
          success: false,
          error: formattedMsg,
          line: errLine ?? undefined,
          column: errCol ?? undefined,
          jsCode: code
        };
      }

      return {
        success: true,
        jsCode: code
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Transpilation failed"
      };
    }
  }

  public static execute(jsCode: string, engine: GlutEngine): ExecuteResult {
    const totalLines = jsCode.split("\n").length;
    try {
      engine.reset();

      // Custom print helpers to feed output into GLUT engine console
      const __print = (...args: any[]) => {
        const text = args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        engine.log(text);
      };

      const __printf = (format: string, ...args: any[]) => {
        let i = 0;
        const formatted = String(format).replace(/%[sdfc.0-9]*/g, () => {
          return args[i++] !== undefined ? String(args[i - 1]) : "";
        });
        engine.log(formatted);
      };

      // Expose OpenGL & GLUT functions directly into the sandbox scope
      const sandboxGlobals: Record<string, any> = {
        // GLUT Functions
        glutInit: engine.glutInit.bind(engine),
        glutInitDisplayMode: engine.glutInitDisplayMode.bind(engine),
        glutInitWindowSize: engine.glutInitWindowSize.bind(engine),
        glutInitWindowPosition: engine.glutInitWindowPosition.bind(engine),
        glutCreateWindow: engine.glutCreateWindow.bind(engine),
        glutDisplayFunc: engine.glutDisplayFunc.bind(engine),
        glutReshapeFunc: engine.glutReshapeFunc.bind(engine),
        glutKeyboardFunc: engine.glutKeyboardFunc.bind(engine),
        glutSpecialFunc: engine.glutSpecialFunc.bind(engine),
        glutMouseFunc: engine.glutMouseFunc.bind(engine),
        glutMotionFunc: engine.glutMotionFunc.bind(engine),
        glutPassiveMotionFunc: engine.glutPassiveMotionFunc.bind(engine),
        glutIdleFunc: engine.glutIdleFunc.bind(engine),
        glutTimerFunc: engine.glutTimerFunc.bind(engine),
        glutPostRedisplay: engine.glutPostRedisplay.bind(engine),
        glutSwapBuffers: engine.glutSwapBuffers.bind(engine),
        glutMainLoop: engine.glutMainLoop.bind(engine),

        // GLUT 3D Primitives
        glutWireCube: engine.glutWireCube.bind(engine),
        glutSolidCube: engine.glutSolidCube.bind(engine),
        glutWireSphere: engine.glutWireSphere.bind(engine),
        glutSolidSphere: engine.glutSolidSphere.bind(engine),
        glutWireCone: engine.glutWireCone.bind(engine),
        glutSolidCone: engine.glutSolidCone.bind(engine),
        glutWireTorus: engine.glutWireTorus.bind(engine),
        glutSolidTorus: engine.glutSolidTorus.bind(engine),
        glutWireTeapot: engine.glutWireTeapot.bind(engine),
        glutSolidTeapot: engine.glutSolidTeapot.bind(engine),
        glutBitmapCharacter: engine.glutBitmapCharacter.bind(engine),

        // OpenGL State & Transforms
        glClearColor: engine.glClearColor.bind(engine),
        glClear: engine.glClear.bind(engine),
        glMatrixMode: engine.glMatrixMode.bind(engine),
        glLoadIdentity: engine.glLoadIdentity.bind(engine),
        glPushMatrix: engine.glPushMatrix.bind(engine),
        glPopMatrix: engine.glPopMatrix.bind(engine),
        glOrtho: engine.glOrtho.bind(engine),
        gluOrtho2D: engine.gluOrtho2D.bind(engine),
        gluPerspective: engine.gluPerspective.bind(engine),
        gluLookAt: engine.gluLookAt.bind(engine),
        glTranslatef: engine.glTranslatef.bind(engine),
        glRotatef: engine.glRotatef.bind(engine),
        glScalef: engine.glScalef.bind(engine),
        glPointSize: engine.glPointSize.bind(engine),
        glLineWidth: engine.glLineWidth.bind(engine),
        glColor3f: engine.glColor3f.bind(engine),
        glColor3d: engine.glColor3d.bind(engine),
        glColor3ub: engine.glColor3ub.bind(engine),
        glColor4f: engine.glColor4f.bind(engine),
        glColor4ub: engine.glColor4ub.bind(engine),
        glNormal3f: engine.glNormal3f.bind(engine),
        glEnable: engine.glEnable.bind(engine),
        glDisable: engine.glDisable.bind(engine),
        glLightfv: engine.glLightfv.bind(engine),
        glMaterialfv: engine.glMaterialfv.bind(engine),
        glFlush: engine.glFlush.bind(engine),

        // Immediate mode
        glBegin: engine.glBegin.bind(engine),
        glVertex2f: engine.glVertex2f.bind(engine),
        glVertex2d: engine.glVertex2d.bind(engine),
        glVertex2i: engine.glVertex2i.bind(engine),
        glVertex3f: engine.glVertex3f.bind(engine),
        glVertex3d: engine.glVertex3d.bind(engine),
        glEnd: engine.glEnd.bind(engine),
        glRasterPos2f: engine.glRasterPos2f.bind(engine),
        glRasterPos3f: engine.glRasterPos3f.bind(engine),

        // Constants
        GL_POINTS, GL_LINES, GL_LINE_STRIP, GL_LINE_LOOP,
        GL_TRIANGLES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, GL_QUADS, GL_QUAD_STRIP, GL_POLYGON,
        GL_MODELVIEW, GL_PROJECTION,
        GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT,
        GL_DEPTH_TEST, GL_LIGHTING, GL_LIGHT0, GL_LIGHT1, GL_COLOR_MATERIAL, GL_NORMALIZE,
        GL_AMBIENT, GL_DIFFUSE, GL_SPECULAR, GL_POSITION, GL_SHININESS,
        GL_FRONT, GL_FRONT_AND_BACK,
        GLUT_RGB, GLUT_RGBA, GLUT_SINGLE, GLUT_DOUBLE, GLUT_DEPTH,
        GLUT_KEY_LEFT, GLUT_KEY_RIGHT, GLUT_KEY_UP, GLUT_KEY_DOWN,
        GLUT_KEY_F1, GLUT_KEY_F2, GLUT_KEY_F3, GLUT_KEY_F4,
        GLUT_LEFT_BUTTON, GLUT_RIGHT_BUTTON, GLUT_MIDDLE_BUTTON, GLUT_UP, GLUT_DOWN,
        GLUT_BITMAP_HELVETICA_10, GLUT_BITMAP_HELVETICA_12, GLUT_BITMAP_HELVETICA_18,

        // Standard C library math & utility globals
        PI: Math.PI,
        M_PI: Math.PI,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        atan2: Math.atan2,
        sqrt: Math.sqrt,
        pow: Math.pow,
        abs: Math.abs,
        fabs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        hypot: Math.hypot,
        exp: Math.exp,
        log: Math.log,
        log10: Math.log10,
        sinf: Math.sin,
        cosf: Math.cos,
        tanf: Math.tan,
        asinf: Math.asin,
        acosf: Math.acos,
        atanf: Math.atan,
        atan2f: Math.atan2,
        sqrtf: Math.sqrt,
        powf: Math.pow,
        absf: Math.abs,
        fabsf: Math.abs,
        floorf: Math.floor,
        ceilf: Math.ceil,
        roundf: Math.round,
        hypotf: Math.hypot,
        expf: Math.exp,
        logf: Math.log,
        log10f: Math.log10,
        fmod: (a: number, b: number) => a % b,
        fmodf: (a: number, b: number) => a % b,
        rand: () => Math.floor(Math.random() * 32767),
        srand: () => {},
        time: () => Math.floor(Date.now() / 1000),
        exit: () => engine.stopLoop(),
        EXIT_SUCCESS: 0,
        EXIT_FAILURE: 1,

        // Custom helpers
        __print,
        __printf,
        print: __print
      };

      const argNames = Object.keys(sandboxGlobals);
      const argValues = Object.values(sandboxGlobals);

      // Start jsCode on line 1 so stack line numbers match source line numbers directly
      const runnerCode = `${jsCode}
if (typeof main === "function") {
  main();
} else if (typeof display === "function") {
  glutDisplayFunc(display);
  if (typeof init === "function") init();
  if (typeof initGL === "function") initGL();
  glutMainLoop();
}`;

      const runnerFunction = new Function(...argNames, runnerCode);
      runnerFunction(...argValues);

      return { success: true };
    } catch (err: any) {
      const line = extractLineFromStack(err.stack, totalLines);
      const errorMsg = line ? `Line ${line}: ${err.message}` : err.message;
      engine.log(`[Runtime Error]: ${errorMsg}`, true);
      return {
        success: false,
        error: errorMsg,
        line: line ?? undefined
      };
    }
  }
}
