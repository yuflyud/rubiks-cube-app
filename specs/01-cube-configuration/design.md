# Feature 1: Rubik's Cube Configuration - Technical Design

## Design Overview

| Property | Value |
|----------|-------|
| Feature ID | F-001 |
| Feature Name | Rubik's Cube Configuration |
| Design Status | Draft |
| Last Updated | 2026-01-10 |

---

## Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────┐
│                  Cube Configuration Module               │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────┐      ┌──────────────────┐          │
│  │  UI Layer      │─────▶│  State Manager   │          │
│  │  (Components)  │◀─────│  (Validation)    │          │
│  └────────────────┘      └──────────────────┘          │
│         │                         │                      │
│         │                         ▼                      │
│         │                ┌──────────────────┐          │
│         └───────────────▶│  Cube Data Model │          │
│                          └──────────────────┘          │
│                                   │                      │
└───────────────────────────────────┼──────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │ Assembly Mechanism  │
                          │    (Feature 2)      │
                          └─────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Vanilla TypeScript (Vite build)
- **3D Rendering**: CSS 3D Transforms (lightweight, no external dependencies)
- **State Management**: Custom state machine with observers
- **Data Validation**: Custom validation engine
- **Testing**: Vitest + Testing Library

---

## Data Models

### Core Data Structures

```typescript
/**
 * Represents the six faces of a Rubik's cube
 */
export enum Face {
  UP = 'U',      // White (top)
  DOWN = 'D',    // Yellow (bottom)
  FRONT = 'F',   // Green
  BACK = 'B',    // Blue
  LEFT = 'L',    // Orange
  RIGHT = 'R'    // Red
}

/**
 * Represents the six colors available on a Rubik's cube
 */
export enum Color {
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  RED = 'RED'
}

/**
 * Maps each face to its standard center color
 */
export const FACE_TO_COLOR: Record<Face, Color> = {
  [Face.UP]: Color.WHITE,
  [Face.DOWN]: Color.YELLOW,
  [Face.FRONT]: Color.GREEN,
  [Face.BACK]: Color.BLUE,
  [Face.LEFT]: Color.ORANGE,
  [Face.RIGHT]: Color.RED
};

/**
 * Position of a facelet on a face (0-8)
 * Layout:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * Position 4 is always the center (fixed)
 */
export type FaceletPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Represents a single facelet (sticker) on the cube
 */
export interface Facelet {
  face: Face;
  position: FaceletPosition;
  color: Color | null;
  isCenter: boolean;
  isConfigured: boolean;
}

/**
 * Represents all 54 facelets organized by face
 */
export interface CubeState {
  faces: Record<Face, Color[]>; // Each face has 9 colors
  metadata: {
    totalConfigured: number;    // Count of configured facelets
    isComplete: boolean;         // All 54 facelets configured
    isValid: boolean;            // Passes validation
    lastModified: Date;
  };
}

/**
 * Configuration progress state
 */
export interface ConfigurationProgress {
  currentFace: Face;
  currentStep: number;          // 0-5 (one per face)
  totalSteps: number;           // Always 6
  completedFaces: Face[];
  percentComplete: number;      // 0-100
}

/**
 * Color count tracking for validation
 */
export interface ColorCount {
  [Color.WHITE]: number;
  [Color.YELLOW]: number;
  [Color.GREEN]: number;
  [Color.BLUE]: number;
  [Color.ORANGE]: number;
  [Color.RED]: number;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error';
  affectedFacelets?: FaceletIdentifier[];
}

export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'warning';
  affectedFacelets?: FaceletIdentifier[];
}

export interface FaceletIdentifier {
  face: Face;
  position: FaceletPosition;
}
```

### Helper Types

```typescript
/**
 * Piece type on the cube
 */
export enum PieceType {
  CENTER = 'CENTER',   // Position 4 on each face
  EDGE = 'EDGE',       // Positions 1, 3, 5, 7
  CORNER = 'CORNER'    // Positions 0, 2, 6, 8
}

/**
 * Represents a corner piece with its three colors
 */
export interface CornerPiece {
  colors: [Color, Color, Color];
  positions: [FaceletIdentifier, FaceletIdentifier, FaceletIdentifier];
}

/**
 * Represents an edge piece with its two colors
 */
export interface EdgePiece {
  colors: [Color, Color];
  positions: [FaceletIdentifier, FaceletIdentifier];
}
```

---

## Component Architecture

### Component Hierarchy

