# Rubik's Cube Solver App

A web application for solving Rubik's cubes using computer vision, WebGL rendering, and algorithmic solving.

## Tech Stack

- **Frontend**: TypeScript/JavaScript
- **Backend**: Node.js with Express
- **Computer Vision**: OpenCV.js (WASM)
- **Camera Access**: Browser Media APIs
- **Graphics**: WebGL (via Web Components)
- **Cube Logic**: Kociemba algorithm
- **Data Exchange**: JSON over HTTP
- **Build System**: Vite
- **Performance**: WebAssembly, Web Workers

## Project Structure

```
rubiks-cube-app/
├── src/
│   ├── server/          # Node.js Express server
│   │   └── index.js
│   ├── main.ts          # Frontend entry point
│   └── index.html       # Main HTML file
├── dist/                # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
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

The server will start on `http://localhost:3000` and Vite dev server on `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm start
```

## Development

- Frontend code goes in `src/`
- Server code goes in `src/server/`
- Static assets can be placed in `src/assets/`

## Future Features

- [ ] OpenCV.js integration for cube face detection
- [ ] WebGL cube rendering
- [ ] Kociemba solver implementation
- [ ] Camera access for scanning cube
- [ ] Web Workers for performance optimization
- [ ] WebAssembly modules for heavy computations

## License

ISC
