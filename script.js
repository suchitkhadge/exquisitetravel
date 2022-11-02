const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";

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
});
console.log(city);

function showAttractionsList() {
  //   console.log(city);//???why it's not none
  const att = city.slice(0, 3);
  // const attractionsAPi = `${openTripBaseURL}autosuggest?name=${att}&radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&rate=${rate}&limit=${limit}&apikey=${opentripApiKey}`;
  const attractionsAPi = `${openTripBaseURL}radius?radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&limit=${limit}&apikey=${opentripApiKey}`;
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
    const attractionName = attraction.properties.name;
    listEle.textContent = attractionName;
    list.appendChild(listEle);
    // const btn = document.createElement("button");
    // btn.textContent = "Details";
    const btn = detailsBtnCreator();
    listEle.appendChild(btn);
    const modal = modalCreator(attractionName);
    listEle.appendChild(modal);
  }
}

function detailsBtnCreator() {
  const btn = document.createElement("button");
  btn.textContent = "Details";
  btn.setAttribute("type", "button");
  btn.classList.add("btn");
  btn.classList.add("btn-primary");
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", "#exampleModal");
  return btn;
}

function modalCreator(title) {
  const firstDiv = document.createElement("div");
  firstDiv.classList.add("modal");
  firstDiv.classList.add("fade");
  firstDiv.setAttribute("id", "exampleModal");
  firstDiv.setAttribute("tabindex", "-1");
  firstDiv.setAttribute("aria-labelledby", "exampleModalLabel");
  firstDiv.setAttribute("aria-hidden", "true");

  const secDiv = document.createElement("div");
  secDiv.classList.add("modal-dialog");
  firstDiv.appendChild(secDiv);

  const thirdDiv = document.createElement("div");
  thirdDiv.classList.add("modal-content");
  secDiv.appendChild(thirdDiv);

  const fourthDiv = document.createElement("div");
  fourthDiv.classList.add("modal-header");
  thirdDiv.appendChild(fourthDiv);

  const h1Heading = document.createElement("h1");
  h1Heading.classList.add("modal-title");
  h1Heading.classList.add("fs-5");
  h1Heading.setAttribute("id", "exampleModalLabel");
  h1Heading.textContent = title;
  fourthDiv.appendChild(h1Heading);

  return firstDiv;
}

function getGoogleMap(city) {
  let cityMap = document.createElement("img");

  let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;

  cityMap.setAttribute("src", cityMapSrc);

  cityMap.setAttribute("width", "400px");

  cityMap.setAttribute("height", "400px");

  document.getElementById("main-container").innerHTML = "";

  document.getElementById("main-container").appendChild(cityMap);
}
