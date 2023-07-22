/* jshint esversion: 6 */

/** ACCESS THE DOM
 * We are working with these variables throughout the project
 */

let startBtn = document.querySelector('.start-btn');
let popupInfo = document.querySelector('.popup-info');
let exitBtn = document.querySelector('.exit-btn');
let main = document.querySelector('.main');
let continueBtn = document.querySelector('.continue-btn');
let quizSection = document.querySelector('.quiz-section');
let quizBox = document.querySelector('.quiz-box');
let resultBox = document.querySelector('.result-box');
let tryAgainBtn = document.querySelector('.tryAgain-btn');
let goHomeBtn = document.querySelector('.goHome-btn');
let nextBtn = document.querySelector('.next-btn');
let optionList = document.querySelector('.option-list');


/** GLOBAL VARIABLES
 *  We are working with these variables throughout the project
 */

let questionCount = 0;
let questionNumb  = 1;
let userScore = 0;


/** FUNCTIONS FOR BUTTONS 
 * All event listeners for these buttons are on the end of this code, we firstly make sure that DOM is fully loaded
 * These functions react on the user interaction 
 */

//Open the Popup window when clicking on the button Start Quiz on the Main Page
function startQuiz() {
    popupInfo.classList.add('active');
    main.classList.add('blur');
}

//Close the Popup window when clicking on the button Exit in the Popup window
function exitQuiz() {
    popupInfo.classList.remove('active');
    main.classList.remove('blur');
}

//Open the game window when clicking on the button Play in the Popup window
function openGame() {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('blur');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
}

//Start a new game after clicking on the button Try Again in the Result box
function tryAgain() {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    questionCount = 0;
    questionNumb  = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();
}

//Send back to the Main Page when clicking on the button Home in the Result box
function goHome() {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    //Reset stats after going back to the Main Page, users might play another game
    questionCount = 0;
    questionNumb  = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
}

//When the user clicks on the button Next in the Quiz box, we want to increase the number of completed questions by 1 and show another question from questions.js (with right index!!)
function nextQuestion() {
    if (questionCount < QUESTIONS.length -1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);

        nextBtn.classList.remove('active');
    } else {
        showResultBox();
    }
}

/** GAMEPLAY FUNCTIONS
 *  These functions take care of the quiz flow
 */

//Get the quiz questions and options from array in questions.js
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${QUESTIONS[index].numb}. ${QUESTIONS[index].question}`;

    let optionTag = `<div class="option"><span>${QUESTIONS[index].options[0]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[1]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[2]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    //Iterate through the options and control what user chooses
    const option = document.querySelectorAll('.option');
    for (let i=0; i < option.length; i++) {
        option[i].addEventListener('click', optionSelected);
    }
}

//Check the users answer and compare it with the correct one, then show the green/red color depending on the answer
function optionSelected(event) {
    let answer = event.target;
    let userAnswer = answer.textContent;
    let correctAnswer = QUESTIONS[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        //The correct answer adds one point to the overall score
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        //When the user selects an incorrect answer, we will show him the correct one (auto select)
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent === correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }
    //When user selects one of the possible answers, we have to disable other options simultaneously to prevent multianswering
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }
    //User can not move to the next question when has not answered yet
    nextBtn.classList.add('active');
}

//Count on how many questions have the user already answered and show it in the quiz
function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${QUESTIONS.length} Questions`;
}

//Count how many questions have been answered correctly and show it in the quiz
function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${QUESTIONS.length}`;
}

//Show the Result box, the quizBox disappears after the last answered question
function showResultBox () {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score is ${userScore} out of ${QUESTIONS.length}`;

    //Shows the result dynamically with help of Interval
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');

    //ProgressStartValue can not be 0 because then player with 0 correct answers will see bug with circularProgress(not stoping to raise amount of %)
    let progressStartValue = -1;
    let progressEndValue = (userScore / QUESTIONS.length) * 100;
    let speed = 20;

    let progress = setInterval( () => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}% `;
        circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1)0deg)`;

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

/** DOM LOADED
 *  Important to execute our JS code only when the DOM is fully loaded
 */

window.addEventListener("DOMContentLoaded", (event) => {
    startBtn.addEventListener('click', startQuiz);
    exitBtn.addEventListener('click', exitQuiz);
    continueBtn.addEventListener('click', openGame);
    tryAgainBtn.addEventListener('click', tryAgain);
    goHomeBtn.addEventListener('click', goHome);
    nextBtn.addEventListener('click', nextQuestion);
});