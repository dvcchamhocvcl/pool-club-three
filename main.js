import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import * as cannon from 'cannon-es'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




const PI = Math.PI
const GUI = new dat.GUI()

//*Camera and scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const orbit = new OrbitControls(camera, renderer.domElement)

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//*WORLD INIT
const world = new cannon.World({
    gravity: new cannon.Vec3(0, -9.81,0)
})
const timeStep = 1/60

// Animate function
function animate() {
  world.step = timeStep
  // groundMesh.position.copy(groundBody.position)
  // groundMesh.quaternion.copy(groundBody.quaternion)
	requestAnimationFrame( animate );
	orbit.update();
	renderer.render( scene, camera );
}
//*Helpers
function initHelpers() {
    const axeHelper = new THREE.AxesHelper(100,100,100)
    const gridHelper = new THREE.GridHelper(30,50)
    scene.add(axeHelper, gridHelper)
}
//BODIES
const groundBody = new cannon.Body({
  shape : new cannon.Plane(),
  mass: 10,
})
world.addBody(groundBody)

//*objects
//Plane
const planeGeometry = new THREE.PlaneGeometry(50,50)
const planeMaterial = new THREE.MeshLambertMaterial({color: 0xfffff1,side: THREE.DoubleSide})
const groundMesh = new THREE.Mesh(planeGeometry, planeMaterial)
groundMesh.rotation.x = PI/2
scene.add(groundMesh)


//*gltf loader & texture loader init
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

//table
loader.load('./public/models/table/scene.gltf', (gltf) => {
    const table = gltf.scene
    scene.add(table);
    const modelFolder = GUI.addFolder('Table');
    table.position.set(-4.2,0.1,3.45)
    const modelPosition = { x: -4.2, y: 0.1, z: 3.45 };
    modelFolder.add(modelPosition, 'x', -10, 10).onChange((value) => { table.position.x = value; });
    modelFolder.add(modelPosition, 'y', -10, 10).onChange((value) => { table.position.y = value; });
    modelFolder.add(modelPosition, 'z', -10, 10).onChange((value) => { table.position.z = value; });
    modelFolder.open();
  }, undefined, (error) => {
  console.error('An error occurred while loading the model', error);
  });
//ball
const ballgeo = new THREE.SphereGeometry(0.05,30,30)

const ballMaterials = new THREE.MeshLambertMaterial({color: 0xfffff1})

const ball = new THREE.Mesh(ballgeo, ballMaterials)
ball.position.set(0,1,0)
scene.add(ball)

//camera
camera.position.set(2,1,5);
orbit.update();

function initLight() {
    
    //*LIGHTS
    //*------Directional Light-------------*//
    const dirlight = new THREE.DirectionalLight(0xFFFFFF, 3)
    const dirlightHelper = new THREE.DirectionalLightHelper( dirlight, 10 )
    dirlight.position.set(10, 10, 0)
    dirlight.target.position.set(0,0,0)
    dirlight.castShadow = true
    scene.add(dirlight, dirlightHelper)
    dirlightHelper.update()
    //*------Ambient Light----------------*//
    const amblight = new THREE.AmbientLight(   {color:0x404040} , 1)
    scene.add(amblight)
    //*------Spotlight-------------------*//
    const spotlight = new THREE.SpotLight(0xffffff)
    const spotlightHelper = new THREE.SpotLightHelper(spotlight)
    spotlight.position.set(0,5,0)
    spotlight.angle = PI/6
    spotlight.castShadow = true
    spotlight.intensity = 1
    spotlight.penumbra = 0.7
    scene.add(spotlight)
    scene.add(spotlightHelper)
    spotlightHelper.update()
}
    
//*dat.GUI

const option = {
    ambientLightColor: 0x404040,
}

GUI.addColor(option, 'ambientLightColor').onChange((e)=>{
    amblight.color.set(e)
})





initLight()
initHelpers()
animate()

