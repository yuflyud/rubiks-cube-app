# Test Cases: Feature 2 - Rubik's Cube Assembly Mechanism

## Summary
- **Total Test Cases:** 26
- **High Priority:** 15
- **Medium Priority:** 9
- **Low Priority:** 2
- **Types:** E2E (12), API (14)

## Feature Location Map
| Feature | Navigation Path |
|---------|-----------------|
| Solution Calculation | Triggered automatically after Feature 1 (Configuration) completion |
| Solution Output | Console logs + transition to Feature 3 (Visualization) |
| Assembly Increments | Consumed by Feature 3 (Visualization) for step-by-step display |

---

## Test Cases

### High Priority

### TC_ASSEMBLY_001

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify solution calculation is triggered after valid configuration completion

**Pre-conditions:**
- Application is loaded
- Feature 1 (Configuration) is completed with a valid cube state
- All validation checks pass (each color appears exactly 9 times, valid cube state)

**Steps:**
1. Open the application in browser (base application URL)
2. Complete the cube configuration in Feature 1 with a valid, solvable cube state
3. Click the "Finish" or "Calculate Solution" button (data-testid: `btn-finish-configuration`)
4. Verify a notification appears showing "Configuration complete! Calculating solution..." or similar message
5. Verify a loading indicator is displayed during solution calculation
6. Monitor the browser console for solution calculation logs (e.g., "⚙️ Calculating solution...")
7. Wait for solution calculation to complete
8. Verify a success notification appears: "Solution found! X moves required." or similar
9. Verify the console logs solution details: total moves, algorithm used, calculation time
10. Verify the interface automatically transitions from configuration to visualization

**Expected Result (AR):**
Upon completing valid configuration, the solution calculation is automatically triggered. A clear notification informs the user that calculation is in progress. The solution calculates successfully within acceptable time (< 5 seconds per NFR-1.1). A success notification displays the number of moves required. Console logs provide detailed solution information (total moves, algorithm, calculation time). The interface seamlessly transitions to the visualization feature.

