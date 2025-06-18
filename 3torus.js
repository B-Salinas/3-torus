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
scene.add(new THREE.AmbientLight(0xffffff));

camera.position.z = 7;

// 3D Grid Helper
function create3DGrid(size = 10, divisions = 10, color = 0xffffff) {
  const step = size / divisions;
  const half = size / 2;
  const vertices = [];

  // Lines parallel to X
  for (let y = -half; y <= half; y += step) {
    for (let z = -half; z <= half; z += step) {
      vertices.push(-half, y, z, half, y, z);
    }
  }
  // Lines parallel to Y
  for (let x = -half; x <= half; x += step) {
    for (let z = -half; z <= half; z += step) {
      vertices.push(x, -half, z, x, half, z);
    }
  }
  // Lines parallel to Z
  for (let x = -half; x <= half; x += step) {
    for (let y = -half; y <= half; y += step) {
      vertices.push(x, y, -half, x, y, half);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.LineBasicMaterial({ color, opacity: 0.3, transparent: true });
  return new THREE.LineSegments(geometry, material);
}

const grid3D = create3DGrid(10, 10, 0xffffff);
scene.add(grid3D);

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

// Toggle grid visibility with 'G' key
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'g') {
    grid3D.visible = !grid3D.visible;
  }
}); 