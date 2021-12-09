window.onload = function() {

    //create a new instance of shake.js.
    var myShakeEvent = new Shake({
        threshold: 3,
        timeout: 300
    });

    // start listening to device motion
    myShakeEvent.start();
};