import { Color } from '../types';

/**
 * 3D Rubik's Cube visualization with realistic rotation animations
 * Each cubie (small cube) is independent and rotates around the cube's axis
 * like a real Rubik's cube
 */
export class InstructionCube3D {
  private element: HTMLElement;
  private cubeElement: HTMLElement;
  private rotationX: number = -25;
  private rotationY: number = 35;
  private currentMoveIndex: number = 0;
  private isAnimating: boolean = false;
  private cubies: HTMLElement[] = [];

  // Define the moves to demonstrate
  private moves = [
    { face: 'front', axis: 'Z', label: 'F - Rotate Front face 90° clockwise', viewRotation: { x: -25, y: 35 } },
    { face: 'right', axis: 'X', label: 'R - Rotate Right face 90° clockwise', viewRotation: { x: -25, y: -55 } },
    { face: 'top', axis: 'Y', label: 'U - Rotate Upper face 90° clockwise', viewRotation: { x: -80, y: 35 } },
    { face: 'back', axis: 'Z', label: 'B - Rotate Back face 90° clockwise', viewRotation: { x: -25, y: 215 } },
    { face: 'left', axis: 'X', label: 'L - Rotate Left face 90° clockwise', viewRotation: { x: -25, y: 125 } },
    { face: 'bottom', axis: 'Y', label: 'D - Rotate Down face 90° clockwise', viewRotation: { x: 80, y: 35 } }
  ];

  constructor() {
    console.log('InstructionCube3D: Creating 3D instruction cube with realistic physics');
    this.element = this.render();
    this.setupInteraction();
    this.startAnimation();
    console.log('InstructionCube3D: 3D cube created successfully');
  }

  private render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'instruction-cube-3d';

    // Perspective wrapper
    const scene = document.createElement('div');
    scene.className = 'instruction-cube-3d__scene';

    // Cube container
    this.cubeElement = document.createElement('div');
    this.cubeElement.className = 'instruction-cube-3d__cube';

    // Create all 27 cubies (3x3x3)
    // A Rubik's cube has 27 small cubes: 8 corners, 12 edges, 6 centers, 1 core (hidden)
    this.createCubies();

    scene.appendChild(this.cubeElement);
    container.appendChild(scene);

    // Add instruction text
    const instruction = document.createElement('div');
    instruction.className = 'instruction-cube-3d__instruction';
    instruction.innerHTML = `
      <div class="instruction-text">
        <strong>Watch the demonstration:</strong>
        <br><span class="animation-label">Preparing animation...</span>
      </div>
      <div class="interaction-hint">💡 Drag to pause & explore</div>
    `;
    container.appendChild(instruction);

    this.updateRotation();

