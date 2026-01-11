# Feature 2: Rubik's Cube Assembly Mechanism - Technical Design

## Design Overview

| Property | Value |
|----------|-------|
| Feature ID | F-002 |
| Feature Name | Rubik's Cube Assembly Mechanism |
| Design Status | Draft |
| Last Updated | 2026-01-10 |

---

## Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────┐
│               Assembly Mechanism Module                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Input Validator │─────▶│  Solving Engine  │        │
│  └──────────────────┘      └──────────────────┘        │
│          ▲                          │                    │
│          │                          ▼                    │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Cube State      │◀─────│  Move Generator  │        │
│  │  Transformer     │      └──────────────────┘        │
│  └──────────────────┘               │                   │
│          │                           ▼                   │
│          │                  ┌──────────────────┐        │
│          └─────────────────▶│ Solution Builder │        │
│                             └──────────────────┘        │
│                                      │                   │
└──────────────────────────────────────┼───────────────────┘
                                       │
                                       ▼
                            ┌────────────────────┐
                            │   Visualization    │
                            │   (Feature 3)      │
                            └────────────────────┘
```

### Technology Stack

- **Core Algorithm**: Kociemba's Two-Phase Algorithm
- **Algorithm Library**: Custom TypeScript implementation (or `cube-solver` package)
- **State Representation**: Facelet notation (54-element array)
- **Move Engine**: Custom move execution logic
- **Async Processing**: Web Workers for non-blocking calculation
- **Testing**: Vitest with 100% coverage target

---

## Data Models

### Core Data Structures

```typescript
/**
 * Face and Color enums (imported from Feature 1)
 */
import { Face, Color, CubeState } from '@/features/configuration/types';

/**
 * Move notation for Rubik's cube
 */
export enum MoveNotation {
  // Basic moves (clockwise 90°)
  U = 'U',   // Up face
  D = 'D',   // Down face
  L = 'L',   // Left face
  R = 'R',   // Right face
  F = 'F',   // Front face
  B = 'B',   // Back face

  // Inverse moves (counter-clockwise 90°)
  U_PRIME = "U'",
  D_PRIME = "D'",
  L_PRIME = "L'",
  R_PRIME = "R'",
  F_PRIME = "F'",
  B_PRIME = "B'",

  // Double moves (180°)
  U2 = 'U2',
  D2 = 'D2',
  L2 = 'L2',
  R2 = 'R2',
  F2 = 'F2',
  B2 = 'B2'
}

/**
 * Direction of rotation
 */
export enum RotationDirection {
  CLOCKWISE = 'clockwise',
  COUNTER_CLOCKWISE = 'counterclockwise'
}

/**
 * Rotation degrees
 */
export type RotationDegrees = 90 | 180;

/**
 * Single move in the solution
 * FR-4.1.1 - FR-4.1.6
 */
export interface AssemblyIncrement {
  stepNumber: number;              // 1-based sequential number
  notation: MoveNotation;          // Move notation (e.g., R, U', F2)
  face: Face;                      // Face being rotated
  direction: RotationDirection;    // Clockwise or counter-clockwise
  degrees: RotationDegrees;        // 90 or 180
  cubeStateAfter: CubeState;       // Resulting state after this move
  description: string;             // Human-readable description
}

/**
 * Complete solution from initial to solved state
 * FR-4.2.1, FR-4.2.2
 */
export interface Solution {
  initialState: CubeState;                // Starting configuration
  increments: AssemblyIncrement[];        // Ordered list of moves
  totalMoves: number;                     // Total number of moves
  algorithmUsed: string;                  // Algorithm name/version
  calculationTimeMs: number;              // Time taken to calculate
  isSolved: boolean;                      // Final state is solved
  metadata: SolutionMetadata;
}

export interface SolutionMetadata {
  timestamp: Date;
  version: string;                        // Algorithm version
  complexity: 'easy' | 'medium' | 'hard'; // Solution complexity
}

/**
 * Internal representation for solver
 * Uses Kociemba cube representation
 */
export interface KociembaCubeState {
  // Corner permutation (8 corners × 3 orientations = 24 values)
  cornerPermutation: number[];
  cornerOrientation: number[];

  // Edge permutation (12 edges × 2 orientations = 24 values)
  edgePermutation: number[];
  edgeOrientation: number[];
}

/**
 * Solver configuration
 */
export interface SolverConfig {
  maxMoves: number;                // Maximum solution length (default: 100)
  timeout: number;                 // Max calculation time in ms (default: 5000)
  algorithm: 'kociemba' | 'cfop' | 'layer-by-layer';
  useWebWorker: boolean;          // Use Web Worker for async processing
}
```

### Move Mapping

```typescript
/**
 * Maps move notation to face, direction, and degrees
 */
export const MOVE_DETAILS: Record<MoveNotation, {
  face: Face;
  direction: RotationDirection;
  degrees: RotationDegrees;
  description: string;
}> = {
  [MoveNotation.U]: {
    face: Face.UP,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate top face clockwise 90°'
  },
  [MoveNotation.U_PRIME]: {
    face: Face.UP,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate top face counter-clockwise 90°'
  },
  [MoveNotation.U2]: {
    face: Face.UP,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate top face 180°'
  },
  // ... (similar for D, L, R, F, B)
};
```

---

## Component Architecture

### Core Components

```
SolutionCalculator (Main Controller)
├── InputValidator (validates incoming cube state)
├── StateConverter (converts between formats)
├── KociembaSolver (core solving algorithm)
├── MoveGenerator (generates move sequence)
├── StateSimulator (applies moves to cube state)
└── SolutionBuilder (constructs final solution object)
```

### Component Details

#### 1. SolutionCalculator (Main Controller)

**Responsibility**: Orchestrates the solving process

```typescript
/**
 * Main entry point for solution calculation
 * FR-2.1.1, FR-2.1.2, FR-2.1.3
 */
export class SolutionCalculator {
  private config: SolverConfig;
  private validator: InputValidator;
  private converter: StateConverter;
  private solver: KociembaSolver;
  private builder: SolutionBuilder;

  constructor(config: Partial<SolverConfig> = {}) {
    this.config = {
      maxMoves: 100,
      timeout: 5000,
      algorithm: 'kociemba',
      useWebWorker: true,
      ...config
    };
    this.validator = new InputValidator();
    this.converter = new StateConverter();
    this.solver = new KociembaSolver();
    this.builder = new SolutionBuilder();
  }

  /**
   * Calculate solution for given cube state
   * FR-1.1.1, FR-2.1.1, FR-2.1.2, FR-2.1.3, FR-2.1.5
   */
  public async calculateSolution(cubeState: CubeState): Promise<Solution>;

  /**
   * Cancel ongoing calculation
   */
  public cancel(): void;

  /**
   * Check if cube is already solved
   */
  public isSolved(cubeState: CubeState): boolean;
}
```

**Algorithm Flow**:
```
1. Validate input cube state (FR-1.1.2, FR-1.1.3)
2. Check if already solved
3. Convert to internal representation
4. Run Kociemba solver
5. Generate move sequence
6. Build solution with increments
7. Verify solution correctness
8. Return Solution object
```

**Unit Test Coverage**:
- ✓ Calculate solution for valid cube state
- ✓ Calculate solution for already solved cube
- ✓ Reject invalid cube state
- ✓ Reject incomplete cube state
- ✓ Complete within timeout
- ✓ Handle timeout gracefully
- ✓ Use Web Worker when configured
- ✓ Cancel ongoing calculation
- ✓ Verify solution correctness
- ✓ Track calculation time

#### 2. InputValidator

**Responsibility**: Validates incoming cube state

```typescript
/**
 * Validates cube state before processing
 * FR-1.1.2, FR-1.1.3
 */
export class InputValidator {
  /**
   * Validates cube state is complete and valid
   */
  public validate(cubeState: CubeState): ValidationResult;

  /**
   * Checks if all 54 facelets are defined
   * FR-1.1.2
   */
  private isComplete(cubeState: CubeState): boolean;

  /**
   * Checks if cube state is valid (from Feature 1)
   * FR-1.1.3
   */
  private isValid(cubeState: CubeState): boolean;

  /**
   * Ensures data structure is correct
   */
  private validateStructure(cubeState: CubeState): boolean;
}
```

**Unit Test Coverage**:
- ✓ Accept valid, complete cube state
- ✓ Reject incomplete cube state
- ✓ Reject invalid cube state
- ✓ Reject malformed data structure
- ✓ Return detailed error messages

#### 3. StateConverter

**Responsibility**: Convert between different cube state representations

```typescript
/**
 * Converts between CubeState and KociembaCubeState
 */
export class StateConverter {
  /**
   * Converts facelet notation to Kociemba notation
   */
  public toKociemba(cubeState: CubeState): KociembaCubeState;

  /**
   * Converts Kociemba notation to facelet notation
   */
  public fromKociemba(kociembaState: KociembaCubeState): CubeState;

  /**
   * Extracts corner pieces from cube state
   */
  private extractCorners(cubeState: CubeState): CornerData;

  /**
   * Extracts edge pieces from cube state
   */
  private extractEdges(cubeState: CubeState): EdgeData;
}

