---
name: test-coverage-verification
description: Verify that code implementation covers all test cases defined in specifications. Checks for missing features, data-testid attributes, and implementation gaps.
license: MIT
compatibility: Claude Code, Cursor, VS Code, Windsurf
metadata:
  category: quality-assurance
  complexity: intermediate
  author: Kiro Team
  version: "1.0.0"
---

# Test Coverage Verification

Systematically verify that code implementation matches test case requirements. Identify missing features, test automation attributes, and implementation gaps.

## When to Use This Skill

Use this skill when:
- Reviewing implementation against test cases
- Preparing for test automation
- Verifying feature completeness
- Identifying missing test attributes (data-testid)
- Checking requirement coverage
- Before test execution

## Core Principles

1. **Test-Driven Verification:** Every test case must have corresponding implementation
2. **Automation-Ready:** All interactive elements need data-testid attributes
3. **Complete Coverage:** Verify both functional and non-functional requirements
4. **Traceability:** Link test cases to requirements and implementation
5. **Gap Analysis:** Identify missing features clearly

## Verification Process

### Step 1: Load Test Cases

1. **Locate test case files:**
   - Check `specs/` directory for test case markdown files
   - Look for files named `test-cases.md` in feature directories
   - Identify all test cases and their requirements

2. **Parse test case structure:**
   - Extract test case IDs (e.g., `TC_CONFIG_001`)
   - Identify test types (E2E, API, Unit)
   - Note priority levels (High, Medium)
   - Extract data-testid requirements from steps

### Step 2: Analyze Implementation

1. **Map test cases to code:**
   - Find corresponding components/features in `src/` directory
   - Verify components are imported and used
   - Check that features are accessible in the UI
   - Trace navigation paths mentioned in test cases

2. **Check for data-testid attributes:**
   - Search codebase for `data-testid` usage
   - Compare found attributes with test case expectations
   - Identify missing test IDs for interactive elements

3. **Verify feature implementation:**
   - Check if features are fully implemented (not stubbed)
   - Verify UI components render correctly
   - Confirm event handlers are attached
   - Validate state management works

### Step 3: Coverage Analysis

1. **Functional Coverage:**
   - ✅ Fully Implemented: Feature exists and works
   - ⚠️ Partially Implemented: Feature exists but incomplete
   - ❌ Missing: Feature not implemented

2. **Test Automation Coverage:**
   - ✅ Has data-testid: Element has required test ID
   - ❌ Missing data-testid: Element needs test ID

3. **Requirement Coverage:**
   - Map each requirement to test cases
   - Verify all requirements have test coverage
   - Check if all test cases trace to requirements

### Step 4: Generate Report

Create a comprehensive coverage report with:

1. **Summary Statistics:**
   - Total test cases
   - Fully implemented count
   - Partially implemented count
   - Missing count
   - Coverage percentage

2. **Detailed Findings:**
   - List each test case with implementation status
   - Missing data-testid attributes
   - Implementation gaps
   - Recommendations

3. **Priority Actions:**
   - Critical gaps (High priority test cases)
   - Test automation blockers
   - Quick wins

## Common Test Case Requirements

### Data-TestID Attributes

Test cases typically expect these patterns:

**Facelets:**
- `facelet-{FACE}-{POSITION}` (e.g., `facelet-F-0`, `facelet-F-2`)

**Color Palette:**
- `color-{COLOR}` (e.g., `color-red`, `color-blue`, `color-white`)

**Navigation Buttons:**
- `btn-next-face`, `btn-previous-face`
- `btn-validate`, `btn-finish-configuration`
- `btn-reset-configuration`

**Display Elements:**
- `progress-indicator`
- `validation-error`
- `color-count-display`

**Other:**
- `cube-display`
- `face-grid-{FACE}`
- `orientation-guide`

### Implementation Checks

For each test case, verify:

1. **Component Existence:**
   ```typescript
   // Check if component is defined
   - Component class exists
   - Component is exported
   - Component is imported where used
   ```

2. **Rendering:**
   ```typescript
   // Check if component renders
   - Component is instantiated
   - getElement() or render() is called
   - Element is added to DOM
   ```

3. **Functionality:**
   ```typescript
   // Check if feature works
   - Event handlers attached
   - State management connected
   - Validation logic implemented
   - Navigation works
   ```

4. **Test Attributes:**
   ```typescript
   // Check for data-testid
   - Interactive elements have data-testid
   - Test IDs match test case expectations
   - IDs are unique and descriptive
   ```

