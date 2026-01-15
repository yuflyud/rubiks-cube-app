# Feature 3: Rubik's Cube Assembly Visualization - Technical Design

## Design Overview

| Property | Value |
|----------|-------|
| Feature ID | F-003 |
| Feature Name | Rubik's Cube Assembly Visualization |
| Design Status | Draft |
| Last Updated | 2026-01-10 |

---

## Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────┐
│            Assembly Visualization Module                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Visualization   │─────▶│  Animation       │        │
│  │  Controller      │      │  Engine          │        │
│  └──────────────────┘      └──────────────────┘        │
│         │                           │                    │
│         │                           ▼                    │
│         │                  ┌──────────────────┐        │
│         ├─────────────────▶│  3D Renderer     │        │
│         │                  └──────────────────┘        │
│         │                           │                    │
│         ▼                           ▼                    │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Navigation      │      │  Cube Display    │        │
│  │  Controller      │      │  Component       │        │
│  └──────────────────┘      └──────────────────┘        │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
          ▼
    User Controls
    (Next/Previous/Play)
```

### Technology Stack

- **3D Rendering**: Three.js (for 3D cube visualization)
- **Animation**: GSAP (GreenSock Animation Platform) or Three.js built-in
- **State Management**: Custom state machine
- **UI Framework**: Vanilla TypeScript with CSS
- **Testing**: Vitest + Testing Library

---

## Data Models

### Core Data Structures

```typescript
/**
 * Import types from previous features
 */
import { CubeState, Face, Color } from '@/features/configuration/types';
import { Solution, AssemblyIncrement, MoveNotation } from '@/features/assembly/types';

/**
 * Visualization state
 */
export interface VisualizationState {
  solution: Solution;
  currentStep: number;              // 0-based (0 = initial state)
  totalSteps: number;               // Total number of moves
  currentCubeState: CubeState;      // Current cube state being displayed
  isAnimating: boolean;             // Animation in progress
  isPlaying: boolean;               // Auto-play mode active
  playbackSpeed: PlaybackSpeed;     // Current speed setting
  viewAngle: ViewAngle;             // Camera angle
}

/**
 * Playback speed options
 * FR-2.2.1, FR-2.2.2
 */
export enum PlaybackSpeed {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast'
}

/**
 * Camera view angles
 */
export interface ViewAngle {
  theta: number;    // Horizontal rotation (0-360°)
  phi: number;      // Vertical rotation (0-180°)
  zoom: number;     // Zoom level (0.5-2.0)
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;           // Animation duration in ms
  easing: EasingFunction;     // Easing function
  highlightMoving: boolean;   // Highlight moving pieces
  showArrows: boolean;        // Show direction arrows
}

export type EasingFunction =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

/**
 * Playback state
 * FR-3.4.1 - FR-3.4.5
 */
export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  autoAdvanceDelay: number;   // ms between auto-steps
  repeatMode: boolean;
}

/**
 * Step navigation info
 * FR-3.3.1 - FR-3.3.4
 */
export interface StepInfo {
  current: number;
  total: number;
  percentComplete: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentMove: AssemblyIncrement | null;
}
```

### 3D Model Structures

```typescript
/**
 * 3D cube piece representation
 */
export interface CubePiece {
  id: string;                   // Unique identifier
  type: PieceType;              // Center, edge, or corner
  position: Vector3;            // 3D position
  rotation: Euler;              // 3D rotation
  facelets: FaceletMesh[];      // Visual facelet meshes
  mesh: THREE.Mesh;             // Three.js mesh object
}

export enum PieceType {
  CENTER = 'CENTER',
  EDGE = 'EDGE',
  CORNER = 'CORNER'
}

export interface FaceletMesh {
  face: Face;
  color: Color;
  mesh: THREE.Mesh;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Euler {
  x: number;  // Rotation around X axis
  y: number;  // Rotation around Y axis
  z: number;  // Rotation around Z axis
}

/**
 * Animation frame data
 */
export interface AnimationFrame {
  timestamp: number;
  pieces: Map<string, {
    position: Vector3;
    rotation: Euler;
  }>;
  progress: number;  // 0.0 to 1.0
}
```

---

## Component Architecture

### Component Hierarchy

```
VisualizationContainer
├── VisualizationHeader
│   └── StepIndicator
│       ├── StepCounter ("Step X of Y")
│       └── ProgressBar
├── CubeRenderer3D
│   ├── Scene (Three.js)
│   ├── Camera
│   ├── Lights
│   ├── CubeMesh (26 pieces)
│   └── Helpers (arrows, highlights)
├── MoveDisplay
│   ├── MoveNotation
│   └── MoveDescription
├── NavigationControls
│   ├── PreviousButton
│   ├── NextButton
│   └── StepJumper
├── PlaybackControls
│   ├── PlayPauseButton
│   ├── ResetButton
│   └── SpeedSelector
└── CompletionModal
    ├── SuccessMessage
    ├── Statistics
    └── ActionButtons
```

### Key Components

#### 1. VisualizationContainer

**Responsibility**: Main orchestrator for visualization feature

```typescript
export interface VisualizationContainerProps {
  solution: Solution;
  onComplete?: () => void;
  onRestart?: () => void;
  onNewCube?: () => void;
}

export class VisualizationContainer {
  private state: VisualizationState;
  private renderer: CubeRenderer3D;
  private navigator: NavigationController;
  private animator: AnimationEngine;

