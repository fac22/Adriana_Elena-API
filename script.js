const form = document.querySelector("form");

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`${errorMsg}: (${response.status})`);
      return response.json();
    })
    .then((array) => {
      if (array.length !== 0) {
        return array[array.length - 1];
      } else throw new Error("Invalid country");
    });
};

function init() {
  document.querySelector("#country").value = "";
}

function populateCountryData(domElement, countryData) {
  domElement.querySelector("#searched-country").textContent =
    countryData.Country;
  domElement.querySelector("#confirmed").textContent = countryData.Confirmed;
  domElement.querySelector("#deaths").textContent = countryData.Deaths;
  domElement.querySelector("#recovered").textContent = countryData.Recovered;
  domElement.querySelector("#active").textContent = countryData.Active;
  domElement.querySelector("#date").textContent = new Intl.DateTimeFormat(
    "en-GB"
  ).format(new Date(countryData.Date));
}

function searchCountry(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const data = formData.get("country");
  //   -------------- API request used: GET 'Live By Country All Status
  getJSON(
    `https://api.covid19api.com/live/country/${data}`,
    "Error in retrieving country data!"
  )
    .then((countryData) => {
      const oldTemplate = document.querySelector("#country-search");

      //   First, we have to check if we have made any other search. That would mean that we have already created a template, so we can just re-use it, instead of creating a new one.
      // This way, we don't add new templates with every new search and the results appear neatly on our page!
      if (oldTemplate !== null) {
        populateCountryData(document, countryData);
      }
      //   if we have reached this point, it means we are on the FIRST country search since the loading of the page, so we have to CREATE the template for our first results.
      else {
        const attach = document.querySelector("#attach");
        const template = document.querySelector("#country-results");
        const domFragment = template.content.cloneNode(true);

        populateCountryData(domFragment, countryData);

        attach.appendChild(domFragment);
      }
    })
    .catch((error) => {
      console.log(error);
      alert(`${error.message}. Try again!`);
    });
}

window.addEventListener("load", init);
form.addEventListener("submit", searchCountry);
