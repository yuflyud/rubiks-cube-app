import type { CubeState } from '../../configuration/types';
import {
  MoveNotation,
  type AssemblyIncrement,
  type Solution,
  type SolutionMetadata
} from '../types';
import { MOVE_DETAILS } from '../constants';
import { StateSimulator } from './StateSimulator';

/**
 * Builds complete solution objects with all assembly increments
 * Transforms raw move sequences into rich solution data structures
 */
export class SolutionBuilder {
  private simulator: StateSimulator;

  constructor() {
    this.simulator = new StateSimulator();
  }

  /**
   * Builds a complete solution from a move sequence
   */
  public buildSolution(
    initialState: CubeState,
    moves: MoveNotation[],
    algorithmUsed: string,
    calculationTimeMs: number
  ): Solution {
    // Generate intermediate states
    const states = this.simulator.generateIntermediateStates(initialState, moves);

    // Create assembly increments
    const increments = this.createIncrements(moves, states);

    // Determine if solved
    const isSolved =
      moves.length === 0
        ? this.simulator.isSolved(initialState)
        : this.simulator.isSolved(states[states.length - 1]);

    // Create metadata
    const metadata: SolutionMetadata = {
      timestamp: new Date(),
      version: '1.0.0',
      complexity: this.calculateComplexity(moves.length)
    };

    return {
      initialState,
      increments,
      totalMoves: moves.length,
      algorithmUsed,
      calculationTimeMs,
      isSolved,
      metadata
    };
  }

  /**
   * Creates assembly increments from moves and intermediate states
   *
   * @private
   */
  private createIncrements(
    moves: MoveNotation[],
    states: CubeState[]
  ): AssemblyIncrement[] {
    return moves.map((move, index) => {
      const moveDetails = MOVE_DETAILS[move];

      return {
        stepNumber: index + 1, // 1-based step numbering
        notation: move,
        face: moveDetails.face,
        direction: moveDetails.direction,
        degrees: moveDetails.degrees,
        cubeStateAfter: states[index],
        description: moveDetails.description
      };
    });
  }

  /**
   * Calculates the complexity level based on move count
   *
   * @private
   */
  private calculateComplexity(totalMoves: number): 'easy' | 'medium' | 'hard' {
    if (totalMoves <= 20) {
      return 'easy';
    } else if (totalMoves <= 50) {
      return 'medium';
    } else {
      return 'hard';
    }
  }
}