  constructor(props: VisualizationContainerProps) {
    this.state = this.initializeState(props.solution);
    this.renderer = new CubeRenderer3D();
    this.navigator = new NavigationController();
    this.animator = new AnimationEngine();
  }

  /**
   * Advance to next step
   * FR-3.1.1, FR-3.1.2
   */
  public async nextStep(): Promise<void>;

  /**
   * Return to previous step
   * FR-3.2.1, FR-3.2.2
   */
  public async previousStep(): Promise<void>;

  /**
   * Jump to specific step
   * FR-3.3.5
   */
  public async jumpToStep(stepNumber: number): Promise<void>;

  /**
   * Start auto-play
   * FR-3.4.1, FR-3.4.3
   */
  public play(): void;

  /**
   * Pause auto-play
   * FR-3.4.2
   */
  public pause(): void;

  /**
   * Reset to initial state
   * FR-3.4.5
   */
  public reset(): void;

  /**
   * Change playback speed
   * FR-2.2.1, FR-2.2.2
   */
  public setSpeed(speed: PlaybackSpeed): void;

  /**
   * Get current step information
   * FR-3.3.1, FR-3.3.2
   */
  public getStepInfo(): StepInfo;
}
```

**Unit Test Coverage**:
- ✓ Initialize with solution
- ✓ Advance to next step
- ✓ Prevent advancing beyond last step
- ✓ Return to previous step
- ✓ Prevent going back before first step
- ✓ Jump to specific step
- ✓ Start auto-play
- ✓ Pause auto-play
- ✓ Reset to initial state
- ✓ Change playback speed
- ✓ Get step info correctly
- ✓ Handle empty solution (already solved)

#### 2. CubeRenderer3D

**Responsibility**: Render 3D cube using Three.js

```typescript
export interface CubeRenderer3DProps {
  container: HTMLElement;
  initialState: CubeState;
  enableRotation: boolean;
}

export class CubeRenderer3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: CubeMesh;
  private controls: THREE.OrbitControls;
  private animationId: number | null;

  constructor(props: CubeRenderer3DProps) {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLighting();
    this.cube = new CubeMesh(props.initialState);
    this.initControls(props.enableRotation);
    this.startRenderLoop();
  }

  /**
   * Renders the 3D scene
   * FR-1.1.1, FR-1.1.2, FR-1.1.4
   */
  public render(): void;

  /**
   * Updates cube state
   * FR-1.1.4
   */
  public updateCubeState(cubeState: CubeState): void;

  /**
   * Animates a move
   * FR-2.1.1, FR-2.1.2, FR-2.1.3
   */
  public async animateMove(
    move: MoveNotation,
    config: AnimationConfig
  ): Promise<void>;

  /**
   * Highlights pieces that will move
   * FR-2.3.1, FR-2.3.2
   */
  public highlightMovingPieces(face: Face): void;

  /**
   * Shows rotation direction arrows
   * FR-2.3.3
   */
  public showDirectionArrows(face: Face, direction: RotationDirection): void;

  /**
   * Removes highlights and arrows
   */
  public clearHighlights(): void;

  /**
   * Adjusts camera angle
   */
  public setCameraAngle(angle: ViewAngle): void;

  /**
   * Cleanup and dispose resources
   */
  public dispose(): void;

  /**
   * Initialize Three.js scene
   */
  private initScene(): void;

  /**
   * Initialize camera with proper positioning
   */
  private initCamera(): void;

  /**
   * Initialize WebGL renderer
   */
  private initRenderer(): void;

  /**
   * Add lighting to scene
   * NFR-1.4
   */
  private initLighting(): void;

  /**
   * Setup orbit controls for user interaction
   */
  private initControls(enable: boolean): void;

  /**
   * Start render loop
   */
  private startRenderLoop(): void;
}

/**
 * Cube mesh with 26 pieces (no center piece)
 */
export class CubeMesh {
  private pieces: CubePiece[];
  private group: THREE.Group;

  constructor(cubeState: CubeState) {
    this.pieces = this.createPieces(cubeState);
    this.group = new THREE.Group();
    this.addPiecesToGroup();
  }

  /**
   * Creates 26 cube pieces
   * 8 corners + 12 edges + 6 centers = 26
   */
  private createPieces(cubeState: CubeState): CubePiece[];

  /**
   * Updates piece colors based on cube state
   * FR-1.1.4
   */
  public updateColors(cubeState: CubeState): void;

  /**
   * Gets pieces on a specific face
   */
  public getPiecesOnFace(face: Face): CubePiece[];

  /**
   * Gets the Three.js group
   */
  public getGroup(): THREE.Group;
}
```

**Unit Test Coverage**:
- ✓ Initialize scene correctly
- ✓ Initialize camera with correct position
- ✓ Initialize renderer
- ✓ Create 26 cube pieces
- ✓ Update cube colors
- ✓ Highlight moving pieces
- ✓ Show direction arrows
- ✓ Clear highlights
- ✓ Animate move correctly
- ✓ Update camera angle
- ✓ Dispose resources properly
- ✓ Handle resize events

#### 3. AnimationEngine

**Responsibility**: Handle smooth animations of cube moves

```typescript
export class AnimationEngine {
  private isAnimating: boolean;
  private currentAnimation: Animation | null;

