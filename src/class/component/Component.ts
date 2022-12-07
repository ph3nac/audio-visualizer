import * as THREE from 'three';
import { Audio } from '../entities/Audio';

export abstract class Component {
  protected audio: Audio;

  protected animeID = 0;

  protected mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

  protected renderer: THREE.WebGLRenderer;

  protected scene: THREE.Scene;

  protected camera: THREE.PerspectiveCamera;

  private playButton: HTMLElement;

  private startButton: HTMLElement;

  private isStarted = false;

  private isPlay = false;

  constructor(
    audio: Audio,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    startButton: HTMLElement,
    playButton: HTMLElement,
  ) {
    this.audio = audio;
    const width = 400;
    const height = 400;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height);
    this.camera.position.set(0, 0, +1000);
    const div = document.getElementById('canvasRoot')!;
    div.appendChild(this.renderer.domElement);
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.renderer.render(this.scene, this.camera);

    this.startButton = startButton;
    this.playButton = playButton;
    this.startButton.addEventListener('click', this.start);
    this.playButton.addEventListener('click', this.play);
  }

  abstract animate: () => void;

  start = () => {
    if (this.isStarted === true) return;
    this.animate();
    this.isPlay = true;
    this.isStarted = true;
  };

  play = () => {
    if (this.isStarted === false) return;
    if (this.isPlay === true) {
      this.isPlay = false;
      cancelAnimationFrame(this.animeID);
    } else if (this.isPlay === false) {
      this.isPlay = true;
      this.animate();
    }
  };
}
