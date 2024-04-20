const candies = ["toriGate", "cat", "sushi", "dog", "fan", "cherry"];
const board = [];
const rows = 9;
const columns = 9;
let score = 0;
let turns = 0; // Variable to keep track of the number of turns

let scoreQuestions = 0;

let currTile;
let otherTile;

let questionsAsked = [false,false,false,false,false,false,false,false,false];
let pointsNeeded = [100,350,700,1500,1800,2100,2400,2700,3000];

questions = [
    "What type of games do you enjoy the most?",
    "How important are graphics and visuals in a game to you?",
    "What platform do you primarily game on?",
    "How many hours per week do you typically spend gaming?",
    "When do you usually play games?",
    "Do you prefer single-player or multiplayer games?",
    "How do you feel about in-game purchases?",
    "How do you react to losing in a game?",
    "How important is the storyline and narrative in a game to you?"
];
choices = [
    ["A. Action/Adventure", "B. Role-playing", "C. Strategy", "D. Simulation", "E. Puzzle", "F. Sports/Racing", "G. Other"],
    ["A. Extremely important", "B. Important, but not a deal-breaker", "C. Neutral", "D. Not very important", "E. I don't care about graphics at all"],
    ["A. PC", "B. Console (PlayStation, Xbox, Nintendo Switch, etc.)", "C. Mobile", "D. I play on multiple platforms equally", "E. Other"],
    ["A. Less than 5 hours", "B. 5-10 hours", "C. 10-20 hours", "D. 20-30 hours", "E. More than 30 hours"],
    ["A. Mornings", "B. Afternoons", "C. Evenings", "D. Late nights", "E. Whenever I have free time, regardless of the time of day"],
    ["A. Single-player", "B. Multiplayer", "C. I enjoy both equally"],
    ["A. I'm fine with them if they're purely cosmetic and don't affect gameplay.", "B. I don't mind them as long as they enhance the gaming experience.", "C. I dislike them but tolerate them if the base game is good.", "D. I strongly dislike them and prefer games without any form of in-game purchases."],
    ["A. I get frustrated easily and may rage quit.", "B. I feel disappointed but try again.", "C. Losing doesn't bother me much; it's part of the gaming experience.", "D. I rarely lose, but when I do, I take it as a challenge to improve."],
    ["A. Extremely important; I prefer games with rich, immersive stories.", "B. Important, but gameplay matters more to me.", "C. Neutral; I enjoy games with and without strong narratives.", "D. Not very important; I care more about gameplay mechanics."]
];

window.onload = function() {
    if (score == 0) {
    const modal = document.getElementById("myModal2");
    const startButton = document.getElementById("start-button");

    modal.style.display = "block"; // Show the modal when the page loads

    startButton.addEventListener("click", function() {
        modal.style.display = "none"; // Close the modal when the start button is clicked
    });

    }

    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
        askQuestion();
        updateTasks();
    },100);
};

