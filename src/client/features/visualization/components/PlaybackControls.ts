import { PlaybackSpeed } from '../types';

/**
 * Playback controls for auto-play and speed selection
 * Provides Play/Pause, Reset, and Speed selector
 */
export class PlaybackControls {
  private container: HTMLElement;
  private playPauseButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private speedSelector: HTMLSelectElement;

  private isPlaying: boolean = false;

  private onPlayPause: () => void;
  private onReset: () => void;
  private onSpeedChange: (speed: PlaybackSpeed) => void;

  constructor(
    parentElement: HTMLElement,
    callbacks: {
      onPlayPause: () => void;
      onReset: () => void;
      onSpeedChange: (speed: PlaybackSpeed) => void;
    }
  ) {
    this.onPlayPause = callbacks.onPlayPause;
    this.onReset = callbacks.onReset;
    this.onSpeedChange = callbacks.onSpeedChange;

    this.container = this.createContainer();
    this.playPauseButton = this.createPlayPauseButton();
    this.resetButton = this.createResetButton();
    this.speedSelector = this.createSpeedSelector();

    this.render();
    parentElement.appendChild(this.container);
  }

  /**
   * Updates the play/pause button state
   */
  public updatePlayState(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
    this.updatePlayPauseButton();
  }

  /**
   * Sets the speed selector value
   */
  public setSpeed(speed: PlaybackSpeed): void {
    this.speedSelector.value = speed;
  }

  /**
   * Creates the main container
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'playback-controls';
    return container;
  }

  /**
   * Creates the play/pause button
   */
  private createPlayPauseButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'playback-button playback-button--play-pause';
    button.addEventListener('click', () => {
      this.onPlayPause();
    });
    return button;
  }

  /**
   * Updates the play/pause button content
   */
  private updatePlayPauseButton(): void {
    if (this.isPlaying) {
      this.playPauseButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
        <span>Pause</span>
      `;
      this.playPauseButton.setAttribute('aria-label', 'Pause auto-play');
      this.playPauseButton.classList.add('playback-button--playing');
    } else {
      this.playPauseButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Play</span>
      `;
      this.playPauseButton.setAttribute('aria-label', 'Start auto-play');
      this.playPauseButton.classList.remove('playback-button--playing');
    }
  }

  /**
   * Creates the reset button
   */
  private createResetButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'playback-button playback-button--reset';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
      </svg>
      <span>Reset</span>
    `;
    button.setAttribute('aria-label', 'Reset to first step');
    button.addEventListener('click', () => this.onReset());
    return button;
  }

  /**
   * Creates the speed selector dropdown
   */
  private createSpeedSelector(): HTMLSelectElement {
    const container = document.createElement('div');
    container.className = 'speed-selector-container';

    const label = document.createElement('label');
    label.textContent = 'Speed:';
    label.className = 'speed-label';

    const select = document.createElement('select');
    select.className = 'speed-selector';
    select.setAttribute('aria-label', 'Playback speed');

    // Add speed options
    const speeds = [
      { value: PlaybackSpeed.SLOW, label: 'Slow' },
      { value: PlaybackSpeed.NORMAL, label: 'Normal' },
      { value: PlaybackSpeed.FAST, label: 'Fast' }
    ];

    speeds.forEach(({ value, label: optionLabel }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = optionLabel;
      if (value === PlaybackSpeed.NORMAL) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      this.onSpeedChange(select.value as PlaybackSpeed);
    });

    label.appendChild(select);
    this.container.appendChild(label);

    return select;
  }

  /**
   * Renders all components
   */
  private render(): void {
    this.container.innerHTML = '';

    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'playback-buttons-group';
    buttonsGroup.appendChild(this.resetButton);
    buttonsGroup.appendChild(this.playPauseButton);

    this.container.appendChild(buttonsGroup);
    this.container.appendChild(this.createSpeedSelector());

    // Initialize play/pause button
    this.updatePlayPauseButton();
  }

  /**
   * Destroys the component
   */
  public destroy(): void {
    this.container.remove();
  }
}
