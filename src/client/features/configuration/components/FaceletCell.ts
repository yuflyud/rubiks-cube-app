import { Color, FaceletPosition, Face } from '../types';
import { CUBE_COLORS, UI_COLORS } from '../constants';

export interface FaceletCellProps {
  face: Face;
  position: FaceletPosition;
  color: Color | null;
  isCenter: boolean;
  isSelected: boolean;
  hasError: boolean;
  onSelect: (face: Face, position: FaceletPosition) => void;
}

/**
 * Represents a single facelet cell on the cube
 */
export class FaceletCell {
  private element: HTMLElement;
  private props: FaceletCellProps;

  constructor(props: FaceletCellProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the facelet cell element
   */
  private createElement(): HTMLElement {
    const cell = document.createElement('div');
    cell.className = 'facelet-cell';
    cell.dataset.face = this.props.face;
    cell.dataset.position = String(this.props.position);

    // Add classes based on state
    if (this.props.isCenter) {
      cell.classList.add('facelet-cell--center');
    }
    if (this.props.isSelected) {
      cell.classList.add('facelet-cell--selected');
    }
    if (this.props.hasError) {
      cell.classList.add('facelet-cell--error');
    }
    if (this.props.color === null) {
      cell.classList.add('facelet-cell--empty');
    }

    // Set background color
    if (this.props.color) {
      cell.style.backgroundColor = CUBE_COLORS[this.props.color];
    } else {
      cell.style.backgroundColor = UI_COLORS.SURFACE;
    }

    // Add ARIA attributes
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', this.props.isCenter ? '-1' : '0');
    cell.setAttribute(
      'aria-label',
      `${this.props.face} face, position ${this.props.position}${
        this.props.isCenter ? ' (center, fixed)' : ''
      }${this.props.color ? `, color: ${this.props.color}` : ', empty'}`
    );

    // Add click handler
    if (!this.props.isCenter) {
      cell.addEventListener('click', this.handleClick.bind(this));
      cell.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    return cell;
  }

  /**
   * Handles click events
   */
  private handleClick(): void {
    if (!this.props.isCenter) {
      this.props.onSelect(this.props.face, this.props.position);
    }
  }

  /**
   * Handles keyboard events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  }

  /**
   * Updates the facelet with new props
   */
  public update(props: Partial<FaceletCellProps>): void {
    this.props = { ...this.props, ...props };

    // Update classes
    this.element.classList.toggle(
      'facelet-cell--selected',
      this.props.isSelected
    );
    this.element.classList.toggle('facelet-cell--error', this.props.hasError);
    this.element.classList.toggle(
      'facelet-cell--empty',
      this.props.color === null
    );

    // Update background color with animation
    if (this.props.color) {
      this.element.style.backgroundColor = CUBE_COLORS[this.props.color];
    } else {
      this.element.style.backgroundColor = UI_COLORS.SURFACE;
    }

    // Update ARIA label
    this.element.setAttribute(
      'aria-label',
      `${this.props.face} face, position ${this.props.position}${
        this.props.isCenter ? ' (center, fixed)' : ''
      }${this.props.color ? `, color: ${this.props.color}` : ', empty'}`
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
    this.element.removeEventListener('click', this.handleClick.bind(this));
    this.element.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.element.remove();
  }
}
