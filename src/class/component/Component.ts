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

    this.startButton = document.getElementById('startButton')!;
    this.playButton = document.getElementById('playButton')!;
    this.startButton.addEventListener('click', () => {
      this.start().catch(() => {});
    });
    this.playButton.addEventListener('click', this.play);
  }

  abstract animate: () => void;

  start = async () => {
    if (this.isStarted === true) return;
    await this.audio.start();
    this.animate();
    this.isPlay = true;
    this.isStarted = true;
    this.playButton.innerText = 'stop';
  };

  play = () => {
    if (this.isStarted === false) return;
    if (this.isPlay === true) {
      this.audio.suspend();
      this.isPlay = false;
      this.playButton.innerText = 'play';
      cancelAnimationFrame(this.animeID);
    } else if (this.isPlay === false) {
      this.audio.resume();
      this.isPlay = true;
      this.animate();
      this.playButton.innerText = 'stop';
    }
  };
}
