# Rubik's Cube Solver - Development Standards

## Project Overview

A client-side web application that allows users to configure their Rubik's Cube state and receive step-by-step solving instructions with elegant visualization.

**Tech Stack:**
- TypeScript + Vite (build tool)
- Tailwind CSS (styling)
- Three.js (3D visualization)
- Cubejs (Rubik's Cube solving library)

## Current Implementation Status

### ✅ Fully Implemented
- Feature-based architecture with 3 features (Configuration, Assembly, Visualization)
- TypeScript strict mode with full type safety
- Observer pattern state management (`ObservableState` class)
- Component lifecycle patterns with `destroy()` methods
- Tailwind CSS styling with custom theme
- Error handling with custom error classes
- Test case documentation (92 test cases across all features)

### ⚠️ Partially Implemented
- **Test Automation Attributes**: `data-testid` attributes are documented in test cases but not yet implemented in code. Components currently use `dataset.face`, `dataset.position`, `dataset.color` for data attributes.
- **Unit Tests**: Vitest framework is configured but no unit tests have been written yet.
- **State Persistence**: No localStorage/sessionStorage implementation for saving configuration state.

### ❌ Not Yet Implemented
- Automated test execution (test cases documented, implementation pending)
- Performance monitoring and metrics collection
- Comprehensive error logging system

### 📊 Test Coverage Status
- **Feature 1 (Configuration)**: 28 test cases documented
- **Feature 2 (Assembly)**: 26 test cases documented
- **Feature 3 (Visualization)**: 38 test cases documented
- **Total**: 92 test cases documented, implementation coverage TBD

## Architecture

### Feature-Based Organization

The project follows a **feature-based architecture** where each major feature is self-contained:

```
src/client/features/
├── configuration/     # Feature 1: Cube state input
├── assembly/          # Feature 2: Solution calculation
└── visualization/     # Feature 3: Solution display
```

### Feature Structure Pattern

Each feature follows this consistent structure:

```
feature-name/
├── components/        # UI components
├── logic/            # Business logic and state management
├── types/            # TypeScript types and interfaces
├── utils/            # Utility functions (optional)
├── constants.ts      # Feature-specific constants
└── index.ts          # Public API exports
```

**Key Principle:** Each feature exports only its public API through `index.ts`. Internal implementation details remain private.

## Code Conventions

### TypeScript Standards

**Strict Mode Enabled:**
- All TypeScript strict checks are enabled
- No unused locals or parameters allowed
- No fallthrough cases in switch statements

**Type Definitions:**
- All types and interfaces defined in dedicated `types/` directories
- Use descriptive names: `CubeState`, `Solution`, `ValidationResult`
- Prefer interfaces for object shapes, types for unions/primitives
- Export types explicitly through `types/index.ts`

**Example:**
```typescript
// types/cube.types.ts
export interface CubeState {
  faces: Record<FaceName, FaceColors>;
  isComplete: boolean;
  isValid: boolean;
}

// types/index.ts
export type { CubeState, FaceName, FaceColors } from './cube.types';
export type { CubeError } from './errors';
```

### Naming Conventions

**Files:**
- Components: `PascalCase.ts` (e.g., `ColorPalette.ts`, `CubeDisplay.ts`)
- Logic/Utils: `PascalCase.ts` for classes (e.g., `CubeValidator.ts`)
- Types: `kebab-case.ts` (e.g., `cube.types.ts`, `assembly.types.ts`)
- Constants: `constants.ts` (lowercase)

**Code:**
- Classes: `PascalCase` (e.g., `CubeConfigurationContainer`)
- Functions/Methods: `camelCase` (e.g., `calculateSolution`, `validateState`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `CUBE_SIZE`, `DEFAULT_COLORS`)
- Types/Interfaces: `PascalCase` (e.g., `Solution`, `MoveIncrement`)

### Component Pattern

All UI components follow the **vanilla TypeScript class pattern** with lifecycle methods:

```typescript
export class ComponentName {
  private element: HTMLElement;
  private props: ComponentProps;

  constructor(props: ComponentProps) {
    this.props = props;
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'component-class';
    // TODO: Add data-testid attribute (see data-testid Standards section)
    // element.setAttribute('data-testid', 'component-name');
    
    // Event listeners attached directly in createElement or via addEventListener
    element.addEventListener('click', this.handleClick.bind(this));
    
    return element;
  }

  public update(props: Partial<ComponentProps>): void {
    this.props = { ...this.props, ...props };
    // Update DOM based on new props
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    // Remove event listeners
    this.element.removeEventListener('click', this.handleClick.bind(this));
    // Remove from DOM
    this.element.remove();
  }
}
```

**Important:**
- Use `createElement()` method (not `createContainer()`)
- Always provide a `destroy()` method for cleanup
- Always provide a `getElement()` method to access the DOM element
- Provide an `update()` method for dynamic prop updates
- Keep state private, expose only necessary public methods
- Event listeners are typically attached in `createElement()` or via direct `addEventListener` calls

### Logic Layer Pattern

Business logic classes follow the **single responsibility principle**:

```typescript
export class LogicClassName {
  private dependency: DependencyType;

  constructor(dependency: DependencyType) {
    this.dependency = dependency;
  }

  public primaryMethod(input: InputType): OutputType {
    // Implementation
    return result;
  }

  private helperMethod(): void {
    // Internal helper
  }
}
```

**Key Rules:**
- One class = one responsibility
- Dependencies injected via constructor
- Public methods for external API, private for internal logic
- No direct DOM manipulation in logic layer

## Styling Standards

### Tailwind CSS

**Utility-First Approach:**
- Use Tailwind utilities for all styling
- Avoid custom CSS unless absolutely necessary
- Leverage Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`)

**Custom Theme Extensions:**
```javascript
// tailwind.config.js - Custom cube colors
colors: {
  cube: {
    white: '#FFFFFF',
    yellow: '#FFD500',
    green: '#009B48',
    blue: '#0046AD',
    orange: '#FF5800',
    red: '#B71234',
  },
}
```

**Animation Standards:**
- Use predefined animations: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-in-right`
- Custom animations defined in Tailwind config
- Keep animations subtle and professional (0.2s - 0.5s duration)

**Shadow System:**
- `shadow-elegant`: Subtle shadow for cards
- `shadow-elegant-lg`: Medium shadow for elevated elements
- `shadow-elegant-xl`: Strong shadow for modals/notifications

### Design Principles

1. **Professional & Elegant**: Clean, modern interface with subtle animations
2. **Accessibility First**: High contrast, keyboard navigation, ARIA labels
3. **Responsive Design**: Mobile-first approach using Tailwind breakpoints
4. **Consistent Spacing**: Use Tailwind's spacing scale (4, 6, 8, 12, 16, etc.)

## Dependencies

### Production Dependencies

**cubejs** (`^1.3.2`)
- Purpose: Rubik's Cube solving algorithms (Kociemba algorithm)
- Usage: Core solving logic in `assembly` feature
- Key APIs: `Cube.fromString()`, `cube.solve()`, `cube.move()`

**three** (`^0.182.0`)
- Purpose: 3D visualization and rendering
- Usage: 3D cube display in `configuration` and `visualization` features
- Key APIs: `Scene`, `PerspectiveCamera`, `WebGLRenderer`, `BoxGeometry`

### Development Dependencies

**TypeScript** (`^5.3.3`)
- Strict mode enabled
- ES2020 target
- Bundler module resolution

**Vite** (`^5.0.11`)
- Build tool and dev server
- Fast HMR (Hot Module Replacement)
- Commands: `npm run dev`, `npm run build`, `npm run preview`

**Tailwind CSS** (`^3.4.19`)
- Utility-first CSS framework
- PostCSS + Autoprefixer for processing
- Custom theme configuration

**Vitest** (`^4.0.16`)
- Testing framework (not yet implemented)
- Fast unit tests with happy-dom
- UI available via `@vitest/ui`

**@testing-library/dom** (`^10.4.1`)
- DOM testing utilities
- Query elements by test IDs and accessibility roles

## Testing Standards

### Test Documentation Structure

All features must have comprehensive test documentation in `specs/{feature-name}/test-cases.md`.

**Current Test Case Count:**
- Feature 1 (Configuration): 28 test cases
- Feature 2 (Assembly): 26 test cases  
- Feature 3 (Visualization): 38 test cases
- **Total: 92 test cases documented**

**Test Case Format:**
```markdown
### TC_FEATURE_001
**Type:** `E2E` or `API`
**Priority:** `High`, `Medium`, or `Low`
**Name:** Descriptive test name
**Pre-conditions:**
- Condition 1
- Condition 2
**Steps:**
1. Step with (data-testid: `element-id`)
2. Next step
**Expected Result (AR):**
Expected outcomes
**Notes:** (Optional)
Additional context
**Requirements:**
[FR-X.X: Requirement Name](requirements.md#FR-X.X)
```

**Coverage Matrix:**
Each `test-cases.md` file includes a coverage matrix mapping requirements to test cases for traceability.

### Test Pyramid

- **70% Unit Tests**: Logic layer, validators, calculators
- **20% Integration Tests**: Feature interactions, state management
- **10% E2E Tests**: Complete user flows

### data-testid Standards

**⚠️ Implementation Status:** Required but not yet implemented

All test cases expect `data-testid` attributes, but current components use:
- `dataset.face`, `dataset.position`, `dataset.color` for data attributes
- No `data-testid` attributes present in current implementation

**Action Required:** Add `data-testid` attributes to all interactive elements to enable test automation. See `specs/{feature-name}/test-cases.md` for expected IDs.

**Naming Convention:** `{component}-{element}-{index?}`

Examples:
- `facelet-F-0` - Front face, facelet 0
- `color-palette-white` - White color in palette
- `navigation-next` - Next button
- `validation-button` - Validate button
- `step-1-move` - Move display for step 1
- `btn-next-face` - Next face button
- `btn-validate` - Validate configuration button

**Rules:**
- Always add `data-testid` to interactive elements
- Use semantic, descriptive IDs
- Include context (which face, which step, etc.)
- Match the IDs specified in test cases exactly

**Implementation Example:**
```typescript
// In component createElement() method:
element.setAttribute('data-testid', 'facelet-F-0'); // For facelets
button.setAttribute('data-testid', 'btn-next-face'); // For buttons
```

## Error Handling

### Custom Error Classes

Each feature defines its own error types:

**Configuration Feature:**
```typescript
// types/errors.ts
export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  severity: 'error' | 'warning';
  affectedFacelets?: FaceletIdentifier[];
}

export enum ValidationErrorCode {
  INCOMPLETE_CONFIGURATION = 'INCOMPLETE_CONFIGURATION',
  COLOR_OVERUSE = 'COLOR_OVERUSE',
  COLOR_UNDERUSE = 'COLOR_UNDERUSE',
  DUPLICATE_COLORS_PIECE = 'DUPLICATE_COLORS_PIECE',
  OPPOSITE_COLORS_CORNER = 'OPPOSITE_COLORS_CORNER',
  OPPOSITE_COLORS_EDGE = 'OPPOSITE_COLORS_EDGE',
  INVALID_CORNER = 'INVALID_CORNER',
  INVALID_EDGE = 'INVALID_EDGE',
}
```

**Assembly Feature:**
```typescript
// types/errors.ts
export class AssemblyError extends Error {
  constructor(
    public code: AssemblyErrorCode,
    message?: string,
    public details?: unknown
  ) {
    super(message || ASSEMBLY_ERROR_MESSAGES[code]);
    this.name = 'AssemblyError';
  }
}

export enum AssemblyErrorCode {
  INVALID_CUBE_STATE = 'INVALID_CUBE_STATE',
  INCOMPLETE_CUBE_STATE = 'INCOMPLETE_CUBE_STATE',
  UNSOLVABLE_CUBE = 'UNSOLVABLE_CUBE',
  CALCULATION_TIMEOUT = 'CALCULATION_TIMEOUT',
  ALGORITHM_ERROR = 'ALGORITHM_ERROR',
  MAX_MOVES_EXCEEDED = 'MAX_MOVES_EXCEEDED',
  ALREADY_SOLVED = 'ALREADY_SOLVED',
}
```

**Visualization Feature:**
- Error types TBD (feature in development)

### Error Boundaries

- Validate all external inputs at feature boundaries
- Never let errors propagate beyond feature scope
- Provide user-friendly error messages via notifications

## State Management

### Observer Pattern

State changes are managed using the **Observer pattern** with the `ObservableState` base class:

```typescript
// logic/StateObserver.ts
export type StateObserverCallback = (
  state: Readonly<CubeState>,
  progress: Readonly<ConfigurationProgress>
) => void;

export class ObservableState {
  private observers: Map<string, StateObserverCallback> = new Map();
  private observerIdCounter = 0;

  public subscribe(callback: StateObserverCallback): () => void {
    const id = `observer_${this.observerIdCounter++}`;
    this.observers.set(id, callback);
    
    // Return unsubscribe function
    return () => {
      this.observers.delete(id);
    };
  }

  public unsubscribeAll(): void {
    this.observers.clear();
  }

  protected notifyObservers(
    state: Readonly<CubeState>,
    progress: Readonly<ConfigurationProgress>
  ): void {
    this.observers.forEach((callback) => {
      try {
        callback(state, progress);
      } catch (error) {
        console.error('Error in state observer:', error);
      }
    });
  }
}

// Usage in state manager:
export class ConfigurationStateManager extends ObservableState {
  private cubeState: CubeState;
  
  // When state changes:
  this.notifyObservers(this.getCubeState(), this.getProgress());
}
```

**Key Differences from Generic Pattern:**
- Uses `Map<string, callback>` instead of `Set<observer>` for better tracking
- Provides `unsubscribeAll()` method for cleanup
- Includes error handling in `notifyObservers()`
- State managers extend `ObservableState` base class

**Usage:**
- Configuration state → Assembly calculation
- Solution state → Visualization display
- Unsubscribe in `destroy()` methods to prevent memory leaks
- Use `unsubscribeAll()` when destroying components

## Integration Points

### Feature 1 → Feature 2: Configuration to Assembly

```typescript
// main.ts
const configContainer = new CubeConfigurationContainer(parent, {
  onComplete: async (state: CubeState, validation: ValidationResult) => {
    const solution = await solutionCalculator.calculateSolution(state);
    displayVisualization(solution);
  }
});
```

### Feature 2 → Feature 3: Assembly to Visualization

```typescript
// main.ts
function displayVisualization(solution: Solution): void {
  const visualizationController = new VisualizationController(
    container,
    {
      solution,
      onRestart: () => { /* restart visualization */ },
      onNewCube: () => { location.reload(); }
    }
  );
}
```

## Build & Development

### Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
npm test         # Run tests (not yet implemented)
```

### Module System

- **Type:** ESM (ES Modules)
- **Import Style:** Named exports preferred
- **Path Aliases:** `@/*` maps to `src/*`

Example:
```typescript
import { CubeConfigurationContainer } from '@/client/features/configuration';
import type { CubeState } from '@/client/features/configuration';
```

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order must follow visual flow
- Provide keyboard shortcuts for common actions
- Show focus indicators (never `outline: none` without replacement)

### ARIA Labels

```typescript
element.setAttribute('role', 'button');
element.setAttribute('aria-label', 'Descriptive label');
element.setAttribute('aria-pressed', 'false'); // for toggles
element.setAttribute('aria-describedby', 'description-id'); // for help text
```

### Color Contrast

- Minimum 4.5:1 contrast ratio for text
- Do not rely on color alone for information
- Provide text labels alongside color indicators

## Performance Standards

### Bundle Size

- Keep initial bundle < 200KB (gzipped)
- Lazy load heavy features (Three.js) when needed
- Tree-shake unused Tailwind utilities

### Animations

- Use CSS transforms/opacity for animations (GPU accelerated)
- Avoid layout thrashing (batch DOM reads/writes)
- RequestAnimationFrame for smooth 60fps animations

### Memory Management

- Always call `destroy()` on components when unmounting
- Remove event listeners in cleanup
- Cancel pending async operations on component destroy

## Git Workflow

### Commit Message Format

```
<type>: <description>

[optional body]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test additions/changes
- `chore`: Build/tooling changes

### Branch Strategy

- `main`: Production-ready code
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

## Security Considerations

1. **Client-Side Only**: No backend, no sensitive data exposure
2. **Input Validation**: Validate all user input at feature boundaries
3. **XSS Prevention**: Use `textContent` for user data, not `innerHTML`
4. **Dependencies**: Regular security audits with `npm audit`

## Documentation Requirements

### Code Comments

- **JSDoc for public APIs**: Document all exported classes/functions
- **Inline comments**: Explain "why", not "what"
- **Type annotations**: TypeScript types serve as documentation

Example:
```typescript
/**
 * Calculates the optimal solution for a given cube state.
 *
 * @param state - The current configuration of the cube
 * @returns A Solution object containing move sequence and metadata
 * @throws {AssemblyError} If the cube state is unsolvable
 */
public async calculateSolution(state: CubeState): Promise<Solution> {
  // Implementation
}
```

### README Structure

Each feature should document:
1. Purpose and responsibilities
2. Public API with examples
3. Dependencies and integration points
4. Test coverage summary

## Quality Gates

Before merging to main:

- ✅ All TypeScript strict checks pass
- ✅ Build completes without errors
- ✅ Test documentation exists and is complete (92 test cases documented)
- ✅ No console errors in browser
- ✅ Keyboard navigation works
- ✅ Responsive design verified (mobile, tablet, desktop)
- ⚠️ **data-testid attributes**: Required but not yet implemented (see data-testid Standards section)

### Test Coverage Verification

Use the available skills to verify coverage:
- **`.claude/skills/test-coverage-verification`**: Verify implementation matches test cases
- **`.claude/skills/requirements-test-coverage`**: Verify all requirements have test cases
- **`.claude/skills/test-documentation-creation`**: Create test cases from requirements

## Available Skills

This project includes Claude skills in `.claude/skills/` for quality assurance:

### Quality Assurance Skills
- **`test-coverage-verification`**: Verify that code implementation matches test case requirements, including `data-testid` attributes
- **`requirements-test-coverage`**: Verify that all requirements have corresponding test cases
- **`test-documentation-creation`**: Create comprehensive test cases from requirements and code
- **`test-task-generator`**: Analyze tasks.md files and generate missing unit and integration test tasks

### Development Skills
- **`task-breakdown`**: Convert technical designs into actionable, sequenced implementation tasks
- **`quality-assurance`**: Comprehensive testing and validation strategies
- **`requirements-engineering`**: Transform vague feature ideas into clear, testable requirements

**Usage:** Reference these skills when working on related tasks. They provide structured workflows and best practices.

## Resources

- **Rubik's Cube Notation**: Standard notation (U, D, L, R, F, B + modifiers ', 2)
- **Kociemba Algorithm**: Optimal solving algorithm used by Cubejs
- **Three.js Docs**: https://threejs.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## Quick Reference

### Key Files
- **CLAUDE.md** (this file): Development standards and conventions
- **specs/**: Requirements, design, tasks, and test cases for each feature
- **.claude/skills/**: Claude skills for quality assurance and development workflows
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **tailwind.config.js**: Tailwind CSS theme configuration

### Common Commands
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests (when implemented)
```

### Getting Help
- Check feature-specific README files in `src/client/features/{feature}/README.md`
- Review test cases in `specs/{feature-name}/test-cases.md` for expected behavior
- Use skills in `.claude/skills/` for structured workflows
- See requirements in `specs/{feature-name}/requirements.md` for feature specifications

---

*Last Updated: 2026-01-16*
*Project Version: 1.0.0*
*Test Cases: 92 documented (28 + 26 + 38)*