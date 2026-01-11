import type { StepInfo } from '../types';

/**
 * Navigation controls for stepping through the solution
 * Provides Previous, Next, and step indicator
 */
export class NavigationControls {
  private container: HTMLElement;
  private previousButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private stepIndicator: HTMLElement;
  private progressBar: HTMLElement;
  private progressFill: HTMLElement;

  private onPrevious: () => void;
  private onNext: () => void;

  constructor(
    parentElement: HTMLElement,
    callbacks: {
      onPrevious: () => void;
      onNext: () => void;
    }
  ) {
    this.onPrevious = callbacks.onPrevious;
    this.onNext = callbacks.onNext;

    this.container = this.createContainer();
    this.previousButton = this.createPreviousButton();
    this.nextButton = this.createNextButton();
    this.stepIndicator = this.createStepIndicator();
    this.progressBar = this.createProgressBar();
    this.progressFill = this.progressBar.querySelector('.progress-fill') as HTMLElement;

    this.render();
    parentElement.appendChild(this.container);
  }

  /**
   * Updates the controls based on current step info
   */
  public update(stepInfo: StepInfo): void {
    // Update button states
    this.previousButton.disabled = !stepInfo.canGoPrevious;
    this.nextButton.disabled = !stepInfo.canGoNext;

    // Update step indicator
    this.stepIndicator.textContent = `Step ${stepInfo.current} of ${stepInfo.total}`;

    // Update progress bar
    this.progressFill.style.width = `${stepInfo.percentComplete}%`;

    // Update aria labels
    this.previousButton.setAttribute(
      'aria-label',
      `Go to previous step. ${stepInfo.canGoPrevious ? '' : 'Already at first step.'}`
    );
    this.nextButton.setAttribute(
      'aria-label',
      `Go to next step. ${stepInfo.canGoNext ? '' : 'Already at last step.'}`
    );
  }

  /**
   * Creates the main container
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'navigation-controls';
    return container;
  }

  /**
   * Creates the previous button
   */
  private createPreviousButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'nav-button nav-button--previous';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      <span>Previous</span>
    `;
    button.setAttribute('aria-label', 'Go to previous step');
    button.addEventListener('click', () => this.onPrevious());
    return button;
  }

  /**
   * Creates the next button
   */
  private createNextButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'nav-button nav-button--next';
    button.innerHTML = `
      <span>Next</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Go to next step');
    button.addEventListener('click', () => this.onNext());
    return button;
  }

  /**
   * Creates the step indicator text
   */
  private createStepIndicator(): HTMLElement {
    const indicator = document.createElement('div');
    indicator.className = 'step-indicator';
    indicator.textContent = 'Step 0 of 0';
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    return indicator;
  }

  /**
   * Creates the progress bar
   */
  private createProgressBar(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'progress-bar-container';

    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = '0%';

    bar.appendChild(fill);
    container.appendChild(bar);

    return container;
  }

  /**
   * Renders all components into the container
   */
  private render(): void {
    this.container.innerHTML = '';

    const controlsRow = document.createElement('div');
    controlsRow.className = 'controls-row';

    controlsRow.appendChild(this.previousButton);
    controlsRow.appendChild(this.stepIndicator);
    controlsRow.appendChild(this.nextButton);

    this.container.appendChild(controlsRow);
    this.container.appendChild(this.progressBar);
  }

  /**
   * Destroys the component
   */
  public destroy(): void {
    this.container.remove();
  }
}
