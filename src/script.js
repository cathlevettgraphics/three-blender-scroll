// CSS
import './style.css';
// THREE
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AdditiveBlending, CullFaceNone } from 'three';
// DEBUGGER
import * as dat from 'dat.gui';
// GSAP
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// SHADERS – added rule to webpack
import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import { AUTHENTIC_DATA } from 'dns-packet';

/*************************
 ******** CANVAS
 *************************/

const canvas = document.querySelector('canvas.webgl');

/*************************
 ******** SCENE
 *************************/

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xede0d4);

/*************************
 ******** LOADERS
 *************************/

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

/*************************
 ******** TEXTURES
 *************************/

const bakedTexture = textureLoader.load('models/baked-deset.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

// Particle texture
const particleTexture = textureLoader.load('particles/glow.png');

/*************************
 ******** MATERIALS
 *************************/

//  Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

/*************************
 ******** DESERT
 *************************/

gltfLoader.load('models/dino-bake.glb', (gltf) => {
  const children = [...gltf.scene.children];
  const backgroundGroup = new THREE.Group();
  for (const child of children) {
    backgroundGroup.add(child);
    backgroundGroup.scale.set(0.1, 0.1, 0.1);
    backgroundGroup.position.set(0, -0.25, 0);

    // scene.traverse(function (child) {
    //   if (child.isMesh) {
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //   }
    // });

    // Apply baked texture
    scene.traverse((child) => {
      child.material = bakedMaterial;
    });
    scene.add(backgroundGroup);

    const worldSpin = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        backgroundGroup.rotation,
        {
          y: -Math.PI,
        },
        {
          y: 0,
          duration: 6,
          ease: 'power4.out',
        },
      );
      return tl;
    };
  }
});

/*************************
 ******** DINOSAUR
 *************************/

gltfLoader.load('models/dino.gltf', (gltf) => {
  const children = [...gltf.scene.children];

  const dinoGroup = new THREE.Group();
  for (const child of children) {
    dinoGroup.add(child);
    // SET SCALE of all mesh elements
    dinoGroup.scale.set(0.1, 0.1, 0.1);
    dinoGroup.position.set(0, -0.25, 0);

    // SET SHADOWS TO CAST of all mesh elements
    // scene.traverse(function (child) {
    //   if (child.isMesh) {
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //   }
    // });
    // Add dinosaur
    scene.add(dinoGroup);

    // DINO ANIMATIONS

    const dinoJump = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        dinoGroup.position,
        {
          y: 0,
        },
        {
          y: 0.25,
          repeat: 1,
          yoyo: true,
          repeat: 5,
          duration: 0.05,
          ease: 'power4.out',
        },
      );
      return tl;
    };

    const dinoForward = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        dinoGroup.position,
        {
          x: -1,
        },
        {
          x: 3,
          ease: 'back.out(1.7)',
        },
      );
      return tl;
    };

    const dinoSpin = () => {
      const tl = gsap.timeline();
      tl.to(dinoGroup.rotation, {
        duration: 1,
        y: -Math.PI,
        ease: 'back.out(1.7)',
      });
      return tl;
    };

    const dinoSpin2 = () => {
      const tl = gsap.timeline();
      tl.to(dinoGroup.rotation, {
        y: Math.PI / 6,
        ease: 'back.out(1.7)',
      });
      return tl;
    };

    const dinoBack = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        dinoGroup.position,
        {
          x: 3,
        },
        {
          x: -2,
          ease: 'back.out(1.7)',
        },
      );
      return tl;
    };

    // TEXT BOX ANIMATIONS
    const box1 = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.box',
        {
          opacity: 0.7,
          y: 1000,
        },
        {
          opacity: 0.7,
          y: 0,
          ease: 'none',
        },
      );
      return tl;
    };

    const box2 = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.box2',
        {
          opacity: 0.7,
          y: 1250,
        },
        {
          opacity: 0.7,
          y: 0,
          ease: 'none',
        },
      );
      return tl;
    };

    const box3 = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.box3',
        {
          opacity: 0.7,
          y: 1750,
        },
        {
          opacity: 0.7,
          y: 0,
          ease: 'none',
        },
      );
      return tl;
    };

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.three-wrapper',
        start: 'top top', // [trigger] [scroller] positions
        end: '+=3000',
        scrub: 1,
        pin: true,
        // markers: true,
      },
    });

    // add animations and labels to the timeline
    tl.add(dinoJump());
    tl.add(box1());
    tl.add(dinoForward());
    tl.add(box2());
    tl.add(dinoSpin());
    tl.add(box3());
    tl.add(dinoBack());
    tl.add(dinoSpin2());
  }

  /*************************
   ******** FIREFLIES
   *************************/

  // Geometry
  const firefliesGeometry = new THREE.BufferGeometry();
  // Fill with random coords in space
  const firefliesCount = 38;
  const positionArray = new Float32Array(firefliesCount * 3);
  const scaleArray = new Float32Array(firefliesCount);

  for (let i = 0; i < firefliesCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 8;
    positionArray[i * 3 + 1] = Math.random() * 2;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 8;

    scaleArray[i] = Math.random();
  }

  firefliesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3),
  );
  firefliesGeometry.setAttribute(
    'aScale',
    new THREE.BufferAttribute(scaleArray, 1),
  );

  // Material
  const firefliesMaterial = new THREE.ShaderMaterial({
    // POINTS MATERIAL SETTINGS
    // size: 8,
    // sizeAttenuation: false,
    // color: 'orange',
    // map: particleTexture,
    // alphaMap: particleTexture,
    // alphaTest: 0.0001,
    // depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    transparent: true,
    // SHADERS
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: 20 },
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
  });

  // Points
  const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
  scene.add(fireflies);

  // Copy of renderer for animation test
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    // Renderer
    renderer.render(scene, camera);
    // Call tick again on next freme
    window.requestAnimationFrame(tick);
  };

  tick();
});

