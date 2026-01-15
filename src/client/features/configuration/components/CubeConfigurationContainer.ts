import {
  Face,
  Color,
  CubeState,
  FaceletPosition,
  FaceletIdentifier,
  ValidationResult
} from '../types';
import { ConfigurationStateManager } from '../logic/ConfigurationStateManager';
import { GuidedFlowManager } from '../logic/GuidedFlowManager';
import { CubeValidator } from '../logic/CubeValidator';
import { CubeDisplay } from './CubeDisplay';
import { ColorPalette } from './ColorPalette';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationControls } from './NavigationControls';
import { ValidationDisplay } from './ValidationDisplay';
import { OrientationGuide } from './OrientationGuide';
import { KEYBOARD_SHORTCUTS } from '../constants';

export interface CubeConfigurationOptions {
  guidedMode?: boolean;
  showKeyboardShortcuts?: boolean;
  autoValidate?: boolean;
  onComplete?: (state: CubeState, validationResult: ValidationResult) => void;
}

/**
 * Main container orchestrating the configuration feature
 */
export class CubeConfigurationContainer {
  private element: HTMLElement;
  private options: CubeConfigurationOptions;

  // Logic components
  private stateManager: ConfigurationStateManager;
  private flowManager: GuidedFlowManager;
  private validator: CubeValidator;

  // UI components
  private cubeDisplay?: CubeDisplay;
  private colorPalette?: ColorPalette;
  private progressIndicator?: ProgressIndicator;
  private navigationControls?: NavigationControls;
  private validationDisplay?: ValidationDisplay;
  private orientationGuide?: OrientationGuide;

  // State
  private selectedFacelet: FaceletIdentifier | null = null;
  private selectedColor: Color | null = null;
  private validationResult: ValidationResult | null = null;
  private errorFacelets: Set<string> = new Set();

  constructor(container: HTMLElement, options: CubeConfigurationOptions = {}) {
    this.element = container;
    this.options = {
      guidedMode: true,
      showKeyboardShortcuts: true,
      autoValidate: false,
      ...options
    };

    // Initialize logic components
    this.stateManager = new ConfigurationStateManager();
    this.flowManager = new GuidedFlowManager();
    this.validator = new CubeValidator();

    // Subscribe to state changes
    this.stateManager.subscribe(this.handleStateChange.bind(this));

    // Initialize UI
    this.render();
    this.setupKeyboardShortcuts();
  }

