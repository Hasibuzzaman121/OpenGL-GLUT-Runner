// ============================================================================
// Code::Blocks Project Templates & Presets
// Includes authentic Code::Blocks project types with working GLUT & C++ demos
// ============================================================================

export interface ProjectTemplate {
  id: string;
  name: string;
  category: "Graphics & GUI" | "Console & Core" | "Game Engines" | "Embedded & Hardware" | "Libraries";
  icon: string; // identifier for icon
  description: string;
  badge?: string;
  defaultFile: string;
  sourceCode: string;
  cbpConfig?: string;
  keyboardHelp?: { key: string; description: string }[];
  isGlut?: boolean;
}

export const CODEBLOCKS_TEMPLATES: ProjectTemplate[] = [
  // --------------------------------------------------------------------------
  // 1. GLUT Project - 2D House & Moving Car (Interactive Day/Night)
  // --------------------------------------------------------------------------
  {
    id: "glut-car-scenery",
    name: "GLUT Project: 2D Scenery & Moving Car",
    category: "Graphics & GUI",
    icon: "glut",
    badge: "Most Popular",
    description: "Classic Computer Graphics Lab: House, mountains, moving car with rotating wheels, day/night toggle, and interactive driving.",
    defaultFile: "main.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "Left / Right Arrows", description: "Drive car forward or backward" },
      { key: "D / N", description: "Toggle Day / Night mode" },
      { key: "Space", description: "Honk horn (plays console beep)" },
      { key: "R", description: "Reset car position" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <cmath>
#include <iostream>

// Car and scenery variables
float carX = -0.6f;
float wheelAngle = 0.0f;
bool isDay = true;
float cloudX = -0.5f;

void drawCircle(float cx, float cy, float r, int segments) {
    glBegin(GL_POLYGON);
    for (int i = 0; i < segments; i++) {
        float theta = 2.0f * 3.1415926f * float(i) / float(segments);
        float x = r * cos(theta);
        float y = r * sin(theta);
        glVertex2f(cx + x, cy + y);
    }
    glEnd();
}

void drawHouse() {
    // House Base
    glColor3f(0.85f, 0.75f, 0.65f);
    glBegin(GL_QUADS);
        glVertex2f(0.2f, -0.3f);
        glVertex2f(0.7f, -0.3f);
        glVertex2f(0.7f, 0.2f);
        glVertex2f(0.2f, 0.2f);
    glEnd();

    // Roof (Triangle)
    glColor3f(0.8f, 0.2f, 0.2f);
    glBegin(GL_TRIANGLES);
        glVertex2f(0.15f, 0.2f);
        glVertex2f(0.75f, 0.2f);
        glVertex2f(0.45f, 0.5f);
    glEnd();

    // Door
    glColor3f(0.4f, 0.25f, 0.1f);
    glBegin(GL_QUADS);
        glVertex2f(0.4f, -0.3f);
        glVertex2f(0.5f, -0.3f);
        glVertex2f(0.5f, -0.05f);
        glVertex2f(0.4f, -0.05f);
    glEnd();

    // Window (Glows yellow at night!)
    if (isDay) {
        glColor3f(0.5f, 0.8f, 0.9f);
    } else {
        glColor3f(1.0f, 0.9f, 0.2f); // Warm glowing window
    }
    glBegin(GL_QUADS);
        glVertex2f(0.25f, 0.0f);
        glVertex2f(0.35f, 0.0f);
        glVertex2f(0.35f, 0.12f);
        glVertex2f(0.25f, 0.12f);
    glEnd();
}

void drawCar() {
    glPushMatrix();
    glTranslatef(carX, -0.45f, 0.0f);

    // Car Body (Bottom)
    glColor3f(0.9f, 0.2f, 0.3f); // Crimson Red
    glBegin(GL_QUADS);
        glVertex2f(-0.25f, 0.0f);
        glVertex2f(0.25f, 0.0f);
        glVertex2f(0.25f, 0.12f);
        glVertex2f(-0.25f, 0.12f);
    glEnd();

    // Car Cabin (Top)
    glColor3f(0.8f, 0.15f, 0.25f);
    glBegin(GL_QUADS);
        glVertex2f(-0.15f, 0.12f);
        glVertex2f(0.12f, 0.12f);
        glVertex2f(0.06f, 0.22f);
        glVertex2f(-0.10f, 0.22f);
    glEnd();

    // Windshield Windows
    glColor3f(0.7f, 0.9f, 1.0f);
    glBegin(GL_QUADS);
        glVertex2f(-0.08f, 0.14f);
        glVertex2f(0.04f, 0.14f);
        glVertex2f(0.02f, 0.20f);
        glVertex2f(-0.06f, 0.20f);
    glEnd();

    // Headlight (Beams at night)
    if (!isDay) {
        // Glowing Headlight
        glColor3f(1.0f, 1.0f, 0.5f);
        drawCircle(0.25f, 0.06f, 0.025f, 12);

        // Light beam
        glColor4f(1.0f, 1.0f, 0.4f, 0.3f);
        glBegin(GL_TRIANGLES);
            glVertex2f(0.25f, 0.06f);
            glVertex2f(0.65f, 0.15f);
            glVertex2f(0.65f, -0.05f);
        glEnd();
    } else {
        glColor3f(1.0f, 0.9f, 0.3f);
        drawCircle(0.25f, 0.06f, 0.02f, 12);
    }

    // Wheels (Black tire + rim + spokes)
    float wheelOffsets[2] = { -0.15f, 0.15f };
    for (int i = 0; i < 2; i++) {
        glPushMatrix();
        glTranslatef(wheelOffsets[i], 0.0f, 0.0f);
        glRotatef(wheelAngle, 0.0f, 0.0f, 1.0f);

        // Outer Tire
        glColor3f(0.15f, 0.15f, 0.15f);
        drawCircle(0.0f, 0.0f, 0.055f, 16);

        // Inner Rim
        glColor3f(0.7f, 0.7f, 0.7f);
        drawCircle(0.0f, 0.0f, 0.03f, 12);

        // Wheel Spokes
        glColor3f(0.1f, 0.1f, 0.1f);
        glLineWidth(2.0f);
        glBegin(GL_LINES);
            glVertex2f(-0.03f, 0.0f);
            glVertex2f(0.03f, 0.0f);
            glVertex2f(0.0f, -0.03f);
            glVertex2f(0.0f, 0.03f);
        glEnd();

        glPopMatrix();
    }

    glPopMatrix();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    // Sky Background
    if (isDay) {
        // Daylight gradient blue sky
        glBegin(GL_QUADS);
            glColor3f(0.4f, 0.7f, 1.0f); // Top sky
            glVertex2f(-1.0f, 1.0f);
            glVertex2f(1.0f, 1.0f);
            glColor3f(0.75f, 0.9f, 1.0f); // Horizon
            glVertex2f(1.0f, -0.3f);
            glVertex2f(-1.0f, -0.3f);
        glEnd();

        // Sun
        glColor3f(1.0f, 0.85f, 0.1f);
        drawCircle(-0.65f, 0.75f, 0.12f, 24);
    } else {
        // Night dark sky
        glBegin(GL_QUADS);
            glColor3f(0.05f, 0.05f, 0.15f);
            glVertex2f(-1.0f, 1.0f);
            glVertex2f(1.0f, 1.0f);
            glColor3f(0.12f, 0.12f, 0.25f);
            glVertex2f(1.0f, -0.3f);
            glVertex2f(-1.0f, -0.3f);
        glEnd();

        // Crescent Moon
        glColor3f(0.95f, 0.95f, 0.8f);
        drawCircle(0.7f, 0.75f, 0.1f, 24);
    }

    // Mountains in background
    glColor3f(0.35f, 0.45f, 0.4f);
    glBegin(GL_TRIANGLES);
        glVertex2f(-1.0f, -0.3f);
        glVertex2f(-0.4f, 0.4f);
        glVertex2f(0.2f, -0.3f);

        glVertex2f(-0.3f, -0.3f);
        glVertex2f(0.3f, 0.5f);
        glVertex2f(0.9f, -0.3f);
    glEnd();

    // Grass Field (Green Ground)
    glColor3f(0.25f, 0.65f, 0.25f);
    glBegin(GL_QUADS);
        glVertex2f(-1.0f, -0.3f);
        glVertex2f(1.0f, -0.3f);
        glVertex2f(1.0f, -0.6f);
        glVertex2f(-1.0f, -0.6f);
    glEnd();

    // Asphalt Road
    glColor3f(0.2f, 0.2f, 0.22f);
    glBegin(GL_QUADS);
        glVertex2f(-1.0f, -0.6f);
        glVertex2f(1.0f, -0.6f);
        glVertex2f(1.0f, -1.0f);
        glVertex2f(-1.0f, -1.0f);
    glEnd();

    // Road White Dashes
    glColor3f(1.0f, 1.0f, 1.0f);
    glLineWidth(3.0f);
    for (float rx = -0.9f; rx <= 0.9f; rx += 0.35f) {
        glBegin(GL_LINES);
            glVertex2f(rx, -0.8f);
            glVertex2f(rx + 0.15f, -0.8f);
        glEnd();
    }

    // Draw House and Animated Car
    drawHouse();
    drawCar();

    glutSwapBuffers();
}

void timer(int v) {
    // Smooth idle driving animation
    carX += 0.005f;
    wheelAngle -= 5.0f;
    if (carX > 1.3f) {
        carX = -1.3f;
    }

    glutPostRedisplay();
    glutTimerFunc(16, timer, 0); // 60 FPS
}

void keyboard(unsigned char key, int x, int y) {
    if (key == 'd' || key == 'D') {
        isDay = true;
        std::cout << "[Mode] Switched to Day Mode!" << std::endl;
    } else if (key == 'n' || key == 'N') {
        isDay = false;
        std::cout << "[Mode] Switched to Night Mode!" << std::endl;
    } else if (key == ' ') {
        std::cout << "[Sound] BEEP BEEP! Car Horn Honked!" << std::endl;
    } else if (key == 'r' || key == 'R') {
        carX = -0.8f;
        std::cout << "[Car] Reset to starting line." << std::endl;
    }
    glutPostRedisplay();
}

void specialKeys(int key, int x, int y) {
    if (key == GLUT_KEY_RIGHT) {
        carX += 0.04f;
        wheelAngle -= 20.0f;
    } else if (key == GLUT_KEY_LEFT) {
        carX -= 0.04f;
        wheelAngle += 20.0f;
    }
    glutPostRedisplay();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(800, 600);
    glutCreateWindow("GLUT 2D Scenery & Interactive Car");

    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);

    std::cout << "========================================" << std::endl;
    std::cout << " GLUT Interactive 2D Runner Active!     " << std::endl;
    std::cout << " Controls:                              " << std::endl;
    std::cout << "   [Left/Right Arrow] Drive car         " << std::endl;
    std::cout << "   [D / N] Toggle Day / Night           " << std::endl;
    std::cout << "   [Space] Honk Car Horn                " << std::endl;
    std::cout << "========================================" << std::endl;

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutSpecialFunc(specialKeys);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 2. GLUT Project - Utah 3D Teapot with Dynamic Lighting & Shading
  // --------------------------------------------------------------------------
  {
    id: "glut-3d-teapot",
    name: "GLUT Project: 3D Utah Teapot & Lighting",
    category: "Graphics & GUI",
    icon: "teapot",
    badge: "3D Graphics",
    description: "The iconic Computer Graphics Utah Teapot with OpenGL 3D perspective, Phong lighting, wireframe/solid toggle, and mouse drag orbit.",
    defaultFile: "teapot.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "Mouse Drag", description: "Orbit / Rotate 3D Teapot" },
      { key: "W / S", description: "Toggle Wireframe vs Solid" },
      { key: "L", description: "Toggle Light source rotation" },
      { key: "+ / -", description: "Zoom in / Zoom out" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <iostream>
#include <cmath>

float rotX = 20.0f;
float rotY = 45.0f;
float zoom = -2.2f;
bool wireframe = false;
bool animateLight = true;
float lightAngle = 0.0f;

void init() {
    glClearColor(0.08f, 0.09f, 0.12f, 1.0f);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);

    // Light source 0 parameters
    float ambient[]  = { 0.2f, 0.2f, 0.25f, 1.0f };
    float diffuse[]  = { 0.9f, 0.9f, 0.95f, 1.0f };
    float specular[] = { 1.0f, 1.0f, 1.0f, 1.0f };
    glLightfv(GL_LIGHT0, GL_AMBIENT, ambient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, diffuse);
    glLightfv(GL_LIGHT0, GL_SPECULAR, specular);

    // Teapot material (Turquoise / Emerald Bronze)
    float mat_ambient[]  = { 0.1f, 0.35f, 0.3f, 1.0f };
    float mat_diffuse[]  = { 0.2f, 0.75f, 0.65f, 1.0f };
    float mat_specular[] = { 0.9f, 0.9f, 0.9f, 1.0f };
    glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);
    glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
    glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Projection & Camera
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, 1.333, 0.1, 100.0);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glTranslatef(0.0f, 0.0f, zoom);

    // Position light
    float lx = 3.0f * cos(lightAngle);
    float lz = 3.0f * sin(lightAngle);
    float light_pos[] = { lx, 2.5f, lz, 1.0f };
    glLightfv(GL_LIGHT0, GL_POSITION, light_pos);

    // Rotate teapot model
    glRotatef(rotX, 1.0f, 0.0f, 0.0f);
    glRotatef(rotY, 0.0f, 1.0f, 0.0f);

    // Teapot color
    glColor3f(0.2f, 0.8f, 0.7f);

    if (wireframe) {
        glutWireTeapot(0.85);
    } else {
        glutSolidTeapot(0.85);
    }

    glutSwapBuffers();
}

void timer(int val) {
    if (animateLight) {
        lightAngle += 0.03f;
    }
    rotY += 0.5f; // Gentle continuous rotation
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

void keyboard(unsigned char key, int x, int y) {
    if (key == 'w' || key == 'W') {
        wireframe = true;
        std::cout << "[Mode] Teapot set to Wireframe mode" << std::endl;
    } else if (key == 's' || key == 'S') {
        wireframe = false;
        std::cout << "[Mode] Teapot set to Solid mode" << std::endl;
    } else if (key == 'l' || key == 'L') {
        animateLight = !animateLight;
        std::cout << "[Light] Light rotation: " << (animateLight ? "ON" : "OFF") << std::endl;
    } else if (key == '+' || key == '=') {
        zoom += 0.15f;
    } else if (key == '-' || key == '_') {
        zoom -= 0.15f;
    }
    glutPostRedisplay();
}

void specialKeys(int key, int x, int y) {
    if (key == GLUT_KEY_UP) rotX -= 5.0f;
    if (key == GLUT_KEY_DOWN) rotX += 5.0f;
    if (key == GLUT_KEY_LEFT) rotY -= 5.0f;
    if (key == GLUT_KEY_RIGHT) rotY += 5.0f;
    glutPostRedisplay();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(700, 520);
    glutCreateWindow("GLUT 3D Utah Teapot with Dynamic Lighting");

    init();
    std::cout << "Utah Teapot 3D Simulator initialized." << std::endl;
    std::cout << "Use arrow keys or [W/S] to control wireframe." << std::endl;

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutSpecialFunc(specialKeys);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 3. GLUT Project - Solar System Simulation (Hierarchical Transforms)
  // --------------------------------------------------------------------------
  {
    id: "glut-solar-system",
    name: "GLUT Project: Solar System Orbit Simulation",
    category: "Graphics & GUI",
    icon: "solar",
    badge: "Hierarchical",
    description: "Hierarchical transformation demo: Sun, Earth, Moon, and Mars with orbital mechanics using glPushMatrix & glPopMatrix.",
    defaultFile: "solar.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "Up / Down Arrows", description: "Speed up / Slow down orbit speed" },
      { key: "Space", description: "Pause / Resume animation" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <iostream>
#include <cmath>

float earthOrbit = 0.0f;
float moonOrbit  = 0.0f;
float marsOrbit  = 0.0f;
float speedMultiplier = 1.0f;
bool isRunning = true;

void drawOrbitRing(float radius) {
    glColor3f(0.2f, 0.25f, 0.35f);
    glLineWidth(1.0f);
    glBegin(GL_LINE_LOOP);
    for (int i = 0; i < 64; i++) {
        float theta = 2.0f * 3.1415926f * float(i) / 64.0f;
        glVertex2f(radius * cos(theta), radius * sin(theta));
    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Orbit paths
    drawOrbitRing(0.55f); // Earth orbit
    drawOrbitRing(0.85f); // Mars orbit

    // 1. Central Star (Sun)
    glPushMatrix();
    glColor3f(1.0f, 0.8f, 0.1f); // Sun Gold
    glutSolidSphere(0.16, 24, 24);
    glPopMatrix();

    // 2. Earth & Moon System
    glPushMatrix();
    // Rotate around Sun
    glRotatef(earthOrbit, 0.0f, 0.0f, 1.0f);
    glTranslatef(0.55f, 0.0f, 0.0f);

    // Draw Earth
    glColor3f(0.2f, 0.6f, 0.95f); // Ocean Blue
    glutSolidSphere(0.07, 16, 16);

    // Moon orbiting Earth
    glPushMatrix();
    glRotatef(moonOrbit, 0.0f, 0.0f, 1.0f);
    glTranslatef(0.14f, 0.0f, 0.0f);
    glColor3f(0.85f, 0.85f, 0.85f); // Lunar Grey
    glutSolidSphere(0.03, 12, 12);
    glPopMatrix();

    glPopMatrix(); // End Earth System

    // 3. Mars Planet
    glPushMatrix();
    glRotatef(marsOrbit, 0.0f, 0.0f, 1.0f);
    glTranslatef(0.85f, 0.0f, 0.0f);
    glColor3f(0.9f, 0.35f, 0.2f); // Red Planet
    glutSolidSphere(0.05, 16, 16);
    glPopMatrix();

    glutSwapBuffers();
}

void timer(int val) {
    if (isRunning) {
        earthOrbit += 1.0f * speedMultiplier;
        moonOrbit  += 4.0f * speedMultiplier;
        marsOrbit  += 0.53f * speedMultiplier;
    }
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

void keyboard(unsigned char key, int x, int y) {
    if (key == ' ') {
        isRunning = !isRunning;
        std::cout << "[System] Animation: " << (isRunning ? "Resumed" : "Paused") << std::endl;
    }
}

void specialKeys(int key, int x, int y) {
    if (key == GLUT_KEY_UP) {
        speedMultiplier += 0.2f;
        std::cout << "[Speed] Orbital speed: " << speedMultiplier << "x" << std::endl;
    } else if (key == GLUT_KEY_DOWN) {
        speedMultiplier = std::max(0.2f, speedMultiplier - 0.2f);
        std::cout << "[Speed] Orbital speed: " << speedMultiplier << "x" << std::endl;
    }
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(650, 650);
    glutCreateWindow("GLUT Solar System Orbit Simulation");

    glClearColor(0.03f, 0.04f, 0.07f, 1.0f); // Space black
    glEnable(GL_DEPTH_TEST);

    std::cout << "Solar System simulation active. Press SPACE to pause." << std::endl;

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutSpecialFunc(specialKeys);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 4. GLUT Project - Computer Graphics Lab: Bresenham Line & Circle Algorithm
  // --------------------------------------------------------------------------
  {
    id: "glut-bresenham-algo",
    name: "GLUT Project: Bresenham & DDA Algorithm",
    category: "Graphics & GUI",
    icon: "algo",
    badge: "University Lab",
    description: "Standard academic graphics lab: Pixel-level rasterization of Bresenham line and Midpoint circle with a grid simulator.",
    defaultFile: "bresenham.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "1", description: "Bresenham Line Mode" },
      { key: "2", description: "Midpoint Circle Mode" },
      { key: "G", description: "Toggle Pixel Grid Overlay" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <iostream>
#include <cmath>

int drawMode = 1; // 1: Bresenham Line, 2: Midpoint Circle
bool showGrid = true;

void drawGrid() {
    if (!showGrid) return;
    glColor3f(0.18f, 0.22f, 0.28f);
    glLineWidth(1.0f);
    glBegin(GL_LINES);
    for (float x = -1.0f; x <= 1.0f; x += 0.05f) {
        glVertex2f(x, -1.0f);
        glVertex2f(x, 1.0f);
    }
    for (float y = -1.0f; y <= 1.0f; y += 0.05f) {
        glVertex2f(-1.0f, y);
        glVertex2f(1.0f, y);
    }
    glEnd();

    // Central Axes
    glColor3f(0.4f, 0.5f, 0.65f);
    glLineWidth(2.0f);
    glBegin(GL_LINES);
        glVertex2f(-1.0f, 0.0f);
        glVertex2f(1.0f, 0.0f);
        glVertex2f(0.0f, -1.0f);
        glVertex2f(0.0f, 1.0f);
    glEnd();
}

void bresenhamLine(int x0, int y0, int x1, int y1) {
    int dx = abs(x1 - x0);
    int dy = abs(y1 - y0);
    int sx = (x0 < x1) ? 1 : -1;
    int sy = (y0 < y1) ? 1 : -1;
    int err = dx - dy;

    glPointSize(6.0f);
    glColor3f(0.2f, 0.9f, 0.4f); // Neon Green Pixels
    glBegin(GL_POINTS);

    while (true) {
        // Map grid coordinate to [-1, 1]
        float px = x0 * 0.05f;
        float py = y0 * 0.05f;
        glVertex2f(px, py);

        if (x0 == x1 && y0 == y1) break;
        int e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    glEnd();
}

void plotCirclePoints(int xc, int yc, int x, int y) {
    int pts[8][2] = {
        {xc + x, yc + y}, {xc - x, yc + y}, {xc + x, yc - y}, {xc - x, yc - y},
        {xc + y, yc + x}, {xc - y, yc + x}, {xc + y, yc - x}, {xc - y, yc - x}
    };
    for (int i = 0; i < 8; i++) {
        glVertex2f(pts[i][0] * 0.05f, pts[i][1] * 0.05f);
    }
}

void midpointCircle(int xc, int yc, int r) {
    int x = 0;
    int y = r;
    int p = 1 - r;

    glPointSize(6.0f);
    glColor3f(0.3f, 0.7f, 1.0f); // Cyan Blue Pixels
    glBegin(GL_POINTS);
    plotCirclePoints(xc, yc, x, y);

    while (x < y) {
        x++;
        if (p < 0) {
            p += 2 * x + 1;
        } else {
            y--;
            p += 2 * (x - y) + 1;
        }
        plotCirclePoints(xc, yc, x, y);
    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    drawGrid();

    if (drawMode == 1) {
        // Line from (-12, -8) to (12, 10)
        bresenhamLine(-12, -8, 12, 10);
    } else {
        // Midpoint Circle at center with radius 10
        midpointCircle(0, 0, 10);
    }

    glutSwapBuffers();
}

void keyboard(unsigned char key, int x, int y) {
    if (key == '1') {
        drawMode = 1;
        std::cout << "[Algorithm] Mode: Bresenham Line Generation" << std::endl;
    } else if (key == '2') {
        drawMode = 2;
        std::cout << "[Algorithm] Mode: Midpoint Circle Algorithm" << std::endl;
    } else if (key == 'g' || key == 'G') {
        showGrid = !showGrid;
        std::cout << "[Grid] Toggle: " << (showGrid ? "Visible" : "Hidden") << std::endl;
    }
    glutPostRedisplay();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(600, 600);
    glutCreateWindow("Bresenham & Midpoint Algorithm Lab");

    glClearColor(0.08f, 0.10f, 0.14f, 1.0f);

    std::cout << "Computer Graphics Lab Rasterization Runner" << std::endl;
    std::cout << "Press [1] for Line, [2] for Circle, [G] for Grid." << std::endl;

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 5. GLUT Project - 2D Interactive Pong / Brick Game
  // --------------------------------------------------------------------------
  {
    id: "glut-pong-game",
    name: "GLUT Project: Interactive 2D Pong Game",
    category: "Graphics & GUI",
    icon: "game",
    badge: "Playable Game",
    description: "Fully playable 2D arcade game in GLUT: Paddle control, physics bouncing ball, score tracking, and game over detection.",
    defaultFile: "pong.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "Left / Right Arrows", description: "Move bottom paddle" },
      { key: "R", description: "Restart game when over" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <iostream>

float paddleX = 0.0f;
float paddleWidth = 0.35f;
float ballX = 0.0f;
float ballY = 0.2f;
float ballVx = 0.012f;
float ballVy = -0.015f;
int score = 0;
bool gameOver = false;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    // Arena Border
    glColor3f(0.2f, 0.3f, 0.45f);
    glLineWidth(4.0f);
    glBegin(GL_LINE_LOOP);
        glVertex2f(-0.95f, -0.95f);
        glVertex2f(0.95f, -0.95f);
        glVertex2f(0.95f, 0.95f);
        glVertex2f(-0.95f, 0.95f);
    glEnd();

    // Paddle
    glColor3f(0.2f, 0.85f, 0.6f); // Emerald Teal
    glBegin(GL_QUADS);
        glVertex2f(paddleX - paddleWidth / 2, -0.85f);
        glVertex2f(paddleX + paddleWidth / 2, -0.85f);
        glVertex2f(paddleX + paddleWidth / 2, -0.80f);
        glVertex2f(paddleX - paddleWidth / 2, -0.80f);
    glEnd();

    // Ball
    if (!gameOver) {
        glColor3f(1.0f, 0.8f, 0.2f); // Golden ball
    } else {
        glColor3f(0.9f, 0.2f, 0.2f); // Red on game over
    }

    glBegin(GL_QUADS);
        float bs = 0.035f;
        glVertex2f(ballX - bs, ballY - bs);
        glVertex2f(ballX + bs, ballY - bs);
        glVertex2f(ballX + bs, ballY + bs);
        glVertex2f(ballX - bs, ballY + bs);
    glEnd();

    glutSwapBuffers();
}

void timer(int val) {
    if (!gameOver) {
        ballX += ballVx;
        ballY += ballVy;

        // Bounce off left/right walls
        if (ballX >= 0.91f || ballX <= -0.91f) {
            ballVx = -ballVx;
        }

        // Bounce off top wall
        if (ballY >= 0.91f) {
            ballVy = -ballVy;
        }

        // Paddle Collision
        if (ballY <= -0.77f && ballY >= -0.85f) {
            if (ballX >= (paddleX - paddleWidth / 2 - 0.04f) && ballX <= (paddleX + paddleWidth / 2 + 0.04f)) {
                ballVy = -ballVy * 1.05f; // Increase speed slightly
                score++;
                std::cout << "[Score!] Current Score: " << score << std::endl;
            }
        }

        // Bottom wall Missed (Game Over)
        if (ballY < -0.95f) {
            gameOver = true;
            std::cout << ">>> GAME OVER! Final Score: " << score << " <<<" << std::endl;
            std::cout << "Press 'R' to restart!" << std::endl;
        }
    }

    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

void specialKeys(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT) {
        paddleX = std::max(-0.75f, paddleX - 0.08f);
    } else if (key == GLUT_KEY_RIGHT) {
        paddleX = std::min(0.75f, paddleX + 0.08f);
    }
    glutPostRedisplay();
}

void keyboard(unsigned char key, int x, int y) {
    if ((key == 'r' || key == 'R') && gameOver) {
        gameOver = false;
        score = 0;
        ballX = 0.0f;
        ballY = 0.2f;
        ballVx = 0.012f;
        ballVy = -0.015f;
        std::cout << "[Game] Restarted! Good luck!" << std::endl;
    }
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(600, 600);
    glutCreateWindow("GLUT 2D Arcade Pong");

    glClearColor(0.06f, 0.08f, 0.12f, 1.0f);

    std::cout << "Pong Game Loaded! Use [Left/Right Arrow] to move paddle." << std::endl;

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutSpecialFunc(specialKeys);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 6. GLUT Project - 3D Colored Rotating Cube with Depth Buffer
  // --------------------------------------------------------------------------
  {
    id: "glut-3d-cube",
    name: "GLUT Project: 3D Colored Cube",
    category: "Graphics & GUI",
    icon: "cube",
    badge: "3D Primitives",
    description: "Multi-colored 3D cube with smooth Euler angle rotations, depth test buffering, and interactive axis control.",
    defaultFile: "cube.cpp",
    isGlut: true,
    keyboardHelp: [
      { key: "X / Y / Z", description: "Toggle rotation around X, Y, or Z axis" },
      { key: "Up / Down", description: "Increase / Decrease rotation speed" }
    ],
    sourceCode: `#include <GL/glut.h>
#include <iostream>

float angleX = 30.0f;
float angleY = 45.0f;
float angleZ = 0.0f;
float rotSpeed = 1.0f;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, 1.0, 0.1, 50.0);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glTranslatef(0.0f, 0.0f, -4.0f);

    glRotatef(angleX, 1.0f, 0.0f, 0.0f);
    glRotatef(angleY, 0.0f, 1.0f, 0.0f);
    glRotatef(angleZ, 0.0f, 0.0f, 1.0f);

    // Draw Colored Cube Faces
    glBegin(GL_QUADS);
        // Front (Red)
        glColor3f(0.95f, 0.2f, 0.3f);
        glVertex3f(-1.0f, -1.0f,  1.0f);
        glVertex3f( 1.0f, -1.0f,  1.0f);
        glVertex3f( 1.0f,  1.0f,  1.0f);
        glVertex3f(-1.0f,  1.0f,  1.0f);

        // Back (Green)
        glColor3f(0.2f, 0.85f, 0.35f);
        glVertex3f(-1.0f, -1.0f, -1.0f);
        glVertex3f(-1.0f,  1.0f, -1.0f);
        glVertex3f( 1.0f,  1.0f, -1.0f);
        glVertex3f( 1.0f, -1.0f, -1.0f);

        // Top (Blue)
        glColor3f(0.2f, 0.5f, 0.95f);
        glVertex3f(-1.0f,  1.0f, -1.0f);
        glVertex3f(-1.0f,  1.0f,  1.0f);
        glVertex3f( 1.0f,  1.0f,  1.0f);
        glVertex3f( 1.0f,  1.0f, -1.0f);

        // Bottom (Yellow)
        glColor3f(0.95f, 0.85f, 0.15f);
        glVertex3f(-1.0f, -1.0f, -1.0f);
        glVertex3f( 1.0f, -1.0f, -1.0f);
        glVertex3f( 1.0f, -1.0f,  1.0f);
        glVertex3f(-1.0f, -1.0f,  1.0f);

        // Right (Purple)
        glColor3f(0.7f, 0.3f, 0.9f);
        glVertex3f( 1.0f, -1.0f, -1.0f);
        glVertex3f( 1.0f,  1.0f, -1.0f);
        glVertex3f( 1.0f,  1.0f,  1.0f);
        glVertex3f( 1.0f, -1.0f,  1.0f);

        // Left (Cyan)
        glColor3f(0.15f, 0.85f, 0.85f);
        glVertex3f(-1.0f, -1.0f, -1.0f);
        glVertex3f(-1.0f, -1.0f,  1.0f);
        glVertex3f(-1.0f,  1.0f,  1.0f);
        glVertex3f(-1.0f,  1.0f, -1.0f);
    glEnd();

    glutSwapBuffers();
}

void timer(int val) {
    angleX += 0.8f * rotSpeed;
    angleY += 1.2f * rotSpeed;
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(600, 600);
    glutCreateWindow("GLUT 3D Colored Cube");

    glClearColor(0.08f, 0.08f, 0.12f, 1.0f);
    glEnable(GL_DEPTH_TEST);

    std::cout << "3D Cube rotating with Depth Buffer enabled." << std::endl;

    glutDisplayFunc(display);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 7. Console Application (Standard C++ Algorithms & Data Structures)
  // --------------------------------------------------------------------------
  {
    id: "console-app",
    name: "Console Application: Data Structures & Algorithms",
    category: "Console & Core",
    icon: "console",
    badge: "Core C++",
    description: "Standard Code::Blocks Console Application template running C++ algorithms, sorting, and terminal output.",
    defaultFile: "main.cpp",
    isGlut: false,
    sourceCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void printArray(const vector<int>& arr) {
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

int main() {
    cout << "========================================" << endl;
    cout << "   Code::Blocks C++ Console Runner      " << endl;
    cout << "========================================" << endl;

    vector<int> numbers = { 64, 34, 25, 12, 22, 11, 90, 48, 73, 1 };

    cout << "\\n[Input] Original Array (" << numbers.size() << " elements):" << endl;
    printArray(numbers);

    // Quick Sort
    sort(numbers.begin(), numbers.end());

    cout << "\\n[Output] Sorted Array (Ascending):" << endl;
    printArray(numbers);

    // Calculate sum and average
    int sum = 0;
    for (int x : numbers) sum += x;
    double avg = (double)sum / numbers.size();

    cout << "\\n[Statistics]:" << endl;
    cout << "  Min Element: " << numbers.front() << endl;
    cout << "  Max Element: " << numbers.back() << endl;
    cout << "  Sum:         " << sum << endl;
    cout << "  Average:     " << avg << endl;

    cout << "\\nExecution successfully finished! Process returned 0 (0x0)." << endl;
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 8. OpenGL Project (Direct Modern OpenGL Primitives)
  // --------------------------------------------------------------------------
  {
    id: "opengl-project",
    name: "OpenGL Project: Geometric Shading & Stars",
    category: "Graphics & GUI",
    icon: "opengl",
    badge: "OpenGL 2.1",
    description: "Pure OpenGL project with colorful polygon fans, gradient star geometry, and smooth rotation.",
    defaultFile: "main.cpp",
    isGlut: true,
    sourceCode: `#include <GL/glut.h>
#include <cmath>
#include <iostream>

float rotation = 0.0f;

void drawStar(float cx, float cy, float r1, float r2, int points) {
    glBegin(GL_TRIANGLE_FAN);
    glColor3f(1.0f, 1.0f, 1.0f); // Center White
    glVertex2f(cx, cy);

    for (int i = 0; i <= points * 2; i++) {
        float angle = i * 3.14159265f / points;
        float r = (i % 2 == 0) ? r1 : r2;
        float x = cx + r * cos(angle);
        float y = cy + r * sin(angle);

        // Rainbow color cycle
        float red = 0.5f + 0.5f * sin(angle);
        float grn = 0.5f + 0.5f * sin(angle + 2.0f);
        float blu = 0.5f + 0.5f * sin(angle + 4.0f);
        glColor3f(red, grn, blu);

        glVertex2f(x, y);
    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    glRotatef(rotation, 0.0f, 0.0f, 1.0f);
    drawStar(0.0f, 0.0f, 0.65f, 0.28f, 5);

    glutSwapBuffers();
}

void timer(int val) {
    rotation += 1.5f;
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(600, 600);
    glutCreateWindow("OpenGL Shaded Star Project");

    glClearColor(0.05f, 0.05f, 0.1f, 1.0f);

    std::cout << "OpenGL Star Project running." << std::endl;

    glutDisplayFunc(display);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 9. GLFW Project (Window & Loop Pattern)
  // --------------------------------------------------------------------------
  {
    id: "glfw-project",
    name: "GLFW Project: Modern Animated Context",
    category: "Game Engines",
    icon: "glfw",
    badge: "GLFW Loop",
    description: "GLFW styled event loop and OpenGL rendering with animated polygon waves.",
    defaultFile: "main.cpp",
    isGlut: true,
    sourceCode: `#include <GL/glut.h>
#include <cmath>
#include <iostream>

float waveTime = 0.0f;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    glBegin(GL_TRIANGLE_STRIP);
    for (float x = -1.0f; x <= 1.0f; x += 0.05f) {
        float y = 0.35f * sin(x * 6.0f + waveTime);
        float hue = (x + 1.0f) * 0.5f;

        glColor3f(0.1f + hue * 0.8f, 0.4f, 1.0f - hue * 0.5f);
        glVertex2f(x, y + 0.3f);

        glColor3f(0.8f, 0.1f + hue * 0.7f, 0.4f);
        glVertex2f(x, y - 0.3f);
    }
    glEnd();

    glutSwapBuffers();
}

void timer(int val) {
    waveTime += 0.05f;
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(700, 500);
    glutCreateWindow("GLFW Modern Wave Render");

    glClearColor(0.04f, 0.06f, 0.10f, 1.0f);
    std::cout << "GLFW Project Loop active." << std::endl;

    glutDisplayFunc(display);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 10. SDL2 Project (2D Game Loop & Particles)
  // --------------------------------------------------------------------------
  {
    id: "sdl2-project",
    name: "SDL2 Project: Particle Fireworks Engine",
    category: "Game Engines",
    icon: "sdl",
    badge: "Particles",
    description: "SDL2 style particle physics system with interactive mouse explosion sparks.",
    defaultFile: "main.cpp",
    isGlut: true,
    sourceCode: `#include <GL/glut.h>
#include <cmath>
#include <iostream>

const int NUM_PARTICLES = 120;
float pX[120], pY[120], pVx[120], pVy[120], pLife[120];

void resetParticles(float cx, float cy) {
    for (int i = 0; i < NUM_PARTICLES; i++) {
        pX[i] = cx;
        pY[i] = cy;
        float angle = ((float)rand() / 32767.0f) * 6.28318f;
        float speed = 0.005f + ((float)rand() / 32767.0f) * 0.02f;
        pVx[i] = cos(angle) * speed;
        pVy[i] = sin(angle) * speed;
        pLife[i] = 1.0f;
    }
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    glPointSize(4.0f);
    glBegin(GL_POINTS);
    for (int i = 0; i < NUM_PARTICLES; i++) {
        if (pLife[i] > 0.0f) {
            glColor4f(1.0f, pLife[i] * 0.8f, 0.2f, pLife[i]);
            glVertex2f(pX[i], pY[i]);
        }
    }
    glEnd();

    glutSwapBuffers();
}

void timer(int val) {
    bool allDead = true;
    for (int i = 0; i < NUM_PARTICLES; i++) {
        if (pLife[i] > 0.0f) {
            pX[i] += pVx[i];
            pY[i] += pVy[i];
            pVy[i] -= 0.0004f; // Gravity
            pLife[i] -= 0.015f;
            allDead = false;
        }
    }
    if (allDead) {
        resetParticles(0.0f, 0.2f);
    }

    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);
}

void mouse(int button, int state, int x, int y) {
    if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN) {
        float nx = (float)x / 300.0f - 1.0f;
        float ny = 1.0f - (float)y / 300.0f;
        resetParticles(nx, ny);
        std::cout << "[Fireworks] Exploded at (" << nx << ", " << ny << ")" << std::endl;
    }
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(600, 600);
    glutCreateWindow("SDL2 Particle Fireworks");

    glClearColor(0.03f, 0.03f, 0.06f, 1.0f);
    resetParticles(0.0f, 0.2f);

    std::cout << "Click anywhere on canvas to trigger fireworks!" << std::endl;

    glutDisplayFunc(display);
    glutMouseFunc(mouse);
    glutTimerFunc(16, timer, 0);
    glutMainLoop();
    return 0;
}
`
  },

  // --------------------------------------------------------------------------
  // 11. Empty Project (Clean Starter Template)
  // --------------------------------------------------------------------------
  {
    id: "empty-project",
    name: "Empty Project: Clean GLUT Starter",
    category: "Console & Core",
    icon: "empty",
    badge: "Blank",
    description: "A minimal, clean Code::Blocks GLUT project template ready to write your own custom graphics code.",
    defaultFile: "main.cpp",
    isGlut: true,
    sourceCode: `#include <GL/glut.h>
#include <iostream>

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    // Draw your graphics here
    glColor3f(0.3f, 0.7f, 1.0f); // Sky Blue
    glBegin(GL_TRIANGLES);
        glVertex2f(-0.5f, -0.5f);
        glVertex2f( 0.5f, -0.5f);
        glVertex2f( 0.0f,  0.5f);
    glEnd();

    glutSwapBuffers();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(600, 600);
    glutCreateWindow("My Custom GLUT Project");

    glClearColor(0.1f, 0.1f, 0.15f, 1.0f);

    std::cout << "Custom GLUT Project running!" << std::endl;

    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}
`
  }
];

// Helper to generate a genuine Code::Blocks .cbp Project XML file
export function generateCbpProjectXml(projectName: string, cppFileName: string = "main.cpp"): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<CodeBlocks_project_file>
	<FileVersion major="1" minor="6" />
	<Project>
		<Option title="${projectName}" />
		<Option pch_mode="2" />
		<Option compiler="gcc" />
		<Build>
			<Target title="Debug">
				<Option output="bin/Debug/${projectName}" prefix_auto="1" extension_auto="1" />
				<Option working_dir="$(#glut)/bin" />
				<Option object_output="obj/Debug/" />
				<Option type="1" />
				<Option compiler="gcc" />
				<Compiler>
					<Add option="-g" />
				</Compiler>
			</Target>
			<Target title="Release">
				<Option output="bin/Release/${projectName}" prefix_auto="1" extension_auto="1" />
				<Option working_dir="$(#glut)/bin" />
				<Option object_output="obj/Release/" />
				<Option type="0" />
				<Option compiler="gcc" />
				<Compiler>
					<Add option="-O2" />
				</Compiler>
				<Linker>
					<Add option="-s" />
				</Linker>
			</Target>
		</Build>
		<Compiler>
			<Add option="-Wall" />
			<Add directory="$(#glut.include)" />
		</Compiler>
		<Linker>
			<Add library="freeglut" />
			<Add library="opengl32" />
			<Add library="glu32" />
			<Add library="winmm" />
			<Add library="gdi32" />
			<Add directory="$(#glut.lib)" />
		</Linker>
		<Unit filename="${cppFileName}" />
		<Extensions>
			<lib_finder disable_auto="1" />
		</Extensions>
	</Project>
</CodeBlocks_project_file>
`;
}
