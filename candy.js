const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const board = [];
const rows = 9;
const colums = 9;
let score = 0;
let turns = 0; // Variable to keep track of the number of turns

let currTile;
let otherTile;

let questionsAsked = [false,false,false,false,false,false]
let pointsNeeded = [100,200,250,300,350,400]

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
        askQuestion();
        updateTasks();
    },100);
}

function updateTasks() {
    const tasks = document.getElementById("tasks");
    tasks.innerHTML = ""; // Clear the existing content

    // Loop through the pointsNeeded array and create <p> elements for each task
    for (let i = 0; i < pointsNeeded.length; i++) {
        const task = document.createElement("p");
        task.textContent = "Question " + (i + 1) + " : " + pointsNeeded[i] + " points";
        tasks.appendChild(task);
    }
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < colums; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png"; //Change Extension

            //DRAG FUNCTION
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            document.getElementById("board").append(tile);

            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
    
}

function dragDrop() {
    otherTile = this;
}


function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveleft = c2 == c-1 && r2 == r;
    let moveright = c2 == c+1 && r2 == r;

    let moveup = r2 == r-1 && c == c2;
    let movedown = r2 == r+1 && c == c2;

    let isAdjacent = moveleft || moveright || moveup || movedown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        let validMove = checkValid();

        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        } else {
            turns++;
            console.log("Turn:", turns);
        }
    }
}

function crushCandy() {
    crushFive();
    crushFour();
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushFive() {
    // Check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colums - 4; c++) {
            let candies = board[r].slice(c, c + 5); // Get five candies in a row
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 150;}
                
            }
        }
    }

    // Check columns
    for (let c = 0; c < colums; c++) {
        for (let r = 0; r < rows - 4; r++) {
            let candies = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c], board[r + 4][c]]; // Get five candies in a column
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 150;}
            }
        }
    }
}

function crushFour() {
    // Check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colums - 3; c++) {
            let candies = board[r].slice(c, c + 4); // Get four candies in a row
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 75;}
            }
        }
    }

    // Check columns
    for (let c = 0; c < colums; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candies = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]]; // Get four candies in a column
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 75;}
            }
        }
    }
}


function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c<colums-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                if (turns > 0) {score += 30;}
            }
        }
    }
    //check columns
    for (let c = 0; c< colums; c++) {
        for (let r = 0; r<rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                if (turns > 0) {score += 30;}
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c<colums-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    //check columns
    for (let c = 0; c< colums; c++) {
        for (let r = 0; r<rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function slideCandy() {
    for (let c = 0; c < colums; c++) {
        let ind = rows-1;
        for (let r = rows-1; r>=0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for(let r = ind; r>=0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for(let c = 0; c < colums; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function askQuestion() {
    for (let i = 0; i < pointsNeeded.length; i++) {
        if (score >= pointsNeeded[i] && !questionsAsked[i]) {
            console.log("Question", i + 1);
            questionsAsked[i] = true; // Mark question as asked
        }
    }
}