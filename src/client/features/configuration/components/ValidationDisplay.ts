import { ValidationResult, ValidationError, FaceletIdentifier } from '../types';

export interface ValidationDisplayProps {
  validationResult: ValidationResult;
  onErrorClick?: (error: ValidationError) => void;
}

/**
 * Displays validation errors and warnings
 */
export class ValidationDisplay {
  private element: HTMLElement;
  private props: ValidationDisplayProps;

  constructor(props: ValidationDisplayProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the validation display element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'validation-display';

    if (this.props.validationResult.isValid) {
      container.classList.add('validation-display--valid');

      const successMessage = document.createElement('div');
      successMessage.className = 'validation-display__success';
      successMessage.innerHTML = `
        <span class="validation-display__icon">✓</span>
        <span>Configuration is valid! Ready to calculate solution.</span>
      `;
      container.appendChild(successMessage);
    } else {
      container.classList.add('validation-display--invalid');

      // Title
      const title = document.createElement('h3');
      title.className = 'validation-display__title';
      title.textContent = 'Configuration Errors';
      container.appendChild(title);

      // Error list
      const errorList = document.createElement('div');
      errorList.className = 'validation-display__errors';

      this.props.validationResult.errors.forEach((error) => {
        const errorItem = this.createErrorItem(error);
        errorList.appendChild(errorItem);
      });

      container.appendChild(errorList);

      // Warnings (if any)
      if (this.props.validationResult.warnings.length > 0) {
        const warningTitle = document.createElement('h4');
        warningTitle.className = 'validation-display__subtitle';
        warningTitle.textContent = 'Warnings';
        container.appendChild(warningTitle);

        const warningList = document.createElement('div');
        warningList.className = 'validation-display__warnings';

        this.props.validationResult.warnings.forEach((warning) => {
          const warningItem = document.createElement('div');
          warningItem.className = 'validation-display__warning';
          warningItem.innerHTML = `
            <span class="validation-display__icon">⚠</span>
            <span class="validation-display__message">${warning.message}</span>
          `;
          warningList.appendChild(warningItem);
        });

        container.appendChild(warningList);
      }
    }

    // ARIA attributes
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'polite');

    return container;
  }

  /**
   * Creates a single error item
   */
  private createErrorItem(error: ValidationError): HTMLElement {
    const errorItem = document.createElement('div');
    errorItem.className = 'validation-display__error';

    if (this.props.onErrorClick && error.affectedFacelets) {
      errorItem.classList.add('validation-display__error--clickable');
      errorItem.addEventListener('click', () => {
        if (this.props.onErrorClick) {
          this.props.onErrorClick(error);
        }
      });
      errorItem.setAttribute('role', 'button');
      errorItem.setAttribute('tabindex', '0');
      errorItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.props.onErrorClick) {
            this.props.onErrorClick(error);
          }
        }
      });
    }

    const icon = document.createElement('span');
    icon.className = 'validation-display__icon';
    icon.textContent = '✕';
    errorItem.appendChild(icon);

    const message = document.createElement('span');
    message.className = 'validation-display__message';
    message.textContent = error.message;
    errorItem.appendChild(message);

    // Add location info if available
    if (error.affectedFacelets && error.affectedFacelets.length > 0) {
      const location = document.createElement('div');
      location.className = 'validation-display__location';
      location.textContent = `Location: ${this.formatLocations(
        error.affectedFacelets
      )}`;
      errorItem.appendChild(location);
    }

    return errorItem;
  }

  /**
   * Formats facelet locations for display
   */
  private formatLocations(facelets: FaceletIdentifier[]): string {
    return facelets.map((f) => `${f.face}${f.position}`).join(', ');
  }

  /**
   * Updates the validation display with new props
   */
  public update(props: Partial<ValidationDisplayProps>): void {
    this.props = { ...this.props, ...props };

    // Recreate the element
    const parent = this.element.parentElement;
    const newElement = this.createElement();

    if (parent) {
      parent.replaceChild(newElement, this.element);
      this.element = newElement;
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