function updateTasks() {
    const tasks = document.getElementById("tasks");
    tasks.innerHTML = ""; // Clear the existing content
    
    // Add header "Points Needed"
    const header = document.createElement("h3");
    header.textContent = "Points Needed:";
    tasks.appendChild(header);
    
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
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

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
        for (let c = 0; c < columns - 4; c++) {
            let candies = board[r].slice(c, c + 5); // Get five candies in a row
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 150;}
                
            }
        }
    }

    // Check columns
    for (let c = 0; c < columns; c++) {
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
        for (let c = 0; c < columns - 3; c++) {
            let candies = board[r].slice(c, c + 4); // Get four candies in a row
            let allSame = candies.every(candy => candy.src === candies[0].src); // Check if all candies are the same
            if (allSame && !candies[0].src.includes("blank")) {
                candies.forEach(candy => candy.src = "./images/blank.png");
                if (turns > 0) {score += 75;}
            }
        }
    }

    // Check columns
    for (let c = 0; c < columns; c++) {
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
        for (let c = 0; c < columns - 2; c++) {
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
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
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
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
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
    for (let c = 0; c < columns; c++) {
        let ind = rows-1;
        for (let r = rows-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for(let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for(let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

// Update askQuestion function to display popup when score is reached
let questionDisplayed = false;

function askQuestion() {

    for (let i = 0; i < pointsNeeded.length; i++) {
        if (score >= pointsNeeded[i] && !questionsAsked[i]) {
            questionsAsked[i] = true;

            // Display popup with question and choices
            displayQuestionPopup(i);

            // Exit the function after displaying the first question popup
            return;
        }
    }

}


function displayScoreQuestions() {
    // Get modal element
    let modal = document.getElementById("myModal");

    // Set question text in modal
    document.getElementById("question-text").innerText = "Score Questions: " + scoreQuestions;

    // Clear previous choices
    let choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    // Display modal
    modal.style.display = "block";
}


function handleChoice(questionIndex, choiceIndex) {
    // Handle user choice here
    // For example, update score or perform other actions based on choice
    // You can add your logic here based on the question and choice index
    console.log("Question Index:", questionIndex);
    console.log("Choice Index:", choiceIndex);

    // Reset questionDisplayed to false after handling the choice
    questionDisplayed = false;

    askQuestion(); // Ask the next question if the score condition is met

    // Assign points based on the choice and question
    switch (choiceIndex) {
        case 0: // A
            scoreQuestions += 3;
            break;
        case 1: // B
            scoreQuestions += 2;
            break;
        case 2: // C
            scoreQuestions += 1;
            break;
        default: // D and E
            // No points assigned for D and E choices
            break;
    }
    console.log("Score Questions:", scoreQuestions);

    if(questionIndex == questions.length - 1) {
        displayScoreQuestions();
    }

    // Close the modal after answering
    else {document.getElementById("myModal").style.display = "none";}
}


function displayQuestionPopup(questionIndex) {
    // Get modal element
    let modal = document.getElementById("myModal");

    // Get question text and choices
    let questionText = questions[questionIndex];
    let questionChoices = choices[questionIndex];

    // Set question text in modal
    document.getElementById("question-text").innerText = questionText;

    // Clear previous choices
    let choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    // Add choices to modal
    questionChoices.forEach(function(choiceText, index) {
        let choiceId = "choice-" + index;
        let choiceElement = document.createElement("button");
        choiceElement.innerText = choiceText;
        choiceElement.setAttribute("id", choiceId);
        choiceElement.addEventListener("click", function() {
            // Handle user choice
            handleChoice(questionIndex, index);
        });
        choicesContainer.appendChild(choiceElement);
    });

    // Display modal
    modal.style.display = "block";
}
function displayScoreQuestions() {
    // Get modal element
    let modal = document.getElementById("myModal");

    // Make output
    let output = "";
    if (scoreQuestions >= 0 && scoreQuestions <= 9) {
        output = "<h2>You got a score of " + scoreQuestions + ".</h2><h3>You are the Relaxed Observer.</h3><p>You wake up to the gentle chirping of birds outside your window. You stretch lazily, taking in the soft morning light filtering through the curtains. Today, you have no grand plans or adventures. Instead, you embrace the simple pleasures of observing the world around you. You spend your day leisurely, enjoying the beauty of nature and finding peace in the present moment.</p>";
    } else if (scoreQuestions > 9 && scoreQuestions <= 14) {
        output = "<h2>You got a score of " + scoreQuestions + ".</h2><h3>You are the Laid-back Adventurer.</h3><p>As the sun rises, you eagerly prepare for another day of exploration and discovery. With a backpack slung over your shoulder and a map in hand, you set out to explore new trails and hidden corners of the world. Whether it's hiking through lush forests or diving into crystal-clear waters, you thrive on the thrill of adventure and the freedom of the open road.</p>";
    } else if (scoreQuestions > 14 && scoreQuestions <= 19) {
        output = "<h2>You got a score of " + scoreQuestions + ".</h2><h3>You are the Casual Gamer.</h3><p>With a comfortable controller in hand, you sink into your favorite gaming chair, ready to embark on virtual adventures. Whether you're building cities, solving puzzles, or battling enemies, gaming is your ultimate escape from reality. You enjoy the challenge of each level and the satisfaction of completing quests, all while immersing yourself in captivating virtual worlds.</p>";
    } else if (scoreQuestions > 19 && scoreQuestions <= 24) {
        output = "<h2>You got a score of " + scoreQuestions + ".</h2><h3>You are the Competitive Challenger.</h3><p>From the moment you wake up, you're fueled by a fierce determination to conquer any challenge that comes your way. Whether it's in the boardroom, on the sports field, or in the gaming arena, you thrive on competition. You push yourself to the limit, constantly striving to be the best and achieve victory, no matter the obstacles in your path.</p>";
    } else if (scoreQuestions > 24 && scoreQuestions <= 30) {
        output = "<h2>You got a score of " + scoreQuestions + ".</h2><h3>You are the Enthusiastic Explorer.</h3><p>With boundless energy and an insatiable curiosity, you eagerly set out to explore the world around you. From bustling cities to remote wilderness, every corner of the globe is an opportunity for adventure. You immerse yourself in new cultures, try exotic foods, and make unforgettable memories with each new experience. For you, life is an endless journey of discovery and wonder.</p>";
    }

    // Set output to question-text
    document.getElementById("question-text").innerHTML = output;

    // Clear previous choices
    let choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    // Add social media share buttons
    let shareButtons = document.createElement("div");
    shareButtons.innerHTML = `
        <button onclick="shareOnFacebook()">Share on Facebook</button>
        <button onclick="shareOnTwitter()">Share on Twitter</button>
        <button onclick="shareOnLinkedIn()">Share on LinkedIn</button>
    `;
    choicesContainer.appendChild(shareButtons);

    // Add close button
    let closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.onclick = function() {
        modal.style.display = "none";
    };
    choicesContainer.appendChild(closeButton);

    // Display modal
    modal.style.display = "block";
}



function getPersonality() {
    if (scoreQuestions >= 0 && scoreQuestions <= 9) {
        return "Relaxed Observer";
    } else if (scoreQuestions > 9 && scoreQuestions <= 14) {
        return "Laid-back Adventurer";
    } else if (scoreQuestions > 14 && scoreQuestions <= 19) {
        return "Casual Gamer";
    } else if (scoreQuestions > 19 && scoreQuestions <= 24) {
        return "Competitive Challenger";
    } else if (scoreQuestions > 24 && scoreQuestions <= 30) {
        return "Enthusiastic Explorer";
    }
}

function shareOnFacebook() {
    let text = "My personality is " + getPersonality() + "!";
    // Get the current page URL
    let url = 'https://codedex-challenge-april.vercel.app/';
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(text), '_blank');
}

function shareOnTwitter() {
    let text = "My personality is " + getPersonality() + "!";
    // Get the current page URL
    let url = 'https://codedex-challenge-april.vercel.app/';
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + url, '_blank');
}

function shareOnLinkedIn() {
    let text = "My personality is " + getPersonality() + "!";
    // Get the current page URL
    let url = 'https://codedex-challenge-april.vercel.app/';
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) + '&summary=' + encodeURIComponent(text), '_blank');
}

function updatePBar(progressBar, value) {
    value = Math.round(value);
    progressBar.querySelector(".progress_fill").style.width = `${value}%`;
    progressBar.querySelector(".progress_text").textContent = `${value}%`;
}