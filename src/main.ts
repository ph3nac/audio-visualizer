/* eslint-disable @typescript-eslint/no-use-before-define */
import * as THREE from 'three';
import './style.css';

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('DOMContentLoaded', init2);

function init2() {
  const msg: HTMLOutputElement = document.querySelector('output')!;
  const startBtn: HTMLButtonElement = document.querySelector('#start_button')!;
  const stopBtn: HTMLButtonElement = document.querySelector('#start_button')!;
  const canvasElt: HTMLCanvasElement = document.querySelector('#MyCanvas2')!;

  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startBtn.disabled = true;
    const audioContext = new window.AudioContext();

    msg.textContent = 'Now Loading...';

    fetch('music.wav')
      .then((res) => res.arrayBuffer())
      .then((downloadedBuffer) =>
        audioContext.decodeAudioData(downloadedBuffer),
      )
      .then((decodedBuffer) => {
        msg.textContent = 'Configuring audio stack...';

        const sourceNode = new AudioBufferSourceNode(audioContext, {
          buffer: decodedBuffer,
          loop: true,
        });
        const analyserNode = new AnalyserNode(audioContext);
        const javascripNode = audioContext.createScriptProcessor();
      })
      .catch(() => {
        console.log('error');
      });
  });
}

function init() {
  const width = 960;
  const height = 540;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')!,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, 1000);

  // Box
  const geometry = new THREE.BoxGeometry(500, 500, 500);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
  });
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

  // Light
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2;
  light.position.set(1, 1, 1);
  scene.add(light);

  // Draw
  tick();
  function tick() {
    requestAnimationFrame(tick);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
}