**Notes:**
- This tests the integration between Feature 1 and Feature 2
- Solution calculation happens in `handleConfigurationComplete` function in [main.ts:112-171](../../src/client/main.ts#L112-L171)
- Verify calculation is non-blocking (UI remains responsive)

**Requirements:**
[FR-1.1: Input Processing](requirements.md#FR-1.1), [NFR-1.1: Calculation Time < 5s](requirements.md#NFR-1.1)

---

### TC_ASSEMBLY_002

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify solution calculation completes within 5 seconds for any valid cube state

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is ready (can use various cube states)
- Browser performance tools are available (optional)

**Steps:**
1. Open the application in browser
2. Open browser developer tools console to monitor timing
3. Complete cube configuration with a valid, complex cube state (not solved or near-solved)
4. Note the timestamp when "Calculate Solution" is clicked (or use `console.time()` if available)
5. Click "Finish" to trigger solution calculation (data-testid: `btn-finish-configuration`)
6. Monitor the console for "✓ Solution calculated!" message
7. Note the timestamp when solution calculation completes
8. Verify the console log displays calculation time: "Calculation time: Xms"
9. Calculate the elapsed time between trigger and completion
10. Verify the elapsed time is less than 5000ms (5 seconds)
11. Repeat with 3-5 different cube configurations to ensure consistent performance
12. Test with a "worst case" scrambled cube (highly randomized state)

**Expected Result (AR):**
Solution calculation completes within 5 seconds for all tested cube states. The console log accurately reports calculation time in milliseconds. Performance is consistent across different cube configurations. Even the most complex/scrambled cubes calculate within the 5-second threshold. The UI remains responsive during calculation (async processing).

**Notes:**
- This tests NFR-1.1 (Must priority) and NFR-1.2 (Should priority: < 2 seconds for typical states)
- Typical states may complete in 1-2 seconds, complex states in 3-5 seconds
- Test on various hardware to ensure performance requirements are met
- Verify async processing: calculation doesn't freeze the UI

**Requirements:**
[NFR-1.1: Calculation Time < 5s](requirements.md#NFR-1.1), [NFR-1.2: Typical State < 2s](requirements.md#NFR-1.2), [NFR-1.3: Async Processing](requirements.md#NFR-1.3)

---

### TC_ASSEMBLY_003

**Type:** `API`

**Priority:** `High`

**Name:** Verify solution calculation returns a valid solution for a solvable cube

**Pre-conditions:**
- Application is loaded with solution calculator initialized
- A valid, solvable cube state is available

**Steps:**
1. Open the application in browser
2. Open browser developer tools console
3. Complete cube configuration with a known valid configuration
4. Trigger solution calculation by completing configuration
5. Monitor console logs for the solution object
6. Verify the solution object contains the following fields:
   - `initialState`: CubeState object (the starting configuration)
   - `increments`: Array of AssemblyIncrement objects
   - `totalMoves`: Number (count of moves in solution)
   - `algorithmUsed`: String (name of solving algorithm)
   - `calculationTimeMs`: Number (time taken in milliseconds)
   - `metadata.complexity`: String or object (complexity indicator)
7. Verify `totalMoves` matches the length of the `increments` array
8. Verify each AssemblyIncrement in the array contains:
   - `stepNumber`: Sequential number starting from 1
   - `notation`: String (e.g., "R", "U'", "F2")
   - `face`: String (target face identifier: U, D, L, R, F, B)
   - `direction`: String ("clockwise" or "counterclockwise")
   - `degrees`: Number (90 or 180)
   - `cubeStateAfter`: CubeState object (resulting state)
   - `description`: String (human-readable move description)
9. Verify the solution notation uses standard Rubik's cube notation

**Expected Result (AR):**
The solution object is structured correctly with all required fields. The `initialState` matches the configured cube state. The `increments` array contains all solution moves in order. Each AssemblyIncrement has all required fields with correct data types. The `totalMoves` count is accurate. Standard notation is used (U, D, L, R, F, B with modifiers ', 2). The algorithm name is specified (e.g., "Kociemba" or "LayerByLayer").

**Notes:**
- This tests FR-2.1 (Solving Algorithm) and FR-4.1 (Increment Data Structure)
- Solution object structure is defined in [assembly.types.ts:191-208](../../src/client/features/assembly/types/assembly.types.ts)
- Verify the data model matches the TypeScript interface definitions

**Requirements:**
[FR-2.1: Solving Algorithm](requirements.md#FR-2.1), [FR-4.1: Increment Data Structure](requirements.md#FR-4.1), [Assembly Increment Data Model](requirements.md#assembly-increment-data-model)

---

### TC_ASSEMBLY_004

**Type:** `API`

**Priority:** `High`

**Name:** Verify generated solution correctly solves the cube when applied

**Pre-conditions:**
- Application is loaded
- A valid, scrambled cube state is available
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration with a known scrambled state (note the initial configuration)
3. Trigger solution calculation
4. Retrieve the calculated solution from console logs or internal state
5. Verify the solution's `initialState` matches the configured scrambled state
6. Programmatically or manually apply each move in the `increments` array sequentially
7. After applying each move, verify the `cubeStateAfter` matches the actual resulting state
8. Continue applying all moves until the final move
9. After applying the final move, verify the cube reaches a solved state:
   - Each face is a single uniform color
   - White face opposite Yellow, Green opposite Blue, Red opposite Orange
10. Verify no errors occur during move application
11. Verify the solution length is reasonable (< 100 moves per NFR-2.2)

**Expected Result (AR):**
Applying the solution moves in order correctly transforms the cube from the initial scrambled state to a fully solved state. Each intermediate `cubeStateAfter` accurately represents the cube state after that move. The final cube state is a valid solved configuration with each face showing a single color. No moves cause invalid or impossible cube states. The solution is deterministic (applying the same solution to the same initial state always produces the same result).

**Notes:**
- This tests FR-2.1.3 (Solution correctness) and NFR-2.1 (Solution must solve correctly)
- Most critical test: verifies the core functionality of the feature
- Consider using the `StateSimulator` or `CubejsStateSimulator` to verify state transitions
- Test with multiple different scrambled states to ensure reliability

**Requirements:**
[FR-2.1.3: Solution Correctness](requirements.md#FR-2.1.3), [NFR-2.1: Correct Solution](requirements.md#NFR-2.1)

---

### TC_ASSEMBLY_005

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify solution uses standard Rubik's cube notation

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Monitor console logs for the move sequence display (e.g., "Move sequence:")
4. Verify all moves use standard notation:
   - Face moves: U, D, L, R, F, B (uppercase single letters)
   - Inverse moves (counter-clockwise): U', D', L', R', F', B' (with apostrophe)
   - Double moves (180°): U2, D2, L2, R2, F2, B2 (with number 2)
5. Verify NO slice moves (M, E, S) or wide moves (Uw, Dw, etc.) are used
6. Verify NO lowercase notation (u, d, l, r, f, b) is used
7. Verify all notation follows the standard format: [Face][Modifier]
   - Where Face is one of: U, D, L, R, F, B
   - Where Modifier is optional: none (clockwise 90°), ' (counter-clockwise 90°), or 2 (180°)
8. Test with multiple different cube configurations to ensure consistent notation usage

**Expected Result (AR):**
All solution moves use standard Rubik's cube notation exclusively. Face identifiers are uppercase letters: U, D, L, R, F, B. Inverse moves are indicated with apostrophe ('). Double moves are indicated with number 2. No slice moves or wide moves are present. Notation is consistent across all moves and all cube configurations. The notation is internationally recognized and matches standard cubing conventions.

**Notes:**
- This tests FR-2.2 (Move Notation) requirements
- Standard notation is critical for users to understand and apply moves to physical cubes
- Reference: U=Up, D=Down, L=Left, R=Right, F=Front, B=Back
- Verify notation matches the Move Notation Reference table in requirements

**Requirements:**
[FR-2.2: Move Notation](requirements.md#FR-2.2), [Move Notation Reference Table](requirements.md#move-notation-reference)

---

### TC_ASSEMBLY_006

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify each move includes human-readable description

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Monitor console logs for move descriptions (e.g., "1. R - Rotate Right face clockwise 90°")
4. Verify each move includes:
   - Step number (sequential, starting from 1)
   - Notation (e.g., "R", "U'", "F2")
   - Description (human-readable explanation of the move)
5. Verify descriptions follow a consistent format and include:
   - Face being rotated (e.g., "Right face", "Up face")
   - Direction (e.g., "clockwise", "counter-clockwise")
   - Rotation amount (e.g., "90°", "180°")
6. Example expected descriptions:
   - "R" → "Rotate Right face clockwise 90°"
   - "U'" → "Rotate Up face counter-clockwise 90°"
   - "F2" → "Rotate Front face 180°"
7. Verify descriptions are grammatically correct and easy to understand
8. Verify descriptions do not use technical jargon or cube-solving terminology

**Expected Result (AR):**
Every move in the solution includes a human-readable description. Descriptions clearly explain which face to rotate, in which direction, and by how many degrees. Descriptions follow a consistent format and phrasing. Language is accessible to users unfamiliar with cube notation. Each description accurately corresponds to the notation (no mismatches). Descriptions help users translate notation into physical moves on their cube.

**Notes:**
- This tests FR-3.2 (Move Description) requirements
- Human-readable descriptions make the solution accessible to beginners
- Descriptions are consumed by Feature 3 (Visualization) for display to users
- Verify consistency: same notation always produces same description

**Requirements:**
[FR-3.2: Move Description](requirements.md#FR-3.2)

---

### TC_ASSEMBLY_007

**Type:** `API`

**Priority:** `High`

**Name:** Verify solution is deterministic for the same input cube state

**Pre-conditions:**
- Application is loaded
- A specific cube configuration is available

**Steps:**
1. Open the application in browser
2. Complete cube configuration with a specific known state (e.g., specific color pattern)
3. Trigger solution calculation
4. Record the complete solution:
   - Total move count
   - Sequence of moves (notation)
   - Algorithm used
5. Refresh the application (reload the page)
6. Configure the cube with the EXACT same state as in step 2
7. Trigger solution calculation again
8. Record the solution again
9. Compare the two solutions:
   - Verify total move count is identical
   - Verify the move sequence is identical (same notation in same order)
   - Verify the algorithm used is the same
10. Repeat the test 3-5 times to ensure consistent deterministic behavior

**Expected Result (AR):**
The same cube configuration always produces the exact same solution. The total move count is identical across multiple calculations. The move sequence is identical in notation and order. The algorithm selection is deterministic. No randomness or variation in solution generation. Results are reproducible and consistent.

**Notes:**
- This tests NFR-3.3 (Should priority) for deterministic behavior
- Determinism is important for: debugging, testing, user trust
- Some algorithms may have legitimate variations, but the same algorithm should be deterministic
- Verify no random factors influence solution generation

**Requirements:**
[NFR-3.3: Deterministic Solutions](requirements.md#NFR-3.3)

---

### TC_ASSEMBLY_008

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify error handling when cube state is invalid

**Pre-conditions:**
- Application is loaded
- Feature 1 validation can be bypassed (for testing purposes) OR invalid state can be programmatically injected

**Steps:**
1. Open the application in browser
2. Inject or bypass validation to provide an invalid cube state to the solution calculator:
   - Option A: Invalid color counts (e.g., 10 reds, 8 blues)
   - Option B: Physically impossible cube configuration
   - Option C: Incomplete cube state (missing facelet data)
3. Trigger solution calculation
4. Verify the calculation does NOT crash or freeze the application
5. Verify an error is caught and handled gracefully
6. Verify an error notification is displayed to the user with a clear message:
   - Examples: "Unable to calculate solution: Invalid cube state", "Cube configuration is invalid, please reconfigure"
7. Verify the console logs the error details (error message, error type)
8. Verify the user can return to configuration or restart the process
9. Verify the application remains in a stable, usable state after the error

**Expected Result (AR):**
Invalid cube states are detected before or during calculation. Errors are caught and handled gracefully without crashing. A clear, user-friendly error message is displayed explaining the issue. The console logs detailed error information for debugging. The user is not stuck and can retry or reconfigure. The application remains stable and responsive after error handling.

**Notes:**
- This tests FR-1.1.3 (Input validation) and NFR-3.1/3.2 (Error handling and messaging)
- Error handling code is in [main.ts:161-170](../../src/client/main.ts#L161-L170)
- Feature 1 should prevent invalid states, but Feature 2 should still validate and handle errors
- Test various types of invalid states to ensure robust error handling

**Requirements:**
[FR-1.1.3: Input Validation](requirements.md#FR-1.1.3), [NFR-3.1: Graceful Error Handling](requirements.md#NFR-3.1), [NFR-3.2: Meaningful Error Messages](requirements.md#NFR-3.2)

---

### TC_ASSEMBLY_009

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify special case handling when cube is already solved

**Pre-conditions:**
- Application is loaded
- A solved cube configuration is available

**Steps:**
1. Open the application in browser
2. Configure the cube in a solved state:
   - White face: all white facelets
   - Yellow face: all yellow facelets
   - Green face: all green facelets
   - Blue face: all blue facelets
   - Red face: all red facelets
   - Orange face: all orange facelets
3. Trigger solution calculation by completing configuration
4. Verify the calculation completes successfully (no errors)
5. Verify a notification displays: "Cube is already solved! No moves needed." or similar message
6. Verify the console logs: "Total moves: 0" or confirms cube is already solved
7. Verify the solution object has:
   - `totalMoves`: 0
   - `increments`: Empty array []
8. Verify the application handles this edge case gracefully (doesn't attempt to display empty visualization)
9. Verify the user can restart configuration or is informed of the solved state

**Expected Result (AR):**
When the cube is already solved, the calculator detects this and returns an appropriate response. A clear notification informs the user that the cube is already solved. The solution has 0 total moves and an empty increments array. No errors occur during this edge case. The application provides appropriate next steps (e.g., "Configure a new cube", "Try a scrambled cube"). Console logs clearly indicate the solved state.

**Notes:**
- This tests the edge case "Cube is already solved" from requirements
- Efficient algorithms should detect solved state quickly (< 0.1 seconds)
- Verify Feature 3 (Visualization) handles empty solution gracefully
- Provide user guidance: "Try configuring an unsolved cube for a solution"

**Requirements:**
[Edge Cases: Cube Already Solved](requirements.md#edge-cases--error-scenarios)

---

### Medium Priority

### TC_ASSEMBLY_010

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify solution length is reasonable (fewer than 100 moves)

**Pre-conditions:**
- Application is loaded
- Valid cube configurations are available (including complex scrambles)

**Steps:**
1. Open the application in browser
2. Configure multiple different cube states with varying complexity:
   - Simple scramble (5-10 random moves from solved)
   - Medium scramble (15-20 random moves)
   - Complex scramble (25-30 random moves or more)
   - Worst-case scramble (highly randomized configuration)
3. For each configuration, trigger solution calculation
4. Monitor console logs for "Total moves: X" output
5. Record the total move count for each configuration
6. Verify all solutions have fewer than 100 moves (per NFR-2.2)
7. Optionally, verify typical solutions have 20-80 moves (reasonable range)
8. Note which algorithm is used (e.g., Kociemba, Layer-by-Layer)
9. Verify solution length is reasonable given the algorithm:
   - Kociemba: typically 20-30 moves (near-optimal)
   - Layer-by-Layer: typically 50-100 moves (longer but understandable)

**Expected Result (AR):**
All generated solutions contain fewer than 100 moves. Solution length is proportional to scramble complexity. Simple scrambles have shorter solutions (10-30 moves). Complex scrambles have longer solutions (40-90 moves). The algorithm used matches expected solution length characteristics. Solutions are practical for users to execute on physical cubes.

**Notes:**
- This tests NFR-2.2 (Should priority) for reasonable solution length
- Different algorithms have different solution length characteristics
- Kociemba's algorithm typically produces 20-30 move solutions (near-optimal)
- Layer-by-Layer produces longer but more understandable solutions (50-100 moves)
- God's Number (optimal solution) for Rubik's cube is max 20 moves, but finding optimal is computationally expensive

**Requirements:**
[NFR-2.2: Solution Length < 100 Moves](requirements.md#NFR-2.2)

---

### TC_ASSEMBLY_011

**Type:** `API`

**Priority:** `Medium`

**Name:** Verify each increment contains the resulting cube state after the move

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration with a known state
3. Trigger solution calculation
4. Access the solution object from console or internal state
5. Verify the `initialState` field contains the starting cube configuration
6. For each AssemblyIncrement in the `increments` array:
   - Verify the `cubeStateAfter` field is present
   - Verify `cubeStateAfter` is a complete CubeState object with all facelet data
   - Verify applying the move (notation) to the previous state produces the `cubeStateAfter`
7. Chain through the increments: initialState → increment[0].cubeStateAfter → increment[1].cubeStateAfter → ... → final solved state
8. Verify the state transitions are consistent and correct
9. Verify the final increment's `cubeStateAfter` represents a solved cube

**Expected Result (AR):**
Every AssemblyIncrement contains a complete `cubeStateAfter` field. Each `cubeStateAfter` accurately represents the cube state after applying that move. State transitions are consistent: applying move N to state N-1 produces state N. The sequence of states correctly progresses from initial scrambled state to final solved state. The data structure enables Feature 3 to display the cube at any step in the solution.

**Notes:**
- This tests FR-4.1.5 requirement for cube state in each increment
- `cubeStateAfter` enables visualization to show exact cube appearance at each step
- Storing state at each step trades memory for computation speed (no need to recalculate states)
- Verify state representation is complete (all 54 facelet colors)

**Requirements:**
[FR-4.1.5: Cube State in Increment](requirements.md#FR-4.1.5), [FR-4.2.1: Consumable Output Format](requirements.md#FR-4.2.1)

---

### TC_ASSEMBLY_012

**Type:** `API`

**Priority:** `Medium`

**Name:** Verify solution output is compatible with visualization feature requirements

**Pre-conditions:**
- Application is loaded
- Valid configuration is completed
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Verify the solution object structure matches the `Solution` interface:
   ```typescript
   interface Solution {
     initialState: CubeState;
     increments: AssemblyIncrement[];
     totalMoves: number;
     algorithmUsed: string;
     calculationTimeMs: number;
     metadata: { complexity: string; };
   }
   ```
4. Verify the solution is passed to Feature 3 (Visualization) via the `displayVisualization(solution)` function call
5. Verify Feature 3 successfully initializes with the solution object (no errors)
6. Verify Feature 3 can access and display:
   - Initial cube state
   - Each move's notation and description
   - Step numbers
   - Cube state at each step (from `cubeStateAfter`)
7. Verify the data format enables smooth integration between Feature 2 and Feature 3

**Expected Result (AR):**
The solution object structure exactly matches the expected interface/contract. All required fields are present with correct data types. The solution object is successfully passed to the visualization feature. Feature 3 can consume the solution without errors or data transformation. The integration between Feature 2 and Feature 3 is seamless. The data format supports all visualization requirements (step-by-step display, state visualization, move descriptions).

**Notes:**
- This tests FR-4.2.1 requirement for compatible output format
- Integration point between Feature 2 and Feature 3 is in [main.ts:160](../../src/client/main.ts#L160)
- Verify the Solution interface matches between features (no breaking changes)
- Test that format supports all Feature 3 capabilities

**Requirements:**
[FR-4.2.1: Visualization-Compatible Format](requirements.md#FR-4.2.1), [Dependency: Feature 3 Visualization](requirements.md#dependencies)

---

### TC_ASSEMBLY_013

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify solution metadata includes algorithm used and calculation time

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution calculation is triggered

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Monitor console logs for solution details
4. Verify the console displays:
   - "Algorithm: [algorithm name]" (e.g., "Algorithm: Kociemba" or "Algorithm: LayerByLayer")
   - "Calculation time: [time]ms" (e.g., "Calculation time: 1234.56ms")
   - "Complexity: [complexity indicator]" (e.g., "Complexity: medium")
5. Access the solution object and verify it contains:
   - `algorithmUsed`: String with algorithm name
   - `calculationTimeMs`: Number with execution time
   - `metadata.complexity`: String or object with complexity information
6. Verify the algorithm name is descriptive and meaningful (not just "default" or "solver")
7. Verify the calculation time is accurate (matches actual execution time within reasonable margin)

**Expected Result (AR):**
The solution includes metadata fields with algorithm name and calculation time. The algorithm name is descriptive and identifies the solving strategy used. The calculation time is accurate and reported in milliseconds. Console logs display this metadata in a user-friendly format. The metadata provides transparency about solution generation. Optional complexity indicator helps users understand the solution difficulty.

**Notes:**
- This tests FR-4.2.2 requirement (Should priority) for solution metadata
- Algorithm options per requirements: Kociemba (two-phase), CFOP, Layer-by-Layer
- Calculation time helps verify performance requirements (NFR-1.1, NFR-1.2)
- Metadata could be extended with additional info: solution optimality, algorithm version, etc.

**Requirements:**
[FR-4.2.2: Solution Metadata](requirements.md#FR-4.2.2)

---

### TC_ASSEMBLY_014

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify UI remains responsive during solution calculation

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed

**Steps:**
1. Open the application in browser
2. Complete cube configuration
3. Trigger solution calculation by clicking "Finish" (data-testid: `btn-finish-configuration`)
4. IMMEDIATELY after clicking, attempt to interact with the UI:
   - Move the mouse cursor around the page
   - Try hovering over elements
   - Try clicking buttons (if any are available during calculation)
   - Try scrolling the page
   - Try opening browser developer tools
5. Verify the UI responds to interactions (cursor moves smoothly, hover effects work)
6. Verify the page does not freeze or become unresponsive
7. Verify animations (if any) continue to play smoothly during calculation
8. Verify the loading indicator (spinner, progress bar) animates smoothly
9. Wait for calculation to complete
10. Verify the transition to visualization happens smoothly without lag

**Expected Result (AR):**
The UI remains fully responsive during solution calculation. The page does not freeze or hang. Mouse movements are smooth and responsive. Hover effects and animations continue to work. The loading indicator animates smoothly without stuttering. Browser interactions (console, scrolling) remain functional. The calculation runs asynchronously without blocking the main thread. User experience is smooth and professional throughout the process.

**Notes:**
- This tests NFR-1.3 (Must priority) for async/non-blocking processing
- Async processing is critical for good UX, especially with longer calculations
- Modern browsers use Web Workers or async/await for non-blocking computation
- Test with complex cube states that take longer to calculate (3-5 seconds)

**Requirements:**
[NFR-1.3: Non-Blocking UI](requirements.md#NFR-1.3)

---

### TC_ASSEMBLY_015

**Type:** `API`

**Priority:** `High`

**Name:** Verify initial cube state is maintained for reference throughout solution

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution calculation is ready to execute

**Steps:**
1. Open the application in browser
2. Complete cube configuration with a specific known state
3. Record the initial cube state (all 54 facelet colors)
4. Trigger solution calculation
5. Wait for solution calculation to complete
6. Access the solution object (via console or API)
7. Verify the solution contains an `initialState` field
8. Verify the `initialState` matches the original cube configuration exactly
9. Verify all 54 facelets in `initialState` match the original configuration
10. Verify the `initialState` is not modified during solution calculation
11. Verify the `initialState` remains accessible throughout the solution lifecycle

**Expected Result (AR):**
The solution object maintains the initial cube state for reference. The `initialState` field contains the complete original cube configuration. All 54 facelets match the original configuration exactly. The initial state is not modified or corrupted during calculation. The initial state remains available for reference, comparison, or restart functionality. The state is stored in a format compatible with the cube state data model.

**Notes:**
- This tests FR-1.2.1 requirement (Must priority) for maintaining initial state
- Initial state is needed for restarting visualization, comparing progress, or debugging
- Verify the state is a deep copy, not a reference that could be modified

**Requirements:**
[FR-1.2.1: Maintain Initial Cube State](requirements.md#FR-1.2.1)

---

### TC_ASSEMBLY_016

**Type:** `API`

**Priority:** `High`

**Name:** Verify intermediate cube states are tracked after each calculated move

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Solution calculation is ready to execute

**Steps:**
1. Open the application in browser
2. Complete cube configuration
3. Trigger solution calculation
4. Wait for solution calculation to complete
5. Access the solution increments array
6. Verify each increment contains a `cubeStateAfter` field
7. Verify the first increment's `cubeStateAfter` reflects the first move applied to initial state
8. Verify subsequent increments' `cubeStateAfter` reflect cumulative moves
9. Verify the final increment's `cubeStateAfter` is a solved cube state
10. Verify intermediate states are correctly calculated (apply moves sequentially and verify states match)
11. Verify no intermediate states are missing or corrupted

**Expected Result (AR):**
Each solution increment contains the cube state after that move is applied. Intermediate states are correctly calculated and stored. The sequence of states progresses logically from initial to solved. Each state accurately reflects all previous moves applied. The final state is a solved cube. Intermediate states can be used for visualization, debugging, or state reconstruction.

**Notes:**
- This tests FR-1.2.2 requirement (Must priority) for tracking intermediate states
- Intermediate states are essential for step-by-step visualization
- Verify states are calculated correctly by applying moves sequentially
- Consider performance: storing 54 facelets × number of moves can be memory-intensive

**Requirements:**
[FR-1.2.2: Track Intermediate Cube States](requirements.md#FR-1.2.2)

---

### TC_ASSEMBLY_017

**Type:** `API`

**Priority:** `Medium`

**Name:** Verify cube state can be reconstructed at any point in the solution

**Pre-conditions:**
- Application is loaded
- Solution has been calculated with multiple moves

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution increments array
5. Select a random step number (e.g., step 10 of 25)
6. Verify the increment at that step contains `cubeStateAfter` field
7. Verify the state can be extracted and used independently
8. Verify the state is in the correct format (matches cube state data model)
9. Verify the state can be used to restart visualization from that point
10. Test reconstructing states at multiple different steps (beginning, middle, end)
11. Verify all reconstructed states are valid and complete

**Expected Result (AR):**
The cube state at any point in the solution can be reconstructed from the solution increments. Each increment's `cubeStateAfter` field provides the complete state at that step. States are in the correct format and can be used independently. States can be used to jump to any point in the solution. The reconstruction is accurate and reliable. This enables features like "jump to step" or "restart from step X".

**Notes:**
- This tests FR-1.2.3 requirement (Should priority) for state reconstruction
- Reconstruction enables advanced navigation features in visualization
- Verify states are self-contained and don't require previous states to be valid

**Requirements:**
[FR-1.2.3: Reconstruct Cube State at Any Point](requirements.md#FR-1.2.3)

---

### TC_ASSEMBLY_018

**Type:** `API`

**Priority:** `Medium`

**Name:** Verify solution is optimized for reasonable number of moves

**Pre-conditions:**
- Application is loaded
- Multiple different cube configurations available for testing

**Steps:**
1. Open the application in browser
2. Test with multiple cube configurations of varying complexity:
   - Easy scramble (few moves from solved)
   - Medium scramble
   - Hard scramble (many moves from solved)
3. Calculate solutions for each configuration
4. Record the number of moves for each solution
5. Verify solutions are reasonable in length:
   - Easy scrambles: < 30 moves
   - Medium scrambles: < 60 moves
   - Hard scrambles: < 100 moves
6. Verify solutions are not excessively long (e.g., > 150 moves for typical scrambles)
7. Compare solution lengths across different configurations
8. Verify the algorithm produces consistent, reasonable-length solutions

**Expected Result (AR):**
Solutions are optimized to have a reasonable number of moves. Solution lengths are appropriate for the complexity of the cube state. Easy scrambles produce shorter solutions. Hard scrambles may produce longer solutions but remain reasonable. Solutions are not excessively long or inefficient. The algorithm balances solution quality with calculation speed.

**Notes:**
- This tests FR-2.1.4 requirement (Should priority) for solution optimization
- "Reasonable" is subjective but generally means < 100 moves for most cubes
- Optimal solutions (minimum moves) are not required, just reasonable
- Consider that faster algorithms may produce longer solutions

**Requirements:**
[FR-2.1.4: Optimize for Reasonable Number of Moves](requirements.md#FR-2.1.4)

---

### TC_ASSEMBLY_019

**Type:** `API`

**Priority:** `High`

**Name:** Verify solution calculation completes within acceptable time limits

**Pre-conditions:**
- Application is loaded
- Valid cube configuration is completed
- Timer or performance measurement available

**Steps:**
1. Open the application in browser
2. Complete cube configuration
3. Start timer when triggering solution calculation
4. Monitor calculation progress
5. Wait for calculation to complete
6. Stop timer when solution is ready
7. Verify calculation completes within 5 seconds (NFR-1.1 requirement)
8. Test with multiple different cube configurations
9. Verify average calculation time is acceptable
10. Verify no single calculation exceeds reasonable time limits (e.g., 10 seconds)
11. Verify calculation time is consistent across similar cube states

**Expected Result (AR):**
Solution calculation completes within acceptable time limits. Most calculations complete within 5 seconds. Complex cube states may take longer but remain reasonable. Calculation time is consistent and predictable. Users do not experience excessive waiting. The system provides feedback during calculation (loading indicator). Time limits are met for typical use cases.

**Notes:**
- This tests FR-2.1.5 requirement (Must priority) for acceptable calculation time
- NFR-1.1 specifies < 5 seconds, which is the primary target
- Some complex states may take longer but should not exceed 10 seconds
- Verify calculation is optimized and efficient

**Requirements:**
[FR-2.1.5: Acceptable Calculation Time](requirements.md#FR-2.1.5), [NFR-1.1: Calculation Time < 5s](requirements.md#NFR-1.1)

---

### TC_ASSEMBLY_020

**Type:** `API`

**Priority:** `Low`

**Name:** Verify solution avoids slice moves (M, E, S) for simplicity

**Pre-conditions:**
- Application is loaded
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution moves array
5. Verify all moves use only face moves: U, D, L, R, F, B
6. Verify NO slice moves are used:
   - M (middle layer parallel to R/L)
   - E (middle layer parallel to U/D)
   - S (middle layer parallel to F/B)
7. Verify NO wide moves are used (Uw, Dw, etc.)
8. Test with multiple different cube configurations
9. Verify slice moves are consistently avoided across all solutions

**Expected Result (AR):**
Solutions use only standard face moves (U, D, L, R, F, B) with modifiers (', 2). No slice moves (M, E, S) are present in any solution. No wide moves are used. The notation remains simple and beginner-friendly. Solutions are easier to understand and execute for users. The algorithm prioritizes simplicity over absolute optimality.

**Notes:**
- This tests FR-2.2.5 requirement (Should priority) for avoiding slice moves
- Slice moves are more advanced and can confuse beginners
- Avoiding slice moves may result in slightly longer solutions, which is acceptable
- Verify the algorithm is configured to avoid slice moves

**Requirements:**
[FR-2.2.5: Avoid Slice Moves](requirements.md#FR-2.2.5)

---

### TC_ASSEMBLY_021

**Type:** `API`

**Priority:** `High`

**Name:** Verify each assembly increment contains target face identifier

**Pre-conditions:**
- Application is loaded
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution increments array
5. Verify each increment contains a `face` field
6. Verify the `face` field contains a valid face identifier (U, D, L, R, F, B or Face enum)
7. Verify the face identifier matches the move notation (e.g., "R" notation → Right face)
8. Verify all increments have the face field (no missing values)
9. Test with multiple different solutions
10. Verify face identifiers are consistent and correct

**Expected Result (AR):**
Every assembly increment contains a target face identifier. The face field is present in all increments. Face identifiers are valid and match the move notation. The face field enables the visualization to highlight the correct face during animation. Face identifiers are in a format compatible with the cube state data model. No increments are missing the face field.

**Notes:**
- This tests FR-4.1.2 requirement (Must priority) for target face in increment
- Face identifier is essential for visualization to know which face to rotate
- Verify the face field matches the notation (R → Right, U → Up, etc.)

**Requirements:**
[FR-4.1.2: Target Face Identifier in Increment](requirements.md#FR-4.1.2)

---

### TC_ASSEMBLY_022

**Type:** `API`

**Priority:** `High`

**Name:** Verify each assembly increment contains rotation direction

**Pre-conditions:**
- Application is loaded
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution increments array
5. Verify each increment contains a `direction` field
6. Verify the `direction` field contains a valid value:
   - "clockwise" or "counterclockwise" (or enum equivalent)
   - Or boolean/flag indicating direction
7. Verify direction matches the move notation:
   - Base moves (U, D, L, R, F, B) → clockwise
   - Inverse moves (U', D', L', R', F', B') → counterclockwise
   - Double moves (U2, D2, etc.) → either direction (180°)
8. Verify all increments have the direction field
9. Test with moves in all directions
10. Verify direction values are consistent and correct

**Expected Result (AR):**
Every assembly increment contains a rotation direction field. The direction field is present in all increments. Direction values are valid and match the move notation. The direction field enables the visualization to animate the correct rotation. Direction is clearly specified (clockwise/counterclockwise). No increments are missing the direction field.

**Notes:**
- This tests FR-4.1.3 requirement (Must priority) for rotation direction in increment
- Direction is essential for visualization to animate the correct rotation
- Verify direction matches notation: base = clockwise, ' = counterclockwise, 2 = either

**Requirements:**
[FR-4.1.3: Rotation Direction in Increment](requirements.md#FR-4.1.3)

---

### TC_ASSEMBLY_023

**Type:** `API`

**Priority:** `High`

**Name:** Verify each assembly increment contains rotation amount

**Pre-conditions:**
- Application is loaded
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution increments array
5. Verify each increment contains a `degrees` field (or `rotationAmount`, `angle`, etc.)
6. Verify the `degrees` field contains a valid value: 90 or 180
7. Verify degrees matches the move notation:
   - Base moves (U, D, L, R, F, B) → 90°
   - Inverse moves (U', D', L', R', F', B') → 90°
   - Double moves (U2, D2, L2, R2, F2, B2) → 180°
8. Verify all increments have the degrees field
9. Test with moves of both rotation amounts
10. Verify degrees values are consistent and correct

**Expected Result (AR):**
Every assembly increment contains a rotation amount field. The degrees field is present in all increments. Rotation amounts are valid (90° or 180°). Degrees match the move notation correctly. The degrees field enables the visualization to animate the correct rotation amount. No increments are missing the degrees field.

**Notes:**
- This tests FR-4.1.4 requirement (Must priority) for rotation amount in increment
- Rotation amount is essential for visualization to animate the correct degree of rotation
- Verify degrees match notation: base/' = 90°, 2 = 180°

**Requirements:**
[FR-4.1.4: Rotation Amount in Increment](requirements.md#FR-4.1.4)

---

### TC_ASSEMBLY_024

**Type:** `API`

**Priority:** `High`

**Name:** Verify each assembly increment contains step number

**Pre-conditions:**
- Application is loaded
- Solution has been calculated

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution increments array
5. Verify each increment contains a `stepNumber` field
6. Verify step numbers are sequential starting from 1 (or 0, depending on implementation)
7. Verify step numbers are consecutive with no gaps
8. Verify the first increment has stepNumber = 1 (or 0)
9. Verify the last increment has stepNumber = totalMoves
10. Verify step numbers match the array index + 1 (if 1-based) or array index (if 0-based)
11. Verify all increments have the stepNumber field

**Expected Result (AR):**
Every assembly increment contains a step number field. Step numbers are sequential and consecutive. The first step is numbered 1 (or 0). The last step number matches the total number of moves. Step numbers are consistent and match the increment's position in the sequence. No increments are missing the stepNumber field. Step numbers enable navigation and progress tracking in visualization.

**Notes:**
- This tests FR-4.1.6 requirement (Must priority) for step number in increment
- Step number is essential for navigation, progress display, and referencing specific moves
- Verify step numbers are 1-based (starting from 1) or 0-based (starting from 0) consistently

**Requirements:**
[FR-4.1.6: Step Number in Increment](requirements.md#FR-4.1.6)

---

### TC_ASSEMBLY_025

**Type:** `API`

**Priority:** `Low`

**Name:** Verify solution supports serialization for storage/sharing (if implemented)

**Pre-conditions:**
- Application is loaded
- Solution has been calculated
- Serialization feature is available (if implemented)

**Steps:**
1. Open the application in browser
2. Complete cube configuration and trigger solution calculation
3. Wait for solution to complete
4. Access the solution object
5. If serialization is implemented:
   - Attempt to serialize the solution (JSON.stringify or similar)
   - Verify serialization succeeds without errors
   - Verify serialized format is valid JSON
   - Verify all essential data is preserved in serialized format
   - Attempt to deserialize the solution
   - Verify deserialized solution matches original
   - Verify deserialized solution can be used for visualization
6. If serialization is not implemented:
   - Verify this is acceptable (Could priority requirement)
   - Document that feature is not implemented

**Expected Result (AR):**
If serialization is implemented, solutions can be serialized to a standard format (e.g., JSON). Serialized solutions can be stored, shared, or transmitted. Deserialized solutions are complete and functional. All essential data is preserved through serialization/deserialization. If not implemented, this is acceptable as it's a Could priority requirement.

**Notes:**
- This tests FR-4.2.3 requirement (Could priority) for solution serialization
- This is a "Could" requirement, so implementation is optional
- Serialization enables features like saving solutions, sharing URLs, exporting solutions
- If not implemented, document in test results

**Requirements:**
[FR-4.2.3: Solution Serialization](requirements.md#FR-4.2.3)

---

### TC_ASSEMBLY_026

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify calculation timeout is handled gracefully

**Pre-conditions:**
- Application is loaded
- Configuration is completed
- System has timeout mechanism (if implemented)

**Steps:**
1. Open the application in browser
2. Complete cube configuration
3. Trigger solution calculation
4. If timeout mechanism exists:
   - Simulate or wait for calculation timeout
   - Verify timeout is detected and handled
   - Verify user receives a timeout error message
   - Verify the message is clear and actionable
   - Verify the UI remains responsive after timeout
   - Verify user can retry calculation or return to configuration
5. If timeout mechanism does not exist:
   - Verify calculation completes within reasonable time
   - Document that timeout handling is not implemented
   - Note that this may be acceptable depending on algorithm guarantees

**Expected Result (AR):**
If timeout handling is implemented, calculation timeouts are detected and handled gracefully. Users receive clear error messages explaining the timeout. The UI remains responsive. Users can retry or take alternative actions. If not implemented, calculations complete within acceptable time limits, or the system handles long calculations appropriately.

**Notes:**
- This tests the "Calculation timeout" edge case from requirements
- Timeout handling prevents indefinite hangs
- Consider implementing timeout for algorithms that may not guarantee completion time
- Timeout duration should be reasonable (e.g., 10-15 seconds)

**Requirements:**
[Edge Cases: Calculation Timeout](requirements.md#edge-cases--error-scenarios)

---

## Coverage Matrix

| Requirement ID | Test Cases |
|---------------|------------|
| FR-1.1.1 - Accept validated cube state | TC_ASSEMBLY_001 |
| FR-1.1.2 - Verify state completeness | TC_ASSEMBLY_003 |
| FR-1.1.3 - Verify state validity | TC_ASSEMBLY_008 |
| FR-2.1.1 - Solving algorithm capability | TC_ASSEMBLY_003, TC_ASSEMBLY_004 |
| FR-2.1.2 - Complete solution generation | TC_ASSEMBLY_003, TC_ASSEMBLY_004 |
| FR-2.1.3 - Solution correctness | TC_ASSEMBLY_004 |
| FR-2.2.1 - Standard notation | TC_ASSEMBLY_005 |
| FR-2.2.2 - Basic face moves (U,D,L,R,F,B) | TC_ASSEMBLY_005 |
| FR-2.2.3 - Inverse moves (') | TC_ASSEMBLY_005 |
| FR-2.2.4 - Double moves (2) | TC_ASSEMBLY_005 |
| FR-3.1.1 - Discrete individual moves | TC_ASSEMBLY_003 |
| FR-3.1.2 - Correct move sequencing | TC_ASSEMBLY_003, TC_ASSEMBLY_004 |
| FR-3.1.3 - Sequential step numbers | TC_ASSEMBLY_003, TC_ASSEMBLY_006 |
| FR-3.1.4 - Total move count | TC_ASSEMBLY_003, TC_ASSEMBLY_010 |
| FR-3.2.1 - Move notation for each step | TC_ASSEMBLY_005, TC_ASSEMBLY_006 |
| FR-3.2.2 - Human-readable description | TC_ASSEMBLY_006 |
| FR-3.2.3 - Face indication | TC_ASSEMBLY_006 |
| FR-3.2.4 - Direction indication | TC_ASSEMBLY_006 |
| FR-3.2.5 - Degree indication | TC_ASSEMBLY_006 |
| FR-1.2.1 - Maintain initial cube state | TC_ASSEMBLY_015 |
| FR-1.2.2 - Track intermediate cube states | TC_ASSEMBLY_016 |
| FR-1.2.3 - Reconstruct cube state at any point | TC_ASSEMBLY_017 |
| FR-2.1.4 - Optimize for reasonable moves | TC_ASSEMBLY_018 |
| FR-2.1.5 - Acceptable calculation time | TC_ASSEMBLY_019 |
| FR-2.2.5 - Avoid slice moves | TC_ASSEMBLY_020 |
| FR-4.1.1 - Move notation in increment | TC_ASSEMBLY_003 |
| FR-4.1.2 - Target face identifier in increment | TC_ASSEMBLY_021 |
| FR-4.1.3 - Rotation direction in increment | TC_ASSEMBLY_022 |
| FR-4.1.4 - Rotation amount in increment | TC_ASSEMBLY_023 |
| FR-4.1.5 - Cube state after move | TC_ASSEMBLY_011 |
| FR-4.1.6 - Step number in increment | TC_ASSEMBLY_024 |
| FR-4.2.1 - Visualization-compatible format | TC_ASSEMBLY_012 |
| FR-4.2.2 - Solution metadata | TC_ASSEMBLY_013 |
| FR-4.2.3 - Solution serialization | TC_ASSEMBLY_025 |
| NFR-1.1 - Calculation time < 5s | TC_ASSEMBLY_002, TC_ASSEMBLY_019 |
| NFR-1.2 - Typical state < 2s | TC_ASSEMBLY_002 |
| NFR-1.3 - Non-blocking UI | TC_ASSEMBLY_014 |
| NFR-2.1 - Solution correctness | TC_ASSEMBLY_004 |
| NFR-2.2 - Solution length < 100 moves | TC_ASSEMBLY_010 |
| NFR-3.1 - Graceful error handling | TC_ASSEMBLY_008 |
| NFR-3.2 - Meaningful error messages | TC_ASSEMBLY_008 |
| NFR-3.3 - Deterministic solutions | TC_ASSEMBLY_007 |
| AC-1 - Configuration Integration | TC_ASSEMBLY_001, TC_ASSEMBLY_008 |
| AC-2 - Solution Calculation | TC_ASSEMBLY_002, TC_ASSEMBLY_003, TC_ASSEMBLY_004 |
| AC-3 - Output Format | TC_ASSEMBLY_003, TC_ASSEMBLY_012 |
| Edge Case - Cube already solved | TC_ASSEMBLY_009 |
| Edge Case - Invalid cube state | TC_ASSEMBLY_008 |
| Edge Case - Calculation timeout | TC_ASSEMBLY_026 |
| Dependency - Feature 1 Integration | TC_ASSEMBLY_001 |
| Dependency - Feature 3 Integration | TC_ASSEMBLY_012 |
