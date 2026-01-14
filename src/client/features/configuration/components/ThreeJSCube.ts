import * as THREE from 'three';
import { Color } from '../types';

/**
 * 3D Rubik's Cube using Three.js
 * Simple implementation showing a 3x3x3 cube with colored faces
 */
export class ThreeJSCube {
  private element: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Group;
  private animationId: number | null = null;

  constructor() {
    this.element = this.render();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.cube = new THREE.Group();

    this.init();
  }

  private render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'threejs-cube-container';
    container.style.width = '240px';
    container.style.height = '240px';
    return container;
  }

  private init(): void {
    // Setup renderer
    this.renderer.setSize(240, 240);
    this.renderer.setClearColor(0x000000, 0);
    this.element.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.z = 5;

    // Create cube
    this.createCube();
    this.scene.add(this.cube);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    // Start animation
    this.animate();
  }

  private createCube(): void {
    const cubieSize = 0.95;
    const gap = 0.05;

    // Color mapping
    const colorMap: Record<string, number> = {
      [Color.WHITE]: 0xFFFFFF,
      [Color.YELLOW]: 0xFFD500,
      [Color.GREEN]: 0x009B48,
      [Color.BLUE]: 0x0046AD,
      [Color.ORANGE]: 0xFF5800,
      [Color.RED]: 0xB71234,
    };

    // Create 3x3x3 grid of cubies
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = this.createCubie(x, y, z, cubieSize, colorMap);
          this.cube.add(cubie);
        }
      }
    }
  }

  private createCubie(
    x: number,
    y: number,
    z: number,
    size: number,
    colorMap: Record<string, number>
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size);

    // Create materials for each face
    const materials = [
      new THREE.MeshStandardMaterial({
        color: x === 1 ? colorMap[Color.RED] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Right - Red
      new THREE.MeshStandardMaterial({
        color: x === -1 ? colorMap[Color.ORANGE] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Left - Orange
      new THREE.MeshStandardMaterial({
        color: y === 1 ? colorMap[Color.WHITE] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Top - White
      new THREE.MeshStandardMaterial({
        color: y === -1 ? colorMap[Color.YELLOW] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Bottom - Yellow
      new THREE.MeshStandardMaterial({
        color: z === 1 ? colorMap[Color.GREEN] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Front - Green
      new THREE.MeshStandardMaterial({
        color: z === -1 ? colorMap[Color.BLUE] : 0x000000,
        roughness: 0.3,
        metalness: 0.1
      }), // Back - Blue
    ];

    const cubie = new THREE.Mesh(geometry, materials);
    cubie.position.set(x, y, z);

    // Add edge lines for better visibility
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cubie.add(wireframe);

    return cubie;
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate the cube
    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  };

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    this.element.remove();
  }
}
