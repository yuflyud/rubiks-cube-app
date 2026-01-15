# Rubik's Cube Assembly Mechanism

A computational engine that calculates solving sequences for configured Rubik's cube states.

## Overview

This feature transforms a validated cube configuration into an actionable solution path - a sequence of moves that will solve the cube. It serves as the computational bridge between Feature 1 (Configuration) and Feature 3 (Visualization).

## Project Structure

```
assembly/
├── logic/                          # Core solving logic
│   ├── SolutionCalculator.ts       # Main controller
│   ├── SimpleSolver.ts             # Solving algorithm
│   ├── StateSimulator.ts           # Move execution simulation
│   ├── SolutionBuilder.ts          # Solution construction
│   └── InputValidator.ts           # Input validation
├── utils/                          # Utility classes
│   └── MoveExecutor.ts             # Move execution engine
├── types/                          # TypeScript definitions
│   ├── assembly.types.ts           # Core types
│   └── errors.ts                   # Error types
├── styles/                         # Feature styles
│   └── assembly.css                # Placeholder styles
├── docs/                           # Documentation
│   └── specs/                      # Specifications
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── constants.ts                    # Move notation constants
├── index.ts                        # Public API
└── README.md                       # This file
```

## Quick Start

### Installation

This feature is part of the main application. Install dependencies:

```bash
npm install
```

### Usage

```typescript
import { SolutionCalculator } from './features/assembly';
import type { CubeState } from './features/configuration';

// Initialize calculator
const calculator = new SolutionCalculator();

// Calculate solution
const solution = await calculator.calculateSolution(cubeState);

console.log(`Solution found: ${solution.totalMoves} moves`);
console.log(`Algorithm: ${solution.algorithmUsed}`);
console.log(`Time: ${solution.calculationTimeMs}ms`);

// Access individual moves
solution.increments.forEach((increment) => {
  console.log(`${increment.stepNumber}. ${increment.notation} - ${increment.description}`);
});
```

## Key Features

### ⚙️ Solution Calculation
- Accepts validated cube states from Feature 1
- Calculates move sequences to solve the cube
- Generates step-by-step instructions
- Tracks intermediate states after each move

### 📝 Move Notation
- Supports all 18 standard Rubik's cube moves
- Basic moves: U, D, L, R, F, B (clockwise 90°)
- Prime moves: U', D', L', R', F', B' (counter-clockwise 90°)
- Double moves: U2, D2, L2, R2, F2, B2 (180°)

### 🎯 Solution Quality
- Validates solution correctness
- Tracks calculation time
- Provides complexity ratings (easy/medium/hard)
- Returns complete metadata

### ⚡ Performance
- Async calculation (non-blocking)
- Timeout protection (configurable)
- Move limit constraints (configurable)
- Efficient state immutability

## API

### SolutionCalculator

Main controller for solution calculation.

```typescript
class SolutionCalculator {
  constructor(config?: Partial<SolverConfig>);

  // Calculate solution
  calculateSolution(cubeState: CubeState): Promise<Solution>;

  // Check if solved
  isSolved(cubeState: CubeState): boolean;

  // Get/update configuration
  getConfig(): Readonly<SolverConfig>;
  updateConfig(config: Partial<SolverConfig>): void;
}
```

### Solution

Complete solution output with all details.

```typescript
interface Solution {
  initialState: CubeState;           // Starting configuration
  increments: AssemblyIncrement[];   // Move-by-move solution
  totalMoves: number;                // Number of moves
  algorithmUsed: string;             // Algorithm name
  calculationTimeMs: number;         // Calculation time
  isSolved: boolean;                 // Verification
  metadata: SolutionMetadata;        // Additional info
}
```

### AssemblyIncrement

Single move in the solution.

```typescript
interface AssemblyIncrement {
  stepNumber: number;                // 1-based step number
  notation: MoveNotation;            // Move notation (R, U', F2, etc.)
  face: Face;                        // Face being rotated
  direction: RotationDirection;      // Clockwise/counter-clockwise
  degrees: 90 | 180;                 // Rotation amount
  cubeStateAfter: CubeState;         // Resulting state
  description: string;               // Human-readable description
}
```

### SolverConfig

Configuration options for the solver.

```typescript
interface SolverConfig {
  maxMoves: number;      // Maximum moves allowed (default: 100)
  timeout: number;       // Max calculation time in ms (default: 5000)
  algorithm: string;     // Algorithm to use (default: 'layer-by-layer')
}
```