interface CornerData {
  permutation: number[];  // Which corner is in which position
  orientation: number[];  // Orientation of each corner (0, 1, or 2)
}

interface EdgeData {
  permutation: number[];  // Which edge is in which position
  orientation: number[];  // Orientation of each edge (0 or 1)
}
```

**Unit Test Coverage**:
- ✓ Convert solved cube to Kociemba format
- ✓ Convert scrambled cube to Kociemba format
- ✓ Convert Kociemba format back to CubeState
- ✓ Round-trip conversion maintains state
- ✓ Extract corners correctly
- ✓ Extract edges correctly
- ✓ Calculate orientations correctly

#### 4. KociembaSolver

**Responsibility**: Core solving algorithm implementation

```typescript
/**
 * Implements Kociemba's two-phase algorithm
 * FR-2.1.1, FR-2.1.2, FR-2.1.3, FR-2.1.4
 */
export class KociembaSolver {
  private pruningTables: PruningTables;
  private moveTables: MoveTables;

  constructor() {
    this.pruningTables = this.initializePruningTables();
    this.moveTables = this.initializeMoveTables();
  }

  /**
   * Solves the cube and returns move sequence
   * FR-2.1.1, FR-2.1.2, FR-2.1.3
   */
  public solve(state: KociembaCubeState, maxMoves: number): MoveNotation[];

  /**
   * Phase 1: Reduce to G1 subgroup
   * (Edge orientation, corner orientation, E-slice edges)
   */
  private phase1(state: KociembaCubeState): MoveNotation[];

  /**
   * Phase 2: Solve within G1 subgroup
   * (Corner permutation, edge permutation in U/D, E-slice permutation)
   */
  private phase2(state: KociembaCubeState): MoveNotation[];

  /**
   * IDA* search for optimal phase solution
   */
  private idaStarSearch(
    state: KociembaCubeState,
    maxDepth: number,
    phase: 1 | 2
  ): MoveNotation[];

  /**
   * Applies a move to the cube state
   */
  private applyMove(state: KociembaCubeState, move: MoveNotation): KociembaCubeState;

  /**
   * Calculates heuristic for IDA* search
   */
  private calculateHeuristic(state: KociembaCubeState, phase: 1 | 2): number;
}

interface PruningTables {
  cornerOrientationTable: number[];
  edgeOrientationTable: number[];
  edgeSliceTable: number[];
  cornerPermutationTable: number[];
  edgePermutationTable: number[];
}

interface MoveTables {
  cornerMove: number[][];
  edgeMove: number[][];
}
```

**Unit Test Coverage**:
- ✓ Solve simple scrambles (< 10 moves)
- ✓ Solve medium scrambles (10-20 moves)
- ✓ Solve complex scrambles (> 20 moves)
- ✓ Phase 1 reduces to G1 subgroup
- ✓ Phase 2 solves within G1
- ✓ IDA* search finds solution
- ✓ Apply moves correctly
- ✓ Calculate heuristics accurately
- ✓ Respect max moves limit
- ✓ Initialize pruning tables correctly

#### 5. StateSimulator

**Responsibility**: Apply moves to cube state and track intermediate states

```typescript
/**
 * Simulates move execution and tracks cube states
 * FR-1.2.2, FR-1.2.3, FR-4.1.5
 */
export class StateSimulator {
  /**
   * Applies a single move to cube state
   */
  public applyMove(state: CubeState, move: MoveNotation): CubeState;

  /**
   * Applies a sequence of moves
   */
  public applyMoves(state: CubeState, moves: MoveNotation[]): CubeState;

  /**
   * Generates intermediate states for each move
   * FR-4.1.5
   */
  public generateIntermediateStates(
    initialState: CubeState,
    moves: MoveNotation[]
  ): CubeState[];

  /**
   * Rotates a face clockwise 90°
   */
  private rotateFaceClockwise(state: CubeState, face: Face): CubeState;

  /**
   * Rotates a face counter-clockwise 90°
   */
  private rotateFaceCounterClockwise(state: CubeState, face: Face): CubeState;

  /**
   * Rotates a face 180°
   */
  private rotateFace180(state: CubeState, face: Face): CubeState;

  /**
   * Updates adjacent faces after a rotation
   */
  private updateAdjacentFaces(state: CubeState, face: Face): CubeState;
}

/**
 * Move execution lookup tables
 * Defines which facelets move where for each move
 */
const MOVE_TABLES = {
  U: {
    faceRotation: [2, 5, 8, 1, 4, 7, 0, 3, 6],  // Face itself rotates
    adjacentChanges: [
      // Front row → Right row → Back row → Left row → Front row
      { from: 'F', positions: [0, 1, 2], to: 'R', toPositions: [0, 1, 2] },
      { from: 'R', positions: [0, 1, 2], to: 'B', toPositions: [0, 1, 2] },
      { from: 'B', positions: [0, 1, 2], to: 'L', toPositions: [0, 1, 2] },
      { from: 'L', positions: [0, 1, 2], to: 'F', toPositions: [0, 1, 2] }
    ]
  },
  // ... (similar for D, L, R, F, B)
};
```

**Unit Test Coverage**:
- ✓ Apply U move correctly
- ✓ Apply D move correctly
- ✓ Apply L move correctly
- ✓ Apply R move correctly
- ✓ Apply F move correctly
- ✓ Apply B move correctly
- ✓ Apply prime moves correctly (all 6)
- ✓ Apply double moves correctly (all 6)
- ✓ Apply move sequence correctly
- ✓ Generate intermediate states
- ✓ Maintain state immutability
- ✓ Verify move cancellation (U then U' returns to original)

#### 6. SolutionBuilder

**Responsibility**: Construct final Solution object with all metadata

```typescript
/**
 * Builds complete solution with increments
 * FR-3.1.1-FR-3.1.4, FR-3.2.1-FR-3.2.5, FR-4.1.1-FR-4.1.6
 */
export class SolutionBuilder {
  private simulator: StateSimulator;

  constructor() {
    this.simulator = new StateSimulator();
  }

  /**
   * Builds complete solution from move sequence
   * FR-4.1.1-FR-4.1.6, FR-4.2.1, FR-4.2.2
   */
  public buildSolution(
    initialState: CubeState,
    moves: MoveNotation[],
    algorithmUsed: string,
    calculationTimeMs: number
  ): Solution;

  /**
   * Creates assembly increments with all details
   * FR-4.1.1-FR-4.1.6
   */
  private createIncrements(
    initialState: CubeState,
    moves: MoveNotation[]
  ): AssemblyIncrement[];

  /**
   * Generates human-readable description for a move
   * FR-3.2.1-FR-3.2.5
   */
  private generateDescription(move: MoveNotation): string;

  /**
   * Extracts face from move notation
   * FR-3.2.3
   */
  private extractFace(move: MoveNotation): Face;

  /**
   * Extracts direction from move notation
   * FR-3.2.4
   */
  private extractDirection(move: MoveNotation): RotationDirection;

  /**
   * Extracts degrees from move notation
   * FR-3.2.5
   */
  private extractDegrees(move: MoveNotation): RotationDegrees;

  /**
   * Determines solution complexity
   */
  private calculateComplexity(totalMoves: number): 'easy' | 'medium' | 'hard';
}
```

**Unit Test Coverage**:
- ✓ Build solution from empty move sequence (already solved)
- ✓ Build solution with single move
- ✓ Build solution with multiple moves
- ✓ Create increments with correct step numbers
- ✓ Include notation in each increment
- ✓ Include face in each increment
- ✓ Include direction in each increment
- ✓ Include degrees in each increment
- ✓ Include cube state after each move
- ✓ Generate human-readable descriptions
- ✓ Calculate total moves correctly
- ✓ Include metadata
- ✓ Calculate complexity correctly

---

## Algorithms & Implementation

### Kociemba's Two-Phase Algorithm

#### Overview

The Kociemba algorithm solves the Rubik's cube in two phases:

**Phase 1**: Reduce the cube to subgroup G1
- Orient all edges (edge orientation = 0)
- Orient all corners (corner orientation = 0)
- Place E-slice edges in E-slice

**Phase 2**: Solve within G1 using only G1 moves
- Permute corners
- Permute edges in U/D faces
- Permute E-slice edges

#### Advantages
- Fast calculation (< 1 second typical)
- Reasonable solution length (< 30 moves typical)
- Proven correctness
- Well-documented

#### Coordinate System

```typescript
/**
 * Kociemba uses three coordinate systems for Phase 1
 */
interface Phase1Coordinates {
  cornerOrientation: number;  // 0 to 2186 (3^7 possibilities)
  edgeOrientation: number;    // 0 to 2047 (2^11 possibilities)
  edgeSlice: number;          // 0 to 494 (C(12,4) possibilities)
}

/**
 * And three coordinate systems for Phase 2
 */
interface Phase2Coordinates {
  cornerPermutation: number;  // 0 to 40319 (8! possibilities)
  edgePermutation: number;    // 0 to 40319 (8! for UD edges)
  slicePermutation: number;   // 0 to 23 (4! for E-slice)
}
```

#### Move Tables

```typescript
/**
 * Pre-computed move tables for fast state transitions
 * Dimensions: [coordinate][move] = new coordinate
 */
export class MoveTables {
  // Phase 1 tables
  cornerOrientationMove: number[][];  // [2187][18]
  edgeOrientationMove: number[][];    // [2048][18]
  edgeSliceMove: number[][];          // [495][18]

  // Phase 2 tables
  cornerPermutationMove: number[][];  // [40320][10]
  edgePermutationMove: number[][];    // [40320][10]
  slicePermutationMove: number[][];   // [24][10]

  /**
   * Initialize all move tables
   * This is done once at startup
   */
  public initialize(): void;
}
```

#### Pruning Tables

```typescript
/**
 * Pre-computed pruning tables for IDA* heuristic
 * Stores minimum number of moves to solve from each coordinate
 */
export class PruningTables {
  // Phase 1 pruning
  phase1Pruning: number[];  // Combined coordinates

  // Phase 2 pruning
  phase2Pruning: number[];  // Combined coordinates

  /**
   * Initialize pruning tables using BFS
   */
  public initialize(): void;

  /**
   * Get heuristic for IDA* search
   */
  public getHeuristic(coordinates: Phase1Coordinates | Phase2Coordinates): number;
}
```

### Alternative Algorithms (Future)

#### CFOP (Fridrich Method)
- **Pros**: Beginner-friendly, intuitive steps
- **Cons**: Longer solutions (50-80 moves), more complex implementation
- **Use case**: Educational mode

#### Layer-by-Layer
- **Pros**: Simplest to implement, easiest to understand
- **Cons**: Very long solutions (100+ moves), slow
- **Use case**: Debugging, testing

---

## API Interfaces

### Public API

```typescript
/**
 * Main API for the Assembly Mechanism feature
 */
export interface AssemblyMechanismAPI {
  /**
   * Calculate solution for given cube state
   * FR-2.1.1, FR-2.1.2, FR-2.1.3
   */
  calculateSolution(cubeState: CubeState, config?: Partial<SolverConfig>): Promise<Solution>;

  /**
   * Cancel ongoing calculation
   */
  cancelCalculation(): void;

  /**
   * Check if cube is solved
   */
  isSolved(cubeState: CubeState): boolean;

  /**
   * Get algorithm information
   */
  getAlgorithmInfo(): AlgorithmInfo;

  /**
   * Event handlers
   */
  on(event: 'progress', handler: (progress: number) => void): void;
  on(event: 'complete', handler: (solution: Solution) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'timeout', handler: () => void): void;
}

export interface AlgorithmInfo {
  name: string;
  version: string;
  description: string;
  averageMovescount: number;
  maxMoves: number;
}
```

### Integration Points

#### Input from Feature 1

```typescript
/**
 * Receives validated cube state from Configuration
 */
export interface ConfigurationOutput {
  cubeState: CubeState;
  validationResult: ValidationResult;
  timestamp: Date;
}

export type OnConfigurationComplete = (output: ConfigurationOutput) => Promise<Solution>;
```

#### Output to Feature 3

```typescript
/**
 * Provides solution to Visualization feature
 * FR-4.2.1
 */
export interface VisualizationInput {
  solution: Solution;
  onStepComplete?: (stepNumber: number) => void;
  onSolutionComplete?: () => void;
}
```

---

## Error Handling

### Error Types

```typescript
export enum SolverErrorCode {
  // Input errors
  INVALID_INPUT = 'INVALID_INPUT',
  INCOMPLETE_STATE = 'INCOMPLETE_STATE',
  UNSOLVABLE_STATE = 'UNSOLVABLE_STATE',

  // Calculation errors
  TIMEOUT = 'TIMEOUT',
  MAX_MOVES_EXCEEDED = 'MAX_MOVES_EXCEEDED',
  ALGORITHM_FAILURE = 'ALGORITHM_FAILURE',

  // System errors
  WORKER_ERROR = 'WORKER_ERROR',
  OUT_OF_MEMORY = 'OUT_OF_MEMORY'
}

export class SolverError extends Error {
  constructor(
    public code: SolverErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SolverError';
  }
}

