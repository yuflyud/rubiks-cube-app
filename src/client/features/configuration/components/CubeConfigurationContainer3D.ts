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
import { Cube3D } from './Cube3D';
import { CubeDisplay } from './CubeDisplay';
import { ColorPalette } from './ColorPalette';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationControls } from './NavigationControls';
import { ValidationDisplay } from './ValidationDisplay';
import { OrientationGuide } from './OrientationGuide';
import { CubeViewToggle } from './CubeViewToggle';
import { KEYBOARD_SHORTCUTS } from '../constants';

export interface CubeConfigurationOptions {
  guidedMode?: boolean;
  showKeyboardShortcuts?: boolean;
  autoValidate?: boolean;
  use3D?: boolean; // New option to enable 3D view
  onComplete?: (state: CubeState, validationResult: ValidationResult) => void;
}

/**
 * Main container orchestrating the configuration feature with 3D support
 */
export class CubeConfigurationContainer3D {
  private element: HTMLElement;
  private options: CubeConfigurationOptions;

  // Logic components
  private stateManager: ConfigurationStateManager;
  private flowManager: GuidedFlowManager;
  private validator: CubeValidator;

  // UI components
  private cubeDisplay?: CubeDisplay;
  private cube3D?: Cube3D;
  private viewToggle?: CubeViewToggle;
  private currentView: '2d' | '3d';
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
      use3D: true, // Default to 3D for better UX
      ...options
    };

    this.currentView = this.options.use3D ? '3d' : '2d';

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

    // Orientation Guide (beginner-friendly)
    this.orientationGuide = new OrientationGuide();
    this.element.appendChild(this.orientationGuide.getElement());

    // View Toggle (2D/3D)
    this.viewToggle = new CubeViewToggle({
      initialView: this.currentView,
      onToggle: this.handleViewToggle.bind(this)
    });
    this.element.appendChild(this.viewToggle.getElement());

    // Instructions
    if (this.options.guidedMode) {
      const instructions = document.createElement('div');
      instructions.className = 'cube-configuration__instructions';
      instructions.textContent = this.flowManager.getCurrentInstructions();
      this.element.appendChild(instructions);
    }

    // Main content area
    const content = document.createElement('div');
    content.className = 'cube-configuration__content';

    // Render cube based on current view
    this.renderCubeView(content);

    // Color palette
    this.colorPalette = new ColorPalette({
      selectedColor: this.selectedColor,
      colorCounts: this.stateManager.getColorCounts(),
      isComplete: this.stateManager.getCubeState().metadata.isComplete,
      onColorSelect: this.handleColorSelect.bind(this)
    });
    content.appendChild(this.colorPalette.getElement());

    this.element.appendChild(content);

    // Navigation controls
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
      this.element.appendChild(this.navigationControls.getElement());
    }

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
   * Renders the cube view (2D or 3D)
   */
  private renderCubeView(container: HTMLElement): void {
    if (this.currentView === '3d') {
      // 3D Cube instructions
      const cube3DInstructions = document.createElement('div');
      cube3DInstructions.className = 'cube-3d-instructions';
      cube3DInstructions.innerHTML = `
        <p><strong>🖱️ Rotate:</strong> Click and drag to rotate the cube</p>
        <p><strong>🖱️ Click:</strong> Click any square to select it, then pick a color below</p>
        <p><strong>🔍 Zoom:</strong> Scroll to zoom in/out</p>
      `;
      container.appendChild(cube3DInstructions);

      // Create 3D cube container
      const cube3DContainer = document.createElement('div');
      cube3DContainer.className = 'cube-3d-container';
      container.appendChild(cube3DContainer);

      // Initialize 3D cube
      this.cube3D = new Cube3D(cube3DContainer, {
        onFaceletSelect: this.handleFaceletSelect.bind(this)
      });

      // Update with current state
      this.cube3D.updateCubeState(this.stateManager.getCubeState());
      if (this.selectedFacelet) {
        this.cube3D.highlightFacelet(this.selectedFacelet);
      }
    } else {
      // 2D Cube
      this.cubeDisplay = new CubeDisplay({
        cubeState: this.stateManager.getCubeState(),
        currentFace: this.options.guidedMode
          ? this.flowManager.getCurrentFace()
          : null,
        selectedFacelet: this.selectedFacelet,
        errorFacelets: this.errorFacelets,
        onFaceletSelect: this.handleFaceletSelect.bind(this)
      });
      container.appendChild(this.cubeDisplay.getElement());
    }
  }

  /**
   * Handles view toggle between 2D and 3D
   */
  private handleViewToggle(view: '2d' | '3d'): void {
    if (this.currentView === view) return;

    this.currentView = view;

    // Destroy current cube view
    if (this.cube3D) {
      this.cube3D.destroy();
      this.cube3D = undefined;
    }
    if (this.cubeDisplay) {
      this.cubeDisplay.destroy();
      this.cubeDisplay = undefined;
    }

    // Re-render
    this.render();
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

    // Update cube display (2D or 3D)
    if (this.currentView === '3d' && this.cube3D) {
      this.cube3D.updateCubeState(state);
      if (this.selectedFacelet) {
        this.cube3D.highlightFacelet(this.selectedFacelet);
      } else {
        this.cube3D.highlightFacelet(null);
      }
    } else if (this.cubeDisplay) {
      this.cubeDisplay.update({
        cubeState: state,
        currentFace: this.options.guidedMode
          ? this.flowManager.getCurrentFace()
          : null,
        selectedFacelet: this.selectedFacelet,
        errorFacelets: this.errorFacelets
      });
    }

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
    this.cube3D?.destroy();
    this.colorPalette?.destroy();
    this.progressIndicator?.destroy();
    this.navigationControls?.destroy();
    this.validationDisplay?.destroy();
    this.orientationGuide?.destroy();
    this.viewToggle?.destroy();

    this.stateManager.unsubscribeAll();
    this.element.innerHTML = '';
  }
}
