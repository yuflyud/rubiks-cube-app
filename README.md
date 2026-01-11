# Rubik's Cube Solver App

A professional web application for configuring and solving Rubik's cubes with an elegant, modern interface.

## Tech Stack

- **Frontend**: TypeScript with Vanilla JS Components
- **Styling**: Tailwind CSS v3 with custom design system
- **Build System**: Vite v5
- **Testing**: Vitest with Testing Library
- **Backend**: Node.js with Express (planned)
- **Solver**: Kociemba algorithm (planned)

## Project Structure

```
rubiks-cube-app/
├── src/
│   ├── client/                    # Frontend application
│   │   ├── features/              # Feature modules
│   │   │   ├── configuration/     # ✅ Feature 1: Cube Configuration
│   │   │   │   ├── components/    # UI components
│   │   │   │   ├── logic/         # Business logic
│   │   │   │   ├── types/         # TypeScript types
│   │   │   │   ├── styles/        # Feature styles
│   │   │   │   ├── docs/          # Feature documentation
│   │   │   │   ├── constants.ts   # Constants
│   │   │   │   ├── index.ts       # Public API
│   │   │   │   └── README.md      # Feature README
│   │   │   └── assembly/          # ✅ Feature 2: Assembly Mechanism
│   │   │       ├── logic/         # Solving logic
│   │   │       ├── utils/         # Move execution
│   │   │       ├── types/         # TypeScript types
│   │   │       ├── styles/        # Feature styles
│   │   │       ├── docs/          # Feature documentation
│   │   │       ├── constants.ts   # Move constants
│   │   │       ├── index.ts       # Public API
│   │   │       └── README.md      # Feature README
│   │   ├── styles/                # Global styles
│   │   ├── assets/                # Images, icons, SVGs
│   │   └── main.ts                # Frontend entry point
│   ├── server/                    # Backend (planned)
│   └── index.html                 # Main HTML file
├── specs/                         # Project specifications
├── dist/                          # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

Visit: **http://localhost:5173/rubiks-cube-app/**

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Features

### ✅ Feature 1: Cube Configuration
**Status**: Complete and Production Ready

An elegant interface for configuring the current state of a 3x3 Rubik's Cube.

**Key Features:**
- Interactive 3D cube display
- Guided step-by-step configuration flow
- Real-time validation with error detection
- Color palette with keyboard shortcuts
- Progress tracking
- Fully accessible (WCAG AA compliant)
- Responsive design (mobile, tablet, desktop)

**Documentation**: [src/client/features/configuration/README.md](src/client/features/configuration/README.md)

### ✅ Feature 2: Assembly Mechanism
**Status**: Functional and Integrated

A computational engine that calculates solving sequences for configured cube states.

**Key Features:**
- Solution calculation from validated cube states
- Support for all 18 standard moves (U, U', U2, D, D', etc.)
- Step-by-step move sequences with descriptions
- Intermediate state tracking after each move
- Configurable timeout and move limits
- Error handling with detailed messages
- Solution verification and metadata

**Documentation**: [src/client/features/assembly/README.md](src/client/features/assembly/README.md)

**Note**: Currently uses a simplified solving algorithm. For production, replace with Kociemba's algorithm for optimal solutions.

### 🔜 Feature 3: Assembly Visualization (Planned)
3D visualization of solution steps with animations.

## Development

### Project Organization

This project follows a **modular, feature-based architecture**:

- **Features** are self-contained in `src/client/features/`
- Each feature has its own:
  - Components (`components/`)
  - Business logic (`logic/`)
  - Types (`types/`)
  - Styles (`styles/`)
  - Documentation (`docs/` and `README.md`)
  - Constants and utilities
  - Public API (`index.ts`)

### Adding a New Feature

1. Create feature folder: `src/client/features/feature-name/`
2. Add component, logic, types, and styles folders
3. Create `index.ts` to export public API
4. Add feature documentation in `README.md`
5. Place specifications in `docs/specs/`
6. Import and use in `src/client/main.ts`

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (if configured)
- **Naming**: PascalCase for classes, camelCase for functions/variables
- **Components**: Class-based vanilla TypeScript components
- **State**: Observer pattern for reactive updates

## Design System

### Colors
- Primary: Blue gradient (`from-blue-500 to-blue-600`)
- Success: Emerald gradient (`from-emerald-500 to-emerald-600`)
- Error: Rose gradient (`from-rose-500 to-rose-600`)
- Background: Soft gradient (slate-50 → white → slate-100)

### Styling Approach
- **Tailwind CSS v3** with custom configuration
- **Glassmorphism** effects (frosted glass)
- **Elegant shadows** (`shadow-elegant`, `shadow-elegant-lg`, `shadow-elegant-xl`)
- **Smooth animations** (GPU-accelerated)
- **Responsive** (mobile-first)

### Accessibility
- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Focus indicators

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Documentation

- **Project Specs**: [specs/](specs/) - Requirements, design docs, and tasks
- **Feature Docs**: Each feature has its own `README.md` and `docs/` folder
- **System Design**: [specs/System Design.md](specs/System%20Design.md)
- **PRD**: [specs/prd.md](specs/prd.md)

## Performance

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 95+
- 60fps animations

## Roadmap

### Phase 1: Configuration ✅
- [x] Cube state input interface
- [x] Validation engine
- [x] Guided flow
- [x] Elegant styling with Tailwind

### Phase 2: Assembly Mechanism ✅
- [x] Solution calculation engine
- [x] Move executor for all 18 moves
- [x] State simulator and verification
- [x] Solution builder with increments
- [x] Integration with Feature 1
- [x] Error handling and validation
- [ ] Kociemba algorithm (production enhancement)
- [ ] Web Worker implementation
- [ ] Solution caching

### Phase 3: Visualization (Future)
- [ ] 3D WebGL cube
- [ ] Animated solution playback
- [ ] Step-by-step instructions

### Phase 4: Advanced Features (Future)
- [ ] Camera cube scanning
- [ ] OpenCV.js integration
- [ ] Save/load configurations
- [ ] Dark mode

## License

ISC
