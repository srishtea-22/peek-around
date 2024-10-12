function success(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetchArticles(lat, lon);
}

function error(position){
    alert("could not retrieve your location");
}

function fetchArticles(lat, lon){
    const radius = 10000;           // 10km radius
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=10&format=json&origin=*`;

    fetch(url)
    .then(response => response.json())              // read and parse as json
    .then(data => displayResults(data.query.geosearch))       // data contains response of the api
    .catch(error => console.error('Error fetching data:', error));
}

function displayResults(places) {
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";      // Clear previous results

  places.forEach(place => {
    const placeElement = document.createElement("div");
    placeElement.className = "place";

    placeElement.innerHTML = `
      <h3>${place.title}</h3>
      <p>Distance: ${place.dist} meters</p>
      <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(place.title)}" target="_blank">Read more</a>
    `;

    resultDiv.appendChild(placeElement);
  });
}

document.getElementById("fetch-button").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });