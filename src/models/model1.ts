import * as THREE from 'three';
import { Component } from '../class/component/Component';
import { Audio } from '../class/entities/Audio';

export class Model1 extends Component {
  constructor(audio: Audio) {
    const geometry = new THREE.BoxGeometry(400, 400, 400);
    const material = new THREE.MeshNormalMaterial();

    super(audio, geometry, material);
  }

  animate = () => {
    this.audio.analyser.getByteFrequencyData(this.audio.dataArray);
    const length = this.audio.bufferLength / 3;
    const num1 =
      0.5 +
      (this.audio.dataArray.slice(0, length).reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    const num2 =
      0.5 +
      (this.audio.dataArray
        .slice(length, length * 2)
        .reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    const num3 =
      0.5 +
      (this.audio.dataArray
        .slice(length * 2, length * 3)
        .reduce((prev, cur) => prev + cur) /
        length) *
        0.5;
    this.mesh.scale.set(num1 / 100, num3 / 100, num2 / 100);
    this.mesh.rotation.z += num2 / 1000;
    this.mesh.rotation.y += num3 / 1000;
    this.renderer.render(this.scene, this.camera);
    this.animeID = requestAnimationFrame(this.animate);
  };
}
