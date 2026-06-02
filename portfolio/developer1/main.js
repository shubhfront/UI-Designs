import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const init3D = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(20, 3, 5); // Angle similar to the image

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls (Keep it to maintain the correct camera target, but disable interactions)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Enable interactions to allow user to drag and move the model
    controls.enableZoom = false; // Disabled scroll zooming as requested
    controls.enablePan = true;
    controls.enableRotate = true; 
    
    controls.target.set(0, -1.0, 0); // Focus slightly below center


    // Lighting (matching the React Three Fiber code in the screenshot)
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.15); // Adjust for physical lights if needed, but start with 0.15
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 500); // Keeping 500 for physical lighting fallback, but setting to match the visual look
    spotLight.position.set(-20, 50, 10);
    spotLight.angle = 0.12;
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    // Ambient light just in case
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 3D Stars Background Animation
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 4000;
    const posArray = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i += 3) {
        // Distribute points spherically for a better parallax effect
        const r = 50 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);     // x
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta); // y
        posArray[i+2] = r * Math.cos(phi);                   // z
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    // Load Model
    const loader = new GLTFLoader();
    console.log("Starting model load...");

    // Add a loading text
    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.color = '#fff';
    loadingDiv.style.fontFamily = 'monospace';
    loadingDiv.style.fontSize = '1.2rem';
    loadingDiv.innerText = 'Loading 3D Workspace...';
    container.appendChild(loadingDiv);

    loader.load(
        './desktop_pc/scene.gltf',
        (gltf) => {
            const model = gltf.scene;

            // Adjust scale and position based on screen size to make it responsive
            const isMobile = window.innerWidth <= 768;
            model.scale.set(isMobile ? 0.6 : 0.75, isMobile ? 0.6 : 0.75, isMobile ? 0.6 : 0.75);
            // Lowered further downwards and scaled down for mobile as requested
            model.position.set(0, isMobile ? -3.8 : -4.2, isMobile ? -2.2 : -1.5);
            model.rotation.set(0, 0, 0); // Straightened base rotation

            // Enable shadows
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(model);

            console.log("Model loaded successfully", model);
            // Remove loading text
            if (container.contains(loadingDiv)) {
                container.removeChild(loadingDiv);
            }
        },
        (xhr) => {
            // Optional: update loading progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened loading the GLTF:', error);
            loadingDiv.innerText = 'Failed to load 3D model.';
        }
    );

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        controls.update(); // Update controls for smooth damping

        // Slowly rotate the stars in the background
        if (starsMesh) {
            starsMesh.rotation.x -= 0.0002;
            starsMesh.rotation.y -= 0.0003;
        }

        renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        const isMobile = window.innerWidth <= 768;
        if (scene.children.length > 0) {
            scene.children.forEach(child => {
                if (child.type === "Group") {
                    child.scale.set(isMobile ? 0.6 : 0.75, isMobile ? 0.6 : 0.75, isMobile ? 0.6 : 0.75);
                    child.position.set(0, isMobile ? -3.8 : -4.2, isMobile ? -2.2 : -1.5);
                }
            });
        }
    });
};

export const initEarth = () => {
    const container = document.getElementById('earth-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(-4, 3, 6); // Match exact coordinates from reference

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Lights (adding a bit more to ensure visibility)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2.0);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    let earthModel = null;
    const loader = new GLTFLoader();
    loader.load(
        './planet/scene.gltf',
        (gltf) => {
            earthModel = gltf.scene;
            earthModel.scale.set(2.5, 2.5, 2.5); // Scale based on the reference project
            scene.add(earthModel);
        },
        undefined,
        (error) => {
            console.error('Error loading earth model:', error);
        }
    );

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // for damping and autoRotate
        renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
};
