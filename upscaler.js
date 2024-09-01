import * as THREE from 'three';

// Simple Upscaling Plugin
class UpscalerPlugin {
    constructor(renderer, scene, camera, options = {}) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // Plugin Settings
        this.options = Object.assign({
            useEdgeDetection: true,  // Edge Detection
            scaleFactor: 2.0,        // Upscaling Value
        }, options);

        this.onSceneDraw = null;
        this.onRender = null;

        this.initRenderTargets();
        this.initShaders();
    }

    initRenderTargets() {
        // Create render textures
        const renderTargetParams = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
        };

        const width = this.renderer.domElement.width / this.options.scaleFactor;
        const height = this.renderer.domElement.height / this.options.scaleFactor;

        this.lowResTarget = new THREE.WebGLRenderTarget(width, height, renderTargetParams);
        this.highResTarget = new THREE.WebGLRenderTarget(width * this.options.scaleFactor, height * this.options.scaleFactor, renderTargetParams);
    }

    // Init Upscaling Shaders
    initShaders() {
        this.upscalerShader = {
            uniforms: {
                'tDiffuse': { value: null },
                'resolution': { value: new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height) },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;

                varying vec2 vUv;

                void main() {
                    vec2 texelSize = 1.0 / resolution;

                    // Get Neighbor Pixels
                    vec4 color = texture2D(tDiffuse, vUv);
                    vec4 colorUp = texture2D(tDiffuse, vUv + vec2(0.0, texelSize.y));
                    vec4 colorDown = texture2D(tDiffuse, vUv - vec2(0.0, texelSize.y));
                    vec4 colorLeft = texture2D(tDiffuse, vUv - vec2(texelSize.x, 0.0));
                    vec4 colorRight = texture2D(tDiffuse, vUv + vec2(texelSize.x, 0.0));

                    // Work with edges
                    float edgeStrength = 1.0 - smoothstep(0.1, 0.3, length(color.rgb - colorUp.rgb));
                    edgeStrength += 1.0 - smoothstep(0.1, 0.3, length(color.rgb - colorDown.rgb));
                    edgeStrength += 1.0 - smoothstep(0.1, 0.3, length(color.rgb - colorLeft.rgb));
                    edgeStrength += 1.0 - smoothstep(0.1, 0.3, length(color.rgb - colorRight.rgb));
                    edgeStrength = clamp(edgeStrength, 0.0, 1.0);

                    // Applying edges incresing and filtering
                    vec3 enhancedColor = mix(color.rgb, vec3(1.0) - (1.0 - color.rgb) * edgeStrength, 0.5);

                    gl_FragColor = vec4(enhancedColor, color.a);
                }
            `
        };
        
        this.upscalerMaterial = new THREE.ShaderMaterial({
            uniforms: this.upscalerShader.uniforms,
            vertexShader: this.upscalerShader.vertexShader,
            fragmentShader: this.upscalerShader.fragmentShader
        });

        // Generate Sample Scene
        if(!this.onSceneDraw){
            this.fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.upscalerMaterial);
            this.sceneRTT = new THREE.Scene();
            this.cameraRTT = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            this.sceneRTT.add(this.fsQuad);
        }else{
            this.onSceneDraw();
        }
    }

    render() {
        // Render scene at low resolution
        this.renderer.setRenderTarget(this.lowResTarget);
        this.renderer.render(this.scene, this.camera);

        // apply upscaling
        this.upscalerMaterial.uniforms['tDiffuse'].value = this.lowResTarget.texture;
        this.upscalerMaterial.uniforms['resolution'].value.set(this.lowResTarget.width, this.lowResTarget.height);

        // Render to window
        this.renderer.setRenderTarget(null);
        if(!this.onRender)
            this.renderer.render(this.sceneRTT, this.cameraRTT);
        else
            this.onRender();
    }
}

export { UpscalerPlugin };