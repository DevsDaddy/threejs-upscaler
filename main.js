import * as THREE from 'three';
import { UpscalerPlugin } from './upscaler.js';

// Create Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Three Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create Geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Initialize Our Upscaler Plugin
const upscaler = new UpscalerPlugin(renderer, scene, camera, {
    scaleFactor: 1.25,
    useEdgeDetection: true
});

// Initialize stats monitor
const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS, 2: MB
document.body.appendChild(stats.dom);

// On Window Resizing
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update Upscaler Parameters
    upscaler.initRenderTargets();
    upscaler.initShaders();
}

window.addEventListener('resize', onWindowResize, false);

function animate() {
    stats.begin();

    requestAnimationFrame(animate);

    // Animate Sample Cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render with upscaling
    upscaler.render();

    stats.end();
}

animate();
