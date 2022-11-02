const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
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



function newCard(name, location, photo, description) {// Use the passed arguments to create a bootstrap card with destination details
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.style.width = "10rem";
  card.style.height = "fit-content";
  card.style.margin = "5px;";

  // Create the destination card
  let img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("alt", name);
  img.setAttribute("src", photo);
  card.appendChild(img);
  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let cardTitle = document.createElement("p");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = name;
  cardBody.appendChild(cardTitle);

  let cardSubtitle = document.createElement("p");
  cardSubtitle.setAttribute("class", "card-subtitle mb-2 text-muted");
  cardSubtitle.innerText = location;
  cardBody.appendChild(cardSubtitle);

  var buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("class", "buttons_container");

  
  cardBody.appendChild(buttonsContainer);

  card.appendChild(cardBody);
  document.body.appendChild(card);

  return card;
}




  


