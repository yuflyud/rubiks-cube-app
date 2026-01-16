# Test Cases: Feature 1 - Rubik's Cube Configuration

## Summary
- **Total Test Cases:** 28
- **High Priority:** 13
- **Medium Priority:** 12
- **Low Priority:** 3
- **Types:** E2E (28)

## Feature Location Map
| Feature | Navigation Path |
|---------|-----------------|
| Cube Configuration | Application Entry Point → Main Page |
| Color Assignment | Configuration Interface → Facelet Grid → Color Palette |
| Guided Configuration | Configuration Interface → Navigation Controls |
| Progress Tracking | Configuration Interface → Progress Indicator |
| Validation System | Configuration Interface → Validation Display |

---

## Test Cases

### High Priority

### TC_CONFIG_001

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can assign colors to cube facelets

**Pre-conditions:**
- Application is loaded and accessible
- Configuration interface is displayed with all six faces visible
- Color palette is displayed with all 6 standard colors (White, Yellow, Red, Orange, Blue, Green)

**Steps:**
1. Open the application in browser (base application URL)
2. Verify the Rubik's Cube Configuration interface loads with the header "Rubik's Cube Solver"
3. Locate the cube face grid display showing all 6 faces (Front, Back, Left, Right, Up, Down)
4. Click on a non-center facelet in the Front face (data-testid: `facelet-F-0` for top-left corner)
5. Verify the selected facelet is visually highlighted with a border or background change
6. Locate the color palette section below or beside the cube display
7. Click on the "Red" color button in the color palette (data-testid: `color-red`)
8. Verify the selected facelet immediately changes to red color
9. Select another facelet in the same face (data-testid: `facelet-F-2` for top-right corner)
10. Click on the "Blue" color button (data-testid: `color-blue`)
11. Verify the newly selected facelet changes to blue color

**Expected Result (AR):**
All selected facelets display the assigned colors correctly. The color assignment is immediate and visually clear. Previously assigned colors persist on their respective facelets. The cube display updates in real-time without page refresh.

**Notes:**
- Center facelets should be pre-assigned and non-editable (fixed based on cube orientation)
- Test with all 6 colors to ensure palette functionality
- Verify color contrast is sufficient for visibility

