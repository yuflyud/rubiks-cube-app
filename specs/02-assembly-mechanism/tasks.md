# Feature 2: Rubik's Cube Assembly Mechanism - Implementation Tasks

## Task Overview

| Property | Value |
|----------|-------|
| Feature ID | F-002 |
| Feature Name | Rubik's Cube Assembly Mechanism |
| Total Tasks | 28 |
| Estimated Effort | High |
| Last Updated | 2026-01-11 |

---

## Task Breakdown

### Phase 1: Foundation & Data Models (5 tasks)

#### T-001: Setup Assembly Module Structure
**Priority**: Must
**Dependencies**: F-001 complete
**Effort**: Small

**Description**:
- Create feature directory structure: `src/features/assembly/`
- Setup subdirectories: `solver/`, `types/`, `utils/`, `__tests__/`
- Configure TypeScript compilation for assembly module
- Setup module exports in `index.ts`

**Acceptance Criteria**:
- [ ] Directory structure created
- [ ] TypeScript compiles without errors
- [ ] Module can be imported by Feature 3

**Tech Stack**:
- TypeScript
- Node.js (for solver logic)

---

#### T-002: Define Assembly Data Types
**Priority**: Must
**Dependencies**: T-001
**Effort**: Medium

**Description**:
- Create `types/assembly.types.ts`
- Define `AssemblyIncrement` interface with:
  - `stepNumber`: number
  - `notation`: string
  - `face`: Face
  - `direction`: 'clockwise' | 'counterclockwise'
  - `degrees`: 90 | 180
  - `cubeStateAfter`: CubeState
  - `description`: string
- Define `Solution` interface with:
  - `initialState`: CubeState
  - `increments`: AssemblyIncrement[]
  - `totalMoves`: number
  - `algorithmUsed`: string
  - `calculationTimeMs`: number
- Define `Direction` enum
- Define `MoveNotation` type
- Export all types

**Acceptance Criteria**:
- [ ] All interfaces defined with correct typing
- [ ] Types compatible with Feature 1 CubeState
- [ ] Types compatible with Feature 3 requirements
- [ ] JSDoc comments added
- [ ] No TypeScript errors

**Related Requirements**: FR-4.1.1 to FR-4.1.6, FR-4.2.1

---

#### T-003: Create Move Notation Constants
**Priority**: Must
**Dependencies**: T-002
**Effort**: Small

**Description**:
- Create `constants/moves.ts`
- Define all 18 standard moves: U, U', U2, D, D', D2, L, L', L2, R, R', R2, F, F', F2, B, B', B2
- Create `MOVE_DESCRIPTIONS` mapping with human-readable descriptions
- Create `MOVE_TO_FACE` mapping
- Create `MOVE_TO_DIRECTION` mapping
- Create `MOVE_TO_DEGREES` mapping

**Acceptance Criteria**:
- [ ] All 18 moves defined
- [ ] Human-readable descriptions clear and accurate
- [ ] Mappings complete for all moves
- [ ] Constants exported

**Related Requirements**: FR-2.2.1 to FR-2.2.4, FR-3.2.1 to FR-3.2.5

---

#### T-004: Setup Test Infrastructure for Assembly
**Priority**: Must
**Dependencies**: T-001
**Effort**: Small

**Description**:
- Configure Vitest for assembly module tests
- Create test fixtures:
  - Solved cube state
  - Simple scrambled cubes (1-3 moves from solved)
  - Medium difficulty scrambled cubes
  - Hard difficulty scrambled cubes
- Create test utilities for cube state comparison
- Setup performance benchmarking utilities

**Acceptance Criteria**:
- [ ] Test framework runs successfully
- [ ] Fixture cubes created and validated
- [ ] Comparison utilities work correctly
- [ ] Performance benchmarks configured

**Tech Stack**:
- Vitest

---

#### T-005: Create Error Types for Assembly
**Priority**: Must
**Dependencies**: T-002
**Effort**: Small

**Description**:
- Create `types/errors.ts`
- Define `AssemblyErrorCode` enum:
  - `INVALID_CUBE_STATE`
  - `INCOMPLETE_CUBE_STATE`
  - `UNSOLVABLE_CUBE`
  - `CALCULATION_TIMEOUT`
  - `ALGORITHM_ERROR`
- Create error message mappings
- Implement custom `AssemblyError` class extending Error

