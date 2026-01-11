import type { CubeState } from '../../configuration/types';
import type { Solution, SolverConfig } from '../types';
import { AssemblyError, AssemblyErrorCode } from '../types/errors';
import { DEFAULT_SOLVER_CONFIG } from '../constants';
import { InputValidator } from './InputValidator';
import { SimpleSolver } from './SimpleSolver';
import { SolutionBuilder } from './SolutionBuilder';
import { StateSimulator } from './StateSimulator';

/**
 * Main controller for solution calculation
 * Orchestrates the entire solving process from input validation to solution generation
 */
export class SolutionCalculator {
  private config: SolverConfig;
  private validator: InputValidator;
  private solver: SimpleSolver;
  private builder: SolutionBuilder;
  private simulator: StateSimulator;

  constructor(config: Partial<SolverConfig> = {}) {
    this.config = {
      ...DEFAULT_SOLVER_CONFIG,
      ...config
    };

    this.validator = new InputValidator();
    this.solver = new SimpleSolver(this.config.maxMoves);
    this.builder = new SolutionBuilder();
    this.simulator = new StateSimulator();
  }

  /**
   * Calculates the solution for a given cube state
   * Returns a complete Solution object with all moves and metadata
   */
  public async calculateSolution(cubeState: CubeState): Promise<Solution> {
    const startTime = performance.now();

    try {
      // Step 1: Validate input
      this.validator.validateOrThrow(cubeState);

      // Step 2: Check if already solved
      if (this.isSolved(cubeState)) {
        return this.buildEmptySolution(cubeState, startTime);
      }

      // Step 3: Solve the cube
      const moves = await this.solveWithTimeout(cubeState);

      // Step 4: Build complete solution
      const calculationTime = performance.now() - startTime;
      const solution = this.builder.buildSolution(
        cubeState,
        moves,
        this.config.algorithm,
        calculationTime
      );

      // Step 5: Verify solution correctness
      this.verifySolution(solution);

      return solution;
    } catch (error) {
      if (error instanceof AssemblyError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new AssemblyError(
        AssemblyErrorCode.ALGORITHM_ERROR,
        error instanceof Error ? error.message : 'Unknown error during calculation',
        { originalError: error }
      );
    }
  }

  /**
   * Checks if the cube is already solved
   */
  public isSolved(cubeState: CubeState): boolean {
    return this.simulator.isSolved(cubeState);
  }

  /**
   * Gets the current solver configuration
   */
  public getConfig(): Readonly<SolverConfig> {
    return { ...this.config };
  }

  /**
   * Updates the solver configuration
   */
  public updateConfig(config: Partial<SolverConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };

    // Recreate solver with new config
    this.solver = new SimpleSolver(this.config.maxMoves);
  }

  /**
   * Solves the cube with timeout protection
   *
   * @private
   */
  private async solveWithTimeout(cubeState: CubeState): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          AssemblyError.create(AssemblyErrorCode.CALCULATION_TIMEOUT, {
            timeout: this.config.timeout
          })
        );
      }, this.config.timeout);

      try {
        // Run solver (currently synchronous, could be made async with Web Worker)
        const moves = this.solver.solve(cubeState);

        clearTimeout(timeoutId);

        // Check max moves constraint
        if (moves.length > this.config.maxMoves) {
          reject(
            AssemblyError.create(AssemblyErrorCode.MAX_MOVES_EXCEEDED, {
              movesFound: moves.length,
              maxMoves: this.config.maxMoves
            })
          );
        } else {
          resolve(moves);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Builds a solution for an already-solved cube
   *
   * @private
   */
  private buildEmptySolution(cubeState: CubeState, startTime: number): Solution {
    const calculationTime = performance.now() - startTime;

    return {
      initialState: cubeState,
      increments: [],
      totalMoves: 0,
      algorithmUsed: this.config.algorithm,
      calculationTimeMs: calculationTime,
      isSolved: true,
      metadata: {
        timestamp: new Date(),
        version: '1.0.0',
        complexity: 'easy'
      }
    };
  }

  /**
   * Verifies that the solution is correct
   *
   * @private
   */
  private verifySolution(solution: Solution): void {
    if (solution.totalMoves === 0) {
      return; // Already solved
    }

    // Extract moves from increments
    const moves = solution.increments.map((inc) => inc.notation);

    // Verify the moves lead to a solved state
    const isSolved = this.simulator.verifySolution(solution.initialState, moves);

    if (!isSolved) {
      throw AssemblyError.create(AssemblyErrorCode.ALGORITHM_ERROR, {
        message: 'Generated solution does not solve the cube'
      });
    }
  }
}
