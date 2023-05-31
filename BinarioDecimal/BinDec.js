function binaryToDecimal() {
    var binaryInput = document.getElementById('binaryInput').value;
    var decimalOutput = document.getElementById('decimalOutput');
    var errorOutput = document.getElementById('binaryError');

    // Check if the input is a valid binary number
    var isValidBinary = /^[01]+$/.test(binaryInput);

    if (isValidBinary) {
        // Convert binary to decimal
        var decimal = parseInt(binaryInput, 2);

        // Display the decimal output
        decimalOutput.textContent = decimal;
        errorOutput.textContent = '';
    } else {
        errorOutput.textContent = 'Número binario no válido. Ingrese un número que consista únicamente en 0 y 1.';
        decimalOutput.textContent = '';
    }
}

function decimalToBinary() {
    var decimalInput = document.getElementById('decimalInput').value;
    var binaryOutput = document.getElementById('binaryOutput');
    var errorOutput = document.getElementById('decimalError');

    // Check if the input is a valid decimal number
    var isValidDecimal = /^\d+$/.test(decimalInput);

    if (isValidDecimal) {
        // Convert decimal to binary
        var binary = (decimalInput >>> 0).toString(2);

        // Display the binary output
        binaryOutput.textContent = binary;
        errorOutput.textContent = '';
    } else {
        errorOutput.textContent = 'Número decimal no válido. Ingrese un número entero positivo.';
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
        modeButton.textContent = "Switch to Decimal to Binary";
    } else {
        binarySection.style.display = "none";
        decimalSection.style.display = "block";
        modeButton.textContent = "Switch to Binary to Decimal";
    }
}

function handleBinaryInputKeyPress(event) {
    if (event.keyCode === 13) {
        binaryToDecimal();
    }
}

function handleDecimalInputKeyPress(event) {
    if (event.keyCode === 13) {
        decimalToBinary();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var binaryInput = document.getElementById('binaryInput');
    var decimalInput = document.getElementById('decimalInput');

    binaryInput.addEventListener('keydown', handleBinaryInputKeyPress);
    decimalInput.addEventListener('keydown', handleDecimalInputKeyPress);
});