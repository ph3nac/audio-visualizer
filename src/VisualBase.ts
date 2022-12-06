/* eslint-disable no-plusplus */
import * as THREE from 'three';
import { setupSample } from './lib/audiolib';

export class VisualBase {
  private audioContext: AudioContext;

  private width: number;

  private height: number;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private geometry: THREE.BoxGeometry;

  private material: THREE.MeshNormalMaterial;

  private mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;

  private isPlay = false;

  private playButton: HTMLButtonElement;

  private startButton: HTMLButtonElement;

  private analyser: AnalyserNode;

  private sampleSource: AudioBufferSourceNode | undefined;

  private dtmf: AudioBuffer | undefined;

  private bufferLength: number;

  private dataArray: Uint8Array;

  private isStarted = false;

  animeID: number | undefined;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    this.playButton = document.createElement('button');
    this.playButton.innerText = 'play';
    document.body.appendChild(this.playButton);
    this.playButton.addEventListener('click', this.play.bind(this));

    this.startButton = document.createElement('button');
    this.startButton.innerText = 'start';
    document.body.appendChild(this.startButton);
    this.startButton.addEventListener('click', () => this.start.bind(this));

    // init three.js
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height);
    this.camera.position.set(0, 0, +1000);
    this.geometry = new THREE.BoxGeometry(400, 400, 400);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    // init analyserNode
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.connect(this.audioContext.destination);
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.renderer.render(this.scene, this.camera);
    this.start().catch(() => {
      throw new Error('error');
    });
  }

  private animate() {
    this.analyser.getByteFrequencyData(this.dataArray);
    const num =
      this.dataArray.reduce((prev, cur) => prev + cur, 0) / this.bufferLength;
    const length = this.bufferLength / 3;
    const num1 =
      0.5 +
      (this.dataArray.slice(0, length).reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    const num2 =
      0.5 +
      (this.dataArray
        .slice(length, length * 2)
        .reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    const num3 =
      0.5 +
      (this.dataArray
        .slice(length * 2, length * 3)
        .reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    this.mesh.scale.set(num1 / 100, num3 / 100, num2 / 100);
    // this.mesh.rotation.x += num1 / 1000;
    this.mesh.rotation.z += num2 / 1000;
    this.mesh.rotation.y += num3 / 1000;
    this.renderer.render(this.scene, this.camera);
    this.animeID = requestAnimationFrame(this.animate.bind(this));
  }

  private async start() {
    // init web audio
    if (this.isStarted === true) return;
    this.dtmf = await setupSample(this.audioContext, 'music.wav');
    this.sampleSource = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.dtmf,
    });
    this.sampleSource.loop = true;
    this.sampleSource.connect(this.analyser);
    this.sampleSource.start();
    this.isPlay = true;
    this.isStarted = true;
    this.animate();
  }

  private play() {
    if (this.isStarted === false) return;
    if (this.isPlay === true) {
      this.sampleSource?.stop();
      this.isPlay = false;
      cancelAnimationFrame(this.animeID!);
    } else if (this.isPlay === false) {
      this.sampleSource = new AudioBufferSourceNode(this.audioContext, {
        buffer: this.dtmf,
      });
      this.sampleSource.connect(this.analyser);
      this.sampleSource.start(this.audioContext.currentTime);
      this.isPlay = true;
      this.animate();
    }
  }
}
