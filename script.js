function success(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
}

function error(position){
    alert("could not retrieve location");
}

document.getElementById("fetch-button").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });