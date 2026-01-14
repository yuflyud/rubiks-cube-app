import { Face, Color, type CubeState } from '../../configuration/types';
import { MoveNotation, RotationDirection } from '../types';
import { MOVE_DETAILS } from '../constants';

/**
 * Executes moves on cube states
 * Handles all 18 standard Rubik's cube moves
 */
export class MoveExecutor {
  constructor() {
    console.log('✨ MoveExecutor V2.0 - FIXED VERSION - initialized');
  }

  /**
   * Applies a single move to the cube state
   * Returns a new cube state (immutable operation)
   */
  public applyMove(state: CubeState, move: MoveNotation): CubeState {
    const moveDetails = MOVE_DETAILS[move];
    const face = moveDetails.face;
    const degrees = moveDetails.degrees;
    const direction = moveDetails.direction;

    // Clone the state to maintain immutability
    const newState: CubeState = {
      faces: {
        [Face.UP]: [...state.faces[Face.UP]],
        [Face.DOWN]: [...state.faces[Face.DOWN]],
        [Face.LEFT]: [...state.faces[Face.LEFT]],
        [Face.RIGHT]: [...state.faces[Face.RIGHT]],
        [Face.FRONT]: [...state.faces[Face.FRONT]],
        [Face.BACK]: [...state.faces[Face.BACK]]
      },
      metadata: { ...state.metadata }
    };

    // Apply rotation based on degrees
    if (degrees === 180) {
      // 180° rotation = apply 90° twice
      this.rotateFace90(newState, face, direction);
      this.rotateFace90(newState, face, direction);
    } else {
      // 90° rotation
      this.rotateFace90(newState, face, direction);
    }

    return newState;
  }

  /**
   * Applies multiple moves in sequence
   */
  public applyMoves(state: CubeState, moves: MoveNotation[]): CubeState {
    let currentState = state;
    for (const move of moves) {
      currentState = this.applyMove(currentState, move);
    }
    return currentState;
  }

  /**
   * Rotates a face 90 degrees
   * @private
   */
  private rotateFace90(
    state: CubeState,
    face: Face,
    direction: RotationDirection
  ): void {
    // Rotate the face itself
    if (direction === RotationDirection.CLOCKWISE) {
      this.rotateFaceClockwise(state.faces[face]);
    } else {
      this.rotateFaceCounterClockwise(state.faces[face]);
    }

    // Update adjacent faces
    this.updateAdjacentFaces(state, face, direction);
  }

  /**
   * Rotates a single face array clockwise
   * Face layout:
   * 0 1 2
   * 3 4 5
   * 6 7 8
   * @private
   */
  private rotateFaceClockwise(face: (Color | null)[]): void {
    const temp = [...face];
    // Rotate: 0→2, 1→5, 2→8, 3→1, 5→7, 6→0, 7→3, 8→6
    face[0] = temp[6];
    face[1] = temp[3];
    face[2] = temp[0];
    face[3] = temp[7];
    // face[4] stays (center)
    face[5] = temp[1];
    face[6] = temp[8];
    face[7] = temp[5];
    face[8] = temp[2];
  }

  /**
   * Rotates a single face array counter-clockwise
   * @private
   */
  private rotateFaceCounterClockwise(face: (Color | null)[]): void {
    const temp = [...face];
    // Rotate: 0→6, 1→3, 2→0, 3→7, 5→1, 6→8, 7→5, 8→2
    face[0] = temp[2];
    face[1] = temp[5];
    face[2] = temp[8];
    face[3] = temp[1];
    // face[4] stays (center)
    face[5] = temp[7];
    face[6] = temp[0];
    face[7] = temp[3];
    face[8] = temp[6];
  }

  /**
   * Updates adjacent faces after a face rotation
   * This is where the complexity lies - different faces have different adjacencies
   * @private
   */
  private updateAdjacentFaces(
    state: CubeState,
    face: Face,
    direction: RotationDirection
  ): void {
    const clockwise = direction === RotationDirection.CLOCKWISE;

    switch (face) {
      case Face.UP:
        this.rotateUp(state, clockwise);
        break;
      case Face.DOWN:
        this.rotateDown(state, clockwise);
        break;
      case Face.LEFT:
        this.rotateLeft(state, clockwise);
        break;
      case Face.RIGHT:
        this.rotateRight(state, clockwise);
        break;
      case Face.FRONT:
        this.rotateFront(state, clockwise);
        break;
      case Face.BACK:
        this.rotateBack(state, clockwise);
        break;
    }
  }

