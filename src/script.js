import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { CullFaceNone } from 'three';
gsap.registerPlugin(ScrollTrigger);

/*************************
 ******** CANVAS
 *************************/

const canvas = document.querySelector('canvas.webgl');

/*************************
 ******** SCENE
 *************************/

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfcf8b1);

/*************************
 ******** LOADERS
 *************************/

const gltfLOader = new GLTFLoader();

/*************************
 ******** DESERT
 *************************/

gltfLOader.load('models/desert.gltf', (gltf) => {
  const children = [...gltf.scene.children];
  const backgroundGroup = new THREE.Group();
  for (const child of children) {
    backgroundGroup.add(child);
    backgroundGroup.scale.set(0.1, 0.1, 0.1);
    scene.add(backgroundGroup);
  }
  // console.log(backgroundGroup);
});

/*************************
 ******** DINOSAUR
 *************************/

gltfLOader.load('models/dino.gltf', (gltf) => {
  const children = [...gltf.scene.children];
  const dinoGroup = new THREE.Group();
  for (const child of children) {
    dinoGroup.add(child);
    dinoGroup.scale.set(0.1, 0.1, 0.1);
    scene.add(dinoGroup);

    // Animation
    const dinoMotion = () => {
      const tl = gsap.timeline();
      tl.fromTo(
        dinoGroup.position,
        {
          x: -1,
        },
        {
          x: 3,
          duration: 3,
        },
      );
      return tl;
    };

    const dinoSpin = () => {
      const tl = gsap.timeline();
      tl.to(dinoGroup.rotation, {
        duration: 2,
        y: -Math.PI,
      });
      return tl;
    };

    // dinoSpin();

    // const dinoBack = () => {
    //   const tl = gsap.timeline();
    //   tl.fromTo(
    //     dinoGroup.position,
    //     {
    //       x: 3,
    //     },
    //     {
    //       x: -2,
    //       duration: 3,
    //     },
    //   );
    //   return tl;
    // };

    // Timeline
    // main.add(textOne());
    // main.add(textTwo());
    // main.add(dinoMotion());
    // main.add(dinoSpin(), '-=1');
    // main.add(dinoBack());

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.three-wrapper',
        start: 'top top', // [trigger] [scroller] positions
        // end: '20px 80%', // [trigger] [scroller] positions
        scrub: true,
        pin: true,
        markers: true,

        toggleClass: 'active',
        anticipatePin: 1,
        snap: 1 / 10, // progress increment
        pinReparent: true, // moves to documentElement during
        invalidateOnRefresh: true, // clears start values on
      },
    });

    // add animations and labels to the timeline
    tl.addLabel('start').fromTo(
      '.box',
      { opacity: 1, y: 500 },
      { opacity: 1, y: -300 },
    );
    tl.addLabel('middle').fromTo(
      '.box2',
      { opacity: 0, y: 500 },
      { opacity: 1, y: -300 },
    );
    tl.addLabel('end').fromTo(
      '.box3',
      { opacity: 0, y: 500 },
      { opacity: 1, y: -300 },
    );
  }
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
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
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

/*************************
 ******** TICK
 *************************/

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/*************************
 ******** HELPERS
 *************************/

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
