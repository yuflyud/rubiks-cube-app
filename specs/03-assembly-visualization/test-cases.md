# Test Cases: Feature 3 - Rubik's Cube Assembly Visualization

## Summary
- **Total Test Cases:** 38
- **High Priority:** 13
- **Medium Priority:** 20
- **Low Priority:** 5
- **Types:** E2E (38)

## Feature Location Map
| Feature | Navigation Path |
|---------|-----------------|
| Visualization Interface | Triggered automatically after Feature 2 (Solution Calculation) completion |
| Cube Display | Visualization Page → Cube Rendering Area |
| Move Display | Visualization Page → Current Move Section |
| Navigation Controls | Visualization Page → Control Panel (Next/Previous buttons) |
| Step Indicator | Visualization Page → Progress Display |
| Playback Controls | Visualization Page → Playback Control Panel |
| Completion Modal | Displayed after final step completion |

---

## Test Cases

### High Priority

### TC_VISUAL_001

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify visualization is displayed after solution calculation completes

**Pre-conditions:**
- Application is loaded
- Features 1 and 2 are completed (configuration and solution calculation)
- Solution with at least 1 move is available

**Steps:**
1. Open the application in browser (base application URL)
2. Complete cube configuration in Feature 1
3. Wait for solution calculation to complete in Feature 2
4. Verify the interface transitions from configuration to visualization automatically
5. Verify the visualization page displays the following components:
   - Cube rendering area showing the initial cube state (data-testid: `cube-display`)
   - Current move display section (data-testid: `move-display`)
   - Navigation controls with "Next" and "Previous" buttons (data-testid: `navigation-controls`)
   - Step indicator showing "Step 0 of X" or "Step 1 of X" (data-testid: `step-indicator`)
6. Verify the cube is displayed in a clear, readable format (2D unfolded or 3D)
7. Verify all cube colors match the original configuration
8. Verify the initial state shows the scrambled cube (not solved)

**Expected Result (AR):**
Upon solution calculation completion, the visualization interface automatically loads. The visualization page displays all required components (cube, move display, controls, step indicator). The cube rendering is clear and shows the correct initial scrambled state with accurate colors. The interface is ready for user interaction. No errors or missing components.