  /**
   * Animates a cube rotation
   * FR-2.1.1, FR-2.1.2, FR-2.1.3, FR-2.1.4, FR-2.1.5
   */
  public async animateRotation(
    pieces: CubePiece[],
    face: Face,
    direction: RotationDirection,
    degrees: RotationDegrees,
    config: AnimationConfig
  ): Promise<void>;

  /**
   * Cancels current animation
   */
  public cancel(): void;

  /**
   * Checks if animation is in progress
   */
  public isPlaying(): boolean;

  /**
   * Calculates rotation axis for a face
   */
  private getRotationAxis(face: Face): Vector3;

  /**
   * Calculates rotation angle with direction
   */
  private getRotationAngle(
    direction: RotationDirection,
    degrees: RotationDegrees
  ): number;

  /**
   * Applies easing function to animation progress
   */
  private applyEasing(progress: number, easing: EasingFunction): number;

  /**
   * Generates animation frames
   */
  private generateFrames(
    pieces: CubePiece[],
    axis: Vector3,
    angle: number,
    duration: number,
    easing: EasingFunction
  ): AnimationFrame[];
}

/**
 * Animation timing constants
 * FR-2.2.1, FR-2.2.2
 */
export const ANIMATION_DURATIONS: Record<PlaybackSpeed, number> = {
  [PlaybackSpeed.SLOW]: 1500,
  [PlaybackSpeed.NORMAL]: 750,
  [PlaybackSpeed.FAST]: 300
};

export const AUTO_ADVANCE_DELAYS: Record<PlaybackSpeed, number> = {
  [PlaybackSpeed.SLOW]: 3000,
  [PlaybackSpeed.NORMAL]: 1500,
  [PlaybackSpeed.FAST]: 600
};
```

**Unit Test Coverage**:
- ✓ Animate 90° rotation
- ✓ Animate 180° rotation
- ✓ Animate clockwise rotation
- ✓ Animate counter-clockwise rotation
- ✓ Apply easing functions correctly
- ✓ Cancel animation mid-flight
- ✓ Track animation state
- ✓ Generate correct number of frames
- ✓ Respect animation duration
- ✓ Complete animation callback

#### 4. NavigationController

**Responsibility**: Manage step navigation and playback

```typescript
export class NavigationController {
  private state: PlaybackState;
  private autoAdvanceTimer: number | null;

  /**
   * Navigate to next step
   * FR-3.1.1, FR-3.1.2, FR-3.1.3
   */
  public next(state: VisualizationState): boolean;

  /**
   * Navigate to previous step
   * FR-3.2.1, FR-3.2.2, FR-3.2.3, FR-3.2.4
   */
  public previous(state: VisualizationState): boolean;

  /**
   * Jump to specific step
   * FR-3.3.5
   */
  public jumpTo(stepNumber: number, state: VisualizationState): boolean;

  /**
   * Start auto-play
   * FR-3.4.1, FR-3.4.3, FR-3.4.4
   */
  public startAutoPlay(
    state: VisualizationState,
    onStep: () => Promise<void>
  ): void;

  /**
   * Stop auto-play
   * FR-3.4.2
   */
  public stopAutoPlay(): void;

  /**
   * Reset to initial step
   * FR-3.4.5
   */
  public reset(state: VisualizationState): void;

  /**
   * Check if can advance
   * FR-3.1.3
   */
  public canGoNext(state: VisualizationState): boolean;

  /**
   * Check if can go back
   * FR-3.2.4
   */
  public canGoPrevious(state: VisualizationState): boolean;

  /**
   * Get step information
   * FR-3.3.1, FR-3.3.2, FR-3.3.3
   */
  public getStepInfo(state: VisualizationState): StepInfo;
}
```

**Unit Test Coverage**:
- ✓ Navigate to next step
- ✓ Prevent navigating beyond last step
- ✓ Navigate to previous step
- ✓ Prevent navigating before first step
- ✓ Jump to valid step
- ✓ Prevent jumping to invalid step
- ✓ Start auto-play
- ✓ Stop auto-play
- ✓ Auto-advance after delay
- ✓ Reset to initial state
- ✓ Calculate step info correctly
- ✓ Determine navigation availability

#### 5. UI Components

##### StepIndicator Component

```typescript
export interface StepIndicatorProps {
  current: number;
  total: number;
}

export class StepIndicator {
  /**
   * Renders step counter and progress bar
   * FR-3.3.1, FR-3.3.2, FR-3.3.3, FR-3.3.4
   */
  public render(): HTMLElement;

  /**
   * Formats step text as "Step X of Y"
   * FR-3.3.3
   */
  private formatStepText(current: number, total: number): string;

  /**
   * Renders visual progress bar
   * FR-3.3.4
   */
  private renderProgressBar(percent: number): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Display correct step number
- ✓ Display correct total steps
- ✓ Format text correctly
- ✓ Calculate progress percentage
- ✓ Render progress bar with correct width
- ✓ Update when step changes

##### MoveDisplay Component

```typescript
export interface MoveDisplayProps {
  move: AssemblyIncrement | null;
}

export class MoveDisplay {
  /**
   * Displays current move information
   * FR-1.2.1, FR-1.2.3, FR-1.2.4
   */
  public render(): HTMLElement;

  /**
   * Shows move notation prominently
   * FR-1.2.3
   */
  private renderNotation(notation: MoveNotation): HTMLElement;

  /**
   * Shows human-readable description
   * FR-1.2.4
   */
  private renderDescription(description: string): HTMLElement;

  /**
   * Highlights the face being moved
   * FR-1.2.2
   */
  private highlightFace(face: Face): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Display move notation
- ✓ Display move description
- ✓ Highlight target face
- ✓ Handle null move (initial state)
- ✓ Update when move changes

##### NavigationControls Component

```typescript
export interface NavigationControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export class NavigationControls {
  /**
   * Renders navigation buttons
   * FR-3.1.1, FR-3.2.1
   */
  public render(): HTMLElement;

