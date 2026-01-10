# Software Architecture Document
## Rubik's Cube Solver Application

**Document Version:** 1.0
**Date:** January 10, 2026
**Status:** Draft

---

## Document Information

| Property | Value |
|----------|-------|
| Project | Rubik's Cube Solver Web Application |
| Document Type | Software Architecture Document |
| Scope | Global System Architecture |
| Intended Audience | Software Architects, Developers, Technical Stakeholders |
| Related Documents | PRD, Feature Requirements (F-001, F-002, F-003) |

---

## Table of Contents

1. Introduction
2. Architectural Drivers
3. System Decomposition
4. Architecture Decisions (ADRs)
5. Architectural Patterns
6. Data Architecture
7. Quality Attributes
8. Constraints and Assumptions
9. Appendices

---

## 1. Introduction

### 1.1 Purpose

This document defines the software architecture for the Rubik's Cube Solver application, providing technical foundation and architectural decisions for feature-level design and implementation.

### 1.2 Scope

**Included:**
- System-wide architectural decisions (ADRs)
- Technology constraints and rationale
- Cross-cutting architectural patterns
- Performance and quality strategies
- Deployment model

**Excluded:**
- Feature-specific implementations (see feature design docs)
- API specifications
- UI designs
- Detailed algorithms

### 1.3 System Overview

Web-based application helping users solve Rubik's cubes through:
1. Visual cube state configuration
2. Solution calculation
3. Step-by-step 3D animated visualization

**Key Characteristics:** Pure frontend, browser-based, 3D visualization, offline-capable

---

## 2. Architectural Drivers

### 2.1 Business Drivers

| ID | Driver | Architecture Impact |
|----|--------|---------------------|
| BD-1 | Zero infrastructure cost | Static hosting, no backend (ADR-001, ADR-004) |
| BD-2 | Universal accessibility | Web-based, cross-platform |
| BD-3 | Smooth user experience | Client-side processing, 60fps rendering (QA-002, QA-003) |
| BD-4 | Rapid time-to-market | Leverage existing libraries (ADR-002, ADR-003) |

### 2.2 Quality Attribute Requirements

| ID | Quality Attribute | Requirement | Source |
|----|-------------------|-------------|--------|
| QA-001 | Performance | Solution calculation ≤5s (≤2s typical) | F-002 NFR-1.1, NFR-1.2 |
| QA-002 | Performance | Animation rendering 60fps (min 30fps) | F-003 NFR-1.1 |
| QA-003 | Performance | Animation start ≤100ms | F-003 NFR-3.1 |
| QA-004 | Performance | Step transitions ≤2s at normal speed | F-003 NFR-3.2 |
| QA-005 | Performance | Validation ≤500ms | F-001 NFR-3.1 |
| QA-006 | Performance | UI rendering 60fps during interactions | F-001 NFR-3.2 |
| QA-007 | Performance | Non-blocking async calculation | F-002 NFR-1.3 |
| QA-008 | Performance | No degradation up to 100 moves | F-003 NFR-3.3 |
| QA-009 | Usability | Configuration ≤5 minutes | F-001 NFR-1.3 |
| QA-010 | Usability | Visual feedback ≤100ms | F-001 NFR-1.2 |
| QA-011 | Reliability | Graceful error handling | F-002 NFR-3.1 |
| QA-012 | Maintainability | Modular, testable features | Architecture principle |

### 2.3 Technical Constraints

| ID | Constraint | Impact |
|----|------------|--------|
| TC-001 | No backend | Limits server-side features (ADR-001) |
| TC-002 | Browser environment only | Limited to browser APIs |
| TC-003 | Static hosting required | No SSR, APIs, or databases (ADR-004) |
| TC-004 | 3x3x3 cube only | No variable cube sizes |
| TC-005 | Zero infrastructure budget | Free tier limits (ADR-004) |

---

## 3. System Decomposition

### 3.1 Architectural Layers

**Layer 1: Feature Modules** (Independent, user-facing capabilities)
- F-001: Cube Configuration
- F-002: Assembly Mechanism (Solver)
- F-003: Assembly Visualization

**Layer 2: Shared Infrastructure** (Reusable cross-cutting components)
- Cube state data model
- Validation engine
- Web Worker utilities
- Persistence layer
- 3D rendering infrastructure

**Principles:**
- Independence: Features developed/tested separately
- Isolation: No direct inter-feature state access
- Communication: Application-level state or events only

### 3.2 Feature Modules

| Feature | Responsibility | Key Dependencies |
|---------|----------------|------------------|
| F-001 | Accept user input for cube state | Data model, validation |
| F-002 | Calculate solution from cube state | Data model, cube-solver, Web Workers |
| F-003 | Display and animate solution | Data model, Three.js, state management |

### 3.3 Shared Infrastructure

| Component | Used By | Purpose |
|-----------|---------|---------|
| Cube State Data Model | All features | Canonical cube representation (Section 6.1) |
| Validation Engine | F-001, F-002 | Validation rules (Section 6.3) |
| Web Worker Utilities | F-002 | Async computation (Section 5.3) |
| Persistence Layer | All features | localStorage abstraction (Section 6.2) |
| 3D Rendering Infrastructure | F-001, F-003 | Three.js scene setup |

---

## 4. Architecture Decisions (ADRs)

### ADR-001: Pure Frontend Architecture

| Property | Value |
|----------|-------|
| Status | Accepted |
| Date | January 10, 2026 |
| Drivers | TC-001, BD-1 |
| Related QAs | QA-007 |
| Risks | R-002, R-009 |

**Decision:** Pure frontend SPA with no backend server. Deploy to static hosting.

**Context:** No requirements demand server-side processing. All features executable client-side.

**Alternatives Rejected:**
- Backend API: Network latency defeats QA-001; infrastructure cost violates BD-1
- Hybrid: Unnecessary complexity without clear requirement

**Consequences:**
- ✓ Zero infrastructure cost (BD-1)
- ✓ Offline-capable
- ✓ Simple deployment
- ✗ Cannot add server-side features without architecture change (R-002)
- ✗ Algorithm updates require redeployment (R-009)

---

### ADR-002: Three.js for 3D Rendering

| Property | Value |
|----------|-------|
| Status | Accepted |
| Date | January 10, 2026 |
| Drivers | QA-002, BD-3 |
| Impact | ~600KB bundle size |
| Risks | R-003, R-004 |

**Decision:** Use Three.js library for 3D visualization via WebGL.

**Evaluation:**

| Library | Bundle | Features | Meets QA-002? | Decision |
|---------|--------|----------|---------------|----------|
| Three.js | ~600KB | WebGL, lighting, shadows | ✓ Yes | Selected |
| Babylon.js | 1-2MB | Full game engine | ✓ Yes | Rejected (overkill) |
| CSS 3D | ~0KB | Basic transforms | ✗ No lighting | Rejected |
| Zdog | ~50KB | Minimalist 3D | ✗ No lighting | Rejected |

**Rationale:** Only Three.js meets F-003 NFR-1.4 (lighting/shadows) within reasonable bundle size.

**Consequences:**
- ✓ Meets QA-002 (60fps via WebGL)
- ✓ Professional UX with lighting/shadows
- ✗ ~600KB bundle addition (R-004)
- ✗ Requires WebGL; no fallback (R-003, BC-001)

---

### ADR-003: cube-solver Library

| Property | Value |
|----------|-------|
| Status | Accepted |
| Date | January 10, 2026 |
| Drivers | QA-001, BD-4 |
| Impact | ~50KB bundle, 2s initialization |
| Risks | R-001 |

**Decision:** Use cube-solver npm package for solving algorithm.

**Evaluation:**