export const ERROR_MESSAGES: Record<SolverErrorCode, string> = {
  [SolverErrorCode.INVALID_INPUT]:
    'The cube state is invalid and cannot be solved.',
  [SolverErrorCode.INCOMPLETE_STATE]:
    'The cube state is incomplete. All 54 facelets must be defined.',
  [SolverErrorCode.UNSOLVABLE_STATE]:
    'This cube configuration cannot be solved. It may be physically impossible.',
  [SolverErrorCode.TIMEOUT]:
    'Solution calculation timed out. Try increasing the timeout limit.',
  [SolverErrorCode.MAX_MOVES_EXCEEDED]:
    'Could not find a solution within the maximum move limit.',
  [SolverErrorCode.ALGORITHM_FAILURE]:
    'The solving algorithm encountered an unexpected error.',
  [SolverErrorCode.WORKER_ERROR]:
    'Web Worker encountered an error during calculation.',
  [SolverErrorCode.OUT_OF_MEMORY]:
    'Ran out of memory during calculation. Try a simpler cube state.'
};
```

### Error Handling Strategy

```typescript
/**
 * Handles errors gracefully with fallbacks
 */
export class ErrorHandler {
  /**
   * Handles solver errors
   * NFR-3.1, NFR-3.2
   */
  public handleError(error: Error): SolverError;

  /**
   * Provides user-friendly error messages
   * NFR-3.2
   */
  public formatErrorMessage(error: SolverError): string;

  /**
   * Determines if error is recoverable
   */
  public isRecoverable(error: SolverError): boolean;

  /**
   * Suggests recovery actions
   */
  public suggestRecovery(error: SolverError): string[];
}
```

**Unit Test Coverage**:
- ✓ Handle invalid input errors
- ✓ Handle timeout errors
- ✓ Handle algorithm failures
- ✓ Format error messages
- ✓ Identify recoverable errors
- ✓ Suggest recovery actions

---

## Performance Optimization

### Web Worker Implementation

```typescript
/**
 * Offloads heavy calculation to Web Worker
 * NFR-1.3
 */
export class SolverWorker {
  private worker: Worker | null;

  /**
   * Initializes Web Worker
   */
  public initialize(): void;

  /**
   * Solves cube in background thread
   */
  public solve(state: KociembaCubeState, config: SolverConfig): Promise<MoveNotation[]>;

  /**
   * Terminates worker
   */
  public terminate(): void;
}

// solver.worker.ts
self.onmessage = (event: MessageEvent<{
  state: KociembaCubeState;
  config: SolverConfig;
}>) => {
  const { state, config } = event.data;
  const solver = new KociembaSolver();

  try {
    const solution = solver.solve(state, config.maxMoves);
    self.postMessage({ success: true, solution });
  } catch (error) {
    self.postMessage({ success: false, error });
  }
};
```

### Caching Strategy

```typescript
/**
 * Caches solutions for identical cube states
 */
export class SolutionCache {
  private cache: Map<string, Solution>;
  private maxSize: number;

  /**
   * Gets cached solution if available
   */
  public get(cubeState: CubeState): Solution | null;

  /**
   * Stores solution in cache
   */
  public set(cubeState: CubeState, solution: Solution): void;

  /**
   * Generates cache key from cube state
   */
  private generateKey(cubeState: CubeState): string;

