const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = formData.get('country');
  
});

fetch('https://api.covid19api.com/live/country/south-africa')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error in retrieving country data!');
    }
    return response.json();
  })
  .then((array) => console.log(array[array.length - 1]))
  .then(console.log)
  .catch(console.error);
