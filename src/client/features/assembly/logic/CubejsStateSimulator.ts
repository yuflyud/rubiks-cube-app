import type { CubeState } from '../../configuration/types';
import { MoveNotation } from '../types';
import { cubeStateToFaceletString, faceletStringToCubeState } from './CubeFormatBridge';
// @ts-ignore - cubejs doesn't have TypeScript definitions
import Cube from 'cubejs';

/**
 * State simulator that uses cubejs for move application
 *
 * This bypasses coordinate system mismatches between cubejs and MoveExecutor
 * by using cubejs for both solving AND applying moves during visualization.
 *
 * This is the reliable approach that guarantees the solution will work.
 */
export class CubejsStateSimulator {
  /**
   * Maps our MoveNotation enum to cubejs move tokens
   */
  private moveNotationToToken(move: MoveNotation): string {
    const map: Record<MoveNotation, string> = {
      [MoveNotation.U]: 'U',
      [MoveNotation.U_PRIME]: "U'",
      [MoveNotation.U2]: 'U2',
      [MoveNotation.D]: 'D',
      [MoveNotation.D_PRIME]: "D'",
      [MoveNotation.D2]: 'D2',
      [MoveNotation.L]: 'L',
      [MoveNotation.L_PRIME]: "L'",
      [MoveNotation.L2]: 'L2',
      [MoveNotation.R]: 'R',
      [MoveNotation.R_PRIME]: "R'",
      [MoveNotation.R2]: 'R2',
      [MoveNotation.F]: 'F',
      [MoveNotation.F_PRIME]: "F'",
      [MoveNotation.F2]: 'F2',
      [MoveNotation.B]: 'B',
      [MoveNotation.B_PRIME]: "B'",
      [MoveNotation.B2]: 'B2',
    };
    return map[move];
  }

  /**
   * Applies a single move to cube state using cubejs
   */
  public applyMove(state: CubeState, move: MoveNotation): CubeState {
    // Convert our state to facelet string
    const faceletString = cubeStateToFaceletString(state);

    // Create cubejs cube and apply move
    const cube = Cube.fromString(faceletString);
    const moveToken = this.moveNotationToToken(move);
    cube.move(moveToken);

    // Convert back to our format
    const resultFaceletString = cube.asString();
    return faceletStringToCubeState(resultFaceletString);
  }

  /**
   * Applies a sequence of moves using cubejs
   */
  public applyMoves(state: CubeState, moves: MoveNotation[]): CubeState {
    // Convert our state to facelet string
    const faceletString = cubeStateToFaceletString(state);

    // Create cubejs cube and apply all moves
    const cube = Cube.fromString(faceletString);
    const moveTokens = moves.map(m => this.moveNotationToToken(m)).join(' ');
    cube.move(moveTokens);

    // Convert back to our format
    const resultFaceletString = cube.asString();
    return faceletStringToCubeState(resultFaceletString);
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
    let currentFaceletString = cubeStateToFaceletString(initialState);

    for (const move of moves) {
      // Apply move with cubejs
      const cube = Cube.fromString(currentFaceletString);
      const moveToken = this.moveNotationToToken(move);
      cube.move(moveToken);
      currentFaceletString = cube.asString();

      // Convert to our format and save
      const state = faceletStringToCubeState(currentFaceletString);
      states.push(state);
    }

    return states;
  }

  /**
   * Verifies that a move sequence solves the cube
   */
  public verifySolution(initialState: CubeState, moves: MoveNotation[]): boolean {
    console.log(`🔍 Verifying solution with cubejs (${moves.length} moves)...`);

    const finalState = this.applyMoves(initialState, moves);
    const solved = this.isSolved(finalState);

    if (solved) {
      console.log('✅ Solution verified - cube is solved!');
    } else {
      console.log('❌ Solution failed - cube is NOT solved');
      this.logCubeState(finalState);
    }

    return solved;
  }

  /**
   * Checks if cube is solved
   */
  public isSolved(state: CubeState): boolean {
    for (const face of Object.values(state.faces)) {
      const centerColor = face[4];
      if (!face.every(color => color === centerColor)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Logs the cube state for debugging
   */
  private logCubeState(state: CubeState): void {
    const faceMap = {
      'UP': 'White',
      'RIGHT': 'Red',
      'FRONT': 'Green',
      'DOWN': 'Yellow',
      'LEFT': 'Orange',
      'BACK': 'Blue'
    };

    console.log('Cube state:');
    for (const [faceName, colors] of Object.entries(state.faces)) {
      const centerColor = colors[4];
      const allMatch = colors.every(c => c === centerColor);
      console.log(`  ${faceMap[faceName as keyof typeof faceMap]} (${faceName}): ${allMatch ? '✓' : '✗'} (center: ${centerColor})`);
      console.log(`    ${colors[0]} ${colors[1]} ${colors[2]}`);
      console.log(`    ${colors[3]} ${colors[4]} ${colors[5]}`);
      console.log(`    ${colors[6]} ${colors[7]} ${colors[8]}`);
    }
  }
}
