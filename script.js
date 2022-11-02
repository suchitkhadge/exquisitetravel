const BaseURL = "https://api.opentripmap.com/0.1/en/places/geoname";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";

let geo = [];
let city;

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  city = user_input.value;
  const openTripAPI = `${BaseURL}?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApi(openTripAPI);
  console.log(geo);
  debugger;
  getGoogleMap(city);
  
});

map.addEventListener("click", (event) => {
  let target = event.target;
  event.preventDefault();
  getGoogleMap(city);
  console.log("Getting google map");
});

restaurants.addEventListener("click", (event) => {
 
    let target = event.target;
    event.preventDefault();
    const API_URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=47.608013%2C-122.335167&radius=1500&type=restaurant&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc`;
    fetch(API_URL)
    .then((res) => res.json())
    .then(({ results: restaurantList}) => {
        for (const restaurant of restaurantList) {
            mapImg = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp1BkdM6acJ96xTec3tsV_ZJNL_JP-lqsVxydG3nh739RE_hepOOL05tfJh2_ranjMadb3VoBYFvF0ma6S24qZ6QJUuV6sSRrhCskSBP5C1myCzsebztMfGvm7ij3gZT&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc`
            mapGoogleImg = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&height=200&photo_reference=${restaurant.photos[0].photo_reference}&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc`
            console.log(restaurant.name);
            console.log(restaurant.vicinity);
            console.log(restaurant.photos[0].photo_reference);
            newCard(restaurant.name, restaurant.vicinity, mapGoogleImg, "description")
            
        }
      console.log(restaurantList);


      
    
});
});


async function callOpenTripApi(api) {
  const response = await axios.get(api);
  const lat = response.data.lat;
  const lon = response.data.lon;
  return [lat, lon];
}

// Get google map by making the API 

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




  


