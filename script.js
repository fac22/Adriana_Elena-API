const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

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
    .catch(console.error);
});
