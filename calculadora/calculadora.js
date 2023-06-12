var userInput = "";

function calculate() {
  var expression = document.getElementById("userInput").textContent;
  var result = eval(expression);
  document.getElementById("result").value = result;
}

function appendInput(value) {
  userInput += value;
  document.getElementById("userInput").textContent = userInput;
}

function cleanInputs() {
  userInput = "";
  document.getElementById("userInput").textContent = userInput;
  document.getElementById("result").value = "";
}

function deleteLastInput() {
  userInput = userInput.slice(0, -1);
  document.getElementById("userInput").textContent = userInput;
}

document.addEventListener("keydown", function(event) {
  var key = event.key;

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
});