import { Face, Color } from './types';

/**
 * Maps each face to its standard center color
 */
export const FACE_TO_COLOR: Record<Face, Color> = {
  [Face.UP]: Color.WHITE,
  [Face.DOWN]: Color.YELLOW,
  [Face.FRONT]: Color.GREEN,
  [Face.BACK]: Color.BLUE,
  [Face.LEFT]: Color.ORANGE,
  [Face.RIGHT]: Color.RED
};

/**
 * Hex color values for each cube color
 */
export const CUBE_COLORS: Record<Color, string> = {
  [Color.WHITE]: '#FFFFFF',
  [Color.YELLOW]: '#FFD500',
  [Color.GREEN]: '#009B48',
  [Color.BLUE]: '#0046AD',
  [Color.ORANGE]: '#FF5800',
  [Color.RED]: '#B71234'
};

/**
 * UI color palette
 */
export const UI_COLORS = {
  BACKGROUND: '#F5F5F5',
  SURFACE: '#FFFFFF',
  PRIMARY: '#2196F3',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
  HIGHLIGHT: '#FFC107',
  DISABLED: '#BDBDBD'
} as const;

/**
 * Spacing system
 */
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px'
} as const;

/**
 * Facelet sizes for different breakpoints
 */
export const FACELET_SIZE = {
  MOBILE: 40,
  TABLET: 50,
  DESKTOP: 60
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS: Record<string, Color | string> = {
  // Color selection
  '1': Color.WHITE,
  '2': Color.YELLOW,
  '3': Color.GREEN,
  '4': Color.BLUE,
  '5': Color.ORANGE,
  '6': Color.RED,

  // Navigation
  'ArrowRight': 'nextFace',
  'ArrowLeft': 'previousFace',
  'Enter': 'complete',
  'Escape': 'reset'
};

/**
 * Opposite color pairs (never appear on same piece)
 */
export const OPPOSITE_COLORS: Map<Color, Color> = new Map([
  [Color.WHITE, Color.YELLOW],
  [Color.YELLOW, Color.WHITE],
  [Color.GREEN, Color.BLUE],
  [Color.BLUE, Color.GREEN],
  [Color.ORANGE, Color.RED],
  [Color.RED, Color.ORANGE]
]);

/**
 * Valid corner combinations (sorted alphabetically)
 */
export const VALID_CORNER_COMBINATIONS: Set<string> = new Set([
  'BLUE-ORANGE-WHITE',   // Up-Back-Left
  'BLUE-RED-WHITE',      // Up-Back-Right
  'BLUE-ORANGE-YELLOW',  // Down-Back-Left
  'BLUE-RED-YELLOW',     // Down-Back-Right
  'GREEN-ORANGE-WHITE',  // Up-Front-Left
  'GREEN-RED-WHITE',     // Up-Front-Right
  'GREEN-ORANGE-YELLOW', // Down-Front-Left
  'GREEN-RED-YELLOW'     // Down-Front-Right
]);

/**
 * Valid edge combinations (sorted alphabetically)
 */
export const VALID_EDGE_COMBINATIONS: Set<string> = new Set([
  'BLUE-ORANGE',   // Back-Left
  'BLUE-RED',      // Back-Right
  'BLUE-WHITE',    // Up-Back
  'BLUE-YELLOW',   // Down-Back
  'GREEN-ORANGE',  // Front-Left
  'GREEN-RED',     // Front-Right
  'GREEN-WHITE',   // Up-Front
  'GREEN-YELLOW',  // Down-Front
  'ORANGE-WHITE',  // Up-Left
  'ORANGE-YELLOW', // Down-Left
  'RED-WHITE',     // Up-Right
  'RED-YELLOW'     // Down-Right
]);

/**
 * Performance targets (in milliseconds)
 */
export const PERFORMANCE_TARGETS = {
  COLOR_ASSIGNMENT_RESPONSE: 100,
  VALIDATION_COMPLETE: 500,
  RENDER_FPS: 60,
  STATE_UPDATE_BATCH: 16
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION = {
  FACELET_HOVER: 200,
  FACELET_SELECT: 250,
  COLOR_CHANGE: 300,
  ERROR_HIGHLIGHT: 400,
  PROGRESS_UPDATE: 500
} as const;
