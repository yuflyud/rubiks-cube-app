# Test Task Generator Skill

Automatically analyzes `tasks.md` files and generates missing unit and integration test tasks to ensure comprehensive test coverage planning.

## Quick Start

Use this skill when:
- Planning test implementation for a feature
- Reviewing test coverage across the project
- Starting test development and need a task list
- Ensuring test pyramid balance (70% unit, 20% integration, 10% E2E)

## What It Does

1. Scans all `specs/*/tasks.md` files
2. Identifies components that need unit tests (validators, calculators, state managers)
3. Identifies integration points that need integration tests
4. Generates properly formatted tasks following existing structure
5. Appends new tasks to each `tasks.md` file
6. Provides a summary report of changes

## Usage

Simply invoke the skill:

```
Use the test-task-generator skill to analyze and update all task files
```

The agent will:
- Find and read all task files
- Analyze the codebase structure
- Generate missing test tasks
- Update files automatically
- Provide a summary report

## Output

The skill updates each `specs/{feature}/tasks.md` file by appending new test tasks and provides a report like:

```
Test Task Generation Report
===========================

Feature 1 (Cube Configuration):
  ✓ Existing tasks: 11
  ✓ Added unit test tasks: 3
  ✓ Added integration test tasks: 1
  ✓ Total tasks: 15

...

Test Coverage Plan:
  - Unit test tasks: 9 (70% target)
  - Integration test tasks: 4 (20% target)
  - E2E tests: Documented in test-cases.md (10% target)
```

## Task Format

Generated tasks follow this structure:

```markdown
## Task {N}: {Test Type} - {Component}

**Type:** Unit Test | Integration Test
**Priority:** High | Medium | Low
**Estimated Effort:** Small | Medium | Large

### Description
{Clear description}

### Acceptance Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Coverage target}

### Implementation Notes
- {Technical guidance}
- {Code references}

### Dependencies
- {Prerequisites}

### Test Coverage Target
- {Coverage goals}
```

## Integration with Other Skills

Works well with:
- **test-coverage-verification**: Validates implementation against test tasks
- **requirements-test-coverage**: Ensures requirements have test documentation
- **test-documentation-creation**: Creates test case documentation

## Best Practices

1. **Run Early**: Generate test tasks during planning, not after coding
2. **Review Generated Tasks**: AI output needs human validation
3. **Adjust Priorities**: Align with your development timeline
4. **Track Progress**: Use task checkboxes to track completion
5. **Keep Updated**: Re-run when requirements change

## Files Modified

The skill modifies:
- `specs/01-cube-configuration/tasks.md`
- `specs/02-assembly-mechanism/tasks.md`
- `specs/03-assembly-visualization/tasks.md`

Each file gets new test tasks appended, preserving all existing content.

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) - Project testing standards
- [test-cases.md](../../../specs/01-cube-configuration/test-cases.md) - Test case documentation
- See individual feature `tasks.md` files for generated tasks

---

**Version**: 1.0.0
**Last Updated**: 2026-01-16
