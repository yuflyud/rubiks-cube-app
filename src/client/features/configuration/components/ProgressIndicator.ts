import { ConfigurationProgress, Face } from '../types';

export interface ProgressIndicatorProps {
  progress: ConfigurationProgress;
}

/**
 * Displays configuration progress
 */
export class ProgressIndicator {
  private element: HTMLElement;
  private props: ProgressIndicatorProps;

  constructor(props: ProgressIndicatorProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the progress indicator element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'progress-indicator';

    // Step counter
    const stepCounter = document.createElement('div');
    stepCounter.className = 'progress-indicator__step';
    stepCounter.textContent = `Step ${this.props.progress.currentStep + 1} of ${
      this.props.progress.totalSteps
    }`;
    container.appendChild(stepCounter);

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator__bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-indicator__fill';
    progressFill.style.width = `${this.props.progress.percentComplete}%`;

    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);

    // Percentage text
    const percentage = document.createElement('div');
    percentage.className = 'progress-indicator__percentage';
    percentage.textContent = `${this.props.progress.percentComplete}%`;
    container.appendChild(percentage);

    // Face indicators
    const faceIndicators = document.createElement('div');
    faceIndicators.className = 'progress-indicator__faces';

    const allFaces: Face[] = [
      Face.FRONT,
      Face.RIGHT,
      Face.BACK,
      Face.LEFT,
      Face.UP,
      Face.DOWN
    ];

    allFaces.forEach((face) => {
      const indicator = document.createElement('div');
      indicator.className = 'progress-indicator__face';
      indicator.textContent = face;

      if (this.props.progress.completedFaces.includes(face)) {
        indicator.classList.add('progress-indicator__face--completed');
      }
      if (this.props.progress.currentFace === face) {
        indicator.classList.add('progress-indicator__face--current');
      }

      faceIndicators.appendChild(indicator);
    });

    container.appendChild(faceIndicators);

    // ARIA attributes
    container.setAttribute('role', 'progressbar');
    container.setAttribute('aria-valuenow', String(this.props.progress.percentComplete));
    container.setAttribute('aria-valuemin', '0');
    container.setAttribute('aria-valuemax', '100');
    container.setAttribute(
      'aria-label',
      `Configuration progress: ${this.props.progress.percentComplete}% complete`
    );

    return container;
  }

  /**
   * Updates the progress indicator with new props
   */
  public update(props: Partial<ProgressIndicatorProps>): void {
    this.props = { ...this.props, ...props };

    // Update step counter
    const stepCounter = this.element.querySelector(
      '.progress-indicator__step'
    ) as HTMLElement;
    stepCounter.textContent = `Step ${this.props.progress.currentStep + 1} of ${
      this.props.progress.totalSteps
    }`;

    // Update progress bar
    const progressFill = this.element.querySelector(
      '.progress-indicator__fill'
    ) as HTMLElement;
    progressFill.style.width = `${this.props.progress.percentComplete}%`;

    // Update percentage
    const percentage = this.element.querySelector(
      '.progress-indicator__percentage'
    ) as HTMLElement;
    percentage.textContent = `${this.props.progress.percentComplete}%`;

    // Update face indicators
    const faceIndicators = this.element.querySelectorAll(
      '.progress-indicator__face'
    );
    const allFaces: Face[] = [
      Face.FRONT,
      Face.RIGHT,
      Face.BACK,
      Face.LEFT,
      Face.UP,
      Face.DOWN
    ];

    faceIndicators.forEach((indicator, index) => {
      const face = allFaces[index];
      indicator.classList.toggle(
        'progress-indicator__face--completed',
        this.props.progress.completedFaces.includes(face)
      );
      indicator.classList.toggle(
        'progress-indicator__face--current',
        this.props.progress.currentFace === face
      );
    });

    // Update ARIA attributes
    this.element.setAttribute('aria-valuenow', String(this.props.progress.percentComplete));
    this.element.setAttribute(
      'aria-label',
      `Configuration progress: ${this.props.progress.percentComplete}% complete`
    );
  }

  /**
   * Gets the DOM element
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroys the component
   */
  public destroy(): void {
    this.element.remove();
  }
}
