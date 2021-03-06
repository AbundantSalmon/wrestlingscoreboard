/*
Victory methods: 
technical superiority
points
disqualification
fall
*/


var classification = "";

function victory(side, method) {
    $(".popup").css("display", "flex");
    $(".popup").css("height", document.body.clientHeight);
    
    // pause time
    startTimer(now);
    
    // decide classification points
    switch (method) {
        case "fall":
            classification = "VFA 5:0";
            break;
        case "technical superiority":
            if (scoreRed == 0 || scoreBlue == 0) {
                classification = "VSU 4:0";
            } else {
                classification = "VSU1 4:1";
            }
            break;
        case "points":
            if (scoreRed == 0 || scoreBlue == 0) {
                classification = "VPO 3:0";
            } else {
                classification = "VPO1 3:1";
            }
            break;
        default:
            break;
    }

    // declare winner
    var winnerName = "";
    var popupText = "";
    var popupBg = "";
    if (side == "draw") {
        popupText = "Draw!";
        popupBg = "black";
    } else {
        switch (side) {
            case "blue":
                winnerName = `${blueFirstName} ${blueLastName}`;
                break;
            case "red":
                winnerName = `${redFirstName} ${redLastName}`;
                break;
        }
        popupText = `${winnerName} wins by ${method}!`;
        popupBg = side;
    }
    $(".popup-text").text(popupText);
    $(".popup-content").css("background", popupBg);
    
    // add the rows of table here. 

    var matchResults = $("table.results>tbody")
    console.log(matchResults)
    var newRow = `<td>${blueFirstName} ${blueLastName}</td><td>${redFirstName} ${redLastName}</td><td>${scoreBlue}</td><td>${scoreRed}</td><td>${winnerName}</td><td>${method}</td><td>${classification}</td>`;
    matchResults.html(matchResults.html() + newRow);
    
};


/*
5 points for the winner and 0 for the loser:
    [x] - Victory by fall (with or without technical point for the loser) (VFA 5:0)
    [ ] - Injury (VIN 5:0)
        o If an athlete is injured before or during a bout and the injury is certified by the UWW Doctor
    [ ] - 3 cautions during the bout (VCA 5:0)
    [ ] - Leg fouls (GR) (VCA 5:0) – refer to article 52
    [ ] - Forfeit (VFO 5:0) – refer to article 15
        o If an athlete doesn’t show up on the mat
        o If an athlete doesn’t attend or fail the weigh-in
    [ ] - Disqualification (DSQ 5:0) – refer to article 15
        o If an athlete is disqualified before or during the bout in case of unfair behavior

4 points for the winner and 0 for the loser (VSU 4:0):
    [x] - Victory by technical superiority (8 points difference in Greco-Roman style and 10 points in Freestyle during the bout), with the loser scoring no technical points

4 points for the winner and 1 point for the loser (VSU1 4:1):
    [x] - Victory by technical superiority during the bout with loser scoring technical points.

3 points for the winner and 0 for the loser (VPO 3:0):
    [x] - When the wrestler wins at the end of the two periods by 1 to 7 points in Greco Roman style and 1 to 9 points in Freestyle with the loser scoring no point.

3 points for the winner and 1 point for the loser (VPO1 3:1):
    [x] - When the bout ends by a victory by points at the end of the regular time and the loser scoring one or several technical points.

0 point for the red wrestler and 0 point for the blue wrestler:
    [ ] - In case both wrestlers have been disqualified due to infraction to the rules (2DSQ 0:0).
    [ ] - In case both wrestlers are injured (2VIN 0:0).
    [ ] - In case both wrestlers have been eliminated due to forfeits (2VFO 0:0)


*/