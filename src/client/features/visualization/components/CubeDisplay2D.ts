import { Face, Color, type CubeState } from '../../configuration/types';
import { CUBE_COLORS } from '../../configuration/constants';

/**
 * 2D unfolded cube display component
 * Shows the cube in a flat cross pattern:
 *       [U]
 *   [L] [F] [R] [B]
 *       [D]
 */
export class CubeDisplay2D {
  private container: HTMLElement;
  private currentState: CubeState;
  private highlightedFace: Face | null = null;

  constructor(parentElement: HTMLElement, initialState: CubeState) {
    this.currentState = initialState;
    this.container = this.createContainer();
    parentElement.appendChild(this.container);
    this.render();
  }

  /**
   * Updates the cube display with a new state
   */
  public updateState(newState: CubeState, animate: boolean = false): void {
    this.currentState = newState;
    this.render(animate);
  }

  /**
   * Highlights a specific face
   */
  public highlightFace(face: Face | null): void {
    this.highlightedFace = face;
    this.render();
  }

  /**
   * Creates the main container element
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'cube-display-2d';
    return container;
  }

  /**
   * Renders the cube in unfolded 2D format
   */
  private render(animate: boolean = false): void {
    this.container.innerHTML = '';

    // Create cube layout in cross pattern
    const layout = document.createElement('div');
    layout.className = 'cube-layout';

    // Row 1: Up face (centered)
    const row1 = document.createElement('div');
    row1.className = 'cube-row';
    row1.appendChild(this.createSpacer());
    row1.appendChild(this.createFaceGrid(Face.UP, animate));
    row1.appendChild(this.createSpacer());
    row1.appendChild(this.createSpacer());
    layout.appendChild(row1);

    // Row 2: Left, Front, Right, Back faces
    const row2 = document.createElement('div');
    row2.className = 'cube-row';
    row2.appendChild(this.createFaceGrid(Face.LEFT, animate));
    row2.appendChild(this.createFaceGrid(Face.FRONT, animate));
    row2.appendChild(this.createFaceGrid(Face.RIGHT, animate));
    row2.appendChild(this.createFaceGrid(Face.BACK, animate));
    layout.appendChild(row2);

    // Row 3: Down face (centered)
    const row3 = document.createElement('div');
    row3.className = 'cube-row';
    row3.appendChild(this.createSpacer());
    row3.appendChild(this.createFaceGrid(Face.DOWN, animate));
    row3.appendChild(this.createSpacer());
    row3.appendChild(this.createSpacer());
    layout.appendChild(row3);

    this.container.appendChild(layout);
  }

  /**
   * Creates a spacer element for layout
   */
  private createSpacer(): HTMLElement {
    const spacer = document.createElement('div');
    spacer.className = 'cube-face-spacer';
    return spacer;
  }

  /**
   * Creates a 3x3 grid for a single face
   */
  private createFaceGrid(face: Face, animate: boolean): HTMLElement {
    const faceGrid = document.createElement('div');
    faceGrid.className = 'cube-face';
    faceGrid.dataset.face = face;

    // Add highlight if this is the highlighted face
    if (this.highlightedFace === face) {
      faceGrid.classList.add('cube-face--highlighted');
    }

    // Add animation class if animating
    if (animate) {
      faceGrid.classList.add('cube-face--animating');
    }

    // Get face colors
    const faceColors = this.currentState.faces[face];

    // Create 3x3 grid of facelets
    for (let i = 0; i < 9; i++) {
      const facelet = this.createFacelet(faceColors[i], i === 4); // i===4 is center
      faceGrid.appendChild(facelet);
    }

    // Add face label
    const label = document.createElement('div');
    label.className = 'cube-face-label';
    label.textContent = this.getFaceLabel(face);
    faceGrid.appendChild(label);

    return faceGrid;
  }

  /**
   * Creates a single facelet element
   */
  private createFacelet(color: Color | null, isCenter: boolean): HTMLElement {
    const facelet = document.createElement('div');
    facelet.className = 'cube-facelet';

    if (isCenter) {
      facelet.classList.add('cube-facelet--center');
    }

    if (color) {
      const hexColor = CUBE_COLORS[color];
      facelet.style.backgroundColor = hexColor;

      // Add border for white/yellow to make them visible
      if (color === Color.WHITE || color === Color.YELLOW) {
        facelet.style.border = '2px solid rgba(0, 0, 0, 0.2)';
      }
    } else {
      facelet.style.backgroundColor = '#e2e8f0'; // gray for null
    }

    return facelet;
  }

  /**
   * Gets a human-readable label for a face
   */
  private getFaceLabel(face: Face): string {
    const labels: Record<Face, string> = {
      [Face.UP]: 'Top',
      [Face.DOWN]: 'Bottom',
      [Face.LEFT]: 'Left',
      [Face.RIGHT]: 'Right',
      [Face.FRONT]: 'Front',
      [Face.BACK]: 'Back'
    };
    return labels[face];
  }

  /**
   * Destroys the component and cleans up
   */
  public destroy(): void {
    this.container.remove();
  }
}
