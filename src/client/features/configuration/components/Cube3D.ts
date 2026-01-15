import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CubeState, Face, Color, FaceletIdentifier } from '../types';
import { CUBE_COLORS } from '../constants';

/**
 * Interactive 3D Rubik's Cube using Three.js
 *
 * Features:
 * - Realistic 3D rendering with lighting and shadows
 * - Interactive rotation with mouse/touch
 * - Click to select facelets
 * - Smooth animations and micro-animations
 * - Responsive canvas sizing
 */
export class Cube3D {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private cubeGroup: THREE.Group;
  private facelets: Map<string, THREE.Mesh> = new Map();
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedFacelet: THREE.Mesh | null = null;
  private animationFrameId: number | null = null;

  // Callbacks
  private onFaceletSelect?: (identifier: FaceletIdentifier) => void;

  // Configuration
  private readonly CUBE_SIZE = 3; // 3x3x3 cube
  private readonly FACELET_SIZE = 0.95; // Slightly smaller than 1 for gaps
  private readonly FACELET_GAP = 0.05;
  private readonly CUBE_SPACING = 1; // Space between facelets

  constructor(
    container: HTMLElement,
    options: {
      onFaceletSelect?: (identifier: FaceletIdentifier) => void;
    } = {}
  ) {
    this.container = container;
    this.onFaceletSelect = options.onFaceletSelect;

    // Initialize Three.js components
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '600px';
    this.container.appendChild(this.canvas);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 15;
    this.controls.enablePan = false;

    // Raycaster for mouse picking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Create cube group
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    // Setup lighting
    this.setupLighting();

    // Setup event listeners
    this.setupEventListeners();

    // Build cube geometry
    this.buildCube();

    // Start animation loop
    this.animate();
  }

  /**
   * Sets up lighting for the scene
   * Uses ambient + 2 directional lights for good visibility
   */
  private setupLighting(): void {
    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight1);