```
CubeConfigurationContainer
├── ConfigurationHeader
│   ├── Title
│   └── ProgressIndicator
│       ├── StepCounter (Step X of 6)
│       └── ProgressBar
├── CubeDisplay
│   ├── FaceGrid (×6)
│   │   └── FaceletCell (×9)
│   │       ├── ColorIndicator
│   │       └── SelectionHighlight
│   └── CubeRotationControls (optional)
├── ColorPalette
│   └── ColorButton (×6)
├── NavigationControls
│   ├── PreviousButton
│   ├── NextButton
│   └── ValidationStatus
└── ErrorDisplay
    └── ValidationMessage (×N)
```

### Key Components

#### 1. CubeConfigurationContainer

**Responsibility**: Main orchestrator for the configuration feature

```typescript
export interface CubeConfigurationContainerProps {
  onComplete: (cubeState: CubeState) => void;
  initialState?: Partial<CubeState>;
}

export class CubeConfigurationContainer {
  private state: ConfigurationState;
  private validator: CubeValidator;

  constructor(props: CubeConfigurationContainerProps) {
    this.state = this.initializeState(props.initialState);
    this.validator = new CubeValidator();
  }

  /**
   * Handles color assignment to a facelet
   * FR-1.2.2, FR-1.2.3
   */
  public assignColor(face: Face, position: FaceletPosition, color: Color): void;

  /**
   * Advances to the next face in guided flow
   * FR-2.1.1, FR-2.1.2
   */
  public nextFace(): void;

  /**
   * Returns to previous face for editing
   * FR-2.2.4
   */
  public previousFace(): void;

  /**
   * Validates current configuration
   * FR-3.1.1, FR-3.2.1-FR-3.2.5
   */
  public validate(): ValidationResult;

  /**
   * Completes configuration and passes to next feature
   * FR-3.3.4
   */
  public complete(): void;
}
```

**Unit Test Coverage**:
- ✓ Initialize with empty state
- ✓ Initialize with partial state
- ✓ Assign color to valid facelet
- ✓ Prevent assigning color to center facelet
- ✓ Change previously assigned color
- ✓ Navigate to next face
- ✓ Navigate to previous face
- ✓ Prevent navigation before current face is complete
- ✓ Calculate correct progress percentage
- ✓ Trigger validation on complete
- ✓ Prevent completion with invalid state

#### 2. CubeDisplay Component

**Responsibility**: Render visual representation of cube faces

```typescript
export interface CubeDisplayProps {
  cubeState: CubeState;
  currentFace: Face | null;
  selectedFacelet: FaceletIdentifier | null;
  onFaceletSelect: (face: Face, position: FaceletPosition) => void;
  highlightMode: 'current-face' | 'all-faces' | 'none';
}

export class CubeDisplay {
  /**
   * Renders all six faces in 2D unfolded layout
   * FR-1.1.1, FR-1.1.2
   */
  public render(): HTMLElement;

  /**
   * Highlights currently selected facelet
   * FR-1.1.3
   */
  private highlightFacelet(identifier: FaceletIdentifier): void;

  /**
   * Highlights current face being configured
   * FR-2.1.3
   */
  private highlightFace(face: Face): void;

  /**
   * Renders a single face with 9 facelets
   * FR-1.1.4
   */
  private renderFace(face: Face, colors: Color[]): HTMLElement;
}
```

**Layout** (2D Unfolded Cube):
```
        [BACK]
[LEFT]  [UP]    [RIGHT]
        [FRONT]
        [DOWN]
```

**Unit Test Coverage**:
- ✓ Render all six faces
- ✓ Render 9 facelets per face (54 total)
- ✓ Display center facelets with correct fixed colors
- ✓ Display configured colors correctly
- ✓ Display empty facelets for unconfigured
- ✓ Highlight selected facelet
- ✓ Highlight current face
- ✓ Handle facelet click events
- ✓ Prevent selection of center facelets

#### 3. ColorPalette Component

**Responsibility**: Provide color selection interface

```typescript
export interface ColorPaletteProps {
  colors: Color[];
  selectedColor: Color | null;
  colorCounts: ColorCount;
  onColorSelect: (color: Color) => void;
}

export class ColorPalette {
  /**
   * Renders all 6 color options
   * FR-1.2.1
   */
  public render(): HTMLElement;

  /**
   * Shows color count next to each color
   * FR-3.1.2
   */
  private renderColorCount(color: Color, count: number): HTMLElement;

  /**
   * Visually indicates when color count > 9
   * FR-3.1.3
   */
  private indicateOveruse(color: Color, count: number): void;

  /**
   * Visually indicates when color count < 9 at completion
   * FR-3.1.4
   */
  private indicateUnderuse(color: Color, count: number): void;
}
```

