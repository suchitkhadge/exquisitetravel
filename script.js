const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const BaseURLGoogle = "https://maps.googleapis.com/maps/api/staticmap?";
const googleMapApiKey = "AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc";
const openWeatherBaseURL = "https://api.openweathermap.org/data/3.0/onecall?";
const openWeatherApiKey = "bee1ae44576d679f5012d45660e1473a";

const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
let geo = [];
const radius = 10000;
const rate = 3;
const limit = 10;
let city;

function addClassName(ele, className) {
  return ele.classList.add(className);
}

async function callOpenTripApiToGetGeo(api) {
  try {
    const response = await axios.get(api);
    const lat = response.data.lat;
    const lon = response.data.lon;
    return [lat, lon];
  } catch (err) {
    console.log(err);
  }
}

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  city = user_input.value;
  const openTripAPI = `${openTripBaseURL}geoname?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApiToGetGeo(openTripAPI);
  getGoogleMap(city);
  attractionBtn.addEventListener("click", showAttractionsList);

  weatherBtn.addEventListener("click", showWeather);
});

function showWeather() {
  fetch(
    `${openWeatherBaseURL}lat=${geo[0]}&lon=${geo[1]}&appid=${openWeatherApiKey}`
  )
    .then((response) => response.json())
    .then((data) => console.log(data))

    .catch((err) => console.log("City not found!"));
}

function showAttractionsList() {
  const att = city.slice(0, 3);
  const attractionsAPi = `${openTripBaseURL}radius?radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&src_attr=wikidata&kinds=amusements%2Cinteresting_places&rate=${rate}&apikey=${opentripApiKey}&limit=${limit}&SameSite=None`;
  callOpenTripApiToGetAttractionsList(attractionsAPi);
}

async function callOpenTripApiToGetAttractionsList(api) {
  try {
    const list = document.createElement("ul");
    const main_container = document.querySelector("#main-container");
    main_container.innerHTML = "";
    main_container.appendChild(list);

    console.log(geo[0]);
    const response = await axios.get(api);
    const data = response.data.features;
    console.log(data);
    for (const attraction of data) {
      const listEle = document.createElement("li");
      const attractionName = attraction.properties.name;
      listEle.textContent = attractionName;
      list.appendChild(listEle);
      const id = attraction.properties.xid;
      const btn = detailsBtnCreator(id);
      listEle.appendChild(btn);
      const modal = await modalCreator(id, attractionName);
      listEle.appendChild(modal);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getAttractionDetail(api) {
  try {
    const res = await axios.get(api);
    return res;
  } catch (err) {
    console.log(err);
  }
}

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

async function modalCreator(id, title) {
  try {
    const firstDiv = document.createElement("div");
    addClassName(firstDiv, "modal");
    addClassName(firstDiv, "fade");
    firstDiv.setAttribute("id", id);
    firstDiv.setAttribute("tabindex", "-1");
    firstDiv.setAttribute("aria-labelledby", "exampleModalLabel");
    firstDiv.setAttribute("aria-hidden", "true");

    const secDiv = document.createElement("div");
    addClassName(secDiv, "modal-dialog");
    firstDiv.appendChild(secDiv);

    const thirdDiv = document.createElement("div");
    addClassName(thirdDiv, "modal-content");
    // thirdDiv.classList.add("modal-content");
    secDiv.appendChild(thirdDiv);

    const fourthDiv = document.createElement("div");
    addClassName(fourthDiv, "modal-header");
    // fourthDiv.classList.add("modal-header");
    thirdDiv.appendChild(fourthDiv);

    const h5Heading = document.createElement("h5");
    addClassName(h5Heading, "modal-title");
    addClassName(h5Heading, "fs-5");

    // h5Heading.classList.add("modal-title");
    // h5Heading.classList.add("fs-5");
    h5Heading.setAttribute("id", "exampleModalLabel");
    console.log("title is", title);
    // debugger;
    h5Heading.textContent = title;
    fourthDiv.appendChild(h5Heading);

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("type", "button");
    addClassName(closeBtn, "btn-close");
    // closeBtn.classList.add("btn-close");
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
    // footerDiv.classList.add("modal-footer");
    thirdDiv.appendChild(footerDiv);

    const footerBtn = document.createElement("button");
    footerBtn.setAttribute("type", "button");
    addClassName(footerBtn, "btn");
    addClassName(footerBtn, "btn-secondary");
    footerBtn.setAttribute("data-bs-dismiss", "modal");
    footerBtn.textContent = "Close";
    footerDiv.appendChild(footerBtn);

    return firstDiv;
  } catch (err) {
    console.log(err);
  }
}

async function getImgDescriptionAddressAndWikiLink(id) {
  try {
    const attractionDetailsApi = `${openTripBaseURL}xid/${id}?apikey=${opentripApiKey}`;
    // debugger;
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

async function getAddress(id) {
  try {
    const attractionDetailsApi = `${openTripBaseURL}xid/${id}?apikey=${opentripApiKey}`;
    // debugger;
    const res = await getAttractionDetail(attractionDetailsApi);
    const addressObj = res.data.address;
    const address = `${addressObj.house_number} ${addressObj.road}, ${addressObj.city}, ${addressObj.state} ${addressObj.postcode}`;
    return address;
  } catch (err) {
    console.log(err);
  }
}

function CardDivCreator(imgUrl, description, address, wiki) {
  const cardDiv = document.createElement("div");
  addClassName(cardDiv, "card");
  addClassName(cardDiv, "text-center");
  // cardDiv.setAttribute("style", "width: 18rem;");

  const image = document.createElement("img");
  addClassName(image, "card-img-top");
  image.setAttribute("src", imgUrl);
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

function getGoogleMap(city) {
  let cityMap = document.createElement("img");

  let cityMapSrc = `${BaseURLGoogle}center=${city}&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&zoom=8&size=500x500&key=${googleMapApiKey}`;

  cityMap.setAttribute("src", cityMapSrc);

  cityMap.setAttribute("width", "400px");

  cityMap.setAttribute("height", "400px");

  document.getElementById("main-container").innerHTML = "";

  document.getElementById("main-container").appendChild(cityMap);
}
