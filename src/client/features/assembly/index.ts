/**
 * Feature 2: Rubik's Cube Assembly Mechanism
 *
 * Calculates the optimal sequence of moves required to solve the cube
 * based on the user's configuration from Feature 1.
 */

// Export types
export * from './types';

// Export main API
export { SolutionCalculator } from './logic/SolutionCalculator';
export { StateSimulator } from './logic/StateSimulator';
export { SolutionBuilder } from './logic/SolutionBuilder';
export { KociembaSolver } from './logic/KociembaSolver';

// Export constants
export { MOVE_DETAILS, ALL_MOVES, BASIC_MOVES, FACE_NAMES, FACE_NAMES_WITH_COLORS } from './constants';

// Import styles
import './styles/assembly.css';
