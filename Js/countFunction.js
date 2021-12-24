import {stateTurnOutput, stateStartOutput} from './stateAPI.js'
// import {animationToLose} from './webglCanvas.js'

const Core = 100;
const AWS = 300;
let winCount = Core;

// para init
let count = 0
let apiStartState
let apiTurnState
let outAnimation = false;
let winState = false;
// register a shake event
window.addEventListener('shake', shakeEventDidOccur, false);

//shake event callback
function shakeEventDidOccur () {
    $(".main1-permision").fadeOut(200);

    // get api turn state from stateAPI.js with function
    apiTurnState = stateTurnOutput()
    apiStartState = stateStartOutput()

    

    if(count == (winCount-1)) {
        // $('.main3').delay(300).fadeOut(200);
        $('.main5-win').delay(100).fadeIn(200);
        winState = true
    }
    console.log('apiStartState: ', apiStartState, apiTurnState);
    if(apiStartState){
        // update count UI
        if(count<winCount) count += 1;
        $(".countClass").text(`進度 : ${parseInt(count*100 / winCount)}% `);
        
    }else{
        if(count<30) count += 1;
        $(".countClass").text(`進度 : ${parseInt(count*100 / winCount)}% `);
    }

    // check the alive state, if die then UI go dwon gray!
    if(apiTurnState && !winState) {
        $('.main3').delay(1000).fadeOut(200);
        outAnimation = true;
        // animationToLose()
        // $('.main4-out').delay(1000).fadeIn(200);
    }
}

function reCount(){
    count = 0;
    outAnimation = false
    $('.main4-out').delay(100).fadeOut(200);
    $('.main3').delay(100).fadeIn(200);
    $(".countClass").text(`進度 : ${parseInt(count*100 / winCount)}% `);

}

function countReturn(){
    return count;
}

function shakeOut(){
    return outAnimation;
}

function winToEnd(){
    return winState;
}

// test button and don't need real shake
$('#testCountButton').click(
    // count += 290,
    shakeEventDidOccur
);

export {reCount, countReturn, shakeOut, winToEnd}