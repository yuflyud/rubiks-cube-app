import { Face, Color, CubeState, FaceletPosition, FaceletIdentifier } from '../types';
import { FaceGrid, FaceGridProps } from './FaceGrid';

export interface CubeDisplayProps {
  cubeState: CubeState;
  currentFace: Face | null;
  selectedFacelet: FaceletIdentifier | null;
  errorFacelets: Set<string>; // Set of "face:position" strings
  onFaceletSelect: (face: Face, position: FaceletPosition) => void;
}

/**
 * Displays all six faces in an unfolded 2D layout
 * Layout:
 *         [BACK]
 * [LEFT]  [UP]    [RIGHT]
 *         [FRONT]
 *         [DOWN]
 */
export class CubeDisplay {
  private element: HTMLElement;
  private props: CubeDisplayProps;
  private faceGrids: Map<Face, FaceGrid> = new Map();

  constructor(props: CubeDisplayProps) {
    this.props = props;
    this.element = this.createElement();
  }

  /**
   * Creates the cube display element
   */
  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'cube-display';

    // Create layout grid
    const layout = document.createElement('div');
    layout.className = 'cube-display__layout';

    // Create face grids in specific order for layout
    const faceOrder: Face[] = [
      Face.BACK,
      Face.LEFT,
      Face.UP,
      Face.RIGHT,
      Face.FRONT,
      Face.DOWN
    ];

    faceOrder.forEach((face) => {
      const faceGrid = this.createFaceGrid(face);
      this.faceGrids.set(face, faceGrid);

      // Create positioned wrapper
      const wrapper = document.createElement('div');
      wrapper.className = `cube-display__face cube-display__face--${face.toLowerCase()}`;
      wrapper.appendChild(faceGrid.getElement());

      layout.appendChild(wrapper);
    });

    container.appendChild(layout);

    return container;
  }

  /**
   * Creates a face grid for a specific face
   */
  private createFaceGrid(face: Face): FaceGrid {
    const colors = this.props.cubeState.faces[face];
    const isHighlighted = this.props.currentFace === face;
    const selectedPosition =
      this.props.selectedFacelet?.face === face
        ? this.props.selectedFacelet.position
        : null;

    // Build error positions set for this face
    const errorPositions = new Set<FaceletPosition>();
    this.props.errorFacelets.forEach((key) => {
      const [errorFace, errorPos] = key.split(':');
      if (errorFace === face) {
        errorPositions.add(Number(errorPos) as FaceletPosition);
      }
    });

    const props: FaceGridProps = {
      face,
      colors,
      selectedPosition,
      errorPositions,
      isHighlighted,
      onFaceletSelect: this.props.onFaceletSelect
    };

    return new FaceGrid(props);
  }

  /**
   * Updates the cube display with new props
   */
  public update(props: Partial<CubeDisplayProps>): void {
    this.props = { ...this.props, ...props };

    // Update each face grid
    this.faceGrids.forEach((faceGrid, face) => {
      const colors = this.props.cubeState.faces[face];
      const isHighlighted = this.props.currentFace === face;
      const selectedPosition =
        this.props.selectedFacelet?.face === face
          ? this.props.selectedFacelet.position
          : null;

      // Build error positions set for this face
      const errorPositions = new Set<FaceletPosition>();
      this.props.errorFacelets.forEach((key) => {
        const [errorFace, errorPos] = key.split(':');
        if (errorFace === face) {
          errorPositions.add(Number(errorPos) as FaceletPosition);
        }
      });

      faceGrid.update({
        colors,
        selectedPosition,
        errorPositions,
        isHighlighted
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
    this.faceGrids.forEach((faceGrid) => faceGrid.destroy());
    this.faceGrids.clear();
    this.element.remove();
  }
}
