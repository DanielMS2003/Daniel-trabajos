var userInput = "";
var cursorPosition = 0;

function calculate() {
  var expression = document.getElementById("userInput").textContent;
  var result;

  try {
    expression = expression.replace(/[^-()\d/*+.]/g, '');
    result = eval(expression);
    document.getElementById("result").value = result;
  } catch (error) {
    document.getElementById("result").value = "ಠ_ಠ";
    console.error(error);
  }
}

function appendInput(value) {
  userInput = userInput.slice(0, cursorPosition) + value + userInput.slice(cursorPosition);
  cursorPosition++;
  updateDisplay();
}

function cleanInputs() {
  userInput = "";
  cursorPosition = 0;
  updateDisplay();
  document.getElementById("result").value = "";
}

function deleteLastInput() {
  if (cursorPosition > 0) {
    userInput = userInput.slice(0, cursorPosition - 1) + userInput.slice(cursorPosition);
    cursorPosition--;
    updateDisplay();
  }
}

function moveCursorLeft() {
  if (cursorPosition > 0) {
    cursorPosition--;
    updateDisplay();
  }
}

function moveCursorRight() {
  if (cursorPosition < userInput.length) {
    cursorPosition++;
    updateDisplay();
  }
}

function updateDisplay() {
  var userInputDisplay = userInput.slice(0, cursorPosition) + "|" + userInput.slice(cursorPosition);
  document.getElementById("userInput").textContent = userInputDisplay;

  var userInputContainer = document.getElementById("userInput");
  userInputContainer.scrollLeft = userInputContainer.scrollWidth;
}

document.addEventListener("keydown", function(event) {
  var key = event.key;
  event.preventDefault();
  
  if (!isNaN(key) || key === "+" || key === "-" || key === "*" || key === "/") {
    appendInput(key);
  }

  if (key === "Enter") {
    calculate();
  }

  if (key === "Backspace") {
    deleteLastInput();
  }

  if (key === "Delete") {
    cleanInputs();
  }

  if (key === "(" || key === "[") {
    appendInput("(");
  }

  if (key === ")" || key === "]") {
    appendInput(")");
  }

  if (key === ".") {
    appendInput(".");
  }

  if (key === ",") {
    appendInput(",");
  }

  if (key === "ArrowLeft") {
    moveCursorLeft();
  }

  if (key === "ArrowRight") {
    moveCursorRight();
  }
});