  /**
   * Next button with keyboard support
   * FR-3.1.1, FR-3.1.3, FR-3.1.4
   */
  private renderNextButton(): HTMLElement;

  /**
   * Previous button with keyboard support
   * FR-3.2.1, FR-3.2.4, FR-3.2.5
   */
  private renderPreviousButton(): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Render next button
- ✓ Render previous button
- ✓ Disable next when at end
- ✓ Disable previous when at start
- ✓ Handle button clicks
- ✓ Handle keyboard shortcuts
- ✓ Apply correct styles

##### PlaybackControls Component

```typescript
export interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

export class PlaybackControls {
  /**
   * Renders playback controls
   * FR-3.4.1 - FR-3.4.5
   */
  public render(): HTMLElement;

  /**
   * Play/Pause toggle button
   * FR-3.4.1, FR-3.4.2
   */
  private renderPlayPauseButton(): HTMLElement;

  /**
   * Reset button
   * FR-3.4.5
   */
  private renderResetButton(): HTMLElement;

  /**
   * Speed selector dropdown
   * FR-2.2.1, FR-2.2.2, FR-3.4.4
   */
  private renderSpeedSelector(): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Render play button when paused
- ✓ Render pause button when playing
- ✓ Render reset button
- ✓ Render speed selector
- ✓ Handle play/pause toggle
- ✓ Handle reset
- ✓ Handle speed change
- ✓ Display current speed

##### CompletionModal Component

```typescript
export interface CompletionModalProps {
  totalMoves: number;
  totalTime?: number;
  onRestart: () => void;
  onNewCube: () => void;
  onReview: () => void;
}

export class CompletionModal {
  /**
   * Shows completion notification
   * FR-4.1.1, FR-4.1.2, FR-4.1.3
   */
  public show(): void;

  /**
   * Hides modal
   */
  public hide(): void;

  /**
   * Renders success message
   * FR-4.1.1, FR-4.1.2
   */
  private renderSuccessMessage(): HTMLElement;

  /**
   * Shows celebratory animation
   * FR-4.1.4
   */
  private showCelebration(): void;

  /**
   * Displays statistics
   * FR-4.1.5
   */
  private renderStatistics(): HTMLElement;

