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

function showAttractionsList() {
  const att = city.slice(0, 3);
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
    const id = attraction.properties.xid;
    const btn = detailsBtnCreator(id);
    listEle.appendChild(btn);
    const modal = await modalCreator(id, attractionName);
    listEle.appendChild(modal);
  }
}

async function getAttractionDetail(api) {
  const res = await axios.get(api);
  return res;
}

function detailsBtnCreator(id) {
  const btn = document.createElement("button");
  btn.textContent = "Details";
  btn.setAttribute("type", "button");
  btn.classList.add("btn");
  btn.classList.add("btn-primary");
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", `#${id}`);
  return btn;
}

async function modalCreator(id, title) {
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
  // debugger;
  h5Heading.textContent = title;
  fourthDiv.appendChild(h5Heading);

  const closeBtn = document.createElement("button");
  closeBtn.setAttribute("type", "button");
  closeBtn.classList.add("btn-close");
  closeBtn.setAttribute("data-bs-dismiss", "modal");
  closeBtn.setAttribute("aria-label", "Close");
  fourthDiv.appendChild(closeBtn);

  const url = await getImg(id);
  const des = await getDescription(id);
  const add = "3342,seattle";

  const cardDiv = CardDivCreator(url, des, add);
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

  return firstDiv;
}

async function getImg(id) {
  const attractionDetailsApi = `${openTripBaseURL}xid/${id}?apikey=${opentripApiKey}`;
  // debugger;
  const res = await getAttractionDetail(attractionDetailsApi);
  let url;

  if (res.data.hasOwnProperty("preview")) {
    url = res.data.preview.source;
  } else {
    // go to unsplash api to get a photo
    url =
      "https://www.adobe.com/content/dam/cc/us/en/creativecloud/file-types/image/raster/jpeg-file/OG-1200x800-jpeg.jpg";
  }
  return url;
}

async function getDescription(id) {
  const attractionDetailsApi = `${openTripBaseURL}xid/${id}?apikey=${opentripApiKey}`;
  // debugger;
  const res = await getAttractionDetail(attractionDetailsApi);
  let des;

  if (res.data.hasOwnProperty("wikipedia_extracts")) {
    des = res.data.wikipedia_extracts.text;
  } else {
    // go to unsplash api to get a photo
    des = "some text";
  }
  return des;
}

function addClassName(ele, className) {
  return ele.classList.add(className);
}

function CardDivCreator(imgUrl, description, address) {
  const cardDiv = document.createElement("div");
  addClassName(cardDiv, "card");
  // cardDiv.setAttribute("style", "width: 18rem;");

  const image = document.createElement("img");
  addClassName(image, "card-img-top");
  image.setAttribute("src", imgUrl);
  cardDiv.appendChild(image);

  // const cardBodyDiv = document.createElement("div");
  // addClassName(cardBodyDiv, "card-body");
  // cardDiv.appendChild(cardBodyDiv);
  const list = document.createElement("ul");
  addClassName(list, "list-group");
  addClassName(list, "list-group-flush");
  cardDiv.appendChild(list);

  const listItem1 = document.createElement("li");
  addClassName(listItem1, "list-group-item");
  listItem1.textContent = description;
  list.appendChild(listItem1);

  const listItem2 = document.createElement("li");
  addClassName(listItem2, "list-group-item");
  listItem2.textContent = address;
  list.appendChild(listItem2);

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