  /**
   * Renders all UI components
   */
  private render(): void {
    // Clear container
    this.element.innerHTML = '';
    this.element.className = 'cube-configuration-container';

    // Header section
    const header = document.createElement('div');
    header.className = 'cube-configuration__header';

    const title = document.createElement('h1');
    title.className = 'cube-configuration__title';
    title.textContent = 'Configure Your Rubik\'s Cube';
    header.appendChild(title);

    // Progress indicator
    this.progressIndicator = new ProgressIndicator({
      progress: this.stateManager.getProgress()
    });
    header.appendChild(this.progressIndicator.getElement());

    this.element.appendChild(header);

    // Orientation Guide (beginner-friendly with 3D cube)
    this.orientationGuide = new OrientationGuide();
    this.element.appendChild(this.orientationGuide.getElement());

    // Instructions
    if (this.options.guidedMode) {
      const instructions = document.createElement('div');
      instructions.className = 'cube-configuration__instructions';
      instructions.textContent = this.flowManager.getCurrentInstructions();
      this.element.appendChild(instructions);
    }

    // Main content area (2-column layout)
    const content = document.createElement('div');
    content.className = 'cube-configuration__content';

    // Left column: Cube display
    const cubeColumn = document.createElement('div');
    cubeColumn.className = 'cube-configuration__cube-column';

    this.cubeDisplay = new CubeDisplay({
      cubeState: this.stateManager.getCubeState(),
      currentFace: this.options.guidedMode
        ? this.flowManager.getCurrentFace()
        : null,
      selectedFacelet: this.selectedFacelet,
      errorFacelets: this.errorFacelets,
      onFaceletSelect: this.handleFaceletSelect.bind(this)
    });
    cubeColumn.appendChild(this.cubeDisplay.getElement());
    content.appendChild(cubeColumn);

    // Right column: Sticky sidebar with controls
    const controlsColumn = document.createElement('div');
    controlsColumn.className = 'cube-configuration__controls-column';

    const stickySidebar = document.createElement('div');
    stickySidebar.className = 'cube-configuration__sticky-sidebar';

    // Color palette in sidebar
    this.colorPalette = new ColorPalette({
      selectedColor: this.selectedColor,
      colorCounts: this.stateManager.getColorCounts(),
      isComplete: this.stateManager.getCubeState().metadata.isComplete,
      onColorSelect: this.handleColorSelect.bind(this)
    });
    stickySidebar.appendChild(this.colorPalette.getElement());

    // Navigation controls in sidebar
    if (this.options.guidedMode) {
      const state = this.stateManager.getCubeState();
      this.navigationControls = new NavigationControls({
        currentFace: this.flowManager.getCurrentFace(),
        currentStep: this.flowManager.getCurrentStep(),
        totalSteps: this.flowManager.getTotalSteps(),
        canGoBack: this.flowManager.getCurrentStep() > 0,
        canGoForward: this.flowManager.isCurrentFaceComplete(this.stateManager),
        onPrevious: this.handlePrevious.bind(this),
        onNext: this.handleNext.bind(this),
        onComplete: this.handleComplete.bind(this),
        showComplete:
          state.metadata.isComplete &&
          this.flowManager.getCurrentStep() ===
            this.flowManager.getTotalSteps() - 1
      });
      stickySidebar.appendChild(this.navigationControls.getElement());
    }

    controlsColumn.appendChild(stickySidebar);
    content.appendChild(controlsColumn);

    this.element.appendChild(content);

    // Validation display (if there are errors)
    if (this.validationResult && !this.validationResult.isValid) {
      this.validationDisplay = new ValidationDisplay({
        validationResult: this.validationResult,
        onErrorClick: this.handleErrorClick.bind(this)
      });
      this.element.appendChild(this.validationDisplay.getElement());
    }

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'cube-configuration__actions';

    // Validate button
    const validateButton = document.createElement('button');
    validateButton.className = 'cube-configuration__button cube-configuration__button--validate';
    validateButton.textContent = 'Validate Configuration';
    validateButton.disabled = !this.stateManager.getCubeState().metadata.isComplete;
    validateButton.addEventListener('click', () => this.validate());
    actions.appendChild(validateButton);

    // Reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'cube-configuration__button cube-configuration__button--reset';
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => this.reset());
    actions.appendChild(resetButton);

