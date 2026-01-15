import { FaceletIdentifier } from './cube.types';

/**
 * Validation error codes
 */
export enum ValidationErrorCode {
  // Color count errors
  COLOR_OVERUSE = 'COLOR_OVERUSE',              // > 9 of one color
  COLOR_UNDERUSE = 'COLOR_UNDERUSE',            // < 9 of one color

  // Piece errors
  INVALID_CORNER = 'INVALID_CORNER',            // Invalid corner combination
  INVALID_EDGE = 'INVALID_EDGE',                // Invalid edge combination
  OPPOSITE_COLORS_CORNER = 'OPPOSITE_COLORS_CORNER',  // Opposite colors on corner
  OPPOSITE_COLORS_EDGE = 'OPPOSITE_COLORS_EDGE',      // Opposite colors on edge
  DUPLICATE_COLORS_PIECE = 'DUPLICATE_COLORS_PIECE',  // Same color twice on piece

  // Solvability errors
  UNSOLVABLE_PARITY = 'UNSOLVABLE_PARITY',      // Cube has wrong parity
  UNSOLVABLE_STATE = 'UNSOLVABLE_STATE',        // Physically impossible state

  // Completeness errors
  INCOMPLETE_CONFIGURATION = 'INCOMPLETE_CONFIGURATION'  // Not all facelets set
}

/**
 * Validation error structure
 */
export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  severity: 'error';
  affectedFacelets?: FaceletIdentifier[];
}

/**
 * Validation warning structure
 */
export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'warning';
  affectedFacelets?: FaceletIdentifier[];
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Error messages with templates
 */
export const ERROR_MESSAGES: Record<ValidationErrorCode, string> = {
  [ValidationErrorCode.COLOR_OVERUSE]:
    'The {color} color has been used {count} times. Each color should appear exactly 9 times.',
  [ValidationErrorCode.COLOR_UNDERUSE]:
    'The {color} color has been used {count} times. Each color should appear exactly 9 times.',
  [ValidationErrorCode.INVALID_CORNER]:
    'The corner piece at {locations} has an invalid color combination: {colors}.',
  [ValidationErrorCode.INVALID_EDGE]:
    'The edge piece at {locations} has an invalid color combination: {colors}.',
  [ValidationErrorCode.OPPOSITE_COLORS_CORNER]:
    'The corner piece has opposite colors ({color1} and {color2}) which cannot appear together.',
  [ValidationErrorCode.OPPOSITE_COLORS_EDGE]:
    'The edge piece has opposite colors ({color1} and {color2}) which cannot appear together.',
  [ValidationErrorCode.DUPLICATE_COLORS_PIECE]:
    'The piece has the same color ({color}) appearing twice, which is impossible.',
  [ValidationErrorCode.UNSOLVABLE_PARITY]:
    'This cube configuration is unsolvable due to incorrect permutation parity.',
  [ValidationErrorCode.UNSOLVABLE_STATE]:
    'This cube configuration is physically impossible to achieve.',
  [ValidationErrorCode.INCOMPLETE_CONFIGURATION]:
    'Configuration is incomplete. Please configure all {remaining} remaining facelets.'
};

/**
 * Interpolate error message template with values
 */
export function interpolateErrorMessage(
  code: ValidationErrorCode,
  values: Record<string, string | number>
): string {
  let message = ERROR_MESSAGES[code];

  Object.entries(values).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, String(value));
  });

  return message;
}
