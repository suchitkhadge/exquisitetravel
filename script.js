const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";
const openWeatherBaseURL = "https://api.openweathermap.org/data/3.0/onecall?";
const openWeatherApiKey = "bee1ae44576d679f5012d45660e1473a";

// to store geo location
let geo = [];
const radius = 10000;
const rate = 3;
const limit = 10;
let city;

// helper function
function addClassName(ele, className) {
  return ele.classList.add(className);
}

// convert city name to geo location
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
  restaurantsBtn.addEventListener("click", showRestaurantList);
  mapBtn.addEventListener("click", getGoogleMap);
  weatherBtn.addEventListener("click", showWeather);
});

// favorite button event handler
favoriteBtn.addEventListener("click", showBookMark);
// generate weather
function showWeather() {
  fetch(
    `${openWeatherBaseURL}lat=${geo[0]}&lon=${geo[1]}&appid=${openWeatherApiKey}`
  )
    .then((response) => response.json())
    .then((data) => console.log(data))

    .catch((err) => alert("City not found!"));
}

// generate attractions list
function showAttractionsList() {
  const att = city.slice(0, 3);
  const attractionsAPi = `${openTripBaseURL}radius?radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&src_attr=wikidata&kinds=amusements%2Cinteresting_places&rate=${rate}&apikey=${opentripApiKey}&limit=${limit}&SameSite=None`;
  callOpenTripApiToGetAttractionsList(attractionsAPi);
}
// generate restaurants list
async function showRestaurantList() {
  document.getElementById("main-container").innerHTML = " ";
  const list2 = document.createElement("ul");
  document.getElementById("main-container").appendChild(list2);
  const API_URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geo[0]}%2C${geo[1]}&radius=1500&type=restaurant&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc`;
  fetch(API_URL)
    .then((res) => res.json())
    .then(async ({ results: restaurantList }) => {
      const newRestaurantList = restaurantList.slice(0, 10);
      for (const restaurant of newRestaurantList) {
        const listEle2 = document.createElement("li");
        listEle2.textContent = restaurant.name;
        list2.appendChild(listEle2);
        const mapGoogleImg = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&height=400&photo_reference=${restaurant.photos[0].photo_reference}&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc`;
        const type = restaurant.types.join();
        const id = restaurant.place_id;
        const name = restaurant.name;

        const btn2 = detailsBtnCreator(id);
        listEle2.appendChild(btn2);

        const modal2 = await modalCreator3(
          id,
          name,
          mapGoogleImg,
          restaurant.vicinity,
          type,
          0,
          -1
        );
        listEle2.appendChild(modal2);
      }
      console.log(restaurantList);
    });
}

function getGoogleMap(city) {
  let cityMap = document.createElement("img");
  let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;
  cityMap.setAttribute("src", cityMapSrc);
  cityMap.setAttribute("width", "400px");
  cityMap.setAttribute("height", "400px");
  cityMap.setAttribute("id", "googleMap");
  document.getElementById("main-container").innerHTML = "";
  document.getElementById("main-container").appendChild(cityMap);
}

// make api call to get attractions data back
async function callOpenTripApiToGetAttractionsList(api) {
  try {
    const list = document.createElement("ul");
    const main_container = document.querySelector("#main-container");
    main_container.innerHTML = "";
    main_container.appendChild(list);

    const response = await axios.get(api);
    const data = response.data.features;

    for (const attraction of data) {
      const listEle = document.createElement("li");
      const attractionName = attraction.properties.name;
      listEle.textContent = attractionName;
      list.appendChild(listEle);
      const id = attraction.properties.xid;
      const btn = detailsBtnCreator(id);
      listEle.appendChild(btn);
      const modal = await modalCreator(id, attractionName, 0, -1);
      listEle.appendChild(modal);
    }
  } catch (err) {
    console.log(err);
  }
}

// make api call to get details of attraction
async function getAttractionDetail(api) {
  try {
    const res = await axios.get(api);
    return res;
  } catch (err) {
    console.log(err);
  }
}

// details button for attraction list
function detailsBtnCreator(id) {
  const btn = document.createElement("button");
  btn.textContent = "Details";
  btn.setAttribute("type", "button");
  addClassName(btn, "btn");
  addClassName(btn, "btn-primary");
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", `#${id}`);
  return btn;
}

