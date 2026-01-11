import { Face } from '../types';

export interface NavigationControlsProps {
  currentFace: Face;
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  showComplete: boolean;
}

/**
 * Navigation controls for guided configuration
 */
export class NavigationControls {
  private element: HTMLElement;
  private props: NavigationControlsProps;

  constructor(props: NavigationControlsProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the navigation controls element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'navigation-controls';

    // Current face display
    const faceDisplay = document.createElement('div');
    faceDisplay.className = 'navigation-controls__current';
    faceDisplay.textContent = `Current Face: ${this.props.currentFace}`;
    container.appendChild(faceDisplay);

    // Button container
    const buttons = document.createElement('div');
    buttons.className = 'navigation-controls__buttons';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'navigation-controls__button navigation-controls__button--prev';
    prevButton.textContent = '← Previous';
    prevButton.disabled = !this.props.canGoBack;
    prevButton.addEventListener('click', this.props.onPrevious);
    prevButton.setAttribute('aria-label', 'Go to previous face');
    buttons.appendChild(prevButton);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'navigation-controls__button navigation-controls__button--next';
    nextButton.textContent = 'Next →';
    nextButton.disabled = !this.props.canGoForward;
    nextButton.addEventListener('click', this.props.onNext);
    nextButton.setAttribute('aria-label', 'Go to next face');
    buttons.appendChild(nextButton);

    // Complete button (only shown on last step)
    if (this.props.showComplete) {
      const completeButton = document.createElement('button');
      completeButton.className =
        'navigation-controls__button navigation-controls__button--complete';
      completeButton.textContent = 'Complete Configuration';
      completeButton.addEventListener('click', this.props.onComplete);
      completeButton.setAttribute('aria-label', 'Complete cube configuration');
      buttons.appendChild(completeButton);
    }

    container.appendChild(buttons);

    return container;
  }

  /**
   * Updates the navigation controls with new props
   */
  public update(props: Partial<NavigationControlsProps>): void {
    const oldShowComplete = this.props.showComplete;
    this.props = { ...this.props, ...props };

    // Update face display
    const faceDisplay = this.element.querySelector(
      '.navigation-controls__current'
    ) as HTMLElement;
    faceDisplay.textContent = `Current Face: ${this.props.currentFace}`;

    // Update previous button
    const prevButton = this.element.querySelector(
      '.navigation-controls__button--prev'
    ) as HTMLButtonElement;
    prevButton.disabled = !this.props.canGoBack;

    // Update next button
    const nextButton = this.element.querySelector(
      '.navigation-controls__button--next'
    ) as HTMLButtonElement;
    nextButton.disabled = !this.props.canGoForward;

    // Handle complete button visibility
    if (oldShowComplete !== this.props.showComplete) {
      // Recreate the entire element if complete button visibility changed
      const parent = this.element.parentElement;
      const newElement = this.createElement();

      if (parent) {
        parent.replaceChild(newElement, this.element);
        this.element = newElement;
      }
    }
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