    // Fill light from opposite side
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    this.scene.add(directionalLight2);
  }

  /**
   * Builds the 3D cube with 54 clickable facelets
   */
  private buildCube(): void {
    // Create 6 faces, each with 9 facelets
    // Face positions relative to cube center
    const facePositions = {
      UP: { position: [0, 1.5, 0], rotation: [-Math.PI / 2, 0, 0] },
      DOWN: { position: [0, -1.5, 0], rotation: [Math.PI / 2, 0, 0] },
      FRONT: { position: [0, 0, 1.5], rotation: [0, 0, 0] },
      BACK: { position: [0, 0, -1.5], rotation: [0, Math.PI, 0] },
      LEFT: { position: [-1.5, 0, 0], rotation: [0, -Math.PI / 2, 0] },
      RIGHT: { position: [1.5, 0, 0], rotation: [0, Math.PI / 2, 0] }
    };

    for (const [faceName, faceData] of Object.entries(facePositions)) {
      const face = faceName as Face;
      this.createFace(
        face,
        new THREE.Vector3(...faceData.position as [number, number, number]),
        new THREE.Euler(...faceData.rotation as [number, number, number])
      );
    }
  }

  /**
   * Creates a single face with 9 facelets
   */
  private createFace(face: Face, position: THREE.Vector3, rotation: THREE.Euler): void {
    // Create 3x3 grid of facelets
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const faceletPosition = row * 3 + col;
        this.createFacelet(face, faceletPosition, position, rotation, row, col);
      }
    }
  }

  /**
   * Creates a single facelet (sticker) on the cube
   */
  private createFacelet(
    face: Face,
    position: number,
    facePosition: THREE.Vector3,
    faceRotation: THREE.Euler,
    row: number,
    col: number
  ): void {
    // Create rounded square geometry for facelet
    const geometry = new THREE.BoxGeometry(
      this.FACELET_SIZE,
      this.FACELET_SIZE,
      0.1,
      1,
      1,
      1
    );

    // Create material with default color (will be updated later)
    const material = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.4,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position facelet within face grid
    // Center the grid around (0, 0)
    const offsetX = (col - 1) * this.CUBE_SPACING;
    const offsetY = (1 - row) * this.CUBE_SPACING; // Invert Y for top-to-bottom

    // Apply local position
    mesh.position.set(offsetX, offsetY, 0.06);

    // Apply face rotation and position
    mesh.rotation.copy(faceRotation);
    mesh.position.add(facePosition);

    // Store metadata
    mesh.userData = {
      face,
      position,
      isCenter: position === 4
    };

    // Add to scene
    this.cubeGroup.add(mesh);

    // Store in map for easy access
    const key = `${face}-${position}`;
    this.facelets.set(key, mesh);
  }

  /**
   * Updates the cube to reflect the given state
   */
  public updateCubeState(state: CubeState): void {
    for (const [face, colors] of Object.entries(state.faces)) {
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const key = `${face}-${i}`;
        const facelet = this.facelets.get(key);

        if (facelet && color) {
          this.setFaceletColor(facelet, color);
        }
      }
    }
  }

  /**
   * Sets the color of a facelet
   */
  private setFaceletColor(facelet: THREE.Mesh, color: Color): void {
    const material = facelet.material as THREE.MeshStandardMaterial;
    const hexColor = this.colorToHex(color);
    material.color.setHex(hexColor);
    material.needsUpdate = true;
  }

  /**
   * Converts our Color enum to hex color
   */
  private colorToHex(color: Color): number {
    const colorMap: Record<Color, number> = {
      [Color.WHITE]: 0xffffff,
      [Color.YELLOW]: 0xffd500,
      [Color.GREEN]: 0x009b48,
      [Color.BLUE]: 0x0046ad,
      [Color.ORANGE]: 0xff5800,
      [Color.RED]: 0xb71234
    };
    return colorMap[color] || 0x333333;
  }

  /**
   * Highlights the selected facelet
   */
  public highlightFacelet(identifier: FaceletIdentifier | null): void {
    // Remove previous highlight
    if (this.selectedFacelet) {
      const material = this.selectedFacelet.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(0x000000);
      material.emissiveIntensity = 0;

      // Animate back to normal scale
      this.animateScale(this.selectedFacelet, 1.0);
    }

    if (!identifier) {
      this.selectedFacelet = null;
      return;
    }

    // Highlight new facelet
    const key = `${identifier.face}-${identifier.position}`;
    const facelet = this.facelets.get(key);

    if (facelet) {
      this.selectedFacelet = facelet;
      const material = facelet.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(0x4a90e2);
      material.emissiveIntensity = 0.5;

      // Animate scale up
      this.animateScale(facelet, 1.1);
    }
  }

  /**
   * Animates facelet scale with smooth easing
   */
  private animateScale(mesh: THREE.Mesh, targetScale: number): void {
    const duration = 200; // ms
    const startScale = mesh.scale.x;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = startScale + (targetScale - startScale) * eased;

      mesh.scale.set(scale, scale, 1);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Sets up event listeners for mouse/touch interaction
   */
  private setupEventListeners(): void {
    // Mouse/touch move for raycasting
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('click', this.onClick.bind(this));

    // Resize handler
    window.addEventListener('resize', this.onResize.bind(this));

    // Hover effect
    this.canvas.addEventListener('pointerover', () => {
      this.canvas.style.cursor = 'pointer';
    });
  }

  /**
   * Handles pointer move events for hover effects
   */
  private onPointerMove(event: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cubeGroup.children);

    // Reset cursor
    this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
  }

  /**
   * Handles click events on facelets
   */
  private onClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cubeGroup.children);

    if (intersects.length > 0) {
      const facelet = intersects[0].object as THREE.Mesh;
      const { face, position, isCenter } = facelet.userData;

      // Don't allow selecting center facelets
      if (!isCenter && this.onFaceletSelect) {
        this.onFaceletSelect({ face, position });
      }
    }
  }

  /**
   * Handles window resize
   */
  private onResize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Update controls
    this.controls.update();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Rotates the cube to show a specific face
   */
  public rotateToFace(face: Face): void {
    // Calculate target rotation based on face
    const rotations: Record<Face, { x: number; y: number }> = {
      [Face.FRONT]: { x: 0, y: 0 },
      [Face.BACK]: { x: 0, y: Math.PI },
      [Face.LEFT]: { x: 0, y: Math.PI / 2 },
      [Face.RIGHT]: { x: 0, y: -Math.PI / 2 },
      [Face.UP]: { x: -Math.PI / 2, y: 0 },
      [Face.DOWN]: { x: Math.PI / 2, y: 0 }
    };

    const target = rotations[face];
    if (!target) return;

    // Animate camera position
    const duration = 800;
    const startRotation = { x: this.controls.getAzimuthalAngle(), y: this.controls.getPolarAngle() };
    const startTime = performance.now();

    const animateRotation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate rotation
      const currentX = startRotation.x + (target.y - startRotation.x) * eased;
      const currentY = startRotation.y + (target.x - startRotation.y) * eased;

      // Update camera
      const radius = this.camera.position.length();
      this.camera.position.x = radius * Math.sin(currentY) * Math.cos(currentX);
      this.camera.position.y = radius * Math.cos(currentY);
      this.camera.position.z = radius * Math.sin(currentY) * Math.sin(currentX);
      this.camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      }
    };

    requestAnimationFrame(animateRotation);
  }

  /**
   * Cleans up Three.js resources
   */
  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Dispose of geometries and materials
    this.cubeGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });

    // Dispose of renderer
    this.renderer.dispose();

    // Remove canvas
    this.container.removeChild(this.canvas);

    // Remove event listeners
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
