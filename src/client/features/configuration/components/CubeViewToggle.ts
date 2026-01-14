/**
 * Toggle button to switch between 2D and 3D cube views
 */
export class CubeViewToggle {
  private element: HTMLElement;
  private currentView: '2d' | '3d' = '2d';
  private onToggle?: (view: '2d' | '3d') => void;

  constructor(options: { initialView?: '2d' | '3d'; onToggle?: (view: '2d' | '3d') => void } = {}) {
    this.currentView = options.initialView || '2d';
    this.onToggle = options.onToggle;
    this.element = this.render();
  }

  private render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'cube-view-toggle';

    const button2D = document.createElement('button');
    button2D.className = `view-toggle-btn ${this.currentView === '2d' ? 'active' : ''}`;
    button2D.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
      <span>2D View</span>
    `;
    button2D.onclick = () => this.toggle('2d');

    const button3D = document.createElement('button');
    button3D.className = `view-toggle-btn ${this.currentView === '3d' ? 'active' : ''}`;
    button3D.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M12 12v10" />
        <path d="M2 7l10 5 10-5" />
      </svg>
      <span>3D View</span>
    `;
    button3D.onclick = () => this.toggle('3d');

    container.appendChild(button2D);
    container.appendChild(button3D);

    return container;
  }

  private toggle(view: '2d' | '3d'): void {
    if (this.currentView === view) return;

    this.currentView = view;

    // Update button states
    const buttons = this.element.querySelectorAll('.view-toggle-btn');
    buttons[0].classList.toggle('active', view === '2d');
    buttons[1].classList.toggle('active', view === '3d');

    // Trigger callback
    if (this.onToggle) {
      this.onToggle(view);
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getCurrentView(): '2d' | '3d' {
    return this.currentView;
  }

  public destroy(): void {
    this.element.remove();
  }
}
