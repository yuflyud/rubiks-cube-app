---
name: requirements-test-coverage
description: Verify that all requirements have corresponding test cases. Ensures complete test coverage of functional and non-functional requirements, identifies gaps, and validates test case quality.
license: MIT
compatibility: Claude Code, Cursor, VS Code, Windsurf
metadata:
  category: quality-assurance
  complexity: intermediate
  author: Kiro Team
  version: "1.0.0"
---

# Requirements Test Coverage Verification

Systematically verify that all requirements have corresponding test cases. Ensure complete test coverage, identify gaps, and validate that test cases properly test their requirements.

## When to Use This Skill

Use this skill when:
- Reviewing test case completeness
- Preparing for test execution
- Validating requirement traceability
- Identifying untested requirements
- Ensuring test quality
- Before test automation setup

## Core Principles

1. **Complete Coverage:** Every requirement must have at least one test case
2. **Traceability:** Test cases must clearly link to requirements
3. **Priority Alignment:** High priority requirements need High priority test cases
4. **Quality Validation:** Test cases must properly test their requirements
5. **Gap Identification:** Clearly identify missing test coverage

## Verification Process

### Step 1: Load Requirements

1. **Locate requirements file:**
   - Check `specs/` directory for `requirements.md` files
   - Identify all functional requirements (FR-X.X.X)
   - Identify all non-functional requirements (NFR-X.X)
   - Identify acceptance criteria (AC-X)
   - Note requirement priorities (Must, Should, Could)

2. **Parse requirement structure:**
   - Extract requirement IDs
   - Extract requirement descriptions
   - Note requirement priorities
   - Group by requirement category

### Step 2: Load Test Cases

1. **Locate test case file:**
   - Check `specs/` directory for `test-cases.md` files
   - Extract all test case IDs (e.g., `TC_CONFIG_001`)
   - Extract test case names and descriptions
   - Note test case priorities (High, Medium, Low)
   - Extract requirements referenced in each test case

2. **Parse coverage matrix:**
   - Read the Coverage Matrix section
   - Map requirements to test cases
   - Identify which requirements have test coverage
   - Count test cases per requirement

### Step 3: Coverage Analysis

1. **Requirement Coverage:**
   - ✅ Covered: Requirement has test case(s)
   - ⚠️ Partially Covered: Requirement has test case but incomplete
   - ❌ Uncovered: Requirement has no test case

2. **Priority Alignment:**
   - Check if Must requirements have High priority test cases
   - Check if Should requirements have Medium/High priority test cases
   - Flag misaligned priorities

3. **Test Quality:**
   - Verify test cases actually test the requirement
   - Check if test cases have proper steps
   - Validate expected results match requirement

### Step 4: Gap Analysis

1. **Missing Test Cases:**
   - List requirements without test cases
   - Prioritize by requirement priority
   - Identify critical gaps

2. **Incomplete Coverage:**
   - Requirements with only partial test coverage
   - Edge cases not covered
   - Error scenarios missing

3. **Quality Issues:**
   - Test cases that don't properly test requirements
   - Missing test steps
   - Unclear expected results

### Step 5: Generate Report

Create a comprehensive coverage report with:

1. **Summary Statistics:**
   - Total requirements
   - Covered requirements count
   - Uncovered requirements count
   - Coverage percentage
   - Priority breakdown

2. **Detailed Findings:**
   - Each requirement with coverage status
   - Associated test cases
   - Coverage gaps
   - Priority misalignments

3. **Recommendations:**
   - Missing test cases to create
   - Test cases to enhance
   - Priority adjustments needed

## Requirement Types to Check

### Functional Requirements (FR-X.X.X)

**Format:** `FR-{Category}.{Subcategory}.{Number}`

**Examples:**
- `FR-1.1.1` - Visual representation of six faces
- `FR-2.2.4` - Navigation and editing
- `FR-3.2.1` - Color count validation

**Check:**
- Each FR has at least one test case
- Test case properly tests the requirement
- Priority matches requirement priority

### Non-Functional Requirements (NFR-X.X)

**Format:** `NFR-{Category}.{Number}`

**Examples:**
- `NFR-1.2` - Visual feedback timing
- `NFR-2.3` - Keyboard navigation

**Check:**
- NFRs have test cases (often performance/accessibility)
- Test cases can measure NFR compliance

### Acceptance Criteria (AC-X)

**Format:** `AC-{Number}`

**Examples:**
- `AC-1` - Color Assignment
- `AC-2` - Guided Configuration

**Check:**
- Each AC has test cases
- Test cases validate acceptance

### Edge Cases

**Format:** `Edge Case - {Description}`

**Examples:**
- `Edge Case - Incomplete configuration`
- `Edge Case - Navigation away`

**Check:**
- Edge cases have test cases
- Test cases cover the edge scenario

## Coverage Report Template

```markdown
## Requirements Test Coverage Report: [Feature Name]

### Summary
- **Total Requirements:** X
- **Covered Requirements:** Y (Z%)
- **Uncovered Requirements:** A (B%)
- **Priority Breakdown:**
  - Must: X/Y covered
  - Should: A/B covered
  - Could: C/D covered

### Critical Gaps
1. [Must Priority Requirement] - No test case
2. [High Priority Feature] - Incomplete coverage

### Detailed Findings

#### FR-X.X.X: [Requirement Name]
- **Priority:** Must/Should/Could
- **Status:** ✅ Covered / ⚠️ Partial / ❌ Uncovered
- **Test Cases:** TC_XXX_001, TC_XXX_002
- **Coverage Quality:** Good/Fair/Poor
- **Notes:** [Any issues or recommendations]

#### FR-X.X.Y: [Requirement Name]
- **Priority:** Must
- **Status:** ❌ Uncovered
- **Test Cases:** None
- **Impact:** High
- **Recommendation:** Create High priority test case

### Priority Misalignments
- FR-X.X.X (Must) → TC_XXX_005 (Medium) - Should be High priority
```