  /**
   * Renders action buttons
   * FR-4.2.1, FR-4.2.2, FR-4.2.3
   */
  private renderActions(): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Show modal
- ✓ Hide modal
- ✓ Display success message
- ✓ Display statistics
- ✓ Show celebration effect
- ✓ Render action buttons
- ✓ Handle restart action
- ✓ Handle new cube action
- ✓ Handle review action

---

## Visual Design

### Layout Structure

```html
<div class="visualization-container">
  <!-- Header -->
  <header class="visualization-header">
    <h1>Solving Your Cube</h1>
    <div class="step-indicator">
      <span class="step-text">Step 5 of 23</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 21.7%"></div>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="visualization-main">
    <!-- 3D Cube Display -->
    <div class="cube-container">
      <canvas id="cube-renderer"></canvas>
    </div>

    <!-- Current Move Info -->
    <div class="move-display">
      <div class="move-notation">R'</div>
      <div class="move-description">
        Rotate right face counter-clockwise 90°
      </div>
    </div>
  </main>

  <!-- Controls -->
  <footer class="visualization-controls">
    <!-- Navigation -->
    <div class="navigation-controls">
      <button class="btn-previous" aria-label="Previous step">
        <span class="icon">←</span>
      </button>
      <div class="step-counter">Step 5 of 23</div>
      <button class="btn-next" aria-label="Next step">
        <span class="icon">→</span>
      </button>
    </div>

    <!-- Playback -->
    <div class="playback-controls">
      <button class="btn-reset" aria-label="Reset">⏮</button>
      <button class="btn-play-pause" aria-label="Play">▶</button>
      <select class="speed-selector">
        <option value="slow">Slow</option>
        <option value="normal" selected>Normal</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  </footer>
</div>
```

### Color Palette

```typescript
/**
 * Cube colors (from Feature 1)
 */
export const CUBE_COLORS = {
  WHITE: '#FFFFFF',
  YELLOW: '#FFD500',
  GREEN: '#009B48',
  BLUE: '#0046AD',
  ORANGE: '#FF5800',
  RED: '#B71234'
};

/**
 * UI colors
 */
export const UI_COLORS = {
  BACKGROUND: '#1A1A1A',
  SURFACE: '#2D2D2D',
  PRIMARY: '#2196F3',
  SUCCESS: '#4CAF50',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B0B0B0',
  BORDER: '#404040',
  HIGHLIGHT: '#FFC107',
  DISABLED: '#666666'
};

/**
 * Animation colors
 */
export const ANIMATION_COLORS = {
  HIGHLIGHT: 'rgba(255, 193, 7, 0.5)',  // Semi-transparent yellow
  ARROW: '#FFC107',
  GLOW: 'rgba(33, 150, 243, 0.8)'
};
```

### 3D Rendering Configuration

```typescript
/**
 * Three.js scene configuration
 */
export const SCENE_CONFIG = {
  CAMERA: {
    FOV: 45,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: { x: 4, y: 4, z: 4 }
  },
  LIGHTING: {
    AMBIENT: {
      color: 0xffffff,
      intensity: 0.6
    },
    DIRECTIONAL: [
      { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 5, z: 5 } },
      { color: 0xffffff, intensity: 0.4, position: { x: -5, y: 5, z: -5 } }
    ]
  },
  CUBE: {
    SIZE: 3,                    // 3x3 cube
    PIECE_SIZE: 0.95,           // Slightly smaller than 1 for gaps
    GAP: 0.05,                  // Gap between pieces
    ROUNDED_CORNERS: 0.1,       // Corner radius
    STICKER_DEPTH: 0.01         // Facelet thickness
  }
};
```

### Responsive Design

```typescript
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024
};

/**
 * Responsive canvas sizing
 */
export function getCanvasSize(screenWidth: number): { width: number; height: number } {
  if (screenWidth < BREAKPOINTS.TABLET) {
    return { width: screenWidth - 32, height: screenWidth - 32 };
  } else if (screenWidth < BREAKPOINTS.DESKTOP) {
    return { width: 600, height: 600 };
  } else {
    return { width: 800, height: 800 };
  }
}
```

---

## Interaction Patterns

### Keyboard Shortcuts

```typescript
/**
 * Keyboard navigation
 * FR-3.1.4, FR-3.2.5
 */
export const KEYBOARD_SHORTCUTS = {
  NEXT: ['ArrowRight', 'Space'],
  PREVIOUS: ['ArrowLeft'],
  PLAY_PAUSE: ['KeyP'],
  RESET: ['KeyR'],
  SPEED_SLOW: ['Digit1'],
  SPEED_NORMAL: ['Digit2'],
  SPEED_FAST: ['Digit3']
};

export class KeyboardHandler {
  private shortcuts: Map<string, () => void>;

  constructor(controller: VisualizationContainer) {
    this.setupShortcuts(controller);
    this.attachListeners();
  }

  private setupShortcuts(controller: VisualizationContainer): void;
  private attachListeners(): void;
  private handleKeyPress(event: KeyboardEvent): void;
  public destroy(): void;
}
```

**Unit Test Coverage**:
- ✓ Handle next step shortcuts
- ✓ Handle previous step shortcuts
- ✓ Handle play/pause shortcut
- ✓ Handle reset shortcut
- ✓ Handle speed shortcuts
- ✓ Prevent default browser behavior
- ✓ Remove listeners on destroy

### Touch Gestures

```typescript
/**
 * Touch/swipe gestures for mobile
 * NFR-2.2, NFR-2.3
 */
export class TouchHandler {
  private startX: number;
  private startY: number;
  private minSwipeDistance: number = 50;

  constructor(element: HTMLElement, callbacks: TouchCallbacks) {
    this.attachListeners(element, callbacks);
  }

  /**
   * Detect swipe gestures
   */
  private onTouchStart(event: TouchEvent): void;
  private onTouchEnd(event: TouchEvent, callbacks: TouchCallbacks): void;

  /**
   * Determine swipe direction
   */
  private getSwipeDirection(deltaX: number, deltaY: number): SwipeDirection | null;
}

export interface TouchCallbacks {
  onSwipeLeft: () => void;   // Next step
  onSwipeRight: () => void;  // Previous step
}

export enum SwipeDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down'
}
```

**Unit Test Coverage**:
- ✓ Detect swipe left
- ✓ Detect swipe right
- ✓ Ignore short swipes
- ✓ Ignore vertical swipes
- ✓ Handle multi-touch
- ✓ Remove listeners on destroy

---

## Performance Optimization

### Rendering Performance

```typescript
/**
 * Performance optimization strategies
 * NFR-1.1, NFR-3.1, NFR-3.2, NFR-3.3
 */
export class PerformanceManager {
  private frameRate: number = 60;
  private frameTime: number = 1000 / 60;
  private lastFrame: number = 0;

  /**
   * Request animation frame with throttling
   */
  public requestFrame(callback: () => void): void {
    requestAnimationFrame((timestamp) => {
      if (timestamp - this.lastFrame >= this.frameTime) {
        this.lastFrame = timestamp;
        callback();
      }
    });
  }

  /**
   * Reduce quality on low-performance devices
   */
  public detectPerformance(): 'low' | 'medium' | 'high' {
    const gpu = this.detectGPU();
    const memory = (performance as any).memory?.jsHeapSizeLimit;

    if (gpu === 'low' || memory < 1e9) return 'low';
    if (gpu === 'medium' || memory < 2e9) return 'medium';
    return 'high';
  }

  /**
   * Adjust rendering quality based on performance
   */
  public adjustQuality(level: 'low' | 'medium' | 'high'): RenderQuality;

  /**
   * Detect GPU capabilities
   */
  private detectGPU(): 'low' | 'medium' | 'high';
}

export interface RenderQuality {
  antialias: boolean;
  shadows: boolean;
  textureQuality: 'low' | 'medium' | 'high';
  pixelRatio: number;
}
```

### Memory Management

```typescript
/**
 * Manages Three.js resource disposal
 */
export class ResourceManager {
  private geometries: Set<THREE.BufferGeometry>;
  private materials: Set<THREE.Material>;
  private textures: Set<THREE.Texture>;

  /**
   * Track resources
   */
  public track(resource: THREE.BufferGeometry | THREE.Material | THREE.Texture): void;

  /**
   * Dispose all tracked resources
   */
  public disposeAll(): void;

  /**
   * Dispose specific resource
   */
  public dispose(resource: THREE.BufferGeometry | THREE.Material | THREE.Texture): void;
}
```

### Performance Targets

```typescript
export const PERFORMANCE_TARGETS = {
  MIN_FPS: 30,              // Minimum acceptable FPS (NFR-1.1)
  TARGET_FPS: 60,           // Target FPS (NFR-1.1)
  ANIMATION_START: 100,     // Max time to start animation (NFR-3.1)
  STEP_TRANSITION: 2000,    // Max step transition time (NFR-3.2)
  MAX_SOLUTION_LENGTH: 100, // Max moves without degradation (NFR-3.3)
  MEMORY_LIMIT: 100         // MB for 3D assets
};
```

**Unit Test Coverage**:
- ✓ Measure frame rate
- ✓ Detect performance level
- ✓ Adjust quality settings
- ✓ Track resources
- ✓ Dispose resources correctly
- ✓ Prevent memory leaks
- ✓ Meet performance targets

---

## Accessibility

### ARIA Labels and Roles

```typescript
/**
 * Accessibility configuration
 * NFR-4.1, NFR-4.2
 */
export const ARIA_CONFIG = {
  NAVIGATION: {
    NEXT: 'Advance to next move',
    PREVIOUS: 'Return to previous move',
    PLAY: 'Start automatic playback',
    PAUSE: 'Pause automatic playback',
    RESET: 'Reset to initial state'
  },
  STEP_INDICATOR: (current: number, total: number) =>
    `Currently on step ${current} of ${total}`,
  PROGRESS: (percent: number) =>
    `${percent}% complete`,
  MOVE: (notation: string, description: string) =>
    `Current move: ${notation}. ${description}`
};
```

### Screen Reader Support

```typescript
/**
 * Announces changes to screen readers
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement;

  constructor() {
    this.createLiveRegion();
  }

  /**
   * Announces step changes
   */
  public announceStep(step: number, total: number, move: string): void {
    this.announce(
      `Step ${step} of ${total}. Move: ${move}`
    );
  }

  /**
   * Announces completion
   */
  public announceCompletion(): void {
    this.announce('Cube solved! All steps completed.');
  }

  /**
   * Creates ARIA live region
   */
  private createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announces message
   */
  private announce(message: string): void {
    this.liveRegion.textContent = message;
  }
}
```

### Keyboard Navigation

```typescript
/**
 * Full keyboard accessibility
 * NFR-4.1
 */
export class KeyboardAccessibility {
  /**
   * Ensures all interactive elements are keyboard accessible
   */
  public static ensureAccessibility(container: HTMLElement): void {
    // Ensure tab order
    this.setTabOrder(container);

    // Ensure focus styles
    this.ensureFocusStyles(container);

    // Ensure keyboard traps are avoided
    this.preventFocusTrap(container);
  }

  private static setTabOrder(container: HTMLElement): void;
  private static ensureFocusStyles(container: HTMLElement): void;
  private static preventFocusTrap(container: HTMLElement): void;
}
```

**Unit Test Coverage**:
- ✓ ARIA labels present on all controls
- ✓ Live region announces changes
- ✓ Keyboard navigation works
- ✓ Focus styles visible
- ✓ No focus traps
- ✓ Screen reader compatible

---

## Error Handling

### Error Types

```typescript
export enum VisualizationErrorCode {
  INVALID_SOLUTION = 'INVALID_SOLUTION',
  WEBGL_NOT_SUPPORTED = 'WEBGL_NOT_SUPPORTED',
  ANIMATION_FAILED = 'ANIMATION_FAILED',
  RESOURCE_LOAD_FAILED = 'RESOURCE_LOAD_FAILED',
  RENDERING_ERROR = 'RENDERING_ERROR'
}

export class VisualizationError extends Error {
  constructor(
    public code: VisualizationErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'VisualizationError';
  }
}
```

### Error Recovery

```typescript
/**
 * Handles visualization errors gracefully
 */
export class ErrorHandler {
  /**
   * Handles WebGL errors with fallback
   */
  public handleWebGLError(): void {
    // Fall back to 2D canvas or static display
    this.showFallbackDisplay();
  }

  /**
   * Handles animation errors
   */
  public handleAnimationError(error: Error): void {
    // Skip animation and jump to end state
    this.skipAnimation();
  }

  /**
   * Shows fallback 2D display
   */
  private showFallbackDisplay(): void;

  /**
   * Skips current animation
   */
  private skipAnimation(): void;
}
```

**Unit Test Coverage**:
- ✓ Handle WebGL not supported
- ✓ Handle animation failure
- ✓ Handle resource load failure
- ✓ Show fallback display
- ✓ Skip failed animation
- ✓ Recover gracefully

---

## Testing Strategy

### Unit Tests (Target: 100% coverage)

#### VisualizationContainer (15 tests)
- ✓ Initialize with solution
- ✓ Next step navigation
- ✓ Previous step navigation
- ✓ Jump to step
- ✓ Play/pause auto-play
- ✓ Reset to initial
- ✓ Change speed
- ✓ Get step info
- ✓ Handle empty solution
- ✓ Handle single move solution
- ✓ Prevent invalid navigation

#### CubeRenderer3D (20 tests)
- ✓ Initialize scene
- ✓ Create cube mesh
- ✓ Update cube colors
- ✓ Animate moves (all 18 types)
- ✓ Highlight pieces
- ✓ Show arrows
- ✓ Clear highlights
- ✓ Adjust camera
- ✓ Dispose resources
- ✓ Handle resize

#### AnimationEngine (15 tests)
- ✓ Animate 90° rotation
- ✓ Animate 180° rotation
- ✓ Clockwise/counter-clockwise
- ✓ Apply easing functions (4 types)
- ✓ Cancel animation
- ✓ Track animation state
- ✓ Generate frames
- ✓ Respect duration
- ✓ Complete callback

#### NavigationController (12 tests)
- ✓ Next/previous navigation
- ✓ Jump to step
- ✓ Auto-play start/stop
- ✓ Auto-advance timing
- ✓ Reset functionality
- ✓ Navigation boundaries
- ✓ Step info calculation

#### UI Components (30 tests)
- ✓ StepIndicator (6 tests)
- ✓ MoveDisplay (5 tests)
- ✓ NavigationControls (7 tests)
- ✓ PlaybackControls (8 tests)
- ✓ CompletionModal (4 tests)

#### Interaction (15 tests)
- ✓ KeyboardHandler (7 tests)
- ✓ TouchHandler (5 tests)
- ✓ Screen reader (3 tests)

#### Performance (10 tests)
- ✓ Frame rate management
- ✓ Performance detection
- ✓ Quality adjustment
- ✓ Resource management
- ✓ Memory limits

#### Error Handling (8 tests)
- ✓ Handle each error type
- ✓ Fallback displays
- ✓ Recovery strategies

**Total: 125 unit tests**

### Integration Tests (10 tests)

- ✓ Complete visualization flow (0 → last step)
- ✓ Auto-play full solution
- ✓ Navigate backward through solution
- ✓ Jump to random steps
- ✓ Speed changes during playback
- ✓ Keyboard navigation only
- ✓ Touch gestures only
- ✓ WebGL fallback to 2D
- ✓ Long solutions (100+ moves)
- ✓ Performance on mobile devices

### Visual Regression Tests (5 tests)

- ✓ Initial cube state appearance
- ✓ Mid-animation frame
- ✓ Completion state appearance
- ✓ UI controls layout
- ✓ Responsive breakpoints

**Total Tests: 125 + 10 + 5 = 140 tests**

---

## API Interfaces

### Public API

```typescript
/**
 * Main API for visualization feature
 */
export interface VisualizationAPI {
  /**
   * Initialize visualization with solution
   */
  initialize(
    container: HTMLElement,
    solution: Solution,
    options?: VisualizationOptions
  ): void;

  /**
   * Navigation controls
   */
  next(): Promise<void>;
  previous(): Promise<void>;
  jumpTo(step: number): Promise<void>;

  /**
   * Playback controls
   */
  play(): void;
  pause(): void;
  reset(): void;

  /**
   * Settings
   */
  setSpeed(speed: PlaybackSpeed): void;
  setViewAngle(angle: ViewAngle): void;

  /**
   * State queries
   */
  getState(): VisualizationState;
  getStepInfo(): StepInfo;

  /**
   * Cleanup
   */
  destroy(): void;

  /**
   * Event handlers
   */
  on(event: 'step-complete', handler: (step: number) => void): void;
  on(event: 'solution-complete', handler: () => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
}

export interface VisualizationOptions {
  autoPlay?: boolean;
  initialSpeed?: PlaybackSpeed;
  showControls?: boolean;
  enableKeyboard?: boolean;
  enableTouch?: boolean;
  enableRotation?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'auto';
}
```

### Integration Points

#### Input from Feature 2

```typescript
/**
 * Receives solution from Assembly Mechanism
 */
export interface VisualizationInput {
  solution: Solution;
  onStepComplete?: (stepNumber: number) => void;
  onSolutionComplete?: () => void;
}
```

#### Output to User

```typescript
/**
 * Completion event data
 */
export interface CompletionData {
  totalSteps: number;
  totalTime: number;
  averageStepTime: number;
}
```

---

## Deployment Considerations

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/features/visualization/index.ts',
      name: 'Visualization',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
        },
        manualChunks: {
          'three-core': ['three'],
          'visualization-ui': ['./src/features/visualization/components'],
          'visualization-engine': ['./src/features/visualization/engine']
        }
      }
    }
  }
});
```

### Bundle Size Targets
- Three.js: ~150KB gzipped (external)
- Visualization UI: < 30KB gzipped
- Animation engine: < 20KB gzipped
- 3D models: < 10KB gzipped
- **Total (excluding Three.js): < 60KB gzipped**

### CDN Loading

```typescript
/**
 * Load Three.js from CDN
 */
