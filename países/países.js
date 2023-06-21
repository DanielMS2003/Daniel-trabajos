const countryForm = document.getElementById('countryForm');
const countryInput = document.getElementById('countryInput');
const countryStatsElement = document.getElementById('countryStats');

countryForm.addEventListener('submit', event => {
  event.preventDefault();
  const countryName = countryInput.value.trim();
  if (countryName) {
    fetchCountryStats(countryName);
  }
});

function fetchCountryStats(countryName) {
  const endpoint = `https://restcountries.com/v2/name/${encodeURIComponent(countryName)}?fullText=true`;

  countryStatsElement.innerHTML = '<p>Loading...</p>';

  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch country statistics. Please try again later.');
      }
      return response.json();
    })
    .then(data => {
      const country = data[0];
      const population = formatNumber(country.population);
      const gdp = formatNumber(country.gini);
      const area = formatNumber(country.area);
      const languages = country.languages && country.languages.length > 0 ? country.languages.map(lang => lang.name).join(', ') : 'N/A';
      const capital = country.capital || 'N/A';
      const currency = country.currencies && country.currencies.length > 0 ? `${country.currencies[0].name} (${country.currencies[0].symbol})` : 'N/A';
      const region = country.region || 'N/A';
      const subregion = country.subregion || 'N/A';
      const callingCodes = country.callingCodes && country.callingCodes.length > 0 ? country.callingCodes.join(', ') : 'N/A';
      const timezones = country.timezones && country.timezones.length > 0 ? country.timezones.join(', ') : 'N/A';
      const borders = country.borders && country.borders.length > 0 ? country.borders.join(', ') : 'N/A';
      const flag = country.flags?.svg || '';
      const government = country.government || 'N/A';
      const populationDensity = calculatePopulationDensity(country.population, country.area);
      const alpha2Code = country.alpha2Code || 'N/A';

      countryStatsElement.innerHTML = `
        <h2>${country.name}</h2>
        <img src="${flag}" alt="Flag of ${country.name}" width="200">
        <p>Alpha-2 Code: ${alpha2Code}</p>
        <p>Population: ${population}</p>
        <p>Population Density: ${populationDensity} per km²</p>
        <p>GDP (GINI Index): ${gdp}</p>
        <p>Area: ${area} km²</p>
        <p>Languages: ${languages}</p>
        <p>Capital: ${capital}</p>
        <p>Currency: ${currency}</p>
        <p>Region: ${region}</p>
        <p>Subregion: ${subregion}</p>
        <p>Calling Codes: ${callingCodes}</p>
        <p>Timezones: ${timezones}</p>
        <p>Borders: ${borders}</p>
        <p>Government: ${government}</p>
        <!-- Add more data fields as needed -->
      `;
    })
    .catch(error => {
      console.error(error);

      const errorMessage = error.message || 'Failed to fetch country statistics. Please try again later.';
      countryStatsElement.innerHTML = `<p class="error">${errorMessage}</p>`;
    });
}

function formatNumber(number) {
  if (isNaN(number)) {
    return 'N/A';
  }
  return Number(number).toLocaleString('en');
}

function calculatePopulationDensity(population, area) {
  if (isNaN(population) || isNaN(area) || area === 0) {
    return 'N/A';
  }
  const density = population / area;
  return density.toFixed(2);
}