## Verification Checklist

### For Each Requirement:

- [ ] Requirement ID identified
- [ ] Requirement has test case(s)
- [ ] Test case(s) properly test the requirement
- [ ] Test case priority matches requirement priority
- [ ] Test case has clear steps
- [ ] Test case has measurable expected results
- [ ] Edge cases covered (if applicable)
- [ ] Error scenarios covered (if applicable)

### For Coverage Matrix:

- [ ] Coverage matrix exists
- [ ] All requirements listed in matrix
- [ ] Test cases correctly mapped
- [ ] No duplicate mappings
- [ ] Matrix is up to date

### For Test Cases:

- [ ] Test case references requirement
- [ ] Test case name matches requirement
- [ ] Test case steps test the requirement
- [ ] Expected results validate requirement
- [ ] Test case is executable

## Requirement Priority Alignment

### Must Requirements
- **Should have:** High priority test cases
- **Acceptable:** Medium priority (if comprehensive)
- **Not acceptable:** Low priority or missing

### Should Requirements
- **Should have:** Medium or High priority test cases
- **Acceptable:** Low priority (if comprehensive)
- **Not acceptable:** Missing

### Could Requirements
- **Should have:** Low or Medium priority test cases
- **Acceptable:** Missing (if low impact)
- **Not acceptable:** High priority (over-testing)

## Example Usage

When verifying requirements coverage:

1. **Load requirements:**
   ```
   Read: specs/01-cube-configuration/requirements.md
   Extract: All FR-X.X.X, NFR-X.X, AC-X requirements
   Note: Priorities and descriptions
   ```

2. **Load test cases:**
   ```
   Read: specs/01-cube-configuration/test-cases.md
   Extract: All TC_XXX_XXX test cases
   Read: Coverage Matrix section
   ```

3. **Compare:**
   ```
   Map: Requirements → Test Cases
   Check: Each requirement has test case
   Validate: Test cases properly test requirements
   ```

4. **Generate report:**
   ```
   List: Covered requirements
   List: Uncovered requirements
   Prioritize: Critical gaps
   Recommend: Missing test cases
   ```

## Common Issues Found

### Missing Test Cases

**Problem:** Requirement has no test case.

**Example:** `FR-3.2.2` (Corner piece validation) not in coverage matrix.

**Solution:** Create test case for the requirement.

### Incomplete Coverage

**Problem:** Requirement has test case but doesn't fully test it.

**Example:** `FR-2.1.1` has test case but doesn't test all scenarios.

**Solution:** Enhance existing test case or add additional test cases.

### Priority Misalignment

**Problem:** Must requirement has Medium/Low priority test case.

**Example:** `FR-1.1.1` (Must) → `TC_CONFIG_012` (Medium).

**Solution:** Upgrade test case priority or create High priority test case.

### Poor Test Quality

**Problem:** Test case doesn't properly test the requirement.

**Example:** Test case for `FR-3.2.1` doesn't verify exact count of 9.

**Solution:** Update test case steps and expected results.

### Missing Edge Cases

**Problem:** Requirement has positive test case but no edge case coverage.

**Example:** `FR-1.2.4` (Color modification) has no error scenario test.

**Solution:** Add edge case test cases.

## Best Practices

1. **Verify Early:** Check coverage during test case creation
2. **Maintain Matrix:** Keep coverage matrix updated
3. **Prioritize Gaps:** Address Must requirements first
4. **Quality Over Quantity:** Better to have fewer good test cases
5. **Trace Requirements:** Always link test cases to requirements

## Coverage Matrix Validation

### Check Matrix Completeness

1. **All Requirements Listed:**
   - Every FR, NFR, AC should appear
   - Edge cases should be listed
   - Dependencies should be noted

2. **Accurate Mapping:**
   - Test cases correctly reference requirements
   - No orphaned test cases
   - No duplicate mappings

3. **Format Consistency:**
   - Consistent requirement ID format
   - Consistent test case ID format
   - Clear, readable table

### Matrix Format Example

```markdown
## Coverage Matrix

| Requirement ID | Test Cases |
|---------------|------------|
| FR-1.1.1 - Visual representation | TC_CONFIG_001 |
| FR-1.1.2 - Facelet selection | TC_CONFIG_001, TC_CONFIG_002 |
| FR-1.2.5 - Keyboard shortcuts | TC_CONFIG_012 |
```

## Integration with Other Skills

- **Test Coverage Verification:** Use after this to check implementation
- **Test Documentation:** Generate test cases for uncovered requirements
- **Quality Assurance:** Apply QA practices to test case quality
- **Requirements Engineering:** Ensure requirements are testable

## Quick Reference

**Check Coverage:**
1. Read requirements from `specs/*/requirements.md`
2. Read test cases from `specs/*/test-cases.md`
3. Compare requirements vs test cases
4. Validate coverage matrix
5. Identify gaps
6. Generate report

**Requirement Formats:**
- Functional: `FR-{Category}.{Sub}.{Num}`
- Non-Functional: `NFR-{Category}.{Num}`
- Acceptance: `AC-{Num}`
- Edge Cases: `Edge Case - {Name}`

**Status Codes:**
- ✅ Covered
- ⚠️ Partially Covered
- ❌ Uncovered

**Priority Rules:**
- Must → High priority test cases
- Should → Medium/High priority test cases
- Could → Low/Medium priority test cases
