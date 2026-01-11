import { Face, Color, type CubeState } from '../../configuration/types';
import { MoveNotation, RotationDirection } from '../types';
import { MOVE_DETAILS } from '../constants';

/**
 * Executes moves on cube states
 * Handles all 18 standard Rubik's cube moves
 */
export class MoveExecutor {
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
   * @private
   */
  private rotateUp(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.FRONT][0], faces[Face.FRONT][1], faces[Face.FRONT][2]];

    if (clockwise) {
      // F → R → B → L → F
      faces[Face.FRONT][0] = faces[Face.LEFT][0];
      faces[Face.FRONT][1] = faces[Face.LEFT][1];
      faces[Face.FRONT][2] = faces[Face.LEFT][2];

      faces[Face.LEFT][0] = faces[Face.BACK][0];
      faces[Face.LEFT][1] = faces[Face.BACK][1];
      faces[Face.LEFT][2] = faces[Face.BACK][2];

      faces[Face.BACK][0] = faces[Face.RIGHT][0];
      faces[Face.BACK][1] = faces[Face.RIGHT][1];
      faces[Face.BACK][2] = faces[Face.RIGHT][2];

      faces[Face.RIGHT][0] = temp[0];
      faces[Face.RIGHT][1] = temp[1];
      faces[Face.RIGHT][2] = temp[2];
    } else {
      // F → L → B → R → F
      faces[Face.FRONT][0] = faces[Face.RIGHT][0];
      faces[Face.FRONT][1] = faces[Face.RIGHT][1];
      faces[Face.FRONT][2] = faces[Face.RIGHT][2];

      faces[Face.RIGHT][0] = faces[Face.BACK][0];
      faces[Face.RIGHT][1] = faces[Face.BACK][1];
      faces[Face.RIGHT][2] = faces[Face.BACK][2];

      faces[Face.BACK][0] = faces[Face.LEFT][0];
      faces[Face.BACK][1] = faces[Face.LEFT][1];
      faces[Face.BACK][2] = faces[Face.LEFT][2];

      faces[Face.LEFT][0] = temp[0];
      faces[Face.LEFT][1] = temp[1];
      faces[Face.LEFT][2] = temp[2];
    }
  }

  /**
   * Updates adjacent faces for D move
   * @private
   */
  private rotateDown(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.FRONT][6], faces[Face.FRONT][7], faces[Face.FRONT][8]];

    if (clockwise) {
      // F → L → B → R → F
      faces[Face.FRONT][6] = faces[Face.RIGHT][6];
      faces[Face.FRONT][7] = faces[Face.RIGHT][7];
      faces[Face.FRONT][8] = faces[Face.RIGHT][8];

      faces[Face.RIGHT][6] = faces[Face.BACK][6];
      faces[Face.RIGHT][7] = faces[Face.BACK][7];
      faces[Face.RIGHT][8] = faces[Face.BACK][8];

      faces[Face.BACK][6] = faces[Face.LEFT][6];
      faces[Face.BACK][7] = faces[Face.LEFT][7];
      faces[Face.BACK][8] = faces[Face.LEFT][8];

      faces[Face.LEFT][6] = temp[0];
      faces[Face.LEFT][7] = temp[1];
      faces[Face.LEFT][8] = temp[2];
    } else {
      // F → R → B → L → F
      faces[Face.FRONT][6] = faces[Face.LEFT][6];
      faces[Face.FRONT][7] = faces[Face.LEFT][7];
      faces[Face.FRONT][8] = faces[Face.LEFT][8];

      faces[Face.LEFT][6] = faces[Face.BACK][6];
      faces[Face.LEFT][7] = faces[Face.BACK][7];
      faces[Face.LEFT][8] = faces[Face.BACK][8];

      faces[Face.BACK][6] = faces[Face.RIGHT][6];
      faces[Face.BACK][7] = faces[Face.RIGHT][7];
      faces[Face.BACK][8] = faces[Face.RIGHT][8];

      faces[Face.RIGHT][6] = temp[0];
      faces[Face.RIGHT][7] = temp[1];
      faces[Face.RIGHT][8] = temp[2];
    }
  }

  /**
   * Updates adjacent faces for L move
   * @private
   */
  private rotateLeft(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.FRONT][0], faces[Face.FRONT][3], faces[Face.FRONT][6]];

    if (clockwise) {
      // F → D → B → U → F
      faces[Face.FRONT][0] = faces[Face.UP][0];
      faces[Face.FRONT][3] = faces[Face.UP][3];
      faces[Face.FRONT][6] = faces[Face.UP][6];

      faces[Face.UP][0] = faces[Face.BACK][8];
      faces[Face.UP][3] = faces[Face.BACK][5];
      faces[Face.UP][6] = faces[Face.BACK][2];

      faces[Face.BACK][8] = faces[Face.DOWN][0];
      faces[Face.BACK][5] = faces[Face.DOWN][3];
      faces[Face.BACK][2] = faces[Face.DOWN][6];

      faces[Face.DOWN][0] = temp[0];
      faces[Face.DOWN][3] = temp[1];
      faces[Face.DOWN][6] = temp[2];
    } else {
      // F → U → B → D → F
      faces[Face.FRONT][0] = faces[Face.DOWN][0];
      faces[Face.FRONT][3] = faces[Face.DOWN][3];
      faces[Face.FRONT][6] = faces[Face.DOWN][6];

      faces[Face.DOWN][0] = faces[Face.BACK][8];
      faces[Face.DOWN][3] = faces[Face.BACK][5];
      faces[Face.DOWN][6] = faces[Face.BACK][2];

      faces[Face.BACK][8] = faces[Face.UP][0];
      faces[Face.BACK][5] = faces[Face.UP][3];
      faces[Face.BACK][2] = faces[Face.UP][6];

      faces[Face.UP][0] = temp[0];
      faces[Face.UP][3] = temp[1];
      faces[Face.UP][6] = temp[2];
    }
  }

  /**
   * Updates adjacent faces for R move
   * @private
   */
  private rotateRight(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.FRONT][2], faces[Face.FRONT][5], faces[Face.FRONT][8]];

    if (clockwise) {
      // F → U → B → D → F
      faces[Face.FRONT][2] = faces[Face.DOWN][2];
      faces[Face.FRONT][5] = faces[Face.DOWN][5];
      faces[Face.FRONT][8] = faces[Face.DOWN][8];

      faces[Face.DOWN][2] = faces[Face.BACK][6];
      faces[Face.DOWN][5] = faces[Face.BACK][3];
      faces[Face.DOWN][8] = faces[Face.BACK][0];

      faces[Face.BACK][6] = faces[Face.UP][2];
      faces[Face.BACK][3] = faces[Face.UP][5];
      faces[Face.BACK][0] = faces[Face.UP][8];

      faces[Face.UP][2] = temp[0];
      faces[Face.UP][5] = temp[1];
      faces[Face.UP][8] = temp[2];
    } else {
      // F → D → B → U → F
      faces[Face.FRONT][2] = faces[Face.UP][2];
      faces[Face.FRONT][5] = faces[Face.UP][5];
      faces[Face.FRONT][8] = faces[Face.UP][8];

      faces[Face.UP][2] = faces[Face.BACK][6];
      faces[Face.UP][5] = faces[Face.BACK][3];
      faces[Face.UP][8] = faces[Face.BACK][0];

      faces[Face.BACK][6] = faces[Face.DOWN][2];
      faces[Face.BACK][3] = faces[Face.DOWN][5];
      faces[Face.BACK][0] = faces[Face.DOWN][8];

      faces[Face.DOWN][2] = temp[0];
      faces[Face.DOWN][5] = temp[1];
      faces[Face.DOWN][8] = temp[2];
    }
  }

  /**
   * Updates adjacent faces for F move
   * @private
   */
  private rotateFront(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.UP][6], faces[Face.UP][7], faces[Face.UP][8]];

    if (clockwise) {
      // U → R → D → L → U
      faces[Face.UP][6] = faces[Face.LEFT][8];
      faces[Face.UP][7] = faces[Face.LEFT][5];
      faces[Face.UP][8] = faces[Face.LEFT][2];

      faces[Face.LEFT][8] = faces[Face.DOWN][2];
      faces[Face.LEFT][5] = faces[Face.DOWN][1];
      faces[Face.LEFT][2] = faces[Face.DOWN][0];

      faces[Face.DOWN][2] = faces[Face.RIGHT][0];
      faces[Face.DOWN][1] = faces[Face.RIGHT][3];
      faces[Face.DOWN][0] = faces[Face.RIGHT][6];

      faces[Face.RIGHT][0] = temp[0];
      faces[Face.RIGHT][3] = temp[1];
      faces[Face.RIGHT][6] = temp[2];
    } else {
      // U → L → D → R → U
      faces[Face.UP][6] = faces[Face.RIGHT][0];
      faces[Face.UP][7] = faces[Face.RIGHT][3];
      faces[Face.UP][8] = faces[Face.RIGHT][6];

      faces[Face.RIGHT][0] = faces[Face.DOWN][2];
      faces[Face.RIGHT][3] = faces[Face.DOWN][1];
      faces[Face.RIGHT][6] = faces[Face.DOWN][0];

      faces[Face.DOWN][2] = faces[Face.LEFT][8];
      faces[Face.DOWN][1] = faces[Face.LEFT][5];
      faces[Face.DOWN][0] = faces[Face.LEFT][2];

      faces[Face.LEFT][8] = temp[0];
      faces[Face.LEFT][5] = temp[1];
      faces[Face.LEFT][2] = temp[2];
    }
  }

  /**
   * Updates adjacent faces for B move
   * @private
   */
  private rotateBack(state: CubeState, clockwise: boolean): void {
    const { faces } = state;
    const temp = [faces[Face.UP][0], faces[Face.UP][1], faces[Face.UP][2]];

    if (clockwise) {
      // U → L → D → R → U
      faces[Face.UP][0] = faces[Face.RIGHT][2];
      faces[Face.UP][1] = faces[Face.RIGHT][5];
      faces[Face.UP][2] = faces[Face.RIGHT][8];

      faces[Face.RIGHT][2] = faces[Face.DOWN][8];
      faces[Face.RIGHT][5] = faces[Face.DOWN][7];
      faces[Face.RIGHT][8] = faces[Face.DOWN][6];

      faces[Face.DOWN][8] = faces[Face.LEFT][6];
      faces[Face.DOWN][7] = faces[Face.LEFT][3];
      faces[Face.DOWN][6] = faces[Face.LEFT][0];

      faces[Face.LEFT][6] = temp[0];
      faces[Face.LEFT][3] = temp[1];
      faces[Face.LEFT][0] = temp[2];
    } else {
      // U → R → D → L → U
      faces[Face.UP][0] = faces[Face.LEFT][6];
      faces[Face.UP][1] = faces[Face.LEFT][3];
      faces[Face.UP][2] = faces[Face.LEFT][0];

      faces[Face.LEFT][6] = faces[Face.DOWN][8];
      faces[Face.LEFT][3] = faces[Face.DOWN][7];
      faces[Face.LEFT][0] = faces[Face.DOWN][6];

      faces[Face.DOWN][8] = faces[Face.RIGHT][2];
      faces[Face.DOWN][7] = faces[Face.RIGHT][5];
      faces[Face.DOWN][6] = faces[Face.RIGHT][8];

      faces[Face.RIGHT][2] = temp[0];
      faces[Face.RIGHT][5] = temp[1];
      faces[Face.RIGHT][8] = temp[2];
    }
  }
}
