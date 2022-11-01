const BaseURL = "https://api.opentripmap.com/0.1/en/places/geoname";

const opentripApiKey =
  "5ae2e3f221c38a28845f05b697184d3cd9ee672b578170059a3aa7e6";

let geo = [];

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = user_input.value;
  const openTripAPI = `${BaseURL}?&name=${city}&apikey=${opentripApiKey}`;
  geo = await callOpenTripApi(openTripAPI);
  console.log(geo);
});

async function callOpenTripApi(api) {
  const response = await axios.get(api);
  const lat = response.data.lat;
  const lon = response.data.lon;
  return [lat, lon];
}
