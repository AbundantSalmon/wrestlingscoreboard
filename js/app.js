window.onbeforeunload = () => {
    return "Are you sure?"
}

var scoreBlue = 0;
var scoreRed = 0;
var gameType = "";

var blueFirstName = "";
var blueLastName = "";
var redFirstName = "";
var redLastName = "";

var timerOn = false;
var timerInit = 0;
var timerPause = 0;
var now = 0;

const  phases = [ "1", "rest", "2"];
const timeRest = 30; // should be 30 seconds
var phasePos = 0;
var phasesTime = [0,0,0];

const scoresMap = [ -1, 1, 2, 4, 5];

$(".score.blue").text(scoreBlue);
$(".score.red").text(scoreRed);
$("#startTimer").prop("disabled", true);

$(document).keydown( (e) => {
    
    const blueKeysMap = [71, 70, 68, 83, 65]; // [G, F, D, S, A]
    const redKeysMap = [72, 74, 75, 76, 59]; //[H, J, K, L, ;]

    if (e.keyCode == 32 && $("#startTimer").prop("disabled") == false) {
        e.preventDefault();
        startTimer(now);
        console.log("timerInit: "+timerInit);
    }
    
    if (e.keyCode != 32) {

        if (blueKeysMap.includes(e.keyCode)){
            var addScore = scoresMap[blueKeysMap.indexOf(e.keyCode)];
            blueScoreUpdate(addScore);
        }

        if (redKeysMap.includes(e.keyCode)){
            var addScore = scoresMap[redKeysMap.indexOf(e.keyCode)];
            redScoreUpdate(addScore);
        }
        
    }

})


$("button").click( function() {

    var sideColour = this.parentElement.className;
    var addScore = scoresMap[this.value];
    console.log(Number(addScore)>0);
    switch(sideColour){
// Blue scoring buttons
        case "blue buttonsRow":
            blueScoreUpdate(addScore);
            break;
// Red scoring buttons            
        case "red buttonsRow":
            redScoreUpdate(addScore);
            break;
// Blue and red other buttons                
        case "blue warning":
            $(".markerWarning.blue").text($(".markerWarning.blue").text() + "⭕");
            break;
        case "red warning":
            $(".markerWarning.red").text($(".markerWarning.red").text() + "⭕");
            break;
        case "blue pin":
            victory("blue", "pin");
            break;
        case "red pin":
            victory("red", "pin");
            break;
        default:
            null;
            break;
    };

// Set game
    if (this.id==="setGame") {
        $("#playerInput").css("display", "flex")
    };

// Confirm game
    if (this.id==="setConfirmGame") {
        
        gameType = "";
        gameType = dropdownsCheckWhich()[0] + ", "+ dropdownsCheckWhich()[1] + ", " + $("select[name=weight]").val();
        $(".middle").css("backgroundColor", "black");

        if ( // check for empty fields
            $("#blueFirstName").val()==""
            || $("#blueLastName").val()==""
            || $("#redFirstName").val()==""
            || $("#redLastName").val()==""
            || $("select[name=weight]").val()==""
            // || radioCheck() === 0
        ) {
                window.alert("Fill in all the names and game type!");

        } else {
            // close input area
            $("#playerInput").css("display", "none")

            // restart phase at Period 1
            phasePos = 0;
            setPhase(phasePos);

            // game type
            if (dropdownsCheckWhich()[0]=="Junior Freestyle") {
                timerInit = 120;
            } else { // for Senior Freestyle and Senior Greco-Roman
                timerInit = 180;
            }
            
            $("#gameType").text(gameType);

            // timer setup
            $("#timer").html(Math.floor(timerInit/60).toString() + ":00");
            $("#startTimer").html("▶");
            $("#startTimer").prop("disabled", false);
            timerOn = false;
            now = timerInit;
            phasesTime = [timerInit, timeRest, timerInit];
            
            // set player names
            blueFirstName = $("#blueFirstName").val();
            blueLastName = $("#blueLastName").val();
            redFirstName = $("#redFirstName").val();
            redLastName = $("#redLastName").val();
            $(".blue.firstName").text(blueFirstName);
            $(".blue.lastName").text(blueLastName);
            $(".red.firstName").text(redFirstName);
            $(".red.lastName").text(redLastName);

            // set scores
            scoreBlue = 0;
            scoreRed = 0;
            $(".score.blue").text(scoreBlue);
            $(".score.red").text(scoreRed);
        }
    };

//Reset game
    if (this.id==="resetGame") {
        var confirm = window.confirm("Are you sure? This will reset all scores and reset the timer.");
        console.log(confirm);
        if (confirm) {
            $("#playerInput").css("display","none");
            scoreBlue = 0;
            $(".score.blue").text(scoreBlue);
            $(".blue.firstName").text("blueFirstName");
            $(".blue.lastName").text("blueLastName");
            scoreRed = 0;
            $(".score.red").text(scoreRed);
            $(".red.firstName").text("redFirstName");
            $(".red.lastName").text("redLastName");
            
            $("#timer").html("0:00");
            gameType = "";
        }
    };

// Start timer
    if (this.id === "startTimer"){
        startTimer(now);
    };

});