**Unit Test Coverage**:
- ✓ Render 6 color buttons
- ✓ Display correct color for each button
- ✓ Highlight selected color
- ✓ Show color count for each color
- ✓ Indicate when color used > 9 times
- ✓ Indicate when color used < 9 times on completion
- ✓ Handle color selection
- ✓ Handle keyboard shortcuts (if implemented)

#### 4. ProgressIndicator Component

**Responsibility**: Show configuration completion progress

```typescript
export interface ProgressIndicatorProps {
  progress: ConfigurationProgress;
}

export class ProgressIndicator {
  /**
   * Shows "Step X of 6" and percentage
   * FR-2.2.1, FR-2.2.2, FR-2.2.3
   */
  public render(): HTMLElement;

  /**
   * Visual progress bar
   * FR-2.2.1
   */
  private renderProgressBar(percent: number): HTMLElement;

  /**
   * Shows completed faces with checkmarks
   * FR-2.2.2
   */
  private renderCompletedFaces(faces: Face[]): HTMLElement;

  /**
   * Shows remaining faces
   * FR-2.2.3
   */
  private renderRemainingFaces(faces: Face[]): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Display current step number
- ✓ Display total steps (6)
- ✓ Calculate percentage correctly
- ✓ Render progress bar with correct width
- ✓ Show completed faces
- ✓ Show remaining faces
- ✓ Update when progress changes

#### 5. ValidationDisplay Component

**Responsibility**: Show validation errors and warnings

```typescript
export interface ValidationDisplayProps {
  validationResult: ValidationResult;
  onErrorClick?: (error: ValidationError) => void;
}

export class ValidationDisplay {
  /**
   * Renders validation messages
   * FR-3.3.1
   */
  public render(): HTMLElement;

  /**
   * Shows specific error locations
   * FR-3.3.2
   */
  private highlightErrorLocations(error: ValidationError): void;

  /**
   * Provides fix guidance
   * FR-3.3.3
   */
  private renderFixGuidance(error: ValidationError): HTMLElement;
}
```

**Unit Test Coverage**:
- ✓ Display no errors when valid
- ✓ Display error messages
- ✓ Display warning messages
- ✓ Distinguish error vs warning severity
- ✓ Make errors clickable to show location
- ✓ Show fix guidance
- ✓ Clear errors when validation passes

---

## Business Logic

### State Manager

```typescript
/**
 * Central state management for configuration
 */
export class ConfigurationStateManager {
  private cubeState: CubeState;
  private progress: ConfigurationProgress;
  private selectedFacelet: FaceletIdentifier | null;
  private selectedColor: Color | null;
  private observers: StateObserver[];

  constructor() {
    this.cubeState = this.createEmptyCubeState();
    this.progress = this.initializeProgress();
    this.observers = [];
  }

  /**
   * Creates initial empty cube state with centers pre-filled
   * FR-1.1.4
   */
  private createEmptyCubeState(): CubeState;

  /**
   * Assigns a color to a facelet
   * FR-1.2.2, FR-1.2.3, FR-1.2.4
   */
  public setFaceletColor(face: Face, position: FaceletPosition, color: Color): void;

  /**
   * Gets current color of a facelet
   */
  public getFaceletColor(face: Face, position: FaceletPosition): Color | null;

  /**
   * Calculates color counts for validation
   * FR-3.1.2
   */
  public getColorCounts(): ColorCount;

  /**
   * Updates progress based on configured facelets
   * FR-2.2.1
   */
  private updateProgress(): void;

  /**
   * Checks if a facelet can be modified
   * (Centers cannot be modified)
   */
  public canModifyFacelet(face: Face, position: FaceletPosition): boolean;

  /**
   * Gets complete cube state
   */
  public getCubeState(): Readonly<CubeState>;

  /**
   * Observer pattern for state changes
   */
  public subscribe(observer: StateObserver): void;
  public unsubscribe(observer: StateObserver): void;
  private notifyObservers(): void;
}

export interface StateObserver {
  onStateChange(state: CubeState, progress: ConfigurationProgress): void;
}
```

**Unit Test Coverage**:
- ✓ Create empty cube state with centers pre-filled
- ✓ Set facelet color
- ✓ Get facelet color
- ✓ Prevent modifying center facelets
- ✓ Calculate color counts correctly
- ✓ Update progress on color assignment
- ✓ Calculate correct percentage
- ✓ Mark cube as complete when all 54 facelets set
- ✓ Notify observers on state change
- ✓ Handle subscription/unsubscription

### Validation Engine

```typescript
/**
 * Validates cube configuration for correctness and solvability
 */
export class CubeValidator {
  /**
   * Main validation entry point
   * Runs all validation checks
   */
  public validate(cubeState: CubeState): ValidationResult;

  /**
   * Validates color counts (each color exactly 9 times)
   * FR-3.2.1
   */
  private validateColorCounts(cubeState: CubeState): ValidationError[];

  /**
   * Validates corner pieces have valid color combinations
   * FR-3.2.2
   */
  private validateCornerPieces(cubeState: CubeState): ValidationError[];

  /**
   * Validates edge pieces have valid color combinations
   * FR-3.2.3
   */
  private validateEdgePieces(cubeState: CubeState): ValidationError[];

  /**
   * Detects physically impossible cube states
   * FR-3.2.4
   */
  private validatePhysicalPossibility(cubeState: CubeState): ValidationError[];

  /**
   * Validates cube solvability
   * FR-3.2.5
   */
  private validateSolvability(cubeState: CubeState): ValidationError[];

  /**
   * Extracts all 8 corner pieces from cube state
   */
  private extractCornerPieces(cubeState: CubeState): CornerPiece[];

  /**
   * Extracts all 12 edge pieces from cube state
   */
  private extractEdgePieces(cubeState: CubeState): EdgePiece[];

  /**
   * Checks if a corner piece color combination is valid
   * Valid corners never have: opposite colors together, same color twice
   */
  private isValidCornerCombination(colors: Color[]): boolean;

  /**
   * Checks if an edge piece color combination is valid
   * Valid edges never have: opposite colors together, same color twice
   */
  private isValidEdgeCombination(colors: Color[]): boolean;

  /**
   * Checks if two colors are opposite faces
   */
  private areOppositeColors(color1: Color, color2: Color): boolean;

  /**
   * Calculates cube parity to determine solvability
   * Uses permutation parity of corners and edges
   */
  private calculateParity(cubeState: CubeState): boolean;
}

/**
 * Valid corner combinations (no opposite colors together)
 */
const VALID_CORNER_COMBINATIONS: Set<string> = new Set([
  'WHITE-GREEN-ORANGE',  // Up-Front-Left
  'WHITE-GREEN-RED',     // Up-Front-Right
  'WHITE-BLUE-ORANGE',   // Up-Back-Left
  'WHITE-BLUE-RED',      // Up-Back-Right
  'YELLOW-GREEN-ORANGE', // Down-Front-Left
  'YELLOW-GREEN-RED',    // Down-Front-Right
  'YELLOW-BLUE-ORANGE',  // Down-Back-Left
  'YELLOW-BLUE-RED'      // Down-Back-Right
]);

/**
 * Valid edge combinations (no opposite colors together)
 */
const VALID_EDGE_COMBINATIONS: Set<string> = new Set([
  'WHITE-GREEN',   // Up-Front
  'WHITE-BLUE',    // Up-Back
  'WHITE-ORANGE',  // Up-Left
  'WHITE-RED',     // Up-Right
  'YELLOW-GREEN',  // Down-Front
  'YELLOW-BLUE',   // Down-Back
  'YELLOW-ORANGE', // Down-Left
  'YELLOW-RED',    // Down-Right
  'GREEN-ORANGE',  // Front-Left
  'GREEN-RED',     // Front-Right
  'BLUE-ORANGE',   // Back-Left
  'BLUE-RED'       // Back-Right
]);

/**
 * Opposite color pairs (never appear on same piece)
 */
const OPPOSITE_COLORS: Map<Color, Color> = new Map([
  [Color.WHITE, Color.YELLOW],
  [Color.YELLOW, Color.WHITE],
  [Color.GREEN, Color.BLUE],
  [Color.BLUE, Color.GREEN],
  [Color.ORANGE, Color.RED],
  [Color.RED, Color.ORANGE]
]);
```

**Unit Test Coverage**:
- ✓ Pass validation for valid cube
- ✓ Detect color count errors (> 9)
- ✓ Detect color count errors (< 9)
- ✓ Detect invalid corner combinations
- ✓ Detect opposite colors on same corner
- ✓ Detect invalid edge combinations
- ✓ Detect opposite colors on same edge
- ✓ Detect duplicate colors on same piece
- ✓ Detect unsolvable cube states (parity)
- ✓ Extract corner pieces correctly
- ✓ Extract edge pieces correctly
- ✓ Identify opposite colors correctly
- ✓ Generate helpful error messages
- ✓ Include affected facelet locations in errors

### Guided Flow Manager

```typescript
/**
 * Manages step-by-step configuration flow
 */
export class GuidedFlowManager {
  private faceOrder: Face[];
  private currentIndex: number;

