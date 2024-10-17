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

function truncateDescription(extract) {
  // Split the extract into sentences
  const sentences = extract.split('. ');
  // Return the first 1-2 sentences
  return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : ''); // Add a period if more than one sentence
}

function fetchExtracts(pageids, callback) {
  const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageids.join('|')}`;
  fetch(extractUrl)
    .then(response => response.json())
    .then(data => {
      const truncatedPages = {};
      for (const pageid in data.query.pages) {
        const extract = data.query.pages[pageid].extract || "No description available.";
        truncatedPages[pageid] = {
          extract: truncateDescription(extract)
        };
      }
      callback(truncatedPages);
    })
    .catch(error => console.error('Error fetching extracts:', error));
}


function displayResults(places) {
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";      // Clear previous results

  const pageIds = places.map(place => place.pageid);

  fetchExtracts(pageIds, (pages) => {
    places.forEach(place => {
      const placeElement = document.createElement("div");
      placeElement.className = "place";
      
      const page = pages[place.pageid];
      const description = page.extract ? page.extract : "No description available.";

      placeElement.innerHTML = `
        <h1>${place.title}</h1>
        <h3>Distance: ${(place.dist / 1000).toFixed(2)} km</h3>
        <p>${description}</p> <!-- Added description here -->
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(place.title)}" target="_blank">Read more</a>
      `;

      resultDiv.appendChild(placeElement);
    });
  });
}

document.getElementById("fetch-button").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });