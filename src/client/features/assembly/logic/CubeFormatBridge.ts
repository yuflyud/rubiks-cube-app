import { Face, Color, type CubeState } from '../../configuration/types';
import { MoveNotation } from '../types';

/**
 * Bridge between cube-solver library format and our internal CubeState format
 *
 * Cube-solver uses:
 * - Facelet string: 54 characters representing which face each sticker belongs to in SOLVED state
 * - Format: UUUUUUUUU RRRRRRRRR FFFFFFFFF DDDDDDDDD LLLLLLLLL BBBBBBBBB
 * - Order: Up(9) Right(9) Front(9) Down(9) Left(9) Back(9)
 *
 * Our format uses:
 * - CubeState with Color enums for each face position
 * - Standard color mapping: White=Up, Red=Right, Green=Front, Yellow=Down, Orange=Left, Blue=Back
 */

/**
 * Standard color mapping for solved cube
 */
export const SOLVED_FACE_COLORS = {
  [Face.UP]: Color.WHITE,
  [Face.RIGHT]: Color.RED,
  [Face.FRONT]: Color.GREEN,
  [Face.DOWN]: Color.YELLOW,
  [Face.LEFT]: Color.ORANGE,
  [Face.BACK]: Color.BLUE
} as const;

/**
 * Reverse mapping: Color to Face (for solved cube)
 */
export const COLOR_TO_FACE = {
  [Color.WHITE]: Face.UP,
  [Color.RED]: Face.RIGHT,
  [Color.GREEN]: Face.FRONT,
  [Color.YELLOW]: Face.DOWN,
  [Color.ORANGE]: Face.LEFT,
  [Color.BLUE]: Face.BACK
} as const;

/**
 * Face letter to Face enum mapping (for cube-solver format)
 */
const FACE_LETTER_TO_FACE: Record<string, Face> = {
  'U': Face.UP,
  'R': Face.RIGHT,
  'F': Face.FRONT,
  'D': Face.DOWN,
  'L': Face.LEFT,
  'B': Face.BACK
};

/**
 * Face enum to face letter mapping (for cube-solver format)
 */
const FACE_TO_FACE_LETTER: Record<Face, string> = {
  [Face.UP]: 'U',
  [Face.RIGHT]: 'R',
  [Face.FRONT]: 'F',
  [Face.DOWN]: 'D',
  [Face.LEFT]: 'L',
  [Face.BACK]: 'B'
};

/**
 * Converts CubeState to cube-solver facelet string format
 *
 * Algorithm:
 * 1. For each position in each face, look at the color
 * 2. Determine which face that color belongs to in the solved state
 * 3. Write that face letter to the string
 */
export function cubeStateToFaceletString(state: CubeState): string {
  const faceOrder = [Face.UP, Face.RIGHT, Face.FRONT, Face.DOWN, Face.LEFT, Face.BACK];

  let faceletString = '';
  for (const face of faceOrder) {
    const faceColors = state.faces[face];
    for (const color of faceColors) {
      if (!color) {
        throw new Error(`Invalid cube state: null color found on face ${face}`);
      }
      // Map color to which face it belongs to in solved state
      const targetFace = COLOR_TO_FACE[color];
      const faceLetter = FACE_TO_FACE_LETTER[targetFace];
      faceletString += faceLetter;
    }
  }

  return faceletString;
}

/**
 * Converts cube-solver facelet string to CubeState
 *
 * Algorithm:
 * 1. For each position, read the face letter
 * 2. Determine which color that face has in the solved state
 * 3. Assign that color to the current position
 */
export function faceletStringToCubeState(faceletString: string): CubeState {
  if (faceletString.length !== 54) {
    throw new Error(`Invalid facelet string length: ${faceletString.length} (expected 54)`);
  }

  const faces: Record<Face, (Color | null)[]> = {
    [Face.UP]: [],
    [Face.DOWN]: [],
    [Face.LEFT]: [],
    [Face.RIGHT]: [],
    [Face.FRONT]: [],
    [Face.BACK]: []
  };

  const faceOrder = [Face.UP, Face.RIGHT, Face.FRONT, Face.DOWN, Face.LEFT, Face.BACK];

  let index = 0;
  for (const face of faceOrder) {
    for (let i = 0; i < 9; i++) {
      const faceLetter = faceletString[index];
      const targetFace = FACE_LETTER_TO_FACE[faceLetter];
      const color = SOLVED_FACE_COLORS[targetFace];
      faces[face].push(color);
      index++;
    }
  }

  return {
    faces,
    metadata: {}
  };
}

