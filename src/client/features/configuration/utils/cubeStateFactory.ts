import { Face, Color, CubeState } from '../types';
import { FACE_TO_COLOR } from '../constants';

/**
 * Creates an empty cube state with centers pre-filled
 * According to standard Rubik's cube orientation
 */
export function createEmptyCubeState(): CubeState {
  const faces: Record<Face, (Color | null)[]> = {
    [Face.UP]: Array(9).fill(null),
    [Face.DOWN]: Array(9).fill(null),
    [Face.FRONT]: Array(9).fill(null),
    [Face.BACK]: Array(9).fill(null),
    [Face.LEFT]: Array(9).fill(null),
    [Face.RIGHT]: Array(9).fill(null)
  };

  // Pre-fill center facelets (position 4 on each face)
  Object.values(Face).forEach((face) => {
    faces[face][4] = FACE_TO_COLOR[face];
  });

  return {
    faces,
    metadata: {
      totalConfigured: 6, // 6 centers are pre-configured
      isComplete: false,
      isValid: false,
      lastModified: new Date()
    }
  };
}

/**
 * Checks if a position is a center facelet
 */
export function isCenterPosition(position: number): boolean {
  return position === 4;
}

/**
 * Gets the piece type for a given position
 */
export function getPieceType(position: number): 'center' | 'edge' | 'corner' {
  if (position === 4) return 'center';
  if ([1, 3, 5, 7].includes(position)) return 'edge';
  return 'corner';
}

/**
 * Creates a deep copy of a cube state
 */
export function cloneCubeState(state: CubeState): CubeState {
  return {
    faces: {
      [Face.UP]: [...state.faces[Face.UP]],
      [Face.DOWN]: [...state.faces[Face.DOWN]],
      [Face.FRONT]: [...state.faces[Face.FRONT]],
      [Face.BACK]: [...state.faces[Face.BACK]],
      [Face.LEFT]: [...state.faces[Face.LEFT]],
      [Face.RIGHT]: [...state.faces[Face.RIGHT]]
    },
    metadata: {
      ...state.metadata,
      lastModified: new Date()
    }
  };
}

/**
 * Counts how many facelets have been configured
 */
export function countConfiguredFacelets(state: CubeState): number {
  let count = 0;
  Object.values(state.faces).forEach((face) => {
    count += face.filter((color) => color !== null).length;
  });
  return count;
}

/**
 * Checks if all facelets are configured
 */
export function isConfigurationComplete(state: CubeState): boolean {
  return countConfiguredFacelets(state) === 54;
}

/**
 * Checks if a specific face is complete
 */
export function isFaceComplete(state: CubeState, face: Face): boolean {
  return state.faces[face].every((color) => color !== null);
}
