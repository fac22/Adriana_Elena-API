function init() {
  document.querySelector('#country').value = '';
}

window.addEventListener('load', init);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

//   First, we have to check if we have made any other search. That would
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
  } else {
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
});