**Requirements:**
[FR-1.1: Color Assignment Interface](requirements.md#FR-1.1)

---

### TC_CONFIG_002

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can change previously assigned color

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least one facelet has been assigned a color

**Steps:**
1. Open the application in browser
2. Select a facelet in the Front face (data-testid: `facelet-F-0`)
3. Assign "Red" color to the facelet using the color palette (data-testid: `color-red`)
4. Verify the facelet displays red color
5. Click on the same facelet again (data-testid: `facelet-F-0`)
6. Verify the facelet is selected (visual highlight appears)
7. Click on a different color in the palette, "Green" (data-testid: `color-green`)
8. Verify the facelet color changes from red to green
9. Repeat the process: select the same facelet and change to "Yellow" (data-testid: `color-yellow`)

**Expected Result (AR):**
The facelet color is successfully changed each time a new color is selected. The color update is immediate and visually clear. No error messages appear. The previous color is completely replaced by the new color.

**Notes:**
- This tests the FR-1.2.4 requirement for color modification
- Verify no residual visual artifacts from previous colors

**Requirements:**
[FR-1.2.4: Color Modification](requirements.md#FR-1.2.4)

---

### TC_CONFIG_003

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify guided configuration flow displays one face at a time

**Pre-conditions:**
- Application is loaded with guided mode enabled (default setting)
- Configuration interface is displayed
- No faces have been configured yet

**Steps:**
1. Open the application in browser
2. Verify the configuration interface is in guided mode
3. Locate the instruction text or prompt indicating which face to configure (expected: "Configure the Front Face" or similar)
4. Verify only the current face (Front) is highlighted or emphasized visually
5. Verify other faces are dimmed, grayed out, or less prominent
6. Attempt to click on a facelet on a non-current face (e.g., Back face)
7. Verify that either: (a) the facelet is not selectable, or (b) a message indicates to complete the current face first
8. Complete configuring the current face by assigning colors to all non-center facelets
9. Click the "Next" button in the navigation controls (data-testid: `btn-next-face`)
10. Verify the interface transitions to the next face
11. Verify the new face is now highlighted and the previous face becomes inactive or less prominent

**Expected Result (AR):**
The guided configuration flow enforces sequential face configuration. Only one face is active and configurable at a time. Clear visual distinction between the active face and inactive faces. The "Next" button successfully advances to the next face. Instructions update to reflect the current face being configured.

**Notes:**
- The order of faces should follow a logical sequence (e.g., Front → Right → Back → Left → Up → Down)
- Test that clicking on non-current faces is either blocked or shows appropriate feedback

**Requirements:**
[FR-2.1: Guided Configuration Flow](requirements.md#FR-2.1)

---

### TC_CONFIG_004

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify progress indicator shows accurate configuration completion percentage

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Guided mode is enabled

**Steps:**
1. Open the application in browser
2. Locate the progress indicator component (data-testid: `progress-indicator`)
3. Verify the initial progress shows 0% or "0 of 6 faces completed" or similar
4. Begin configuring the first face (Front) by assigning colors to all 8 non-center facelets
5. Click "Next" to complete the first face (data-testid: `btn-next-face`)
6. Verify the progress indicator updates to show approximately 16.7% or "1 of 6 faces completed"
7. Complete the second face (Right) and click "Next"
8. Verify the progress indicator updates to show approximately 33.3% or "2 of 6 faces completed"
9. Continue configuring remaining faces and verify progress updates after each face completion
10. After completing all 6 faces, verify the progress indicator shows 100% or "6 of 6 faces completed"

**Expected Result (AR):**
The progress indicator accurately reflects configuration completion percentage. The indicator updates immediately after each face is completed. Visual progress bar (if present) fills proportionally to the completion percentage. Face count is accurate throughout the process.

**Notes:**
- Progress calculation: (completed faces / 6 total faces) × 100
- Some implementations may show facelet-level progress (48 facelets total: 54 - 6 fixed centers)

**Requirements:**
[FR-2.2: Progress Tracking](requirements.md#FR-2.2)

---

### TC_CONFIG_005

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation system detects color count errors

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least 5 faces have been configured correctly

**Steps:**
1. Open the application in browser
2. Navigate through the guided configuration and complete 5 faces correctly
3. On the final face (Down), intentionally assign the same color (e.g., "Red") to multiple facelets
4. Ensure that one color (Red) exceeds 9 occurrences total across all faces
5. Complete the final face and click "Next" or "Validate" button (data-testid: `btn-validate`)
6. Verify the validation system triggers
7. Locate the validation error message (data-testid: `validation-error`)
8. Verify the error message indicates: "Color 'Red' appears more than 9 times" or similar
9. Verify the system prevents progression to solution calculation
10. Verify the validation display shows a visual indicator (e.g., red text, warning icon) next to the affected color in the color count display

**Expected Result (AR):**
The validation system detects that a color appears more than 9 times. A clear, user-friendly error message is displayed explaining the issue. The user cannot proceed to solution calculation until the error is fixed. The validation display visually highlights the problematic color count (e.g., "Red: 11/9" shown in red).

**Notes:**
- Each color must appear exactly 9 times (9 facelets per face, 6 faces, 54 total / 6 colors = 9 per color)
- Test with different colors exceeding the limit
- Verify the error clears when the user corrects the configuration

**Requirements:**
[FR-3.1: Real-Time Validation](requirements.md#FR-3.1), [FR-3.2.1: Color Count Validation](requirements.md#FR-3.2.1)

---

### TC_CONFIG_006

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation system detects insufficient color count

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least 5 faces have been configured

**Steps:**
1. Open the application in browser
2. Navigate through the guided configuration and complete 5 faces
3. On the final face, intentionally leave some facelets unassigned or assign colors such that one color (e.g., "Green") appears fewer than 9 times total
4. Attempt to complete configuration by clicking "Validate" or "Finish" button (data-testid: `btn-validate`)
5. Verify the validation system triggers
6. Locate the validation error message (data-testid: `validation-error`)
7. Verify the error message indicates: "Color 'Green' appears fewer than 9 times. Expected: 9, Found: X" or similar
8. Verify the system prevents progression to solution calculation
9. Verify the validation display shows the insufficient color count (e.g., "Green: 7/9" highlighted in warning color)

**Expected Result (AR):**
The validation system detects colors appearing fewer than 9 times. A clear error message explains which color(s) are deficient and by how much. The user cannot proceed until all colors appear exactly 9 times. The validation display clearly indicates which colors need more assignments.

**Notes:**
- This tests FR-3.2.1 requirement for exact color count validation
- Test with multiple colors having insufficient counts
- Verify incomplete configuration (missing facelets) is also caught

**Requirements:**
[FR-3.2.1: Color Count Validation](requirements.md#FR-3.2.1), [FR-3.3.4: Prevent Invalid Progression](requirements.md#FR-3.3.4)

---

### TC_CONFIG_007

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation system detects impossible cube states

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Cube validation logic is operational

**Steps:**
1. Open the application in browser
2. Configure all 6 faces with each color appearing exactly 9 times (satisfy color count requirement)
3. Intentionally create an invalid corner piece combination: For example, configure a corner with colors that cannot physically exist together on a standard Rubik's cube (e.g., White-Yellow-Red corner, where White and Yellow are opposite faces)
4. Complete configuration and click "Validate" button (data-testid: `btn-validate`)
5. Verify the validation system triggers advanced cube state validation
6. Locate the validation error message (data-testid: `validation-error`)
7. Verify the error message indicates: "Invalid cube configuration detected. The cube state is physically impossible." or similar
8. Optionally, verify the error message identifies the specific location or type of error (e.g., "Invalid corner piece at position X")

**Expected Result (AR):**
The validation system detects physically impossible cube configurations even when color counts are correct. A clear error message explains that the cube state is impossible. The user cannot proceed to solution calculation with an impossible configuration. If possible, the specific problematic pieces or positions are highlighted.

**Notes:**
- This tests FR-3.2.4 requirement for detecting impossible cube states
- Impossible states include: invalid corner combinations, invalid edge combinations, incorrect parity
- This is a complex validation requiring cube-solving domain knowledge
- May require creating specific test configurations that pass color count but fail physical validity

**Requirements:**
[FR-3.2.4: Impossible State Detection](requirements.md#FR-3.2.4), [FR-3.2.5: Solvability Validation](requirements.md#FR-3.2.5)

---

### TC_CONFIG_008

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify user can navigate back to edit previously configured faces

**Pre-conditions:**
- Application is loaded
- Guided mode is enabled
- At least 2 faces have been configured

**Steps:**
1. Open the application in browser
2. Complete configuration of the first face (Front) with specific colors
3. Note the colors assigned to specific facelets (e.g., top-left = Red, top-right = Blue)
4. Click "Next" to move to the second face (Right) (data-testid: `btn-next-face`)
5. Begin configuring the second face
6. Locate and click the "Previous" button in navigation controls (data-testid: `btn-previous-face`)
7. Verify the interface returns to the first face (Front)
8. Verify the previously assigned colors are still present and unchanged
9. Select a facelet that was previously assigned (e.g., top-left which was Red)
10. Change the color to a different one (e.g., Green) using the color palette
11. Click "Next" to return to the second face (data-testid: `btn-next-face`)
12. Complete the second face and click "Next" again
13. Click "Previous" twice to return to the first face
14. Verify the edited color (Green) is persisted

**Expected Result (AR):**
The "Previous" button successfully navigates back to previously configured faces. All previously assigned colors are preserved and displayed correctly. Users can edit previously configured facelets. Edits are persisted when navigating forward again. The navigation flow maintains configuration state throughout.

**Notes:**
- This tests FR-2.2.4 requirement for navigation and editing of previous faces
- Verify the "Previous" button is disabled on the first face
- Test navigation patterns: forward-backward-forward to ensure state persistence

**Requirements:**
[FR-2.2.4: Face Navigation and Editing](requirements.md#FR-2.2.4)

---

### TC_CONFIG_009

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify center facelets are pre-assigned and non-editable

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed

**Steps:**
1. Open the application in browser
2. Locate the Front face in the cube display
3. Identify the center facelet of the Front face (middle position, data-testid: `facelet-F-4`)
4. Verify the center facelet has a pre-assigned color (standard cube orientation: Front = Green)
5. Attempt to click on the center facelet
6. Verify one of the following behaviors: (a) center facelet is not selectable (no visual response), or (b) center facelet selection shows a message indicating it's fixed
7. Repeat for all 6 faces, verifying each face has a pre-assigned center color
8. Verify the standard color scheme: White (Up), Yellow (Down), Green (Front), Blue (Back), Red (Right), Orange (Left)
9. Attempt to select the center facelet and then click on the color palette
10. Verify the center facelet color does not change

**Expected Result (AR):**
All center facelets are pre-assigned with the correct colors based on standard cube orientation. Center facelets cannot be selected or edited by the user. Clicking on center facelets either has no effect or displays an informative message. The 6 center colors follow the standard Rubik's cube color scheme. Center colors remain fixed throughout the configuration process.

**Notes:**
- This tests FR-1.1.4 requirement for fixed center facelets
- Standard Western color scheme: White opposite Yellow, Green opposite Blue, Red opposite Orange
- Center facelets define the cube's orientation and must remain fixed

**Requirements:**
[FR-1.1.4: Fixed Center Facelets](requirements.md#FR-1.1.4)

---

### TC_CONFIG_010

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify completed configuration triggers solution calculation

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- All 6 faces are not yet configured

**Steps:**
1. Open the application in browser
2. Navigate through the guided configuration flow
3. Configure all 6 faces correctly with valid color assignments (each color exactly 9 times)
4. Ensure the configuration passes validation (valid cube state)
5. Click the "Finish" or "Calculate Solution" button on the final face (data-testid: `btn-finish-configuration`)
6. Verify a notification or loading indicator appears showing "Configuration complete! Calculating solution..." or similar
7. Wait for the solution calculation to complete
8. Verify the interface transitions from the configuration view to the solution visualization view
9. Verify the solution calculation succeeded (no error messages)
10. Verify the visualization interface is displayed with the solution moves

**Expected Result (AR):**
Upon completing valid configuration, the system automatically progresses to solution calculation. A clear notification or loading state is displayed during calculation. The interface successfully transitions from configuration to visualization. The solution is calculated without errors. The user sees the first step of the solution visualization.

**Notes:**
- This tests the integration between Feature 1 (Configuration) and Feature 2 (Assembly Mechanism)
- Solution calculation should complete within 5 seconds (NFR-1.1 requirement from Feature 2)
- Test with various cube configurations to ensure reliable transition

**Requirements:**
[Feature Dependencies](requirements.md#Dependencies), [Feature 2: Assembly Mechanism](../02-assembly-mechanism/requirements.md)

---

### TC_CONFIG_011

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation prevents progression with incomplete configuration

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least one face is not fully configured

**Steps:**
1. Open the application in browser
2. Navigate through the guided configuration
3. Configure 5 faces completely
4. On the final face (Down), leave at least one non-center facelet without an assigned color
5. Attempt to complete configuration by clicking "Finish" or "Validate" button (data-testid: `btn-validate`)
6. Verify the validation system triggers
7. Locate the validation error message (data-testid: `validation-error`)
8. Verify the error message indicates incomplete configuration: "Configuration incomplete. Please assign colors to all facelets." or similar
9. Optionally, verify the error message identifies which face(s) are incomplete
10. Verify the system prevents progression to solution calculation
11. Verify the "Finish" or "Calculate Solution" button remains disabled or non-functional

**Expected Result (AR):**
The validation system detects incomplete configuration. A clear error message explains that not all facelets have been assigned colors. The user cannot proceed to solution calculation until all non-center facelets are assigned. The interface indicates which face(s) need completion (if applicable). The completion button remains disabled or displays an error on click.

**Notes:**
- Total facelets to configure: 48 (54 total - 6 fixed centers)
- This is an edge case in the requirements (Edge Cases table)
- Verify the validation display shows facelet-level progress if implemented

**Requirements:**
[FR-3.3.4: Prevent Invalid Progression](requirements.md#FR-3.3.4), [Edge Cases: Incomplete Configuration](requirements.md#edge-cases--error-scenarios)

---

### Medium Priority

### TC_CONFIG_012

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify keyboard shortcuts for color assignment

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Keyboard shortcuts are enabled

**Steps:**
1. Open the application in browser
2. Select a facelet in the Front face by clicking it (data-testid: `facelet-F-0`)
3. Verify the facelet is visually highlighted
4. Press the keyboard key "1" (assuming keyboard shortcut mapping: 1 = White, 2 = Yellow, 3 = Red, 4 = Orange, 5 = Blue, 6 = Green)
5. Verify the selected facelet changes to the corresponding color (White)
6. Select another facelet
7. Press the keyboard key "3" (for Red)
8. Verify the facelet changes to red color
9. Test all 6 keyboard shortcuts (1 through 6) with different facelets
10. Verify each keyboard shortcut correctly assigns the corresponding color

**Expected Result (AR):**
Keyboard shortcuts successfully assign colors to selected facelets. The color assignment via keyboard is immediate and matches the behavior of clicking the color palette. All 6 color shortcuts work correctly. Users can configure the cube entirely using keyboard without mouse clicks on the palette.

**Notes:**
- This tests FR-1.2.5 requirement (Should priority) for keyboard shortcuts
- Verify a legend or tooltip displays the keyboard shortcut mappings
- Test that keyboard shortcuts only work when a facelet is selected
- Consider accessibility: keyboard shortcuts improve efficiency for power users

**Requirements:**
[FR-1.2.5: Keyboard Shortcuts](requirements.md#FR-1.2.5)

---

### TC_CONFIG_013

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify real-time color count display updates as user assigns colors

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Color count display is visible (data-testid: `color-count-display`)

**Steps:**
1. Open the application in browser
2. Locate the color count display showing occurrences of each color (expected format: "Red: 0/9", "Blue: 0/9", etc.)
3. Verify all colors initially show 0/9 (or 1/9 if center colors are counted)
4. Select a facelet and assign "Red" color (data-testid: `color-red`)
5. Verify the color count display immediately updates: "Red: 1/9" (or 2/9 if centers counted)
6. Assign "Red" to 8 more facelets (total 9 red facelets)
7. Verify the count reaches "Red: 9/9"
8. Assign "Red" to one more facelet (total 10)
9. Verify the count shows "Red: 10/9" and is visually highlighted as an error (e.g., red text, warning icon)
10. Assign different colors and verify each color count updates in real-time
11. Change a previously assigned color and verify both color counts update (decrement old color, increment new color)

**Expected Result (AR):**
The color count display shows accurate counts for all 6 colors. Counts update immediately as colors are assigned or changed. When a color exceeds 9 occurrences, it is visually highlighted as an error. When a color is below 9 and the user attempts to complete configuration, it is highlighted as insufficient. The count format is clear and easy to understand (e.g., "X/9" or "X of 9").

**Notes:**
- This tests FR-3.1.2 and FR-3.1.3 requirements for color counting and visual indication
- The real-time count helps users avoid validation errors
- Consider whether center facelets are included in the count display

**Requirements:**
[FR-3.1.2: Color Count Display](requirements.md#FR-3.1.2), [FR-3.1.3: Visual Indication of Excess](requirements.md#FR-3.1.3)

---

### TC_CONFIG_014

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify error message provides guidance on fixing validation errors

**Pre-conditions:**
- Application is loaded
- Configuration is complete but fails validation
- Validation error is displayed

**Steps:**
1. Open the application in browser
2. Configure the cube with an intentional error (e.g., "Red" appears 11 times, "Green" appears 7 times)
3. Complete configuration and trigger validation by clicking "Validate" (data-testid: `btn-validate`)
4. Verify the validation error message appears (data-testid: `validation-error`)
5. Verify the error message includes: (a) clear description of the problem, (b) which color(s) are affected, (c) guidance on how to fix the issue
6. Expected guidance examples:
   - "Red appears 11 times (expected: 9). Please change 2 red facelets to other colors."
   - "Green appears 7 times (expected: 9). Please assign 2 more facelets as green."
7. Verify the error message is user-friendly (no technical jargon, clear actionable steps)
8. Verify the error message is displayed prominently with appropriate styling (warning color, icon)

**Expected Result (AR):**
The validation error message is clear, specific, and actionable. It explains which color(s) have incorrect counts. It provides guidance on how many facelets need to be changed. The message is user-friendly without technical jargon. The error is visually prominent and easy to notice.

**Notes:**
- This tests FR-3.3.3 requirement (Should priority) for guidance on fixing errors
- Good error messages reduce user frustration and improve completion rates
- Consider highlighting or marking the problematic facelets in the UI

**Requirements:**
[FR-3.3.3: Error Fixing Guidance](requirements.md#FR-3.3.3)

---

### TC_CONFIG_015

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify visual feedback response time is under 100ms

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Browser performance profiling is enabled (optional)

**Steps:**
1. Open the application in browser
2. Open browser developer tools and navigate to the Performance tab (optional: record performance)
3. Click on a facelet in the cube display (data-testid: `facelet-F-0`)
4. Observe the time between click and visual highlight of the selected facelet
5. Verify the visual feedback (highlight, border, selection indicator) appears immediately
6. Click on a color in the palette (data-testid: `color-red`)
7. Observe the time between click and color change on the facelet
8. Verify the color assignment is visually immediate (no perceptible delay)
9. If profiling, analyze the performance timeline and verify UI update occurs within 100ms of user interaction
10. Repeat with multiple facelets and colors to ensure consistent performance

**Expected Result (AR):**
Visual feedback appears immediately after user interaction (within 100ms). Facelet selection highlighting is instantaneous. Color assignment to facelets is instantaneous. No perceptible lag or delay in UI updates. Performance profile (if captured) shows UI updates completing within 100ms threshold.

**Notes:**
- This tests NFR-1.2 requirement for visual feedback timing
- 100ms is the threshold for perceived instantaneity
- Modern browsers should achieve this easily; focus on ensuring no heavy computations block UI updates
- Test on lower-end devices to ensure performance requirements are met

**Requirements:**
[NFR-1.2: Visual Feedback Response Time](requirements.md#NFR-1.2)

---

### TC_CONFIG_016

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify configuration interface is keyboard navigable

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- User is not using a mouse (keyboard-only testing)

**Steps:**
1. Open the application in browser
2. Press the Tab key repeatedly
3. Verify that focus moves sequentially through all interactive elements: facelets, color palette buttons, navigation buttons (Next, Previous, Validate)
4. Verify that the focused element is clearly indicated (focus ring, highlight, outline)
5. Navigate to a facelet using Tab and press Enter or Space to select it
6. Verify the facelet is selected (visual highlight appears)
7. Navigate to a color button using Tab and press Enter or Space to assign the color
8. Verify the color is assigned to the selected facelet
9. Navigate to the "Next" button using Tab and press Enter to advance to the next face
10. Verify the guided flow advances to the next face
11. Test navigating backward using Shift+Tab
12. Verify all major workflows (color assignment, navigation) are completable using only the keyboard

**Expected Result (AR):**
The entire configuration interface is navigable using only the keyboard. Tab and Shift+Tab move focus through all interactive elements in a logical order. Focus indicators are clearly visible on all elements. Enter or Space keys activate buttons and select elements. All configuration tasks can be completed without a mouse. Keyboard shortcuts (if implemented) provide faster access to color assignment.

**Notes:**
- This tests NFR-2.3 requirement for keyboard navigation (Should priority)
- Accessibility best practice: all functionality should be keyboard accessible
- Test with a screen reader for additional accessibility verification (optional)

**Requirements:**
[NFR-2.3: Keyboard Navigation](requirements.md#NFR-2.3)

---

### TC_CONFIG_017

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify configuration state is preserved if user navigates away

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least 2 faces have been configured

**Steps:**
1. Open the application in browser
2. Configure the first 2 faces completely (Front and Right)
3. Note the specific colors assigned to specific facelets for verification
4. Attempt to navigate away by: (a) refreshing the browser page (press F5), or (b) clicking browser back button, or (c) navigating to a different URL
5. Verify one of the following behaviors:
   - (a) A confirmation dialog appears warning "Configuration in progress will be lost. Are you sure?" with options to Cancel or Leave
   - (b) Configuration state is automatically saved to browser storage (localStorage/sessionStorage)
6. If option (a): Click "Cancel" to stay on the page, verify configuration is still intact
7. If option (b): Complete the navigation away, then return to the application
8. Verify the previously configured faces are restored with the correct colors
9. Verify the guided flow resumes at the correct position (next unconfigured face)

**Expected Result (AR):**
The application either: (a) warns the user before losing configuration state, or (b) preserves configuration state using browser storage. If warned, the user can cancel navigation and continue configuring. If preserved, returning to the application restores the exact state including all assigned colors and current face position. Users do not lose their progress unexpectedly.

**Notes:**
- This tests the edge case "User navigates away during configuration" from requirements
- Option (b) with automatic state preservation provides better UX
- Consider sessionStorage (cleared on tab close) vs localStorage (persists across sessions)
- Verify state is cleared after successful completion to avoid confusion

**Requirements:**
[Edge Cases: Navigation Away](requirements.md#edge-cases--error-scenarios)

---

### TC_CONFIG_018

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify reset/clear configuration prompts for confirmation

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- At least one face has been configured with colors

**Steps:**
1. Open the application in browser
2. Configure at least one face with specific colors
3. Locate the "Reset" or "Clear Configuration" button (data-testid: `btn-reset-configuration`)
4. Click the "Reset" button
5. Verify a confirmation dialog appears with message: "Are you sure you want to clear your configuration? This action cannot be undone." or similar
6. Verify the dialog has two options: "Cancel" and "Clear" (or "Yes"/"No")
7. Click "Cancel" in the confirmation dialog
8. Verify the configuration is NOT cleared and all assigned colors remain
9. Click "Reset" button again
10. This time, click "Clear" or "Yes" in the confirmation dialog
11. Verify all configured facelets are cleared (return to default state)
12. Verify the guided flow resets to the first face (Front)
13. Verify the progress indicator resets to 0%

**Expected Result (AR):**
Clicking the reset button displays a confirmation dialog before clearing configuration. The confirmation dialog clearly warns the user about data loss. Clicking "Cancel" preserves the configuration. Clicking "Clear" successfully clears all configured colors and resets the interface to initial state. The user cannot accidentally lose their configuration without confirmation.

**Notes:**
- This tests the edge case "User clears/resets configuration" from requirements
- Confirmation dialogs prevent accidental data loss
- Verify the reset functionality is easily accessible but not too prominent (avoid accidental clicks)

**Requirements:**
[Edge Cases: Clear/Reset Configuration](requirements.md#edge-cases--error-scenarios)

---

### TC_CONFIG_019

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation system detects invalid corner piece combinations

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Cube validation logic is operational

**Steps:**
1. Open the application in browser
2. Configure all 6 faces with each color appearing exactly 9 times (satisfy color count requirement)
3. Intentionally create an invalid corner piece: Configure a corner with colors that cannot physically exist together on a standard Rubik's cube
   - Example: Create a corner with White, Yellow, and Red (where White and Yellow are opposite faces and cannot be on the same corner)
   - Example: Create a corner with the same color appearing twice (e.g., Red-Red-Green)
4. Complete configuration and click "Validate" button (data-testid: `btn-validate`)
5. Verify the validation system triggers advanced cube state validation
6. Locate the validation error message (data-testid: `validation-error`)
7. Verify the error message indicates: "Invalid corner piece detected" or "Corner piece has invalid color combination" or similar
8. Verify the error message identifies the specific corner location (e.g., "Corner at Front-Up-Right")
9. Verify the system prevents progression to solution calculation
10. Verify the problematic corner pieces are visually highlighted in the cube display

**Expected Result (AR):**
The validation system detects invalid corner piece combinations even when color counts are correct. A clear error message explains that a corner piece has an invalid color combination. The specific corner location is identified. The user cannot proceed to solution calculation with invalid corners. The problematic corner pieces are visually highlighted in the interface.

**Notes:**
- This tests FR-3.2.2 requirement for corner piece validation
- Invalid corners include: opposite colors together (e.g., White-Yellow), same color twice, impossible color combinations
- Corner pieces are at the intersections of three faces (8 corners total)
- This validation requires cube-solving domain knowledge

**Requirements:**
[FR-3.2.2: Corner Piece Validation](requirements.md#FR-3.2.2)

---

### TC_CONFIG_020

**Type:** `E2E`

**Priority:** `High`

**Name:** Verify validation system detects invalid edge piece combinations

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Cube validation logic is operational

**Steps:**
1. Open the application in browser
2. Configure all 6 faces with each color appearing exactly 9 times (satisfy color count requirement)
3. Intentionally create an invalid edge piece: Configure an edge with colors that cannot physically exist together
   - Example: Create an edge with White and Yellow (opposite faces cannot be on the same edge)
   - Example: Create an edge with the same color appearing twice (e.g., Red-Red)
4. Complete configuration and click "Validate" button (data-testid: `btn-validate`)
5. Verify the validation system triggers advanced cube state validation
6. Locate the validation error message (data-testid: `validation-error`)
7. Verify the error message indicates: "Invalid edge piece detected" or "Edge piece has invalid color combination" or similar
8. Verify the error message identifies the specific edge location (e.g., "Edge at Front-Right")
9. Verify the system prevents progression to solution calculation
10. Verify the problematic edge pieces are visually highlighted in the cube display

**Expected Result (AR):**
The validation system detects invalid edge piece combinations even when color counts are correct. A clear error message explains that an edge piece has an invalid color combination. The specific edge location is identified. The user cannot proceed to solution calculation with invalid edges. The problematic edge pieces are visually highlighted in the interface.

**Notes:**
- This tests FR-3.2.3 requirement for edge piece validation
- Invalid edges include: opposite colors together (e.g., White-Yellow), same color twice
- Edge pieces are at the intersections of two faces (12 edges total)
- This validation requires cube-solving domain knowledge

**Requirements:**
[FR-3.2.3: Edge Piece Validation](requirements.md#FR-3.2.3)

---

### TC_CONFIG_021

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify guided mode prevents configuration of faces out of sequence

**Pre-conditions:**
- Application is loaded
- Guided mode is enabled (default setting)
- Configuration interface is displayed
- At least one face has been configured

**Steps:**
1. Open the application in browser
2. Verify the configuration interface is in guided mode
3. Configure the first face (Front) completely
4. Click "Next" to move to the second face (Right) (data-testid: `btn-next-face`)
5. Verify the interface transitions to the second face
6. Attempt to click on a facelet in a non-current face (e.g., Back face or Left face)
7. Verify one of the following behaviors:
   - (a) The facelet is not selectable (no visual response, disabled state)
   - (b) A message appears indicating "Please complete the current face first" or similar
   - (c) The click is ignored and focus remains on the current face
8. Complete the second face (Right) by assigning colors to all non-center facelets
9. Click "Next" to move to the third face (Back)
10. Attempt to click on a facelet in the first face (Front) which was already completed
11. Verify the same prevention behavior occurs (facelet not selectable or message displayed)
12. Verify only the current face (Back) is configurable

**Expected Result (AR):**
The guided configuration flow enforces sequential face configuration. Users cannot select or configure facelets on non-current faces. Either facelets are visually disabled, or a clear message indicates the user must complete the current face first. The system prevents out-of-sequence configuration while still allowing navigation back to previously configured faces for editing. Only the current face is active and configurable.

**Notes:**
- This tests FR-2.1.4 requirement (Should priority) for preventing out-of-sequence configuration
- The prevention should apply to both future faces and past faces (except when using Previous button)
- Users should still be able to use "Previous" to edit completed faces
- Test that the prevention is clear and user-friendly

**Requirements:**
[FR-2.1.4: Prevent Out-of-Sequence Configuration](requirements.md#FR-2.1.4)

---

### TC_CONFIG_022

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify validation system identifies specific error locations

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Validation system is operational

**Steps:**
1. Open the application in browser
2. Configure the cube with an intentional error (e.g., "Red" appears 11 times, "Green" appears 7 times)
3. Complete configuration and trigger validation by clicking "Validate" (data-testid: `btn-validate`)
4. Verify the validation error message appears (data-testid: `validation-error`)
5. Verify the error message identifies specific locations:
   - For color count errors: Which facelets have the problematic color
   - For piece errors: Which specific corner or edge pieces are invalid
   - For incomplete configuration: Which faces or facelets are missing
6. Verify the error display highlights or marks the problematic facelets in the cube display
7. Verify clicking on an error message (if clickable) focuses or scrolls to the problematic location
8. Fix one error (e.g., change one red facelet to green)
9. Re-validate and verify the error message updates to reflect remaining errors
10. Verify the location identification is accurate and helpful for fixing errors

**Expected Result (AR):**
The validation system identifies the specific locations of configuration errors. Error messages include location information (face names, facelet positions, piece locations). Problematic facelets or pieces are visually highlighted in the cube display. Users can easily locate and fix errors based on the location information. The error location identification is accurate and actionable.

**Notes:**
- This tests FR-3.3.2 requirement (Should priority) for identifying specific error locations
- Location identification helps users fix errors efficiently
- Visual highlighting makes errors easy to spot
- Consider accessibility: location information should be available to screen readers

**Requirements:**
[FR-3.3.2: Identify Specific Error Locations](requirements.md#FR-3.3.2)

---

### TC_CONFIG_023

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify interface is intuitive and requires no prior Rubik's cube notation knowledge

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- User has no prior knowledge of Rubik's cube notation or terminology

**Steps:**
1. Open the application in browser
2. Verify the interface uses plain language (no technical cube notation)
3. Verify face names are user-friendly (e.g., "Front", "Right", "Top" instead of "F", "R", "U")
4. Verify instructions are clear and do not assume prior knowledge
5. Verify color names are standard (White, Yellow, Red, Orange, Blue, Green) not abbreviated
6. Verify the orientation guide is visible and helpful
7. Verify tooltips or help text explain any potentially confusing elements
8. Verify the interface does not use cube-solving terminology (e.g., "scramble", "algorithm", "OLL", "PLL")
9. Verify a first-time user can understand how to configure the cube without reading documentation
10. Verify the guided flow provides clear step-by-step instructions

**Expected Result (AR):**
The interface is intuitive and accessible to users with no prior Rubik's cube knowledge. All terminology is plain language and user-friendly. Instructions are clear and do not assume technical knowledge. The orientation guide helps users understand cube orientation. No cube-solving jargon or notation is used in the interface. First-time users can successfully configure the cube without external help.

**Notes:**
- This tests NFR-1.1 requirement (Must priority) for intuitive interface
- Usability testing with actual first-time users would be ideal
- Consider adding a "Help" or "Tutorial" section for additional guidance
- Verify the interface is self-explanatory

**Requirements:**
[NFR-1.1: Intuitive Interface](requirements.md#NFR-1.1)

---

### TC_CONFIG_024

**Type:** `E2E`

**Priority:** `Low`

**Name:** Verify configuration process is completable within 5 minutes for average user

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Timer or stopwatch available for measurement

**Steps:**
1. Open the application in browser
2. Start a timer when beginning configuration
3. Complete the cube configuration following the guided flow
4. Configure all 6 faces with valid color assignments
5. Complete validation and proceed to solution calculation
6. Stop the timer when configuration is complete
7. Verify the total time is under 5 minutes (300 seconds)
8. Repeat the test 2-3 times with different cube configurations
9. Calculate average completion time
10. Verify the average time is under 5 minutes

**Expected Result (AR):**
An average user can complete the cube configuration process within 5 minutes. The guided flow is efficient and does not require excessive time. The interface is responsive and does not cause delays. Color assignment is quick and intuitive. Navigation between faces is smooth. The total time from start to completion is acceptable for the task complexity.

**Notes:**
- This tests NFR-1.3 requirement (Should priority) for completion time
- "Average user" means someone familiar with basic computer/mobile interfaces
- Time includes: understanding interface, configuring all 54 facelets, validation
- Consider that expert users may complete faster, but average users should meet the target

**Requirements:**
[NFR-1.3: Configuration Completion Time](requirements.md#NFR-1.3)

---

### TC_CONFIG_025

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify colors have sufficient contrast for visibility

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Cube colors are visible

**Steps:**
1. Open the application in browser
2. Verify all 6 cube colors are displayed in the color palette
3. Verify each color is clearly distinguishable from others
4. Verify colors have sufficient contrast against the background
5. Verify facelet colors are visible when assigned to the cube display
6. Verify text or borders on colored facelets are readable (if present)
7. Test with different screen brightness settings
8. Test in different lighting conditions (if possible)
9. Verify color contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
10. Verify users with normal vision can easily distinguish all 6 colors

**Expected Result (AR):**
All cube colors have sufficient contrast for visibility. Colors are clearly distinguishable from each other. Colors are visible against the background. Text or indicators on colored facelets are readable. The color palette meets accessibility standards. Users can easily identify and select colors. The interface is usable in various lighting conditions.

**Notes:**
- This tests NFR-2.1 requirement (Must priority) for color contrast
- WCAG 2.1 AA standards recommend 4.5:1 contrast ratio for normal text
- Consider testing with color contrast analysis tools
- Verify colors work well for users with color vision deficiencies (separate test)

**Requirements:**
[NFR-2.1: Sufficient Color Contrast](requirements.md#NFR-2.1)

---

### TC_CONFIG_026

**Type:** `E2E`

**Priority:** `Low`

**Name:** Verify colorblind-friendly mode with pattern overlays (if implemented)

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Colorblind-friendly mode is available (if implemented)

**Steps:**
1. Open the application in browser
2. Locate colorblind-friendly mode toggle or setting (if available)
3. If mode is available:
   - Enable colorblind-friendly mode
   - Verify pattern overlays appear on colored facelets
   - Verify patterns are distinct for each color
   - Verify patterns do not obscure the colors
   - Verify the interface remains usable with patterns
   - Test that users can still distinguish all 6 colors with patterns
4. If mode is not available:
   - Verify this is acceptable (Could priority requirement)
   - Document that feature is not implemented

**Expected Result (AR):**
If colorblind-friendly mode is implemented, it provides pattern overlays that help users distinguish colors. Patterns are distinct and do not interfere with color visibility. The mode improves accessibility for users with color vision deficiencies. If not implemented, this is acceptable as it's a Should priority requirement that may be deferred.

**Notes:**
- This tests NFR-2.2 requirement (Should priority) for colorblind-friendly mode
- This is a "Should" requirement, so implementation is optional
- If not implemented, document in test results
- Patterns could include: stripes, dots, lines, shapes

**Requirements:**
[NFR-2.2: Colorblind-Friendly Mode](requirements.md#NFR-2.2)

---

### TC_CONFIG_027

**Type:** `E2E`

**Priority:** `Medium`

**Name:** Verify validation completes within 500ms of configuration completion

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Browser developer tools available for performance measurement

**Steps:**
1. Open the application in browser
2. Open browser developer tools and navigate to Performance tab
3. Start performance recording
4. Complete cube configuration (all 6 faces with valid colors)
5. Click "Validate" button (data-testid: `btn-validate`)
6. Stop performance recording when validation completes
7. Analyze the performance timeline
8. Measure the time from button click to validation result display
9. Verify the validation completes within 500ms
10. Repeat test 3-5 times with different configurations
11. Verify average validation time is under 500ms

**Expected Result (AR):**
Validation completes within 500ms of the user clicking the validate button. The validation process is fast and responsive. Users do not experience noticeable delays. The performance meets the requirement consistently across different cube configurations. Validation does not block the UI for extended periods.

**Notes:**
- This tests NFR-3.1 requirement (Must priority) for validation performance
- 500ms is the maximum acceptable time
- Consider that complex validations (corner/edge checking) may take longer
- Verify validation is optimized for performance

**Requirements:**
[NFR-3.1: Validation Performance](requirements.md#NFR-3.1)

---

### TC_CONFIG_028

**Type:** `E2E`

**Priority:** `Low`

**Name:** Verify interface renders smoothly at 60fps during interactions

**Pre-conditions:**
- Application is loaded
- Configuration interface is displayed
- Browser developer tools available for FPS measurement

**Steps:**
1. Open the application in browser
2. Open browser developer tools and enable FPS meter or performance monitor
3. Interact with the interface:
   - Click on facelets rapidly
   - Assign colors quickly
   - Navigate between faces
   - Scroll or resize the viewport
4. Monitor the frame rate during interactions
5. Verify the frame rate maintains at least 30fps, target 60fps
6. Verify there are no noticeable frame drops or stuttering
7. Verify animations (if any) are smooth
8. Test on different devices/browsers if possible
9. Verify performance is acceptable on lower-end devices

**Expected Result (AR):**
The interface renders smoothly during user interactions. Frame rate maintains at least 30fps, ideally 60fps. There are no noticeable stutters or frame drops. Animations are smooth and responsive. The interface performs well across different devices and browsers. User experience is not degraded by performance issues.

**Notes:**
- This tests NFR-3.2 requirement (Should priority) for rendering performance
- 60fps is the target, 30fps is the minimum acceptable
- Performance may vary on different devices
- Consider optimizing rendering for lower-end devices

**Requirements:**
[NFR-3.2: Rendering Performance](requirements.md#NFR-3.2)

---

## Coverage Matrix

| Requirement ID | Test Cases |
|---------------|------------|
| FR-1.1.1 - Visual representation of six faces | TC_CONFIG_001 |
| FR-1.1.2 - Individual facelet selection | TC_CONFIG_001, TC_CONFIG_002, TC_CONFIG_009 |
| FR-1.1.3 - Visual selection indicator | TC_CONFIG_001, TC_CONFIG_002, TC_CONFIG_012 |
| FR-1.1.4 - Fixed center facelets | TC_CONFIG_009 |
| FR-1.2.1 - Six-color palette | TC_CONFIG_001 |
| FR-1.2.2 - Color assignment to facelets | TC_CONFIG_001, TC_CONFIG_012 |
| FR-1.2.3 - Immediate color display | TC_CONFIG_001, TC_CONFIG_002 |
| FR-1.2.4 - Color modification | TC_CONFIG_002 |
| FR-1.2.5 - Keyboard shortcuts | TC_CONFIG_012 |
| FR-2.1.1 - One face at a time | TC_CONFIG_003 |
| FR-2.1.2 - Clear instructions | TC_CONFIG_003 |
| FR-2.1.3 - Current face highlighting | TC_CONFIG_003 |
| FR-2.2.1 - Progress indicator percentage | TC_CONFIG_004 |
| FR-2.2.2 - Completed faces display | TC_CONFIG_004 |
| FR-2.2.3 - Remaining faces display | TC_CONFIG_004 |
| FR-2.2.4 - Navigation and editing | TC_CONFIG_008 |
| FR-3.1.1 - Real-time validation | TC_CONFIG_005, TC_CONFIG_006 |
| FR-3.1.2 - Color count display | TC_CONFIG_013 |
| FR-3.1.3 - Visual indication of excess | TC_CONFIG_005, TC_CONFIG_013 |
| FR-3.1.4 - Visual indication of deficit | TC_CONFIG_006, TC_CONFIG_013 |
| FR-3.2.1 - Color count validation (exactly 9) | TC_CONFIG_005, TC_CONFIG_006 |
| FR-3.2.2 - Corner piece validation | TC_CONFIG_019 |
| FR-3.2.3 - Edge piece validation | TC_CONFIG_020 |
| FR-3.2.4 - Impossible state detection | TC_CONFIG_007 |
| FR-3.2.5 - Solvability validation | TC_CONFIG_007 |
| FR-3.3.1 - Clear error messages | TC_CONFIG_005, TC_CONFIG_006, TC_CONFIG_007, TC_CONFIG_011, TC_CONFIG_014 |
| FR-3.3.2 - Identify specific error locations | TC_CONFIG_022 |
| FR-3.3.3 - Error fixing guidance | TC_CONFIG_014 |
| FR-3.3.4 - Prevent invalid progression | TC_CONFIG_005, TC_CONFIG_006, TC_CONFIG_007, TC_CONFIG_011 |
| FR-2.1.4 - Prevent out-of-sequence configuration | TC_CONFIG_021 |
| NFR-1.1 - Intuitive interface | TC_CONFIG_023 |
| NFR-1.2 - Visual feedback timing | TC_CONFIG_015 |
| NFR-1.3 - Configuration completion time | TC_CONFIG_024 |
| NFR-2.1 - Sufficient color contrast | TC_CONFIG_025 |
| NFR-2.2 - Colorblind-friendly mode | TC_CONFIG_026 |
| NFR-2.3 - Keyboard navigation | TC_CONFIG_016 |
| NFR-3.1 - Validation performance | TC_CONFIG_027 |
| NFR-3.2 - Rendering performance | TC_CONFIG_028 |
| AC-1 - Color Assignment | TC_CONFIG_001, TC_CONFIG_002 |
| AC-2 - Guided Configuration | TC_CONFIG_003, TC_CONFIG_004, TC_CONFIG_008 |
| AC-3 - Validation | TC_CONFIG_005, TC_CONFIG_006, TC_CONFIG_007, TC_CONFIG_011 |
| Edge Case - Incomplete configuration | TC_CONFIG_011 |
| Edge Case - Navigation away | TC_CONFIG_017 |
| Edge Case - Clear/reset | TC_CONFIG_018 |
| Dependency - Feature 2 Integration | TC_CONFIG_010 |
