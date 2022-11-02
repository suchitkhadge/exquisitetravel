const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";
const openWeatherBaseURL = "https://api.openweathermap.org/data/3.0/onecall?";
const openWeatherApiKey = "bee1ae44576d679f5012d45660e1473a";

const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
let geo = [];
const radius = 20000;
const rate = 2;
const limit = 10;
let city;

async function callOpenTripApiToGetGeo(api) {
  const response = await axios.get(api);
  const lat = response.data.lat;
  const lon = response.data.lon;
  return [lat, lon];
}

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  city = user_input.value;
  const openTripAPI = `${openTripBaseURL}geoname?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApiToGetGeo(openTripAPI);
  getGoogleMap(city);
  attractionBtn.addEventListener("click", showAttractionsList);


  
  weatherBtn.addEventListener("click",showWeather);
})
console.log(city);

function showWeather() {
  fetch(`${openWeatherBaseURL}lat=${geo[0]}&lon=${geo[1]}&appid=${openWeatherApiKey}`)
  .then(response => response.json())
  .then(data => console.log(data))
  
  .catch(err => alert("City not found!"))
  
}

function showAttractionsList() {
  //   console.log(city);//???why it's not none
  const att = city.slice(0, 3);
  const attractionsAPi = `${openTripBaseURL}autosuggest?name=${att}&radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&rate=${rate}&limit=${limit}&apikey=${opentripApiKey}`;
  callOpenTripApiToGetAttractionsList(attractionsAPi);
}

async function callOpenTripApiToGetAttractionsList(api) {
  const list = document.createElement("ul");
  const main_container = document.querySelector("#main-container");
  main_container.innerHTML = "";
  main_container.appendChild(list);
  //   debugger;
  console.log(geo[0]);
  const response = await axios.get(api);
  const data = response.data.features;
  console.log(data);
  for (const attraction of data) {
    // debugger;
    const listEle = document.createElement("li");
    listEle.textContent = attraction.properties.name;
    list.appendChild(listEle);
    const btn = document.createElement("button");
    btn.textContent = "Details";
    listEle.appendChild(btn);
  }
}

// Get google map by making the API call

// function getGoogleMap(city) {
//   let cityMap = document.createElement("img");
//   let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;
//   cityMap.setAttribute("src", cityMapSrc);
//   cityMap.setAttribute("width", "400px");
//   cityMap.setAttribute("height", "400px");
//   document.getElementById("main-container").appendChild(cityMap);
// }
function getGoogleMap(city) {
  let cityMap = document.createElement("img");

  let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;

  cityMap.setAttribute("src", cityMapSrc);

  cityMap.setAttribute("width", "400px");

  cityMap.setAttribute("height", "400px");

  document.getElementById("main-container").innerHTML = "";

  document.getElementById("main-container").appendChild(cityMap);
}

