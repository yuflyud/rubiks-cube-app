/**
 * Represents the six faces of a Rubik's cube
 */
export enum Face {
  UP = 'U',      // White (top)
  DOWN = 'D',    // Yellow (bottom)
  FRONT = 'F',   // Green
  BACK = 'B',    // Blue
  LEFT = 'L',    // Orange
  RIGHT = 'R'    // Red
}

/**
 * Represents the six colors available on a Rubik's cube
 */
export enum Color {
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  RED = 'RED'
}

/**
 * Position of a facelet on a face (0-8)
 * Layout:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * Position 4 is always the center (fixed)
 */
export type FaceletPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Represents a single facelet (sticker) on the cube
 */
export interface Facelet {
  face: Face;
  position: FaceletPosition;
  color: Color | null;
  isCenter: boolean;
  isConfigured: boolean;
}

/**
 * Identifier for a specific facelet
 */
export interface FaceletIdentifier {
  face: Face;
  position: FaceletPosition;
}

/**
 * Represents all 54 facelets organized by face
 */
export interface CubeState {
  faces: Record<Face, (Color | null)[]>; // Each face has 9 colors
  metadata: {
    totalConfigured: number;    // Count of configured facelets
    isComplete: boolean;         // All 54 facelets configured
    isValid: boolean;            // Passes validation
    lastModified: Date;
  };
}

/**
 * Configuration progress state
 */
export interface ConfigurationProgress {
  currentFace: Face;
  currentStep: number;          // 0-5 (one per face)
  totalSteps: number;           // Always 6
  completedFaces: Face[];
  percentComplete: number;      // 0-100
}

/**
 * Color count tracking for validation
 */
export interface ColorCount {
  [Color.WHITE]: number;
  [Color.YELLOW]: number;
  [Color.GREEN]: number;
  [Color.BLUE]: number;
  [Color.ORANGE]: number;
  [Color.RED]: number;
}

/**
 * Piece type on the cube
 */
export enum PieceType {
  CENTER = 'CENTER',   // Position 4 on each face
  EDGE = 'EDGE',       // Positions 1, 3, 5, 7
  CORNER = 'CORNER'    // Positions 0, 2, 6, 8
}

/**
 * Represents a corner piece with its three colors
 */
export interface CornerPiece {
  colors: [Color, Color, Color];
  positions: [FaceletIdentifier, FaceletIdentifier, FaceletIdentifier];
}

/**
 * Represents an edge piece with its two colors
 */
export interface EdgePiece {
  colors: [Color, Color];
  positions: [FaceletIdentifier, FaceletIdentifier];
}