    this.element.appendChild(actions);
  }

  /**
   * Handles facelet selection
   */
  private handleFaceletSelect(face: Face, position: FaceletPosition): void {
    this.selectedFacelet = { face, position };

    // If a color is already selected, assign it immediately
    if (this.selectedColor !== null) {
      this.assignColor();
    } else {
      this.updateUI();
    }
  }

  /**
   * Handles color selection
   */
  private handleColorSelect(color: Color): void {
    this.selectedColor = color;

    // If a facelet is already selected, assign the color immediately
    if (this.selectedFacelet !== null) {
      this.assignColor();
    } else {
      this.updateUI();
    }
  }

  /**
   * Assigns the selected color to the selected facelet
   */
  private assignColor(): void {
    if (this.selectedFacelet && this.selectedColor) {
      const success = this.stateManager.setFaceletColor(
        this.selectedFacelet.face,
        this.selectedFacelet.position,
        this.selectedColor
      );

      if (success) {
        // Clear selection after successful assignment
        this.selectedFacelet = null;
        // Keep color selected for easy consecutive assignments

        // Auto-validate if enabled and complete
        if (
          this.options.autoValidate &&
          this.stateManager.getCubeState().metadata.isComplete
        ) {
          this.validate();
        }
      }
    }
  }

  /**
   * Handles state changes from the state manager
   */
  private handleStateChange(): void {
    this.updateUI();
  }

  /**
   * Updates all UI components
   */
  private updateUI(): void {
    const state = this.stateManager.getCubeState();
    const progress = this.stateManager.getProgress();
    const colorCounts = this.stateManager.getColorCounts();

    // Update cube display
    this.cubeDisplay?.update({
      cubeState: state,
      currentFace: this.options.guidedMode
        ? this.flowManager.getCurrentFace()
        : null,
      selectedFacelet: this.selectedFacelet,
      errorFacelets: this.errorFacelets
    });

    // Update color palette
    this.colorPalette?.update({
      selectedColor: this.selectedColor,
      colorCounts,
      isComplete: state.metadata.isComplete
    });

    // Update progress indicator
    this.progressIndicator?.update({ progress });

    // Update navigation controls
    if (this.navigationControls && this.options.guidedMode) {
      this.navigationControls.update({
        currentFace: this.flowManager.getCurrentFace(),
        currentStep: this.flowManager.getCurrentStep(),
        canGoBack: this.flowManager.getCurrentStep() > 0,
        canGoForward: this.flowManager.isCurrentFaceComplete(this.stateManager),
        showComplete:
          state.metadata.isComplete &&
          this.flowManager.getCurrentStep() ===
            this.flowManager.getTotalSteps() - 1
      });
    }

    // Update instructions
    if (this.options.guidedMode) {
      const instructions = this.element.querySelector(
        '.cube-configuration__instructions'
      ) as HTMLElement;
      if (instructions) {
        instructions.textContent = this.flowManager.getCurrentInstructions();
      }
    }

    // Update validate button state
    const validateButton = this.element.querySelector(
      '.cube-configuration__button--validate'
    ) as HTMLButtonElement;
    if (validateButton) {
      validateButton.disabled = !state.metadata.isComplete;
    }
  }

  /**
   * Handles next button click
   */
  private handleNext(): void {
    const success = this.flowManager.nextFace(this.stateManager);
    if (success) {
      this.updateUI();
    }
  }

  /**
   * Handles previous button click
   */
  private handlePrevious(): void {
    const success = this.flowManager.previousFace(this.stateManager);
    if (success) {
      this.updateUI();
    }
  }

  /**
   * Handles complete button click
   */
  private handleComplete(): void {
    this.validate();
  }

  /**
   * Validates the current configuration
   */
  private validate(): void {
    const state = this.stateManager.getCubeState();
    this.validationResult = this.validator.validate(state);

    // Update error facelets
    this.errorFacelets.clear();
    this.validationResult.errors.forEach((error) => {
      error.affectedFacelets?.forEach((facelet) => {
        this.errorFacelets.add(`${facelet.face}:${facelet.position}`);
      });
    });

    // Update validation display
    if (this.validationDisplay) {
      this.validationDisplay.update({ validationResult: this.validationResult });
    } else if (!this.validationResult.isValid) {
      // Create validation display if it doesn't exist and there are errors
      this.validationDisplay = new ValidationDisplay({
        validationResult: this.validationResult,
        onErrorClick: this.handleErrorClick.bind(this)
      });

      // Insert before actions
      const actions = this.element.querySelector('.cube-configuration__actions');
      if (actions) {
        this.element.insertBefore(
          this.validationDisplay.getElement(),
          actions
        );
      }
    }

    this.updateUI();

    // Call onComplete callback if valid
    if (this.validationResult.isValid && this.options.onComplete) {
      this.options.onComplete(state, this.validationResult);
    }
  }

  /**
   * Handles error click to highlight affected facelets
   */
  private handleErrorClick(): void {
    // Errors are already highlighted via errorFacelets set
    // This could be extended to add additional highlighting or animations
  }

  /**
   * Resets the configuration
   */
  private reset(): void {
    if (confirm('Are you sure you want to reset the configuration?')) {
      this.stateManager.reset();
      this.flowManager.reset(this.stateManager);
      this.selectedFacelet = null;
      this.selectedColor = null;
      this.validationResult = null;
      this.errorFacelets.clear();

      // Remove validation display if it exists
      if (this.validationDisplay) {
        this.validationDisplay.destroy();
        this.validationDisplay = undefined;
      }

      this.updateUI();
    }
  }

  /**
   * Sets up keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    if (!this.options.showKeyboardShortcuts) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent): void => {
      // Don't handle if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const action = KEYBOARD_SHORTCUTS[event.key];

      if (action && typeof action === 'string') {
        // String actions (navigation)
        switch (action) {
          case 'nextFace':
            this.handleNext();
            event.preventDefault();
            break;
          case 'previousFace':
            this.handlePrevious();
            event.preventDefault();
            break;
          case 'complete':
            if (this.stateManager.getCubeState().metadata.isComplete) {
              this.handleComplete();
              event.preventDefault();
            }
            break;
          case 'reset':
            this.reset();
            event.preventDefault();
            break;
        }
      } else if (action) {
        // Color selection
        this.handleColorSelect(action as Color);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Gets the current cube state
   */
  public getState(): Readonly<CubeState> {
    return this.stateManager.getCubeState();
  }

  /**
   * Destroys the container and cleans up
   */
  public destroy(): void {
    this.cubeDisplay?.destroy();
    this.colorPalette?.destroy();
    this.progressIndicator?.destroy();
    this.navigationControls?.destroy();
    this.validationDisplay?.destroy();
    this.orientationGuide?.destroy();

    this.stateManager.unsubscribeAll();
    this.element.innerHTML = '';
  }
}
