import { CubeState, ConfigurationProgress } from '../types';

/**
 * Observer callback type
 */
export type StateObserverCallback = (
  state: Readonly<CubeState>,
  progress: Readonly<ConfigurationProgress>
) => void;

/**
 * State observer interface
 */
export interface IStateObserver {
  id: string;
  callback: StateObserverCallback;
}

/**
 * Observable state manager mixin
 */
export class ObservableState {
  private observers: Map<string, StateObserverCallback> = new Map();
  private observerIdCounter = 0;

  /**
   * Subscribe to state changes
   * @param callback - Function to call when state changes
   * @returns Unsubscribe function
   */
  public subscribe(callback: StateObserverCallback): () => void {
    const id = `observer_${this.observerIdCounter++}`;
    this.observers.set(id, callback);

    // Return unsubscribe function
    return () => {
      this.observers.delete(id);
    };
  }

  /**
   * Unsubscribe all observers
   */
  public unsubscribeAll(): void {
    this.observers.clear();
  }

  /**
   * Notify all observers of state change
   */
  protected notifyObservers(
    state: Readonly<CubeState>,
    progress: Readonly<ConfigurationProgress>
  ): void {
    this.observers.forEach((callback) => {
      try {
        callback(state, progress);
      } catch (error) {
        console.error('Error in state observer:', error);
      }
    });
  }

  /**
   * Get the number of active observers
   */
  public getObserverCount(): number {
    return this.observers.size;
  }
}
