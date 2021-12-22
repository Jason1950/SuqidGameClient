
    import * as THREE from 'https://d1xeexhxuygkal.cloudfront.net/S3webgl/build/three.module.js';
    import { FBXLoader } from 'https://d1xeexhxuygkal.cloudfront.net/S3webgl/export/jsm/loaders/FBXLoader.js';
    import {stateTurnOutput, endCheckFunction} from './stateAPI.js'
    import {shakeOut, winToEnd} from'./countFunction.js'

    // https://d1xeexhxuygkal.cloudfront.net/S3webgl/export/jsm
    // https://d1xeexhxuygkal.cloudfront.net/S3webgl/build

    const  AWSPath = 'https://d1xeexhxuygkal.cloudfront.net/S3webgl'

    let camera, scene, renderer, stats;
    const clock = new THREE.Clock();

    let mixer;
    let action;
    let action2;
    var canvas;

    let mixerFloor;
    let actionFloor;

    let animationArray =[];

    const resizePara = 1; //4/5;
    const floorSize = 12000;
    const loader = new FBXLoader();

    let winStopState = false;
    let winState = false;
    let lastWinState = false;
    let apiTurnState = false;
    let lastApiTurnState = false;
    let outState = false;
    let lastOutState = false;
    let actionState = false;
    let endCheck = 0


    var cookieColor = localStorage.getItem("cookieColor");

    console.log('this is webgl file and get color : ', cookieColor)
    // cookieColor = 3

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
        // scene.fog = new THREE.Fog( 0x000, 100, 1000 );
        // scene.fog = new THREE.FogExp2(0x000,0.0011);

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
            // loader.load( '../3dfile/playerA_null.fbx', function ( object ) {
            const man_txt = new THREE.TextureLoader().load(AWSPath+'/3dfile/player'+cookieColor+'.png');
            loader.load( AWSPath+'/3dfile/player'+cookieColor+'.fbx', function ( object ) {
            // loader.load( '../3dfile/playerBB.fbx', function ( object ) {

                man_txt.flipY = true; // we flip the texture so that its the right way up
                const man_mtl = new THREE.MeshPhongMaterial({
                    map: man_txt,
                    color: 0xffffff,
                    skinning: true
                });

                mixer = new THREE.AnimationMixer( object );

                // action = mixer.clipAction( object.animations[0] );
                // action.play();
                // console.log('action : ', action);

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
                object.name = "modelboy"
                groupBoy.add( object );
            } );

            groupBoy.name = "groupBoy";
            scene.add( groupBoy );
        }

        boyLoad().catch(error => {
            console.error(error);
        });

        loader.load('../3dfile/rosehead2.fbx', function ( object ) {
            console.log('3d head loading !')
            const man_txt = new THREE.TextureLoader().load('../3dfile/rose_rose_BaseColor2.png');
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

            object.scale.multiplyScalar(17.1); 
            object.rotation.y = 3.14
            object.rotation.x = 0.25
            object.position.y = -80
            object.name = 'roseHead';

            scene.add( object );

        } );

    
 


        const ballSpere = new THREE.SphereGeometry( 15, 32, 16 );

        const sphere = new THREE.Mesh( ballSpere, new THREE.MeshPhongMaterial( { 
            map: new THREE.TextureLoader().load(AWSPath+'/3dfile/music.jpg'),
            shininess: 10,
        } ) );

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
        outFunction()
        WinToEndForAnimation()
    }

    function setFloorCome(){
        
        let floorObject = scene.getObjectByName( "setFloor" );
        let state = endCheckFunction()
        

        let apiTurnState = stateTurnOutput();

        // console.log('end state : ', winStopState)
        if((!state && !apiTurnState)&&!winStopState) floorObject.rotation.x += 0.031;
    }

    function headRotationFunction(){
        apiTurnState = stateTurnOutput();
        if(lastApiTurnState != apiTurnState){
            
            let cube000 = scene.getObjectByName( "roseHead" );
            TweenMax.to(cube000.rotation, 0.3, 
                {
                    y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
                });
            animationAllStop();
        }
        if((lastApiTurnState != apiTurnState) && apiTurnState==false){
            
            animationToRun();
        }
        lastApiTurnState = apiTurnState;
    }

    function outFunction(){
        outState = shakeOut()
        if((lastOutState!= outState ) && outState){
            animationToLose()
        }
        lastOutState = outState;
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

        // loader.load( '../3dfile/playerD_run.fbx', function ( object ) {
        loader.load( AWSPath+'/3dfile/action_run.fbx', function ( object ) {
            object.animations[ 0 ].name ="run";
            animationArray.push( object.animations[ 0 ]);   
            initAction(object.animations[ 0 ])
        } );

        // loader.load( '../3dfile/playerD_win.fbx', function ( object ) {
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
    }


    function JanimationPlay(name){
        const fSpeed = 0.1, tSpeed = 0.1;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        // console.log(animationArray);
        action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        action.crossFadeTo(action2, fSpeed, true);
        setTimeout(function() {
            action2.enabled = true;
            // action2.crossFadeTo(action, tSpeed, true);
            action2.crossFadeTo(action, tSpeed, true);
            // currentlyAnimating[0] = false;
            console.log('play ...');
            action.reset();
            action.play();
            }, action2._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }

    function animnationToOther(name){
        const fSpeed = 0.1, tSpeed = 0.1;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        // console.log(animationArray);
        action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        action2.setLoop();
        // action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        // action2.uncacheClip()
        action.crossFadeTo(action2, fSpeed, true);
    }
    
    function animnationToBack(name){
        const fSpeed = 0.1, tSpeed = 0.1;
        action2.enabled = false;
        // action2.stop();
        action2.uncacheClip()

        action2.reset();

        action2.crossFadeTo(action, tSpeed, true);
        // action2.stop();

        // action2.crossFadeTo(action, tSpeed, false);
        // currentlyAnimating[0] = false;
        console.log('play ...');
        action.reset();
        action.play();
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
            // let cube000 = scene.getObjectByName( "standCube" );
            // cube000.position.z += 3;
            // console.log('z: ', cube000.position.z);
            JanimationPlay('fail')
            // animnationToWin('win')
        }
        else if(keyCode == 77){
            // ******  < ******
            animnationToOther('run')
            // animnationToBack()
        }
        else if(keyCode == 188){
            // ******  < ******
            animnationToOther('win')
            // animnationToBack()
        }
        else if(keyCode == 190){
            // ****** >  ******
            const fSpeed = 0.1, tSpeed = 0.1;
            action2 = mixer.clipAction( animationArray.find(item=>item.name=='fail') );
            action2.setLoop(THREE.LoopOnce);
            action2.reset();
            action2.play();
            action.crossFadeTo(action2, fSpeed, true);
            $('.main4-out').delay(900).fadeIn(200);
        }
        else if(keyCode == 191){
            // stop use to idle
            action.stop()
            action2.stop()
        }
        else if(keyCode == 80){
            winState = true;
            // stop use to idle
            winStopState = true;
            let cube000 = scene.getObjectByName( "groupBoy" );
            console.log('xxxxxx',cube000);
            TweenMax.to(cube000.rotation, 0.3, 
                {
                    y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
                });
            animationToWin();
            $('.main5-win').delay(100).fadeIn(200);
        }
    }



    // ******************************************************************** //
    //                                                                      //
    //       *********     Animation Controller      **********             //
    //                                                                      //
    // ******************************************************************** //

    function animationToWin(){
        animnationToOther('win');
    }

    function animationToRun(){
        animnationToOther('run');
    }

    function animationToLose(){
        if(action) action.stop();
        if(action2) action2.stop();
        const fSpeed = 0.1, tSpeed = 0.1;
        action2 = mixer.clipAction( animationArray.find(item=>item.name=='fail') );
        action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        action.crossFadeTo(action2, fSpeed, true);
        $('.main4-out').delay(900).fadeIn(200);
    }

    function animationAllStop(){
        if(action) action.stop();
        if(action2) action2.stop();
    }

    function WinToEndForAnimation(){
        winState = winToEnd();
        if ((winState != lastWinState)&&winState){
        winStopState = true;
        let cube000 = scene.getObjectByName( "groupBoy" );
        console.log('xxxxxx',cube000);
        TweenMax.to(cube000.rotation, 0.3, 
            {
                y: cube000.rotation.y+Math.PI, ease: Linear.easeNone
            });
        animationToWin();
        $('.main5-win').delay(100).fadeIn(200);}
        lastWinState = winState
    }

    export {removeModelAndReload, animationToRun, animationAllStop};