/**
 * Creates a solved cube state
 */
export function createSolvedCube(): CubeState {
  return {
    faces: {
      [Face.UP]: Array(9).fill(SOLVED_FACE_COLORS[Face.UP]),
      [Face.RIGHT]: Array(9).fill(SOLVED_FACE_COLORS[Face.RIGHT]),
      [Face.FRONT]: Array(9).fill(SOLVED_FACE_COLORS[Face.FRONT]),
      [Face.DOWN]: Array(9).fill(SOLVED_FACE_COLORS[Face.DOWN]),
      [Face.LEFT]: Array(9).fill(SOLVED_FACE_COLORS[Face.LEFT]),
      [Face.BACK]: Array(9).fill(SOLVED_FACE_COLORS[Face.BACK])
    },
    metadata: {}
  };
}

/**
 * Verifies if a cube state is solved
 */
export function isCubeSolved(state: CubeState): boolean {
  for (const face of Object.values(Face)) {
    const faceColors = state.faces[face];
    const centerColor = faceColors[4]; // Center is always at position 4

    // All colors on this face must match the center
    if (!faceColors.every(color => color === centerColor)) {
      return false;
    }
  }
  return true;
}

/**
 * Applies cube-solver moves to our CubeState and verifies the result
 * This tests if the move conversion is working correctly
 */
export function testMoveConversion(
  initialState: CubeState,
  solverMoves: string,
  ourMoves: MoveNotation[]
): {
  solverResult: CubeState;
  ourResult: CubeState;
  match: boolean;
  solverSolved: boolean;
  ourSolved: boolean;
} {
  // Convert initial state to facelet string
  const initialFaceletString = cubeStateToFaceletString(initialState);

  // Apply solver moves (we'll use cube-solver library to get the result)
  // For now, we'll just track what we expect

  // Apply our moves using MoveExecutor
  const { MoveExecutor } = require('../utils/MoveExecutor');
  const executor = new MoveExecutor();
  let ourResult = initialState;
  for (const move of ourMoves) {
    ourResult = executor.applyMove(ourResult, move);
  }

  // For testing, we'll return both results
  // In production, we'd actually run the solver and compare
  return {
    solverResult: initialState, // Placeholder - would need actual solver result
    ourResult,
    match: false, // Would compare the two
    solverSolved: false, // Would check if solver result is solved
    ourSolved: isCubeSolved(ourResult)
  };
}

/**
 * Debug utility: Print cube state in both formats
 */
export function debugCubeState(state: CubeState, label: string = 'Cube State'): void {
  console.log(`\n=== ${label} ===`);

  // Print facelet string
  const faceletString = cubeStateToFaceletString(state);
  console.log('Facelet String:', faceletString);
  console.log('  U (top):', faceletString.substring(0, 9));
  console.log('  R (right):', faceletString.substring(9, 18));
  console.log('  F (front):', faceletString.substring(18, 27));
  console.log('  D (bottom):', faceletString.substring(27, 36));
  console.log('  L (left):', faceletString.substring(36, 45));
  console.log('  B (back):', faceletString.substring(45, 54));

  // Print color state
  console.log('\nColor State:');
  const faceNames = {
    [Face.UP]: 'UP (White)',
    [Face.RIGHT]: 'RIGHT (Red)',
    [Face.FRONT]: 'FRONT (Green)',
    [Face.DOWN]: 'DOWN (Yellow)',
    [Face.LEFT]: 'LEFT (Orange)',
    [Face.BACK]: 'BACK (Blue)'
  };

  for (const face of Object.values(Face)) {
    const colors = state.faces[face];
    const centerColor = colors[4];
    const allMatch = colors.every(c => c === centerColor);
    console.log(`  ${faceNames[face]}: ${allMatch ? '✓' : '✗'}`);
    console.log(`    ${colors[0]} ${colors[1]} ${colors[2]}`);
    console.log(`    ${colors[3]} ${colors[4]} ${colors[5]}`);
    console.log(`    ${colors[6]} ${colors[7]} ${colors[8]}`);
  }

  console.log(`\nSolved: ${isCubeSolved(state) ? '✓' : '✗'}`);
}
