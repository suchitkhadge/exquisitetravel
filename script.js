const BaseURL = "https://api.opentripmap.com/0.1/en/places/geoname";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const opentripApiKey = "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";

let geo = [];
let url = "";

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = user_input.value;
  const openTripAPI = `${BaseURL}?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApi(openTripAPI);
  //   console.log(geo);
});

// getGoogleMap(city);
// console.log(city);

async function callOpenTripApi(api) {
  const response = await axios.get(api);
  const lat = response.data.lat;
  const lon = response.data.lon;
  return [lat, lon];
}

// Get google map

function getGoogleMap(city) {
  let cityMap = document.createElement("img");
  let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;
  cityMap.setAttribute("src", cityMapSrc);
  cityMap.setAttribute("width", "400px");
  cityMap.setAttribute("height", "400px");
  content.appendChild(cityMap);
}
