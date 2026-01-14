import type { Solution } from '../../assembly/types';
import type { CubeState } from '../../configuration/types';
import { StateSimulator } from '../../assembly/logic/StateSimulator';

/**
 * Modal displayed when solution is complete
 * Shows success message and action buttons
 */
export class CompletionModal {
  private overlay: HTMLElement;
  private modal: HTMLElement;
  private solution: Solution;
  private finalState?: CubeState;
  private simulator: StateSimulator;

  private onRestart: () => void;
  private onNewCube: () => void;
  private onClose: () => void;

  constructor(
    solution: Solution,
    callbacks: {
      onRestart: () => void;
      onNewCube: () => void;
      onClose: () => void;
    },
    finalState?: CubeState
  ) {
    this.solution = solution;
    this.finalState = finalState;
    this.simulator = new StateSimulator();
    this.onRestart = callbacks.onRestart;
    this.onNewCube = callbacks.onNewCube;
    this.onClose = callbacks.onClose;

    this.overlay = this.createOverlay();
    this.modal = this.createModal();

    this.render();
  }

  /**
   * Shows the modal
   */
  public show(): void {
    document.body.appendChild(this.overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('completion-overlay--visible');
      this.modal.classList.add('completion-modal--visible');
    });

    // Add confetti effect
    this.showConfetti();
  }

  /**
   * Hides the modal
   */
  public hide(): void {
    this.overlay.classList.remove('completion-overlay--visible');
    this.modal.classList.remove('completion-modal--visible');

    setTimeout(() => {
      this.overlay.remove();
    }, 300);
  }

  /**
   * Creates the overlay background
   */
  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide();
        this.onClose();
      }
    });
    return overlay;
  }

  /**
   * Creates the modal content
   */
  private createModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'completion-title');
    return modal;
  }

  /**
   * Renders the modal content
   */
  private render(): void {
    this.modal.innerHTML = '';

    // Success icon
    const icon = document.createElement('div');
    icon.className = 'completion-icon';
    icon.innerHTML = `
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="#10b981" stroke="#059669" stroke-width="4"/>
        <path d="M25 40 L35 50 L55 30" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Title
    const title = document.createElement('h2');
    title.id = 'completion-title';
    title.className = 'completion-title';
    title.textContent = '🎉 Congratulations!';

    // Message
    const message = document.createElement('p');
    message.className = 'completion-message';
    message.textContent = 'You\'ve successfully completed the solution!';

    // Verification status
    const verification = this.createVerificationStatus();

    // Statistics
    const stats = this.createStatistics();

    // Action buttons
    const actions = this.createActions();

    this.modal.appendChild(icon);
    this.modal.appendChild(title);
    this.modal.appendChild(message);
    this.modal.appendChild(verification);
    this.modal.appendChild(stats);
    this.modal.appendChild(actions);

    this.overlay.appendChild(this.modal);
  }

  /**
   * Creates the verification status section
   */
  private createVerificationStatus(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'completion-verification';

    // Check if final state is solved
    const isSolved = this.finalState ? this.simulator.isSolved(this.finalState) : false;

    if (isSolved) {
      container.innerHTML = `
        <div class="verification-status verification-status--success">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="#10b981" stroke="#059669" stroke-width="1"/>
            <path d="M6 10 L9 13 L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Cube is fully solved! All faces match their center colors.</span>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="verification-status verification-status--info">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="#3b82f6" stroke="#2563eb" stroke-width="1"/>
            <path d="M10 6 L10 11 M10 14 L10 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Solution sequence completed. Check console for verification details.</span>
        </div>
      `;
    }

    return container;
  }

  /**
   * Creates the statistics section
   */
  private createStatistics(): HTMLElement {
    const stats = document.createElement('div');
    stats.className = 'completion-stats';

    const items = [
      {
        label: 'Total Moves',
        value: this.solution.totalMoves.toString()
      },
      {
        label: 'Algorithm',
        value: this.solution.algorithmUsed
      },
      {
        label: 'Complexity',
        value: this.solution.metadata.complexity.charAt(0).toUpperCase() +
               this.solution.metadata.complexity.slice(1)
      },
      {
        label: 'Calculation Time',
        value: `${this.solution.calculationTimeMs.toFixed(0)}ms`
      }
    ];

    items.forEach(({ label, value }) => {
      const item = document.createElement('div');
      item.className = 'completion-stat-item';

      const itemLabel = document.createElement('span');
      itemLabel.className = 'completion-stat-label';
      itemLabel.textContent = label;

      const itemValue = document.createElement('span');
      itemValue.className = 'completion-stat-value';
      itemValue.textContent = value;

      item.appendChild(itemLabel);
      item.appendChild(itemValue);
      stats.appendChild(item);
    });

    return stats;
  }

  /**
   * Creates the action buttons
   */
  private createActions(): HTMLElement {
    const actions = document.createElement('div');
    actions.className = 'completion-actions';

    // Restart button
    const restartButton = document.createElement('button');
    restartButton.className = 'completion-button completion-button--secondary';
    restartButton.textContent = 'Review Solution';
    restartButton.addEventListener('click', () => {
      this.hide();
      this.onRestart();
    });

    // New cube button
    const newCubeButton = document.createElement('button');
    newCubeButton.className = 'completion-button completion-button--primary';
    newCubeButton.textContent = 'Solve Another Cube';
    newCubeButton.addEventListener('click', () => {
      this.hide();
      this.onNewCube();
    });

    actions.appendChild(restartButton);
    actions.appendChild(newCubeButton);

    return actions;
  }

  /**
   * Shows a confetti effect
   */
  private showConfetti(): void {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';

    // Create confetti pieces
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      confettiContainer.appendChild(confetti);
    }

    this.modal.appendChild(confettiContainer);

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }

  /**
   * Destroys the component
   */
  public destroy(): void {
    this.hide();
  }
}
