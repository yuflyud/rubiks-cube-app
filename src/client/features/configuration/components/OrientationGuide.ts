import { CUBE_ORIENTATION_GUIDE } from '../constants';
import { ThreeJSCube } from './ThreeJSCube';

/**
 * Displays beginner-friendly cube orientation instructions
 * with interactive 3D cube demonstration using Three.js
 */
export class OrientationGuide {
  private element: HTMLElement;
  private isExpanded: boolean = false;
  private threeJSCube?: ThreeJSCube;

  constructor() {
    this.element = this.render();
  }

  private render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'orientation-guide';

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'orientation-guide__toggle';
    toggleButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <path d="M12 17h.01"/>
      </svg>
      <span>Need help orienting your cube?</span>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    `;
    toggleButton.onclick = () => this.toggle();

    // Content (initially hidden)
    const content = document.createElement('div');
    content.className = 'orientation-guide__content';
    content.style.display = 'none';

    // Title
    const title = document.createElement('h3');
    title.className = 'orientation-guide__title';
    title.textContent = CUBE_ORIENTATION_GUIDE.title;
    content.appendChild(title);

    // Steps
    const stepsList = document.createElement('ol');
    stepsList.className = 'orientation-guide__steps';

    CUBE_ORIENTATION_GUIDE.steps.forEach((stepData) => {
      const step = document.createElement('li');
      step.className = 'orientation-guide__step';
      step.innerHTML = `
        <span class="step-emoji">${stepData.emoji}</span>
        <span class="step-text">${stepData.instruction}</span>
      `;
      stepsList.appendChild(step);
    });

    content.appendChild(stepsList);

    // Tip
    const tip = document.createElement('div');
    tip.className = 'orientation-guide__tip';
    tip.textContent = CUBE_ORIENTATION_GUIDE.tip;
    content.appendChild(tip);

    // Create a container for diagrams (2D flat + 3D interactive)
    const diagramsContainer = document.createElement('div');
    diagramsContainer.className = 'orientation-guide__diagrams';

    // Visual diagram (2D flat)
    const diagram = this.createVisualDiagram();
    diagramsContainer.appendChild(diagram);

    // 3D Interactive cube
    const cube3DWrapper = document.createElement('div');
    cube3DWrapper.className = 'orientation-guide__3d-wrapper';

    const cube3DTitle = document.createElement('h4');
    cube3DTitle.className = 'orientation-guide__3d-title';
    cube3DTitle.textContent = '3D Interactive Cube';
    cube3DWrapper.appendChild(cube3DTitle);

    this.threeJSCube = new ThreeJSCube();
    cube3DWrapper.appendChild(this.threeJSCube.getElement());

    diagramsContainer.appendChild(cube3DWrapper);
    content.appendChild(diagramsContainer);

    container.appendChild(toggleButton);
    container.appendChild(content);

    return container;
  }

  /**
   * Creates a simple visual diagram showing cube orientation
   */
  private createVisualDiagram(): HTMLElement {
    const diagram = document.createElement('div');
    diagram.className = 'orientation-diagram';
    diagram.innerHTML = `
      <div class="cube-diagram">
        <div class="cube-face-main-page cube-top">
          <span class="face-label">TOP</span>
          <span class="face-color">White ⬜</span>
        </div>
        <div class="cube-middle">
          <div class="cube-face-main-page cube-left">
            <span class="face-label">LEFT</span>
            <span class="face-color">🟧 Orange</span>
          </div>
          <div class="cube-face-main-page cube-front">
            <span class="face-label">FRONT</span>
            <span class="face-color">🟩 Green</span>
          </div>
          <div class="cube-face-main-page cube-right">
            <span class="face-label">RIGHT</span>
            <span class="face-color">Red 🟥</span>
          </div>
          <div class="cube-face-main-page cube-back">
            <span class="face-label">BACK</span>
            <span class="face-color">🟦 Blue</span>
          </div>
        </div>
        <div class="cube-face-main-page cube-bottom">
          <span class="face-label">BOTTOM</span>
          <span class="face-color">Yellow 🟨</span>
        </div>
      </div>
    `;
    return diagram;
  }

  private toggle(): void {
    this.isExpanded = !this.isExpanded;

    const content = this.element.querySelector('.orientation-guide__content') as HTMLElement;
    const chevron = this.element.querySelector('.chevron') as HTMLElement;

    if (this.isExpanded) {
      content.style.display = 'block';
      chevron.style.transform = 'rotate(180deg)';
      this.element.classList.add('expanded');

      // Animate in
      content.style.animation = 'slideDown 0.3s ease-out';
    } else {
      content.style.animation = 'slideUp 0.3s ease-out';
      setTimeout(() => {
        content.style.display = 'none';
      }, 300);
      chevron.style.transform = 'rotate(0deg)';
      this.element.classList.remove('expanded');
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    this.threeJSCube?.destroy();
    this.element.remove();
  }
}
