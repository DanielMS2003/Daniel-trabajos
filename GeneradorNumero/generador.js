function generateRandomNumber() {
    const minValue = parseInt(document.getElementById("minValue").value);
    const maxValue = parseInt(document.getElementById("maxValue").value);

    if (isNaN(minValue) || isNaN(maxValue) || minValue >= maxValue) {
        document.getElementById("result").innerHTML = "Error: Invalid input";
        return;
    }

    const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    document.getElementById("result").innerHTML = "Número aleatorio: " + randomNumber;
}