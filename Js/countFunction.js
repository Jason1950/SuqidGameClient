import {stateOutput} from './stateAPI.js'

// para init
let count = 0

// register a shake event
window.addEventListener('shake', shakeEventDidOccur, false);

//shake event callback
function shakeEventDidOccur () {

    // get api turn state from stateAPI.js with function
    let apiTurnState = stateOutput()

    // check the alive state, if die then UI go dwon gray!
    if(apiTurnState) {
        $('.main3').delay(1000).fadeOut(200);
        $('.main4-out').delay(1000).fadeIn(200);
    }

    if(count == 299) {
        // $('.main3').delay(300).fadeOut(200);
        $('.main5-win').delay(100).fadeIn(200);
    }
    
    // update count UI
    if(count<300) count += 1;
    $(".countClass").text(`步數 : ${count} / 300 `);

}

function reCount(){
    count = 0;
    $('.main4-out').delay(100).fadeOut(200);
    $('.main3').delay(100).fadeIn(200);
    $(".countClass").text(`步數 : ${count} / 300 `);


}

// test button and don't need real shake
$('#testCountButton').click(
    // count += 290,
    shakeEventDidOccur
);

export {reCount}