$(".close").click( function() {
        $(".popup").css("display", "none");
    }
)

function blueScoreUpdate(addScore) {
    if (addScore<0 && scoreBlue===0 || timerOn == false){}
    else {scoreBlue = scoreBlue + addScore};
    $(".score.blue").text(scoreBlue);

    // Freestyle tech sup
    if(scoreBlue-scoreRed>=10 && gameType.indexOf("Freestyle")>0 ){
        victory("blue", "technical superiority");
    } else 
    // Greo tech sup
    if (scoreBlue-scoreRed>=8 && gameType.indexOf("Greco")>0) {
        victory("blue", "technical superiority");
    }
}

function redScoreUpdate(addScore) {
    if (addScore<0 &&scoreRed===0 || timerOn == false){}
    else {scoreRed = scoreRed + addScore;}
    $(".score.red").text(scoreRed);

    // Freestyle tech sup
    if(scoreRed-scoreBlue>=10 && gameType.indexOf("Freestyle")>0){
        victory("red", "technical superiority")   ;
    } else 
    // Greo tech sup
    if (scoreRed-scoreBlue>=8 && gameType.indexOf("Greco")>0) {
        victory("red", "technical superiority");
    }
}

function dropdownsCheckWhich() {
    const ageDiv = $("select[name=age]").val();
    const styleDiv = $("select[name=style]").val();
    var gameType = "";
    if (styleDiv == "Greco-Roman") {
        gameType = "Senior Greco-Roman";
    } else if (ageDiv == "18-20 yrs" || ageDiv == "21yrs+") {
        gameType = "Senior Freestyle";
    }  else {
        gameType = "Junior Freestyle";
    }
    const styleAndAge = [gameType, ageDiv];
    return styleAndAge
}

function setPhase(pos) {
    $("#period").html("Period " + phases[pos]);
}

function startTimer(now) {
    if (timerOn === false) { // to restart the time
        $("#startTimer").html("▐ ▌");
        timerOn = true;
        timer(now); // 2 minutes is 120 seconds = 120 000 milliseconds
        $(".middle").css("backgroundColor", "black");

    } else if (timerOn === true)  { // to pause the time
        $("#startTimer").html("▶");
        timerOn = false;
        timer(now);
        $(".middle").css("backgroundColor", "grey");
    };
}

function timer(time) {
    
    // fix up the variable scopes here

    var start = new Date().getTime();
    
    console.log("start: "+start);
    
    var interval = setInterval( function() {
        
        // timer on start
        if (timerOn === true) {
            now = Math.ceil(
                ( time*1000 - (new Date().getTime()-start) )/1000
            );
            var colonZero = ":";
            // timerInit = now;
            if ((now%60).toString().length === 1) { 
                colonZero = ":0";
            } else {
                colonZero = ":";
            }
            $("#timer").html(Math.floor(now/60).toString() + colonZero + (now%60).toString());
        };

        // timer on end
        if( now <= 0 && timerOn === true) {
            // move to the next phase
            phasePos++;
            if (phasePos<3) {
                // if it's still in the game, start the clock again
                setPhase(phasePos);
                timer(phasesTime[phasePos]);
                console.log(timerInit);
            } else {
                // it must be the end of the game, close things down
                $("#startTimer").prop("disabled", true);
                var winBlue = (scoreBlue - scoreRed)/Math.abs(scoreBlue - scoreRed)
                switch ( winBlue ){
                    case 1:
                        victory("blue", "points");        
                        break;
                    case -1:
                        victory("red", "points");        
                        break;
                    default:
// Draw outcome
                        victory("draw", "technical superiority");
                        console.log("Outcome is draw")      
                        break;
                }
                clearInterval(interval);
            }
        };

        // timer pause
        if( now <= 0 || timerOn === false) {
            console.log("Timer stopped at: "+now);
            clearInterval(interval);
            now = time;
        };

        console.log("now: "+Math.ceil(now));

    },1000);
    
};


function victory(side, method) {
    $(".popup").css("display", "flex");
    $(".popup").css("height", document.body.clientHeight);
    
    // pause time
    startTimer(now);
    
    // declare winner
    var winnerName = "";
    var popupText = "";
    var popupBg = "";
    if (side == "draw") {
        popupText = "Draw!";
        popupBg = "black";
    } else {
        side == "blue" ? winnerName = blueFirstName+" "+blueLastName : winnerName = redFirstName+" "+redLastName;
        popupText = winnerName +" wins by "+ method +"!";
        popupBg = side;
    }
    $(".popup-text").text(popupText);
    $(".popup-content").css("background", popupBg);
    
    // add the rows of table here. 

    var matchResults = $("table.results>tbody")
    console.log(matchResults)
    var newRow = 
        "<td>"+blueFirstName+" "+blueLastName+"</td>"
        +"<td>"+redFirstName+" "+redLastName+"</td>"
        +"<td>"+scoreBlue+"</td>"
        +"<td>"+scoreRed+"</td>"
        +"<td>"+winnerName+"</td>"
        +"<td>"+method+"</td>";

    matchResults.html(matchResults.html() + newRow);
    
};

