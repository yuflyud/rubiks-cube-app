/**
 * Feature 3: Rubik's Cube Assembly Visualization
 *
 * Provides an interactive, animated visualization of the solution process,
 * allowing users to follow along step-by-step.
 */

// Export types
export * from './types';

// Export main controller
export { VisualizationController } from './logic/VisualizationController';

// Export components
export { CubeDisplay2D } from './components/CubeDisplay2D';
export { NavigationControls } from './components/NavigationControls';
export { PlaybackControls } from './components/PlaybackControls';
export { MoveDisplay } from './components/MoveDisplay';
export { CompletionModal } from './components/CompletionModal';

// Import styles
import './styles/visualization.css';
