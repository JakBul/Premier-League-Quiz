const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');

//Make the pop up window open after clicking on Start Quiz(make main window blur too) and close when clicking on Exit
startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
};

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
};

//Open the game window
continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
};

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    //Start a new game after clicking 'Try Again' in the result box
    questionCount = 0;
    questionNumb  = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();
};

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    //Reset stats after going back Home, play might play another Game
    questionCount = 0;
    questionNumb  = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
};


let questionCount = 0;
let questionNumb  = 1;
let userScore = 0;

const nextBtn = document.querySelector('.next-btn');

//When user clicks on button Next (next question), we want to increase number of completed questions by 1 and show another question from questions.js (with right index!!)
nextBtn.onclick = () => {
    if (questionCount < questions.length -1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);

        nextBtn.classList.remove('active');
    } else {
        showResultBox();
    }
};

const optionList = document.querySelector('.option-list');

//Get quiz questions and options from array in questions.js
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
                    <div class="option"><span>${questions[index].options[1]}</span></div>
                    <div class="option"><span>${questions[index].options[2]}</span></div>
                    <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    //Iterate through options and give them attribute optionSelected, which we use as a function below
    const option = document.querySelectorAll('.option');
    for (let i=0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}


//Check user's answer and compare with the correct one, also show the green/red color depending on answer
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        //The correct answer adds one point to overall score
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        //When user selects incorrect answer, we will show him the correct one (auto select)
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }

    //When user selects one of the possible answer, we have to disable other options simultaneously to prevent multianswering
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    //User can not move to next question when has not answered yet
    nextBtn.classList.add('active');
    
}


//Count how many questions user finished and show it in the quiz
function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

//Count how many questions are answered correctly and show it in the quiz
function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

//Show results box, quizBox disappears after last question
function showResultBox () {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score is ${userScore} out of ${questions.length}`;

    //Shows results dynamically with help of Interval
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');

    //ProgressStartValue can not be 0 because then player with 0 correct answers will see bug with circularProgress(not stoping to raise amount of %)
    let progressStartValue = -1;
    let progressEndValue = (userScore / questions.length) * 100;
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