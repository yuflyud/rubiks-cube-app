import './styles/main.css';
import { CubeConfigurationContainer } from './features/configuration';
import type { CubeState, ValidationResult } from './features/configuration';
import { SolutionCalculator } from './features/assembly';
import type { Solution } from './features/assembly';
import { VisualizationController } from './features/visualization';

console.log('🎲 Rubik\'s Cube App initialized');

// Initialize solution calculator
const solutionCalculator = new SolutionCalculator();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Get or create app container
  const appContainer = document.getElementById('app') || createAppContainer();

  // Clear loading state
  appContainer.innerHTML = '';

  // Create elegant header
  const header = createHeader();
  appContainer.appendChild(header);

  // Create main container
  const mainContainer = document.createElement('div');
  mainContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  appContainer.appendChild(mainContainer);

  // Create configuration container
  const configContainer = new CubeConfigurationContainer(mainContainer, {
    guidedMode: true,
    showKeyboardShortcuts: true,
    autoValidate: false,
    onComplete: handleConfigurationComplete
  });

  console.log('✓ Configuration feature initialized');
});

/**
 * Creates the app container if it doesn't exist
 */
function createAppContainer(): HTMLElement {
  const container = document.createElement('div');
  container.id = 'app';
  container.className = 'min-h-screen';
  document.body.appendChild(container);
  return container;
}

/**
 * Creates elegant header
 */
function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'py-8 text-center';
  header.innerHTML = `
    <div class="animate-fade-in-up">
      <div class="inline-flex items-center gap-4 mb-2">
        <div class="animate-float">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="57.6" rx="19.2" ry="4" fill="#000000" opacity="0.15"/>
            <path d="M32 9.6 L49.6 19.2 L32 28.8 L14.4 19.2 Z" fill="#FFD700" stroke="#1a1a1a" stroke-width="1.2"/>
            <line x1="32" y1="9.6" x2="32" y2="28.8" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="32" y1="28.8" x2="49.6" y2="19.2" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="32" y1="28.8" x2="14.4" y2="19.2" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="23.2" y1="14.4" x2="23.2" y2="24" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="40.8" y1="14.4" x2="40.8" y2="24" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="19.2" y1="16.8" x2="27.2" y2="21.6" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="36.8" y1="21.6" x2="44.8" y2="16.8" stroke="#1a1a1a" stroke-width="0.8"/>
            <path d="M14.4 19.2 L32 28.8 L32 48 L14.4 38.4 Z" fill="#FF5722" stroke="#1a1a1a" stroke-width="1.2"/>
            <line x1="14.4" y1="25.6" x2="32" y2="35.2" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="14.4" y1="32" x2="32" y2="41.6" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="19.2" y1="22.4" x2="19.2" y2="41.6" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="25.6" y1="25.6" x2="25.6" y2="44.8" stroke="#1a1a1a" stroke-width="0.8"/>
            <path d="M14.4 19.2 L32 28.8 L32 48 L14.4 38.4 Z" fill="#000000" opacity="0.15"/>
            <path d="M32 28.8 L49.6 19.2 L49.6 38.4 L32 48 Z" fill="#C62828" stroke="#1a1a1a" stroke-width="1.2"/>
            <line x1="32" y1="35.2" x2="49.6" y2="25.6" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="32" y1="41.6" x2="49.6" y2="32" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="38.4" y1="25.6" x2="38.4" y2="44.8" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="44.8" y1="22.4" x2="44.8" y2="41.6" stroke="#1a1a1a" stroke-width="0.8"/>
            <path d="M32 28.8 L49.6 19.2 L49.6 38.4 L32 48 Z" fill="#000000" opacity="0.08"/>
            <path d="M32 9.6 L40.8 14.4 L32 19.2 L23.2 14.4 Z" fill="#FFE57F"/>
            <path d="M23.2 14.4 L32 19.2 L32 28.8 L14.4 19.2 Z" fill="#FFD54F"/>
            <path d="M32 19.2 L40.8 14.4 L49.6 19.2 L32 28.8 Z" fill="#FFEB3B"/>
            <path d="M14.4 19.2 L19.2 22.4 L19.2 28.8 L14.4 25.6 Z" fill="#FF7043"/>
            <path d="M19.2 22.4 L25.6 25.6 L25.6 32 L19.2 28.8 Z" fill="#FF6E40"/>
            <path d="M14.4 25.6 L19.2 28.8 L19.2 35.2 L14.4 32 Z" fill="#FF5722"/>
            <path d="M32 28.8 L38.4 25.6 L38.4 32 L32 35.2 Z" fill="#E53935"/>
            <path d="M38.4 25.6 L44.8 22.4 L44.8 28.8 L38.4 32 Z" fill="#1976D2"/>
            <path d="M32 35.2 L38.4 32 L38.4 38.4 L32 41.6 Z" fill="#FFEB3B"/>
            <path d="M32 9.6 L40.8 14.4 L32 19.2 Z" fill="#FFFFFF" opacity="0.3"/>
            <path d="M38.4 25.6 L44.8 22.4 L49.6 19.2 L44.8 28.8 Z" fill="#FFFFFF" opacity="0.15"/>
          </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-gradient">
          Rubik's Cube Solver
        </h1>
      </div>
      <p class="text-slate-600 text-lg max-w-2xl mx-auto px-4">
        Configure your cube's current state and get the optimal solution
      </p>
    </div>
  `;
  return header;
}

