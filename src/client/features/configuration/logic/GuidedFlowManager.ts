import { Face } from '../types';
import { ConfigurationStateManager } from './ConfigurationStateManager';
import { isFaceComplete } from '../utils/cubeStateFactory';

/**
 * Instructions for each face
 */
const FACE_INSTRUCTIONS: Record<Face, string> = {
  [Face.FRONT]:
    'Configure the front face (green center). Look at the face facing you.',
  [Face.RIGHT]:
    'Configure the right face (red center). Rotate the cube or look at the right side.',
  [Face.BACK]:
    'Configure the back face (blue center). Look at the face opposite to you.',
  [Face.LEFT]:
    'Configure the left face (orange center). Rotate the cube or look at the left side.',
  [Face.UP]:
    'Configure the top face (white center). Look at the face on top of the cube.',
  [Face.DOWN]:
    'Configure the bottom face (yellow center). Look at the face at the bottom of the cube.'
};

/**
 * Manages step-by-step guided configuration flow
 */
export class GuidedFlowManager {
  private faceOrder: Face[];
  private currentIndex: number;

  constructor() {
    this.faceOrder = [
      Face.FRONT,
      Face.RIGHT,
      Face.BACK,
      Face.LEFT,
      Face.UP,
      Face.DOWN
    ];
    this.currentIndex = 0;
  }

  /**
   * Gets the current face being configured
   */
  public getCurrentFace(): Face {
    return this.faceOrder[this.currentIndex];
  }

  /**
   * Gets the current step number (0-5)
   */
  public getCurrentStep(): number {
    return this.currentIndex;
  }

  /**
   * Gets instructions for the current face
   */
  public getCurrentInstructions(): string {
    return FACE_INSTRUCTIONS[this.getCurrentFace()];
  }

  /**
   * Advances to the next face if current is complete
   * @returns true if advanced successfully, false if cannot advance
   */
  public nextFace(stateManager: ConfigurationStateManager): boolean {
    // Check if current face is complete
    if (!this.isCurrentFaceComplete(stateManager)) {
      return false;
    }

    // Check if already at last face
    if (this.currentIndex >= this.faceOrder.length - 1) {
      return false;
    }

    this.currentIndex++;
    this.updateStateManagerProgress(stateManager);
    return true;
  }

  /**
   * Returns to the previous face
   * @returns true if went back successfully, false if at first face
   */
  public previousFace(stateManager: ConfigurationStateManager): boolean {
    if (this.currentIndex <= 0) {
      return false;
    }

    this.currentIndex--;
    this.updateStateManagerProgress(stateManager);
    return true;
  }

  /**
   * Checks if the current face is complete
   */
  public isCurrentFaceComplete(stateManager: ConfigurationStateManager): boolean {
    const state = stateManager.getCubeState();
    return isFaceComplete(state, this.getCurrentFace());
  }

  /**
   * Gets list of completed faces
   */
  public getCompletedFaces(stateManager: ConfigurationStateManager): Face[] {
    const state = stateManager.getCubeState();
    return this.faceOrder.filter((face) => isFaceComplete(state, face));
  }

  /**
   * Gets list of remaining faces
   */
  public getRemainingFaces(stateManager: ConfigurationStateManager): Face[] {
    const completedFaces = this.getCompletedFaces(stateManager);
    return this.faceOrder.filter((face) => !completedFaces.includes(face));
  }

  /**
   * Checks if all faces are complete
   */
  public isComplete(stateManager: ConfigurationStateManager): boolean {
    const state = stateManager.getCubeState();
    return state.metadata.isComplete;
  }

  /**
   * Updates the state manager with current progress
   */
  private updateStateManagerProgress(
    stateManager: ConfigurationStateManager
  ): void {
    stateManager.setProgress({
      currentFace: this.getCurrentFace(),
      currentStep: this.currentIndex,
      totalSteps: 6,
      completedFaces: this.getCompletedFaces(stateManager)
    });
  }

  /**
   * Resets the flow to the first face
   */
  public reset(stateManager: ConfigurationStateManager): void {
    this.currentIndex = 0;
    this.updateStateManagerProgress(stateManager);
  }

  /**
   * Gets the total number of steps
   */
  public getTotalSteps(): number {
    return this.faceOrder.length;
  }

  /**
   * Jumps to a specific face (if allowed)
   */
  public jumpToFace(face: Face, stateManager: ConfigurationStateManager): boolean {
    const faceIndex = this.faceOrder.indexOf(face);
    if (faceIndex === -1) {
      return false;
    }

    this.currentIndex = faceIndex;
    this.updateStateManagerProgress(stateManager);
    return true;
  }
}