## Move Notation Reference

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

## Error Handling

### Error Types

```typescript
enum AssemblyErrorCode {
  INVALID_CUBE_STATE,        // Invalid cube configuration
  INCOMPLETE_CUBE_STATE,     // Missing facelets
  UNSOLVABLE_CUBE,           // Physically impossible state
  CALCULATION_TIMEOUT,       // Exceeded time limit
  ALGORITHM_ERROR,           // Solving algorithm failed
  MAX_MOVES_EXCEEDED,        // Too many moves required
  ALREADY_SOLVED             // Cube is already solved
}
```

### Error Handling Example

```typescript
try {
  const solution = await calculator.calculateSolution(cubeState);
  console.log('Solution found!', solution);
} catch (error) {
  if (error instanceof AssemblyError) {
    console.error(`Error [${error.code}]: ${error.message}`);

    switch (error.code) {
      case AssemblyErrorCode.CALCULATION_TIMEOUT:
        console.log('Try increasing the timeout limit');
        break;
      case AssemblyErrorCode.INVALID_CUBE_STATE:
        console.log('Check your cube configuration');
        break;
      // Handle other error types...
    }
  }
}
```

## Algorithm

### Current Implementation

**SimpleSolver** - A beginner's layer-by-layer approach

- ✅ Functional and correct
- ✅ Handles all valid cube states
- ⚠️ May produce longer solutions (50-80 moves)
- ⚠️ Not optimal for speed/move count

### Production Recommendation

For production use, replace `SimpleSolver` with **Kociemba's Two-Phase Algorithm**:

- ✅ Near-optimal solutions (< 30 moves typical)
- ✅ Fast calculation (< 1 second typical)
- ✅ Well-tested and proven
- ✅ Industry standard

**Implementation Options**:
1. Custom TypeScript implementation
2. WebAssembly port of C/C++ solver
3. Third-party npm package (e.g., `cube-solver`)

## Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✓ Move executor (all 18 moves)
- ✓ State simulator
- ✓ Solution builder
- ✓ Input validator
- ✓ Error handling
- ✓ Solution calculator
- ✓ Integration tests

## Performance

### Targets

- Simple scrambles (< 10 moves): < 1 second
- Typical scrambles (10-20 moves): < 2 seconds
- Complex scrambles (> 20 moves): < 5 seconds

### Optimization Strategies

1. **Web Worker** - Offload calculation to background thread
2. **Caching** - Cache solutions for identical states
3. **Pruning Tables** - Pre-computed heuristics for faster search
4. **Move Tables** - Pre-computed state transitions

## Integration

### Input from Feature 1

Receives validated `CubeState` from the Configuration feature:

```typescript
import { CubeConfigurationContainer } from './features/configuration';
import { SolutionCalculator } from './features/assembly';

const calculator = new SolutionCalculator();

new CubeConfigurationContainer(container, {
  onComplete: async (state, validationResult) => {
    const solution = await calculator.calculateSolution(state);
    // Pass to Feature 3...
  }
});
```

### Output to Feature 3

Provides `Solution` object to the Visualization feature:

```typescript
// In future Feature 3 implementation
visualizationFeature.displaySolution(solution);
```

## Future Enhancements

Potential improvements for future iterations:

- [ ] Implement Kociemba's algorithm for optimal solutions
- [ ] Add Web Worker for async calculation
- [ ] Implement solution caching
- [ ] Support multiple algorithms (CFOP, Roux, ZZ)
- [ ] Algorithm selection UI
- [ ] Solution comparison
- [ ] Move optimization (remove redundant moves)
- [ ] Progress callbacks during calculation

## Documentation

- **[Requirements](./docs/specs/requirements.md)** - Feature requirements
- **[Design](./docs/specs/design.md)** - Technical design and architecture
- **[Tasks](./docs/specs/tasks.md)** - Implementation task breakdown

## Contributing

When adding features to this module:
1. Follow the existing structure
2. Add TypeScript types
3. Write unit tests
4. Update documentation
5. Maintain immutability
6. Handle errors gracefully

## License

Part of the Rubik's Cube Solver application.

---

**Status**: ✅ Functional and Integrated
**Version**: 1.0.0
**Last Updated**: January 2026
**Algorithm**: SimpleSolver (layer-by-layer approach)
**Production Ready**: Functional but not optimized (use Kociemba for production)
