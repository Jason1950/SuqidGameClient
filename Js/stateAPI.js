let apiTurnState = '';

// api header info
const headConst = {
    headers: {
        'apiKey': 'WDSlnSQvauvJmzhwjCQFtHjd',
        "Content-Type": "application/json"
        }
}

// axios api function
async function stateAPI(){
    let response = await axios.get('https://core-srv-dev.appxervice.com/api/squid/queryGameStatus',
        headConst
    )
    // debug messege
    console.log( response.data.result);
    $(".stateClass").text(`State : ${response.data.result.start} , ${response.data.result.turn}`)

    // update api Turn State for game rules
    apiTurnState =  response.data.result.turn;
}

// update api Turn State to other js file
function stateOutput(){
    return apiTurnState
}

// IIFE call API functino for times!
(function timeAPI(){
    const temp = setInterval(()=>{
        stateAPI();
    },300)
    setTimeout(()=>{
        console.log('clear !!')
        clearInterval(temp)
    },600000)
})()



async function registNameAPI(name){

    const data = JSON.stringify({
        "username": name,
        "color": "G"
    });
    
    let response = await axios.post('https://core-srv-dev.appxervice.com/api/squid/createUser',
        data,    
        headConst
    )

    // debug messege
    console.log( response.data.result.uuid);
    
    $(".uuidClass").text(`uuid : ${response.data.result.uuid}`)

    // // update api Turn State for game rules
    // apiTurnState =  response.data.result.turn;
}



export {stateOutput, registNameAPI};