## Coverage Report Template

```markdown
## Test Coverage Report: [Feature Name]

### Summary
- **Total Test Cases:** X
- **Fully Implemented:** Y (Z%)
- **Partially Implemented:** A (B%)
- **Missing:** C (D%)

### Critical Gaps
1. [High Priority Test Case] - [Issue Description]
2. [Missing Feature] - [Impact]

### Test Automation Readiness
- **Elements with data-testid:** X/Y
- **Missing test IDs:** [List]

### Detailed Findings

#### TC_XXX_001
- **Status:** ✅ Fully Implemented
- **Component:** [ComponentName]
- **Location:** [File Path]
- **Test IDs:** ✅ All present

#### TC_XXX_002
- **Status:** ⚠️ Partially Implemented
- **Issue:** [Description]
- **Missing:** [Feature/Attribute]
- **Recommendation:** [Action]

#### TC_XXX_003
- **Status:** ❌ Missing
- **Required:** [Feature Description]
- **Impact:** [High/Medium/Low]
```

## Verification Checklist

### For Each Test Case:

- [ ] Test case ID identified
- [ ] Corresponding code component found
- [ ] Component is imported and used
- [ ] Feature is accessible in UI
- [ ] Navigation path exists
- [ ] All data-testid attributes present
- [ ] Event handlers implemented
- [ ] State management works
- [ ] Validation logic exists (if applicable)
- [ ] Error handling implemented (if applicable)

### For Test Automation:

- [ ] All interactive elements have data-testid
- [ ] Test IDs match test case expectations
- [ ] IDs are unique
- [ ] IDs are descriptive
- [ ] No duplicate IDs

### For Requirements:

- [ ] All requirements have test cases
- [ ] All test cases trace to requirements
- [ ] Coverage matrix is accurate
- [ ] Edge cases covered
- [ ] Error scenarios covered

## Example Usage

When verifying test coverage:

1. **Load test cases:**
   ```
   Read: specs/01-cube-configuration/test-cases.md
   ```

2. **Check implementation:**
   ```
   Search: src/client/features/configuration/
   Verify: Components match test case requirements
   ```

3. **Verify test IDs:**
   ```
   Grep: data-testid
   Compare: Found IDs vs Expected IDs from test cases
   ```

4. **Generate report:**
   ```
   Create: Coverage report with findings
   List: Missing features and attributes
   Prioritize: Critical gaps
   ```

## Common Issues Found

### Missing Data-TestID Attributes

**Problem:** Test cases reference `data-testid` but code doesn't have them.

**Solution:**
```typescript
// Before
const button = document.createElement('button');
button.textContent = 'Next';

// After
const button = document.createElement('button');
button.textContent = 'Next';
button.setAttribute('data-testid', 'btn-next-face');
```

### Incomplete Implementation

**Problem:** Feature exists but doesn't match test case expectations.

**Example:** Color count shows "9" instead of "9/9" format.

**Solution:** Update implementation to match test case format.

### Missing Features

**Problem:** Test case describes feature that doesn't exist.

**Example:** State persistence (localStorage) not implemented.

**Solution:** Implement missing feature or mark test case as "Not Implemented".

### Navigation Path Mismatch

**Problem:** Test case navigation doesn't match actual UI.

**Solution:** Update test case or fix UI navigation.

## Best Practices

1. **Verify Before Testing:** Check coverage before writing automated tests
2. **Update Test Cases:** Keep test cases in sync with implementation
3. **Document Gaps:** Clearly document missing features
4. **Prioritize Fixes:** Address High priority gaps first
5. **Automate Checks:** Consider automated coverage verification

## Integration with Other Skills

- **Quality Assurance:** Use QA practices for validation
- **Test Documentation:** Generate test cases that match implementation
- **Requirements Engineering:** Verify requirements are testable
- **Spec-Driven Development:** Ensure specs match implementation

---

## Quick Reference

**Check Coverage:**
1. Read test cases from `specs/`
2. Search implementation in `src/`
3. Compare requirements vs code
4. Identify gaps
5. Generate report

**Common Test ID Patterns:**
- Facelets: `facelet-{FACE}-{POS}`
- Colors: `color-{COLOR}`
- Buttons: `btn-{ACTION}`
- Displays: `{element-name}`

**Status Codes:**
- ✅ Fully Implemented
- ⚠️ Partially Implemented
- ❌ Missing