// create pop-up modal for attraction
async function modalCreator(id, title, disabledAdd, disabledDelete) {
  try {
    const firstDiv = document.createElement("div");
    addClassName(firstDiv, "modal");
    addClassName(firstDiv, "fade");
    firstDiv.setAttribute("id", id);
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
    addClassName(fourthDiv, "modal-header");
    thirdDiv.appendChild(fourthDiv);

    const h5Heading = document.createElement("h5");
    h5Heading.classList.add("modal-title");
    h5Heading.classList.add("fs-5");
    h5Heading.setAttribute("id", "exampleModalLabel");
    h5Heading.textContent = title;
    fourthDiv.appendChild(h5Heading);

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("type", "button");
    addClassName(closeBtn, "btn-close");
    closeBtn.setAttribute("data-bs-dismiss", "modal");
    closeBtn.setAttribute("aria-label", "Close");
    fourthDiv.appendChild(closeBtn);

    const result = await getImgDescriptionAddressAndWikiLink(id);
    const url = result[0];
    const des = result[1];
    const add = result[2];
    const wiki = result[3];
    const cardDiv = CardDivCreator(url, des, add, wiki);
    thirdDiv.appendChild(cardDiv);

    const footerDiv = document.createElement("div");
    addClassName(footerDiv, "modal-footer");
    thirdDiv.appendChild(footerDiv);

    const footerBtn = document.createElement("button");
    footerBtn.setAttribute("type", "button");
    addClassName(footerBtn, "btn");
    addClassName(footerBtn, "btn-secondary");
    footerBtn.setAttribute("data-bs-dismiss", "modal");
    footerBtn.textContent = "Close";
    footerDiv.appendChild(footerBtn);

    const footerSaveBtn = saveOrDeleteBtn("saveBtn", "Save", disabledAdd);
    footerDiv.appendChild(footerSaveBtn);
    footerSaveBtn.addEventListener("click", () => {
      const bookmark = {
        city: city,
        name: title,
        location: add,
        id: id,
      };
      localStorage.setItem(title, JSON.stringify(bookmark));
      alert("You just saved this place!");
    });

    const footerDeleteBtn = saveOrDeleteBtn(
      "deleteBtn",
      "Delete",
      disabledDelete
    );
    footerDiv.appendChild(footerDeleteBtn);
    footerDeleteBtn.addEventListener("click", () => {
      localStorage.removeItem(title);
      alert("You just deleted this item");
      location.reload();
    });

    return firstDiv;
  } catch (err) {
    console.log(err);
  }
}
// create save and delete buttons
function saveOrDeleteBtn(btnId, btnName, disabled) {
  const Btn = document.createElement("button");
  Btn.setAttribute("type", "button");
  Btn.setAttribute("id", btnId);
  if (disabled === -1) {
    Btn.setAttribute("disabled", "true");
  }
  addClassName(Btn, "btn");
  addClassName(Btn, "btn-primary");
  Btn.textContent = btnName;
  return Btn;
}

// to retrieve saved items
async function showBookMark() {
  const list = document.createElement("ul");
  const main_container = document.querySelector("#main-container");
  main_container.innerHTML = "";
  main_container.appendChild(list);

  for (var i = 0; i < localStorage.length; i++) {
    console.log(localStorage.length);
    const listEle = document.createElement("li");
    const attractionName = JSON.parse(
      localStorage.getItem(localStorage.key(i))
    ).name;
    // console.log(attractionName);
    listEle.textContent = attractionName;
    list.appendChild(listEle);
    const id = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
    const btn = detailsBtnCreator(id);
    listEle.appendChild(btn);
    let modal;
    const objLength = Object.keys(
      JSON.parse(localStorage.getItem(localStorage.key(i)))
    );
    console.log(objLength);

    if (objLength.length < 5) {
      modal = await modalCreator(id, attractionName, -1, 0);
    } else {
      const img = JSON.parse(localStorage.getItem(localStorage.key(i))).img;
      console.log(img);
      const type = JSON.parse(localStorage.getItem(localStorage.key(i))).type;
      const address = JSON.parse(
        localStorage.getItem(localStorage.key(i))
      ).location;
      modal = await modalCreator3(
        id,
        attractionName,
        img,
        address,
        type,
        -1,
        0
      );
    }

    listEle.appendChild(modal);
  }
}

// call api to get data for the modal
async function getImgDescriptionAddressAndWikiLink(id) {
  try {
    const attractionDetailsApi = `${openTripBaseURL}xid/${id}?apikey=${opentripApiKey}`;
    const res = await getAttractionDetail(attractionDetailsApi);
    let url;
    let description;
    if (res.data.hasOwnProperty("preview")) {
      url = res.data.preview.source;
    } else {
      url = "https://source.unsplash.com/random";
    }
    if (res.data.hasOwnProperty("wikipedia_extracts")) {
      description = res.data.wikipedia_extracts.text;
    } else {
      description = `The kinds of this place is: ${res.data.kinds}. Congratulations you find a secret place and we don't have more information about here.`;
    }
    const addressObj = res.data.address;
    const address = `${addressObj.house_number} ${addressObj.road}, ${addressObj.city}, ${addressObj.state} ${addressObj.postcode}`;
    const wikiLink = res.data.wikipedia;
    return [url, description, address, wikiLink];
  } catch (err) {
    console.log(err);
  }
}

