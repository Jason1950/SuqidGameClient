
import * as THREE from './build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';
import stateOutput from './stateAPI.js'



let camera, scene, renderer, stats;
const clock = new THREE.Clock();

let mixer;
let action;
var canvas;

const resizePara = 1; //4/5;

let apiTurnState = false;
let lastApiTurnState = false;
let actionState = false;

init();
animate();



function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 100, 250 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );
    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    // texture
    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
        new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
        new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
        new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('../3dfile/back.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('../3dfile/devil-head.jpg')
        })
     ];

    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x932119, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    const headSize = 30;
    const roseHead = new THREE.Mesh(
        new THREE.BoxGeometry(headSize, headSize, headSize), //object that contains all the points and faces of the cube
        materials
    )
    roseHead.name = 'roseHead';
    roseHead.receiveShadow = true;
    roseHead.rotation.x = 0.2
    scene.add(roseHead);


    let cube000 = scene.getObjectByName( "roseHead" );
    cube000.position.y = 170;


    const grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );



    const loader = new FBXLoader();
    const groupBoy = new THREE.Group();
    async function boyLoad(){
        console.log('async load function!')
        // const animationsRokoko = await modelLoader('./3dfile/man_Idle.fbx');
        // https://goodtrace-kouhu.appxervice.com/static/media/tilapia2.796f3975.jpg
        // https://penueling.com/wp-content/uploads/2020/11/ReactNative.png

        // const man_txt = new THREE.TextureLoader().load('../3dfile/boy2.png');
        const man_txt = new THREE.TextureLoader().load('../3dfile/playerA_1_new_boy_BaseColor.png');
        // loader.load( '../3dfile/playerA_1_run.fbx', function ( object ) {
        loader.load( '../3dfile/run.fbx', function ( object ) {
        // loader.load( '../3dfile/boy2.fbx', function ( object ) {

            man_txt.flipY = true; // we flip the texture so that its the right way up
            const man_mtl = new THREE.MeshPhongMaterial({
                map: man_txt,
                color: 0xffffff,
                skinning: true
            });

            console.log('load test !')


            mixer = new THREE.AnimationMixer( object );
            action = mixer.clipAction( object.animations[0] );
            console.log('action : ', action);
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl;
                }
            } );
            object.scale.multiplyScalar(7.10); 
            object.rotation.y = 3.14
            console.log(object.name);
            groupBoy.add( object );
        } );

        groupBoy.name = "groupBoy";
        scene.add( groupBoy );
    }

    boyLoad().catch(error => {
        console.error(error);
    });


    
    canvas = document.getElementById("main3-canvas");
    console.log(canvas);
    // ---------------- 綁定 canvas 為 自己指定的element !! --------------- //
    renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true , alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
    renderer.shadowMap.enabled = true;

    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener("keydown", onDocumentKeyDown, false);

}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
}

function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    headRotationFunction()
}


function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // console.log('key : ', keyCode);
    if (keyCode == 90) {   
        // ******* z = 90 ********* //
        console.log('ZZZZZZ');
        if (actionState) action.play();
        else action.stop();
        
        actionState = !actionState

    } else if (keyCode == 88) {     
        // ******* x = 88 ********* //
        let cube000 = scene.getObjectByName( "roseHead" );
        console.log('xxxxxx',cube000);
        TweenMax.to(cube000.rotation, 0.3, 
            {
                y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
            });
    }
}

function headRotationFunction(){
    apiTurnState = stateOutput.stateOutput();
    if(lastApiTurnState != apiTurnState){
        let cube000 = scene.getObjectByName( "roseHead" );
        TweenMax.to(cube000.rotation, 0.3, 
            {
                y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
            });
    }
    lastApiTurnState = apiTurnState;
}







    // Controlls
    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.maxPolarAngle = Math.PI / 2 - 0.11;
    // controls.minPolarAngle = Math.PI / 3 - 0.15;
    // controls.maxAzimuthAngle = Math.PI *1/4 ;   //from 120 ~ -180 degree 
    // controls.minAzimuthAngle = -Math.PI *2/3 ;
    // controls.enableZoom = false;
    // controls.dampingFactor = 0.1;
    // // controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    // // controls.autoRotateSpeed = 0.2; // 30
    // controls.target.set( 0, 100, 0 );
    // controls.update();