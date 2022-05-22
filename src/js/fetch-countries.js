import '../css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import countryListTemplate from '../templates/counrty-list.hbs';
import countryInfoTemlate from '../templates/country-info.hbs';
import API from './api-service.js';
import getRefs from './get-refs.js';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();

    const searchCountry = refs.searchBox.value.trim();

    if (searchCountry === '') {
      return clearContent();
    }
  
    API.fetchCountry(searchCountry)
    .then(renderCountryCard)
    .catch(onFetchError);
};


function onFetchError(error) {
  clearContent();
  Notiflix.Notify.failure('Oops, there is no country with that name');
  console.log(error);
};


function renderCountryCard(country) {
  const markupList = countryListTemplate(country);
  const markupInfo = countryInfoTemlate(country);
  console.log(country.length);

  if (country.length === 1) {
    refs.countryInfo.innerHTML = markupInfo;
    refs.countryList.innerHTML = '';
   } else if (country.length > 1 && country.length < 10) {
    refs.countryList.innerHTML = markupList;
    refs.countryInfo.innerHTML = '';
  } else if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    clearContent()
  };
};

function clearContent() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};