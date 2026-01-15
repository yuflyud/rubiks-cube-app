import {
  Color,
  CubeState,
  Face,
  CornerPiece,
  EdgePiece,
  FaceletIdentifier,
  ValidationResult,
  ValidationError,
  ValidationErrorCode,
  ColorCount
} from '../types';
import {
  OPPOSITE_COLORS,
  VALID_CORNER_COMBINATIONS,
  VALID_EDGE_COMBINATIONS
} from '../constants';
import { interpolateErrorMessage } from '../types/errors';

/**
 * Validates cube configuration for correctness and solvability
 */
export class CubeValidator {
  /**
   * Main validation entry point
   */
  public validate(cubeState: CubeState): ValidationResult {
    const errors: ValidationError[] = [];

    // Check if configuration is complete
    if (!cubeState.metadata.isComplete) {
      const remaining = 54 - cubeState.metadata.totalConfigured;
      errors.push({
        code: ValidationErrorCode.INCOMPLETE_CONFIGURATION,
        message: interpolateErrorMessage(
          ValidationErrorCode.INCOMPLETE_CONFIGURATION,
          { remaining }
        ),
        severity: 'error'
      });
      // Return early as other validations require complete cube
      return {
        isValid: false,
        errors,
        warnings: []
      };
    }

    // Run all validation checks
    errors.push(...this.validateColorCounts(cubeState));
    errors.push(...this.validateCornerPieces(cubeState));
    errors.push(...this.validateEdgePieces(cubeState));

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validates that each color appears exactly 9 times
   */
  private validateColorCounts(cubeState: CubeState): ValidationError[] {
    const errors: ValidationError[] = [];
    const counts = this.getColorCounts(cubeState);

    Object.entries(counts).forEach(([color, count]) => {
      if (count > 9) {
        errors.push({
          code: ValidationErrorCode.COLOR_OVERUSE,
          message: interpolateErrorMessage(ValidationErrorCode.COLOR_OVERUSE, {
            color,
            count
          }),
          severity: 'error'
        });
      } else if (count < 9) {
        errors.push({
          code: ValidationErrorCode.COLOR_UNDERUSE,
          message: interpolateErrorMessage(ValidationErrorCode.COLOR_UNDERUSE, {
            color,
            count
          }),
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Validates corner pieces have valid color combinations
   */
  private validateCornerPieces(cubeState: CubeState): ValidationError[] {
    const errors: ValidationError[] = [];
    const corners = this.extractCornerPieces(cubeState);

    corners.forEach((corner) => {
      // Check for opposite colors
      const oppositeError = this.checkOppositeColorsInPiece(
        corner.colors,
        corner.positions,
        'corner'
      );
      if (oppositeError) {
        errors.push(oppositeError);
        return;
      }

      // Check for duplicate colors
      const duplicateError = this.checkDuplicateColorsInPiece(
        corner.colors,
        corner.positions
      );
      if (duplicateError) {
        errors.push(duplicateError);
        return;
      }

      // Check against valid combinations
      const combinationKey = [...corner.colors].sort().join('-');
      if (!VALID_CORNER_COMBINATIONS.has(combinationKey)) {
        errors.push({
          code: ValidationErrorCode.INVALID_CORNER,
          message: interpolateErrorMessage(ValidationErrorCode.INVALID_CORNER, {
            locations: this.formatPositions(corner.positions),
            colors: corner.colors.join(', ')
          }),
          severity: 'error',
          affectedFacelets: corner.positions
        });
      }
    });

    return errors;
  }

  /**
   * Validates edge pieces have valid color combinations
   */
  private validateEdgePieces(cubeState: CubeState): ValidationError[] {
    const errors: ValidationError[] = [];
    const edges = this.extractEdgePieces(cubeState);

    edges.forEach((edge) => {
      // Check for opposite colors
      const oppositeError = this.checkOppositeColorsInPiece(
        edge.colors,
        edge.positions,
        'edge'
      );
      if (oppositeError) {
        errors.push(oppositeError);
        return;
      }

      // Check for duplicate colors
      const duplicateError = this.checkDuplicateColorsInPiece(
        edge.colors,
        edge.positions
      );
      if (duplicateError) {
        errors.push(duplicateError);
        return;
      }

      // Check against valid combinations
      const combinationKey = [...edge.colors].sort().join('-');
      if (!VALID_EDGE_COMBINATIONS.has(combinationKey)) {
        errors.push({
          code: ValidationErrorCode.INVALID_EDGE,
          message: interpolateErrorMessage(ValidationErrorCode.INVALID_EDGE, {
            locations: this.formatPositions(edge.positions),
            colors: edge.colors.join(', ')
          }),
          severity: 'error',
          affectedFacelets: edge.positions
        });
      }
    });

    return errors;
  }

  /**
   * Extracts all 8 corner pieces from cube state
   */
  private extractCornerPieces(cubeState: CubeState): CornerPiece[] {
    const corners: CornerPiece[] = [];
    const faces = cubeState.faces;

    // Define corner mappings (each corner has 3 facelets)
    const cornerMappings: [FaceletIdentifier, FaceletIdentifier, FaceletIdentifier][] = [
      // Up-Front-Left
      [
        { face: Face.UP, position: 6 },
        { face: Face.FRONT, position: 0 },
        { face: Face.LEFT, position: 2 }
      ],
      // Up-Front-Right
      [
        { face: Face.UP, position: 8 },
        { face: Face.FRONT, position: 2 },
        { face: Face.RIGHT, position: 0 }
      ],
      // Up-Back-Left
      [
        { face: Face.UP, position: 0 },
        { face: Face.BACK, position: 2 },
        { face: Face.LEFT, position: 0 }
      ],
      // Up-Back-Right
      [
        { face: Face.UP, position: 2 },
        { face: Face.BACK, position: 0 },
        { face: Face.RIGHT, position: 2 }
      ],
      // Down-Front-Left
      [
        { face: Face.DOWN, position: 0 },
        { face: Face.FRONT, position: 6 },
        { face: Face.LEFT, position: 8 }
      ],
      // Down-Front-Right
      [
        { face: Face.DOWN, position: 2 },
        { face: Face.FRONT, position: 8 },
        { face: Face.RIGHT, position: 6 }
      ],
      // Down-Back-Left
      [
        { face: Face.DOWN, position: 6 },
        { face: Face.BACK, position: 8 },
        { face: Face.LEFT, position: 6 }
      ],
      // Down-Back-Right
      [
        { face: Face.DOWN, position: 8 },
        { face: Face.BACK, position: 6 },
        { face: Face.RIGHT, position: 8 }
      ]
    ];

    cornerMappings.forEach((positions) => {
      const colors: [Color, Color, Color] = [
        faces[positions[0].face][positions[0].position]!,
        faces[positions[1].face][positions[1].position]!,
        faces[positions[2].face][positions[2].position]!
      ];

      corners.push({ colors, positions });
    });

    return corners;
  }

  /**
   * Extracts all 12 edge pieces from cube state
   */
  private extractEdgePieces(cubeState: CubeState): EdgePiece[] {
    const edges: EdgePiece[] = [];
    const faces = cubeState.faces;

    // Define edge mappings (each edge has 2 facelets)
    const edgeMappings: [FaceletIdentifier, FaceletIdentifier][] = [
      // Up edges
      [
        { face: Face.UP, position: 1 },
        { face: Face.BACK, position: 1 }
      ],
      [
        { face: Face.UP, position: 3 },
        { face: Face.LEFT, position: 1 }
      ],
      [
        { face: Face.UP, position: 5 },
        { face: Face.RIGHT, position: 1 }
      ],
      [
        { face: Face.UP, position: 7 },
        { face: Face.FRONT, position: 1 }
      ],
      // Down edges
      [
        { face: Face.DOWN, position: 1 },
        { face: Face.FRONT, position: 7 }
      ],
      [
        { face: Face.DOWN, position: 3 },
        { face: Face.LEFT, position: 7 }
      ],
      [
        { face: Face.DOWN, position: 5 },
        { face: Face.RIGHT, position: 7 }
      ],
      [
        { face: Face.DOWN, position: 7 },
        { face: Face.BACK, position: 7 }
      ],
      // Middle edges
      [
        { face: Face.FRONT, position: 3 },
        { face: Face.LEFT, position: 5 }
      ],
      [
        { face: Face.FRONT, position: 5 },
        { face: Face.RIGHT, position: 3 }
      ],
      [
        { face: Face.BACK, position: 3 },
        { face: Face.RIGHT, position: 5 }
      ],
      [
        { face: Face.BACK, position: 5 },
        { face: Face.LEFT, position: 3 }
      ]
    ];

    edgeMappings.forEach((positions) => {
      const colors: [Color, Color] = [
        faces[positions[0].face][positions[0].position]!,
        faces[positions[1].face][positions[1].position]!
      ];

      edges.push({ colors, positions });
    });

    return edges;
  }

  /**
   * Checks for opposite colors in a piece
   */
  private checkOppositeColorsInPiece(
    colors: Color[],
    positions: FaceletIdentifier[],
    pieceType: 'corner' | 'edge'
  ): ValidationError | null {
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        if (this.areOppositeColors(colors[i], colors[j])) {
          const code =
            pieceType === 'corner'
              ? ValidationErrorCode.OPPOSITE_COLORS_CORNER
              : ValidationErrorCode.OPPOSITE_COLORS_EDGE;

          return {
            code,
            message: interpolateErrorMessage(code, {
              color1: colors[i],
              color2: colors[j]
            }),
            severity: 'error',
            affectedFacelets: positions
          };
        }
      }
    }
    return null;
  }

  /**
   * Checks for duplicate colors in a piece
   */
  private checkDuplicateColorsInPiece(
    colors: Color[],
    positions: FaceletIdentifier[]
  ): ValidationError | null {
    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== colors.length) {
      const duplicate = colors.find(
        (color, index) => colors.indexOf(color) !== index
      )!;

      return {
        code: ValidationErrorCode.DUPLICATE_COLORS_PIECE,
        message: interpolateErrorMessage(
          ValidationErrorCode.DUPLICATE_COLORS_PIECE,
          { color: duplicate }
        ),
        severity: 'error',
        affectedFacelets: positions
      };
    }
    return null;
  }

  /**
   * Checks if two colors are opposite
   */
  private areOppositeColors(color1: Color, color2: Color): boolean {
    return OPPOSITE_COLORS.get(color1) === color2;
  }

  /**
   * Gets color counts for the cube
   */
  private getColorCounts(cubeState: CubeState): ColorCount {
    const counts: ColorCount = {
      [Color.WHITE]: 0,
      [Color.YELLOW]: 0,
      [Color.GREEN]: 0,
      [Color.BLUE]: 0,
      [Color.ORANGE]: 0,
      [Color.RED]: 0
    };

    Object.values(cubeState.faces).forEach((face) => {
      face.forEach((color) => {
        if (color !== null) {
          counts[color]++;
        }
      });
    });

    return counts;
  }

  /**
   * Formats positions for error messages
   */
  private formatPositions(positions: FaceletIdentifier[]): string {
    return positions.map((p) => `${p.face}${p.position}`).join(', ');
  }
}
