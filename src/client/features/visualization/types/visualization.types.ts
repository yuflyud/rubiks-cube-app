import type { CubeState } from '../../configuration/types';
import type { Solution, AssemblyIncrement } from '../../assembly/types';

/**
 * Playback speed options for animation
 */
export enum PlaybackSpeed {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast'
}

/**
 * Speed configuration mapping
 */
export const SPEED_CONFIG: Record<PlaybackSpeed, { duration: number; autoDelay: number }> = {
  [PlaybackSpeed.SLOW]: {
    duration: 1500,   // 1.5s per move
    autoDelay: 3000   // 3s between moves in auto-play
  },
  [PlaybackSpeed.NORMAL]: {
    duration: 750,    // 0.75s per move
    autoDelay: 1500   // 1.5s between moves
  },
  [PlaybackSpeed.FAST]: {
    duration: 300,    // 0.3s per move
    autoDelay: 600    // 0.6s between moves
  }
};

/**
 * Visualization state
 */
export interface VisualizationState {
  /** The solution being visualized */
  solution: Solution;

  /** Current step index (0 = initial state, 1 = after first move, etc.) */
  currentStep: number;

  /** Total number of steps (moves) */
  totalSteps: number;

  /** Current cube state being displayed */
  currentCubeState: CubeState;

  /** Whether an animation is currently in progress */
  isAnimating: boolean;

  /** Whether auto-play mode is active */
  isPlaying: boolean;

  /** Current playback speed setting */
  playbackSpeed: PlaybackSpeed;

  /** Whether the solution is complete */
  isComplete: boolean;
}

/**
 * Step information for display
 */
export interface StepInfo {
  /** Current step number (1-based for display) */
  current: number;

  /** Total number of steps */
  total: number;

  /** Percentage complete (0-100) */
  percentComplete: number;

  /** Whether user can go to next step */
  canGoNext: boolean;

  /** Whether user can go to previous step */
  canGoPrevious: boolean;

  /** Current move being displayed (null if at initial state) */
  currentMove: AssemblyIncrement | null;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration: number;

  /** CSS easing function */
  easing: string;

  /** Whether to highlight the moving face */
  highlight: boolean;
}

/**
 * Props for VisualizationContainer
 */
export interface VisualizationContainerProps {
  /** Solution to visualize */
  solution: Solution;

  /** Callback when visualization is complete */
  onComplete?: () => void;

  /** Callback when user restarts */
  onRestart?: () => void;

  /** Callback when user wants to configure a new cube */
  onNewCube?: () => void;
}

/**
 * Events emitted by the visualization system
 */
export interface VisualizationEvents {
  /** Fired when step changes */
  'step-change': (stepInfo: StepInfo) => void;

  /** Fired when animation starts */
  'animation-start': () => void;

  /** Fired when animation completes */
  'animation-complete': () => void;

  /** Fired when auto-play starts */
  'play-start': () => void;

  /** Fired when auto-play pauses */
  'play-pause': () => void;

  /** Fired when solution is complete */
  'solution-complete': () => void;

  /** Fired when speed changes */
  'speed-change': (speed: PlaybackSpeed) => void;
}
