# Three JS Upscaler
**Three JS Upscaler** — is an algorithm to enhance real-time animations and images using simple and efficient shaders. 
To implement the plugin in **Three.js based** on the idea of AMD FSR-like upscaling, we need to create a shader that will apply filtering and upscaling of the image in real time. The plugin will work cross-platform thanks to WebGL.

❓ **What does the ThreeJS Upscaler Library include?**
- Real-time Rendering Upscaling;
- Simple edge smoothing shader;
- GPU-Based and cross-platform;
- Automatic recalucation on window resize;

![Three JS Upscaler](https://github.com/user-attachments/assets/11290a38-66a7-43e7-8764-6c39b8885d0a)

## Get Started
**Three JS Upscaler** installs into your project as easily as possible - just download and try to use this plugin in your project.

**Basic Usage Example (main.js):**
```
import * as THREE from 'three';
import { UpscalerPlugin } from './upscaler.js';

/* Your scene preparing code here */

// Connect Upscaler
const upscaler = new UpscalerPlugin(renderer, scene, camera, {
    scaleFactor: 1.25,
    useEdgeDetection: true
});

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

// Animate
function animate() {
    requestAnimationFrame(animate);

    // Animate Sample Cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render with upscaling
    upscaler.render();
}

animate();
```

## Cross-platform support
The plugin uses WebGL, which is supported by most modern browsers and devices, making it cross-platform. It will work correctly on both desktop computers and mobile devices.

## Note
> This library is still under development. The system performs best on cartoon textures. Do not use scaling > 10 at production.

## Join Community
[Discord Community](https://discord.gg/xuNTKRDebx)

## Support Me
**You can support the development and updating of libraries and assemblies by dropping a coin:**
<table>
  <tr><td>Bitcoin (BTC)</td><td>bc1qef2d34r4xkrm48zknjdjt7c0ea92ay9m2a7q55</td></tr>
  <tr><td>Etherium (ETH)</td><td>0x1112a2Ef850711DF4dE9c432376F255f416ef5d0</td></tr>
  <tr><td>Boosty</td><td>https://boosty.to/devsdaddy</td></tr>
</table>