// create pop-up modal for restaurants
async function modalCreator3(
  id,
  title,
  urls,
  vicinity,
  type,
  disabledAdd,
  disabledDelete
) {
  const firstDiv = document.createElement("div");
  firstDiv.classList.add("modal");
  firstDiv.classList.add("fade");
  firstDiv.setAttribute("id", id);
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

  const h5Heading = document.createElement("h5");
  h5Heading.classList.add("modal-title");
  h5Heading.classList.add("fs-5");
  h5Heading.setAttribute("id", "exampleModalLabel");
  console.log("title is", title);
  h5Heading.textContent = title;
  fourthDiv.appendChild(h5Heading);

  const closeBtn = document.createElement("button");
  closeBtn.setAttribute("type", "button");
  closeBtn.classList.add("btn-close");
  closeBtn.setAttribute("data-bs-dismiss", "modal");
  closeBtn.setAttribute("aria-label", "Close");
  fourthDiv.appendChild(closeBtn);

  const url = urls;
  const des = type;
  const add = vicinity;

  const cardDiv = CardDivCreatorWithoutWiki(url, des, add);
  thirdDiv.appendChild(cardDiv);

  const footerDiv = document.createElement("div");
  footerDiv.classList.add("modal-footer");
  thirdDiv.appendChild(footerDiv);

  const footerBtn = document.createElement("button");
  footerBtn.setAttribute("type", "button");
  addClassName(footerBtn, "btn");
  addClassName(footerBtn, "btn-secondary");
  footerBtn.setAttribute("data-bs-dismiss", "modal");
  footerBtn.textContent = "Close";
  footerDiv.appendChild(footerBtn);
  // add buttons
  const footerSaveBtn = saveOrDeleteBtn("saveBtn", "Save", disabledAdd);
  footerDiv.appendChild(footerSaveBtn);
  footerSaveBtn.addEventListener("click", () => {
    const bookmark = {
      city: city,
      name: title,
      location: add,
      id: id,
      img: urls,
      type: type,
    };
    localStorage.setItem(title, JSON.stringify(bookmark));
    alert("You just saved this place!");
  });

  const footerDeleteBtn = saveOrDeleteBtn(
    "deleteBtn",
    "Delete",
    disabledDelete
  );
  footerDiv.appendChild(footerDeleteBtn);
  footerDeleteBtn.addEventListener("click", () => {
    localStorage.removeItem(title);
    alert("You just deleted this item");
    location.reload();
  });

  return firstDiv;
}

// create card of modal
function CardDivCreator(imgUrl, description, address, wiki) {
  const cardDiv = document.createElement("div");
  addClassName(cardDiv, "card");
  addClassName(cardDiv, "text-center");

  const image = document.createElement("img");
  addClassName(image, "card-img-top");
  image.setAttribute("src", imgUrl);
  image.setAttribute("height", "300px");
  image.setAttribute("width", "200px");
  cardDiv.appendChild(image);

  const cardBodyDiv = document.createElement("div");
  addClassName(cardBodyDiv, "card-body");
  cardDiv.appendChild(cardBodyDiv);

  const list = document.createElement("ul");
  addClassName(list, "list-group");
  addClassName(list, "list-group-flush");
  cardBodyDiv.appendChild(list);

  const listItem1 = document.createElement("li");
  addClassName(listItem1, "list-group-item");
  listItem1.textContent = description;
  list.appendChild(listItem1);

  const h6Heading = document.createElement("h6");
  h6Heading.textContent = "Address:";
  list.appendChild(h6Heading);

  const listItem2 = document.createElement("li");
  addClassName(listItem2, "list-group-item");
  listItem2.textContent = address;
  list.appendChild(listItem2);

  const wikiBtn = document.createElement("a");
  wikiBtn.setAttribute("href", wiki);
  wikiBtn.setAttribute("target", "_blank");
  addClassName(wikiBtn, "btn");
  addClassName(wikiBtn, "btn-primary");
  wikiBtn.textContent = "Go Wikipedia";
  cardBodyDiv.appendChild(wikiBtn);

  return cardDiv;
}

function CardDivCreatorWithoutWiki(imgUrl, description, address) {
  const cardDiv = document.createElement("div");
  addClassName(cardDiv, "card");
  addClassName(cardDiv, "text-center");

  const image = document.createElement("img");
  addClassName(image, "card-img-top");
  image.setAttribute("src", imgUrl);
  image.setAttribute("height", "300px");
  image.setAttribute("width", "200px");
  cardDiv.appendChild(image);

  const cardBodyDiv = document.createElement("div");
  addClassName(cardBodyDiv, "card-body");
  cardDiv.appendChild(cardBodyDiv);

  const list = document.createElement("ul");
  addClassName(list, "list-group");
  addClassName(list, "list-group-flush");
  cardBodyDiv.appendChild(list);

  const listItem1 = document.createElement("li");
  addClassName(listItem1, "list-group-item");
  listItem1.textContent = description;
  list.appendChild(listItem1);

  const h6Heading = document.createElement("h6");
  h6Heading.textContent = "Address:";
  list.appendChild(h6Heading);

  const listItem2 = document.createElement("li");
  addClassName(listItem2, "list-group-item");
  listItem2.textContent = address;
  list.appendChild(listItem2);

  return cardDiv;
}