**Acceptance Criteria**:
- [ ] All error codes defined
- [ ] Error messages clear and actionable
- [ ] Custom error class implemented
- [ ] Types exported

**Related Requirements**: NFR-3.1, NFR-3.2

---

### Phase 2: Cube State Manipulation (6 tasks)

#### T-006: Implement Cube State Transformer
**Priority**: Must
**Dependencies**: T-002
**Effort**: High

**Description**:
- Create `utils/CubeStateTransformer.ts`
- Convert Feature 1 `CubeState` (6 faces × 9 facelets) to solver-friendly format
- Common formats:
  - String notation (54-character string)
  - Array notation (6 arrays of 9)
  - Cubie representation (corner + edge pieces)
- Implement bidirectional conversion (solver format ↔ CubeState)
- Add unit tests for all conversion methods

**Acceptance Criteria**:
- [ ] Conversion to solver format correct
- [ ] Conversion from solver format correct
- [ ] Bidirectional conversion is lossless
- [ ] 10 unit tests pass

**Related Requirements**: FR-1.1.1, FR-1.1.4

---

#### T-007: Implement Move Executor
**Priority**: Must
**Dependencies**: T-003, T-006
**Effort**: High

**Description**:
- Create `utils/MoveExecutor.ts`
- Implement `executeMove(cubeState, move)` function
- Apply each of the 18 standard moves to cube state
- Handle face rotations correctly:
  - Rotate face itself 90° or 180°
  - Move affected edge/corner pieces
- Return new `CubeState` after move
- Add comprehensive unit tests (18+ tests, one per move)

**Acceptance Criteria**:
- [ ] All 18 moves execute correctly
- [ ] Cube state updated accurately after each move
- [ ] No mutation of original state (immutable)
- [ ] 18+ unit tests pass

**Related Requirements**: FR-2.2.2, FR-2.2.3, FR-2.2.4, FR-4.1.5

---

#### T-008: Implement Move Reverser
**Priority**: Should
**Dependencies**: T-007
**Effort**: Small

**Description**:
- Create `utils/MoveReverser.ts`
- Implement `reverseMove(move)` function
- Return inverse move: U → U', U' → U, U2 → U2
- Add unit tests for all 18 moves

**Acceptance Criteria**:
- [ ] Reverse moves calculated correctly
- [ ] U2 reverses to U2
- [ ] 18 unit tests pass

**Related Requirements**: FR-1.2.3

---

#### T-009: Implement Solution Validator
**Priority**: Must
**Dependencies**: T-007
**Effort**: Medium

**Description**:
- Create `utils/SolutionValidator.ts`
- Implement `validateSolution(initialState, moves)` function
- Apply all moves sequentially to initial state
- Verify final state is solved
- Return validation result with:
  - `isValid`: boolean
  - `finalState`: CubeState
  - `error`: string (if invalid)
- Add unit tests with valid and invalid solutions

**Acceptance Criteria**:
- [ ] Valid solutions pass validation
- [ ] Invalid solutions fail validation
- [ ] Error messages helpful for debugging
- [ ] 8 unit tests pass

**Related Requirements**: FR-2.1.3, NFR-2.1

---

#### T-010: Implement Solved State Checker
**Priority**: Must
**Dependencies**: T-006
**Effort**: Small

**Description**:
- Create `utils/SolvedStateChecker.ts`
- Implement `isSolved(cubeState)` function
- Check all faces are monochrome (single color per face)
- Return boolean
- Add unit tests with solved and unsolved cubes

**Acceptance Criteria**:
- [ ] Solved cubes detected correctly
- [ ] Unsolved cubes detected correctly
- [ ] 6 unit tests pass

**Related Requirements**: FR-2.1.2

---

#### T-011: Implement Cube State Reconstructor
**Priority**: Should
**Dependencies**: T-007
**Effort**: Medium

**Description**:
- Create `utils/CubeStateReconstructor.ts`
- Implement `reconstructStateAtStep(initialState, moves, stepIndex)` function
- Apply moves up to specified step
- Return intermediate cube state
- Cache results for performance
- Add unit tests

**Acceptance Criteria**:
- [ ] Reconstruction accurate for any step
- [ ] Caching improves performance
- [ ] 8 unit tests pass

**Related Requirements**: FR-1.2.3

---

### Phase 3: Solving Algorithm (8 tasks)

#### T-012: Research Solving Algorithms
**Priority**: Must
**Dependencies**: None
**Effort**: Medium

**Description**:
- Research Kociemba's Two-Phase Algorithm
- Research CFOP (Fridrich) Method
- Research Layer-by-Layer (Beginner's Method)
- Compare pros/cons of each:
  - Solution length
  - Calculation speed
  - Implementation complexity
  - Determinism
- Document findings and recommendation
- Present options to team/stakeholder

**Acceptance Criteria**:
- [ ] Research document created
- [ ] Pros/cons analyzed for each algorithm
- [ ] Recommendation made with justification
- [ ] Decision documented

**Related Requirements**: FR-2.1.1, NFR-2.2

---

#### T-013: Select and Install Solver Library (Option A)
**Priority**: Must (if using external library)
**Dependencies**: T-012
**Effort**: Small

**Description**:
- Evaluate existing JavaScript/TypeScript solver libraries:
  - `cubejs` (Kociemba implementation)
  - `cube-solver` (various algorithms)
  - Others from npm
- Select library based on:
  - Algorithm quality
  - Performance
  - Bundle size
  - Maintenance status
  - License compatibility
- Install via npm
- Create wrapper interface

**Acceptance Criteria**:
- [ ] Library evaluated and selected
- [ ] Library installed
- [ ] Wrapper interface created
- [ ] Sample solve works

**Tech Stack**:
- npm package (e.g., `cubejs`, `kociemba`)

---

#### T-014: Implement Custom Solver (Option B)
**Priority**: Must (if building custom)
**Dependencies**: T-012
**Effort**: Very High

**Description**:
- Implement chosen solving algorithm from scratch
- For Kociemba's Algorithm:
  - Implement Phase 1: Reduce to G1 subgroup
  - Implement Phase 2: Solve G1 to solved state
  - Implement move tables and pruning tables
  - Optimize for performance
- For Layer-by-Layer:
  - Implement cross solving
  - Implement first layer corners
  - Implement middle layer edges
  - Implement last layer orientation + permutation
- Add comprehensive unit tests

**Acceptance Criteria**:
- [ ] Algorithm correctly solves any valid cube
- [ ] Solution length < 100 moves
- [ ] Calculation time < 5 seconds
- [ ] 30+ unit tests pass

**Related Requirements**: FR-2.1.1, FR-2.1.2, FR-2.1.5, NFR-1.1

---

#### T-015: Create Solver Wrapper Interface
**Priority**: Must
**Dependencies**: T-013 or T-014
**Effort**: Small

**Description**:
- Create `solver/CubeSolver.ts` interface
- Define `solve(cubeState): Solution` method signature
- Wrap external library or custom solver
- Handle format conversions (CubeState ↔ solver format)
- Add error handling

**Acceptance Criteria**:
- [ ] Interface defined
- [ ] Solver wrapped correctly
- [ ] Format conversions work
- [ ] Errors handled gracefully

**Related Requirements**: FR-1.1.1, FR-2.1.1

---

#### T-016: Implement Solution Calculator
**Priority**: Must
**Dependencies**: T-015, T-007
**Effort**: Medium

**Description**:
- Create `solver/SolutionCalculator.ts`
- Implement `calculateSolution(cubeState)` function
- Steps:
  1. Validate input cube state
  2. Check if already solved (return empty solution)
  3. Convert to solver format
  4. Call solver
  5. Convert solution moves back
  6. Build `AssemblyIncrement[]` with intermediate states
  7. Validate solution
  8. Return `Solution` object
- Add performance tracking
- Add unit tests

**Acceptance Criteria**:
- [ ] Calculates solution for any valid cube
- [ ] Returns correct Solution format
- [ ] Includes all intermediate states
- [ ] Already-solved cubes handled
- [ ] 10 unit tests pass

**Related Requirements**: FR-2.1.2, FR-2.1.3, FR-3.1.1 to FR-3.1.4

---

#### T-017: Generate Human-Readable Descriptions
**Priority**: Must
**Dependencies**: T-003
**Effort**: Small

**Description**:
- Create `utils/MoveDescriber.ts`
- Implement `describMove(notation)` function
- Generate descriptions like:
  - "U" → "Turn the top face clockwise 90°"
  - "R'" → "Turn the right face counter-clockwise 90°"
  - "F2" → "Turn the front face 180°"
- Use `MOVE_DESCRIPTIONS` constants
- Add unit tests for all 18 moves

**Acceptance Criteria**:
- [ ] All 18 moves have descriptions
- [ ] Descriptions clear and accurate
- [ ] 18 unit tests pass

**Related Requirements**: FR-3.2.2

---

#### T-018: Implement Solution Optimization (Optional)
**Priority**: Could
**Dependencies**: T-016
**Effort**: Medium

**Description**:
- Create `solver/SolutionOptimizer.ts`
- Implement move sequence simplification:
  - Remove redundant moves (e.g., U U U U → no-op)
  - Combine moves (e.g., U U → U2)
  - Cancel opposites (e.g., U U' → no-op)
- Apply optimization to solution before returning
- Add unit tests

**Acceptance Criteria**:
- [ ] Redundant moves removed
- [ ] Move sequences simplified
- [ ] Solution still valid after optimization
- [ ] 8 unit tests pass

**Related Requirements**: FR-2.1.4, NFR-2.2

---

#### T-019: Add Solution Determinism Check
**Priority**: Should
**Dependencies**: T-016
**Effort**: Small

**Description**:
- Add determinism validation
- Test that same input produces same output
- Add unit test that runs solver 10 times with same input
- Verify all solutions identical

**Acceptance Criteria**:
- [ ] Solver is deterministic
- [ ] Unit test verifies determinism

**Related Requirements**: NFR-3.3

---

### Phase 4: Integration & API (5 tasks)

#### T-020: Implement Assembly Mechanism API
**Priority**: Must
**Dependencies**: T-016
**Effort**: Small

**Description**:
- Create `AssemblyMechanismAPI` interface
- Implement public methods:
  - `calculateSolution(cubeState): Promise<Solution>`
  - `validateCubeState(cubeState): boolean`
  - `getAlgorithmInfo(): AlgorithmInfo`
- Make calculation async (non-blocking)
- Export from `index.ts`

**Acceptance Criteria**:
- [ ] API interface defined
- [ ] All methods implemented
- [ ] Async processing works
- [ ] Methods exported correctly

**Related Requirements**: FR-1.1.1, NFR-1.3

---

#### T-021: Implement Input Validation
**Priority**: Must
**Dependencies**: T-020
**Effort**: Small

**Description**:
- Create `utils/InputValidator.ts`
- Validate incoming cube state from Feature 1:
  - All 54 facelets defined (not null)
  - All colors valid
  - State passes basic validation (color counts, etc.)
- Return validation result
- Add unit tests

**Acceptance Criteria**:
- [ ] Complete states pass validation
- [ ] Incomplete states rejected
- [ ] Invalid states rejected with clear errors
- [ ] 8 unit tests pass

**Related Requirements**: FR-1.1.2, FR-1.1.3

---

#### T-022: Implement Async Solution Calculation
**Priority**: Must
**Dependencies**: T-020
**Effort**: Medium

**Description**:
- Wrap solver in Web Worker or async function
- Prevent UI blocking during calculation
- Add progress callbacks (optional)
- Add cancellation support (optional)
- Add timeout handling (5 seconds max)
- Add unit tests

**Acceptance Criteria**:
- [ ] Calculation doesn't block UI
- [ ] Timeout triggers after 5 seconds
- [ ] Cancellation works (if implemented)
- [ ] 6 unit tests pass

**Related Requirements**: NFR-1.1, NFR-1.3

---

#### T-023: Create Feature 1 Integration Handler
**Priority**: Must
**Dependencies**: T-020, T-021
**Effort**: Small

**Description**:
- Create integration point for receiving cube state from Feature 1
- Handle `onComplete` callback from Feature 1
- Validate received data
- Trigger solution calculation
- Handle errors gracefully
- Pass result to Feature 3

**Acceptance Criteria**:
- [ ] Receives data from Feature 1 correctly
- [ ] Validates data before processing
- [ ] Calculates solution
- [ ] Passes to Feature 3
- [ ] Errors handled gracefully

**Related Requirements**: FR-1.1.1, FR-1.1.4

---

#### T-024: Create Feature 3 Output Formatter
**Priority**: Must
**Dependencies**: T-016
**Effort**: Small

**Description**:
- Create `utils/OutputFormatter.ts`
- Format `Solution` object for Feature 3 consumption
- Ensure all required fields present:
  - Step numbers (1-based)
  - Move notation
  - Face, direction, degrees
  - Cube state after each move
  - Descriptions
- Add metadata (total moves, algorithm used, calculation time)
- Add unit tests

**Acceptance Criteria**:
- [ ] Output format matches Feature 3 requirements
- [ ] All required fields present
- [ ] Metadata included
- [ ] 6 unit tests pass

**Related Requirements**: FR-4.2.1, FR-4.2.2

---

### Phase 5: Error Handling & Edge Cases (2 tasks)

#### T-025: Implement Comprehensive Error Handling
**Priority**: Must
**Dependencies**: T-020, T-021, T-022
**Effort**: Medium

**Description**:
- Add try-catch blocks around all critical operations
- Handle all error scenarios:
  - Invalid cube state
  - Incomplete cube state
  - Unsolvable cube (should be caught by Feature 1)
  - Calculation timeout
  - Algorithm errors
- Generate meaningful error messages
- Log errors appropriately
- Add error recovery strategies where possible
- Add unit tests for each error scenario

**Acceptance Criteria**:
- [ ] All error scenarios handled
- [ ] Error messages clear and actionable
- [ ] No uncaught exceptions
- [ ] 10 unit tests pass

**Related Requirements**: NFR-3.1, NFR-3.2

---

#### T-026: Handle Edge Cases
**Priority**: Must
**Dependencies**: T-016
**Effort**: Small

**Description**:
- Handle already-solved cube (return empty solution with message)
- Handle near-solved cubes (1-2 moves from solved)
- Handle calculation timeouts gracefully
- Add tests for all edge cases

**Acceptance Criteria**:
- [ ] Solved cube returns empty solution
- [ ] Near-solved cubes handled efficiently
- [ ] Timeouts handled gracefully
- [ ] 6 unit tests pass

**Related Requirements**: NFR-3.1

---

### Phase 6: Testing & Performance (2 tasks)

#### T-027: Complete Unit and Integration Tests
**Priority**: Must
**Dependencies**: All implementation tasks
**Effort**: High

**Description**:
- Write missing unit tests to reach high coverage (>90%)
- Write integration tests:
  1. End-to-end: Feature 1 → Assembly → Feature 3
  2. Solver accuracy: Test with 50+ scrambled cubes
  3. Performance: Calculate solutions for 20 cubes, verify < 5s each
  4. Error handling: Trigger all error scenarios
  5. Edge cases: Already solved, near-solved, timeouts
- Generate coverage report

**Acceptance Criteria**:
- [ ] >90% code coverage achieved
- [ ] All integration tests pass
- [ ] Performance requirements met
- [ ] Error scenarios tested

**Related Requirements**: All NFR requirements

---

#### T-028: Performance Optimization
**Priority**: Should
**Dependencies**: T-027
**Effort**: Medium

**Description**:
- Profile solution calculation performance
- Identify bottlenecks
- Optimize hot paths:
  - Move execution
  - State transformations
  - Solver algorithm
- Add memoization where beneficial
- Target: <2 seconds for typical cubes, <5 seconds for all
- Verify performance improvements with benchmarks

**Acceptance Criteria**:
- [ ] Bottlenecks identified and addressed
- [ ] Typical cubes solve in <2 seconds
- [ ] All cubes solve in <5 seconds
- [ ] Performance regression tests added

**Related Requirements**: NFR-1.1, NFR-1.2

---

## Task Dependencies Graph

```
T-001 (Module Setup)
  ├─→ T-002 (Data Types)
  │    ├─→ T-003 (Move Constants)
  │    ├─→ T-005 (Error Types)
  │    └─→ T-006 (State Transformer)
  └─→ T-004 (Test Infrastructure)

T-003 → T-007 (Move Executor)
  ├─→ T-008 (Move Reverser)
  ├─→ T-009 (Solution Validator)
  ├─→ T-011 (State Reconstructor)
  └─→ T-017 (Move Describer)

T-006 → T-010 (Solved State Checker)

T-012 (Research)
  ├─→ T-013 (External Library) OR
  └─→ T-014 (Custom Solver)
      └─→ T-015 (Solver Wrapper)
          └─→ T-016 (Solution Calculator)
              ├─→ T-018 (Optimization)
              ├─→ T-019 (Determinism)
              ├─→ T-020 (API)
              │    ├─→ T-021 (Input Validation)
              │    ├─→ T-022 (Async Calculation)
              │    ├─→ T-023 (Feature 1 Integration)
              │    └─→ T-024 (Feature 3 Output)
              ├─→ T-025 (Error Handling)
              └─→ T-026 (Edge Cases)

T-020 → T-027 (Testing)
      → T-028 (Performance Optimization)
```

---

## Implementation Order Recommendation

### Sprint 1 (Foundation): T-001 to T-005
- Setup module structure
- Define all data types and constants
- Create test infrastructure

### Sprint 2 (Cube Manipulation): T-006 to T-011
- Implement state transformations
- Implement move execution
- Implement validation utilities

### Sprint 3 (Solver Research & Selection): T-012 to T-015
- Research algorithms
- Select or implement solver
- Create solver wrapper

### Sprint 4 (Solution Calculation): T-016 to T-019
- Implement solution calculator
- Generate move descriptions
- Optimize solution
- Add determinism check

### Sprint 5 (Integration): T-020 to T-024
- Build public API
- Integrate with Feature 1 and Feature 3
- Async processing
- Output formatting

### Sprint 6 (Error Handling & Testing): T-025 to T-028
- Comprehensive error handling
- Edge case handling
- Complete testing suite
- Performance optimization

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Runtime | Node.js (server-side logic) |
| Solver Algorithm | Kociemba's Two-Phase (recommended) OR Layer-by-Layer OR CFOP |
| Async Processing | Web Workers or async/await |
| Testing | Vitest |
| Performance | Benchmarking utilities |

---

## Key Decision Points

### Decision 1: Algorithm Selection (T-012)
**Options**:
1. **Kociemba's Two-Phase Algorithm**
   - Pros: Fast, near-optimal solutions (< 30 moves)
   - Cons: Complex implementation, larger bundle size
2. **Layer-by-Layer (Beginner's Method)**
   - Pros: Simple to implement, deterministic
   - Cons: Longer solutions (50-100 moves)
3. **CFOP (Fridrich Method)**
   - Pros: Good balance of speed and solution length
   - Cons: Moderate complexity

**Recommendation**: Kociemba if using external library, Layer-by-Layer if building custom

### Decision 2: Implementation Approach (T-013 vs T-014)
**Options**:
1. **Use External Library** (T-013)
   - Pros: Faster development, battle-tested
   - Cons: Less control, potential bundle size increase
2. **Build Custom Solver** (T-014)
   - Pros: Full control, optimized for our use case
   - Cons: Significant development time, complexity

**Recommendation**: Start with external library, migrate to custom if needed

---

## Performance Targets

| Metric | Target | Requirement |
|--------|--------|-------------|
| Solution Calculation (typical) | < 2 seconds | NFR-1.2 |
| Solution Calculation (max) | < 5 seconds | NFR-1.1 |
| Solution Length | < 100 moves | NFR-2.2 |
| UI Blocking | 0ms (async) | NFR-1.3 |
| Solution Correctness | 100% | NFR-2.1 |

---

## Testing Requirements Summary

| Test Type | Target Count | Coverage Goal |
|-----------|--------------|---------------|
| Unit Tests | 100+ | >90% |
| Integration Tests | 5 | Critical flows |
| Performance Tests | 20+ cubes | All pass |
| Error Scenario Tests | 10 | All scenarios |

---

## Acceptance Criteria for Feature Completion

- [ ] All 28 tasks completed
- [ ] >90% code coverage achieved
- [ ] All integration tests pass
- [ ] All functional requirements met (FR-1.1 to FR-4.2)
- [ ] All non-functional requirements met (NFR-1 to NFR-3)
- [ ] Performance targets achieved (<5s calculation)
- [ ] Solution quality targets achieved (<100 moves, 100% correct)
- [ ] Feature 1 integration working
- [ ] Feature 3 integration working
- [ ] Error handling comprehensive
- [ ] Edge cases handled
- [ ] Code reviewed and approved
- [ ] Documentation complete

---

## Notes

- This feature is the computational core of the application
- Algorithm selection is critical - research thoroughly
- Performance is key - profile and optimize
- Async processing is mandatory to avoid UI blocking
- Solution validation is critical for correctness
- Comprehensive error handling prevents bad user experiences
- Feature acts as bridge between Configuration (F-001) and Visualization (F-003)