    return container;
  }

  /**
   * Creates all 27 cubies with their individual faces
   */
  private createCubies(): void {
    const size = 32; // Size of each cubie
    const gap = 1; // Gap between cubies for visibility

    // Color scheme for solved cube
    const colorScheme = {
      front: Color.GREEN,
      back: Color.BLUE,
      right: Color.RED,
      left: Color.ORANGE,
      top: Color.WHITE,
      bottom: Color.YELLOW
    };

    // Create 3x3x3 grid of cubies
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = this.createCubie(x, y, z, size, gap, colorScheme);
          this.cubeElement.appendChild(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  /**
   * Creates a single cubie at position (x, y, z)
   */
  private createCubie(
    x: number,
    y: number,
    z: number,
    size: number,
    gap: number,
    colorScheme: Record<string, Color>
  ): HTMLElement {
    const cubie = document.createElement('div');
    cubie.className = 'cubie';

    // Store position data
    cubie.dataset.x = x.toString();
    cubie.dataset.y = y.toString();
    cubie.dataset.z = z.toString();

    // Position the cubie
    // Each cubie needs to be offset by its full size plus gap
    const offset = size + gap;
    const translateX = x * offset;
    const translateY = -y * offset; // Invert Y for proper orientation
    const translateZ = z * offset;

    cubie.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
    cubie.dataset.baseTransform = cubie.style.transform;

    // Create 6 faces for this cubie
    const halfSize = size / 2;
    const faces = [
      { name: 'front', transform: `rotateY(0deg) translateZ(${halfSize}px)`, color: z === 1 ? colorScheme.front : null },
      { name: 'back', transform: `rotateY(180deg) translateZ(${halfSize}px)`, color: z === -1 ? colorScheme.back : null },
      { name: 'right', transform: `rotateY(90deg) translateZ(${halfSize}px)`, color: x === 1 ? colorScheme.right : null },
      { name: 'left', transform: `rotateY(-90deg) translateZ(${halfSize}px)`, color: x === -1 ? colorScheme.left : null },
      { name: 'top', transform: `rotateX(90deg) translateZ(${halfSize}px)`, color: y === 1 ? colorScheme.top : null },
      { name: 'bottom', transform: `rotateX(-90deg) translateZ(${halfSize}px)`, color: y === -1 ? colorScheme.bottom : null }
    ];

    faces.forEach(({ name, transform, color }) => {
      const face = document.createElement('div');
      face.className = `cubie-face cubie-face--${name}`;
      face.style.transform = transform;

      if (color) {
        this.applyFaceColor(face, color, x, y, z, name);
      } else {
        // Internal face (black)
        face.style.backgroundColor = '#000';
      }

      cubie.appendChild(face);
    });

    return cubie;
  }

  /**
   * Applies color and label to a face
   */
  private applyFaceColor(
    face: HTMLElement,
    color: Color,
    x: number,
    y: number,
    z: number,
    faceName: string
  ): void {
    const colorMap: Record<string, string> = {
      'WHITE': '#FFFFFF',
      'YELLOW': '#FFD500',
      'GREEN': '#009B48',
      'BLUE': '#0046AD',
      'ORANGE': '#FF5800',
      'RED': '#B71234'
    };

    face.style.backgroundColor = colorMap[color] || '#CCCCCC';
    face.dataset.color = color;

    // Add label to center pieces
    if ((x === 0 && y === 0 && z === 1 && faceName === 'front') ||
        (x === 0 && y === 0 && z === -1 && faceName === 'back') ||
        (x === 1 && y === 0 && z === 0 && faceName === 'right') ||
        (x === -1 && y === 0 && z === 0 && faceName === 'left') ||
        (x === 0 && y === 1 && z === 0 && faceName === 'top') ||
        (x === 0 && y === -1 && z === 0 && faceName === 'bottom')) {
      const label = document.createElement('div');
      label.className = 'cubie-label';
      const labelMap: Record<string, string> = {
        'front': 'F',
        'back': 'B',
        'right': 'R',
        'left': 'L',
        'top': 'U',
        'bottom': 'D'
      };
      label.textContent = labelMap[faceName] || '';
      face.appendChild(label);
    }
  }

  private setupInteraction(): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationX = this.rotationX;
    let startRotationY = this.rotationY;

    const scene = this.element.querySelector('.instruction-cube-3d__scene') as HTMLElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startRotationX = this.rotationX;
      startRotationY = this.rotationY;
      scene.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      this.rotationY = startRotationY + deltaX * 0.5;
      this.rotationX = startRotationX - deltaY * 0.5;

      // Clamp rotation X to prevent flipping
      this.rotationX = Math.max(-90, Math.min(90, this.rotationX));

      this.updateRotation();
    };

    const handleMouseUp = () => {
      isDragging = false;
      scene.style.cursor = 'grab';
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startRotationX = this.rotationX;
      startRotationY = this.rotationY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      this.rotationY = startRotationY + deltaX * 0.5;
      this.rotationX = startRotationX - deltaY * 0.5;

      this.rotationX = Math.max(-90, Math.min(90, this.rotationX));

      this.updateRotation();
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    scene.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    scene.addEventListener('touchstart', handleTouchStart);
    scene.addEventListener('touchmove', handleTouchMove, { passive: false });
    scene.addEventListener('touchend', handleTouchEnd);
  }

  private updateRotation(): void {
    this.cubeElement.style.transform = `
      rotateX(${this.rotationX}deg)
      rotateY(${this.rotationY}deg)
    `;
  }

  private startAnimation(): void {
    // Start animation after a short delay
    setTimeout(() => {
      this.animateNextMove();
    }, 1000);
  }

  private animateNextMove(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const currentMove = this.moves[this.currentMoveIndex];

    // Update label
    const label = this.element.querySelector('.animation-label') as HTMLElement;
    if (label) {
      label.textContent = currentMove.label;
    }

    // Rotate cube to show the face being moved
    this.rotationX = currentMove.viewRotation.x;
    this.rotationY = currentMove.viewRotation.y;
    this.updateRotation();

    // Wait for cube rotation, then animate the face rotation
    setTimeout(() => {
      this.rotateFace(currentMove.face, currentMove.axis);
    }, 1500);
  }

  /**
   * Rotates a face by rotating the 9 cubies around the axis
   * This simulates real Rubik's cube physics
   */
  private rotateFace(faceName: string, axis: string): void {
    // Get the 9 cubies that belong to this face
    const cubiesToRotate = this.getCubiesForFace(faceName);

    if (cubiesToRotate.length === 0) {
      this.moveToNextMove();
      return;
    }

    // Create a rotation group to rotate all pieces together
    const rotationGroup = document.createElement('div');
    rotationGroup.className = 'rotation-group';
    rotationGroup.style.transformStyle = 'preserve-3d';
    rotationGroup.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';

    // Move cubies into rotation group
    cubiesToRotate.forEach(cubie => {
      const currentTransform = cubie.style.transform;
      cubie.dataset.rotationTransform = currentTransform;
      rotationGroup.appendChild(cubie);
    });

    this.cubeElement.appendChild(rotationGroup);

    // Apply rotation to the group
    setTimeout(() => {
      let rotation = '';
      if (axis === 'X') {
        rotation = 'rotateX(90deg)';
      } else if (axis === 'Y') {
        rotation = 'rotateY(90deg)';
      } else if (axis === 'Z') {
        rotation = 'rotateZ(90deg)';
      }
      rotationGroup.style.transform = rotation;
    }, 50);

    // After animation, move cubies back to main container with updated positions
    setTimeout(() => {
      cubiesToRotate.forEach(cubie => {
        // Get the final computed transform
        const computedTransform = window.getComputedStyle(cubie).transform;

        // Move back to main container
        this.cubeElement.appendChild(cubie);

        // Apply the computed transform directly
        cubie.style.transform = computedTransform;
        cubie.dataset.baseTransform = computedTransform;
      });

      // Remove the rotation group
      rotationGroup.remove();

      this.moveToNextMove();
    }, 850);
  }

  /**
   * Gets the 9 cubies that belong to a specific face
   */
  private getCubiesForFace(faceName: string): HTMLElement[] {
    return this.cubies.filter(cubie => {
      const x = parseInt(cubie.dataset.x || '0');
      const y = parseInt(cubie.dataset.y || '0');
      const z = parseInt(cubie.dataset.z || '0');

      switch (faceName) {
        case 'front':
          return z === 1;
        case 'back':
          return z === -1;
        case 'right':
          return x === 1;
        case 'left':
          return x === -1;
        case 'top':
          return y === 1;
        case 'bottom':
          return y === -1;
        default:
          return false;
      }
    });
  }

  private moveToNextMove(): void {
    this.isAnimating = false;
    this.currentMoveIndex = (this.currentMoveIndex + 1) % this.moves.length;

    // Wait before next animation
    setTimeout(() => {
      this.animateNextMove();
    }, 2000);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    this.isAnimating = false;
    this.element.remove();
  }
}
