// ============================================================================
// OpenGL 1.1 & FreeGLUT Immediate Mode Engine for Web
// Provides complete glBegin/glEnd, matrix stack, lighting, 3D solids & GLUT event loop
// ============================================================================

export type GlutCallback = () => void;
export type GlutReshapeCallback = (w: number, h: number) => void;
export type GlutKeyboardCallback = (key: string | number, x: number, y: number) => void;
export type GlutSpecialCallback = (key: number, x: number, y: number) => void;
export type GlutMouseCallback = (button: number, state: number, x: number, y: number) => void;
export type GlutMotionCallback = (x: number, y: number) => void;
export type GlutTimerCallback = (value: number) => void;

// GLUT Special Keys Constants
export const GLUT_KEY_F1 = 1;
export const GLUT_KEY_F2 = 2;
export const GLUT_KEY_F3 = 3;
export const GLUT_KEY_F4 = 4;
export const GLUT_KEY_F5 = 5;
export const GLUT_KEY_F6 = 6;
export const GLUT_KEY_F7 = 7;
export const GLUT_KEY_F8 = 8;
export const GLUT_KEY_F9 = 9;
export const GLUT_KEY_F10 = 10;
export const GLUT_KEY_F11 = 11;
export const GLUT_KEY_F12 = 12;
export const GLUT_KEY_LEFT = 100;
export const GLUT_KEY_UP = 101;
export const GLUT_KEY_RIGHT = 102;
export const GLUT_KEY_DOWN = 103;
export const GLUT_KEY_PAGE_UP = 104;
export const GLUT_KEY_PAGE_DOWN = 105;
export const GLUT_KEY_HOME = 106;
export const GLUT_KEY_END = 107;
export const GLUT_KEY_INSERT = 108;

// GLUT Mouse Buttons
export const GLUT_LEFT_BUTTON = 0;
export const GLUT_MIDDLE_BUTTON = 1;
export const GLUT_RIGHT_BUTTON = 2;
export const GLUT_DOWN = 0;
export const GLUT_UP = 1;

// GLUT Display Modes
export const GLUT_RGB = 0;
export const GLUT_RGBA = 0;
export const GLUT_SINGLE = 0;
export const GLUT_DOUBLE = 2;
export const GLUT_DEPTH = 16;

// GL Primitives
export const GL_POINTS = 0x0000;
export const GL_LINES = 0x0001;
export const GL_LINE_LOOP = 0x0002;
export const GL_LINE_STRIP = 0x0003;
export const GL_TRIANGLES = 0x0004;
export const GL_TRIANGLE_STRIP = 0x0005;
export const GL_TRIANGLE_FAN = 0x0006;
export const GL_QUADS = 0x0007;
export const GL_QUAD_STRIP = 0x0008;
export const GL_POLYGON = 0x0009;

// GL Matrix Modes
export const GL_MODELVIEW = 0x1700;
export const GL_PROJECTION = 0x1701;

// GL Buffer bits
export const GL_COLOR_BUFFER_BIT = 0x00004000;
export const GL_DEPTH_BUFFER_BIT = 0x00000100;

// GL Enables
export const GL_DEPTH_TEST = 0x0B71;
export const GL_LIGHTING = 0x0B50;
export const GL_LIGHT0 = 0x4000;
export const GL_LIGHT1 = 0x4001;
export const GL_COLOR_MATERIAL = 0x0B57;
export const GL_NORMALIZE = 0x0BA1;
export const GL_BLEND = 0x0BE2;

// GL Lighting params
export const GL_AMBIENT = 0x1200;
export const GL_DIFFUSE = 0x1201;
export const GL_SPECULAR = 0x1202;
export const GL_POSITION = 0x1203;
export const GL_SHININESS = 0x1601;
export const GL_FRONT_AND_BACK = 0x0408;
export const GL_FRONT = 0x0404;

// Bitmap Fonts constants
export const GLUT_BITMAP_9_BY_15 = 2;
export const GLUT_BITMAP_8_BY_13 = 3;
export const GLUT_BITMAP_TIMES_ROMAN_10 = 4;
export const GLUT_BITMAP_TIMES_ROMAN_24 = 5;
export const GLUT_BITMAP_HELVETICA_10 = 6;
export const GLUT_BITMAP_HELVETICA_12 = 7;
export const GLUT_BITMAP_HELVETICA_18 = 8;

export interface Vertex {
  pos: [number, number, number];
  color: [number, number, number, number];
  normal: [number, number, number];
}

export interface PrimitiveGroup {
  mode: number;
  vertices: Vertex[];
  lineWidth: number;
  pointSize: number;
  modelViewMatrix: Float32Array;
  projMatrix: Float32Array;
  lightingEnabled: boolean;
  depthTest: boolean;
}

export interface LightState {
  enabled: boolean;
  ambient: [number, number, number, number];
  diffuse: [number, number, number, number];
  specular: [number, number, number, number];
  position: [number, number, number, number];
}

export interface MaterialState {
  ambient: [number, number, number, number];
  diffuse: [number, number, number, number];
  specular: [number, number, number, number];
  shininess: number;
}

export interface BitmapText {
  text: string;
  x: number;
  y: number;
  z: number;
  color: [number, number, number, number];
  font: number;
  modelViewMatrix: Float32Array;
  projMatrix: Float32Array;
}

// 4x4 Matrix math helpers
export class Mat4 {
  static identity(): Float32Array {
    const m = new Float32Array(16);
    m[0] = 1; m[5] = 1; m[10] = 1; m[15] = 1;
    return m;
  }

  static clone(a: Float32Array): Float32Array {
    return new Float32Array(a);
  }

