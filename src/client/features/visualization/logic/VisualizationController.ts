import type { CubeState } from '../../configuration/types';
import type { Solution, AssemblyIncrement } from '../../assembly/types';
import { StateSimulator } from '../../assembly/logic/StateSimulator';
import type {
  VisualizationState,
  StepInfo,
  PlaybackSpeed,
  VisualizationContainerProps
} from '../types';
import { SPEED_CONFIG } from '../types';
import { CubeDisplay2D } from '../components/CubeDisplay2D';
import { NavigationControls } from '../components/NavigationControls';
import { PlaybackControls } from '../components/PlaybackControls';
import { MoveDisplay } from '../components/MoveDisplay';
import { CompletionModal } from '../components/CompletionModal';

/**
 * Main controller for the visualization feature
 * Manages state, components, and user interactions
 */
export class VisualizationController {
  private state: VisualizationState;
  private simulator: StateSimulator;
  private container: HTMLElement;

  // Components
  private cubeDisplay: CubeDisplay2D | null = null;
  private navigationControls: NavigationControls | null = null;
  private playbackControls: PlaybackControls | null = null;
  private moveDisplay: MoveDisplay | null = null;
  private completionModal: CompletionModal | null = null;

  // Auto-play timer
  private autoPlayTimer: number | null = null;

  // Callbacks
  private onComplete?: () => void;
  private onRestart?: () => void;
  private onNewCube?: () => void;

  constructor(containerElement: HTMLElement, props: VisualizationContainerProps) {
    this.container = containerElement;
    this.simulator = new StateSimulator();
    this.onComplete = props.onComplete;
    this.onRestart = props.onRestart;
    this.onNewCube = props.onNewCube;

    // Initialize state
    this.state = this.initializeState(props.solution);

    // Initialize UI
    this.initializeUI();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Initial render
    this.updateUI();
  }

  /**
   * Initializes the visualization state
   */
  private initializeState(solution: Solution): VisualizationState {
    return {
      solution,
      currentStep: 0, // 0 = initial state
      totalSteps: solution.totalMoves,
      currentCubeState: solution.initialState,
      isAnimating: false,
      isPlaying: false,
      playbackSpeed: 'normal' as PlaybackSpeed,
      isComplete: false
    };
  }

  /**
   * Initializes all UI components
   */
  private initializeUI(): void {
    // Create main layout
    const layout = document.createElement('div');
    layout.className = 'visualization-layout';

    // Header
    const header = document.createElement('div');
    header.className = 'visualization-header';
    header.innerHTML = `
      <h2 class="visualization-title">Solving Your Cube</h2>
      <p class="visualization-subtitle">Follow along step-by-step</p>
    `;

    // Cube display container
    const cubeContainer = document.createElement('div');
    cubeContainer.className = 'visualization-cube-container';
    this.cubeDisplay = new CubeDisplay2D(cubeContainer, this.state.currentCubeState);

    // Move display container
    const moveContainer = document.createElement('div');
    moveContainer.className = 'visualization-move-container';
    this.moveDisplay = new MoveDisplay(moveContainer);

    // Navigation controls container
    const navContainer = document.createElement('div');
    navContainer.className = 'visualization-nav-container';
    this.navigationControls = new NavigationControls(navContainer, {
      onPrevious: () => this.previousStep(),
      onNext: () => this.nextStep()
    });

    // Playback controls container
    const playbackContainer = document.createElement('div');
    playbackContainer.className = 'visualization-playback-container';
    this.playbackControls = new PlaybackControls(playbackContainer, {
      onPlayPause: () => this.togglePlay(),
      onReset: () => this.reset(),
      onSpeedChange: (speed) => this.setSpeed(speed)
    });

    // Assemble layout
    layout.appendChild(header);
    layout.appendChild(cubeContainer);
    layout.appendChild(moveContainer);
    layout.appendChild(navContainer);
    layout.appendChild(playbackContainer);

    this.container.appendChild(layout);
  }

  /**
   * Advances to the next step
   */
  public async nextStep(): Promise<void> {
    if (this.state.isAnimating || !this.canGoNext()) {
      return;
    }

    this.state.isAnimating = true;
    this.state.currentStep++;

    const increment = this.state.solution.increments[this.state.currentStep - 1];

    // Highlight the moving face
    if (this.cubeDisplay) {
      this.cubeDisplay.highlightFace(increment.face);
    }

    // Animate the move
    await this.animateMove(increment);

    // Update cube state
    this.state.currentCubeState = increment.cubeStateAfter;

    // Update UI
    this.state.isAnimating = false;
    this.updateUI();

    // Check for completion
    if (this.state.currentStep === this.state.totalSteps) {
      this.handleCompletion();
    }

    // Continue auto-play if active
    if (this.state.isPlaying) {
      this.scheduleNextAutoStep();
    }
  }

  /**
   * Returns to the previous step
   */
  public async previousStep(): Promise<void> {
    if (this.state.isAnimating || !this.canGoPrevious()) {
      return;
    }

    // Stop auto-play
    if (this.state.isPlaying) {
      this.pause();
    }

    this.state.isAnimating = true;
    this.state.currentStep--;

    // Get the new current state
    if (this.state.currentStep === 0) {
      this.state.currentCubeState = this.state.solution.initialState;
    } else {
      const increment = this.state.solution.increments[this.state.currentStep - 1];
      this.state.currentCubeState = increment.cubeStateAfter;
    }

    // Animate (simplified - just update)
    await this.delay(300);

    this.state.isAnimating = false;
    this.updateUI();
  }

  /**
   * Toggles auto-play
   */
  private togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Starts auto-play
   */
  private play(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.state.isPlaying = true;
    this.playbackControls?.updatePlayState(true);
    this.scheduleNextAutoStep();
  }

