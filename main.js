let currentQuestionIndex = 0;
let points = 0;
const rootDiv = document.getElementById('root');

let time;
let timeRemaining = 10;

function startQuiz() {
	fetchQuizData();
}

function fetchQuizData() {
    fetch('quiz.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Något blev fel med nätverksresponsen');
            }
            return response.json();
        })
        .then(data => {
            quizData = data;
            displayQuestion();
        })
        .catch(error => {
            console.error('Något har blivit fel med fetchen', error);
        });
}


function displayQuestion() {
		rootDiv.innerHTML = '';

		const item = quizData[currentQuestionIndex];

		const questionElement = document.createElement('h3');
		questionElement.textContent = item.question;
		
		const optionsList = document.createElement('ul');
		
		item.options.forEach((option, index) => {
			const optionItem = document.createElement('li');
            optionItem.textContent = option;
            optionItem.classList.add('option');

			optionItem.addEventListener('click', () => handleOptionClick(option));

			optionsList.appendChild(optionItem);
		});

		rootDiv.appendChild(questionElement);
		rootDiv.appendChild(optionsList);

		const timerElement = document.createElement('p');
		timerElement.id = 'timer';
		timerElement.textContent = `Tid kvar: ${timeRemaining} sekunder`;
		rootDiv.appendChild(timerElement);

		time = setInterval(() => {
			timeRemaining--;
			timerElement.textContent = `Tid kvar: ${timeRemaining} sekunder`;
	
			if (timeRemaining === 0) {
				clearInterval(time);
				handleOptionClick(quizData[currentQuestionIndex].options[0]);
			}
		}, 1000);
}

function handleOptionClick(selectedOption) {
    console.log('Clearing interval');
    clearInterval(time);

    if (timeRemaining === 0) {
        alert("Tiden är ute!");
    } else {
        const correctAnswer = quizData[currentQuestionIndex].answer;

        if (selectedOption === correctAnswer) {
            alert("Rätt svar!");
            points += 1;
        } else {
            alert("Fel svar. Rätt svar är: " + correctAnswer);
        }
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        timeRemaining = 10;
        displayQuestion();
    } else {
        rootDiv.innerHTML = `
            <h3>Quizet är över!</h3>
            <br><h3>Du fick ${points} poäng.</h3>
            <button id="restart-button">Starta om quiz</button>
        `;
		const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', () => {
            points = 0;
            currentQuestionIndex = 0;
            timeRemaining = 10;
            displayQuestion();
        });
	}
}

startQuiz();