| Library | Algorithm | Solve | Init | Maintenance | Decision |
|---------|-----------|-------|------|-------------|----------|
| cube-solver | Kociemba | ~100ms | ~2s | Active | Selected |
| cubejs | Kociemba | ~150ms | 4-5s | Inactive (7yrs) | Rejected |
| Custom | TBD | Unknown | N/A | Internal | Rejected |

**Performance:**
- One-time initialization: ~2s (first solve only)
- Subsequent solves: ~100ms average
- Total first solve: ~2.1s (meets QA-001)

**Rationale:** Proven implementation meeting QA-001 with significantly lower development cost than custom.

**Consequences:**
- ✓ Meets QA-001 performance targets
- ✓ Low development cost (BD-4)
- ✗ External dependency risk (R-001)
- ✗ 2s initialization requires async loading (see Section 5.3)

---

### ADR-004: GitHub Pages Deployment

| Property | Value |
|----------|-------|
| Status | Accepted |
| Date | January 10, 2026 |
| Drivers | TC-001, TC-003, BD-1 |
| Risks | R-005 |

**Decision:** Deploy to GitHub Pages with GitHub Actions CI/CD.

**Evaluation:**

| Platform | Cost | HTTPS | CDN | CI/CD | Decision |
|----------|------|-------|-----|-------|----------|
| GitHub Pages | Free | ✓ | ✓ | ✓ | Selected |
| Vercel | Free tier | ✓ | ✓ | ✓ | Rejected (external dep) |
| AWS S3 | $5-10/mo | ✓ | ✓ | Manual | Rejected (cost) |

**Consequences:**
- ✓ Zero cost (BD-1)
- ✓ Automatic HTTPS and CDN
- ✗ Tied to GitHub ecosystem (R-005)
- ✗ Static content only (acceptable per ADR-001)

---

### 4.1 Implementation Technology Recommendations

**Not architecturally significant.** Teams may select based on expertise:

| Category | Recommended Characteristics | Flexibility |
|----------|----------------------------|-------------|
| Build Tool | Fast HMR, ESM, TypeScript support | High - any modern bundler |
| Language | Static typing, IDE support | Medium - prefer type safety |
| Testing | Fast, build tool compatible | High - any framework |
| Frontend Framework | Component-based, reactive | High - architecture-agnostic |

**Compatibility:** Ensure compatibility with ADR-002 (Three.js) and ADR-003 (cube-solver).

---

## 5. Architectural Patterns

### 5.1 Modular Feature Design

**Pattern:** Independent feature modules with shared infrastructure layer.

**Rules:**
- Features use shared data models for interoperability
- Features communicate via application state or events
- No direct dependencies between feature modules

**Benefits:** Parallel development, isolated testing, reduced duplication

---

### 5.2 State Management

**Required Capabilities:**

| ID | Capability | Source |
|----|------------|--------|
| SM-001 | Step navigation (forward/backward) | F-003 FR-3.1, FR-3.2 |
| SM-002 | localStorage persistence | See Section 6.2 |
| SM-003 | Feature isolation | Architecture principle |
| SM-004 | Async operation support | QA-007 |

**Recommended Pattern:**
- Unidirectional data flow
- State separation by domain (configuration, solution, visualization, preferences)
- Event-based feature communication

**Implementation:** Left to developers (libraries, framework solutions, custom patterns).

**Selection Criteria:** Bundle size, tooling, team familiarity, framework compatibility

---

### 5.3 Asynchronous Processing

**Pattern:** Web Workers for CPU-intensive tasks

**Context:**
- Solver initialization: ~2s (ADR-003)
- Solution calculation: up to 5s worst case (QA-001)
- UI must remain responsive (QA-007)

**Requirements:**
- Solver runs in dedicated Web Worker
- Initialize on application startup
- Handle initialization errors gracefully
- Provide loading indicators

**Trade-offs:**
- ✓ Non-blocking UI (QA-007)
- ✓ Multi-core CPU utilization
- ✗ Worker communication complexity
- ✗ Data serialization overhead

---

### 5.4 Error Handling

**Architecture Requirements:**
- Errors must not crash application
- User errors must be actionable
- System maintains valid state on error

**Strategy:**

| Environment | Logging | User Display |
|-------------|---------|--------------|
| Development | Console with stack traces | Detailed messages |
| Production | Minimal console | User-friendly messages |

**Error Categories:**

| Category | Response |
|----------|----------|
| User errors (e.g., invalid cube) | Actionable message, prevent progression |
| System errors (e.g., solver failure) | Friendly message, offer retry/reset |
| Environmental errors (e.g., no WebGL) | Feature detection, clear messaging |

**Feature Responsibility:** Features define messages, validation, and recovery strategies.

---

## 6. Data Architecture

### 6.1 Cube State Representation

**Canonical Structure:**
- 6 faces: Up (U), Down (D), Left (L), Right (R), Front (F), Back (B)
- 9 facelets per face (indexed 0-8, row-major)
- Colors: White, Yellow, Red, Orange, Blue, Green

**Face Layout:**
```
0 1 2
3 4 5
6 7 8
```

**Rationale:**
- Matches standard cube notation (UDLRFB)
- Efficient for validation algorithms
- Maps naturally to visual representation
- Transformation layer adapts to cube-solver format (ADR-003)

**Implementation:** Feature designs specify exact data structures and transformation utilities.

---

### 6.2 Persistence Architecture

**Constraints:**

| ID | Constraint | Description |
|----|------------|-------------|
| PC-001 | Storage mechanism | Browser localStorage only |
| PC-002 | Key namespacing | Prefix: `rubiks-cube-app:` |
| PC-003 | Quota management | Handle 5-10MB limits gracefully |
| PC-004 | Clear/reset | User-accessible data clearing |

**Persistence Boundaries:**

| State | Persist? | Rationale |
|-------|----------|-----------|
| Cube configuration | ✓ Yes | Resume sessions |
| Current solution step | ✓ Yes | Allow page refresh |
| User preferences | ✓ Yes | Improve return UX |
| Intermediate calculations | ✗ No | Recomputable |
| Animation state | ✗ No | Transient UI |

**Schema Versioning:**
- Include version in stored data
- Implement forward compatibility
- Provide migration or fallback to defaults
- Key format: `rubiks-cube-app:v1:cube-state`

**Feature Responsibility:** Define what to persist, implement serialization, handle versioning, handle corruption.

---

### 6.3 Validation Architecture

**Validation Layers:**

| Layer | Responsibility | Performance |
|-------|----------------|-------------|
| Structural | Data format, completeness | <50ms (real-time) |
| Business Rules | Domain constraints (e.g., 9 of each color) | <500ms (on-demand) |
| Solvability | Valid corner/edge combinations | ≤1s (batch) |

**Validation Timing:**
- Real-time: Immediate feedback (e.g., color count)
- On-demand: Expensive checks on user action
- Batch: Comprehensive validation before progression

**Validation Results:**
- Machine-readable error codes
- User-friendly messages
- Location information (specific facelets/pieces)

**Implementation:**
- Validation logic separate from UI
- Reusable functions in shared infrastructure
- Feature-specific rules in feature modules
- cube-solver integration for solvability (ADR-003)

---

### 6.4 Feature Integration Data Flow

**Workflow:** Configuration → Solver → Visualization

| Transition | Data | Validation | Owner |
|------------|------|------------|-------|
| F-001 → F-002 | Validated cube state (54 facelets) | Complete, valid, solvable | F-001 |
| F-002 → F-003 | Solution increments (moves) | Guaranteed valid solution | F-002 |
| F-003 → F-001 | Reset trigger | N/A | User |

**Data Contracts:**
- Configuration output: Cube state per Section 6.1
- Solver input: Same format
- Solver output: Array of increments (move notation, resulting cube state per move)
- Visualization input: Increment array

**Navigation:** User can return from Solver/Visualization to Configuration. State preservation left to implementation.

---

## 7. Quality Attributes

### 7.1 Performance

**Targets:** See Section 2.2 (QA-001 through QA-010)