  /**
   * Implements LRU eviction
   */
  private evictOldest(): void;
}
```

### Performance Targets

```typescript
export const PERFORMANCE_TARGETS = {
  SIMPLE_SOLVE: 1000,      // ms - cubes with < 10 move solutions
  TYPICAL_SOLVE: 2000,     // ms - typical scrambled cubes (NFR-1.2)
  MAX_SOLVE: 5000,         // ms - any valid cube (NFR-1.1)
  WORKER_OVERHEAD: 50,     // ms - Web Worker initialization
  STATE_CONVERSION: 10     // ms - Format conversion
};
```

**Unit Test Coverage**:
- ✓ Web Worker initialization
- ✓ Solve in Web Worker
- ✓ Terminate Web Worker
- ✓ Cache hit returns cached solution
- ✓ Cache miss calculates new solution
- ✓ LRU eviction works correctly
- ✓ Performance meets targets

---

## Testing Strategy

### Unit Tests (Target: 100% coverage)

#### SolutionCalculator (15 tests)
- ✓ Calculate solution for valid cube
- ✓ Handle already solved cube
- ✓ Reject invalid input
- ✓ Respect timeout
- ✓ Use Web Worker
- ✓ Cancel calculation
- ✓ Track calculation time
- ✓ Return correct solution format
- ✓ Verify solution correctness
- ✓ Handle edge cases

#### InputValidator (5 tests)
- ✓ Accept valid complete state
- ✓ Reject incomplete state
- ✓ Reject invalid state
- ✓ Validate structure
- ✓ Return helpful errors

#### StateConverter (10 tests)
- ✓ Convert solved cube to Kociemba
- ✓ Convert scrambled cube to Kociemba
- ✓ Convert Kociemba to CubeState
- ✓ Round-trip conversion
- ✓ Extract corners
- ✓ Extract edges
- ✓ Calculate corner orientations
- ✓ Calculate edge orientations
- ✓ Handle all 24 corner orientations
- ✓ Handle all 12 edge orientations

#### KociembaSolver (25 tests)
- ✓ Solve simple scrambles (5 tests)
- ✓ Solve medium scrambles (5 tests)
- ✓ Solve complex scrambles (5 tests)
- ✓ Phase 1 correctness (3 tests)
- ✓ Phase 2 correctness (3 tests)
- ✓ IDA* search (2 tests)
- ✓ Pruning tables (2 tests)

#### StateSimulator (25 tests)
- ✓ Apply each basic move (6 tests)
- ✓ Apply each prime move (6 tests)
- ✓ Apply each double move (6 tests)
- ✓ Apply move sequences (3 tests)
- ✓ Generate intermediate states (2 tests)
- ✓ Verify move cancellation (2 tests)

#### SolutionBuilder (15 tests)
- ✓ Build solution from empty moves
- ✓ Build solution with single move
- ✓ Build solution with multiple moves
- ✓ Create correct increments (5 tests)
- ✓ Generate descriptions (6 tests)
- ✓ Calculate complexity (3 tests)

#### ErrorHandler (6 tests)
- ✓ Handle each error type (5 tests)
- ✓ Format error messages (1 test)

#### Performance (10 tests)
- ✓ Web Worker initialization (2 tests)
- ✓ Caching (4 tests)
- ✓ Performance targets (4 tests)

**Total: 111 unit tests**

### Integration Tests (8 tests)

- ✓ End-to-end: configuration → solution → visualization
- ✓ Already solved cube returns empty solution
- ✓ Invalid cube returns error
- ✓ Timeout handling
- ✓ Web Worker communication
- ✓ Solution verification (apply moves leads to solved cube)
- ✓ Large solution (> 50 moves)
- ✓ Performance under load

### Algorithm Verification Tests (20 tests)

```typescript
/**
 * Verify algorithm correctness with known test cases
 */
export const ALGORITHM_TEST_CASES = [
  {
    name: 'Superflip',
    scramble: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
    expectedMoves: 20,  // Optimal known solution
  },
  {
    name: 'Checkerboard',
    scramble: "U2 D2 F2 B2 L2 R2",
    expectedMoves: 6,
  },
  // ... 18 more test cases
];
```

- ✓ Solve all 20 known test cases correctly
- ✓ Solution length within acceptable range

**Total Tests: 111 + 8 + 20 = 139 tests**

---

## Move Notation Reference

### Standard Notation (FR-2.2.1 - FR-2.2.4)

| Notation | Face | Direction | Degrees | Description |
|----------|------|-----------|---------|-------------|
| U | Up (Top) | Clockwise | 90° | Rotate top face clockwise |
| U' | Up (Top) | Counter-clockwise | 90° | Rotate top face counter-clockwise |
| U2 | Up (Top) | Either | 180° | Rotate top face 180° |
| D | Down (Bottom) | Clockwise | 90° | Rotate bottom face clockwise |
| D' | Down (Bottom) | Counter-clockwise | 90° | Rotate bottom face counter-clockwise |
| D2 | Down (Bottom) | Either | 180° | Rotate bottom face 180° |
| L | Left | Clockwise | 90° | Rotate left face clockwise |
| L' | Left | Counter-clockwise | 90° | Rotate left face counter-clockwise |
| L2 | Left | Either | 180° | Rotate left face 180° |
| R | Right | Clockwise | 90° | Rotate right face clockwise |
| R' | Right | Counter-clockwise | 90° | Rotate right face counter-clockwise |
| R2 | Right | Either | 180° | Rotate right face 180° |
| F | Front | Clockwise | 90° | Rotate front face clockwise |
| F' | Front | Counter-clockwise | 90° | Rotate front face counter-clockwise |
| F2 | Front | Either | 180° | Rotate front face 180° |
| B | Back | Clockwise | 90° | Rotate back face clockwise |
| B' | Back | Counter-clockwise | 90° | Rotate back face counter-clockwise |
| B2 | Back | Either | 180° | Rotate back face 180° |

**Note**: Slice moves (M, E, S) are intentionally excluded for simplicity (FR-2.2.5)

---

## Security & Privacy

### Data Handling
- All computation performed client-side
- No external API calls
- No data transmission
- No data storage (unless explicitly requested)

### Input Sanitization
- Validate all cube state inputs
- Type checking for all parameters
- Range validation for numeric values

---

## Deployment Considerations

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/features/assembly/index.ts',
      name: 'AssemblyMechanism',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'solver-core': ['./src/features/assembly/solver'],
          'solver-worker': ['./src/features/assembly/solver.worker']
        }
      }
    }
  },
  worker: {
    format: 'es'
  }
});
```