export async function loadThreeJS(): Promise<typeof THREE> {
  if (window.THREE) {
    return window.THREE;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    script.onload = () => resolve(window.THREE);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

---

## Future Enhancements (Out of Scope)

- VR/AR visualization
- Multi-cube simultaneous solving
- Custom cube skins/themes
- Solution video export
- Social sharing
- Embedded tutorials
- Solution comparison mode
- Time challenge mode

---

## Requirements Coverage Matrix

| Requirement ID | Design Component | Test Coverage |
|---------------|------------------|---------------|
| FR-1.1.1 | CubeRenderer3D.render() | ✓ |
| FR-1.1.2 | CubeMesh (3D representation) | ✓ |
| FR-1.1.3 | CubeRenderer3D.updateCubeState() | ✓ |
| FR-1.1.4 | CubeRenderer3D colors | ✓ |
| FR-1.1.5 | CubeRenderer3D camera | ✓ |
| FR-1.2.1 | MoveDisplay.render() | ✓ |
| FR-1.2.2 | MoveDisplay.highlightFace() | ✓ |
| FR-1.2.3 | MoveDisplay.renderNotation() | ✓ |
| FR-1.2.4 | MoveDisplay.renderDescription() | ✓ |
| FR-1.2.5 | CubeRenderer3D.highlightMovingPieces() | ✓ |
| FR-2.1.1 | AnimationEngine.animateRotation() | ✓ |
| FR-2.1.2 | AnimationEngine direction | ✓ |
| FR-2.1.3 | AnimationEngine degrees | ✓ |
| FR-2.1.4 | AnimationEngine blocking | ✓ |
| FR-2.1.5 | AnimationEngine cube state update | ✓ |
| FR-2.2.1 | PlaybackSpeed enum | ✓ |
| FR-2.2.2 | ANIMATION_DURATIONS config | ✓ |
| FR-2.2.3 | AnimationConfig skip (future) | - |
| FR-2.2.4 | Speed preference storage (future) | - |
| FR-2.3.1 | CubeRenderer3D.highlightMovingPieces() | ✓ |
| FR-2.3.2 | CubeRenderer3D visual treatment | ✓ |
| FR-2.3.3 | CubeRenderer3D.showDirectionArrows() | ✓ |
| FR-2.3.4 | CubeRenderer3D dim pieces (future) | - |
| FR-3.1.1 | NavigationControls Next button | ✓ |
| FR-3.1.2 | NavigationController.next() | ✓ |
| FR-3.1.3 | NavigationController.canGoNext() | ✓ |
| FR-3.1.4 | KeyboardHandler shortcuts | ✓ |
| FR-3.2.1 | NavigationControls Previous button | ✓ |
| FR-3.2.2 | NavigationController.previous() | ✓ |
| FR-3.2.3 | AnimationEngine reverse (future) | - |
| FR-3.2.4 | NavigationController.canGoPrevious() | ✓ |
| FR-3.2.5 | KeyboardHandler shortcuts | ✓ |
| FR-3.3.1 | StepIndicator current step | ✓ |
| FR-3.3.2 | StepIndicator total steps | ✓ |
| FR-3.3.3 | StepIndicator format | ✓ |
| FR-3.3.4 | StepIndicator progress bar | ✓ |
| FR-3.3.5 | NavigationController.jumpTo() | ✓ |
| FR-3.4.1 | PlaybackControls Play button | ✓ |
| FR-3.4.2 | PlaybackControls Pause button | ✓ |
| FR-3.4.3 | NavigationController.startAutoPlay() | ✓ |
| FR-3.4.4 | AUTO_ADVANCE_DELAYS config | ✓ |
| FR-3.4.5 | PlaybackControls Reset button | ✓ |
| FR-4.1.1 | CompletionModal notification | ✓ |
| FR-4.1.2 | CompletionModal solved indication | ✓ |
| FR-4.1.3 | CompletionModal solved state | ✓ |
| FR-4.1.4 | CompletionModal celebration | ✓ |
| FR-4.1.5 | CompletionModal statistics | ✓ |
| FR-4.2.1 | CompletionModal restart action | ✓ |
| FR-4.2.2 | CompletionModal new cube action | ✓ |
| FR-4.2.3 | CompletionModal review action | ✓ |
| FR-4.2.4 | NavigationController navigation (post-completion) | ✓ |
| NFR-1.1 | PerformanceManager FPS targeting | ✓ |
| NFR-1.2 | Responsive design | ✓ |
| NFR-1.3 | CUBE_COLORS specification | ✓ |
| NFR-1.4 | CubeRenderer3D lighting | ✓ |
| NFR-2.1 | NavigationControls prominence | ✓ |
| NFR-2.2 | TouchHandler implementation | ✓ |
| NFR-2.3 | Touch target sizing | ✓ |
| NFR-2.4 | UI/UX design | ✓ |
| NFR-3.1 | Performance testing (< 100ms) | ✓ |
| NFR-3.2 | Performance testing (< 2s) | ✓ |
| NFR-3.3 | Performance testing (100 moves) | ✓ |
| NFR-4.1 | KeyboardAccessibility | ✓ |
| NFR-4.2 | ScreenReaderAnnouncer | ✓ |
| NFR-4.3 | Speed controls | ✓ |

**Total Requirements Covered: 62/66 (93.9%)**
*4 requirements marked as "Could" priority and deferred to future*

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-10 | Design Doc | Initial design document |
