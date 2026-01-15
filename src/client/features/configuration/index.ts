/**
 * Rubik's Cube Configuration Feature
 * Public API for Feature 1: Configuration
 */

export { CubeConfigurationContainer } from './components/CubeConfigurationContainer';
export type { CubeConfigurationOptions } from './components/CubeConfigurationContainer';

export * from './types';
export { ConfigurationStateManager } from './logic/ConfigurationStateManager';
export { GuidedFlowManager } from './logic/GuidedFlowManager';
export { CubeValidator } from './logic/CubeValidator';

// Import styles
import './styles/configuration.modern.css';
