import type { CubeState } from '../../configuration/types';
import { Face } from '../../configuration/types';
import type { ValidationResult } from '../types';
import { AssemblyError, AssemblyErrorCode } from '../types/errors';

/**
 * Validates cube states before processing by the solver
 * Ensures the cube state is complete and valid
 */
export class InputValidator {
  /**
   * Validates that the cube state is complete and valid
   */
  public validate(cubeState: CubeState): ValidationResult {
    const errors: string[] = [];

    // Check structure
    if (!this.validateStructure(cubeState)) {
      errors.push('Cube state has invalid structure');
    }

    // Check completeness
    if (!this.isComplete(cubeState)) {
      errors.push('Cube state is incomplete - all 54 facelets must be defined');
    }

    // Check validity (from Feature 1 validation)
    if (errors.length === 0 && !this.isValid(cubeState)) {
      errors.push('Cube state is invalid - color counts or piece positions are incorrect');
    }

    return {
      isValid: errors.length === 0,
      isComplete: this.isComplete(cubeState),
      errors
    };
  }

  /**
   * Checks if all 54 facelets are defined (not null)
   */
  public isComplete(cubeState: CubeState): boolean {
    const faces = [Face.UP, Face.DOWN, Face.LEFT, Face.RIGHT, Face.FRONT, Face.BACK];

    for (const face of faces) {
      const facelets = cubeState.faces[face];

      if (!facelets || facelets.length !== 9) {
        return false;
      }

      // Check that all facelets have a color
      for (const color of facelets) {
        if (color === null || color === undefined) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Basic validation check
   * More comprehensive validation should use Feature 1's CubeValidator
   */
  public isValid(cubeState: CubeState): boolean {
    // Count colors
    const colorCounts: Record<string, number> = {};

    for (const face of Object.values(cubeState.faces)) {
      for (const color of face) {
        if (color) {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    }

    // Each color should appear exactly 9 times
    for (const count of Object.values(colorCounts)) {
      if (count !== 9) {
        return false;
      }
    }

    // Should have exactly 6 colors
    if (Object.keys(colorCounts).length !== 6) {
      return false;
    }

    return true;
  }

  /**
   * Validates the data structure is correct
   */
  public validateStructure(cubeState: CubeState): boolean {
    if (!cubeState || typeof cubeState !== 'object') {
      return false;
    }

    if (!cubeState.faces || typeof cubeState.faces !== 'object') {
      return false;
    }

    // Check all faces exist
    const requiredFaces = [Face.UP, Face.DOWN, Face.LEFT, Face.RIGHT, Face.FRONT, Face.BACK];
    for (const face of requiredFaces) {
      if (!Array.isArray(cubeState.faces[face])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Throws an error if validation fails
   */
  public validateOrThrow(cubeState: CubeState): void {
    const result = this.validate(cubeState);

    if (!result.isValid) {
      if (!result.isComplete) {
        throw AssemblyError.create(
          AssemblyErrorCode.INCOMPLETE_CUBE_STATE,
          { errors: result.errors }
        );
      } else {
        throw AssemblyError.create(
          AssemblyErrorCode.INVALID_CUBE_STATE,
          { errors: result.errors }
        );
      }
    }
  }
}
