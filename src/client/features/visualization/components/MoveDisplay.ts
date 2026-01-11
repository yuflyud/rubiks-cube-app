import type { AssemblyIncrement } from '../../assembly/types';
import { FACE_NAMES } from '../../assembly/constants';

/**
 * Displays the current move information
 * Shows notation, face, direction, and description
 */
export class MoveDisplay {
  private container: HTMLElement;
  private notationElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private faceInfoElement: HTMLElement;

  constructor(parentElement: HTMLElement) {
    this.container = this.createContainer();
    this.notationElement = this.createNotationElement();
    this.descriptionElement = this.createDescriptionElement();
    this.faceInfoElement = this.createFaceInfoElement();

    this.render();
    parentElement.appendChild(this.container);
    this.showInitialState();
  }

  /**
   * Updates the display with a new move
   */
  public update(move: AssemblyIncrement | null): void {
    if (move) {
      this.showMove(move);
    } else {
      this.showInitialState();
    }
  }

  /**
   * Shows the initial state message
   */
  private showInitialState(): void {
    this.container.classList.remove('move-display--active');
    this.notationElement.textContent = '--';
    this.descriptionElement.textContent = 'Initial cube state';
    this.faceInfoElement.textContent = 'Ready to start';
  }

  /**
   * Shows a move
   */
  private showMove(move: AssemblyIncrement): void {
    this.container.classList.add('move-display--active');

    // Update notation
    this.notationElement.textContent = move.notation;

    // Update description
    this.descriptionElement.textContent = move.description;

    // Update face info
    const faceName = FACE_NAMES[move.face];
    const directionText = move.direction === 'clockwise' ? '↻' : '↺';
    this.faceInfoElement.textContent = `${faceName} face ${directionText} ${move.degrees}°`;
  }

  /**
   * Creates the main container
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'move-display';
    return container;
  }

  /**
   * Creates the move notation element
   */
  private createNotationElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'move-notation';
    return element;
  }

  /**
   * Creates the move description element
   */
  private createDescriptionElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'move-description';
    return element;
  }

  /**
   * Creates the face info element
   */
  private createFaceInfoElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'move-face-info';
    return element;
  }

  /**
   * Renders all components
   */
  private render(): void {
    this.container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'move-display-header';
    header.textContent = 'Current Move';

    this.container.appendChild(header);
    this.container.appendChild(this.notationElement);
    this.container.appendChild(this.faceInfoElement);
    this.container.appendChild(this.descriptionElement);
  }

  /**
   * Destroys the component
   */
  public destroy(): void {
    this.container.remove();
  }
}