/*************************
 ******** SIZES
 *************************/

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Setup an isometric perspective
  const aspectRatio = sizes.width / sizes.height;
  // Ortho zoom
  const zoom = 4;
  // Bounds
  camera.left = -zoom * aspectRatio;
  camera.right = zoom * aspectRatio;
  camera.top = zoom;
  camera.bottom = -zoom;
  // Near/Far
  camera.near = -100;
  camera.far = 100;
  // Set position & look at world center
  camera.position.set(zoom, zoom, zoom);
  camera.lookAt(new THREE.Vector3());

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*************************
 ******** CAMERA
 *************************/

const camera = new THREE.OrthographicCamera();
scene.add(camera);

const aspectRatio = sizes.width / sizes.height;
// Setup an isometric perspective
const zoom = 4;
camera.left = -zoom * aspectRatio;
camera.right = zoom * aspectRatio;
camera.top = zoom;
camera.bottom = -zoom;

camera.near = -100;
camera.far = 100;

camera.position.set(zoom, zoom, zoom);
camera.lookAt(new THREE.Vector3());

// Update camera properties
camera.updateProjectionMatrix();

/*************************
 ******** LIGHTS
 *************************/

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(4.5, 3.4, -1.3);
// ADD SHADOWS
directionalLight.castShadow = true;
scene.add(directionalLight);

/*************************
 ******** ORBIT CONTROLS
 *************************/

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/*************************
 ******** RENDERER
 *************************/

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

/*************************
 ******** SHADOWS
 *************************/

// renderer.shadowMap.enabled = true;

/*************************
 ******** SHADOWS
 *************************/

const clock = new THREE.Clock();

/*************************
 ******** TICK
 *************************/

const tick = () => {
  // Renderer
  renderer.render(scene, camera);
  // Call tick again on next freme
  window.requestAnimationFrame(tick);
};

tick();

/*************************
 ******** HELPERS
 *************************/

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5,
// );
// scene.add(directionalLightHelper);

/*************************
 ******** DEBUG
 *************************/

// const gui = new dat.GUI({ width: 400 });

// Light
// gui.add(directionalLight.position, 'x').min(-5).max(10).step(0.01);
// gui.add(directionalLight.position, 'y').min(-5).max(10).step(0.01);
// gui.add(directionalLight.position, 'z').min(-5).max(10).step(0.01);
// gui.add(directionalLight, 'intensity').min(-5).max(10).step(0.01);
// gui.add(ambientLight, 'intensity').min(-5).max(10).step(0.01);