  /**
   * Pauses auto-play
   */
  private pause(): void {
    this.state.isPlaying = false;
    this.playbackControls?.updatePlayState(false);

    if (this.autoPlayTimer !== null) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  /**
   * Schedules the next auto-play step
   */
  private scheduleNextAutoStep(): void {
    if (!this.state.isPlaying) {
      return;
    }

    const delay = SPEED_CONFIG[this.state.playbackSpeed].autoDelay;

    this.autoPlayTimer = window.setTimeout(async () => {
      if (this.canGoNext() && this.state.isPlaying) {
        await this.nextStep();
      } else {
        this.pause();
      }
    }, delay);
  }

  /**
   * Resets to the initial state
   */
  private reset(): void {
    // Stop auto-play
    if (this.state.isPlaying) {
      this.pause();
    }

    this.state.currentStep = 0;
    this.state.currentCubeState = this.state.solution.initialState;
    this.state.isComplete = false;

    this.updateUI();
  }

  /**
   * Sets the playback speed
   */
  private setSpeed(speed: PlaybackSpeed): void {
    this.state.playbackSpeed = speed;
    this.playbackControls?.setSpeed(speed);
  }

  /**
   * Animates a move
   */
  private async animateMove(increment: AssemblyIncrement): Promise<void> {
    const duration = SPEED_CONFIG[this.state.playbackSpeed].duration;

    // Update the cube display with animation
    if (this.cubeDisplay) {
      this.cubeDisplay.updateState(increment.cubeStateAfter, true);
    }

    // Wait for animation to complete
    await this.delay(duration);

    // Clear highlight
    if (this.cubeDisplay) {
      this.cubeDisplay.highlightFace(null);
    }
  }

  /**
   * Updates all UI components
   */
  private updateUI(): void {
    const stepInfo = this.getStepInfo();

    // Update navigation controls
    this.navigationControls?.update(stepInfo);

    // Update cube display
    if (this.cubeDisplay) {
      this.cubeDisplay.updateState(this.state.currentCubeState);
    }

    // Update move display
    this.moveDisplay?.update(stepInfo.currentMove);
  }

  /**
   * Handles solution completion
   */
  private handleCompletion(): void {
    this.state.isComplete = true;
    this.pause();

    // Log final state verification
    console.log('🎯 Solution complete! Verifying final state...');
    const isSolved = this.simulator.isSolved(this.state.currentCubeState);
    if (isSolved) {
      console.log('✅ Cube is fully solved!');
    } else {
      console.log('⚠️ Final state verification: Cube state does not match expected solved state');
      console.log('This may indicate a difference between the solver and move executor');
      console.log('Final cube state:');
      this.logCubeState(this.state.currentCubeState);
    }

    // Show completion modal with final state
    this.completionModal = new CompletionModal(
      this.state.solution,
      {
        onRestart: () => {
          this.reset();
          if (this.onRestart) {
            this.onRestart();
          }
        },
        onNewCube: () => {
          if (this.onNewCube) {
            this.onNewCube();
          }
        },
        onClose: () => {
          // Just close modal
        }
      },
      this.state.currentCubeState
    );

    this.completionModal.show();

    if (this.onComplete) {
      this.onComplete();
    }
  }


  /**
   * Gets current step information
   */
  private getStepInfo(): StepInfo {
    const currentMove =
      this.state.currentStep > 0
        ? this.state.solution.increments[this.state.currentStep - 1]
        : null;

    return {
      current: this.state.currentStep,
      total: this.state.totalSteps,
      percentComplete: (this.state.currentStep / this.state.totalSteps) * 100,
      canGoNext: this.canGoNext(),
      canGoPrevious: this.canGoPrevious(),
      currentMove
    };
  }

  /**
   * Checks if can go to next step
   */
  private canGoNext(): boolean {
    return this.state.currentStep < this.state.totalSteps && !this.state.isAnimating;
  }

  /**
   * Checks if can go to previous step
   */
  private canGoPrevious(): boolean {
    return this.state.currentStep > 0 && !this.state.isAnimating;
  }

  /**
   * Sets up keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.previousStep();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          this.togglePlay();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          this.reset();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Utility to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Destroys the controller and cleans up
   */
  public destroy(): void {
    if (this.autoPlayTimer !== null) {
      clearTimeout(this.autoPlayTimer);
    }

    this.cubeDisplay?.destroy();
    this.navigationControls?.destroy();
    this.playbackControls?.destroy();
    this.moveDisplay?.destroy();
    this.completionModal?.destroy();

    this.container.innerHTML = '';
  }

  /**
   * Logs the cube state for debugging
   */
  private logCubeState(state: CubeState): void {
    const faceMap = {
      'U': 'UP (White)',
      'D': 'DOWN (Yellow)',
      'L': 'LEFT (Orange)',
      'R': 'RIGHT (Red)',
      'F': 'FRONT (Green)',
      'B': 'BACK (Blue)'
    };

    Object.entries(state.faces).forEach(([faceKey, faceColors]) => {
      const faceName = faceMap[faceKey as keyof typeof faceMap] || faceKey;
      const centerColor = faceColors[4];
      const allMatch = faceColors.every(color => color === centerColor);
      console.log(`${faceName}: ${allMatch ? '✓' : '✗'} (center: ${centerColor})`);
      console.log(`  ${faceColors[0]} ${faceColors[1]} ${faceColors[2]}`);
      console.log(`  ${faceColors[3]} ${faceColors[4]} ${faceColors[5]}`);
      console.log(`  ${faceColors[6]} ${faceColors[7]} ${faceColors[8]}`);
    });
  }

}
