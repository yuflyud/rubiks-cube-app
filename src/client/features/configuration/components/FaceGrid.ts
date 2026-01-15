import { Face, Color, FaceletPosition } from '../types';
import { FaceletCell, FaceletCellProps } from './FaceletCell';
import { FACE_TO_COLOR, FACE_NAMES } from '../constants';

export interface FaceGridProps {
  face: Face;
  colors: (Color | null)[];
  selectedPosition: FaceletPosition | null;
  errorPositions: Set<FaceletPosition>;
  isHighlighted: boolean;
  onFaceletSelect: (face: Face, position: FaceletPosition) => void;
}

/**
 * Represents a 3x3 grid of facelets for a single face
 */
export class FaceGrid {
  private element: HTMLElement;
  private props: FaceGridProps;
  private faceletCells: FaceletCell[] = [];

  constructor(props: FaceGridProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the face grid element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'face-grid';
    container.dataset.face = this.props.face;

    if (this.props.isHighlighted) {
      container.classList.add('face-grid--highlighted');
    }

    // Create face label with user-friendly name
    const label = document.createElement('div');
    label.className = 'face-grid__label';
    const faceInfo = FACE_NAMES[this.props.face];
    label.innerHTML = `
      <span class="face-name">${faceInfo.name}</span>
      <span class="face-description">${faceInfo.description}</span>
    `;
    container.appendChild(label);

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'face-grid__cells';

    // Create 9 facelet cells
    for (let i = 0; i < 9; i++) {
      const position = i as FaceletPosition;
      const isCenter = position === 4;
      const color = this.props.colors[position];

      const faceletProps: FaceletCellProps = {
        face: this.props.face,
        position,
        color,
        isCenter,
        isSelected: this.props.selectedPosition === position,
        hasError: this.props.errorPositions.has(position),
        onSelect: this.props.onFaceletSelect
      };

      const facelet = new FaceletCell(faceletProps);
      this.faceletCells.push(facelet);
      grid.appendChild(facelet.getElement());
    }

    container.appendChild(grid);

    return container;
  }

  /**
   * Updates the face grid with new props
   */
  public update(props: Partial<FaceGridProps>): void {
    this.props = { ...this.props, ...props };

    // Update highlight state
    this.element.classList.toggle(
      'face-grid--highlighted',
      this.props.isHighlighted
    );

    // Update individual facelets
    this.faceletCells.forEach((facelet, index) => {
      const position = index as FaceletPosition;
      facelet.update({
        color: this.props.colors[position],
        isSelected: this.props.selectedPosition === position,
        hasError: this.props.errorPositions.has(position)
      });
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
    this.faceletCells.forEach((facelet) => facelet.destroy());
    this.faceletCells = [];
    this.element.remove();
  }
}
