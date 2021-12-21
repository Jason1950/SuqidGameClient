import {reCount, countReturn} from './countFunction.js'


let apiStartState = '';
let apiTurnState = '';
let cookieUuid = ''
let apiEndState = false;
let lastState = false;
let count = 0;

const server = 'Core';

const urlCoreServer = 'https://core-srv-dev.appxervice.com';
const urlAWSServer = '';
const apiCoreKEY = 'WDSlnSQvauvJmzhwjCQFtHjd';
const apiAWSKEY = '';

let KEY = '';
let URL = '';

if (server == 'Core'){
    URL=urlCoreServer;
    KEY=apiCoreKEY;
    console.log('The Connect Server is Core !');
}
else if(server == 'AWS'){
    URL=urlAWSServer;
    KEY=apiAWSKEY;
    console.log('The Connect Server is AWS !');

}



// api header info
const headConst = {
    headers: {
        'apiKey': KEY,
        "Content-Type": "application/json"
        }
}


// axios api function
async function stateAPI(){
    let response = await axios.get(URL+'/api/squid/queryGameStatus',
        headConst
    )
    // debug messege
    console.log( response.data.result);
    $(".stateClass").text(`State : ${response.data.result.start} , ${response.data.result.turn} , ${response.data.result.end}`)

    // update api Turn State for game rules
    apiStartState = response.data.result.start;
    apiTurnState =  response.data.result.turn;
    apiEndState = response.data.result.end;
    if (lastState != response.data.result.start && response.data.result.start==true) {
        // apiStart = true;
        showStart()
    }
    lastState =  response.data.result.start;
}

// update api Turn State to other js file
function stateTurnOutput(){
    return apiTurnState
    // return apiStartState,apiTurnState
}

function stateStartOutput(){
    return apiStartState
    // return apiStartState,apiTurnState
}

function showStart(){
    $(".main6-start").fadeIn(10);

    setTimeout(()=>{
        $(".main6-start").text(`2`)
    },1000)
    setTimeout(()=>{
        $(".main6-start").text(`1`)
    },2000)
    setTimeout(()=>{
        setTimeout(()=>{
            $(".main6-start").text(`3`)
            reCount()
        },900)
        $(".main6-start").text(`START`)
        $(".main6-start").fadeOut(1010);

        
    },3000)



}

// IIFE call API functino for times!
(function timeAPI(){
    const temp = setInterval(()=>{
        stateAPI();
        let cookieUuid = localStorage.getItem("cookieUuid");
        count = countReturn()
        // if(cookieUuid) console.log('uuid:',cookieUuid)
        countUpdateData(cookieUuid)
    },300)
    setTimeout(()=>{
        console.log('clear !!')
        clearInterval(temp)
    },1800000)
})()



async function registNameAPI(name){

    const data = JSON.stringify({
        "username": name,
        "color": "0"
    });
    
    let response = await axios.post(URL+'/api/squid/createUser',
        data,    
        headConst
    )

    // debug messege
    console.log( response.data.result.uuid);
    
    $(".uuidClass").text(`uuid : ${response.data.result.uuid}`);
    localStorage.setItem("cookieUuid",response.data.result.uuid);

    // // update api Turn State for game rules
    // apiTurnState =  response.data.result.turn;
}

function countUpdateData(cookieUuid){
    if((cookieUuid.length)>1 && count%10 ==0) updateUserData(cookieUuid, count)
    // console.log(cookieUuid, count)
}

async function updateUserData(uuid,count0){
    const url = URL+'/api/squid/updatUserData'
    const data = JSON.stringify({
        "uuid": uuid,
        "alive": true,
        "count": count0,
        "updateTime": new Date().getTime()
    });
    
    let response = await axios.post(url,
        data,    
        headConst
    )
    // // update api Turn State for game rules
    // apiTurnState =  response.data.result.turn;
}

function endCheckFunction(){
    return apiEndState;
}


export {stateTurnOutput, stateStartOutput, registNameAPI, endCheckFunction};