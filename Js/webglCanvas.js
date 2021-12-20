
    import * as THREE from 'https://d1xeexhxuygkal.cloudfront.net/S3webgl/build/three.module.js';
    import { FBXLoader } from 'https://d1xeexhxuygkal.cloudfront.net/S3webgl/export/jsm/loaders/FBXLoader.js';
    import {stateOutput, endCheckFunction} from './stateAPI.js'

    // https://d1xeexhxuygkal.cloudfront.net/S3webgl/export/jsm
    // https://d1xeexhxuygkal.cloudfront.net/S3webgl/build

    const  AWSPath = 'https://d1xeexhxuygkal.cloudfront.net/S3webgl'

    let camera, scene, renderer, stats;
    const clock = new THREE.Clock();

    let mixer;
    let action;
    var canvas;

    let mixerFloor;
    let actionFloor;

    let animationArray =[];

    const resizePara = 1; //4/5;
    const floorSize = 12000;
    const loader = new FBXLoader();



    let apiTurnState = false;
    let lastApiTurnState = false;
    let actionState = false;
    let endCheck = 0


    var cookieColor = localStorage.getItem("cookieColor");

    console.log('this is webgl file and get color : ', cookieColor)
    // cookieColor = 0

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( 0, 100, 250 );
        scene = new THREE.Scene();

        // scene.background = new THREE.TextureLoader().load(AWSPath+'/3dfile/background.jpg');
        scene.background = new THREE.TextureLoader().load('../3dfile/background2.jpg');
        // scene.background = new THREE.TextureLoader().load('../pics/bg5.jpg');
        // scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 200, 2000 );

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


        // ground
        // const standCube = new THREE.Mesh(
        //     new THREE.BoxGeometry(120, 50, 50), //object that contains all the points and faces of the cube
        //     new THREE.MeshPhongMaterial( { color: 0xC63300, depthWrite: true } )
        // )
        // standCube.receiveShadow = true;
        // standCube.position.z = -1550;
        // standCube.name = 'standCube';
        // scene.add(standCube);

        const grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add( grid );



        // const loader = new FBXLoader();
        const groupBoy = new THREE.Group();
        const groupSetFloor = new THREE.Group();

        async function boyLoad(){
            if (cookieColor==null) cookieColor = 0
            console.log('async 3d boy model load function!')

            // const man_txt = new THREE.TextureLoader().load(AWSPath+'/3dfile/playerA_1_new_boy_BaseColor.png');
            // const man_txt = new THREE.TextureLoader().load('../3dfile/playerA_1_new_boy_BaseColor.png');
            // loader.load( '../3dfile/playerA_null.fbx', function ( object ) {
            const man_txt = new THREE.TextureLoader().load(AWSPath+'/3dfile/player'+cookieColor+'.png');
            loader.load( AWSPath+'/3dfile/player'+cookieColor+'.fbx', function ( object ) {
            // loader.load( '../3dfile/boy2.fbx', function ( object ) {


                
                
                man_txt.flipY = true; // we flip the texture so that its the right way up
                const man_mtl = new THREE.MeshPhongMaterial({
                    map: man_txt,
                    color: 0xffffff,
                    skinning: true
                });

                mixer = new THREE.AnimationMixer( object );
                // action = mixer.clipAction( animationArray.find(item=>item.name=='fail') );

                // action = mixer.clipAction( object.animations[0] );
                // console.log('action : ', action);
                // action.play();

                loadAnimation().catch(error => {
                    console.error(error);
                });

                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = man_mtl;
                    }
                } );
                object.scale.multiplyScalar(7.10); 
                object.rotation.y = 3.14;
                groupBoy.add( object );
            } );

            groupBoy.name = "groupBoy";
            scene.add( groupBoy );
        }

        boyLoad().catch(error => {
            console.error(error);
        });



        // loader.load('../3dfile/wolf-head.fbx', function ( object ) {
        loader.load(AWSPath+'/3dfile/rosehead.fbx', function ( object ) {
        // loader.load(AWSPath+'/3dfile/rosehead.fbx', function ( object ) {
            console.log('3d head loading !')
            const man_txt = new THREE.TextureLoader().load(AWSPath+'/3dfile/rose_rose_BaseColor.png');
            man_txt.flipY = true; // we flip the texture so that its the right way up
            const man_mtl = new THREE.MeshPhongMaterial({
                map: man_txt,
                color: 0xffffff,
                skinning: true
            });
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.material = man_mtl;
                    // child.material[0].color.setHex(0xBE77FF);
                }
            } );

            object.scale.multiplyScalar(16.1); 
            object.rotation.y = 3.14
            object.rotation.x = 0.14
            object.position.y = -60
            object.name = 'roseHead';

            scene.add( object );

        } );

    
        // ******************  圓形地殼  *****************//
        loader.load('../3dfile/setFloor3.fbx', function ( object ) {
            console.log('3d setFloor3 loading !')
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // child.material = man_mtl;
                }
            } );
            object.scale.multiplyScalar(0.61); 
            object.position.y = 20
            object.position.z = -190
            object.rotation.set(-190,0,0)
            groupSetFloor.add( object );            
        } );
        // groupSetFloor.name = 'setFloor';
        // scene.add( groupSetFloor );


        const ballSpere = new THREE.SphereGeometry( 15, 32, 16 );

        const sphere = new THREE.Mesh( ballSpere, new THREE.MeshPhongMaterial( { 
            // color: 0xffff00 
            map: new THREE.TextureLoader().load(AWSPath+'/3dfile/music.jpg'),
            // map: new THREE.TextureLoader().load(AWSPath+'/3dfile/playerA_1_new_boy_BaseColor.png'),
            shininess: 10,
        } 
            
            ) );
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.material.needsUpdate = true;


        sphere.name = 'setFloor';
        sphere.scale.multiplyScalar(15.61); 
        sphere.position.y -= 160;
        sphere.position.z -= 200;
        scene.add( sphere );


        
        canvas = document.getElementById("main3-canvas");
        // ---------------- 綁定 canvas 為 自己指定的element !! --------------- //
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true , alpha: true});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;

        // window.addEventListener( 'resize', onWindowResize );
        document.addEventListener("keydown", onDocumentKeyDown, false);
        onWindowResize();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
    }




    // ******************************************************************** //
    //                                                                      //
    //             *********     Animation       **********                 //
    //                                                                      //
    // ******************************************************************** //
    function animate() {
        requestAnimationFrame( animate );
        const delta = clock.getDelta();
        if ( mixer ) mixer.update( delta );
        
        renderer.render( scene, camera );
        headRotationFunction()
        setFloorCome()
        boyReturnFunction()

    }

    function setFloorCome(){
        
        let floorObject = scene.getObjectByName( "setFloor" );
        let state = endCheckFunction()
        let apiTurnState = stateOutput();

        // console.log('end state : ', state)
        if(!state && !apiTurnState) floorObject.rotation.x += 0.031;
    }

    function headRotationFunction(){
        apiTurnState = stateOutput();
        if(lastApiTurnState != apiTurnState){
            
            let cube000 = scene.getObjectByName( "roseHead" );
            TweenMax.to(cube000.rotation, 0.3, 
                {
                    y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
                });
        }
        lastApiTurnState = apiTurnState;
    }

    function boyReturnFunction(){   
        let cube000 = scene.getObjectByName( "groupBoy" );
        
        let state = endCheckFunction()
        
        if(state && endCheck==0){
            endCheck += 1
            TweenMax.to(cube000.rotation, 0.3, 
            {
                y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
            });}
    }
    

    async function loadAnimation(){
        loader.load( AWSPath+'/3dfile/action_fail.fbx', function ( object ) {
            object.animations[ 0 ].name ="fail";
            animationArray.push( object.animations[ 0 ]);  
            
            
        } );
        loader.load( AWSPath+'/3dfile/action_idle.fbx', function ( object ) {
            object.animations[ 0 ].name ="idle";
            animationArray.push( object.animations[ 0 ]);     

        } );
        loader.load( AWSPath+'/3dfile/action_run.fbx', function ( object ) {
            object.animations[ 0 ].name ="run";
            animationArray.push( object.animations[ 0 ]);    
            initAction(object.animations[ 0 ])

        } );
        // loader.load( '../3dfile/winAnamationOnly.fbx', function ( object ) {
        loader.load( AWSPath+'/3dfile/action_win.fbx', function ( object ) {
            object.animations[ 0 ].name ="win";
            animationArray.push( object.animations[ 0 ]);        

        } );   
    }

    function initAction(animate){
        action = mixer.clipAction( animate );
        // action = mixer.clipAction( object.animations[0] );
        console.log('action : ', action);
        action.play();
    }


    function removeModelAndReload(object) {
        var selectedObject = scene.getObjectByName('groupBoy');
        scene.remove( selectedObject );

        const groupBoy = new THREE.Group();
        boyLoad().catch(error => {
            console.error(error);
        });

        // animate();
    }



    // ******************************************************************** //
    //                                                                      //
    //             *********     KEY DOWN       **********                  //
    //                                                                      //
    // ******************************************************************** //

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
        } else if (keyCode == 66) {     
            // ******* b = 66 ********* //
            let cube000 = scene.getObjectByName( "standCube" );
            cube000.position.z -= 3;
            console.log('z: ', cube000.position.z);
        } else if (keyCode == 86) {     
            // ******* v = 86 ********* //
            let cube000 = scene.getObjectByName( "standCube" );
            cube000.position.z += 3;
            console.log('z: ', cube000.position.z);
        }
    }





    // ******************************************************************** //
    //                                                                      //
    //            *********     Controller      **********                  //
    //                                                                      //
    // ******************************************************************** //
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



    // ******************************************************************** //
    //                                                                      //
    //               *********     floor      **********                    //
    //                                                                      //
    // ******************************************************************** //
    //
    // let floor_txt = new THREE.TextureLoader().load(AWSPath+'/3dfile/floor.jpg');
    // floor_txt.wrapS = floor_txt.wrapT = THREE.RepeatWrapping;
    // floor_txt.offset.set( 0, 0 );
    // floor_txt.repeat.set( 4, 40 ); // 橫向、直向 複製
    // var material = new THREE.MeshPhongMaterial( {
    //     color: 0xffffff,
    //     specular:0x111111,
    //     shininess: 10,
    //     map: floor_txt,
    // } );
    // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 10, floorSize ), // new THREE.MeshPhongMaterial( { color: 0x932119, depthWrite: false } ) 
    //     material
    // );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // mesh.position.y = 1;
    // mesh.position.z -= floorSize/2;
    // mesh.name = 'floor';
    // scene.add( mesh );
    // 
    // function floorCome(){
    //     let floorObject = scene.getObjectByName( "floor" );
    //     floorObject.position.z += 1.5;
    // }



    // ******************************************************************** //
    //                                                                      //
    //              *********     Devil head      **********                //
    //                                                                      //
    // ******************************************************************** //
    // texture
    // var materials = [
    //     new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
    //     new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
    //     new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
    //     new THREE.MeshPhongMaterial( { color: 0xfbfbfb, depthWrite: false } ),
    //     new THREE.MeshLambertMaterial({
    //         // map: THREE.ImageUtils.loadTexture(AWSPath+'/3dfile/back.jpg')
    //         map: THREE.ImageUtils.loadTexture('../3dfile/back.jpg')
    //     }),
    //     new THREE.MeshLambertMaterial({
    //         // map: THREE.ImageUtils.loadTexture(AWSPath+'/3dfile/back.jpg')
    //         map: THREE.ImageUtils.loadTexture('../3dfile/devil-head.jpg')
    //     })
    // ];


    export {removeModelAndReload};