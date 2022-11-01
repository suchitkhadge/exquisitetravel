const openTripBaseURL = "https://api.opentripmap.com/0.1/en/places/";
const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";
let geo = [];
const radius = 5000;
const rate = 3;
const limit = 10;
// https://api.opentripmap.com/0.1/en/places/autosuggest?name=att&radius=5000&lon=-122.33207&lat=47.60621&rate=3&limit=10&apikey=5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6

// "https://api.opentripmap.com/0.1/en/places/autosuggest?name=att&radius=5000&lon=undefined&lat=undefined&rate=3&limit=10&apikey=5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6"

const attractionsAPi = `${openTripBaseURL}autosuggest?name=att&radius=${radius}&lon=${geo[1]}&lat=${geo[0]}&rate=${rate}&limit=${limit}&apikey=${opentripApiKey}`;

async function callOpenTripApiToGetGeo(api) {
  const response = await axios.get(api);
  const lat = response.data.lat;
  const lon = response.data.lon;
  return [lat, lon];
}

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = user_input.value;
  const openTripAPI = `${openTripBaseURL}geoname?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApiToGetGeo(openTripAPI);
  console.log(geo);
});

// const geo =

async function callOpenTripApiToGetAttractionsList(api) {
  //   const list = document.createElement("ul");
  //   const main_container = document.querySelector("#main-container");
  //   main_container.appendChild(list);
  debugger;
  console.log(geo[0]);
  const response = await axios.get(api);
  const data = response.data.features;
  console.log(data);
  //   for (const attraction of data) {
  //     debugger;
  //     const listEle = document.createElement("li");
  //     listEle.textContent = attraction.properties.name;
  //     list.appendChild(listEle);
  //     const btn = document.createElement("button");
  //     btn.textContent = "Details";
  //     listEle.appendChild(btn);
  //   }
}

attractionBtn.addEventListener("click", async () => {
  debugger;
  await callOpenTripApiToGetAttractionsList(attractionsAPi);
});
