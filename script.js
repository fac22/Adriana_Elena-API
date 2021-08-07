const form = document.querySelector('form');

function init() {
  document.querySelector('#country').value = '';
}

function searchCountry(e) {
  e.preventDefault();

  //   First, we have to check if we have made any other search. That would mean that we have already created a template, so we can just re-use it, instead of creating a new one.
  // This way, we don't add new templates with every new search and the results appear neatly on our page!
  const oldTemplate = document.querySelector('#country-search');
  if (oldTemplate !== null) {
    const formData = new FormData(form);
    const data = formData.get('country');
    //   -------------- API request used: GET 'Live By Country All Status
    fetch(`https://api.covid19api.com/live/country/${data}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in retrieving country data!');
        }
        return response.json();
      })
      .then((array) => {
        if (array.length !== 0) {
          return array[array.length - 1];
        } else throw new Error('Please enter a country!');
      })
      // .then(console.log)
      .then((countryData) => {
        document.querySelector('#searched-country').textContent =
          countryData.Country;
        document.querySelector('#confirmed').textContent =
          countryData.Confirmed;
        document.querySelector('#deaths').textContent = countryData.Deaths;
        document.querySelector('#recovered').textContent =
          countryData.Recovered;
        document.querySelector('#active').textContent = countryData.Active;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }
  //   if we have reached this point, it means we are on the FIRST country search since the loading of the page, so we have to CREATE the template for our first results.
  else {
    const formData = new FormData(form);
    const data = formData.get('country');

    //   -------------- API request used: GET 'Live By Country All Status
    fetch(`https://api.covid19api.com/live/country/${data}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in retrieving country data!');
        }
        return response.json();
      })
      .then((array) => {
        if (array.length !== 0) {
          return array[array.length - 1];
        } else throw new Error('Please enter a country!');
      })
      // .then(console.log)
      .then((countryData) => {
        const attach = document.querySelector('#attach');
        const template = document.querySelector('#country-results');
        const domFragment = template.content.cloneNode(true);

        domFragment.querySelector('#searched-country').textContent =
          countryData.Country;
        domFragment.querySelector('#confirmed').textContent =
          countryData.Confirmed;
        domFragment.querySelector('#deaths').textContent = countryData.Deaths;
        domFragment.querySelector('#recovered').textContent =
          countryData.Recovered;
        domFragment.querySelector('#active').textContent = countryData.Active;

        attach.appendChild(domFragment);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }
}


window.addEventListener('load', init);
form.addEventListener('submit', searchCountry);