**Notes:**
- This tests the integration between Feature 2 and Feature 3
- Visualization initialization happens in [main.ts:176-211](../../src/client/main.ts#L176-L211)
- Verify the transition is smooth (no page reload or jarring changes)

**Requirements:**
[FR-1.1: Cube Display](requirements.md#FR-1.1), [Dependency: Feature 2 Integration](requirements.md#dependencies)

---

### TC_VISUAL_002

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can advance to next step with "Next" button

**Pre-conditions:**
- Visualization interface is displayed
- Current step is not the final step
- Solution has at least 2 moves

**Steps:**
1. Access the visualization interface with a solution loaded
2. Verify the initial state is displayed (Step 0 or Step 1)
3. Locate the "Next" button in the navigation controls (data-testid: `btn-next`)
4. Verify the "Next" button is enabled and clickable
5. Click the "Next" button
6. Verify a move animation begins (cube face rotates)
7. Wait for the animation to complete (observe the cube rotation)
8. Verify the cube state updates to reflect the completed move
9. Verify the move display shows the current move notation and description
10. Verify the step indicator updates to show "Step 2 of X" (or next step number)
11. Click "Next" again to advance to the following step
12. Verify the process repeats successfully for the next move

**Expected Result (AR):**
Clicking the "Next" button triggers a move animation. The animation shows the cube face rotating in the correct direction. The animation completes smoothly without errors. After animation, the cube displays the updated state with correct colors. The move display shows the current move's notation and description. The step indicator increments correctly. The "Next" button remains functional for subsequent moves.

**Notes:**
- This tests FR-3.1 (Forward Navigation) requirements
- Animation timing should follow the specs (slow: 1500ms, normal: 750ms, fast: 300ms per requirements)
- Verify the cube state matches the expected result from the solution's `cubeStateAfter`

**Requirements:**
[FR-3.1: Forward Navigation](requirements.md#FR-3.1), [FR-2: Animated Assembly Steps](requirements.md#FR-2)

---

### TC_VISUAL_003

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can return to previous step with "Previous" button

**Pre-conditions:**
- Visualization interface is displayed
- At least one move has been executed (current step >= 2)

**Steps:**
1. Access the visualization interface with a solution loaded
2. Click "Next" at least twice to advance to Step 3 or higher (data-testid: `btn-next`)
3. Note the current cube state and step number (e.g., Step 3 of 20)
4. Locate the "Previous" button in the navigation controls (data-testid: `btn-previous`)
5. Verify the "Previous" button is enabled and clickable
6. Click the "Previous" button
7. Verify a reverse animation plays (cube face rotates in opposite direction) OR cube state updates immediately
8. If animation plays, wait for it to complete
9. Verify the cube state reverts to the previous step's state (Step 2 in this example)
10. Verify the move display shows the previous move's notation and description
11. Verify the step indicator updates to show "Step 2 of X"
12. Click "Previous" again to go back another step
13. Verify the process repeats successfully

**Expected Result (AR):**
Clicking the "Previous" button successfully navigates to the previous step. The cube state reverts accurately to the prior step's configuration. If reverse animation is implemented, it plays smoothly showing the move being undone. The move display updates to show the previous move. The step indicator decrements correctly. The user can navigate backward through multiple steps successfully. The cube state at each step matches the expected state from the solution data.

**Notes:**
- This tests FR-3.2 (Backward Navigation) requirements
- FR-3.2.3 indicates reverse animation is "Should" priority (optional)
- Verify state accuracy when navigating backward and then forward again

**Requirements:**
[FR-3.2: Backward Navigation](requirements.md#FR-3.2)

---

### TC_VISUAL_004

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify "Next" button is disabled at the final step

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been calculated

**Steps:**
1. Access the visualization interface with a solution loaded
2. Note the total number of steps from the step indicator (e.g., "Step 1 of 20")
3. Click the "Next" button repeatedly to advance through all steps (data-testid: `btn-next`)
4. Continue clicking "Next" until reaching the final step (e.g., "Step 20 of 20")
5. Wait for the final move animation to complete
6. Verify the cube displays the solved state (each face is a single uniform color)
7. Locate the "Next" button in the navigation controls
8. Verify the "Next" button is now disabled (grayed out, not clickable, or displays disabled state)
9. Attempt to click the "Next" button
10. Verify no action occurs (button does not respond)
11. Verify a completion notification or modal appears (e.g., "Congratulations! Cube solved!")

**Expected Result (AR):**
Upon reaching the final step, the "Next" button becomes disabled. Visual indication clearly shows the button is disabled (grayed out, reduced opacity, disabled cursor). Clicking the disabled button has no effect. The cube displays the fully solved state. A completion notification or modal appears congratulating the user. The step indicator shows the final step number accurately (e.g., "Step 20 of 20").

**Notes:**
- This tests FR-3.1.3 requirement for disabling "Next" at final step
- Completion notification tests FR-4.1 (Success Indication)
- Verify the solved cube has all faces showing single uniform colors

**Requirements:**
[FR-3.1.3: Disable Next at Final Step](requirements.md#FR-3.1.3), [FR-4.1: Success Indication](requirements.md#FR-4.1)

---

### TC_VISUAL_005

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify "Previous" button is disabled at the first step

**Pre-conditions:**
- Visualization interface is displayed
- Visualization is at the initial state (Step 0 or Step 1)

**Steps:**
1. Access the visualization interface immediately after solution calculation
2. Verify the step indicator shows the initial step (e.g., "Step 1 of 20" or "Step 0 of 20")
3. Locate the "Previous" button in the navigation controls (data-testid: `btn-previous`)
4. Verify the "Previous" button is disabled (grayed out, not clickable, or displays disabled state)
5. Attempt to click the "Previous" button
6. Verify no action occurs (button does not respond)
7. Click "Next" to advance to Step 2 (data-testid: `btn-next`)
8. Verify the "Previous" button is now enabled after advancing
9. Click "Previous" to return to Step 1
10. Verify the "Previous" button becomes disabled again at Step 1

**Expected Result (AR):**
At the initial step, the "Previous" button is disabled. Visual indication clearly shows disabled state. Clicking the disabled button has no effect. After advancing to Step 2 or higher, the "Previous" button becomes enabled. Returning to Step 1 disables the button again. The button state correctly reflects the current position in the solution sequence.

**Notes:**
- This tests FR-3.2.4 requirement for disabling "Previous" at first step
- Verify the initial step might be labeled as "Step 0" (showing initial state) or "Step 1" (first move)
- Button states should update dynamically based on current position

**Requirements:**
[FR-3.2.4: Disable Previous at First Step](requirements.md#FR-3.2.4)

---

### TC_VISUAL_006

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify step indicator displays current step number and total steps

**Pre-conditions:**
- Visualization interface is displayed
- Solution has multiple moves (e.g., 20 moves)

**Steps:**
1. Access the visualization interface with a solution loaded
2. Locate the step indicator component (data-testid: `step-indicator`)
3. Verify the step indicator displays the format: "Step X of Y"
   - Where X is the current step number
   - Where Y is the total number of steps
4. At the initial state, verify display shows "Step 0 of 20" or "Step 1 of 20" (depending on implementation)
5. Click "Next" to advance to the next step (data-testid: `btn-next`)
6. Verify the step indicator updates to "Step 2 of 20" (or next appropriate number)
7. Advance through 5 more steps by clicking "Next" repeatedly
8. Verify the step indicator correctly shows "Step 7 of 20" (or appropriate number)
9. Click "Previous" to go back one step (data-testid: `btn-previous`)
10. Verify the step indicator updates backward to "Step 6 of 20"
11. Advance to the final step
12. Verify the step indicator shows "Step 20 of 20" at completion

**Expected Result (AR):**
The step indicator is always visible and displays the format "Step X of Y". The current step number (X) updates accurately when navigating forward or backward. The total steps number (Y) remains constant throughout. The indicator updates immediately after each navigation action. The displayed numbers match the actual position in the solution sequence. The format is clear and easy to understand.

**Notes:**
- This tests FR-3.3 (Step Indicator) requirements
- The step indicator provides progress awareness to the user
- Verify the total step count matches the solution's `totalMoves` field

**Requirements:**
[FR-3.3: Step Indicator](requirements.md#FR-3.3)

---

### TC_VISUAL_007

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify current move notation and description are displayed

**Pre-conditions:**
- Visualization interface is displayed
- At least one move has been executed or is ready to execute

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to Step 1 by clicking "Next" (data-testid: `btn-next`)
3. Locate the move display section (data-testid: `move-display`)
4. Verify the move notation is prominently displayed (e.g., "R", "U'", "F2")
5. Verify the human-readable description is displayed alongside or below the notation
   - Example: "R" displays "Rotate Right face clockwise 90°"
   - Example: "U'" displays "Rotate Up face counter-clockwise 90°"
   - Example: "F2" displays "Rotate Front face 180°"
6. Verify the notation and description match the current step's move from the solution
7. Click "Next" to advance to the next step
8. Verify the move display updates to show the new move's notation and description
9. Click "Previous" to return to the previous step (data-testid: `btn-previous`)
10. Verify the move display reverts to show the previous move's notation and description
11. Test with multiple different moves to ensure consistent display

**Expected Result (AR):**
The move display section clearly shows the current move's notation prominently. The human-readable description is displayed and accurately explains the move. The notation uses standard Rubik's cube format (U, D, L, R, F, B with ', 2 modifiers). The description is clear and understandable without technical jargon. The display updates immediately when navigating to different steps. Each move's notation and description match the solution data from Feature 2.

**Notes:**
- This tests FR-1.2 (Move Display) requirements
- Move descriptions come from the AssemblyIncrement objects in the solution
- Verify the display is prominent and easy to read (large font, high contrast)

**Requirements:**
[FR-1.2: Move Display](requirements.md#FR-1.2), [FR-3.2: Move Description from Feature 2](../02-assembly-mechanism/requirements.md#FR-3.2)

---

### TC_VISUAL_008

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify move animation shows correct rotation direction and degree

**Pre-conditions:**
- Visualization interface is displayed
- Solution has moves with different directions and degrees

**Steps:**
1. Access the visualization interface with a solution loaded
2. Identify moves with different characteristics in the solution:
   - Clockwise 90° move (e.g., "R")
   - Counter-clockwise 90° move (e.g., "U'")
   - 180° move (e.g., "F2")
3. Navigate to a clockwise 90° move and click "Next" (data-testid: `btn-next`)
4. Observe the animation carefully
5. Verify the cube face rotates in the clockwise direction (when viewed from that face)
6. Verify the rotation completes at 90° (quarter turn)
7. Navigate to a counter-clockwise 90° move
8. Click "Next" and observe the animation
9. Verify the cube face rotates in the counter-clockwise direction
10. Verify the rotation completes at 90°
11. Navigate to a 180° move
12. Click "Next" and observe the animation
13. Verify the cube face rotates 180° (half turn)
14. Verify the animation clearly shows the direction and degree

**Expected Result (AR):**
Animations accurately depict the rotation direction specified in the move notation. Clockwise moves rotate in clockwise direction. Counter-clockwise moves (with ') rotate in counter-clockwise direction. 90° moves rotate a quarter turn (90 degrees). 180° moves (with 2) rotate a half turn (180 degrees). The animation is smooth and clearly shows the rotation. Users can visually understand which way to turn their physical cube. The cube state after animation matches the expected result.

**Notes:**
- This tests FR-2.1 (Move Animation) requirements, specifically FR-2.1.2 and FR-2.1.3
- Correct rotation direction and degree are critical for user understanding
- Clockwise is defined as the direction when looking directly at that face

**Requirements:**
[FR-2.1.2: Clear Rotation Direction](requirements.md#FR-2.1.2), [FR-2.1.3: Correct Rotation Degree](requirements.md#FR-2.1.3)

---

### TC_VISUAL_009

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify completion notification appears after final step

**Pre-conditions:**
- Visualization interface is displayed
- User is at or near the final step of the solution

**Steps:**
1. Access the visualization interface with a solution loaded
2. Navigate to the final step by clicking "Next" repeatedly (data-testid: `btn-next`)
3. Verify the final move animation plays and completes
4. Verify the cube displays the solved state (all faces uniform colors)
5. Verify a completion notification or modal appears automatically
6. Verify the notification includes:
   - Success message (e.g., "Congratulations! Cube solved!" or "Solution complete!")
   - Clear indication that all steps are finished
7. Optionally, verify the notification displays completion statistics:
   - Total moves executed (e.g., "Solved in 20 moves")
   - Time taken (if tracked)
8. Verify the notification includes action buttons:
   - "Restart" or "Review Solution" button (data-testid: `btn-restart`)
   - "Configure New Cube" button (data-testid: `btn-new-cube`)
9. Optionally, verify a celebratory animation plays (confetti, sparkles, etc.)

**Expected Result (AR):**
Upon completing the final step, a completion notification automatically appears. The notification clearly indicates successful solution completion. A success message congratulates the user. The solved cube state is displayed with all faces showing uniform colors. Optional statistics provide completion details. Action buttons offer clear next steps (restart or new cube). Optional celebratory animation enhances the user experience. The notification is prominent and visually appealing.

**Notes:**
- This tests FR-4.1 (Success Indication) requirements
- FR-4.1.4 suggests celebratory visual effect (Should priority, optional)
- Verify the notification doesn't block the view of the solved cube

**Requirements:**
[FR-4.1: Success Indication](requirements.md#FR-4.1), [FR-4.2: Post-Completion Actions](requirements.md#FR-4.2)

---

### TC_VISUAL_010

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can restart visualization with "Restart" button

**Pre-conditions:**
- Visualization interface is displayed
- User has advanced through several steps or completed the solution

**Steps:**
1. Access the visualization interface with a solution loaded
2. Click "Next" several times to advance to Step 10 or higher (data-testid: `btn-next`)
3. Locate the "Restart" or "Reset" button (may be in playback controls or completion modal)
   (data-testid: `btn-restart` or `btn-reset`)
4. Click the "Restart" button
5. Verify one of the following behaviors:
   - (a) The visualization resets to the initial state (Step 0 or Step 1)
   - (b) A confirmation dialog appears asking "Restart visualization from the beginning?"
6. If confirmation dialog appears, click "Yes" or "Confirm"
7. Verify the visualization resets to the initial state:
   - Cube displays the original scrambled configuration
   - Step indicator shows "Step 0 of X" or "Step 1 of X"
   - "Previous" button is disabled
   - "Next" button is enabled
8. Click "Next" to verify the solution replays from the beginning
9. Verify the moves execute in the same sequence as before

**Expected Result (AR):**
Clicking the "Restart" button successfully resets the visualization to the initial state. The cube displays the original scrambled configuration. The step indicator resets to the first step. Navigation buttons return to their initial states (Previous disabled, Next enabled). The solution can be replayed from the beginning. All move sequences are identical to the first playthrough. Optional confirmation dialog prevents accidental restarts.

**Notes:**
- This tests FR-4.2.1 and FR-3.4.5 requirements for restart functionality
- Restart button location may vary: completion modal, playback controls, or navigation bar
- Verify the same solution instance is used (no recalculation needed)

**Requirements:**
[FR-4.2.1: Restart Option](requirements.md#FR-4.2.1), [FR-3.4.5: Reset Button](requirements.md#FR-3.4.5)

---

### Medium Priority

### TC_VISUAL_011

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify user can configure a new cube after completion

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been completed
- Completion notification is displayed

**Steps:**
1. Access the visualization interface and complete all solution steps
2. Verify the completion notification or modal appears (data-testid: `completion-modal`)
3. Locate the "Configure New Cube" or "New Cube" button (data-testid: `btn-new-cube`)
4. Click the "Configure New Cube" button
5. Verify the application transitions from visualization back to Feature 1 (Configuration interface)
6. Verify the configuration interface is in its initial state (ready for new configuration):
   - No colors assigned (or reset to default)
   - Progress indicator at 0%
   - Guided mode starts at the first face
7. Configure a new cube with different colors than the previous one
8. Complete the new configuration and trigger solution calculation
9. Verify the new visualization loads with the new cube configuration and solution

**Expected Result (AR):**
Clicking "Configure New Cube" successfully transitions to the configuration interface. The configuration is reset to initial state (no previous configuration persists). The user can configure a new cube from scratch. The new configuration is processed correctly through Features 1, 2, and 3. The new visualization displays the new cube state and solution. The workflow supports multiple complete cycles without page refresh. No errors or data corruption occurs between cycles.

**Notes:**
- This tests FR-4.2.2 requirement for new cube option
- In current implementation, this may trigger a page reload (location.reload() in [main.ts:206](../../src/client/main.ts#L206))
- Verify state is properly reset between different cube configurations

**Requirements:**
[FR-4.2.2: Configure New Cube Option](requirements.md#FR-4.2.2)

---

### TC_VISUAL_012

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify keyboard shortcuts work for navigation

**Pre-conditions:**
- Visualization interface is displayed
- Keyboard shortcuts are implemented and enabled

**Steps:**
1. Access the visualization interface with a solution loaded
2. Ensure focus is on the visualization interface (click somewhere on the page)
3. Press the Right Arrow key (→) or Spacebar on the keyboard
4. Verify the visualization advances to the next step (same as clicking "Next")
5. Verify the move animation plays and the cube state updates
6. Press the Right Arrow key again
7. Verify the visualization advances to the next step again
8. Press the Left Arrow key (←) on the keyboard
9. Verify the visualization returns to the previous step (same as clicking "Previous")
10. Verify the cube state reverts correctly
11. Test advancing through multiple steps using only keyboard shortcuts
12. Verify keyboard shortcuts work consistently throughout the visualization

**Expected Result (AR):**
Keyboard shortcuts successfully control visualization navigation. Right Arrow (→) or Spacebar advances to the next step. Left Arrow (←) returns to the previous step. Keyboard navigation produces identical results to clicking buttons. Shortcuts work consistently throughout the solution. The interface responds immediately to keyboard input. Users can complete the entire visualization using only the keyboard.

**Notes:**
- This tests FR-3.1.4 and FR-3.2.5 requirements (Should priority) for keyboard shortcuts
- Keyboard shortcuts improve accessibility and efficiency
- Common conventions: → or Space for Next, ← for Previous
- Verify shortcuts don't conflict with browser shortcuts

**Requirements:**
[FR-3.1.4: Forward Navigation Keyboard Shortcut](requirements.md#FR-3.1.4), [FR-3.2.5: Backward Navigation Keyboard Shortcut](requirements.md#FR-3.2.5)

---

### TC_VISUAL_013

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify animation speed can be configured

**Pre-conditions:**
- Visualization interface is displayed
- Animation speed controls are implemented

**Steps:**
1. Access the visualization interface with a solution loaded
2. Locate the animation speed control (dropdown, slider, or buttons) (data-testid: `speed-control`)
3. Verify the current speed setting is indicated (e.g., "Normal" is default)
4. Advance to a step by clicking "Next" (data-testid: `btn-next`)
5. Note the animation duration at the default "Normal" speed (expected: ~750ms per requirements)
6. Change the speed setting to "Slow" using the speed control
7. Click "Next" to execute another move
8. Verify the animation is noticeably slower (expected: ~1500ms per requirements)
9. Change the speed setting to "Fast"
10. Click "Next" to execute another move
11. Verify the animation is noticeably faster (expected: ~300ms per requirements)
12. Navigate backward and forward at different speeds to verify consistent behavior
13. Optionally, verify the speed preference is remembered if the user restarts or refreshes

**Expected Result (AR):**
Animation speed can be configured through a clearly labeled control. At least 3 speed options are available: Slow, Normal, Fast. Changing the speed setting immediately affects subsequent animations. Slow speed animations are approximately 1500ms (1.5 seconds). Normal speed animations are approximately 750ms (0.75 seconds). Fast speed animations are approximately 300ms (0.3 seconds). The selected speed applies to all moves consistently. Optional: Speed preference persists across restarts or page refreshes.

**Notes:**
- This tests FR-2.2 (Animation Customization) requirements (Should priority)
- Speed options per requirements UI specs: Slow=1500ms, Normal=750ms, Fast=300ms
- FR-2.2.4 suggests speed preference should be remembered (Could priority, optional)

**Requirements:**
[FR-2.2: Animation Customization](requirements.md#FR-2.2), [Animation Timing Specifications](requirements.md#animation-timing)

---

### TC_VISUAL_014

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify progress bar visualization shows completion percentage

**Pre-conditions:**
- Visualization interface is displayed
- Progress bar component is implemented (Should priority per FR-3.3.4)

**Steps:**
1. Access the visualization interface with a solution loaded (e.g., 20 total moves)
2. Locate the progress bar component (data-testid: `progress-bar`)
3. Verify the progress bar is initially empty or shows 0% completion
4. Click "Next" to advance to Step 1 (data-testid: `btn-next`)
5. Verify the progress bar fills slightly to indicate 1/20 completion (~5%)
6. Advance to Step 10 (halfway through the solution)
7. Verify the progress bar is approximately 50% filled
8. Advance to Step 15
9. Verify the progress bar is approximately 75% filled
10. Advance to the final step (Step 20)
11. Verify the progress bar is 100% filled
12. Navigate backward to Step 15 using "Previous" (data-testid: `btn-previous`)
13. Verify the progress bar decreases to approximately 75%

**Expected Result (AR):**
A progress bar is visible throughout the visualization. The progress bar accurately represents completion percentage: (current step / total steps) × 100%. The bar fills proportionally as the user advances through steps. The fill percentage matches the step indicator's progress. The progress bar updates smoothly when navigating forward or backward. The bar is 100% filled at the final step. Visual styling makes progress easy to understand at a glance.

**Notes:**
- This tests FR-3.3.4 requirement (Should priority) for progress bar
- Progress bar provides visual progress feedback complementing the step indicator
- Typical styling: filled portion in one color, unfilled in another, with smooth transitions

**Requirements:**
[FR-3.3.4: Progress Bar Visualization](requirements.md#FR-3.3.4)

---

### TC_VISUAL_015

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify auto-play mode automatically advances through steps

**Pre-conditions:**
- Visualization interface is displayed
- Auto-play controls are implemented (Should priority per FR-3.4)

**Steps:**
1. Access the visualization interface with a solution loaded
2. Locate the playback controls section (data-testid: `playback-controls`)
3. Locate the "Play" button (data-testid: `btn-play`)
4. Click the "Play" button
5. Verify the visualization automatically advances to the next step without user interaction
6. Verify the move animation plays
7. After the animation completes, verify a brief delay occurs (e.g., 1-2 seconds)
8. Verify the visualization automatically advances to the next step after the delay
9. Verify the automatic progression continues through multiple steps
10. Locate the "Pause" button (which may replace the "Play" button) (data-testid: `btn-pause`)
11. Click the "Pause" button during auto-play
12. Verify the auto-play stops and the visualization remains at the current step
13. Verify clicking "Play" again resumes auto-play from the current position

**Expected Result (AR):**
Clicking the "Play" button initiates auto-play mode. The visualization automatically advances through steps without user interaction. Each move animation plays automatically. A configurable delay occurs between steps (default per requirements: 1500ms for Normal speed). Auto-play continues until paused or the final step is reached. Clicking "Pause" successfully stops auto-play. The current position is maintained when paused. Clicking "Play" again resumes from the paused position. The user can interrupt auto-play at any time.

**Notes:**
- This tests FR-3.4 (Playback Controls) requirements (Should priority, optional feature)
- Delay between auto steps per requirements: Slow=3000ms, Normal=1500ms, Fast=600ms
- Auto-play enhances UX but is not critical functionality (Should priority)

**Requirements:**
[FR-3.4: Playback Controls](requirements.md#FR-3.4), [Animation Timing Specifications](requirements.md#animation-timing)

---

### TC_VISUAL_016

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify animations render at acceptable frame rate

**Pre-conditions:**
- Visualization interface is displayed
- Browser performance monitoring is available (optional)

**Steps:**
1. Open the application in browser
2. Open browser developer tools and navigate to Performance tab (optional: enable FPS meter)
3. Access the visualization interface with a solution loaded
4. Start performance recording if using developer tools
5. Click "Next" several times to execute multiple move animations (data-testid: `btn-next`)
6. Observe the smoothness of the animations visually
7. Verify animations do not stutter, freeze, or skip frames
8. If using performance monitoring, check the FPS (frames per second) during animations
9. Verify FPS is at or above 30fps (minimum per NFR-1.1), preferably at 60fps
10. Test with different animation speeds (slow, normal, fast)
11. Verify smooth rendering at all speed settings
12. Test on lower-end hardware if possible to ensure minimum performance requirements

**Expected Result (AR):**
All animations render smoothly without visible stuttering or frame skipping. FPS remains at or above 30fps during animations (minimum requirement). Target FPS of 60fps is achieved on modern hardware. Animations appear fluid and professional at all speed settings. Lower-end devices still achieve acceptable performance (minimum 30fps). No performance degradation occurs after multiple animations. User experience feels smooth and responsive.

**Notes:**
- This tests NFR-1.1 (Must priority) for minimum 30fps and NFR-1.1 target of 60fps
- Modern browsers with hardware acceleration should easily achieve 60fps
- Three.js or CSS 3D transforms should provide smooth animations
- Test on various devices: desktop, laptop, tablet to ensure consistent performance

**Requirements:**
[NFR-1.1: Animation Frame Rate](requirements.md#NFR-1.1)

---

### TC_VISUAL_017

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify 3D cube representation supports rotation capability (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- 3D cube representation is available (if implemented)
- Solution has been loaded

**Steps:**
1. Access the visualization interface with a solution loaded
2. If 3D cube is implemented:
   - Locate the 3D cube display
   - Verify the cube is rendered in 3D (has depth, perspective)
   - Attempt to rotate the cube view (drag, arrow keys, or rotation controls)
   - Verify the cube rotates smoothly in 3D space
   - Verify rotation does not affect the cube's solved state
   - Verify rotation is intuitive and responsive
   - Test rotation in multiple directions (X, Y, Z axes)
3. If 3D cube is not implemented:
   - Verify this is acceptable (Should priority requirement)
   - Document that 3D feature is not implemented

**Expected Result (AR):**
If 3D cube representation is implemented, users can rotate the cube view to see it from different angles. Rotation is smooth and responsive. The cube's solved state is not affected by view rotation. Rotation controls are intuitive. If not implemented, 2D representation is acceptable as it's a Should priority requirement.

**Notes:**
- This tests FR-1.1.2 requirement (Should priority) for 3D cube representation
- 3D representation provides better spatial understanding
- Three.js or similar library would be used for 3D rendering
- If not implemented, document in test results

**Requirements:**
[FR-1.1.2: 3D Cube Representation](requirements.md#FR-1.1.2)

---

### TC_VISUAL_018

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify 2D unfolded cube representation is available (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- 2D unfolded view is available (if implemented)
- Solution has been loaded

**Steps:**
1. Access the visualization interface with a solution loaded
2. If 2D unfolded view is implemented:
   - Locate view toggle or 2D view option
   - Switch to 2D unfolded view
   - Verify all 6 faces are displayed in unfolded layout
   - Verify all 54 facelets are visible
   - Verify colors are accurate in 2D view
   - Verify the view updates correctly when moves are executed
   - Switch back to 3D view (if available) and verify both views work
3. If 2D view is not implemented:
   - Verify this is acceptable (Should priority requirement)
   - Document that 2D feature is not implemented

**Expected Result (AR):**
If 2D unfolded cube representation is implemented, users can view the cube in an unfolded 2D layout. All faces and facelets are visible. The 2D view accurately represents the cube state. The view updates correctly during move animations. Users can switch between 2D and 3D views if both are available. If not implemented, this is acceptable as it's a Should priority requirement.

**Notes:**
- This tests FR-1.1.3 requirement (Should priority) for 2D unfolded representation
- 2D view provides alternative visualization for users who prefer it
- Unfolded layout: typically shows all 6 faces in a cross or other layout
- If not implemented, document in test results

**Requirements:**
[FR-1.1.3: 2D Unfolded Cube Representation](requirements.md#FR-1.1.3)

---

### TC_VISUAL_019

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify system clearly indicates which face is being rotated

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- At least one move is ready to execute

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to a move that rotates a specific face (e.g., "R" - Right face)
3. Before executing the move, verify the face that will be rotated is clearly indicated:
   - Face is highlighted with distinct color/border
   - Face is labeled (e.g., "Right Face" or "R")
   - Face stands out from other faces visually
4. Click "Next" to execute the move (data-testid: `btn-next`)
5. During animation, verify the rotating face remains clearly indicated
6. Verify the indication is visible and easy to identify
7. Test with moves on different faces (U, D, L, R, F, B)
8. Verify each face is clearly indicated when it's the active face

**Expected Result (AR):**
The system clearly indicates which face is being rotated before and during the move animation. The active face is visually distinct (highlighted, colored border, label). The indication is prominent and easy to identify. Users can easily see which face to rotate on their physical cube. The indication is consistent across all face moves.

**Notes:**
- This tests FR-1.2.2 requirement (Must priority) for indicating rotating face
- Clear face indication is critical for users to follow the solution
- Visual highlighting should be prominent but not distracting
- Consider accessibility: indication should work for colorblind users

**Requirements:**
[FR-1.2.2: Indicate Rotating Face](requirements.md#FR-1.2.2)

---

### TC_VISUAL_020

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify active face is visually distinguished from other faces

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- A move is ready to execute

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to a move (e.g., "R" - Right face)
3. Verify the active face (Right) is visually distinguished:
   - Different color/brightness than other faces
   - Border or outline around the face
   - Glow or shadow effect
   - Label or indicator
4. Verify non-active faces are less prominent or dimmed
5. Verify the distinction is clear and obvious
6. Execute the move and verify the distinction updates for the next move's active face
7. Test with multiple different face moves
8. Verify visual distinction is consistent and effective

**Expected Result (AR):**
The active face is visually distinguished from other faces. The distinction is clear and obvious. Non-active faces are de-emphasized or dimmed. The visual treatment makes it easy to identify which face is active. The distinction updates correctly when moving to the next step. The visual treatment is consistent across all moves.

**Notes:**
- This tests FR-1.2.5 requirement (Must priority) for visual distinction of active face
- Visual distinction helps users focus on the correct face
- Consider multiple visual cues: color, border, brightness, label
- Verify distinction works for users with different visual abilities

**Requirements:**
[FR-1.2.5: Visual Distinction of Active Face](requirements.md#FR-1.2.5)

---

### TC_VISUAL_021

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify pieces that will move are highlighted before animation starts

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- A move is ready to execute

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to a move (e.g., "R" - Right face clockwise)
3. Before clicking "Next", verify the pieces that will move are highlighted:
   - The 9 facelets on the Right face are highlighted
   - Highlight is visible and distinct
   - Highlight indicates which pieces will move
4. Click "Next" to start animation (data-testid: `btn-next`)
5. Verify the highlight remains or transitions smoothly into animation
6. Test with different moves (U, D, L, R, F, B)
7. Verify highlighting is accurate for each move type
8. Verify highlighting helps users understand what will happen

**Expected Result (AR):**
Before animation starts, the pieces that will move are highlighted. The highlight is visible and distinct. Users can see which pieces will be affected by the move. The highlight accurately shows the 9 facelets on the rotating face. The highlight helps users prepare for the animation. Highlighting is consistent across all move types.

**Notes:**
- This tests FR-2.3.1 requirement (Should priority) for highlighting moving pieces
- Pre-highlighting helps users understand what will happen
- Highlight should be subtle but visible
- Consider accessibility: highlight should work for colorblind users

**Requirements:**
[FR-2.3.1: Highlight Moving Pieces](requirements.md#FR-2.3.1)

---

### TC_VISUAL_022

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify moving pieces have distinct visual treatment during animation

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- A move animation is executing

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to a move and click "Next" to start animation (data-testid: `btn-next`)
3. During the animation, verify moving pieces have distinct visual treatment:
   - Moving facelets are visually distinct from stationary ones
   - Different color, brightness, or effect on moving pieces
   - Moving pieces stand out clearly
4. Verify stationary pieces are less prominent or dimmed
5. Verify the visual treatment makes it easy to see what's moving
6. Verify the treatment is consistent throughout the animation
7. Test with different move types
8. Verify visual treatment is effective and clear

**Expected Result (AR):**
During animation, moving pieces have distinct visual treatment that makes them stand out. Moving pieces are clearly distinguishable from stationary ones. The visual treatment is consistent and effective. Users can easily see which pieces are moving. The treatment helps users follow the animation and understand the move. Visual distinction is maintained throughout the entire animation.

**Notes:**
- This tests FR-2.3.2 requirement (Must priority) for distinct visual treatment
- Visual treatment is critical for users to follow the animation
- Consider: brightness, color overlay, outline, glow effect
- Verify treatment works for all move types and speeds

**Requirements:**
[FR-2.3.2: Distinct Visual Treatment for Moving Pieces](requirements.md#FR-2.3.2)

---

### TC_VISUAL_023

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify arrows or indicators show rotation direction (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- Rotation direction indicators are available (if implemented)

**Steps:**
1. Access the visualization interface with a solution loaded
2. Advance to a clockwise move (e.g., "R")
3. If direction indicators are implemented:
   - Verify arrows or indicators show the rotation direction
   - Verify clockwise moves show clockwise arrows
   - Verify counter-clockwise moves (e.g., "R'") show counter-clockwise arrows
   - Verify 180° moves (e.g., "R2") show appropriate indicators
   - Verify indicators are clear and easy to understand
   - Verify indicators are positioned appropriately (on the face or around it)
4. If indicators are not implemented:
   - Verify this is acceptable (Should priority requirement)
   - Document that feature is not implemented

**Expected Result (AR):**
If rotation direction indicators are implemented, they clearly show the direction of rotation. Clockwise moves show clockwise indicators. Counter-clockwise moves show counter-clockwise indicators. Indicators are clear and intuitive. If not implemented, this is acceptable as it's a Should priority requirement.

**Notes:**
- This tests FR-2.3.3 requirement (Should priority) for rotation direction indicators
- Arrows or curved indicators help users understand rotation direction
- Indicators should be intuitive (clockwise = right/clockwise arrow)
- If not implemented, document in test results

**Requirements:**
[FR-2.3.3: Rotation Direction Indicators](requirements.md#FR-2.3.3)

---

### TC_VISUAL_024

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify reverse move is animated when going backward

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- At least one move has been executed

**Steps:**
1. Access the visualization interface with a solution loaded
2. Execute a move by clicking "Next" (data-testid: `btn-next`)
3. Wait for the animation to complete
4. Click "Previous" to go back (data-testid: `btn-previous`)
5. Verify the reverse move is animated:
   - The face rotates in the opposite direction
   - Animation is smooth and visible
   - The cube state reverses correctly
6. Verify the reverse animation matches the original move but in opposite direction
7. Test with different move types (clockwise, counter-clockwise, 180°)
8. Verify reverse animations are consistent and correct

**Expected Result (AR):**
When going backward, the reverse move is animated smoothly. The animation shows the face rotating in the opposite direction. The reverse animation is visible and clear. The cube state correctly reverses to the previous state. Reverse animations match the original moves but in opposite direction. Users can see the cube returning to the previous state.

**Notes:**
- This tests FR-3.2.3 requirement (Should priority) for reverse move animation
- Reverse animation helps users understand backward navigation
- Animation should be smooth and match forward animation quality
- Verify reverse works correctly for all move types

**Requirements:**
[FR-3.2.3: Animate Reverse Move](requirements.md#FR-3.2.3)

---

### TC_VISUAL_025

**Type:** `E2E`

**Priority:** `Low`

**Name:** Verify celebratory visual effect appears at completion (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- User is at the final step

**Steps:**
1. Access the visualization interface with a solution loaded
2. Navigate to the final step of the solution
3. Execute the final move
4. If celebratory effect is implemented:
   - Verify a celebratory visual effect appears (confetti, animation, message)
   - Verify the effect is visible and engaging
   - Verify the effect does not interfere with viewing the solved cube
   - Verify the effect is appropriate and not excessive
5. If celebratory effect is not implemented:
   - Verify success notification still appears (FR-4.1.1)
   - Document that celebratory effect is not implemented
   - Note that this is acceptable (Should priority requirement)

**Expected Result (AR):**
If celebratory visual effect is implemented, it appears when the final step is completed. The effect is engaging and celebrates the user's success. The effect does not interfere with viewing the solved cube. If not implemented, the success notification still provides completion feedback, which is acceptable.

**Notes:**
- This tests FR-4.1.4 requirement (Should priority) for celebratory visual effect
- Celebratory effects enhance user satisfaction
- Effects should be subtle and not distracting
- If not implemented, document in test results

**Requirements:**
[FR-4.1.4: Celebratory Visual Effect](requirements.md#FR-4.1.4)

---

### TC_VISUAL_026

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify option to review solution again after completion

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been completed
- Completion notification is displayed

**Steps:**
1. Access the visualization interface and complete all solution steps
2. Verify completion notification appears
3. Locate the "Review Solution" or "Play Again" option (if available)
4. If review option is implemented:
   - Click the review option
   - Verify the solution restarts from the beginning
   - Verify all steps are accessible again
   - Verify navigation controls work for review
5. If review option is not implemented:
   - Verify "Restart" option is available (FR-4.2.1)
   - Document that dedicated review option is not implemented
   - Note that restart provides similar functionality

**Expected Result (AR):**
If review solution option is implemented, users can easily review the solution again after completion. The review restarts the solution from the beginning. All navigation controls work during review. If not implemented, the restart option provides similar functionality, which is acceptable.

**Notes:**
- This tests FR-4.2.3 requirement (Should priority) for review solution option
- Review option helps users who want to see the solution again
- May be combined with restart functionality
- If not implemented, document in test results

**Requirements:**
[FR-4.2.3: Review Solution Option](requirements.md#FR-4.2.3)

---

### TC_VISUAL_027

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify users can return to any step after completion

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been completed

**Steps:**
1. Access the visualization interface and complete all solution steps
2. Verify completion notification appears
3. After completion, attempt to navigate:
   - Click "Previous" button (data-testid: `btn-previous`)
   - Verify navigation back to previous steps works
   - Verify users can navigate to any step in the solution
   - Verify step indicator updates correctly
   - Verify cube state displays correctly at each step
4. If progress bar is clickable (FR-3.3.5):
   - Click on different points in the progress bar
   - Verify navigation to specific steps works
5. Verify navigation works smoothly after completion

**Expected Result (AR):**
After completion, users can return to any step in the solution. Navigation controls remain functional. Users can review specific steps or the entire solution. Step indicator and cube state display correctly at each step. The interface remains fully functional after completion. Users have full control to explore the solution.

**Notes:**
- This tests FR-4.2.4 requirement (Should priority) for returning to any step after completion
- This enables users to review specific moves or the entire solution
- Navigation should work the same before and after completion
- Verify all navigation methods work (Previous, progress bar if available)

**Requirements:**
[FR-4.2.4: Return to Any Step After Completion](requirements.md#FR-4.2.4)

---

### TC_VISUAL_028

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify visualization is responsive to different screen sizes

**Pre-conditions:**
- Visualization interface is accessible
- Browser supports responsive design testing
- Solution has been loaded

**Steps:**
1. Access the visualization interface with a solution loaded
2. Test on desktop viewport (1920x1080 or similar)
3. Verify all elements are visible and properly sized
4. Resize browser window to tablet size (768x1024)
5. Verify layout adapts correctly:
   - Cube display remains visible and readable
   - Controls are accessible
   - Text is readable
   - No elements are cut off or overlapping
6. Resize to mobile size (375x667)
7. Verify mobile layout works:
   - Cube is still visible (may be smaller)
   - Controls are touch-friendly
   - Layout is optimized for small screens
8. Test on actual mobile device if possible
9. Verify functionality works at all screen sizes

**Expected Result (AR):**
The visualization adapts correctly to different screen sizes. Layout is responsive and elements reflow appropriately. All functionality remains accessible at all screen sizes. Cube display remains visible and readable. Controls are accessible and properly sized. Mobile experience is optimized for touch interaction. No functionality is lost at smaller screen sizes.

**Notes:**
- This tests NFR-1.2 requirement (Must priority) for responsive design
- Responsive design is critical for mobile users
- Test with browser dev tools responsive mode
- Verify touch targets are appropriate size (44x44px minimum)
- Consider testing on actual devices

**Requirements:**
[NFR-1.2: Responsive Design](requirements.md#NFR-1.2)

---

### TC_VISUAL_029

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify interface is usable with touch input on mobile devices

**Pre-conditions:**
- Visualization interface is accessible on mobile device or emulator
- Solution has been loaded
- Touch input is available

**Steps:**
1. Access the visualization interface on a mobile device or touch-enabled emulator
2. Verify touch interactions work:
   - Tap "Next" button to advance steps
   - Tap "Previous" button to go back
   - Tap "Play" button to start auto-play (if available)
   - Tap "Pause" button to stop auto-play (if available)
3. Verify touch targets are appropriately sized (minimum 44x44px)
4. Verify buttons are easy to tap accurately
5. Verify no accidental taps occur
6. Test with different finger sizes if possible
7. Verify touch interactions feel natural and responsive
8. Verify gestures work if implemented (swipe, pinch, etc.)

**Expected Result (AR):**
The interface is fully usable with touch input on mobile devices. All controls respond correctly to touch. Touch targets are appropriately sized for easy tapping. Buttons are easy to tap accurately. Touch interactions feel natural and responsive. The interface is optimized for mobile touch interaction. Users can complete the entire solution using only touch.

**Notes:**
- This tests NFR-2.2 requirement (Should priority) for touch input support
- Touch support is essential for mobile users
- Verify touch targets meet accessibility guidelines (44x44px)
- Test on actual mobile devices for best results
- Consider gesture support for enhanced mobile experience

**Requirements:**
[NFR-2.2: Touch Input Support](requirements.md#NFR-2.2)

---

### TC_VISUAL_030

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify controls have appropriate sizing for touch targets (44x44px minimum)

**Pre-conditions:**
- Visualization interface is accessible
- Browser developer tools available for measurement
- Solution has been loaded

**Steps:**
1. Access the visualization interface with a solution loaded
2. Open browser developer tools
3. Inspect navigation control buttons:
   - "Next" button
   - "Previous" button
   - "Play" button (if available)
   - "Pause" button (if available)
   - "Reset" button (if available)
4. Measure the size of each button:
   - Width in pixels
   - Height in pixels
5. Verify all buttons meet minimum 44x44px size requirement
6. Verify buttons have adequate spacing between them
7. Test on mobile device or mobile emulator
8. Verify buttons are easy to tap accurately
9. Verify no buttons are too small for comfortable tapping

**Expected Result (AR):**
All interactive controls meet the minimum 44x44px touch target size requirement. Buttons are large enough for comfortable tapping on mobile devices. Adequate spacing prevents accidental taps. Controls are accessible and usable on touch devices. The interface follows mobile accessibility guidelines. Users can interact with all controls easily.

**Notes:**
- This tests NFR-2.3 requirement (Should priority) for touch target sizing
- 44x44px is the minimum recommended size for touch targets
- Larger targets (48x48px or more) are even better
- Verify spacing between targets (minimum 8px recommended)
- Test on actual mobile devices

**Requirements:**
[NFR-2.3: Touch Target Sizing](requirements.md#NFR-2.3)

---

### TC_VISUAL_031

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify step transitions complete within 2 seconds at normal speed

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- Timer or performance measurement available

**Steps:**
1. Access the visualization interface with a solution loaded
2. Set animation speed to "Normal" (if speed control is available)
3. Start timer when clicking "Next" button (data-testid: `btn-next`)
4. Wait for the step transition to complete:
   - Animation starts
   - Animation completes
   - Next step is ready
5. Stop timer when transition is complete
6. Verify transition completes within 2 seconds
7. Repeat test with multiple different moves
8. Calculate average transition time
9. Verify average time is under 2 seconds
10. Test with different move types (90°, 180°)

**Expected Result (AR):**
Step transitions complete within 2 seconds at normal animation speed. Transitions are fast enough to maintain user engagement. Users do not experience excessive waiting between steps. Animation speed is appropriate for following along. The 2-second limit is consistently met. Performance is acceptable for the task.

**Notes:**
- This tests NFR-3.2 requirement (Must priority) for step transition timing
- 2 seconds is the maximum acceptable time for normal speed
- Faster speeds may have shorter transitions
- Slower speeds may have longer transitions (acceptable)
- Verify timing is consistent across different moves

**Requirements:**
[NFR-3.2: Step Transition Timing](requirements.md#NFR-3.2)

---

### TC_VISUAL_032

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify system does not degrade performance with solutions up to 100 moves

**Pre-conditions:**
- Visualization interface is accessible
- Solution with 80-100 moves is available
- Performance monitoring available

**Steps:**
1. Access the visualization interface with a long solution (80-100 moves)
2. Start performance monitoring (browser dev tools)
3. Navigate through the solution:
   - Click "Next" repeatedly to advance through all moves
   - Monitor frame rate during navigation
   - Monitor memory usage
   - Monitor CPU usage
4. Verify performance remains acceptable:
   - Frame rate stays above 30fps
   - No memory leaks (memory doesn't continuously increase)
   - No significant slowdown as solution progresses
   - Animations remain smooth
5. Navigate backward through the solution
6. Verify backward navigation also performs well
7. Test with auto-play on long solutions
8. Verify performance is consistent throughout

**Expected Result (AR):**
The system maintains acceptable performance with solutions up to 100 moves. Frame rate remains stable throughout. No memory leaks occur. Performance does not degrade as the solution progresses. Animations remain smooth. Navigation is responsive. The system handles long solutions efficiently. User experience remains good regardless of solution length.

**Notes:**
- This tests NFR-3.3 requirement (Must priority) for performance with long solutions
- Long solutions require efficient state management and rendering
- Verify no memory leaks from storing intermediate states
- Consider lazy loading or state optimization for very long solutions
- Test with actual 100-move solutions if available

**Requirements:**
[NFR-3.3: Performance with Long Solutions](requirements.md#NFR-3.3)

---

### TC_VISUAL_033

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify ARIA labels are provided for screen reader compatibility (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- Screen reader available (or browser accessibility inspector)
- Solution has been loaded

**Steps:**
1. Access the visualization interface with a solution loaded
2. Open browser accessibility inspector or enable screen reader
3. If ARIA labels are implemented:
   - Navigate through interface using screen reader
   - Verify buttons have appropriate ARIA labels
   - Verify cube display has descriptive labels
   - Verify step indicator is announced correctly
   - Verify move information is accessible
   - Verify navigation is possible using screen reader
4. If ARIA labels are not implemented:
   - Verify this is acceptable (Should priority requirement)
   - Document that accessibility features are not implemented
   - Note recommendations for future implementation

**Expected Result (AR):**
If ARIA labels are implemented, the interface is accessible to screen readers. All interactive elements have appropriate labels. Navigation is possible using screen reader. Information is announced correctly. If not implemented, this is acceptable as it's a Should priority requirement, but accessibility should be considered for future versions.

**Notes:**
- This tests NFR-4.2 requirement (Should priority) for ARIA labels
- ARIA labels improve accessibility for visually impaired users
- Screen reader testing requires actual screen reader software
- Browser accessibility inspector can help verify ARIA attributes
- If not implemented, document recommendations

**Requirements:**
[NFR-4.2: ARIA Labels for Screen Readers](requirements.md#NFR-4.2)

---

### TC_VISUAL_034

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify rapid "Next" clicks are handled gracefully

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- Animation is in progress or ready

**Steps:**
1. Access the visualization interface with a solution loaded
2. Rapidly click the "Next" button multiple times (data-testid: `btn-next`)
3. Verify one of the following behaviors:
   - (a) Button is disabled during animation, preventing rapid clicks
   - (b) Clicks are queued and executed sequentially after current animation completes
   - (c) Rapid clicks are ignored until current animation completes
4. Verify no errors occur from rapid clicking
5. Verify animations complete correctly even with rapid clicks
6. Verify cube state remains correct after rapid navigation
7. Verify UI remains responsive
8. Test with different animation speeds

**Expected Result (AR):**
Rapid "Next" clicks are handled gracefully. Either the button is disabled during animation, clicks are queued, or rapid clicks are ignored. No errors occur. Animations complete correctly. Cube state remains accurate. UI remains responsive. The system prevents issues from rapid user interaction.

**Notes:**
- This tests the "Rapid Next clicks" edge case from requirements
- Rapid clicking could cause animation conflicts or state issues
- Queue system or button disabling prevents problems
- Verify solution works correctly even with rapid navigation

**Requirements:**
[Edge Cases: Rapid Next Clicks](requirements.md#edge-cases--error-scenarios)

---

### TC_VISUAL_035

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify "Previous" during animation is handled correctly

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- Animation is in progress

**Steps:**
1. Access the visualization interface with a solution loaded
2. Click "Next" to start an animation (data-testid: `btn-next`)
3. Immediately while animation is in progress, click "Previous" (data-testid: `btn-previous`)
4. Verify one of the following behaviors:
   - (a) Current animation completes first, then reverse animation plays
   - (b) Current animation is interrupted and reverse animation plays immediately
   - (c) "Previous" is disabled during animation
5. Verify no errors occur
6. Verify cube state is correct after handling
7. Verify UI remains responsive
8. Test with different animation speeds

**Expected Result (AR):**
Clicking "Previous" during animation is handled correctly. Either the current animation completes first, animation is interrupted, or the button is disabled. No errors occur. Cube state remains correct. UI remains responsive. The system handles animation interruption gracefully.

**Notes:**
- This tests the "Previous during animation" edge case from requirements
- Animation interruption requires careful state management
- Completing current animation first is often the safest approach
- Verify state consistency is maintained

**Requirements:**
[Edge Cases: Previous During Animation](requirements.md#edge-cases--error-scenarios)

---

### TC_VISUAL_036

**Type:** `E2E`

**Priority:** `Low`

**Name:** Verify auto-play pauses when browser loses focus (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- Auto-play feature is available and running

**Steps:**
1. Access the visualization interface with a solution loaded
2. Start auto-play by clicking "Play" button (data-testid: `btn-play`)
3. Verify auto-play is progressing automatically
4. Switch to a different browser tab or application (browser loses focus)
5. If pause-on-blur is implemented:
   - Verify auto-play pauses when browser loses focus
   - Verify auto-play resumes when browser regains focus
   - Verify current step is preserved
6. If pause-on-blur is not implemented:
   - Verify this is acceptable (edge case, low priority)
   - Document that feature is not implemented

**Expected Result (AR):**
If pause-on-blur is implemented, auto-play pauses when the browser loses focus and resumes when focus returns. The current step is preserved. If not implemented, this is acceptable as it's a low-priority edge case, but it improves user experience.

**Notes:**
- This tests the "Browser loses focus during auto-play" edge case
- Pausing on blur prevents wasted animations when user isn't watching
- Browser focus events can be used to detect blur/focus
- If not implemented, document in test results

**Requirements:**
[Edge Cases: Browser Loses Focus](requirements.md#edge-cases--error-scenarios)

---

### TC_VISUAL_037

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify layout adjusts smoothly when mobile device rotates

**Pre-conditions:**
- Visualization interface is accessible on mobile device or emulator
- Solution has been loaded
- Device rotation is available

**Steps:**
1. Access the visualization interface on a mobile device or emulator
2. Verify interface displays correctly in portrait orientation
3. Rotate device to landscape orientation
4. Verify layout adjusts smoothly:
   - Elements reflow appropriately
   - Cube display adapts to new orientation
   - Controls remain accessible
   - No elements are cut off
5. Verify current step is preserved during rotation
6. Verify cube state is correct after rotation
7. Rotate back to portrait
8. Verify layout adjusts correctly again
9. Verify functionality works in both orientations

**Expected Result (AR):**
When mobile device rotates, the layout adjusts smoothly without losing state. Elements reflow appropriately for the new orientation. Cube display adapts correctly. Controls remain accessible. Current step and cube state are preserved. Functionality works correctly in both portrait and landscape orientations.

**Notes:**
- This tests the "Mobile device rotation" edge case
- Responsive design should handle orientation changes
- CSS media queries or JavaScript can detect orientation changes
- Verify state preservation during rotation

**Requirements:**
[Edge Cases: Mobile Device Rotation](requirements.md#edge-cases--error-scenarios)

---

### TC_VISUAL_038

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify page refresh during visualization preserves state or offers restart (if implemented)

**Pre-conditions:**
- Visualization interface is displayed
- Solution has been loaded
- User is at a specific step in the solution

**Steps:**
1. Access the visualization interface with a solution loaded
2. Navigate to a specific step (e.g., step 10 of 25)
3. Refresh the browser page (F5 or refresh button)
4. If state preservation is implemented:
   - Verify current step is restored
   - Verify solution is reloaded
   - Verify user can continue from where they left off
5. If state preservation is not implemented:
   - Verify user is offered option to restart
   - Verify solution can be recalculated or reloaded
   - Verify user experience is acceptable
6. Verify no errors occur on refresh
7. Verify functionality works after refresh

**Expected Result (AR):**
If state preservation is implemented, the current step and solution are restored after page refresh. Users can continue from where they left off. If not implemented, users are offered a clear way to restart or reload the solution. The experience is acceptable in both cases. No errors occur on refresh.

**Notes:**
- This tests the "Page refresh during visualization" edge case
- State preservation requires localStorage or sessionStorage
- Solution serialization (FR-4.2.3) would enable state preservation
- If not implemented, clear restart option is acceptable

**Requirements:**
[Edge Cases: Page Refresh During Visualization](requirements.md#edge-cases--error-scenarios)

---

## Coverage Matrix

| Requirement ID | Test Cases |
|---------------|------------|
| FR-1.1.1 - Clear cube display | TC_VISUAL_001 |
| FR-1.1.2 - 3D cube representation with rotation | TC_VISUAL_017 |
| FR-1.1.3 - 2D unfolded cube representation | TC_VISUAL_018 |
| FR-1.1.4 - Accurate cube colors | TC_VISUAL_001, TC_VISUAL_007 |
| FR-1.1.5 - Consistent cube orientation | TC_VISUAL_001, TC_VISUAL_008 |
| FR-1.2.1 - Display one move at a time | TC_VISUAL_007 |
| FR-1.2.2 - Indicate which face is being rotated | TC_VISUAL_019 |
| FR-1.2.3 - Display move notation prominently | TC_VISUAL_007 |
| FR-1.2.4 - Display human-readable description | TC_VISUAL_007 |
| FR-1.2.5 - Visually distinguish active face | TC_VISUAL_020 |
| FR-2.1.1 - Smooth move animation | TC_VISUAL_002, TC_VISUAL_016 |
| FR-2.1.2 - Clear rotation direction | TC_VISUAL_008 |
| FR-2.1.3 - Correct rotation degree | TC_VISUAL_008 |
| FR-2.1.4 - Animation completion before next | TC_VISUAL_002 |
| FR-2.1.5 - State update after animation | TC_VISUAL_002, TC_VISUAL_008 |
| FR-2.2.1 - Configurable animation speed | TC_VISUAL_013 |
| FR-2.2.2 - Three speed options | TC_VISUAL_013 |
| FR-2.2.3 - Skip animation option | Not implemented (Could priority) |
| FR-2.2.4 - Remember speed preference | Not implemented (Could priority) |
| FR-2.3.1 - Highlight pieces that will move | TC_VISUAL_021 |
| FR-2.3.2 - Distinct visual treatment for moving pieces | TC_VISUAL_022 |
| FR-2.3.3 - Arrows/indicators for rotation direction | TC_VISUAL_023 |
| FR-2.3.4 - Dim non-moving pieces | Not implemented (Could priority) |
| FR-3.1.1 - "Next" button | TC_VISUAL_002 |
| FR-3.1.2 - Execute move on "Next" | TC_VISUAL_002 |
| FR-3.1.3 - Disable "Next" at final step | TC_VISUAL_004 |
| FR-3.1.4 - Keyboard shortcut forward | TC_VISUAL_012 |
| FR-3.2.1 - "Previous" button | TC_VISUAL_003 |
| FR-3.2.2 - Reverse state on "Previous" | TC_VISUAL_003 |
| FR-3.2.3 - Animate reverse move | TC_VISUAL_024 |
| FR-3.2.4 - Disable "Previous" at first step | TC_VISUAL_005 |
| FR-3.2.5 - Keyboard shortcut backward | TC_VISUAL_012 |
| FR-3.3.1 - Display current step number | TC_VISUAL_006 |
| FR-3.3.2 - Display total steps | TC_VISUAL_006 |
| FR-3.3.3 - Format "Step X of Y" | TC_VISUAL_006 |
| FR-3.3.4 - Progress bar visualization | TC_VISUAL_014 |
| FR-3.3.5 - Click progress bar to jump to step | Not implemented (Could priority) |
| FR-3.4.1 - "Play" button for auto-play | TC_VISUAL_015 |
| FR-3.4.2 - "Pause" button | TC_VISUAL_015 |
| FR-3.4.3 - Automatic step advancement | TC_VISUAL_015 |
| FR-3.4.4 - Configurable delay between auto steps | Not implemented (Could priority) |
| FR-3.4.5 - "Reset" button | TC_VISUAL_010 |
| FR-4.1.1 - Success notification at completion | TC_VISUAL_009 |
| FR-4.1.2 - Indicate cube is solved | TC_VISUAL_004, TC_VISUAL_009 |
| FR-4.1.3 - Display solved cube state | TC_VISUAL_004, TC_VISUAL_009 |
| FR-4.1.4 - Celebratory visual effect | TC_VISUAL_025 |
| FR-4.1.5 - Display completion statistics | Not implemented (Could priority) |
| FR-4.2.1 - Restart option | TC_VISUAL_010 |
| FR-4.2.2 - Configure new cube option | TC_VISUAL_011 |
| FR-4.2.3 - Review solution option | TC_VISUAL_026 |
| FR-4.2.4 - Return to any step after completion | TC_VISUAL_027 |
| NFR-1.1 - Animation frame rate (30fps min, 60fps target) | TC_VISUAL_016 |
| NFR-1.2 - Responsive to different screen sizes | TC_VISUAL_028 |
| NFR-1.3 - Vibrant and distinguishable colors | Covered in TC_VISUAL_001 (implicit) |
| NFR-1.4 - Appropriate lighting and shadows for 3D | Not implemented (Should priority) |
| NFR-2.1 - Prominently placed navigation controls | Covered in TC_VISUAL_002, TC_VISUAL_003 (implicit) |
| NFR-2.2 - Usable with touch input on mobile | TC_VISUAL_029 |
| NFR-2.3 - Appropriate sizing for touch targets (44x44px) | TC_VISUAL_030 |
| NFR-2.4 - Understandable without prior knowledge | Covered in TC_VISUAL_007 (implicit) |
| NFR-3.1 - Animation start timing < 100ms | TC_VISUAL_002 |
| NFR-3.2 - Step transitions complete within 2 seconds | TC_VISUAL_031 |
| NFR-3.3 - No performance degradation with 100 moves | TC_VISUAL_032 |
| NFR-4.1 - Support keyboard navigation | TC_VISUAL_012 |
| NFR-4.2 - ARIA labels for screen readers | TC_VISUAL_033 |
| NFR-4.3 - Accommodate users needing slower animations | Covered in TC_VISUAL_013 (speed options) |
| AC-1 - Cube Display | TC_VISUAL_001 |
| AC-2 - Move Animation | TC_VISUAL_002, TC_VISUAL_008 |
| AC-3 - Navigation | TC_VISUAL_002, TC_VISUAL_003, TC_VISUAL_004, TC_VISUAL_005, TC_VISUAL_006 |
| AC-4 - Completion | TC_VISUAL_009, TC_VISUAL_010, TC_VISUAL_011 |
| Edge Case - Rapid "Next" clicks | TC_VISUAL_034 |
| Edge Case - "Previous" during animation | TC_VISUAL_035 |
| Edge Case - Browser loses focus during auto-play | TC_VISUAL_036 |
| Edge Case - Mobile device rotation | TC_VISUAL_037 |
| Edge Case - Page refresh during visualization | TC_VISUAL_038 |
| Dependency - Feature 2 Integration | TC_VISUAL_001, TC_VISUAL_007 |
