import stateOutput from './stateAPI.js'

// para init
let count = 0

// register a shake event
window.addEventListener('shake', shakeEventDidOccur, false);

//shake event callback
function shakeEventDidOccur () {

    // get api turn state from stateAPI.js with function
    let apiTurnState = stateOutput.stateOutput()

    // check the alive state, if die then UI go dwon gray!
    if(apiTurnState) {
        $('.main3').delay(1000).fadeOut(200);
        $('.main4-out').delay(1000).fadeIn(200);
    }
    
    // update count UI
    count += 1;
    $(".countClass").text(`步數 : ${count} `);

}

// test button and don't need real shake
$('#testCountButton').click(
    shakeEventDidOccur
);