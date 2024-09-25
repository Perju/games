import * as THREE from "three";
import { GUI } from "dat.gui";

let renderer;
let scene;
let camera;

let control;

const loader = new THREE.FontLoader();
let params;

let fonts = {
  "helvetiker-regular":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/helvetiker_regular.typeface.json",
  "helvetiker-bold":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/helvetiker_bold.typeface.json",
  "gentilis-regular":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/gentilis_bold.typeface.json",
  "gentilis-bold":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/gentilis_bold.typeface.json",
  "optimer-regular":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/optimer_regular.typeface.json",
  "optimer-bold":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/optimer_bold.typeface.json",
  "droid-sans-regular":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/droid/droid_sans_regular.typeface.json",
  "droid-sans-bold":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/droid/droid_sans_bold.typeface.json",
  "droid-serif-regular":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/droid/droid_serif_regular.typeface.json",
  "droid-serif-bold":
    "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/fonts/droid/droid_serif_bold.typeface.json",
};

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
  renderer.setClearColor(0xffffff, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

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
  camera.position.x = -50;
  camera.position.y = 200;
  camera.position.z = 700;

  camera.lookAt(scene.position);

  // añadir el resultado del renderizador al elemento html
  document.body.appendChild(renderer.domElement);

  // controles para modificar el texto
  control = new (function () {
    this.bevelEnabled = false;
    this.bevelThickness = 8;
    this.bevelSize = 4;

    this.font = "helvetiker";
    this.weight = "regular";
    this.style = "normal";

    this.height = 20;
    this.size = 70;
    this.curveSegments = 4;

    this.text = "Juan Pablo\nPerez Garcia";
  })();
  addControls(control);

  // parametros para la fuente
  params = {
    material: 0,
    extrudeMaterial: 1,
    bevelEnabled: control.bevelEnabled,
    bevelThickness: control.bevelThickness,
    bevelSize: control.bevelSize,
    font: undefined,
    weight: control.weight,
    style: control.style,
    height: control.height,
    size: control.size,
    curveSegments: control.curveSegments,
  };
  // cargar las fuentes para el texto
  loadFont(control.font, control.weight);

  render();
}

function loadFont(fontName, fontWeight) {
  let font = fontName.replace(/ /gi, x => "-") + "-" + fontWeight;
  let myFont = loader.load(fonts[font], (loadedFont) => {
    // Parametros para el texto
    removeText("text");
    addText(control.text, loadedFont);
  });
  return myFont;
}

function updateText() {
  params = {
    material: 0,
    extrudeMaterial: 1,
    bevelEnabled: control.bevelEnabled,
    bevelThickness: control.bevelThickness,
    bevelSize: control.bevelSize,
    font: undefined,
    weight: control.weight,
    style: control.style,
    height: control.height,
    size: control.size,
    curveSegments: control.curveSegments,
  };
  loadFont(control.font, control.weight);
}

function addControls(controlObject) {
  let gui = new GUI();
  gui.add(controlObject, "height", 5, 50).onChange(updateText);
  gui.add(controlObject, "size", 20, 100).onChange(updateText);
  gui.add(controlObject, "curveSegments", 2, 12).step(1).onChange(updateText);
  gui.add(controlObject, "bevelEnabled").onChange(updateText);
  gui.add(controlObject, "bevelThickness", 2, 16).step(1).onChange(updateText);
  gui.add(controlObject, "bevelSize", 2, 16).onChange(updateText);
  gui.add(controlObject, "weight", ["regular", "bold"]).onChange(updateText);
  gui
    .add(controlObject, "font", ["helvetiker", "optimer", "gentilis", "droid sans", "droid serif"])
    .onChange(updateText);
}

function removeText(name) {
  let currentText = scene.getObjectByName(name);
  if (currentText) scene.remove(currentText);
}

function addText(text, font) {
  params.font = font;
  let textGeo = new THREE.TextGeometry(text, params);
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  let material = [
    new THREE.MeshPhongMaterial({
      color: 0xff22cc,
      flatShading: true,
    }), // front
    new THREE.MeshPhongMaterial({
      color: 0xff22cc,
      flatShading: false,
    }), // side
  ];

  let textMesh = new THREE.Mesh(textGeo, material);
  textMesh.position.x = -textGeo.boundingBox.max.x / 2;
  textMesh.position.y = 0;
  textMesh.name = "text";
  scene.add(textMesh);
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.onload = init;
