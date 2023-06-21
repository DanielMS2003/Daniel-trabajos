document.addEventListener('DOMContentLoaded', () => {
  const convertBtn = document.getElementById('convertBtn');
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const amountInput = document.getElementById('amount');
  const resultElement = document.getElementById('result');

  const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'PHP', name: 'Philippine Peso' },
  ];

  currencies.forEach(currency => {
    addOption(fromCurrencySelect, currency);
    addOption(toCurrencySelect, currency);
  });

  fromCurrencySelect.value = 'USD';
  toCurrencySelect.value = 'EUR';

  convertBtn.addEventListener('click', handleConversion);

  function addOption(selectElement, currency) {
    const option = document.createElement('option');
    option.value = currency.code;
    option.text = `${currency.code} - ${currency.name}`;
    selectElement.appendChild(option);
  }

  function numberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  

  function handleConversion() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || !fromCurrency || !toCurrency) {
      resultElement.textContent = 'Please enter a valid amount and select currencies.';
      return;
    }
  
    const convertedAmount = convertCurrency(fromCurrency, toCurrency, amount);
    const formattedAmount = numberWithCommas(amount.toFixed(2));
    const formattedConvertedAmount = numberWithCommas(convertedAmount.toFixed(2));

    resultElement.textContent = `${formattedAmount} ${fromCurrency} = ${formattedConvertedAmount} ${toCurrency}`;
  }    

  function convertCurrency(fromCurrency, toCurrency, amount) {
    const conversionRate = getConversionRate(fromCurrency, toCurrency);
    const convertedAmount = amount * conversionRate;
    return convertedAmount;
  }

  function getConversionRate(fromCurrency, toCurrency) {
    const conversionRates = {
      USD: { EUR: 0.85, GBP: 0.72, JPY: 110.11, CNY: 6.43, RUB: 74.89, AUD: 1.33, CAD: 1.23, CHF: 0.91, INR: 74.39, BRL: 5.22, ZAR: 13.93, MXN: 20.04, SGD: 1.35, NZD: 1.43, SEK: 8.97, TRY: 8.73, NOK: 9.17, DKK: 6.37, PLN: 3.89, THB: 33.06, MYR: 4.18, PHP: 51.16 },
      EUR: { USD: 1.18, GBP: 0.85, JPY: 130.56, CNY: 7.64, RUB: 88.89, AUD: 1.58, CAD: 1.46, CHF: 1.09, INR: 89.57, BRL: 6.27, ZAR: 16.72, MXN: 24.04, SGD: 1.61, NZD: 1.70, SEK: 10.62, TRY: 10.34, NOK: 10.86, DKK: 7.54, PLN: 4.60, THB: 39.07, MYR: 4.95, PHP: 60.55 },
      GBP: { USD: 1.39, EUR: 1.17, JPY: 152.48, CNY: 8.93, RUB: 103.71, AUD: 1.83, CAD: 1.69, CHF: 1.26, INR: 103.44, BRL: 7.24, ZAR: 19.33, MXN: 27.75, SGD: 1.86, NZD: 1.97, SEK: 12.34, TRY: 12.02, NOK: 12.63, DKK: 8.77, PLN: 5.35, THB: 45.43, MYR: 5.76, PHP: 70.46 },
      JPY: { USD: 0.0091, EUR: 0.0076, GBP: 0.0066, CNY: 0.059, RUB: 0.69, AUD: 0.012, CAD: 0.011, CHF: 0.0083, INR: 0.68, BRL: 0.048, ZAR: 0.13, MXN: 0.19, SGD: 0.012, NZD: 0.013, SEK: 0.081, TRY: 0.079, NOK: 0.083, DKK: 0.058, PLN: 0.035, THB: 0.29, IDR: 125.39, MYR: 0.037, PHP: 0.45 },
      CNY: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 16.86, RUB: 11.63, AUD: 0.21, CAD: 0.19, CHF: 0.14, INR: 11.38, BRL: 0.79, ZAR: 2.11, MXN: 3.03, SGD: 0.20, NZD: 0.21, SEK: 1.32, TRY: 1.29, NOK: 1.36, DKK: 0.94, PLN: 0.57, THB: 4.84, MYR: 6.13, PHP: 74.92 },
      RUB: { USD: 0.013, EUR: 0.011, GBP: 0.0096, JPY: 1.45, CNY: 0.086, AUD: 0.018, CAD: 0.016, CHF: 0.012, INR: 0.97, BRL: 0.068, ZAR: 0.18, MXN: 0.25, SGD: 0.017, NZD: 0.018, SEK: 0.11, TRY: 0.11, NOK: 0.11, DKK: 0.077, PLN: 0.047, THB: 0.40, MYR: 0.51, PHP: 6.26 },
      AUD: { USD: 0.75, EUR: 0.63, GBP: 0.55, JPY: 84.76, CNY: 4.72, RUB: 56.10, CAD: 0.92, CHF: 0.69, INR: 56.93, BRL: 3.97, ZAR: 10.61, MXN: 15.21, SGD: 1.02, NZD: 1.08, SEK: 6.76, TRY: 6.60, NOK: 6.94, DKK: 4.82, PLN: 2.94, THB: 24.95, MYR: 31.68, PHP: 387.45 },
      CAD: { USD: 0.81, EUR: 0.69, GBP: 0.59, JPY: 90.41, CNY: 5.05, RUB: 59.95, AUD: 1.09, CHF: 0.75, INR: 61.65, BRL: 4.31, ZAR: 11.50, MXN: 16.51, SGD: 1.11, NZD: 1.18, SEK: 7.37, TRY: 7.18, NOK: 7.55, DKK: 5.24, PLN: 3.19, THB: 27.06, MYR: 34.34, PHP: 419.84 },
      CHF: { USD: 1.09, EUR: 0.92, GBP: 0.79, JPY: 120.91, CNY: 6.75, RUB: 80.10, AUD: 1.45, CAD: 1.34, INR: 82.38, BRL: 5.76, ZAR: 15.37, MXN: 22.03, SGD: 1.47, NZD: 1.55, SEK: 9.69, TRY: 9.46, NOK: 9.95, DKK: 6.92, PLN: 4.22, THB: 35.83, MYR: 45.42, PHP: 554.85 },
      INR: { USD: 0.013, EUR: 0.011, GBP: 0.0096, JPY: 1.46, CNY: 0.088, RUB: 1.03, AUD: 0.018, CAD: 0.016, CHF: 0.012, BRL: 0.070, ZAR: 0.19, MXN: 0.27, SGD: 0.018, NZD: 0.019, SEK: 0.12, TRY: 0.11, NOK: 0.12, DKK: 0.084, PLN: 0.051, THB: 0.44, MYR: 0.56, PHP: 6.84 },
      BRL: { USD: 0.19, EUR: 0.16, GBP: 0.14, JPY: 18.63, CNY: 1.04, RUB: 14.70, AUD: 0.25, CAD: 0.23, CHF: 0.17, INR: 14.28, ZAR: 2.68, MXN: 3.85, SGD: 0.26, NZD: 0.27, SEK: 1.69, TRY: 1.65, NOK: 1.74, DKK: 1.21, PLN: 0.73, THB: 6.20, MYR: 7.87, PHP: 96.04 },
      ZAR: { USD: 0.071, EUR: 0.060, GBP: 0.052, JPY: 6.54, CNY: 0.37, RUB: 4.52, AUD: 0.094, CAD: 0.087, CHF: 0.065, INR: 5.61, BRL: 0.37, MXN: 1.43, SGD: 0.097, NZD: 0.103, SEK: 0.64, TRY: 0.63, NOK: 0.66, DKK: 0.46, PLN: 0.28, THB: 2.40, MYR: 3.05, PHP: 37.27 },
      MXN: { USD: 0.050, EUR: 0.043, GBP: 0.037, JPY: 4.33, CNY: 0.24, RUB: 2.93, AUD: 0.066, CAD: 0.060, CHF: 0.045, INR: 3.87, BRL: 0.26, ZAR: 0.70, SGD: 0.046, NZD: 0.049, SEK: 0.31, TRY: 0.31, NOK: 0.33, DKK: 0.23, PLN: 0.14, THB: 1.19, MYR: 1.51, PHP: 18.41 },
      SGD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 82.83, CNY: 4.62, RUB: 55.00, AUD: 0.90, CAD: 0.83, CHF: 0.62, INR: 51.04, BRL: 3.56, ZAR: 9.47, MXN: 13.58, NZD: 1.05, SEK: 6.57, TRY: 6.42, NOK: 6.75, DKK: 4.69, PLN: 2.85, THB: 24.21, MYR: 30.73, PHP: 375.63 },
      NZD: { USD: 0.71, EUR: 0.60, GBP: 0.52, JPY: 79.80, CNY: 4.45, RUB: 52.92, AUD: 0.87, CAD: 0.81, CHF: 0.60, INR: 49.39, BRL: 3.44, ZAR: 9.18, MXN: 13.17, SGD: 0.88, SEK: 6.25, TRY: 6.11, NOK: 6.42, DKK: 4.46, PLN: 2.71, THB: 23.02, MYR: 29.20, PHP: 356.74 },
      SEK: { USD: 0.11, EUR: 0.093, GBP: 0.080, JPY: 12.44, CNY: 0.69, RUB: 8.19, AUD: 0.14, CAD: 0.13, CHF: 0.097, INR: 7.99, BRL: 0.55, ZAR: 1.46, MXN: 2.10, SGD: 0.14, NZD: 0.15, TRY: 0.98, NOK: 1.03, DKK: 0.72, PLN: 0.44, THB: 3.76, MYR: 4.78, PHP: 58.41 },
      TRY: { USD: 0.12, EUR: 0.10, GBP: 0.087, JPY: 13.18, CNY: 0.74, RUB: 8.79, AUD: 0.15, CAD: 0.14, CHF: 0.10, INR: 8.10, BRL: 0.57, ZAR: 1.53, MXN: 2.20, SGD: 0.15, NZD: 0.16, SEK: 1.00, NOK: 1.05, DKK: 0.73, PLN: 0.44, THB: 3.77, MYR: 4.80, PHP: 58.57 },
      NOK: { USD: 0.11, EUR: 0.094, GBP: 0.081, JPY: 12.54, CNY: 0.70, RUB: 8.34, AUD: 0.14, CAD: 0.13, CHF: 0.097, INR: 8.02, BRL: 0.56, ZAR: 1.50, MXN: 2.15, SGD: 0.14, NZD: 0.15, SEK: 0.98, TRY: 0.98, DKK: 0.70, PLN: 0.43, THB: 3.71, MYR: 4.71, PHP: 57.48 },
      DKK: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 16.98, CNY: 0.95, RUB: 11.27, AUD: 0.19, CAD: 0.17, CHF: 0.13, INR: 10.58, BRL: 0.74, ZAR: 1.98, MXN: 2.83, SGD: 0.19, NZD: 0.20, SEK: 1.26, TRY: 1.23, NOK: 1.30, PLN: 0.79, THB: 6.73, MYR: 8.54, PHP: 104.18 },
      PLN: { USD: 0.26, EUR: 0.22, GBP: 0.19, JPY: 29.82, CNY: 1.67, RUB: 19.81, AUD: 0.33, CAD: 0.31, CHF: 0.23, INR: 19.10, BRL: 1.34, ZAR: 3.59, MXN: 5.14, SGD: 0.34, NZD: 0.36, SEK: 2.25, TRY: 2.20, NOK: 2.32, DKK: 1.61, THB: 8.58, MYR: 10.91, PHP: 133.27 },
      THB: { USD: 0.033, EUR: 0.028, GBP: 0.024, JPY: 3.67, CNY: 0.20, RUB: 2.38, AUD: 0.040, CAD: 0.037, CHF: 0.028, INR: 2.30, BRL: 0.16, ZAR: 0.44, MXN: 0.64, SGD: 0.043, NZD: 0.046, SEK: 0.29, TRY: 0.28, NOK: 0.30, DKK: 0.21, PLN: 0.12, MYR: 1.27, PHP: 15.47 },
      MYR: { USD: 0.24, EUR: 0.20, GBP: 0.17, JPY: 26.00, CNY: 1.45, RUB: 17.20, AUD: 0.29, CAD: 0.27, CHF: 0.20, INR: 16.40, BRL: 1.15, ZAR: 3.08, MXN: 4.41, SGD: 0.30, NZD: 0.31, SEK: 1.94, TRY: 1.90, NOK: 2.00, DKK: 1.39, PLN: 0.84, THB: 7.11, PHP: 118.71 },
      PHP: { USD: 0.021, EUR: 0.017, GBP: 0.015, JPY: 2.24, CNY: 0.12, RUB: 1.42, AUD: 0.024, CAD: 0.022, CHF: 0.016, INR: 1.32, BRL: 0.092, ZAR: 0.25, MXN: 0.36, SGD: 0.024, NZD: 0.026, SEK: 0.16, TRY: 0.16, NOK: 0.17, DKK: 0.12, PLN: 0.073, THB: 0.64, MYR: 0.092 }
    };

    return conversionRates[fromCurrency][toCurrency];
  }
});