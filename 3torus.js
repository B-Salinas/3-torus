// 3torus.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Torus parameters
const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const materials = [
  new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true, transparent: true, opacity: 0.5 }), // Red
  new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.5 }), // Blue
  new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.5 })  // Green
];

// Create and position toruses
const toruses = [];
for (let i = 0; i < 3; i++) {
  const mesh = new THREE.Mesh(geometry, materials[i]);
  mesh.position.x = (i - 1) * 3; // Spread them out
  toruses.push(mesh);
  scene.add(mesh);
}

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 7;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  toruses.forEach((torus, i) => {
    torus.rotation.x += 0.01 + i * 0.005;
    torus.rotation.y += 0.01 + i * 0.005;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 