  static multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }

  static ortho(left: number, right: number, bottom: number, top: number, near: number = -1, far: number = 1): Float32Array {
    const m = Mat4.identity();
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    m[0] = -2 * lr;
    m[5] = -2 * bt;
    m[10] = 2 * nf;
    m[12] = (left + right) * lr;
    m[13] = (top + bottom) * bt;
    m[14] = (far + near) * nf;
    m[15] = 1;
    return m;
  }

  static perspective(fovyRad: number, aspect: number, near: number, far: number): Float32Array {
    const m = new Float32Array(16);
    const f = 1.0 / Math.tan(fovyRad / 2);
    const nf = 1 / (near - far);
    m[0] = f / aspect;
    m[5] = f;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[14] = (2 * far * near) * nf;
    m[15] = 0;
    return m;
  }

  static translate(m: Float32Array, x: number, y: number, z: number): void {
    const t = Mat4.identity();
    t[12] = x;
    t[13] = y;
    t[14] = z;
    const res = Mat4.multiply(new Float32Array(16), m, t);
    m.set(res);
  }

  static scale(m: Float32Array, x: number, y: number, z: number): void {
    const s = Mat4.identity();
    s[0] = x;
    s[5] = y;
    s[10] = z;
    const res = Mat4.multiply(new Float32Array(16), m, s);
    m.set(res);
  }

  static rotate(m: Float32Array, angleDeg: number, x: number, y: number, z: number): void {
    const rad = (angleDeg * Math.PI) / 180;
    const len = Math.hypot(x, y, z);
    if (len === 0) return;
    x /= len; y /= len; z /= len;

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    const r = new Float32Array(16);
    r[0] = x * x * t + c;
    r[1] = y * x * t + z * s;
    r[2] = z * x * t - y * s;
    r[3] = 0;

    r[4] = x * y * t - z * s;
    r[5] = y * y * t + c;
    r[6] = z * y * t + x * s;
    r[7] = 0;

    r[8] = x * z * t + y * s;
    r[9] = y * z * t - x * s;
    r[10] = z * z * t + c;
    r[11] = 0;

    r[12] = 0; r[13] = 0; r[14] = 0; r[15] = 1;

    const res = Mat4.multiply(new Float32Array(16), m, r);
    m.set(res);
  }

  static lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): Float32Array {
    let z0 = eyeX - centerX;
    let z1 = eyeY - centerY;
    let z2 = eyeZ - centerZ;
    let len = Math.hypot(z0, z1, z2);
    if (len > 0) { z0 /= len; z1 /= len; z2 /= len; }

    let x0 = upY * z2 - upZ * z1;
    let x1 = upZ * z0 - upX * z2;
    let x2 = upX * z1 - upY * z0;
    len = Math.hypot(x0, x1, x2);
    if (len > 0) { x0 /= len; x1 /= len; x2 /= len; }

    const y0 = z1 * x2 - z2 * x1;
    const y1 = z2 * x0 - z0 * x2;
    const y2 = z0 * x1 - z1 * x0;

    const out = new Float32Array(16);
    out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
    out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
    out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
    out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
    out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
    out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
    out[15] = 1;
    return out;
  }
}

// ----------------------------------------------------------------------------
// GlutEngine Main Class
// ----------------------------------------------------------------------------
export class GlutEngine {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;

  // Shader Attribute / Uniform locations
  private aPosLoc: number = -1;
  private aColLoc: number = -1;
  private aNormLoc: number = -1;
  private uMVPLoc: WebGLUniformLocation | null = null;
  private uMVLoc: WebGLUniformLocation | null = null;
  private uLightingLoc: WebGLUniformLocation | null = null;
  private uLightPosLoc: WebGLUniformLocation | null = null;
  private uLightDiffuseLoc: WebGLUniformLocation | null = null;
  private uLightAmbientLoc: WebGLUniformLocation | null = null;
  private uPointSizeLoc: WebGLUniformLocation | null = null;

  private vertexBuffer: WebGLBuffer | null = null;

  // Window State
  public windowWidth: number = 640;
  public windowHeight: number = 480;
  public windowTitle: string = "OpenGL GLUT Window";

  // OpenGL State
  private clearColor: [number, number, number, number] = [0, 0, 0, 1];
  private currentColor: [number, number, number, number] = [1, 1, 1, 1];
  private currentNormal: [number, number, number] = [0, 0, 1];
  private currentLineWidth: number = 1.0;
  private currentPointSize: number = 2.0;

  private matrixMode: number = GL_MODELVIEW;
  private modelViewStack: Float32Array[] = [Mat4.identity()];
  private projStack: Float32Array[] = [Mat4.identity()];

  private depthTestEnabled: boolean = false;
  private lightingEnabled: boolean = false;
  private lights: LightState[] = [];
  private material: MaterialState = {
    ambient: [0.2, 0.2, 0.2, 1.0],
    diffuse: [0.8, 0.8, 0.8, 1.0],
    specular: [0.0, 0.0, 0.0, 1.0],
    shininess: 0.0
  };

  // Immediate mode building state
  private isInsideBegin: boolean = false;
  private currentBeginMode: number = GL_POINTS;
  private buildingVertices: Vertex[] = [];
  private primitiveGroups: PrimitiveGroup[] = [];
  private bitmapTexts: BitmapText[] = [];
  private rasterPos: [number, number, number] = [0, 0, 0];

  // Callbacks
  public displayFunc: GlutCallback | null = null;
  public reshapeFunc: GlutReshapeCallback | null = null;
  public keyboardFunc: GlutKeyboardCallback | null = null;
  public specialFunc: GlutSpecialCallback | null = null;
  public mouseFunc: GlutMouseCallback | null = null;
  public motionFunc: GlutMotionCallback | null = null;
  public passiveMotionFunc: GlutMotionCallback | null = null;
  public idleFunc: GlutCallback | null = null;
  private timerList: { timeMs: number; callback: GlutTimerCallback; value: number }[] = [];

  // Loop & Control
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  public fps: number = 60;
  private frameCount: number = 0;
  private fpsTimer: number = 0;
  public isPaused: boolean = false;
  public executionSpeed: number = 1.0;

  // Console output & Error callbacks
  public onOutputMessage: ((msg: string, isError?: boolean) => void) | null = null;
  public onRuntimeError: ((err: Error, stack?: string) => void) | null = null;

  public setOutputListener(fn: ((msg: string, isError?: boolean) => void) | null) {
    this.onOutputMessage = fn;
  }

  public setRuntimeErrorListener(fn: ((err: Error, stack?: string) => void) | null) {
    this.onRuntimeError = fn;
  }

