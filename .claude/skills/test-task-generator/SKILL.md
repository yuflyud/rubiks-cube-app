# Test Task Generator Skill

## Purpose
Analyzes all `tasks.md` files in the `specs/` directories and ensures that unit and integration test tasks are included for each requirement. If test tasks are missing, they are automatically added following the existing task structure and format.

## When to Use This Skill
- After creating or updating requirements and task breakdowns
- Before starting implementation to ensure test coverage is planned
- When reviewing project completeness and test strategy
- As part of quality assurance workflow

## What This Skill Does

1. **Scans for Task Files**: Locates all `tasks.md` files in `specs/{feature-name}/` directories
2. **Analyzes Existing Tasks**: Reviews current tasks to identify:
   - Unit test tasks for business logic, validators, calculators
   - Integration test tasks for feature interactions and state management
   - E2E test tasks (usually already covered in requirements)
3. **Identifies Gaps**: Determines which requirements lack corresponding test implementation tasks
4. **Generates Missing Tasks**: Creates properly formatted tasks for:
   - Unit tests (70% coverage target)
   - Integration tests (20% coverage target)
   - Follows existing task structure and numbering
5. **Updates Files**: Appends new tasks to the appropriate `tasks.md` files

## Task Generation Rules

### Unit Test Tasks
Unit test tasks should be created for:
- Business logic classes in `logic/` directories
- Validators (e.g., `CubeValidator`, `InputValidator`)
- Calculators and algorithms (e.g., `SolutionCalculator`, `StateSimulator`)
- Utility functions and helpers
- Error handling and edge cases

### Integration Test Tasks
Integration test tasks should be created for:
- Feature-to-feature interactions (Configuration → Assembly → Visualization)
- State management and observer patterns
- Component lifecycle and cleanup
- Data flow between layers (UI → Logic → State)

### Task Structure Format
Each generated task follows this structure:

```markdown
## Task {NUMBER}: {Test Type} - {Component/Feature Name}

**Type:** Unit Test / Integration Test
**Priority:** High / Medium / Low
**Estimated Effort:** Small / Medium / Large

### Description
{Clear description of what needs to be tested}

### Acceptance Criteria
- [ ] {Specific testable criterion 1}
- [ ] {Specific testable criterion 2}
- [ ] {Additional criteria as needed}

### Implementation Notes
- {Technical guidance or considerations}
- {References to related code or patterns}

### Dependencies
- {Task dependencies, if any}
- {Required setup or prerequisite tasks}

### Test Coverage Target
- {Percentage or specific coverage goals}
- {Key scenarios that must be covered}
```

## Test Pyramid Alignment

The skill ensures tasks align with the test pyramid:
- **70% Unit Tests**: Testing individual components and logic in isolation
- **20% Integration Tests**: Testing interactions between components
- **10% E2E Tests**: Already covered by test case documentation

## Examples

### Example 1: Unit Test Task for Validator
```markdown
## Task 12: Unit Tests - CubeValidator

**Type:** Unit Test
**Priority:** High
**Estimated Effort:** Medium

### Description
Implement comprehensive unit tests for the `CubeValidator` class to verify all validation logic works correctly in isolation.

### Acceptance Criteria
- [ ] Test color count validation (exactly 9 of each color)
- [ ] Test corner piece validation (invalid color combinations)
- [ ] Test edge piece validation (opposite colors, duplicates)
- [ ] Test incomplete state detection
- [ ] Test error message generation
- [ ] Achieve 90%+ code coverage for CubeValidator

### Implementation Notes
- Use Vitest framework as configured in project
- Mock dependencies to test validator in isolation
- Test both valid and invalid cube states
- Verify error codes match ValidationErrorCode enum

### Dependencies
- Task 1: Implement CubeValidator (must be complete)
- Vitest configuration and setup

### Test Coverage Target
- 90%+ code coverage
- All validation paths covered
- All error codes tested
```