**Bundle Size Analysis:**

| Component | Estimated Size | Source |
|-----------|---------------|--------|
| Three.js | ~600KB | ADR-002 evaluation |
| cube-solver | ~50KB | ADR-003 evaluation |
| Core + Features | TBD | Implementation-dependent |
| **Estimated total** | **~650KB + features** | Gzipped |

**Note:** No bundle size requirements in functional requirements. Sizes are architectural estimates.

**Optimization Strategies:**

| Strategy | Benefit |
|----------|---------|
| Code splitting | Faster initial load (lazy load Three.js, cube-solver) |
| Tree shaking | Smaller bundles |
| Minification | Reduced download time |
| Asset compression | Gzip/Brotli at CDN |

**Runtime Performance:**

| Operation | Strategy | Target |
|-----------|----------|--------|
| Solver initialization | Web Worker | ~2s non-blocking |
| Solution calculation | Web Worker | ≤5s non-blocking |
| 3D rendering | WebGL acceleration | 60fps |
| Animations | RequestAnimationFrame | 60fps |

**3D Rendering:**
- Single Three.js scene/renderer instance
- Shared cube geometry and materials
- Static lighting setup
- Animation frame management
- Object pooling for animations

---

### 7.2 Browser Compatibility

**Target:** Last 2 versions of Chrome, Firefox, Safari, Edge

**Required Features:**

| ID | Feature | Purpose | Fallback |
|----|---------|---------|----------|
| BC-001 | WebGL | 3D rendering (ADR-002) | Error message (critical) |
| BC-002 | Web Workers | Async computation (ADR-003) | Main thread with warning |
| BC-003 | localStorage | Persistence (Section 6.2) | Works without persistence |
| BC-004 | ES2020+ | Modern JavaScript | Transpilation via build tool |

**Feature Detection:**
- Detect on startup
- Clear error for missing BC-001 (application unusable)
- Warning for missing BC-002, BC-003

---

### 7.3 Security

**Threat Model:** Pure frontend, no backend

| Threat | Relevance | Mitigation |
|--------|-----------|------------|
| XSS | Low (no persisted UGC) | Framework escaping |
| CSRF | None | N/A |
| Data injection | Low | Input validation (F-001) |
| MITM | Medium | HTTPS (ADR-004) |
| Client tampering | Low impact | No sensitive operations |

**Practices:**
- HTTPS enforced (ADR-004)
- Dependency updates (Dependabot)
- Input validation (F-001)
- Avoid eval()

**Privacy:**
- No data collection/transmission
- No analytics (unless added)
- localStorage client-side only
- No cookies

---

### 7.4 Maintainability & Testability

**Maintainability:**
- Modular features (Section 3)
- Shared infrastructure (Section 3.3)
- Type safety recommended (Section 4.1)
- ADR documentation (Section 4)

**Testing Layers:**

| Layer | Tools | Owner |
|-------|-------|-------|
| Unit | Vitest, Jest | Developers |
| Integration | Vitest, Testing Library | Developers |
| E2E | Playwright, Cypress | QA/Developers |
| Performance | Lighthouse | CI/CD |

**Testability Requirements:**
- Features testable in isolation
- Mock external dependencies (cube-solver, Three.js)
- Deterministic behavior

---

## 8. Risk Management

### 8.1 Risk Register