  constructor() {
    this.faceOrder = [
      Face.FRONT,
      Face.RIGHT,
      Face.BACK,
      Face.LEFT,
      Face.UP,
      Face.DOWN
    ];
    this.currentIndex = 0;
  }

  /**
   * Gets the current face being configured
   * FR-2.1.1
   */
  public getCurrentFace(): Face;

  /**
   * Gets instructions for current step
   * FR-2.1.2
   */
  public getCurrentInstructions(): string;

  /**
   * Advances to next face if current is complete
   * FR-2.1.4
   */
  public nextFace(stateManager: ConfigurationStateManager): boolean;

  /**
   * Returns to previous face
   * FR-2.2.4
   */
  public previousFace(): boolean;

  /**
   * Checks if current face is complete
   */
  public isCurrentFaceComplete(stateManager: ConfigurationStateManager): boolean;

  /**
   * Gets list of completed faces
   * FR-2.2.2
   */
  public getCompletedFaces(stateManager: ConfigurationStateManager): Face[];

  /**
   * Gets list of remaining faces
   * FR-2.2.3
   */
  public getRemainingFaces(): Face[];

  /**
   * Checks if all faces are complete
   */
  public isComplete(): boolean;
}
```

**Unit Test Coverage**:
- ✓ Initialize with first face
- ✓ Get current face
- ✓ Get instructions for each face
- ✓ Advance to next face when complete
- ✓ Prevent advancing when incomplete
- ✓ Return to previous face
- ✓ Prevent going back from first face
- ✓ Check if face is complete (all 9 facelets)
- ✓ Get list of completed faces
- ✓ Get list of remaining faces
- ✓ Detect when all faces complete

---

## API Interfaces

### Public API

```typescript
/**
 * Main entry point for the configuration feature
 */
export interface CubeConfigurationAPI {
  /**
   * Initializes the configuration UI
   * @param container - DOM element to mount to
   * @param options - Configuration options
   */
  initialize(container: HTMLElement, options?: ConfigurationOptions): void;

  /**
   * Gets the current cube state
   */
  getState(): Readonly<CubeState>;

  /**
   * Sets cube state (for resuming configuration)
   */
  setState(state: Partial<CubeState>): void;

  /**
   * Validates current configuration
   */
  validate(): ValidationResult;

  /**
   * Resets configuration to empty state
   */
  reset(): void;

  /**
   * Destroys the configuration UI
   */
  destroy(): void;

  /**
   * Event handlers
   */
  on(event: 'complete', handler: (state: CubeState) => void): void;
  on(event: 'change', handler: (state: CubeState) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
}

export interface ConfigurationOptions {
  guidedMode?: boolean;        // Default: true
  showKeyboardShortcuts?: boolean;  // Default: true
  colorblindMode?: boolean;     // Default: false
  autoValidate?: boolean;       // Default: true
}
```

### Integration with Feature 2

```typescript
/**
 * Output format for Feature 2 consumption
 */
export interface ConfigurationOutput {
  cubeState: CubeState;
  validationResult: ValidationResult;
  timestamp: Date;
}

/**
 * Function passed to Assembly Mechanism
 */
export type OnConfigurationComplete = (output: ConfigurationOutput) => void;
```

---

## User Interface Design

### Visual Design Specs

#### Color Palette
```typescript
export const CUBE_COLORS = {
  WHITE: '#FFFFFF',
  YELLOW: '#FFD500',
  GREEN: '#009B48',
  BLUE: '#0046AD',
  ORANGE: '#FF5800',
  RED: '#B71234'
};

export const UI_COLORS = {
  BACKGROUND: '#F5F5F5',
  SURFACE: '#FFFFFF',
  PRIMARY: '#2196F3',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
  HIGHLIGHT: '#FFC107',
  DISABLED: '#BDBDBD'
};
```

#### Spacing & Sizing
```typescript
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px'
};

export const FACELET_SIZE = {
  MOBILE: '40px',
  TABLET: '50px',
  DESKTOP: '60px'
};
```

#### Layout Structure

```css
.cube-configuration-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  gap: 24px;
}

.cube-display {
  display: grid;
  grid-template-areas:
    ".     back  .     ."
    "left  up    right ."
    ".     front .     ."
    ".     down  .     .";
  gap: 16px;
  justify-content: center;
}

.face-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  border: 2px solid #333;
  padding: 4px;
  background: #222;
}

.facelet {
  aspect-ratio: 1;
  border: 1px solid #444;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.facelet:hover:not(.center) {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.facelet.selected {
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.8);
  transform: scale(1.15);
}

