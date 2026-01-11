import type { Face, Color, CubeState } from '../../configuration/types';

/**
 * Move notation for Rubik's cube using standard notation
 * Supports 18 standard moves: 6 basic, 6 prime (inverse), 6 double
 */
export enum MoveNotation {
  // Basic moves (clockwise 90°)
  U = 'U',   // Up face clockwise
  D = 'D',   // Down face clockwise
  L = 'L',   // Left face clockwise
  R = 'R',   // Right face clockwise
  F = 'F',   // Front face clockwise
  B = 'B',   // Back face clockwise

  // Prime moves (counter-clockwise 90°)
  U_PRIME = "U'",
  D_PRIME = "D'",
  L_PRIME = "L'",
  R_PRIME = "R'",
  F_PRIME = "F'",
  B_PRIME = "B'",

  // Double moves (180°)
  U2 = 'U2',
  D2 = 'D2',
  L2 = 'L2',
  R2 = 'R2',
  F2 = 'F2',
  B2 = 'B2'
}

/**
 * Direction of rotation
 */
export enum RotationDirection {
  CLOCKWISE = 'clockwise',
  COUNTER_CLOCKWISE = 'counterclockwise'
}

/**
 * Rotation degrees
 */
export type RotationDegrees = 90 | 180;

/**
 * Single move step in the solution
 * Represents one assembly increment with all necessary data for execution and visualization
 */
export interface AssemblyIncrement {
  /** 1-based sequential step number */
  stepNumber: number;

  /** Move notation (e.g., "R", "U'", "F2") */
  notation: MoveNotation;

  /** Face being rotated */
  face: Face;

  /** Direction of rotation */
  direction: RotationDirection;

  /** Rotation amount in degrees */
  degrees: RotationDegrees;

  /** Resulting cube state after applying this move */
  cubeStateAfter: CubeState;

  /** Human-readable description of the move */
  description: string;
}

/**
 * Complete solution from initial state to solved state
 * Contains all moves and metadata about the solving process
 */
export interface Solution {
  /** Initial cube configuration before solving */
  initialState: CubeState;

  /** Ordered list of moves to solve the cube */
  increments: AssemblyIncrement[];

  /** Total number of moves in the solution */
  totalMoves: number;

  /** Name/version of the solving algorithm used */
  algorithmUsed: string;

  /** Time taken to calculate the solution in milliseconds */
  calculationTimeMs: number;

  /** Whether the final state is solved */
  isSolved: boolean;

  /** Additional metadata about the solution */
  metadata: SolutionMetadata;
}

/**
 * Additional metadata about the solution
 */
export interface SolutionMetadata {
  /** Timestamp when solution was calculated */
  timestamp: Date;

  /** Algorithm version */
  version: string;

  /** Estimated difficulty of the solution */
  complexity: 'easy' | 'medium' | 'hard';
}

/**
 * Configuration for the solver
 */
export interface SolverConfig {
  /** Maximum number of moves allowed in solution (default: 100) */
  maxMoves: number;

  /** Maximum time allowed for calculation in ms (default: 5000) */
  timeout: number;

  /** Algorithm to use for solving */
  algorithm: 'layer-by-layer' | 'beginner' | 'simple';
}

/**
 * Move details for mapping notation to execution details
 */
export interface MoveDetails {
  face: Face;
  direction: RotationDirection;
  degrees: RotationDegrees;
  description: string;
}

/**
 * Result of validation before solving
 */
export interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  errors: string[];
}
