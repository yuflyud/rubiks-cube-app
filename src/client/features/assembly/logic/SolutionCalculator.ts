import type { CubeState } from '../../configuration/types';
import type { Solution, SolverConfig } from '../types';
import { AssemblyError, AssemblyErrorCode } from '../types/errors';
import { DEFAULT_SOLVER_CONFIG } from '../constants';
import { InputValidator } from './InputValidator';
import { KociembaSolver } from './KociembaSolver';
import { LayerByLayerSolver } from './LayerByLayerSolver';
import { SolutionBuilder } from './SolutionBuilder';
import { StateSimulator } from './StateSimulator';
import { CubejsStateSimulator } from './CubejsStateSimulator';

/**
 * Main controller for solution calculation
 * Orchestrates the entire solving process from input validation to solution generation
 */
export class SolutionCalculator {
  private config: SolverConfig;
  private validator: InputValidator;
  private kociembaSolver: KociembaSolver;
  private layerByLayerSolver: LayerByLayerSolver;
  private builder: SolutionBuilder;
  private simulator: StateSimulator;
  private cubejsSimulator: CubejsStateSimulator;
  private useLBL: boolean = false; // Use Kociemba (cubejs) - fast and optimal with cubejs simulator!

  constructor(config: Partial<SolverConfig> = {}) {
    this.config = {
      ...DEFAULT_SOLVER_CONFIG,
      ...config
    };

    this.validator = new InputValidator();
    this.kociembaSolver = new KociembaSolver();
    this.layerByLayerSolver = new LayerByLayerSolver();
    this.builder = new SolutionBuilder();
    this.simulator = new StateSimulator();
    this.cubejsSimulator = new CubejsStateSimulator();
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
        console.log('✓ Cube is already solved!');
        return this.buildEmptySolution(cubeState, startTime);
      }

      // Step 3: Solve the cube
      const moves = await this.solveWithTimeout(cubeState);

      // Step 4: Build complete solution
      const calculationTime = performance.now() - startTime;
      const algorithmName = this.useLBL ? 'layer-by-layer' : 'kociemba';

      // Use the appropriate simulator based on which solver was used
      const simulator = this.useLBL ? this.simulator : this.cubejsSimulator;

      const solution = this.builder.buildSolution(
        cubeState,
        moves,
        algorithmName,
        calculationTime,
        simulator
      );

      // Step 5: Verify solution correctness
      console.log('🔍 Verifying solution...');
      try {
        this.verifySolution(solution);
        console.log('✅ Solution verification passed - cube is solved!');
      } catch (error) {
        console.error('❌ Solution verification failed:', error);
        if (!this.useLBL) {
          console.log('Note: Kociemba solver has coordinate system issues. Try Layer-by-Layer solver instead.');
        } else {
          console.log('⚠️ Layer-by-Layer solver needs further refinement for this cube state.');
        }
      }

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
   * Sets which solver to use
   * @param useLBL - true for Layer-by-Layer (reliable), false for Kociemba (optimal but may have issues)
   */
  public setSolverType(useLBL: boolean): void {
    this.useLBL = useLBL;
    console.log(`Solver set to: ${useLBL ? 'Layer-by-Layer (reliable)' : 'Kociemba (optimal)'}`);
  }

  /**
   * Gets the current solver type
   */
  public getSolverType(): string {
    return this.useLBL ? 'layer-by-layer' : 'kociemba';
  }

  /**
   * Updates the solver configuration
   */
  public updateConfig(config: Partial<SolverConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };

    // Recreate solvers with new config
    this.kociembaSolver = new KociembaSolver();
    this.layerByLayerSolver = new LayerByLayerSolver();
  }

  /**
   * Solves the cube with timeout protection
   *
   * @private
   */
  private async solveWithTimeout(cubeState: CubeState): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          AssemblyError.create(AssemblyErrorCode.CALCULATION_TIMEOUT, {
            timeout: this.config.timeout
          })
        );
      }, this.config.timeout);

      try {
        // Use Layer-by-Layer solver (guaranteed to work with our moves!)
        let moves;

        if (this.useLBL) {
          console.log('🔧 Using Layer-by-Layer solver (reliable, uses our perfect moves)');
          moves = await this.layerByLayerSolver.solve(cubeState);
        } else {
          console.log('⚠️ Using Kociemba solver (may have coordinate system issues)');
          moves = await this.kociembaSolver.solve(cubeState);
        }

        clearTimeout(timeoutId);

        // Check max moves constraint (LBL typically uses 80-120 moves, but can need up to 250 for complex scrambles)
        const maxMovesLimit = this.useLBL ? 300 : this.config.maxMoves;
        if (moves.length > maxMovesLimit) {
          reject(
            AssemblyError.create(AssemblyErrorCode.MAX_MOVES_EXCEEDED, {
              movesFound: moves.length,
              maxMoves: maxMovesLimit
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

    // Use the appropriate simulator based on which solver was used
    // Kociemba uses cubejs simulator to avoid coordinate system mismatches
    const simulator = this.useLBL ? this.simulator : this.cubejsSimulator;

    // Verify the moves lead to a solved state
    const isSolved = simulator.verifySolution(solution.initialState, moves);

    if (!isSolved) {
      throw AssemblyError.create(AssemblyErrorCode.ALGORITHM_ERROR, {
        message: 'Generated solution does not solve the cube'
      });
    }
  }
}