.facelet.center {
  cursor: not-allowed;
  opacity: 0.8;
}
```

### Interaction Patterns

#### Keyboard Shortcuts
```typescript
export const KEYBOARD_SHORTCUTS = {
  // Color selection (FR-1.2.5)
  '1': Color.WHITE,
  '2': Color.YELLOW,
  '3': Color.GREEN,
  '4': Color.BLUE,
  '5': Color.ORANGE,
  '6': Color.RED,

  // Navigation
  'ArrowRight': 'nextFace',
  'ArrowLeft': 'previousFace',
  'Enter': 'complete',
  'Escape': 'reset'
};
```

### Responsive Design

```typescript
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024
};

// Mobile: Single column, smaller facelets
// Tablet: Optimized for touch, larger targets
// Desktop: Full layout with keyboard shortcuts
```

---

## Error Handling

### Error Codes

```typescript
export enum ValidationErrorCode {
  // Color count errors
  COLOR_OVERUSE = 'COLOR_OVERUSE',              // > 9 of one color
  COLOR_UNDERUSE = 'COLOR_UNDERUSE',            // < 9 of one color

  // Piece errors
  INVALID_CORNER = 'INVALID_CORNER',            // Invalid corner combination
  INVALID_EDGE = 'INVALID_EDGE',                // Invalid edge combination
  OPPOSITE_COLORS_CORNER = 'OPPOSITE_COLORS_CORNER',  // Opposite colors on corner
  OPPOSITE_COLORS_EDGE = 'OPPOSITE_COLORS_EDGE',      // Opposite colors on edge
  DUPLICATE_COLORS_PIECE = 'DUPLICATE_COLORS_PIECE',  // Same color twice on piece

  // Solvability errors
  UNSOLVABLE_PARITY = 'UNSOLVABLE_PARITY',      // Cube has wrong parity
  UNSOLVABLE_STATE = 'UNSOLVABLE_STATE',        // Physically impossible state

  // Completeness errors
  INCOMPLETE_CONFIGURATION = 'INCOMPLETE_CONFIGURATION'  // Not all facelets set
}

export const ERROR_MESSAGES: Record<ValidationErrorCode, string> = {
  [ValidationErrorCode.COLOR_OVERUSE]:
    'The {color} color has been used {count} times. Each color should appear exactly 9 times.',
  [ValidationErrorCode.COLOR_UNDERUSE]:
    'The {color} color has been used {count} times. Each color should appear exactly 9 times.',
  [ValidationErrorCode.INVALID_CORNER]:
    'The corner piece at {locations} has an invalid color combination: {colors}.',
  [ValidationErrorCode.INVALID_EDGE]:
    'The edge piece at {locations} has an invalid color combination: {colors}.',
  [ValidationErrorCode.OPPOSITE_COLORS_CORNER]:
    'The corner piece has opposite colors ({color1} and {color2}) which cannot appear together.',
  [ValidationErrorCode.OPPOSITE_COLORS_EDGE]:
    'The edge piece has opposite colors ({color1} and {color2}) which cannot appear together.',
  [ValidationErrorCode.DUPLICATE_COLORS_PIECE]:
    'The piece has the same color ({color}) appearing twice, which is impossible.',
  [ValidationErrorCode.UNSOLVABLE_PARITY]:
    'This cube configuration is unsolvable due to incorrect permutation parity.',
  [ValidationErrorCode.UNSOLVABLE_STATE]:
    'This cube configuration is physically impossible to achieve.',
  [ValidationErrorCode.INCOMPLETE_CONFIGURATION]:
    'Configuration is incomplete. Please configure all {remaining} remaining facelets.'
};
```

### Error Recovery

```typescript
export class ErrorRecoveryHandler {
  /**
   * Suggests fixes for validation errors
   */
  public suggestFix(error: ValidationError): string[];

  /**
   * Attempts automatic error correction (if safe)
   */
  public attemptAutoFix(error: ValidationError, state: CubeState): CubeState | null;

