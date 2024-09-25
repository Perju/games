import * as THREE from "three";

let renderer;
let scene;
let camera;

let control;
let cubes = [];
let reset;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.addEventListener("mousedown", clickChangeColor, false);

  let cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff2255 });
  reset = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
  reset.position.x = 16;
  reset.position.y = 8;
  reset.name = "reset";
  scene.add(reset);
  addCubes();

  let dirLight = new THREE.DirectionalLight();
  dirLight.position.set(25, 24, 15);
  dirLight.lookAt(scene.position);

  scene.add(dirLight);

  camera.position.x = 10;
  camera.position.y = 16;
  camera.position.z = 33;
  camera.lookAt(scene.position);

  document.body.appendChild(renderer.domElement);

  render();
}

function addCubes() {
  let startX = -10;
  let startY = -10;

  for (let x = startX; x <= 10; x += 4) {
    for (let y = startY; y <= 10; y += 4) {
      let cube = new THREE.Mesh(reset.geometry, reset.material.clone());
      cube.position.x = x;
      cube.position.y = y;
      cube.name = "cube";
      cubes.push(cube);
      scene.add(cube);
    }
  }
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function clickChangeColor(event) {
  let mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  let raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects([...cubes, reset]);

  if (intersects.length > 0) {
    if (intersects[0].object.name === "cube") {
      intersects[0].object.material.color.set(Math.random() * 0xffffff);
    }
    if (intersects[0].object.name === "reset") {
      cubes.forEach((cube) => cube.material.color.set(0xff2255));
    }
  } else {
  }
}

window.onload = init;
