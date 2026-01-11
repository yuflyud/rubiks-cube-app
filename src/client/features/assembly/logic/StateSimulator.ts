import type { CubeState } from '../../configuration/types';
import { MoveNotation } from '../types';
import { MoveExecutor } from '../utils/MoveExecutor';

/**
 * Simulates move execution and tracks intermediate cube states
 * Used for generating the complete solution with state after each move
 */
export class StateSimulator {
  private executor: MoveExecutor;

  constructor() {
    this.executor = new MoveExecutor();
  }

  /**
   * Applies a single move to cube state
   */
  public applyMove(state: CubeState, move: MoveNotation): CubeState {
    return this.executor.applyMove(state, move);
  }

  /**
   * Applies a sequence of moves
   */
  public applyMoves(state: CubeState, moves: MoveNotation[]): CubeState {
    return this.executor.applyMoves(state, moves);
  }

  /**
   * Generates intermediate states for each move in sequence
   * Returns array of states where state[i] is the result after move[i]
   */
  public generateIntermediateStates(
    initialState: CubeState,
    moves: MoveNotation[]
  ): CubeState[] {
    const states: CubeState[] = [];
    let currentState = initialState;

    for (const move of moves) {
      currentState = this.applyMove(currentState, move);
      states.push(currentState);
    }

    return states;
  }

  /**
   * Verifies that a move sequence solves the cube
   */
  public verifySolution(initialState: CubeState, moves: MoveNotation[]): boolean {
    const finalState = this.applyMoves(initialState, moves);
    return this.isSolved(finalState);
  }

  /**
   * Checks if a cube state is solved
   */
  public isSolved(state: CubeState): boolean {
    // A cube is solved if each face contains only one color
    for (const faceColors of Object.values(state.faces)) {
      const centerColor = faceColors[4]; // Center is always at index 4
      if (!centerColor) return false;

      // Check if all facelets on this face match the center
      for (const color of faceColors) {
        if (color !== centerColor) {
          return false;
        }
      }
    }

    return true;
  }
}