/**
 * Handles configuration completion
 */
async function handleConfigurationComplete(
  state: CubeState,
  validationResult: ValidationResult
): Promise<void> {
  console.log('✓ Configuration completed!');
  console.log('Cube state:', state);
  console.log('Validation result:', validationResult);

  // Show elegant success notification
  showNotification(
    'Configuration complete! Calculating solution...',
    'info'
  );

  try {
    // Calculate solution using Feature 2 (Assembly Mechanism)
    console.log('⚙️ Calculating solution...');
    const solution = await solutionCalculator.calculateSolution(state);

    console.log('✓ Solution calculated!');
    console.log('Solution:', solution);
    console.log(`Total moves: ${solution.totalMoves}`);
    console.log(`Algorithm: ${solution.algorithmUsed}`);
    console.log(`Calculation time: ${solution.calculationTimeMs.toFixed(2)}ms`);
    console.log(`Complexity: ${solution.metadata.complexity}`);

    // Show success notification with solution details
    if (solution.totalMoves === 0) {
      showNotification(
        'Cube is already solved! No moves needed.',
        'success'
      );
    } else {
      showNotification(
        `Solution found! ${solution.totalMoves} moves required.`,
        'success'
      );
    }

    // Display solution moves in console
    if (solution.increments.length > 0) {
      console.log('Move sequence:');
      solution.increments.forEach((inc) => {
        console.log(`  ${inc.stepNumber}. ${inc.notation} - ${inc.description}`);
      });
    }

    // Show visualization (Feature 3)
    displayVisualization(solution);
  } catch (error) {
    console.error('✗ Solution calculation failed:', error);

    let errorMessage = 'Failed to calculate solution.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    showNotification(errorMessage, 'error');
  }
}

/**
 * Displays the visualization interface with the solution
 */
function displayVisualization(solution: Solution): void {
  // Get the main container
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  // Clear the entire app (remove configuration UI and header)
  appContainer.innerHTML = '';

  // Create visualization container
  const visualizationContainer = document.createElement('div');
  visualizationContainer.className = 'min-h-screen py-8 px-4';
  appContainer.appendChild(visualizationContainer);

  // Initialize visualization controller
  const visualizationController = new VisualizationController(
    visualizationContainer,
    {
      solution,
      onRestart: () => {
        // Restart visualization from beginning
        visualizationController.destroy();
        displayVisualization(solution);
      },
      onNewCube: () => {
        // Go back to configuration
        visualizationController.destroy();
        location.reload(); // Simple approach: reload the page to restart
      }
    }
  );

  console.log('✓ Visualization initialized');
}

/**
 * Shows an elegant notification to the user
 */
function showNotification(
  message: string,
  type: 'success' | 'error' | 'info'
): void {
  const notification = document.createElement('div');
  notification.className = `
    fixed top-6 right-6 z-50
    px-6 py-4 rounded-xl
    shadow-elegant-xl
    backdrop-blur-xl
    border
    animate-slide-in-right
    flex items-center gap-3
    ${
      type === 'success'
        ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
        : type === 'error'
        ? 'bg-rose-500/90 border-rose-400/50 text-white'
        : 'bg-blue-500/90 border-blue-400/50 text-white'
    }
  `;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  notification.innerHTML = `
    <span class="text-2xl">${icon}</span>
    <span class="font-medium">${message}</span>
  `;

  document.body.appendChild(notification);

  // Remove after 5 seconds with fade out
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;
document.head.appendChild(style);