### Example 2: Integration Test Task
```markdown
## Task 15: Integration Tests - Configuration to Assembly Flow

**Type:** Integration Test
**Priority:** High
**Estimated Effort:** Medium

### Description
Implement integration tests that verify the complete flow from configuration completion to solution calculation, ensuring state is properly passed between features.

### Acceptance Criteria
- [ ] Test successful configuration triggers solution calculation
- [ ] Test cube state is correctly passed to Assembly feature
- [ ] Test validation errors prevent solution calculation
- [ ] Test observer pattern notifications work correctly
- [ ] Test error handling across feature boundary
- [ ] Verify state cleanup on feature transition

### Implementation Notes
- Test the actual integration point in main.ts
- Use happy-dom for DOM simulation
- Test both success and error scenarios
- Verify no memory leaks in state management

### Dependencies
- Task 1: Configuration feature complete
- Task 8: Assembly feature complete
- Both features must be implemented

### Test Coverage Target
- All integration points tested
- Success and error paths covered
- State management verified
```

## How to Use This Skill

### Step 1: Invoke the Skill
Simply run the skill, and it will automatically:
1. Find all `specs/*/tasks.md` files
2. Analyze existing tasks
3. Identify missing test tasks
4. Generate and append new tasks

### Step 2: Review Generated Tasks
After the skill runs, review the newly added tasks:
- Verify task descriptions are accurate
- Adjust priorities if needed
- Refine acceptance criteria for your specific context

### Step 3: Use in Development Workflow
Integrate the generated test tasks into your development process:
1. Implement features according to existing tasks
2. Implement tests according to new test tasks
3. Track progress using the task checkboxes
4. Update tasks as implementation reveals new requirements

## Quality Assurance Integration

This skill integrates with other QA skills in the project:

- **test-coverage-verification**: Use after implementing tests to verify coverage
- **requirements-test-coverage**: Ensures requirements have test cases documented
- **test-documentation-creation**: Creates test case documentation from requirements

Together, these skills provide comprehensive test planning and verification.

## Output Format

The skill outputs:
1. **Summary Report**: Overview of tasks analyzed and added
2. **Updated Files**: Modified `tasks.md` files with new test tasks appended
3. **Coverage Analysis**: Breakdown of test coverage by feature

Example output:
```
Test Task Generation Summary
============================

Feature 1 (Cube Configuration):
  ✓ Existing tasks: 11
  ✓ Added unit test tasks: 3
  ✓ Added integration test tasks: 1
  ✓ Total tasks: 15

Feature 2 (Assembly Mechanism):
  ✓ Existing tasks: 8
  ✓ Added unit test tasks: 4
  ✓ Added integration test tasks: 2
  ✓ Total tasks: 14

Feature 3 (Assembly Visualization):
  ✓ Existing tasks: 10
  ✓ Added unit test tasks: 2
  ✓ Added integration test tasks: 1
  ✓ Total tasks: 13

Overall Test Coverage Plan:
  - Unit test tasks: 9 (target 70% of effort)
  - Integration test tasks: 4 (target 20% of effort)
  - E2E tests: Covered by test case documentation
```

## Best Practices

1. **Run Early**: Generate test tasks during planning phase, not after implementation
2. **Review Thoroughly**: AI-generated tasks may need refinement for your specific codebase
3. **Maintain Consistency**: Ensure generated tasks match your team's style and detail level
4. **Update Regularly**: Re-run the skill when requirements change or new features are added
5. **Link to Test Cases**: Reference test case documentation (test-cases.md) in test tasks

## Limitations

- Cannot determine exact implementation details without seeing the code
- May generate duplicate tasks if existing tasks are ambiguously named
- Requires manual review to ensure tasks align with actual architecture
- Does not execute tests or verify coverage, only plans test tasks

## Next Steps After Running

1. Review and refine generated test tasks
2. Prioritize test tasks alongside feature tasks
3. Implement tests as part of feature development (not after)
4. Use test-coverage-verification skill to validate implementation
5. Update CLAUDE.md if test strategy changes

---

**Last Updated**: 2026-01-16
**Related Skills**: test-coverage-verification, requirements-test-coverage, test-documentation-creation
**Related Documentation**: CLAUDE.md (Testing Standards section)
