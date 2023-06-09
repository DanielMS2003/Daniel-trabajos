function generateRandomNumber() {
    var minValue = parseInt(document.getElementById("minValue").value);
    var maxValue = parseInt(document.getElementById("maxValue").value);

    var randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

    document.getElementById("result").innerHTML = "Número aleatorio: " + randomNumber;
}