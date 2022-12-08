/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as THREE from 'three';
import { Audio } from '../entities/Audio';
import { Component } from './Component';

export abstract class Component3D extends Component {
  protected mesh: THREE.Mesh;

  protected renderer: THREE.WebGLRenderer;

  protected scene: THREE.Scene;

  protected camera: THREE.PerspectiveCamera;

  constructor(
    audio: Audio,
    mesh: THREE.Mesh,
    startButton: HTMLElement,
    playButton: HTMLElement,
  ) {
    super(audio, startButton, playButton);
    this.mesh = mesh;
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
    this.scene.add(mesh);
    this.renderer.render(this.scene, this.camera);
  }
}
