let container = document.querySelector('.container');
let firstNum = document.querySelector('#firstNum');
let secondNum = document.querySelector('#secondNum');
let op = document.querySelector('#operator');
let userInput = document.querySelector('#userInput');
let popmsg = document.querySelector('.monitoring span');


let correctAnswer = 0;
let incorrectAnswer = 0;
let userAnswerContent = 0;
let first_num = 0;
let second_num = 0;
let operator = "";
let answer = 0;

let diffuculty = "easy";
let mediumRequireScore = 100;
let hardRequireScore = 200;
let userPoints = 0;
let timer = 0;
let timerInterval;

function sigleNum() {
    return Math.floor(Math.random() * 9) + 1;
}

function doubleNum() {
    return Math.floor(Math.random() * 90) + 10;
}

function evaluateLevel() {
    console.log("User Level: " + diffuculty);

    if (correctAnswer >= 1 && correctAnswer <= 5) {
        diffuculty = "medium";
    } else if (correctAnswer > 5) {
        diffuculty = "hard";
    }
}

function generateMathQuestion() {
    if (diffuculty == "easy") {
        first_num = sigleNum();
        second_num = sigleNum();
    } else if (diffuculty == "medium") {
        const probability = Math.random();

        if (probability < 0.5) {
            first_num = sigleNum();
            second_num = doubleNum();
        } else {
            first_num = doubleNum();
            second_num = sigleNum();
        }
    } else if (diffuculty == "hard") {
        first_num = doubleNum();
        second_num = doubleNum();
    }
}

function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
    }, 1000);
}

function userPointsCalculation(time) {
    if (time <= 1) return 20;
    if (time == 2) return 18;
    if (time == 3) return 16;
    if (time == 4) return 14;
    if (time == 5) return 12;
    if (time == 6) return 10;
    if (time == 7) return 8;
    if (time >= 8 && time <= 10) return 6;
    return Math.max(0, 20 - time * 2);
}

function stopTimer() {
    clearInterval(timerInterval); 
}

function checkAnswer(userAnswer) {
    let score = document.getElementById("score");
    if (userAnswer === answer) {
        correctAnswer++;
        stopTimer(); 
        userPoints += userPointsCalculation(timer);
        score.textContent = `${userPoints} points`;
        showmsg(true);  // showmsg will call nextQeustion after 1 second
    } else {
        incorrectAnswer++;
        userInput.textContent = "0";
        userInput.style.opacity = "0";
        showmsg(false);
    }
}

function showmsg(message) {
    popmsg.textContent = message ? "Your answer is correct!" : "Your answer is incorrect";
    popmsg.style.color = message ? "green" : "red";
    popmsg.style.opacity = "1";

    setTimeout(() => {
        popmsg.style.opacity = "0";
        message ? nextQeustion() : null;
    }, 1000);
}

function nextQeustion() {
    userInput.textContent = "0";
    userAnswerContent = 0;
    userInput.style.opacity = "0";

    generateMathQuestion();
    evaluateLevel();

    if (sessionStorage.getItem('gameOperation')) {
        let operation = sessionStorage.getItem('gameOperation');
        switch (operation) {
            case 'add':
                operator = '&plus;';
                answer = first_num + second_num;
                break;
            case 'minus':
                operator = '&minus;';
                answer = first_num - second_num;
                break;
            case 'multiply':
                operator = '&times;';
                answer = first_num * second_num;
                break;
            case 'divide':
                operator = '&divide;';
                answer = Math.round(first_num / second_num);
                break;
            default:
                console.log(`Invalid operation: ${operation}`);
                break;
        }

        startTimer();
    } else {
        console.log("Error: gameOperation not found in sessionStorage")
    }

    firstNum.textContent = first_num;
    op.innerHTML = operator;
    secondNum.textContent = second_num;

    console.log(`Question: ${first_num} ${getOperatorSymbol(operator)} ${second_num} = ${answer}`);
}

function getOperatorSymbol(htmlOperator) {
    switch(htmlOperator) {
        case '&plus;': return '+';
        case '&minus;': return '-';
        case '&times;': return '*';
        case '&divide;': return '/';
        default: return htmlOperator;
    }
}

function setPoints(time) {
    let score = document.getElementById("score");
    let calculatedScore = (correctAnswer * 10) - time;
    score.textContent = calculatedScore;
}

document.addEventListener('keyup', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '-') {
        userInput.style.opacity = "1";

        if (e.key === '-' && userInput.textContent === "0") {
            userInput.textContent = '-';
        } else if (e.key !== '-') {
            userAnswerContent = parseInt(userInput.textContent + e.key);
            userInput.textContent = userAnswerContent;
        }

        if (userAnswerContent.toString().length >= answer.toString().length) {
            checkAnswer(userAnswerContent);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer(userAnswerContent);
    }

    if (e.key === "Backspace") {
        userAnswerContent = parseInt(userAnswerContent.toString().slice(0, -1))
        if (isNaN(userAnswerContent)) {
            userAnswerContent = "0";
            userInput.style.opacity = "0";
        }
        userInput.textContent = userAnswerContent;
    }
})

nextQeustion();