  /**
   * Highlights problematic facelets in UI
   */
  public highlightErrors(errors: ValidationError[]): void;
}
```

---

## Performance Considerations

### Optimization Strategies

1. **State Updates**
   - Debounce validation during rapid color changes
   - Batch UI updates for multiple state changes
   - Use RAF for smooth animations

2. **Rendering**
   - Virtual scrolling for large error lists (unlikely needed)
   - CSS transforms over layout changes
   - Minimize DOM manipulations

3. **Validation**
   - Cache validation results until state changes
   - Lazy validation (only when requested or on complete)
   - Progressive validation (validate as you go)

### Performance Targets

```typescript
export const PERFORMANCE_TARGETS = {
  COLOR_ASSIGNMENT_RESPONSE: 100,    // ms (NFR-1.2)
  VALIDATION_COMPLETE: 500,          // ms (NFR-3.1)
  RENDER_FPS: 60,                    // fps (NFR-3.2)
  STATE_UPDATE_BATCH: 16             // ms (one frame)
};
```

---

## Testing Strategy

### Test Coverage Plan

#### Unit Tests (Target: 100% coverage)

**State Management** (20 tests)
- ✓ CubeState initialization
- ✓ Color assignment operations
- ✓ Color count tracking
- ✓ Progress calculation
- ✓ Observer pattern
- ✓ Center facelet protection

**Validation Engine** (35 tests)
- ✓ Color count validation (6 tests: one per color)
- ✓ Corner piece validation (16 tests: 8 valid + 8 invalid)
- ✓ Edge piece validation (12 tests: 12 valid edges)
- ✓ Opposite color detection (6 tests)
- ✓ Duplicate color detection (3 tests)
- ✓ Solvability validation (4 tests)
- ✓ Error message generation (4 tests)

**Guided Flow Manager** (15 tests)
- ✓ Face order management
- ✓ Step progression
- ✓ Backward navigation
- ✓ Completion detection
- ✓ Progress tracking

**Components** (40 tests)
- ✓ CubeDisplay rendering (9 tests)
- ✓ ColorPalette functionality (8 tests)
- ✓ ProgressIndicator display (7 tests)
- ✓ ValidationDisplay messages (7 tests)
- ✓ NavigationControls interactions (9 tests)

**Integration** (15 tests)
- ✓ Complete configuration flow
- ✓ Error recovery flows
- ✓ State persistence
- ✓ Feature 2 integration

**Total: 125 unit tests**

#### Integration Tests (10 tests)

- ✓ Complete happy path: configure all 54 facelets
- ✓ Guided flow: step through all 6 faces
- ✓ Error detection: trigger each validation error
- ✓ Error recovery: fix errors and complete
- ✓ Resume configuration: save and restore state
- ✓ Keyboard shortcuts: full keyboard navigation
- ✓ Touch interactions: mobile device simulation
- ✓ Edge cases: rapid clicks, invalid input
- ✓ Feature integration: pass to Feature 2
- ✓ Performance: validate under load

#### E2E Tests (5 tests)

- ✓ New user: complete guided configuration from scratch
- ✓ Power user: use keyboard shortcuts to configure quickly
- ✓ Error correction: make mistakes and fix them
- ✓ Mobile user: complete on touch device
- ✓ Resume session: save progress and return

### Test Data

```typescript
/**
 * Test fixtures for various cube states
 */
