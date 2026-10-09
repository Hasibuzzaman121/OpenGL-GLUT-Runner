# OpenGL & FreeGLUT Online Code Runner

> **Created by Hasib • [optigridcode.com](https://optigridcode.com)**

A fast, clean, and distraction-free online IDE and execution runner for **C++ OpenGL 1.1 & FreeGLUT** projects. Built specifically for students, educators, and developers to write, test, and run Code::Blocks Computer Graphics lab assignments and immediate-mode OpenGL projects directly in the modern web browser.

---

## 🌟 Key Features

- **⚡ Instant C++ to WebGL Immediate Mode Pipeline**: Runs OpenGL 1.1 immediate mode code (`glBegin`, `glEnd`, `glVertex2f`, `glColor3f`, `glPushMatrix`, `glPopMatrix`, `glRotatef`, `glTranslatef`, `gluOrtho2D`, `glOrtho`, `gluPerspective`, `gluLookAt`) natively in the browser via WebGL.
- **🖥️ Minimal & Clean IDE Interface**: Zero AI clutter or gimmicks. Pure, distraction-free IDE experience with syntax highlighting, custom monospace fonts, line numbers, and a real-time terminal console.
- **🎯 Precise Error Line Identification**:
  - Automatically identifies exact lines with syntax errors or runtime exceptions.
  - Highlights the offending line in red with an active line glow and gutter marker (`●`).
  - Single-click **"Jump to Line"** button to instantly scroll and focus the cursor on the exact line.
  - Clickable error links directly inside the Terminal Console (`[Jump to Line X]`).
- **🔄 Authentic FreeGLUT Event Loop & Callbacks**:
  - `glutDisplayFunc`, `glutIdleFunc`, `glutTimerFunc`, `glutReshapeFunc`
  - `glutKeyboardFunc`, `glutSpecialFunc`, `glutMouseFunc`, `glutMotionFunc`, `glutPassiveMotionFunc`
  - Built-in 3D shapes: `glutWireTeapot`, `glutSolidTeapot`, `glutWireCube`, `glutSolidCube`, `glutWireSphere`, `glutSolidSphere`, `glutWireTorus`, `glutWireCone`.
- **📐 Fullscreen Canvas**: An icon-only fullscreen toggle button (`Maximize2` / `Minimize2`) and double-click toggle for distraction-free graphics presentations.
- **📦 Preloaded Code::Blocks Templates**:
  1. *2D Scenery & Interactive Moving Car* (Day / Night cycle, driving controls)
  2. *3D Utah Teapot & Dynamic Lighting* (Rotations, materials, zoom)
  3. *Solar System Simulation* (Planetary orbits, hierarchical matrices)
  4. *Bresenham's Line Drawing Algorithm* (Computer Graphics lab classic)
  5. *2D Retro Pong Game* (Interactive paddle and ball physics)
  6. *3D Rotating Color Cube*
  7. *4-Blade Rotating Animated Pinwheel*
- **💾 Export to `.cpp`**: Download your source code as clean standard C++ ready to open in Code::Blocks, Visual Studio, or GCC/MinGW.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>F9</kbd> | **Run / Compile Project** |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | **Run / Compile Project** |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | **Run / Save Project** |
| <kbd>Tab</kbd> | Indent code with 4 spaces |
| <kbd>Esc</kbd> | Exit Fullscreen mode |

---

## 🚀 Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Graphics Engine**: Custom WebGL 1.0 immediate mode emulation pipeline ([src/engine/glutCore.ts](src/engine/glutCore.ts))
- **Parser & Validator**: [Acorn](https://github.com/acornjs/acorn) AST syntax validation + custom C++ transpiler ([src/engine/cppTranspiler.ts](src/engine/cppTranspiler.ts))
- **Icons**: Lucide Icons
- **Linting**: Oxlint

---

## 💻 Getting Started Locally

1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd "project runner"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 👤 Credits & Branding

Designed and Developed by **Hasib**  
Visit: [optigridcode.com](https://optigridcode.com)
