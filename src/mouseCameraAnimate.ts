import * as THREE from 'three';

export const mouseAnimate = (
  mouseX: number,
  rot: number,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
) => {
  const targetRot = (mouseX / window.innerWidth) * 360;
  rot += (targetRot - rot) * 0.02;
  const radian = (rot * Math.PI) / 180;
  camera.position.x = 1000 * Math.sin(radian);
  camera.position.y = 1000 * Math.cos(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render(scene, camera);

  requestAnimationFrame(() => {
    mouseAnimate(mouseX, rot, camera, renderer, scene);
  });
};
