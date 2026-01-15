import { Color, ColorCount } from '../types';
import { CUBE_COLORS, UI_COLORS } from '../constants';

export interface ColorPaletteProps {
  selectedColor: Color | null;
  colorCounts: ColorCount;
  isComplete: boolean;
  onColorSelect: (color: Color) => void;
}

/**
 * Color palette for selecting cube colors
 */
export class ColorPalette {
  private element: HTMLElement;
  private props: ColorPaletteProps;
  private colorButtons: Map<Color, HTMLElement> = new Map();

  constructor(props: ColorPaletteProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the color palette element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'color-palette';

    // Create title
    const title = document.createElement('h3');
    title.className = 'color-palette__title';
    title.textContent = 'Select Color';
    container.appendChild(title);

    // Create color buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'color-palette__buttons';

    // Create a button for each color
    const colors: Color[] = [
      Color.WHITE,
      Color.YELLOW,
      Color.GREEN,
      Color.BLUE,
      Color.ORANGE,
      Color.RED
    ];

    colors.forEach((color, index) => {
      const button = this.createColorButton(color, index + 1);
      this.colorButtons.set(color, button);
      buttonsContainer.appendChild(button);
    });

    container.appendChild(buttonsContainer);

    return container;
  }

  /**
   * Creates a single color button
   */
  private createColorButton(color: Color, keyNumber: number): HTMLElement {
    const button = document.createElement('button');
    button.className = 'color-palette__button';
    button.dataset.color = color;
    button.style.backgroundColor = CUBE_COLORS[color];

    // Add selected state
    if (this.props.selectedColor === color) {
      button.classList.add('color-palette__button--selected');
    }

    // Create count badge
    const count = this.props.colorCounts[color];
    const badge = document.createElement('span');
    badge.className = 'color-palette__count';
    badge.textContent = String(count);

    // Add status classes
    if (count > 9) {
      badge.classList.add('color-palette__count--overuse');
    } else if (count < 9 && this.props.isComplete) {
      badge.classList.add('color-palette__count--underuse');
    } else if (count === 9) {
      badge.classList.add('color-palette__count--correct');
    }

    button.appendChild(badge);

    // Add keyboard shortcut hint
    const hint = document.createElement('span');
    hint.className = 'color-palette__hint';
    hint.textContent = String(keyNumber);
    button.appendChild(hint);

    // Add ARIA attributes
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute(
      'aria-label',
      `Select ${color} color (${count}/9) - Press ${keyNumber}`
    );

    // Event handlers
    button.addEventListener('click', () => this.handleColorSelect(color));
    button.addEventListener('keydown', (e) => this.handleKeyDown(e, color));

    return button;
  }

  /**
   * Handles color selection
   */
  private handleColorSelect(color: Color): void {
    this.props.onColorSelect(color);
  }

  /**
   * Handles keyboard events
   */
  private handleKeyDown(event: KeyboardEvent, color: Color): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleColorSelect(color);
    }
  }

  /**
   * Updates the color palette with new props
   */
  public update(props: Partial<ColorPaletteProps>): void {
    this.props = { ...this.props, ...props };

    // Update each color button
    this.colorButtons.forEach((button, color) => {
      const count = this.props.colorCounts[color];
      const badge = button.querySelector('.color-palette__count') as HTMLElement;

      // Update count text
      badge.textContent = String(count);

      // Update status classes
      badge.classList.remove(
        'color-palette__count--overuse',
        'color-palette__count--underuse',
        'color-palette__count--correct'
      );

      if (count > 9) {
        badge.classList.add('color-palette__count--overuse');
      } else if (count < 9 && this.props.isComplete) {
        badge.classList.add('color-palette__count--underuse');
      } else if (count === 9) {
        badge.classList.add('color-palette__count--correct');
      }

      // Update selected state
      button.classList.toggle(
        'color-palette__button--selected',
        this.props.selectedColor === color
      );

      // Update ARIA label
      button.setAttribute(
        'aria-label',
        `Select ${color} color (${count}/9) - Press ${
          Array.from(this.colorButtons.keys()).indexOf(color) + 1
        }`
      );
    });
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
    this.colorButtons.forEach((button) => {
      button.remove();
    });
    this.colorButtons.clear();
    this.element.remove();
  }
}