export const TEST_FIXTURES = {
  // Valid solved cube
  SOLVED_CUBE: CubeState,

  // Valid scrambled cubes
  SCRAMBLED_EASY: CubeState,
  SCRAMBLED_MEDIUM: CubeState,
  SCRAMBLED_HARD: CubeState,

  // Invalid cubes for validation testing
  INVALID_COLOR_COUNT: CubeState,
  INVALID_CORNER: CubeState,
  INVALID_EDGE: CubeState,
  UNSOLVABLE_PARITY: CubeState,

  // Partial configurations
  PARTIALLY_CONFIGURED_1_FACE: CubeState,
  PARTIALLY_CONFIGURED_3_FACES: CubeState,
  PARTIALLY_CONFIGURED_5_FACES: CubeState
};
```

---

## Accessibility

### WCAG Compliance

#### Keyboard Navigation (NFR-2.3)
- ✓ Tab through all interactive elements
- ✓ Arrow keys for facelet selection
- ✓ Number keys for color assignment
- ✓ Enter to confirm, Escape to cancel

#### Screen Reader Support (NFR-2.2 extension)
- ✓ ARIA labels for all controls
- ✓ ARIA live regions for validation messages
- ✓ Descriptive alt text for visual elements

#### Visual Accessibility
- ✓ High contrast colors (NFR-2.1)
- ✓ Colorblind mode with patterns (NFR-2.2)
- ✓ Minimum touch target 44x44px
- ✓ Focus indicators

```typescript
export const ACCESSIBILITY_CONFIG = {
  ARIA_LABELS: {
    FACELET: (face: Face, pos: FaceletPosition) =>
      `${face} face, position ${pos}`,
    COLOR_BUTTON: (color: Color) =>
      `Select ${color} color`,
    PROGRESS: (current: number, total: number) =>
      `Configuration progress: ${current} of ${total} steps complete`
  },

  KEYBOARD_NAVIGATION: {
    TAB_ORDER: ['face-grid', 'color-palette', 'navigation', 'actions'],
    ARROW_KEYS: 'enable',
    SHORTCUTS: 'enable'
  }
};
```

---

## Security Considerations

### Input Validation
- Sanitize all user input (color selections, facelet positions)
- Validate data types and ranges
- Prevent XSS through proper escaping

### Data Privacy
- No external data transmission (client-side only)
- No storage of personal information
- Optional local storage with user consent

---

## Deployment Considerations

### Build Configuration

```typescript
// vite.config.ts additions
export default defineConfig({
  build: {
    lib: {
      entry: 'src/features/configuration/index.ts',
      name: 'CubeConfiguration',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'configuration-ui': [
            './src/features/configuration/components'
          ],
          'configuration-logic': [
            './src/features/configuration/logic'
          ]
        }
      }
    }
  }
});
```

### Bundle Size Target
- Total: < 50KB gzipped
- Initial load: < 30KB gzipped
- Code splitting for heavy components

---

## Future Enhancements (Out of Scope)

- Camera-based cube scanning
- Import/export configurations
- Multiple configuration presets
- Undo/redo history beyond session
- Cube animation during configuration
- Social sharing features
- Multi-language support
- Advanced validation (twist analysis)

---

## Requirements Coverage Matrix

| Requirement ID | Design Component | Test Coverage |
|---------------|------------------|---------------|
| FR-1.1.1 | CubeDisplay.render() | ✓ |
| FR-1.1.2 | CubeDisplay.renderFace() | ✓ |
| FR-1.1.3 | CubeDisplay.highlightFacelet() | ✓ |
| FR-1.1.4 | ConfigurationStateManager.createEmptyCubeState() | ✓ |
| FR-1.2.1 | ColorPalette.render() | ✓ |
| FR-1.2.2 | ConfigurationStateManager.setFaceletColor() | ✓ |
| FR-1.2.3 | ConfigurationStateManager.setFaceletColor() | ✓ |
| FR-1.2.4 | ConfigurationStateManager.setFaceletColor() | ✓ |
| FR-1.2.5 | KEYBOARD_SHORTCUTS config | ✓ |
| FR-2.1.1 | GuidedFlowManager.getCurrentFace() | ✓ |
| FR-2.1.2 | GuidedFlowManager.getCurrentInstructions() | ✓ |
| FR-2.1.3 | CubeDisplay.highlightFace() | ✓ |
| FR-2.1.4 | GuidedFlowManager.nextFace() | ✓ |
| FR-2.2.1 | ConfigurationStateManager.updateProgress() | ✓ |
| FR-2.2.2 | GuidedFlowManager.getCompletedFaces() | ✓ |
| FR-2.2.3 | GuidedFlowManager.getRemainingFaces() | ✓ |
| FR-2.2.4 | GuidedFlowManager.previousFace() | ✓ |
| FR-3.1.1 | CubeValidator.validate() | ✓ |
| FR-3.1.2 | ConfigurationStateManager.getColorCounts() | ✓ |
| FR-3.1.3 | ColorPalette.indicateOveruse() | ✓ |
| FR-3.1.4 | ColorPalette.indicateUnderuse() | ✓ |
| FR-3.2.1 | CubeValidator.validateColorCounts() | ✓ |
| FR-3.2.2 | CubeValidator.validateCornerPieces() | ✓ |
| FR-3.2.3 | CubeValidator.validateEdgePieces() | ✓ |
| FR-3.2.4 | CubeValidator.validatePhysicalPossibility() | ✓ |
| FR-3.2.5 | CubeValidator.validateSolvability() | ✓ |
| FR-3.3.1 | ValidationDisplay.render() | ✓ |
| FR-3.3.2 | ValidationDisplay.highlightErrorLocations() | ✓ |
| FR-3.3.3 | ValidationDisplay.renderFixGuidance() | ✓ |
| FR-3.3.4 | CubeConfigurationContainer.complete() | ✓ |
| NFR-1.1 | UI Design & Testing | ✓ |
| NFR-1.2 | Performance testing | ✓ |
| NFR-1.3 | User testing | ✓ |
| NFR-2.1 | Color palette spec | ✓ |
| NFR-2.2 | Colorblind mode | ✓ |
| NFR-2.3 | Keyboard navigation | ✓ |
| NFR-3.1 | Validation performance testing | ✓ |
| NFR-3.2 | Render performance testing | ✓ |

**Total Requirements Covered: 37/37 (100%)**

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-10 | Design Doc | Initial design document |
