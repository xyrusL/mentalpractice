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

function sigleNum() {
    return Math.floor(Math.random() * 9) + 1;
}

function doubleNum() {
    return Math.floor(Math.random() * 90) + 10;
}

function evaluateLevel() {
    console.log("User Level: " + diffuculty);

    if (correctAnswer >= 3 && correctAnswer <= 5) {
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

function checkAnswer(userAnswer) {
    if (userAnswer === answer) {
        correctAnswer++;
        showmsg("correct");
    } else {
        incorrectAnswer++;
        userInput.textContent = "0";
        userInput.style.opacity = "0";

        showmsg("incorrect");
    }
}

function showmsg(message) {
    popmsg.textContent = message == "correct" ? "Your answer is correct!" : "Your answer is incorrect.";
    popmsg.style.color = message == "correct" ? "green" : "red";
    popmsg.style.opacity = "1";

    setTimeout(() => {
        popmsg.style.opacity = "0";
        message == "correct" ? nextQeustion() : null;
    }, 500);
}

function nextQeustion() {
    userInput.textContent = "0"
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

document.addEventListener('keyup', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '-') {
        userInput.style.opacity = "1";

        if (e.key === '-' && userInput.textContent === "0") {
            userInput.textContent = '-';
        } else if (e.key !== '-') {
            userAnswerContent = parseInt(userInput.textContent + e.key);
            userInput.textContent = userAnswerContent;
        }

        if (userAnswerContent === answer) {
            correctAnswer++;
            showmsg("correct");
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