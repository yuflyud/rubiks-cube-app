import { Face } from '../configuration/types';
import {
  MoveNotation,
  RotationDirection,
  type MoveDetails
} from './types';

/**
 * Complete mapping of all 18 standard moves to their execution details
 * Used for move description generation and execution
 */
export const MOVE_DETAILS: Record<MoveNotation, MoveDetails> = {
  // Up face moves
  [MoveNotation.U]: {
    face: Face.UP,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate top face clockwise 90°'
  },
  [MoveNotation.U_PRIME]: {
    face: Face.UP,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate top face counter-clockwise 90°'
  },
  [MoveNotation.U2]: {
    face: Face.UP,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate top face 180°'
  },

  // Down face moves
  [MoveNotation.D]: {
    face: Face.DOWN,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate bottom face clockwise 90°'
  },
  [MoveNotation.D_PRIME]: {
    face: Face.DOWN,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate bottom face counter-clockwise 90°'
  },
  [MoveNotation.D2]: {
    face: Face.DOWN,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate bottom face 180°'
  },

  // Left face moves
  [MoveNotation.L]: {
    face: Face.LEFT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate left face clockwise 90°'
  },
  [MoveNotation.L_PRIME]: {
    face: Face.LEFT,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate left face counter-clockwise 90°'
  },
  [MoveNotation.L2]: {
    face: Face.LEFT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate left face 180°'
  },

  // Right face moves
  [MoveNotation.R]: {
    face: Face.RIGHT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate right face clockwise 90°'
  },
  [MoveNotation.R_PRIME]: {
    face: Face.RIGHT,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate right face counter-clockwise 90°'
  },
  [MoveNotation.R2]: {
    face: Face.RIGHT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate right face 180°'
  },

  // Front face moves
  [MoveNotation.F]: {
    face: Face.FRONT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate front face clockwise 90°'
  },
  [MoveNotation.F_PRIME]: {
    face: Face.FRONT,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate front face counter-clockwise 90°'
  },
  [MoveNotation.F2]: {
    face: Face.FRONT,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate front face 180°'
  },

  // Back face moves
  [MoveNotation.B]: {
    face: Face.BACK,
    direction: RotationDirection.CLOCKWISE,
    degrees: 90,
    description: 'Rotate back face clockwise 90°'
  },
  [MoveNotation.B_PRIME]: {
    face: Face.BACK,
    direction: RotationDirection.COUNTER_CLOCKWISE,
    degrees: 90,
    description: 'Rotate back face counter-clockwise 90°'
  },
  [MoveNotation.B2]: {
    face: Face.BACK,
    direction: RotationDirection.CLOCKWISE,
    degrees: 180,
    description: 'Rotate back face 180°'
  }
};

/**
 * Array of all possible moves for iteration
 */
export const ALL_MOVES: MoveNotation[] = Object.values(MoveNotation);

/**
 * Basic moves only (no primes or doubles) for simplified algorithms
 */
export const BASIC_MOVES: MoveNotation[] = [
  MoveNotation.U,
  MoveNotation.D,
  MoveNotation.L,
  MoveNotation.R,
  MoveNotation.F,
  MoveNotation.B
];

/**
 * Default solver configuration
 */
export const DEFAULT_SOLVER_CONFIG = {
  maxMoves: 100,
  timeout: 5000,
  algorithm: 'layer-by-layer' as const
};

/**
 * Face names for display purposes
 */
export const FACE_NAMES: Record<Face, string> = {
  [Face.UP]: 'Top',
  [Face.DOWN]: 'Bottom',
  [Face.LEFT]: 'Left',
  [Face.RIGHT]: 'Right',
  [Face.FRONT]: 'Front',
  [Face.BACK]: 'Back'
};

/**
 * Face names with center colors for better user guidance
 */
export const FACE_NAMES_WITH_COLORS: Record<Face, string> = {
  [Face.UP]: 'Top (white center)',
  [Face.DOWN]: 'Bottom (yellow center)',
  [Face.LEFT]: 'Left (orange center)',
  [Face.RIGHT]: 'Right (red center)',
  [Face.FRONT]: 'Front (green center)',
  [Face.BACK]: 'Back (blue center)'
};