  /**
   * Updates adjacent faces for U move
   *
   * Standard U move (clockwise when looking DOWN at up face from above):
   * Looking from ABOVE the cube at the white/up face:
   * - Front top row → LEFT top row (clockwise rotation!)
   * - Left top row → Back top row
   * - Back top row → Right top row
   * - Right top row → Front top row
   *
   * Cycle: F → L → B → R → F
   *
   * @private
   */
  private rotateUp(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: F → L → B → R → F (clockwise when viewed from ABOVE)
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][0], faces[Face.FRONT][1], faces[Face.FRONT][2]];
      const tempLeft = [faces[Face.LEFT][0], faces[Face.LEFT][1], faces[Face.LEFT][2]];
      const tempBack = [faces[Face.BACK][0], faces[Face.BACK][1], faces[Face.BACK][2]];
      const tempRight = [faces[Face.RIGHT][0], faces[Face.RIGHT][1], faces[Face.RIGHT][2]];

      // Apply cycle using saved values
      // Front top row → Left top row
      faces[Face.LEFT][0] = tempFront[0];
      faces[Face.LEFT][1] = tempFront[1];
      faces[Face.LEFT][2] = tempFront[2];

      // Left top row → Back top row
      faces[Face.BACK][0] = tempLeft[0];
      faces[Face.BACK][1] = tempLeft[1];
      faces[Face.BACK][2] = tempLeft[2];

      // Back top row → Right top row
      faces[Face.RIGHT][0] = tempBack[0];
      faces[Face.RIGHT][1] = tempBack[1];
      faces[Face.RIGHT][2] = tempBack[2];

      // Right top row → Front top row
      faces[Face.FRONT][0] = tempRight[0];
      faces[Face.FRONT][1] = tempRight[1];
      faces[Face.FRONT][2] = tempRight[2];
    } else {
      // Counter-clockwise: F → R → B → L → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][0], faces[Face.FRONT][1], faces[Face.FRONT][2]];
      const tempRight = [faces[Face.RIGHT][0], faces[Face.RIGHT][1], faces[Face.RIGHT][2]];
      const tempBack = [faces[Face.BACK][0], faces[Face.BACK][1], faces[Face.BACK][2]];
      const tempLeft = [faces[Face.LEFT][0], faces[Face.LEFT][1], faces[Face.LEFT][2]];

      // Apply cycle using saved values
      // Front top row → Right top row
      faces[Face.RIGHT][0] = tempFront[0];
      faces[Face.RIGHT][1] = tempFront[1];
      faces[Face.RIGHT][2] = tempFront[2];

      // Right top row → Back top row
      faces[Face.BACK][0] = tempRight[0];
      faces[Face.BACK][1] = tempRight[1];
      faces[Face.BACK][2] = tempRight[2];

      // Back top row → Left top row
      faces[Face.LEFT][0] = tempBack[0];
      faces[Face.LEFT][1] = tempBack[1];
      faces[Face.LEFT][2] = tempBack[2];

      // Left top row → Front top row
      faces[Face.FRONT][0] = tempLeft[0];
      faces[Face.FRONT][1] = tempLeft[1];
      faces[Face.FRONT][2] = tempLeft[2];
    }
  }

  /**
   * Updates adjacent faces for D move
   *
   * Standard D move (clockwise when looking UP at down face from below):
   * Looking from BELOW the cube at the yellow/down face:
   * - Front bottom row → RIGHT bottom row (clockwise rotation!)
   * - Right bottom row → Back bottom row
   * - Back bottom row → Left bottom row
   * - Left bottom row → Front bottom row
   *
   * Cycle: F → R → B → L → F
   *
   * @private
   */
  private rotateDown(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: F → R → B → L → F (clockwise when viewed from BELOW)
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][6], faces[Face.FRONT][7], faces[Face.FRONT][8]];
      const tempRight = [faces[Face.RIGHT][6], faces[Face.RIGHT][7], faces[Face.RIGHT][8]];
      const tempBack = [faces[Face.BACK][6], faces[Face.BACK][7], faces[Face.BACK][8]];
      const tempLeft = [faces[Face.LEFT][6], faces[Face.LEFT][7], faces[Face.LEFT][8]];

      // Apply cycle using saved values
      // Front bottom row → Right bottom row
      faces[Face.RIGHT][6] = tempFront[0];
      faces[Face.RIGHT][7] = tempFront[1];
      faces[Face.RIGHT][8] = tempFront[2];

      // Right bottom row → Back bottom row
      faces[Face.BACK][6] = tempRight[0];
      faces[Face.BACK][7] = tempRight[1];
      faces[Face.BACK][8] = tempRight[2];

      // Back bottom row → Left bottom row
      faces[Face.LEFT][6] = tempBack[0];
      faces[Face.LEFT][7] = tempBack[1];
      faces[Face.LEFT][8] = tempBack[2];

      // Left bottom row → Front bottom row
      faces[Face.FRONT][6] = tempLeft[0];
      faces[Face.FRONT][7] = tempLeft[1];
      faces[Face.FRONT][8] = tempLeft[2];
    } else {
      // Counter-clockwise: F → L → B → R → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][6], faces[Face.FRONT][7], faces[Face.FRONT][8]];
      const tempLeft = [faces[Face.LEFT][6], faces[Face.LEFT][7], faces[Face.LEFT][8]];
      const tempBack = [faces[Face.BACK][6], faces[Face.BACK][7], faces[Face.BACK][8]];
      const tempRight = [faces[Face.RIGHT][6], faces[Face.RIGHT][7], faces[Face.RIGHT][8]];

      // Apply cycle using saved values
      // Front bottom row → Left bottom row
      faces[Face.LEFT][6] = tempFront[0];
      faces[Face.LEFT][7] = tempFront[1];
      faces[Face.LEFT][8] = tempFront[2];

      // Left bottom row → Back bottom row
      faces[Face.BACK][6] = tempLeft[0];
      faces[Face.BACK][7] = tempLeft[1];
      faces[Face.BACK][8] = tempLeft[2];

      // Back bottom row → Right bottom row
      faces[Face.RIGHT][6] = tempBack[0];
      faces[Face.RIGHT][7] = tempBack[1];
      faces[Face.RIGHT][8] = tempBack[2];

      // Right bottom row → Front bottom row
      faces[Face.FRONT][6] = tempRight[0];
      faces[Face.FRONT][7] = tempRight[1];
      faces[Face.FRONT][8] = tempRight[2];
    }
  }

  /**
   * Updates adjacent faces for L move
   *
   * Standard L move (clockwise when looking at left face):
   * - Front left edge → Down left edge
   * - Down left edge → Back right edge (mirrored: 0→8, 3→5, 6→2)
   * - Back right edge → Up left edge (mirrored: 8→0, 5→3, 2→6)
   * - Up left edge → Front left edge
   *
   * Cycle: F → D → B → U → F
   *
   * @private
   */
  private rotateLeft(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: F → D → B → U → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][0], faces[Face.FRONT][3], faces[Face.FRONT][6]];
      const tempDown = [faces[Face.DOWN][0], faces[Face.DOWN][3], faces[Face.DOWN][6]];
      const tempBack = [faces[Face.BACK][8], faces[Face.BACK][5], faces[Face.BACK][2]];
      const tempUp = [faces[Face.UP][0], faces[Face.UP][3], faces[Face.UP][6]];

      // Apply cycle using saved values
      // Front left edge → Down left edge
      faces[Face.DOWN][0] = tempFront[0];
      faces[Face.DOWN][3] = tempFront[1];
      faces[Face.DOWN][6] = tempFront[2];

      // Down left edge → Back right edge (mirrored!)
      faces[Face.BACK][8] = tempDown[0];
      faces[Face.BACK][5] = tempDown[1];
      faces[Face.BACK][2] = tempDown[2];

      // Back right edge → Up left edge (mirrored!)
      faces[Face.UP][0] = tempBack[0];
      faces[Face.UP][3] = tempBack[1];
      faces[Face.UP][6] = tempBack[2];

      // Up left edge → Front left edge
      faces[Face.FRONT][0] = tempUp[0];
      faces[Face.FRONT][3] = tempUp[1];
      faces[Face.FRONT][6] = tempUp[2];
    } else {
      // Counter-clockwise: F → U → B → D → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][0], faces[Face.FRONT][3], faces[Face.FRONT][6]];
      const tempUp = [faces[Face.UP][0], faces[Face.UP][3], faces[Face.UP][6]];
      const tempBack = [faces[Face.BACK][8], faces[Face.BACK][5], faces[Face.BACK][2]];
      const tempDown = [faces[Face.DOWN][0], faces[Face.DOWN][3], faces[Face.DOWN][6]];

      // Apply cycle using saved values
      // Front left edge → Up left edge
      faces[Face.UP][0] = tempFront[0];
      faces[Face.UP][3] = tempFront[1];
      faces[Face.UP][6] = tempFront[2];

      // Up left edge → Back right edge (mirrored!)
      faces[Face.BACK][8] = tempUp[0];
      faces[Face.BACK][5] = tempUp[1];
      faces[Face.BACK][2] = tempUp[2];

      // Back right edge → Down left edge (mirrored!)
      faces[Face.DOWN][0] = tempBack[0];
      faces[Face.DOWN][3] = tempBack[1];
      faces[Face.DOWN][6] = tempBack[2];

      // Down left edge → Front left edge
      faces[Face.FRONT][0] = tempDown[0];
      faces[Face.FRONT][3] = tempDown[1];
      faces[Face.FRONT][6] = tempDown[2];
    }
  }

  /**
   * Updates adjacent faces for R move
   *
   * Standard R move (clockwise when looking at right face):
   * - Front right edge → Up right edge
   * - Up right edge → Back left edge (mirrored: 2→6, 5→3, 8→0)
   * - Back left edge → Down right edge (mirrored: 6→2, 3→5, 0→8)
   * - Down right edge → Front right edge
   *
   * Cycle: F → U → B → D → F
   *
   * @private
   */
  private rotateRight(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: F → U → B → D → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][2], faces[Face.FRONT][5], faces[Face.FRONT][8]];
      const tempUp = [faces[Face.UP][2], faces[Face.UP][5], faces[Face.UP][8]];
      const tempBack = [faces[Face.BACK][6], faces[Face.BACK][3], faces[Face.BACK][0]];
      const tempDown = [faces[Face.DOWN][2], faces[Face.DOWN][5], faces[Face.DOWN][8]];

      // Apply cycle using saved values
      // Front right edge → Up right edge
      faces[Face.UP][2] = tempFront[0];
      faces[Face.UP][5] = tempFront[1];
      faces[Face.UP][8] = tempFront[2];

      // Up right edge → Back left edge (mirrored!)
      faces[Face.BACK][6] = tempUp[0];
      faces[Face.BACK][3] = tempUp[1];
      faces[Face.BACK][0] = tempUp[2];

      // Back left edge → Down right edge (mirrored!)
      faces[Face.DOWN][2] = tempBack[0];
      faces[Face.DOWN][5] = tempBack[1];
      faces[Face.DOWN][8] = tempBack[2];

      // Down right edge → Front right edge
      faces[Face.FRONT][2] = tempDown[0];
      faces[Face.FRONT][5] = tempDown[1];
      faces[Face.FRONT][8] = tempDown[2];
    } else {
      // Counter-clockwise: F → D → B → U → F
      // Save all original values before modifying
      const tempFront = [faces[Face.FRONT][2], faces[Face.FRONT][5], faces[Face.FRONT][8]];
      const tempDown = [faces[Face.DOWN][2], faces[Face.DOWN][5], faces[Face.DOWN][8]];
      const tempBack = [faces[Face.BACK][6], faces[Face.BACK][3], faces[Face.BACK][0]];
      const tempUp = [faces[Face.UP][2], faces[Face.UP][5], faces[Face.UP][8]];

      // Apply cycle using saved values
      // Front right edge → Down right edge
      faces[Face.DOWN][2] = tempFront[0];
      faces[Face.DOWN][5] = tempFront[1];
      faces[Face.DOWN][8] = tempFront[2];

      // Down right edge → Back left edge (mirrored!)
      faces[Face.BACK][6] = tempDown[0];
      faces[Face.BACK][3] = tempDown[1];
      faces[Face.BACK][0] = tempDown[2];

      // Back left edge → Up right edge (mirrored!)
      faces[Face.UP][2] = tempBack[0];
      faces[Face.UP][5] = tempBack[1];
      faces[Face.UP][8] = tempBack[2];

      // Up right edge → Front right edge
      faces[Face.FRONT][2] = tempUp[0];
      faces[Face.FRONT][5] = tempUp[1];
      faces[Face.FRONT][8] = tempUp[2];
    }
  }

  /**
   * Updates adjacent faces for F move
   *
   * Standard F move (clockwise when looking at front face):
   * - Up bottom row → Right left column (rotated: 6→0, 7→3, 8→6)
   * - Right left column → Down top row (rotated: 0→2, 3→1, 6→0)
   * - Down top row → Left right column (rotated: 0→2, 1→5, 2→8)
   * - Left right column → Up bottom row (rotated: 2→8, 5→7, 8→6)
   *
   * Cycle: U → R → D → L → U
   *
   * @private
   */
  private rotateFront(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: U → R → D → L → U
      // Save all original values before modifying
      const tempUp = [faces[Face.UP][6], faces[Face.UP][7], faces[Face.UP][8]];
      const tempRight = [faces[Face.RIGHT][0], faces[Face.RIGHT][3], faces[Face.RIGHT][6]];
      const tempDown = [faces[Face.DOWN][0], faces[Face.DOWN][1], faces[Face.DOWN][2]];
      const tempLeft = [faces[Face.LEFT][2], faces[Face.LEFT][5], faces[Face.LEFT][8]];

      // Apply cycle using saved values (with rotations!)
      // Up bottom row → Right left column (rotated)
      faces[Face.RIGHT][0] = tempUp[0];  // U[6] → R[0]
      faces[Face.RIGHT][3] = tempUp[1];  // U[7] → R[3]
      faces[Face.RIGHT][6] = tempUp[2];  // U[8] → R[6]

      // Right left column → Down top row (rotated)
      faces[Face.DOWN][2] = tempRight[0];  // R[0] → D[2]
      faces[Face.DOWN][1] = tempRight[1];  // R[3] → D[1]
      faces[Face.DOWN][0] = tempRight[2];  // R[6] → D[0]

      // Down top row → Left right column (rotated)
      faces[Face.LEFT][8] = tempDown[0];  // D[0] → L[8]
      faces[Face.LEFT][5] = tempDown[1];  // D[1] → L[5]
      faces[Face.LEFT][2] = tempDown[2];  // D[2] → L[2]

      // Left right column → Up bottom row (rotated)
      faces[Face.UP][6] = tempLeft[2];  // L[8] → U[6]
      faces[Face.UP][7] = tempLeft[1];  // L[5] → U[7]
      faces[Face.UP][8] = tempLeft[0];  // L[2] → U[8]
    } else {
      // Counter-clockwise: U → L → D → R → U
      // Save all original values before modifying
      const tempUp = [faces[Face.UP][6], faces[Face.UP][7], faces[Face.UP][8]];
      const tempLeft = [faces[Face.LEFT][2], faces[Face.LEFT][5], faces[Face.LEFT][8]];
      const tempDown = [faces[Face.DOWN][0], faces[Face.DOWN][1], faces[Face.DOWN][2]];
      const tempRight = [faces[Face.RIGHT][0], faces[Face.RIGHT][3], faces[Face.RIGHT][6]];

      // Apply cycle using saved values (with rotations!)
      // Up bottom row → Left right column (rotated)
      faces[Face.LEFT][2] = tempUp[2];  // U[8] → L[2]
      faces[Face.LEFT][5] = tempUp[1];  // U[7] → L[5]
      faces[Face.LEFT][8] = tempUp[0];  // U[6] → L[8]

      // Left right column → Down top row (rotated)
      faces[Face.DOWN][0] = tempLeft[0];  // L[2] → D[0]
      faces[Face.DOWN][1] = tempLeft[1];  // L[5] → D[1]
      faces[Face.DOWN][2] = tempLeft[2];  // L[8] → D[2]

      // Down top row → Right left column (rotated)
      faces[Face.RIGHT][6] = tempDown[0];  // D[0] → R[6]
      faces[Face.RIGHT][3] = tempDown[1];  // D[1] → R[3]
      faces[Face.RIGHT][0] = tempDown[2];  // D[2] → R[0]

      // Right left column → Up bottom row (rotated)
      faces[Face.UP][6] = tempRight[0];  // R[0] → U[6]
      faces[Face.UP][7] = tempRight[1];  // R[3] → U[7]
      faces[Face.UP][8] = tempRight[2];  // R[6] → U[8]
    }
  }

  /**
   * Updates adjacent faces for B move
   *
   * Standard B move (clockwise when looking at back face):
   * - Up top row → Left left column (rotated: 0→6, 1→3, 2→0)
   * - Left left column → Down bottom row (rotated: 0→6, 3→7, 6→8)
   * - Down bottom row → Right right column (rotated: 6→8, 7→5, 8→2)
   * - Right right column → Up top row (rotated: 2→0, 5→1, 8→2)
   *
   * Cycle: U → L → D → R → U
   *
   * @private
   */
  private rotateBack(state: CubeState, clockwise: boolean): void {
    const { faces } = state;

    if (clockwise) {
      // Cycle: U → L → D → R → U
      // Save all original values before modifying
      const tempUp = [faces[Face.UP][0], faces[Face.UP][1], faces[Face.UP][2]];
      const tempLeft = [faces[Face.LEFT][0], faces[Face.LEFT][3], faces[Face.LEFT][6]];
      const tempDown = [faces[Face.DOWN][6], faces[Face.DOWN][7], faces[Face.DOWN][8]];
      const tempRight = [faces[Face.RIGHT][2], faces[Face.RIGHT][5], faces[Face.RIGHT][8]];

      // Apply cycle using saved values (with rotations!)
      // Up top row → Left left column (rotated)
      faces[Face.LEFT][6] = tempUp[0];  // U[0] → L[6]
      faces[Face.LEFT][3] = tempUp[1];  // U[1] → L[3]
      faces[Face.LEFT][0] = tempUp[2];  // U[2] → L[0]

      // Left left column → Down bottom row (rotated)
      faces[Face.DOWN][6] = tempLeft[2];  // L[6] → D[6]
      faces[Face.DOWN][7] = tempLeft[1];  // L[3] → D[7]
      faces[Face.DOWN][8] = tempLeft[0];  // L[0] → D[8]

      // Down bottom row → Right right column (rotated)
      faces[Face.RIGHT][8] = tempDown[0];  // D[6] → R[8]
      faces[Face.RIGHT][5] = tempDown[1];  // D[7] → R[5]
      faces[Face.RIGHT][2] = tempDown[2];  // D[8] → R[2]

      // Right right column → Up top row (rotated)
      faces[Face.UP][0] = tempRight[2];  // R[8] → U[0]
      faces[Face.UP][1] = tempRight[1];  // R[5] → U[1]
      faces[Face.UP][2] = tempRight[0];  // R[2] → U[2]
    } else {
      // Counter-clockwise: U → R → D → L → U
      // Save all original values before modifying
      const tempUp = [faces[Face.UP][0], faces[Face.UP][1], faces[Face.UP][2]];
      const tempRight = [faces[Face.RIGHT][2], faces[Face.RIGHT][5], faces[Face.RIGHT][8]];
      const tempDown = [faces[Face.DOWN][6], faces[Face.DOWN][7], faces[Face.DOWN][8]];
      const tempLeft = [faces[Face.LEFT][0], faces[Face.LEFT][3], faces[Face.LEFT][6]];

      // Apply cycle using saved values (with rotations!)
      // Up top row → Right right column (rotated)
      faces[Face.RIGHT][2] = tempUp[2];  // U[2] → R[2]
      faces[Face.RIGHT][5] = tempUp[1];  // U[1] → R[5]
      faces[Face.RIGHT][8] = tempUp[0];  // U[0] → R[8]

      // Right right column → Down bottom row (rotated)
      faces[Face.DOWN][8] = tempRight[0];  // R[2] → D[8]
      faces[Face.DOWN][7] = tempRight[1];  // R[5] → D[7]
      faces[Face.DOWN][6] = tempRight[2];  // R[8] → D[6]

      // Down bottom row → Left left column (rotated)
      faces[Face.LEFT][0] = tempDown[2];  // D[8] → L[0]
      faces[Face.LEFT][3] = tempDown[1];  // D[7] → L[3]
      faces[Face.LEFT][6] = tempDown[0];  // D[6] → L[6]

      // Left left column → Up top row (rotated)
      faces[Face.UP][2] = tempLeft[0];  // L[0] → U[2]
      faces[Face.UP][1] = tempLeft[1];  // L[3] → U[1]
      faces[Face.UP][0] = tempLeft[2];  // L[6] → U[0]
    }
  }
}