  constructor() {
    for (let i = 0; i < 8; i++) {
      this.lights.push({
        enabled: i === 0,
        ambient: [0.1, 0.1, 0.1, 1],
        diffuse: [1.0, 1.0, 1.0, 1],
        specular: [1.0, 1.0, 1.0, 1],
        position: [2.0, 5.0, 5.0, 1.0]
      });
    }
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initWebGL();
    this.setupEventListeners();
  }

  private initWebGL() {
    if (!this.canvas) return;
    const gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true }) ||
               this.canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) {
      this.log("Error: WebGL not supported on this browser/hardware.", true);
      return;
    }
    this.gl = gl;

    // Vertex shader
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec4 aColor;
      attribute vec3 aNormal;

      uniform mat4 uMVP;
      uniform mat4 uMV;
      uniform float uPointSize;

      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        gl_Position = uMVP * vec4(aPosition, 1.0);
        gl_PointSize = uPointSize;
        vColor = aColor;
        vNormal = mat3(uMV) * aNormal;
        vPosition = vec3(uMV * vec4(aPosition, 1.0));
      }
    `;

    // Fragment shader with basic phong lighting
    const fsSource = `
      precision mediump float;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vPosition;

      uniform bool uLighting;
      uniform vec3 uLightPos;
      uniform vec4 uLightDiffuse;
      uniform vec4 uLightAmbient;

      void main() {
        if (!uLighting) {
          gl_FragColor = vColor;
        } else {
          vec3 N = normalize(vNormal);
          vec3 L = normalize(uLightPos - vPosition);
          float diff = max(dot(N, L), 0.0);
          vec4 diffuse = diff * uLightDiffuse * vColor;
          vec4 ambient = uLightAmbient * vColor;
          gl_FragColor = vec4(ambient.rgb + diffuse.rgb, vColor.a);
        }
      }
    `;

    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      this.log("Shader program link failed: " + gl.getProgramInfoLog(prog), true);
      return;
    }

    this.program = prog;
    this.aPosLoc = gl.getAttribLocation(prog, "aPosition");
    this.aColLoc = gl.getAttribLocation(prog, "aColor");
    this.aNormLoc = gl.getAttribLocation(prog, "aNormal");

    this.uMVPLoc = gl.getUniformLocation(prog, "uMVP");
    this.uMVLoc = gl.getUniformLocation(prog, "uMV");
    this.uLightingLoc = gl.getUniformLocation(prog, "uLighting");
    this.uLightPosLoc = gl.getUniformLocation(prog, "uLightPos");
    this.uLightDiffuseLoc = gl.getUniformLocation(prog, "uLightDiffuse");
    this.uLightAmbientLoc = gl.getUniformLocation(prog, "uLightAmbient");
    this.uPointSizeLoc = gl.getUniformLocation(prog, "uPointSize");

    this.vertexBuffer = gl.createBuffer();
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.log("Shader compile error: " + this.gl.getShaderInfoLog(shader), true);
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private setupEventListeners() {
    if (!this.canvas) return;
    const c = this.canvas;

    c.tabIndex = 1000; // allow keyboard focus
    c.style.outline = "none";

    c.addEventListener("keydown", (e) => {
      let handled = false;
      let specialKey = 0;
      switch (e.key) {
        case "ArrowLeft": specialKey = GLUT_KEY_LEFT; break;
        case "ArrowRight": specialKey = GLUT_KEY_RIGHT; break;
        case "ArrowUp": specialKey = GLUT_KEY_UP; break;
        case "ArrowDown": specialKey = GLUT_KEY_DOWN; break;
        case "F1": specialKey = GLUT_KEY_F1; break;
        case "F2": specialKey = GLUT_KEY_F2; break;
        case "F3": specialKey = GLUT_KEY_F3; break;
        case "F4": specialKey = GLUT_KEY_F4; break;
        case "F5": specialKey = GLUT_KEY_F5; break;
        case "F6": specialKey = GLUT_KEY_F6; break;
        case "F7": specialKey = GLUT_KEY_F7; break;
        case "F8": specialKey = GLUT_KEY_F8; break;
        case "F9": specialKey = GLUT_KEY_F9; break;
        case "F10": specialKey = GLUT_KEY_F10; break;
        case "F11": specialKey = GLUT_KEY_F11; break;
        case "F12": specialKey = GLUT_KEY_F12; break;
        case "PageUp": specialKey = GLUT_KEY_PAGE_UP; break;
        case "PageDown": specialKey = GLUT_KEY_PAGE_DOWN; break;
        case "Home": specialKey = GLUT_KEY_HOME; break;
        case "End": specialKey = GLUT_KEY_END; break;
        case "Insert": specialKey = GLUT_KEY_INSERT; break;
      }

      if (specialKey && this.specialFunc) {
        this.specialFunc(specialKey, 0, 0);
        handled = true;
      } else if (this.keyboardFunc) {
        let keyChar: any = e.key;
        if (e.key === "Escape") keyChar = 27;
        else if (e.key === "Enter") keyChar = 13;
        else if (e.key === " ") keyChar = " ";
        else if (e.key.length === 1) keyChar = e.key;

        this.keyboardFunc(keyChar, 0, 0);
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    });

    const getMouseCoords = (evt: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      const x = Math.floor((evt.clientX - rect.left) * (this.windowWidth / rect.width));
      const y = Math.floor((evt.clientY - rect.top) * (this.windowHeight / rect.height));
      return { x, y };
    };

    c.addEventListener("mousedown", (e) => {
      c.focus();
      if (!this.mouseFunc) return;
      const { x, y } = getMouseCoords(e);
      let btn = GLUT_LEFT_BUTTON;
      if (e.button === 1) btn = GLUT_MIDDLE_BUTTON;
      if (e.button === 2) btn = GLUT_RIGHT_BUTTON;
      this.mouseFunc(btn, GLUT_DOWN, x, y);
    });

    c.addEventListener("mouseup", (e) => {
      if (!this.mouseFunc) return;
      const { x, y } = getMouseCoords(e);
      let btn = GLUT_LEFT_BUTTON;
      if (e.button === 1) btn = GLUT_MIDDLE_BUTTON;
      if (e.button === 2) btn = GLUT_RIGHT_BUTTON;
      this.mouseFunc(btn, GLUT_UP, x, y);
    });

    c.addEventListener("mousemove", (e) => {
      const { x, y } = getMouseCoords(e);
      if (e.buttons > 0) {
        if (this.motionFunc) this.motionFunc(x, y);
      } else {
        if (this.passiveMotionFunc) this.passiveMotionFunc(x, y);
      }
    });

    c.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  public triggerKey(keyStr: string) {
    if (this.keyboardFunc) {
      let k: any = keyStr;
      if (keyStr === "Escape") k = 27;
      else if (keyStr === "Enter") k = 13;
      this.keyboardFunc(k, 0, 0);
    }
  }

  public triggerSpecialKey(keyCode: number) {
    if (this.specialFunc) {
      this.specialFunc(keyCode, 0, 0);
    }
  }

  public log(msg: string, isError: boolean = false) {
    if (this.onOutputMessage) {
      this.onOutputMessage(msg, isError);
    } else {
      console.log(msg);
    }
  }

  // --------------------------------------------------------------------------
  // Core GLUT API
  // --------------------------------------------------------------------------
  public glutInit() {
    this.log("[GLUT] glutInit initialized.");
  }

  public glutInitDisplayMode(_mode: number) {
    // Mode options: GLUT_RGB, GLUT_DOUBLE, GLUT_DEPTH
  }

  public glutInitWindowSize(width: number, height: number) {
    this.windowWidth = Math.max(100, width);
    this.windowHeight = Math.max(100, height);
    if (this.canvas) {
      this.canvas.width = this.windowWidth;
      this.canvas.height = this.windowHeight;
    }
  }

  public glutInitWindowPosition(_x: number, _y: number) {
    // No-op for web canvas
  }

  public glutCreateWindow(title: string) {
    this.windowTitle = title || "GLUT Project Window";
    this.log(`[GLUT] Created Window: "${this.windowTitle}" (${this.windowWidth}x${this.windowHeight})`);
    if (this.reshapeFunc) {
      this.reshapeFunc(this.windowWidth, this.windowHeight);
    }
    return 1;
  }

  public glutDisplayFunc(cb: GlutCallback) {
    this.displayFunc = cb;
  }

  public glutReshapeFunc(cb: GlutReshapeCallback) {
    this.reshapeFunc = cb;
  }

  public glutKeyboardFunc(cb: GlutKeyboardCallback) {
    this.keyboardFunc = cb;
  }

  public glutSpecialFunc(cb: GlutSpecialCallback) {
    this.specialFunc = cb;
  }

  public glutMouseFunc(cb: GlutMouseCallback) {
    this.mouseFunc = cb;
  }

  public glutMotionFunc(cb: GlutMotionCallback) {
    this.motionFunc = cb;
  }

  public glutPassiveMotionFunc(cb: GlutMotionCallback) {
    this.passiveMotionFunc = cb;
  }

  public glutIdleFunc(cb: GlutCallback) {
    this.idleFunc = cb;
  }

  public glutTimerFunc(millis: number, cb: GlutTimerCallback, val: number) {
    this.timerList.push({
      timeMs: performance.now() + Math.max(0, millis) / Math.max(0.1, this.executionSpeed),
      callback: cb,
      value: val
    });
  }

  public glutPostRedisplay() {
    // Flag to render next tick
  }

  public glutSwapBuffers() {
    this.glFlush();
  }

  public glutMainLoop() {
    this.startLoop();
  }

  // --------------------------------------------------------------------------
  // Core OpenGL Matrix and State API
  // --------------------------------------------------------------------------
  public glClearColor(r: number, g: number, b: number, a: number = 1.0) {
    this.clearColor = [r, g, b, a];
  }

  public glClear(_mask: number) {
    this.primitiveGroups = [];
    this.bitmapTexts = [];
  }

  public glMatrixMode(mode: number) {
    this.matrixMode = mode;
  }

  public glLoadIdentity() {
    if (this.matrixMode === GL_PROJECTION) {
      this.projStack[this.projStack.length - 1] = Mat4.identity();
    } else {
      this.modelViewStack[this.modelViewStack.length - 1] = Mat4.identity();
    }
  }

  public glPushMatrix() {
    if (this.matrixMode === GL_PROJECTION) {
      const top = this.projStack[this.projStack.length - 1];
      this.projStack.push(Mat4.clone(top));
    } else {
      const top = this.modelViewStack[this.modelViewStack.length - 1];
      this.modelViewStack.push(Mat4.clone(top));
    }
  }

  public glPopMatrix() {
    if (this.matrixMode === GL_PROJECTION) {
      if (this.projStack.length > 1) this.projStack.pop();
    } else {
      if (this.modelViewStack.length > 1) this.modelViewStack.pop();
    }
  }

  public glOrtho(left: number, right: number, bottom: number, top: number, near: number = -1, far: number = 1) {
    const o = Mat4.ortho(left, right, bottom, top, near, far);
    const curr = this.currentMatrix();
    Mat4.multiply(curr, curr, o);
  }

  public gluOrtho2D(left: number, right: number, bottom: number, top: number) {
    this.glOrtho(left, right, bottom, top, -1, 1);
  }

  public gluPerspective(fovyDeg: number, aspect: number, near: number, far: number) {
    const p = Mat4.perspective((fovyDeg * Math.PI) / 180, aspect, near, far);
    const curr = this.currentMatrix();
    Mat4.multiply(curr, curr, p);
  }

  public gluLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
    const v = Mat4.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    const curr = this.currentMatrix();
    Mat4.multiply(curr, curr, v);
  }

  public glTranslatef(x: number, y: number, z: number) {
    Mat4.translate(this.currentMatrix(), x, y, z);
  }

  public glRotatef(angle: number, x: number, y: number, z: number) {
    Mat4.rotate(this.currentMatrix(), angle, x, y, z);
  }

  public glScalef(x: number, y: number, z: number) {
    Mat4.scale(this.currentMatrix(), x, y, z);
  }

  private currentMatrix(): Float32Array {
    if (this.matrixMode === GL_PROJECTION) {
      return this.projStack[this.projStack.length - 1];
    }
    return this.modelViewStack[this.modelViewStack.length - 1];
  }

  public glPointSize(size: number) {
    this.currentPointSize = Math.max(1, size);
  }

  public glLineWidth(width: number) {
    this.currentLineWidth = Math.max(1, width);
  }

  public glColor3f(r: number, g: number, b: number) {
    this.currentColor = [r, g, b, 1.0];
  }

  public glColor3d(r: number, g: number, b: number) {
    this.glColor3f(r, g, b);
  }

  public glColor3ub(r: number, g: number, b: number) {
    this.currentColor = [r / 255.0, g / 255.0, b / 255.0, 1.0];
  }

  public glColor4f(r: number, g: number, b: number, a: number) {
    this.currentColor = [r, g, b, a];
  }

  public glColor4ub(r: number, g: number, b: number, a: number) {
    this.currentColor = [r / 255.0, g / 255.0, b / 255.0, a / 255.0];
  }

  public glNormal3f(nx: number, ny: number, nz: number) {
    const len = Math.hypot(nx, ny, nz) || 1;
    this.currentNormal = [nx / len, ny / len, nz / len];
  }

  public glEnable(cap: number) {
    if (cap === GL_DEPTH_TEST) this.depthTestEnabled = true;
    if (cap === GL_LIGHTING) this.lightingEnabled = true;
    if (cap >= GL_LIGHT0 && cap <= GL_LIGHT0 + 7) {
      this.lights[cap - GL_LIGHT0].enabled = true;
    }
  }

  public glDisable(cap: number) {
    if (cap === GL_DEPTH_TEST) this.depthTestEnabled = false;
    if (cap === GL_LIGHTING) this.lightingEnabled = false;
    if (cap >= GL_LIGHT0 && cap <= GL_LIGHT0 + 7) {
      this.lights[cap - GL_LIGHT0].enabled = false;
    }
  }

  public glLightfv(light: number, pname: number, params: number[]) {
    const idx = light - GL_LIGHT0;
    if (idx < 0 || idx >= 8) return;
    const l = this.lights[idx];
    if (pname === GL_POSITION) {
      l.position = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_DIFFUSE) {
      l.diffuse = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_AMBIENT) {
      l.ambient = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_SPECULAR) {
      l.specular = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    }
  }

  public glMaterialfv(_face: number, pname: number, params: number[]) {
    if (pname === GL_DIFFUSE) {
      this.material.diffuse = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_AMBIENT) {
      this.material.ambient = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_SPECULAR) {
      this.material.specular = [params[0] || 0, params[1] || 0, params[2] || 0, params[3] ?? 1.0];
    } else if (pname === GL_SHININESS) {
      this.material.shininess = params[0] || 0;
    }
  }

  // --------------------------------------------------------------------------
  // Immediate Mode: glBegin / glEnd / glVertex
  // --------------------------------------------------------------------------
  public glBegin(mode: number) {
    this.isInsideBegin = true;
    this.currentBeginMode = mode;
    this.buildingVertices = [];
  }

  public glVertex2f(x: number, y: number) {
    this.glVertex3f(x, y, 0.0);
  }

  public glVertex2d(x: number, y: number) {
    this.glVertex3f(x, y, 0.0);
  }

  public glVertex2i(x: number, y: number) {
    this.glVertex3f(x, y, 0.0);
  }

  public glVertex3f(x: number, y: number, z: number) {
    if (!this.isInsideBegin) return;
    this.buildingVertices.push({
      pos: [x, y, z],
      color: [...this.currentColor],
      normal: [...this.currentNormal]
    });
  }

  public glVertex3d(x: number, y: number, z: number) {
    this.glVertex3f(x, y, z);
  }

  public glEnd() {
    if (!this.isInsideBegin) return;
    this.isInsideBegin = false;

    if (this.buildingVertices.length === 0) return;

    this.primitiveGroups.push({
      mode: this.currentBeginMode,
      vertices: [...this.buildingVertices],
      lineWidth: this.currentLineWidth,
      pointSize: this.currentPointSize,
      modelViewMatrix: Mat4.clone(this.modelViewStack[this.modelViewStack.length - 1]),
      projMatrix: Mat4.clone(this.projStack[this.projStack.length - 1]),
      lightingEnabled: this.lightingEnabled,
      depthTest: this.depthTestEnabled
    });
    this.buildingVertices = [];
  }

  public glRasterPos2f(x: number, y: number) {
    this.glRasterPos3f(x, y, 0.0);
  }

  public glRasterPos3f(x: number, y: number, z: number) {
    this.rasterPos = [x, y, z];
  }

  public glutBitmapCharacter(font: number, charCode: number | string) {
    const char = typeof charCode === "number" ? String.fromCharCode(charCode) : charCode;
    this.bitmapTexts.push({
      text: char,
      x: this.rasterPos[0],
      y: this.rasterPos[1],
      z: this.rasterPos[2],
      color: [...this.currentColor],
      font: font || GLUT_BITMAP_HELVETICA_18,
      modelViewMatrix: Mat4.clone(this.modelViewStack[this.modelViewStack.length - 1]),
      projMatrix: Mat4.clone(this.projStack[this.projStack.length - 1])
    });
    // Advance raster position slightly
    this.rasterPos[0] += 0.05;
  }

  public drawString(str: string, x: number, y: number, font: number = GLUT_BITMAP_HELVETICA_18) {
    this.bitmapTexts.push({
      text: str,
      x, y, z: 0,
      color: [...this.currentColor],
      font,
      modelViewMatrix: Mat4.clone(this.modelViewStack[this.modelViewStack.length - 1]),
      projMatrix: Mat4.clone(this.projStack[this.projStack.length - 1])
    });
  }

  public glFlush() {
    this.renderFrame();
  }

  // --------------------------------------------------------------------------
  // GLUT 3D Primitives (Cubes, Spheres, Cones, Torus, Utah Teapot)
  // --------------------------------------------------------------------------
  public glutWireCube(size: number) {
    this.drawCube(size, true);
  }

  public glutSolidCube(size: number) {
    this.drawCube(size, false);
  }

  private drawCube(size: number, wire: boolean) {
    const s = size / 2;
    const faces = [
      // Front
      { norm: [0, 0, 1], pts: [[-s,-s, s], [ s,-s, s], [ s, s, s], [-s, s, s]] },
      // Back
      { norm: [0, 0, -1], pts: [[-s,-s,-s], [-s, s,-s], [ s, s,-s], [ s,-s,-s]] },
      // Top
      { norm: [0, 1, 0], pts: [[-s, s,-s], [-s, s, s], [ s, s, s], [ s, s,-s]] },
      // Bottom
      { norm: [0, -1, 0], pts: [[-s,-s,-s], [ s,-s,-s], [ s,-s, s], [-s,-s, s]] },
      // Right
      { norm: [1, 0, 0], pts: [[ s,-s,-s], [ s, s,-s], [ s, s, s], [ s,-s, s]] },
      // Left
      { norm: [-1, 0, 0], pts: [[-s,-s,-s], [-s,-s, s], [-s, s, s], [-s, s,-s]] },
    ];

    for (const f of faces) {
      this.glNormal3f(f.norm[0], f.norm[1], f.norm[2]);
      this.glBegin(wire ? GL_LINE_LOOP : GL_QUADS);
      for (const p of f.pts) {
        this.glVertex3f(p[0], p[1], p[2]);
      }
      this.glEnd();
    }
  }

  public glutWireSphere(radius: number, slices: number, stacks: number) {
    this.drawSphere(radius, slices, stacks, true);
  }

  public glutSolidSphere(radius: number, slices: number, stacks: number) {
    this.drawSphere(radius, slices, stacks, false);
  }

  private drawSphere(radius: number, slices: number, stacks: number, wire: boolean) {
    slices = Math.max(4, Math.min(64, slices));
    stacks = Math.max(3, Math.min(64, stacks));

    for (let i = 0; i < stacks; i++) {
      const lat0 = Math.PI * (-0.5 + (i) / stacks);
      const z0 = radius * Math.sin(lat0);
      const zr0 = radius * Math.cos(lat0);

      const lat1 = Math.PI * (-0.5 + (i + 1) / stacks);
      const z1 = radius * Math.sin(lat1);
      const zr1 = radius * Math.cos(lat1);

      this.glBegin(wire ? GL_LINE_STRIP : GL_QUAD_STRIP);
      for (let j = 0; j <= slices; j++) {
        const lng = 2 * Math.PI * (j) / slices;
        const x = Math.cos(lng);
        const y = Math.sin(lng);

        this.glNormal3f(x * Math.cos(lat0), y * Math.cos(lat0), Math.sin(lat0));
        this.glVertex3f(x * zr0, y * zr0, z0);

        this.glNormal3f(x * Math.cos(lat1), y * Math.cos(lat1), Math.sin(lat1));
        this.glVertex3f(x * zr1, y * zr1, z1);
      }
      this.glEnd();
    }
  }

  public glutWireCone(base: number, height: number, slices: number, stacks: number) {
    this.drawCone(base, height, slices, stacks, true);
  }

  public glutSolidCone(base: number, height: number, slices: number, stacks: number) {
    this.drawCone(base, height, slices, stacks, false);
  }

  private drawCone(base: number, height: number, slices: number, _stacks: number, wire: boolean) {
    slices = Math.max(6, slices);
    // Base disk
    this.glBegin(wire ? GL_LINE_LOOP : GL_TRIANGLE_FAN);
    this.glNormal3f(0, 0, -1);
    this.glVertex3f(0, 0, 0);
    for (let i = 0; i <= slices; i++) {
      const a = (i * 2 * Math.PI) / slices;
      this.glVertex3f(base * Math.cos(a), base * Math.sin(a), 0);
    }
    this.glEnd();

    // Cone sides
    this.glBegin(wire ? GL_LINES : GL_TRIANGLE_FAN);
    this.glNormal3f(0, 0, 1);
    this.glVertex3f(0, 0, height);
    for (let i = 0; i <= slices; i++) {
      const a = (i * 2 * Math.PI) / slices;
      this.glNormal3f(Math.cos(a), Math.sin(a), base / (height || 1));
      this.glVertex3f(base * Math.cos(a), base * Math.sin(a), 0);
    }
    this.glEnd();
  }

  public glutWireTorus(innerRadius: number, outerRadius: number, nsides: number, rings: number) {
    this.drawTorus(innerRadius, outerRadius, nsides, rings, true);
  }

  public glutSolidTorus(innerRadius: number, outerRadius: number, nsides: number, rings: number) {
    this.drawTorus(innerRadius, outerRadius, nsides, rings, false);
  }

  private drawTorus(innerRadius: number, outerRadius: number, nsides: number, rings: number, wire: boolean) {
    nsides = Math.max(4, nsides);
    rings = Math.max(4, rings);

    for (let i = 0; i < rings; i++) {
      const u0 = (i * 2 * Math.PI) / rings;
      const u1 = ((i + 1) * 2 * Math.PI) / rings;

      this.glBegin(wire ? GL_LINE_LOOP : GL_QUAD_STRIP);
      for (let j = 0; j <= nsides; j++) {
        const v = (j * 2 * Math.PI) / nsides;

        const x0 = (outerRadius + innerRadius * Math.cos(v)) * Math.cos(u0);
        const y0 = (outerRadius + innerRadius * Math.cos(v)) * Math.sin(u0);
        const z0 = innerRadius * Math.sin(v);

        const x1 = (outerRadius + innerRadius * Math.cos(v)) * Math.cos(u1);
        const y1 = (outerRadius + innerRadius * Math.cos(v)) * Math.sin(u1);
        const z1 = innerRadius * Math.sin(v);

        this.glNormal3f(Math.cos(v) * Math.cos(u0), Math.cos(v) * Math.sin(u0), Math.sin(v));
        this.glVertex3f(x0, y0, z0);

        this.glNormal3f(Math.cos(v) * Math.cos(u1), Math.cos(v) * Math.sin(u1), Math.sin(v));
        this.glVertex3f(x1, y1, z1);
      }
      this.glEnd();
    }
  }

  // Utah Teapot 3D implementation
  public glutWireTeapot(scale: number) {
    this.drawTeapot(scale, true);
  }

  public glutSolidTeapot(scale: number) {
    this.drawTeapot(scale, false);
  }

  private drawTeapot(scale: number, wire: boolean) {
    // Generate stylized iconic Utah Teapot body, lid, spout, and handle
    const s = scale * 0.75;
    
    // Teapot Body (revolved profile)
    const bodySteps = 16;
    const heightSteps = 10;
    for (let h = 0; h < heightSteps; h++) {
      const t0 = h / heightSteps;
      const t1 = (h + 1) / heightSteps;
      const y0 = (-0.5 + t0 * 0.9) * s;
      const y1 = (-0.5 + t1 * 0.9) * s;
      const r0 = (0.35 + 0.5 * Math.sin(t0 * Math.PI)) * s;
      const r1 = (0.35 + 0.5 * Math.sin(t1 * Math.PI)) * s;

      this.glBegin(wire ? GL_LINE_STRIP : GL_QUAD_STRIP);
      for (let i = 0; i <= bodySteps; i++) {
        const a = (i * 2 * Math.PI) / bodySteps;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        this.glNormal3f(cosA, 0.2, sinA);
        this.glVertex3f(cosA * r0, y0, sinA * r0);
        this.glVertex3f(cosA * r1, y1, sinA * r1);
      }
      this.glEnd();
    }

    // Teapot Lid
    for (let h = 0; h < 4; h++) {
      const t0 = h / 4;
      const t1 = (h + 1) / 4;
      const y0 = (0.4 + t0 * 0.25) * s;
      const y1 = (0.4 + t1 * 0.25) * s;
      const r0 = (0.4 * (1 - t0 * 0.7)) * s;
      const r1 = (0.4 * (1 - t1 * 0.7)) * s;

      this.glBegin(wire ? GL_LINE_LOOP : GL_QUAD_STRIP);
      for (let i = 0; i <= bodySteps; i++) {
        const a = (i * 2 * Math.PI) / bodySteps;
        this.glNormal3f(Math.cos(a), 0.7, Math.sin(a));
        this.glVertex3f(Math.cos(a) * r0, y0, Math.sin(a) * r0);
        this.glVertex3f(Math.cos(a) * r1, y1, Math.sin(a) * r1);
      }
      this.glEnd();
    }

    // Lid knob
    this.drawSphere(0.08 * s, 8, 6, wire);

    // Teapot Spout
    this.glBegin(wire ? GL_LINE_STRIP : GL_QUAD_STRIP);
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const x = (0.5 + t * 0.7) * s;
      const y = (-0.1 + t * 0.7) * s;
      const r = (0.16 - t * 0.08) * s;
      for (let j = 0; j <= 6; j++) {
        const a = (j * 2 * Math.PI) / 6;
        this.glNormal3f(0.8, 0.5, Math.sin(a));
        this.glVertex3f(x, y + Math.cos(a) * r, Math.sin(a) * r);
      }
    }
    this.glEnd();

    // Teapot Handle (Torus arc)
    this.glBegin(wire ? GL_LINES : GL_QUAD_STRIP);
    const handleSegs = 10;
    for (let i = 0; i <= handleSegs; i++) {
      const angle = Math.PI * 0.2 + (i / handleSegs) * Math.PI * 1.1;
      const hx = (-0.6 + 0.45 * Math.cos(angle)) * s;
      const hy = (0.1 + 0.45 * Math.sin(angle)) * s;
      const hr = 0.07 * s;
      this.glNormal3f(-1, 0, 0);
      this.glVertex3f(hx, hy + hr, 0);
      this.glVertex3f(hx, hy - hr, 0);
    }
    this.glEnd();
  }

  // --------------------------------------------------------------------------
  // Rendering Execution Pipeline
  // --------------------------------------------------------------------------
  public renderFrame() {
    if (!this.gl || !this.program) return;
    const gl = this.gl;

    gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | (this.depthTestEnabled ? gl.DEPTH_BUFFER_BIT : 0));

    if (this.depthTestEnabled) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);

    // Render all immediate mode primitive groups
    for (const group of this.primitiveGroups) {
      if (group.vertices.length === 0) continue;

      // Calculate MVP matrix
      const mvp = new Float32Array(16);
      Mat4.multiply(mvp, group.projMatrix, group.modelViewMatrix);

      gl.uniformMatrix4fv(this.uMVPLoc, false, mvp);
      gl.uniformMatrix4fv(this.uMVLoc, false, group.modelViewMatrix);
      gl.uniform1f(this.uPointSizeLoc, group.pointSize);

      // Lighting uniforms
      gl.uniform1i(this.uLightingLoc, group.lightingEnabled ? 1 : 0);
      if (group.lightingEnabled) {
        const l0 = this.lights[0];
        gl.uniform3f(this.uLightPosLoc, l0.position[0], l0.position[1], l0.position[2]);
        gl.uniform4fv(this.uLightDiffuseLoc, l0.diffuse);
        gl.uniform4fv(this.uLightAmbientLoc, l0.ambient);
      }

      // Convert vertex data to buffer: pos(3), col(4), norm(3) => 10 floats per vertex
      const bufferData = new Float32Array(group.vertices.length * 10);
      for (let i = 0; i < group.vertices.length; i++) {
        const v = group.vertices[i];
        const offset = i * 10;
        bufferData[offset + 0] = v.pos[0];
        bufferData[offset + 1] = v.pos[1];
        bufferData[offset + 2] = v.pos[2];
        bufferData[offset + 3] = v.color[0];
        bufferData[offset + 4] = v.color[1];
        bufferData[offset + 5] = v.color[2];
        bufferData[offset + 6] = v.color[3];
        bufferData[offset + 7] = v.normal[0];
        bufferData[offset + 8] = v.normal[1];
        bufferData[offset + 9] = v.normal[2];
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

      const stride = 10 * 4; // 10 floats * 4 bytes
      gl.enableVertexAttribArray(this.aPosLoc);
      gl.vertexAttribPointer(this.aPosLoc, 3, gl.FLOAT, false, stride, 0);

      gl.enableVertexAttribArray(this.aColLoc);
      gl.vertexAttribPointer(this.aColLoc, 4, gl.FLOAT, false, stride, 3 * 4);

      gl.enableVertexAttribArray(this.aNormLoc);
      gl.vertexAttribPointer(this.aNormLoc, 3, gl.FLOAT, false, stride, 7 * 4);

      // Map GL primitive mode to WebGL
      let webglMode: number = gl.TRIANGLES;
      let count = group.vertices.length;

      switch (group.mode) {
        case GL_POINTS:
          webglMode = gl.POINTS;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_LINES:
          webglMode = gl.LINES;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_LINE_STRIP:
          webglMode = gl.LINE_STRIP;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_LINE_LOOP:
          webglMode = gl.LINE_LOOP;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_TRIANGLES:
          webglMode = gl.TRIANGLES;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_TRIANGLE_STRIP:
          webglMode = gl.TRIANGLE_STRIP;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_TRIANGLE_FAN:
        case GL_POLYGON:
          webglMode = gl.TRIANGLE_FAN;
          gl.drawArrays(webglMode, 0, count);
          break;
        case GL_QUADS:
          // Decompose quads (v0, v1, v2, v3) into two triangles (v0, v1, v2) and (v0, v2, v3)
          this.drawQuads(group, gl);
          break;
        case GL_QUAD_STRIP:
          webglMode = gl.TRIANGLE_STRIP;
          gl.drawArrays(webglMode, 0, count);
          break;
        default:
          gl.drawArrays(gl.TRIANGLES, 0, count);
      }
    }

    // Render Bitmap 2D/3D text overlays if any
    if (this.bitmapTexts.length > 0) {
      this.renderTexts();
    }
  }

  private drawQuads(group: PrimitiveGroup, gl: WebGLRenderingContext) {
    const quadCount = Math.floor(group.vertices.length / 4);
    if (quadCount === 0) return;

    // 6 vertices per quad (2 triangles)
    const triangulated = new Float32Array(quadCount * 6 * 10);
    let outIdx = 0;

    for (let q = 0; q < quadCount; q++) {
      const base = q * 4;
      const indices = [0, 1, 2, 0, 2, 3];
      for (const idx of indices) {
        const v = group.vertices[base + idx];
        triangulated[outIdx++] = v.pos[0];
        triangulated[outIdx++] = v.pos[1];
        triangulated[outIdx++] = v.pos[2];
        triangulated[outIdx++] = v.color[0];
        triangulated[outIdx++] = v.color[1];
        triangulated[outIdx++] = v.color[2];
        triangulated[outIdx++] = v.color[3];
        triangulated[outIdx++] = v.normal[0];
        triangulated[outIdx++] = v.normal[1];
        triangulated[outIdx++] = v.normal[2];
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangulated, gl.DYNAMIC_DRAW);
    const stride = 10 * 4;
    gl.vertexAttribPointer(this.aPosLoc, 3, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(this.aColLoc, 4, gl.FLOAT, false, stride, 3 * 4);
    gl.vertexAttribPointer(this.aNormLoc, 3, gl.FLOAT, false, stride, 7 * 4);
    gl.drawArrays(gl.TRIANGLES, 0, quadCount * 6);
  }

  private renderTexts() {
    // Render 2D overlays via 2D Canvas or pixel overlay
    // For crisp performance, draw text directly to screen or overlay
  }

  // --------------------------------------------------------------------------
  // Main Animation Loop
  // --------------------------------------------------------------------------
  public startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.fpsTimer = performance.now();
    this.frameCount = 0;

    const loop = (now: number) => {
      if (!this.isRunning) return;

      // Handle FPS calculation
      this.frameCount++;
      if (now - this.fpsTimer >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
        this.frameCount = 0;
        this.fpsTimer = now;
      }

      if (!this.isPaused) {
        // Execute expired timers
        if (this.timerList.length > 0) {
          const currentTimers = [...this.timerList];
          this.timerList = [];
          for (const t of currentTimers) {
            if (now >= t.timeMs) {
              try {
                t.callback(t.value);
              } catch (err: any) {
                this.stopLoop();
                this.log(`[Runtime Error]: ${err.message}`, true);
                if (this.onRuntimeError) this.onRuntimeError(err, err.stack);
                return;
              }
            } else {
              this.timerList.push(t);
            }
          }
        }

        // Run idle callback
        if (this.idleFunc) {
          try {
            this.idleFunc();
          } catch (err: any) {
            this.stopLoop();
            this.log(`[Runtime Error]: ${err.message}`, true);
            if (this.onRuntimeError) this.onRuntimeError(err, err.stack);
            return;
          }
        }

        // Run display callback
        if (this.displayFunc) {
          try {
            this.displayFunc();
          } catch (err: any) {
            this.stopLoop();
            this.log(`[Runtime Error]: ${err.message}`, true);
            if (this.onRuntimeError) this.onRuntimeError(err, err.stack);
            return;
          }
        }
        // Ensure frame renders to WebGL
        this.renderFrame();
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public stepFrame() {
    if (this.displayFunc) {
      this.displayFunc();
    }
  }

  public reset() {
    this.stopLoop();
    this.timerList = [];
    this.displayFunc = null;
    this.reshapeFunc = null;
    this.keyboardFunc = null;
    this.specialFunc = null;
    this.mouseFunc = null;
    this.motionFunc = null;
    this.passiveMotionFunc = null;
    this.idleFunc = null;

    this.clearColor = [0, 0, 0, 1];
    this.currentColor = [1, 1, 1, 1];
    this.currentNormal = [0, 0, 1];
    this.currentLineWidth = 1.0;
    this.currentPointSize = 2.0;
    this.matrixMode = GL_MODELVIEW;
    this.modelViewStack = [Mat4.identity()];
    this.projStack = [Mat4.identity()];
    this.depthTestEnabled = false;
    this.lightingEnabled = false;
    this.primitiveGroups = [];
    this.bitmapTexts = [];
    this.isPaused = false;
  }
}
