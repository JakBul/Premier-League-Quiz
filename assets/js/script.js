//ACCESS THE DOM
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Global variables - (MENTOR: Access HTML with the div, create function that incrementScore if answer is correct (userScore) )
let questionCount = 0;
let questionNumb  = 1;
let userScore = 0;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS FOR BUTTONS

//Open popup window when clicking on button Start Quiz on homepage
function startQuiz() {
    popupInfo.classList.add('active');
    main.classList.add('blur');
};

startBtn.addEventListener('click', startQuiz);

//Close popup window when clicking on button Exit in popup window
function exitQuiz() {
    popupInfo.classList.remove('active');
    main.classList.remove('blur');
};

exitBtn.addEventListener('click', exitQuiz);

//Open the game window when clicking on button Play in popup window
function openGame() {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('blur');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
};

continueBtn.addEventListener('click', openGame);

//Start a new game after clicking on button Try Again in result box
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
};

tryAgainBtn.addEventListener('click', tryAgain);


//Send back to homepage when clicking on button Home in result box
function goHome() {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    //Reset stats after going back Home, player might play another Game
    questionCount = 0;
    questionNumb  = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
};

goHomeBtn.addEventListener('click', goHome);

//When user clicks on button Next in quiz box(next question), we want to increase number of completed questions by 1 and show another question from questions.js (with right index!!)
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
};

nextBtn.addEventListener('click', nextQuestion);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GAMEPLAY FUNCTIONS

//Get quiz questions and options from array in questions.js
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${QUESTIONS[index].numb}. ${QUESTIONS[index].question}`;

    // MENTOR: (each option own ID, access them by ID and set value to ${QUESTIONS[index].options[0]}, easier for maintenance)
    /* let option1 = document.getElementById('option1');
    let option2 = document.getElementById('option2');
    let option3 = document.getElementById('option3');
    let option4 = document.getElementById('option4');
    
    option1.textContent = `${QUESTIONS[index].options[0]}`;
    option2.textContent = `${QUESTIONS[index].options[1]}`;
    option3.textContent = `${QUESTIONS[index].options[2]}`;
    option4.textContent = `${QUESTIONS[index].options[3]}`; */

    let optionTag = `<div class="option"><span>${QUESTIONS[index].options[0]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[1]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[2]}</span></div>
                    <div class="option"><span>${QUESTIONS[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    //Iterate through options and give them attribute optionSelected when chosen, we use it in the function below
    const option = document.querySelectorAll('.option');
    for (let i=0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}


//Check user's answer and compare with the correct one, also show the green/red color depending on answer
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = QUESTIONS[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        //The correct answer adds one point to overall score
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        //When user selects an incorrect answer, we will show him the correct one (auto select)
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

    //User can not move to next question when has not answered yet
    nextBtn.classList.add('active');
    
}


//Count how many questions user finished and show it in the quiz
function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${QUESTIONS.length} Questions`;
}

//Count how many questions are answered correctly and show it in the quiz
function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${QUESTIONS.length}`;
}

//Show results box, quizBox disappears after last question
function showResultBox () {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score is ${userScore} out of ${QUESTIONS.length}`;

    //Shows results dynamically with help of Interval
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');

    //ProgressStartValue can not be 0 because then player with 0 correct answers will see bug with circularProgress(not stoping to raise amount of %)
    let progressStartValue = -1;
    let progressEndValue = (userScore / QUESTIONS.length) * 100;
    let speed = 20;

    let progress = setInterval( () => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}% `;
        //(MENTOR: use CSS var targeting)
        circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1)0deg)`;

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOM LOADED

//Execute our JS code only when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", (event) => {
    console.log('Page is fully loaded');
});