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
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
  ];

  amountInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      handleConversion();
    }
  });  

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
  
    if (isNaN(amount) || !fromCurrency || !toCurrency || amount <= 0) {
      resultElement.textContent = 'Please enter a valid positive amount and select currencies.';
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

  function addOption(selectElement, currency) {
    const option = document.createElement('option');
    option.value = currency.code;
    option.text = `${currency.code} - ${currency.name} (${getCurrencySymbol(currency.code)})`;
    selectElement.appendChild(option);
  }

  function getCurrencySymbol(currencyCode) {
    const currencySymbols = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', RUB: '₽', AUD: '$', CAD: '$', CHF: 'Fr', INR: '₹', BRL: 'R$', ZAR: 'R', MXN: '$', SGD: '$',
      NZD: '$', SEK: 'kr', TRY: '₺', NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', MYR: 'RM', PHP: '₱', IDR: 'Rp', KRW: '₩', HKD: 'HK$',
    };

    return currencySymbols[currencyCode] || currencyCode;
  }  

  function getConversionRate(fromCurrency, toCurrency) {
    const conversionRates = {
      USD: { EUR: 0.85, GBP: 0.72, JPY: 110.11, CNY: 6.43, RUB: 74.89, AUD: 1.33, CAD: 1.23, CHF: 0.91, INR: 74.39, BRL: 5.22, ZAR: 13.93, MXN: 20.04, SGD: 1.35, NZD: 1.43, SEK: 8.97, TRY: 8.73, NOK: 9.17, DKK: 6.37, PLN: 3.89, THB: 33.06, MYR: 4.18, PHP: 51.16, KRW: 1293.85, HKD: 7.83, },
      EUR: { USD: 1.18, GBP: 0.85, JPY: 130.56, CNY: 7.64, RUB: 88.89, AUD: 1.58, CAD: 1.46, CHF: 1.09, INR: 89.57, BRL: 6.27, ZAR: 16.72, MXN: 24.04, SGD: 1.61, NZD: 1.70, SEK: 10.62, TRY: 10.34, NOK: 10.86, DKK: 7.54, PLN: 4.60, THB: 39.07, MYR: 4.95, PHP: 60.55, KRW: 1413.23, HKD: 8.55, },
      GBP: { USD: 1.39, EUR: 1.17, JPY: 152.48, CNY: 8.93, RUB: 103.71, AUD: 1.83, CAD: 1.69, CHF: 1.26, INR: 103.44, BRL: 7.24, ZAR: 19.33, MXN: 27.75, SGD: 1.86, NZD: 1.97, SEK: 12.34, TRY: 12.02, NOK: 12.63, DKK: 8.77, PLN: 5.35, THB: 45.43, MYR: 5.76, PHP: 70.46, KRW: 1642.6, HKD: 9.94, },
      JPY: { USD: 0.0091, EUR: 0.0076, GBP: 0.0066, CNY: 0.059, RUB: 0.69, AUD: 0.012, CAD: 0.011, CHF: 0.0083, INR: 0.68, BRL: 0.048, ZAR: 0.13, MXN: 0.19, SGD: 0.012, NZD: 0.013, SEK: 0.081, TRY: 0.079, NOK: 0.083, DKK: 0.058, PLN: 0.035, THB: 0.29, IDR: 125.39, MYR: 0.38, PHP: 0.39, KRW: 9.13, HKD: 0.055, },
      CNY: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 16.93, RUB: 11.65, AUD: 0.20, CAD: 0.18, CHF: 0.14, INR: 11.70, BRL: 0.82, ZAR: 2.19, MXN: 3.15, SGD: 0.21, NZD: 0.22, SEK: 1.39, TRY: 1.36, NOK: 1.43, DKK: 1.00, PLN: 0.61, THB: 5.22, MYR: 0.66, PHP: 8.08, KRW: 179.98, HKD: 1.09, },
      RUB: { USD: 0.013, EUR: 0.011, GBP: 0.0096, JPY: 1.45, CNY: 0.086, AUD: 0.015, CAD: 0.014, CHF: 0.011, INR: 0.84, BRL: 0.059, ZAR: 0.16, MXN: 0.23, SGD: 0.015, NZD: 0.016, SEK: 0.10, TRY: 0.097, NOK: 0.10, DKK: 0.069, PLN: 0.042, THB: 0.36, MYR: 0.046, PHP: 0.57, KRW: 15.39, HKD: 0.093, },
      AUD: { USD: 0.75, EUR: 0.63, GBP: 0.55, JPY: 84.86, CNY: 5.16, RUB: 64.63, CAD: 0.92, CHF: 0.68, INR: 55.77, BRL: 3.92, ZAR: 10.46, MXN: 15.03, SGD: 1.01, NZD: 1.07, SEK: 6.68, TRY: 6.51, NOK: 6.85, DKK: 4.76, PLN: 2.90, THB: 24.63, MYR: 3.11, PHP: 38.08, KRW: 875.7, HKD: 5.3, },
      CAD: { USD: 0.81, EUR: 0.68, GBP: 0.59, JPY: 91.01, CNY: 5.57, RUB: 69.85, AUD: 1.09, CHF: 0.74, INR: 60.67, BRL: 4.26, ZAR: 11.34, MXN: 16.29, SGD: 1.09, NZD: 1.16, SEK: 7.25, TRY: 7.07, NOK: 7.43, DKK: 5.15, PLN: 3.14, THB: 26.71, MYR: 3.37, PHP: 41.26, KRW: 978.41, HKD: 5.92, },
      CHF: { USD: 1.10, EUR: 0.92, GBP: 0.79, JPY: 121.03, CNY: 7.40, RUB: 92.91, AUD: 1.47, CAD: 1.36, INR: 82.61, BRL: 5.79, ZAR: 15.37, MXN: 22.07, SGD: 1.48, NZD: 1.57, SEK: 9.81, TRY: 9.56, NOK: 10.06, DKK: 6.97, PLN: 4.25, THB: 36.17, MYR: 4.56, PHP: 55.88, KRW: 1441.99, HKD: 8.72, },
      INR: { USD: 0.014, EUR: 0.011, GBP: 0.0093, JPY: 1.40, CNY: 0.085, RUB: 1.19, AUD: 0.018, CAD: 0.016, CHF: 0.012, BRL: 0.070, ZAR: 0.19, MXN: 0.27, SGD: 0.018, NZD: 0.019, SEK: 0.12, TRY: 0.12, NOK: 0.13, DKK: 0.091, PLN: 0.056, THB: 0.48, MYR: 0.061, PHP: 0.75, KRW: 15.78, HKD: 0.095, },
      BRL: { USD: 0.20, EUR: 0.17, GBP: 0.15, JPY: 23.27, CNY: 1.42, RUB: 17.86, AUD: 0.26, CAD: 0.24, CHF: 0.19, INR: 14.21, ZAR: 2.86, MXN: 4.12, SGD: 0.28, NZD: 0.30, SEK: 1.87, TRY: 1.82, NOK: 1.91, DKK: 1.33, PLN: 0.81, THB: 6.92, MYR: 0.87, PHP: 10.68, KRW: 270.06, HKD: 1.63, },
      ZAR: { USD: 0.070, EUR: 0.058, GBP: 0.050, JPY: 7.56, CNY: 0.46, RUB: 5.81, AUD: 0.095, CAD: 0.088, CHF: 0.072, INR: 5.40, BRL: 0.35, MXN: 1.44, SGD: 0.098, NZD: 0.10, SEK: 0.62, TRY: 0.60, NOK: 0.63, DKK: 0.44, PLN: 0.27, THB: 2.27, MYR: 0.29, PHP: 3.53, KRW: 70.45, HKD: 0.43, },
      MXN: { USD: 0.049, EUR: 0.041, GBP: 0.035, JPY: 5.29, CNY: 0.32, RUB: 4.05, AUD: 0.067, CAD: 0.061, CHF: 0.051, INR: 3.79, BRL: 0.24, ZAR: 0.70, SGD: 0.073, NZD: 0.077, SEK: 0.48, TRY: 0.47, NOK: 0.50, DKK: 0.35, PLN: 0.21, THB: 1.77, MYR: 0.22, PHP: 2.68, KRW: 75.38, HKD: 0.46, },
      SGD: { USD: 0.74, EUR: 0.62, GBP: 0.53, JPY: 80.70, CNY: 4.93, RUB: 62.02, AUD: 0.92, CAD: 0.85, CHF: 0.70, INR: 52.62, BRL: 3.58, ZAR: 9.49, MXN: 13.64, NZD: 1.06, SEK: 6.62, TRY: 6.45, NOK: 6.78, DKK: 4.71, PLN: 2.87, THB: 24.43, MYR: 3.08, PHP: 37.74, KRW: 963.03, HKD: 5.83, },
      NZD: { USD: 0.70, EUR: 0.59, GBP: 0.51, JPY: 78.15, CNY: 4.78, RUB: 60.14, AUD: 0.93, CAD: 0.86, CHF: 0.71, INR: 51.40, BRL: 3.50, ZAR: 9.29, MXN: 13.37, SGD: 0.95, SEK: 6.25, TRY: 6.09, NOK: 6.41, DKK: 4.46, PLN: 2.72, THB: 23.18, MYR: 2.92, PHP: 35.79, KRW: 798.52, HKD: 4.83, },
      SEK: { USD: 0.11, EUR: 0.093, GBP: 0.080, JPY: 12.24, CNY: 0.75, RUB: 9.46, AUD: 0.15, CAD: 0.14, CHF: 0.12, INR: 9.13, BRL: 0.62, ZAR: 1.63, MXN: 2.35, SGD: 0.15, NZD: 0.16, TRY: 0.98, NOK: 1.03, DKK: 0.71, PLN: 0.43, THB: 3.68, MYR: 0.46, PHP: 5.66, KRW: 120.18, HKD: 0.73, },
      TRY: { USD: 0.11, EUR: 0.093, GBP: 0.080, JPY: 12.24, CNY: 0.75, RUB: 9.46, AUD: 0.15, CAD: 0.14, CHF: 0.12, INR: 9.13, BRL: 0.62, ZAR: 1.63, MXN: 2.35, SGD: 0.15, NZD: 0.16, SEK: 1.03, NOK: 1.03, DKK: 0.71, PLN: 0.43, THB: 3.68, MYR: 0.46, PHP: 5.66, KRW: 54.91, HKD: 0.33, },
      NOK: { USD: 0.11, EUR: 0.093, GBP: 0.080, JPY: 12.24, CNY: 0.75, RUB: 9.46, AUD: 0.15, CAD: 0.14, CHF: 0.12, INR: 9.13, BRL: 0.62, ZAR: 1.63, MXN: 2.35, SGD: 0.15, NZD: 0.16, SEK: 1.03, TRY: 0.97, DKK: 0.71, PLN: 0.43, THB: 3.68, MYR: 0.46, PHP: 5.66, KRW: 120.38, HKD: 0.73, },
      DKK: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 16.54, CNY: 1.01, RUB: 12.73, AUD: 0.20, CAD: 0.18, CHF: 0.15, INR: 11.14, BRL: 0.76, ZAR: 2.01, MXN: 2.88, SGD: 0.19, NZD: 0.20, SEK: 1.24, TRY: 1.21, NOK: 1.28, PLN: 0.78, THB: 6.66, MYR: 0.84, PHP: 10.34, KRW: 189.7, HKD: 1.15, },
      PLN: { USD: 0.26, EUR: 0.22, GBP: 0.19, JPY: 29.53, CNY: 1.80, RUB: 22.73, AUD: 0.36, CAD: 0.34, CHF: 0.28, INR: 20.96, BRL: 1.43, ZAR: 3.77, MXN: 5.42, SGD: 0.36, NZD: 0.38, SEK: 2.34, TRY: 2.28, NOK: 2.40, DKK: 1.67, THB: 8.52, MYR: 1.07, PHP: 13.14, KRW: 318.58, HKD: 1.93, },
      THB: { USD: 0.032, EUR: 0.027, GBP: 0.023, JPY: 3.42, CNY: 0.21, RUB: 2.70, AUD: 0.044, CAD: 0.041, CHF: 0.034, INR: 2.57, BRL: 0.17, ZAR: 0.44, MXN: 0.64, SGD: 0.043, NZD: 0.046, SEK: 0.28, TRY: 0.28, NOK: 0.30, DKK: 0.21, PLN: 0.12, MYR: 0.13, PHP: 1.57, KRW: 37.14, HKD: 0.22, },
      MYR: { USD: 0.24, EUR: 0.20, GBP: 0.17, JPY: 25.72, CNY: 1.57, RUB: 19.81, AUD: 0.32, CAD: 0.30, CHF: 0.25, INR: 18.60, BRL: 1.27, ZAR: 3.35, MXN: 4.81, SGD: 0.32, NZD: 0.34, SEK: 2.12, TRY: 2.06, NOK: 2.17, DKK: 1.51, PLN: 0.92, THB: 7.47, PHP: 11.54, KRW: 278.59, HKD: 1.69, },
      PHP: { USD: 0.020, EUR: 0.017, GBP: 0.014, JPY: 2.12, CNY: 0.13, RUB: 1.66, AUD: 0.027, CAD: 0.025, CHF: 0.021, INR: 1.57, BRL: 0.11, ZAR: 0.29, MXN: 0.42, SGD: 0.028, NZD: 0.030, SEK: 0.18, TRY: 0.18, NOK: 0.19, DKK: 0.13, PLN: 0.080, THB: 0.67, MYR: 0.086, KRW: 23.27, HKD: 0.14, },
      KRW: { USD: 0.00089, EUR: 0.00075, GBP: 0.00065, JPY: 10.11, CNY: 0.062, RUB: 0.75, AUD: 0.0013, CAD: 0.0012, CHF: 0.00089, INR: 0.069, BRL: 0.0049, ZAR: 0.13, MXN: 0.19, SGD: 0.0013, NZD: 0.0014, SEK: 0.0088, TRY: 0.0086, NOK: 0.009, DKK: 0.0063, PLN: 0.0039, THB: 0.033, MYR: 0.0042, PHP: 0.052 },
      HKD: { USD: 0.13, EUR: 0.11, GBP: 0.095, JPY: 15.48, CNY: 0.90, RUB: 11.13, AUD: 0.16, CAD: 0.15, CHF: 0.12, INR: 9.33, BRL: 0.66, ZAR: 1.77, MXN: 2.54, SGD: 0.17, NZD: 0.18, SEK: 1.12, TRY: 1.09, NOK: 1.15, DKK: 0.80, PLN: 0.49, THB: 4.16, MYR: 0.53, PHP: 6.47 },
    };
    return conversionRates[fromCurrency][toCurrency];
  }
});