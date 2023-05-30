var minRange = "1";
var maxRange = "";
var targetNumber;
var remainingGuesses;
var previousDifference;
var selectedNumbers;
var timerInterval;

function handleKeyDown(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        checkGuess();
    }
}

function selectRange() {
    minRange = parseInt(document.getElementById("minRange").value);
    maxRange = parseInt(document.getElementById("maxRange").value);
    var difficulty = document.getElementById("difficulty").value;

    if (minRange >= maxRange) {
        document.getElementById("rangeMessage").textContent =
        "El rango mínimo debe ser menor que el rango máximo";
        document.getElementById("rangeMessage").style.color = "red";
        return;
    }

    if (difficulty === "extreme" && maxRange - minRange > 20) {
        document.getElementById("rangeMessage").textContent =
        "En dificultad extrema, solo puedes seleccionar un rango de 20 números o menos";
        document.getElementById("rangeMessage").style.color = "red";
        return;
    }

    targetNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    remainingGuesses = getRemainingAttempts(difficulty);
    previousDifference = Math.abs(targetNumber - ((maxRange - minRange) / 2) + minRange);
    selectedNumbers = [];

    document.getElementById("rangeButton").disabled = true;
    document.getElementById("minRange").disabled = true;
    document.getElementById("maxRange").disabled = true;
    document.getElementById("difficulty").disabled = true;
    document.getElementById("guess").disabled = false;
    document.getElementById("submit").disabled = false;

    document.getElementById("remainingAttempts").textContent = remainingGuesses;
    document.getElementById("rangeMessage").textContent = "";
    document.getElementById("selectedNumbers").textContent = "";
    document.getElementById("guess").focus();
    document.getElementById("timer-container").style.display = "block";
    document.getElementById("remainingAttempts").style.display = "block";
    document.getElementById("remainingText").style.display = "block";
    startTimer(30);
}

function getRemainingAttempts(difficulty) {
    if (difficulty === "easy") {
        return 10;
    } else if (difficulty === "medium") {
        return 7;
    } else if (difficulty === "hard") {
        return 5;
    } else if (difficulty === "extreme") {
        return 3;
    }
}

function checkGuess() {
    var userGuess = parseInt(document.getElementById("guess").value);
    if (isNaN(userGuess) || userGuess < minRange || userGuess > maxRange) {
        alert("Por favor ingrese un número válido dentro del rango seleccionado");
        return;
    }
    var feedback = document.getElementById("feedback");
    var attempts = document.getElementById("remainingAttempts");
    var hint = document.getElementById("hint");
    remainingGuesses--;
    attempts.textContent = remainingGuesses;
    if (userGuess === targetNumber) {
        feedback.textContent = "¡Felicidades! Adivinaste el número correcto: " + targetNumber;
        feedback.style.color = "green";
        disableInput();
    } else if (remainingGuesses === 0) {
        feedback.textContent = "GAME OVER!!! El número correcto era: " + targetNumber;
        feedback.style.color = "red";
        disableInput();
    } else {
        var difference = Math.abs(targetNumber - userGuess);
        if (userGuess < targetNumber) {
            hint.textContent = "Pista: El número es más alto";
            hint.style.color = "blue";
        } else {
            hint.textContent = "Pista: El número es más bajo";
            hint.style.color = "brown";
        }
        previousDifference = difference;
    }
    selectedNumbers.push(userGuess);
    updateSelectedNumbers();
    document.getElementById("guess").value = "";
    document.getElementById("guess").focus();
}

function disableInput() {
    document.getElementById("guess").disabled = true;
    document.getElementById("submit").disabled = true;
    clearInterval(timerInterval);
}

function updateSelectedNumbers() {
    var selectedNumbersDiv = document.getElementById("selectedNumbers");
    selectedNumbersDiv.textContent = "Números seleccionados: " + selectedNumbers.join(", ");
    selectedNumbersDiv.classList.add("fade-in");
}

function startTimer(duration) {
    var timerDisplay = document.getElementById("timer");
    var timer = duration;
    timerDisplay.textContent = timer;
    timerInterval = setInterval(function () {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
        clearInterval(timerInterval);
        disableInput();
        var messageContainer = document.createElement("p");
        messageContainer.textContent = "¡Se acabó el tiempo! ¡Eres muy lento! El número correcto era: " + targetNumber;
        messageContainer.style.color = "red";
        document.getElementById("timer-container").appendChild(messageContainer);
        } else if (timer <= 10) {
        timerDisplay.style.color = "red";
        }
    }, 1000);
}

function resetGame() {
    document.getElementById("rangeButton").disabled = false;
    document.getElementById("minRange").disabled = false;
    document.getElementById("maxRange").disabled = false;
    document.getElementById("guess").disabled = true;
    document.getElementById("submit").disabled = true;
    document.getElementById("difficulty").disabled = false;

    minRange = 1;
    maxRange = 100;
    targetNumber = null;
    remainingGuesses = null;
    previousDifference = null;
    selectedNumbers = [];

    document.getElementById("minRange").value = 1;
    document.getElementById("maxRange").value = 100;
    document.getElementById("guess").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("remainingAttempts").textContent = "";
    document.getElementById("hint").textContent = "";
    document.getElementById("selectedNumbers").textContent = "";
    document.getElementById("timer").textContent = "30";
    document.getElementById("timer").style.color = "";
    document.getElementById("timer-container").style.display = "none";
    document.getElementById("remainingAttempts").style.display = "none";
    document.getElementById("remainingText").style.display = "none";
    var messageContainer = document.querySelector("#timer-container p");
        if (messageContainer) {
            messageContainer.remove();
        }
    clearInterval(timerInterval);
}