import {
  Face,
  Color,
  CubeState,
  ConfigurationProgress,
  ColorCount,
  FaceletPosition
} from '../types';
import {
  createEmptyCubeState,
  cloneCubeState,
  countConfiguredFacelets,
  isConfigurationComplete,
  isCenterPosition
} from '../utils/cubeStateFactory';
import { ObservableState } from './StateObserver';

/**
 * Central state management for cube configuration
 */
export class ConfigurationStateManager extends ObservableState {
  private cubeState: CubeState;
  private progress: ConfigurationProgress;

  constructor(initialState?: Partial<CubeState>) {
    super();

    this.cubeState = initialState
      ? this.mergeWithEmptyState(initialState)
      : createEmptyCubeState();

    this.progress = {
      currentFace: Face.FRONT,
      currentStep: 0,
      totalSteps: 6,
      completedFaces: [],
      percentComplete: this.calculatePercentComplete()
    };
  }

  /**
   * Merges a partial state with an empty cube state
   */
  private mergeWithEmptyState(partial: Partial<CubeState>): CubeState {
    const empty = createEmptyCubeState();

    if (partial.faces) {
      Object.keys(partial.faces).forEach((face) => {
        empty.faces[face as Face] = [...partial.faces![face as Face]];
      });
    }

    return {
      ...empty,
      metadata: {
        ...empty.metadata,
        ...partial.metadata
      }
    };
  }

  /**
   * Assigns a color to a facelet
   * @returns true if assignment was successful
   */
  public setFaceletColor(
    face: Face,
    position: FaceletPosition,
    color: Color
  ): boolean {
    // Prevent modification of center facelets
    if (!this.canModifyFacelet(face, position)) {
      return false;
    }

    this.cubeState.faces[face][position] = color;
    this.updateMetadata();
    this.notifyObservers(this.getCubeState(), this.getProgress());

    return true;
  }

  /**
   * Gets the current color of a facelet
   */
  public getFaceletColor(face: Face, position: FaceletPosition): Color | null {
    return this.cubeState.faces[face][position];
  }

  /**
   * Checks if a facelet can be modified
   */
  public canModifyFacelet(face: Face, position: FaceletPosition): boolean {
    return !isCenterPosition(position);
  }

  /**
   * Gets a readonly copy of the cube state
   */
  public getCubeState(): Readonly<CubeState> {
    return cloneCubeState(this.cubeState);
  }

  /**
   * Gets a readonly copy of the progress
   */
  public getProgress(): Readonly<ConfigurationProgress> {
    return { ...this.progress };
  }

  /**
   * Calculates color counts for all colors
   */
  public getColorCounts(): ColorCount {
    const counts: ColorCount = {
      [Color.WHITE]: 0,
      [Color.YELLOW]: 0,
      [Color.GREEN]: 0,
      [Color.BLUE]: 0,
      [Color.ORANGE]: 0,
      [Color.RED]: 0
    };

    Object.values(this.cubeState.faces).forEach((face) => {
      face.forEach((color) => {
        if (color !== null) {
          counts[color]++;
        }
      });
    });

    return counts;
  }

  /**
   * Updates metadata after a change
   */
  private updateMetadata(): void {
    const totalConfigured = countConfiguredFacelets(this.cubeState);
    const isComplete = isConfigurationComplete(this.cubeState);

    this.cubeState.metadata = {
      totalConfigured,
      isComplete,
      isValid: false, // Validation happens separately
      lastModified: new Date()
    };

    this.progress.percentComplete = this.calculatePercentComplete();
  }

  /**
   * Calculates completion percentage
   */
  private calculatePercentComplete(): number {
    const total = 54;
    const configured = countConfiguredFacelets(this.cubeState);
    return Math.round((configured / total) * 100);
  }

  /**
   * Sets the validation status
   */
  public setValidationStatus(isValid: boolean): void {
    this.cubeState.metadata.isValid = isValid;
    this.notifyObservers(this.getCubeState(), this.getProgress());
  }

  /**
   * Updates the current progress
   */
  public setProgress(progress: Partial<ConfigurationProgress>): void {
    this.progress = {
      ...this.progress,
      ...progress
    };
    this.notifyObservers(this.getCubeState(), this.getProgress());
  }

  /**
   * Resets the cube to empty state (centers remain)
   */
  public reset(): void {
    this.cubeState = createEmptyCubeState();
    this.progress = {
      currentFace: Face.FRONT,
      currentStep: 0,
      totalSteps: 6,
      completedFaces: [],
      percentComplete: this.calculatePercentComplete()
    };
    this.notifyObservers(this.getCubeState(), this.getProgress());
  }

  /**
   * Sets the entire cube state (useful for loading saved states)
   */
  public setState(state: CubeState): void {
    this.cubeState = cloneCubeState(state);
    this.updateMetadata();
    this.notifyObservers(this.getCubeState(), this.getProgress());
  }
}
