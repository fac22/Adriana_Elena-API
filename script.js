document.querySelector('#copy-year').innerHTML = new Date().getFullYear();

const form = document.querySelector('form');
const spinner = document.querySelector('.spinner');

function getJSON(url, errorMsg = 'Something went wrong') {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`${errorMsg}: (${response.status})`);
      return response.json();
    })
    .then((array) => {
      if (array.length !== 0) {
        return array[array.length - 1];
      } else throw new Error('Invalid country');
    });
}

function init() {
  document.querySelector('#country').value = '';
}

function populateCountryData(domElement, countryData) {
  spinner.classList.add('hidden');

  domElement.querySelector('#searched-country').textContent =
    countryData.Country;
  domElement.querySelector('#confirmed').textContent = countryData.Confirmed;
  domElement.querySelector('#deaths').textContent = countryData.Deaths;
  domElement.querySelector('#recovered').textContent = countryData.Recovered;
  domElement.querySelector('#active').textContent = countryData.Active;
  domElement.querySelector('#date').textContent = new Intl.DateTimeFormat(
    'en-GB'
  ).format(new Date(countryData.Date));
}

function searchCountry(e) {
  e.preventDefault();
  spinner.classList.remove('hidden');

  const formData = new FormData(form);
  const data = formData.get('country');
  //   -------------- API request used: GET 'Live By Country All Status
  getJSON(
    `https://api.covid19api.com/live/country/${data}`,
    'Error in retrieving country data!'
  )
    .then((countryData) => {
      const oldTemplate = document.querySelector('#country-search');

      //   First, we have to check if we have made any other search. That would mean that we have already created a template, so we can just re-use it, instead of creating a new one.
      // This way, we don't add new templates with every new search and the results appear neatly on our page!
      if (oldTemplate !== null) {
        populateCountryData(document, countryData);
      }
      //   if we have reached this point, it means we are on the FIRST country search since the loading of the page, so we have to CREATE the template for our first results.
      else {
        const attach = document.querySelector('#attach');
        const template = document.querySelector('#country-results');
        const domFragment = template.content.cloneNode(true);

        populateCountryData(domFragment, countryData);

        attach.appendChild(domFragment);
      }
    })
    .catch((error) => {
      spinner.classList.add('hidden');
      console.log(error);
      alert(`${error.message}. Try again!`);
    });
}

window.addEventListener('load', init);
form.addEventListener('submit', searchCountry);

// geolocation

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function whereAmI(e) {
  spinner.classList.remove('hidden');
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then((data) => {
      document.querySelector('#country').value = data.country;
      searchCountry(e);
    })
    .catch((err) => console.error(`${err.message}`));
}

const btn = document.querySelector('.last-visited');

btn.addEventListener('click', whereAmI);

// ---------------------------- GLOBAL STATS
function globalStats() {
  const date = document.querySelector('#date');
  const confirmed = document.querySelector('#confirmed');
  const deaths = document.querySelector('#deaths');
  const recovered = document.querySelector('#recovered');

  // getting the current date
  let d = new Date();
  date.textContent = d.toLocaleString('en-UK').slice(0, 10);

  // fetching the global data
  fetch('https://api.covid19api.com/summary')
    .then((response) => response.json())
    .then((data) => {
      console.log(data.Global);

      confirmed.textContent = `${data.Global.NewConfirmed}(N)-${data.Global.TotalConfirmed}(T)`;
      deaths.textContent = `${data.Global.NewDeaths}(N) - ${data.Global.TotalDeaths}(T)`;
      recovered.textContent = `${data.Global.NewRecovered}(N) - ${data.Global.TotalRecovered}(T)`;
    });
}

window.addEventListener('load', globalStats);
