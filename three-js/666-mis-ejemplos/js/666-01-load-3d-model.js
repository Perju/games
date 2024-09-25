import * as THREE from "three";
import { GUI } from "dat.gui";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

let renderer;
let scene;
let camera;

let control;
let camControl;

const loader = new GLTFLoader();

function init() {
  // crea la escena, que contendra todos los elementos
  scene = new THREE.Scene();

  // crea una camara
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );

  // crea el renderizador, establece el color de fondo y el tamaño
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // control para la camara
  camControl = new OrbitControls(camera, renderer.domElement);

  // añade luces a la escena para ilumniar las geometrias
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  let pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  let ambienLight = new THREE.AmbientLight(0x111111);
  scene.add(ambienLight);

  // posición y dirección de la camara
  camera.position.x = 0;
  camera.position.y = 2;
  camera.position.z = 4;

  camera.lookAt(scene.position);

  // añadir el resultado del renderizador al elemento html
  document.body.appendChild(renderer.domElement);

  // // controles para modificar el texto
  control = new (function () {
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.scaleZ = 1.0;

  })();
  addControls(control);

  // Cargar modelo del monito
  loader.load(
    "./assets/suzane.glb",
    function (gltf) {
      let suzanne = gltf.scene.getObjectByName("Suzanne")
      scene.add(suzanne);
    },
    undefined,
    function (error) {
      console.log(error);
    }
  );
  render();
}

function addControls(controlObject) {
  let scaleObject = () => {
    let { scaleX, scaleY, scaleZ } = controlObject;
    scene.getObjectByName("Suzanne").scale.set(scaleX, scaleY, scaleZ);
  }
  let gui = new GUI();
  gui.add(controlObject, "scaleX", 0.1, 10).onChange(scaleObject);
  gui.add(controlObject, "scaleY", 0.1, 10).onChange(scaleObject);
  gui.add(controlObject, "scaleZ", 0.1, 10).onChange(scaleObject);
}

function render() {
  renderer.render(scene, camera);
  camControl.update()
  requestAnimationFrame(render);
}

window.onload = init;
