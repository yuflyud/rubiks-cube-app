/**
 * Error codes for assembly/solving operations
 */
export enum AssemblyErrorCode {
  /** Cube state is invalid and cannot be solved */
  INVALID_CUBE_STATE = 'INVALID_CUBE_STATE',

  /** Cube state is incomplete (missing facelets) */
  INCOMPLETE_CUBE_STATE = 'INCOMPLETE_CUBE_STATE',

  /** Cube configuration is physically impossible to solve */
  UNSOLVABLE_CUBE = 'UNSOLVABLE_CUBE',

  /** Solution calculation exceeded timeout limit */
  CALCULATION_TIMEOUT = 'CALCULATION_TIMEOUT',

  /** Solving algorithm encountered an error */
  ALGORITHM_ERROR = 'ALGORITHM_ERROR',

  /** Maximum number of moves exceeded */
  MAX_MOVES_EXCEEDED = 'MAX_MOVES_EXCEEDED',

  /** Cube is already solved */
  ALREADY_SOLVED = 'ALREADY_SOLVED'
}

/**
 * User-friendly error messages for each error code
 */
export const ASSEMBLY_ERROR_MESSAGES: Record<AssemblyErrorCode, string> = {
  [AssemblyErrorCode.INVALID_CUBE_STATE]:
    'The cube state is invalid and cannot be solved. Please check your configuration.',

  [AssemblyErrorCode.INCOMPLETE_CUBE_STATE]:
    'The cube state is incomplete. All 54 facelets must be configured.',

  [AssemblyErrorCode.UNSOLVABLE_CUBE]:
    'This cube configuration cannot be solved. It may be physically impossible.',

  [AssemblyErrorCode.CALCULATION_TIMEOUT]:
    'Solution calculation timed out. The cube may be too complex.',

  [AssemblyErrorCode.ALGORITHM_ERROR]:
    'The solving algorithm encountered an unexpected error.',

  [AssemblyErrorCode.MAX_MOVES_EXCEEDED]:
    'Could not find a solution within the maximum move limit.',

  [AssemblyErrorCode.ALREADY_SOLVED]:
    'The cube is already in a solved state. No moves needed.'
};

/**
 * Custom error class for assembly operations
 */
export class AssemblyError extends Error {
  constructor(
    public code: AssemblyErrorCode,
    message?: string,
    public details?: unknown
  ) {
    super(message || ASSEMBLY_ERROR_MESSAGES[code]);
    this.name = 'AssemblyError';

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssemblyError);
    }
  }

  /**
   * Creates an AssemblyError with details
   */
  static create(code: AssemblyErrorCode, details?: unknown): AssemblyError {
    return new AssemblyError(code, ASSEMBLY_ERROR_MESSAGES[code], details);
  }
}