| ID | Risk | Probability | Impact | Mitigation Strategy | Related |
|----|------|-------------|--------|---------------------|---------|
| R-001 | cube-solver library abandonment | Medium | High | Monitor actively; prepare custom implementation if needed | ADR-003 |
| R-002 | Architecture change needed for server-side features | Low | High | Accept risk; re-architecture required if needed | ADR-001 |
| R-003 | WebGL unavailability on user device | Low | High | Feature detection with clear error message; no fallback | BC-001 |
| R-004 | Large bundle size impacts load time | Medium | Medium | Code splitting, lazy loading, monitoring bundle size | ADR-002 |
| R-005 | GitHub Pages platform changes/deprecation | Low | Medium | Migration plan to alternative static host (Vercel, Netlify) | ADR-004 |
| R-006 | Performance degradation on low-end devices | Medium | Medium | Performance budgets (QA-001 through QA-010), testing on target devices | AS-003 |
| R-007 | localStorage quota exceeded | Low | Low | Quota management (PC-003), graceful degradation | Section 6.2 |
| R-008 | Web Worker unsupported in browser | Low | Medium | Fallback to main thread with warning; UI may block | BC-002 |
| R-009 | Algorithm updates require full redeployment | High | Low | Accept operational overhead; CI/CD automation | ADR-001 |
| R-010 | Legacy browser users unable to access | Medium | Medium | Accept; communicate browser requirements clearly | AS-001 |

**Risk Categories:**
- **Probability:** Low (<20%), Medium (20-50%), High (>50%)
- **Impact:** Low (minimal), Medium (degraded UX), High (feature unusable/major rework)

**Monitoring:**
- R-001: Quarterly dependency audit
- R-004: CI/CD bundle size checks
- R-005: Watch GitHub Pages announcements
- R-006: Performance metrics from Lighthouse audits

---

### 8.2 Constraints

**See Section 2.3** (TC-001 through TC-005)

### 8.3 Assumptions

| ID | Assumption | Related Risks |
|----|------------|---------------|
| AS-001 | Modern browser availability | R-010 |
| AS-002 | JavaScript enabled | None (accept limitation) |
| AS-003 | Adequate client hardware | R-006 |
| AS-004 | 3x3x3 cube standard | None (by design) |
| AS-005 | Internet (initial load) | None (accept limitation) |
| AS-006 | GitHub Pages availability | R-005 |

### 8.4 Non-Goals

**Explicitly out of scope:**
- Variable cube sizes (2x2, 4x4, etc.)
- Multiple simultaneous solving
- User accounts/authentication
- Social features
- Mobile native apps
- CFOP tutorials
- Timer functionality
- VR/AR visualization
- Internationalization (i18n)

---

## 9. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| ADR | Architecture Decision Record |
| Cube State | Configuration of 54 facelets |
| Facelet | Individual colored square (9 per face) |
| Kociemba | Two-phase solving algorithm (≤22 moves optimal) |
| Move Notation | Standard notation (U, D, L, R, F, B, U', U2, etc.) |
| SPA | Single-Page Application |
| WebGL | Web Graphics Library for 3D |

### Appendix B: References

| Document | Location |
|----------|----------|
| PRD | `specs/prd.md` |
| F-001 Requirements | `specs/01-cube-configuration/requirements.md` |
| F-002 Requirements | `specs/02-assembly-mechanism/requirements.md` |
| F-003 Requirements | `specs/03-assembly-visualization/requirements.md` |
| Requirements Review | `specs/Requirements Review.md` |

**External:**
- Three.js: https://threejs.org/docs/
- cube-solver: https://www.npmjs.com/package/cube-solver
- Kociemba Algorithm: http://kociemba.org/cube.htm
- GitHub Pages: https://docs.github.com/en/pages

### Appendix C: Traceability Matrix

**Quality Attributes → ADRs:**

| QA | Related ADRs |
|----|--------------|
| QA-001, QA-007 | ADR-003 |
| QA-002, QA-003, QA-006 | ADR-002 |
| All | ADR-001 (enables pure frontend) |

**Constraints → ADRs:**

| Constraint | Related ADRs |
|------------|--------------|
| TC-001, TC-003 | ADR-001 |
| TC-005 | ADR-004 |

**Business Drivers → ADRs:**

| Driver | Related ADRs |
|--------|--------------|
| BD-1 | ADR-001, ADR-004 |
| BD-3 | ADR-002 |
| BD-4 | ADR-002, ADR-003 |

### Appendix D: Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 10, 2026 | Initial SEI-formatted architecture with coding system |

---

**END OF DOCUMENT**
