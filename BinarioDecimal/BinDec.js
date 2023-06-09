function binaryToDecimal() {
    var binaryInput = document.getElementById('binaryInput').value;
    var decimalOutput = document.getElementById('decimalOutput');
    var errorOutput = document.getElementById('binaryError');

    var isValidBinary = /^[01]+$/.test(binaryInput);

    if (isValidBinary) {
        var decimal = parseInt(binaryInput, 2);

        decimalOutput.textContent = decimal;
        errorOutput.textContent = '';
    } else {
        errorOutput.textContent = 'ERROR: Número binario no válido. Ingrese un número que consista únicamente en 0 y 1.';
        decimalOutput.textContent = '';
    }
}

function decimalToBinary() {
    var decimalInput = document.getElementById('decimalInput').value;
    var binaryOutput = document.getElementById('binaryOutput');

    var isValidDecimal = /^\d+$/.test(decimalInput);

    if (isValidDecimal) {
        var binary = (decimalInput >>> 0).toString(2);

        binaryOutput.textContent = binary;
    } else {
        binaryOutput.textContent = '';
    }
}

function switchMode() {
    var binarySection = document.getElementById('binarySection');
    var decimalSection = document.getElementById('decimalSection');
    var modeButton = document.getElementById('modeButton');

    if (binarySection.style.display === "none") {
        binarySection.style.display = "block";
        decimalSection.style.display = "none";
        modeButton.textContent = "Cambiar modo: decimal a binario";
    } else {
        binarySection.style.display = "none";
        decimalSection.style.display = "block";
        modeButton.textContent = "Cambiar modo: binario a decimal";
    }
}

function handleBinaryInputKeyPress(event) {
    if (event.key === 'Enter') {
      binaryToDecimal();
    }
}
  
function handleDecimalInputKeyPress(event) {
    if (event.key === 'Enter') {
      decimalToBinary();
    }
}  

document.addEventListener("DOMContentLoaded", function() {
    var binaryInput = document.getElementById('binaryInput');
    var decimalInput = document.getElementById('decimalInput');

    binaryInput.addEventListener('keydown', handleBinaryInputKeyPress);
    decimalInput.addEventListener('keydown', handleDecimalInputKeyPress);
});