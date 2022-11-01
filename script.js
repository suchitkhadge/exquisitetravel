// Get google map

function getGoogleMap(){
    let mapApi = 'https://maps.googleapis.com/maps/api/staticmap?center=${latitude}&zoom=8&size=400x400&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc';
    let img1 = document.createElement('img');
        img1_src = 'https://maps.googleapis.com/maps/api/staticmap?center=seattle&zoom=8&size=400x400&key=AIzaSyC4qkDl4YCkSCxSe1xwLOxSa5T2W8QWyFc';
          img1.setAttribute("src", img1_src);
          img1.setAttribute("width", "200px");
          img1.setAttribute("height", "200px");
            content.appendChild(img1);

}

getGoogleMap();