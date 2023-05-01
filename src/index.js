import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function empty() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onInput(evt) {
  const countryName = evt.target.value.trim();
  if (!countryName) {
    empty();
    return;
  }
  fetchCountries(countryName).then(selectCountry).catch(error);
}

function selectCountry(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info('(!) Too many matches found. Please enter a more specific name.');
    empty();
    return;
  }

  if (countries.length > 1) {
    empty();
    return showCountries(countries);
  }

  if (countries.length === 1) {
    empty();
    return showCountryInfo(countries);
  }
}

function showCountries(countries) {
  const markup = countries
    .map(({ flags: { svg }, name: { official } }) => {
      return `<li>
    <img src="${svg}" alt="flag" width="25">
    <h3 class="country">${official}</h3>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function showCountryInfo(countries) {
  const markup = countries
    .map(({ name: { official }, capital, population, languages, flags: { svg } }) => {
      return `<img src="${svg}" alt="flag" width="100"></img>
      <h2>${official}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function error(error) {
  console.log(error);
  empty();
}