### Bundle Size Targets
- Solver core: < 40KB gzipped
- Move tables: < 20KB gzipped
- Pruning tables: < 30KB gzipped (lazy loaded)
- Web Worker: < 50KB gzipped
- **Total: < 100KB gzipped**

### Lazy Loading

```typescript
/**
 * Lazy load pruning tables on first solve
 */
export class LazyPruningTables {
  private tables: PruningTables | null = null;

  public async load(): Promise<PruningTables> {
    if (!this.tables) {
      const module = await import('./pruning-tables.data');
      this.tables = module.default;
    }
    return this.tables;
  }
}
```

---

## Future Enhancements (Out of Scope)

- Multiple algorithm options (CFOP, Layer-by-Layer)
- Optimal solutions (minimum moves)
- Solution caching/storage
- Solution comparison
- Algorithm learning mode
- Custom move restrictions
- Solution animation preview

---

## Requirements Coverage Matrix

| Requirement ID | Design Component | Test Coverage |
|---------------|------------------|---------------|
| FR-1.1.1 | InputValidator.validate() | ✓ |
| FR-1.1.2 | InputValidator.isComplete() | ✓ |
| FR-1.1.3 | InputValidator.isValid() | ✓ |
| FR-1.1.4 | StateConverter | ✓ |
| FR-1.2.1 | ConfigurationStateManager (Feature 1) | ✓ |
| FR-1.2.2 | StateSimulator.applyMove() | ✓ |
| FR-1.2.3 | StateSimulator.generateIntermediateStates() | ✓ |
| FR-2.1.1 | KociembaSolver.solve() | ✓ |
| FR-2.1.2 | SolutionCalculator.calculateSolution() | ✓ |
| FR-2.1.3 | SolutionBuilder.buildSolution() | ✓ |
| FR-2.1.4 | KociembaSolver optimization | ✓ |
| FR-2.1.5 | SolutionCalculator timeout handling | ✓ |
| FR-2.2.1 | MoveNotation enum | ✓ |
| FR-2.2.2 | MoveNotation (basic moves) | ✓ |
| FR-2.2.3 | MoveNotation (prime moves) | ✓ |
| FR-2.2.4 | MoveNotation (double moves) | ✓ |
| FR-2.2.5 | MoveNotation (no slice moves) | ✓ |
| FR-3.1.1 | AssemblyIncrement.stepNumber | ✓ |
| FR-3.1.2 | Solution.increments ordering | ✓ |
| FR-3.1.3 | AssemblyIncrement.stepNumber | ✓ |
| FR-3.1.4 | Solution.totalMoves | ✓ |
| FR-3.2.1 | AssemblyIncrement.notation | ✓ |
| FR-3.2.2 | AssemblyIncrement.description | ✓ |
| FR-3.2.3 | AssemblyIncrement.face | ✓ |
| FR-3.2.4 | AssemblyIncrement.direction | ✓ |
| FR-3.2.5 | AssemblyIncrement.degrees | ✓ |
| FR-4.1.1 | AssemblyIncrement.notation | ✓ |
| FR-4.1.2 | AssemblyIncrement.face | ✓ |
| FR-4.1.3 | AssemblyIncrement.direction | ✓ |
| FR-4.1.4 | AssemblyIncrement.degrees | ✓ |
| FR-4.1.5 | AssemblyIncrement.cubeStateAfter | ✓ |
| FR-4.1.6 | AssemblyIncrement.stepNumber | ✓ |
| FR-4.2.1 | Solution structure | ✓ |
| FR-4.2.2 | Solution.metadata | ✓ |
| FR-4.2.3 | Solution serialization (future) | - |
| NFR-1.1 | Performance testing (< 5s) | ✓ |
| NFR-1.2 | Performance testing (< 2s typical) | ✓ |
| NFR-1.3 | SolverWorker (async) | ✓ |
| NFR-2.1 | Solution verification tests | ✓ |
| NFR-2.2 | Algorithm test cases (< 100 moves) | ✓ |
| NFR-2.3 | KociembaSolver consistency | ✓ |
| NFR-3.1 | ErrorHandler | ✓ |
| NFR-3.2 | Error messages | ✓ |
| NFR-3.3 | Deterministic testing | ✓ |

**Total Requirements Covered: 42/43 (97.7%)**
*FR-4.2.3 (serialization) is marked as "Could" priority and deferred*

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-10 | Design Doc | Initial design document |
