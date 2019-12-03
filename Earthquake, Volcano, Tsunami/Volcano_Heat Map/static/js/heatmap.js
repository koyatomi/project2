var myMap = L.map("map", {
  center: [44.34, 10.12],
  zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/7234d067-2d74-449a-9c61-22ae6d98d928/download/volcano.json";
// var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";

d3.json(url, response => {
  console.log(response);
  data = response;
  var heatArray = [];

  for (var i = 0; i < response.features.length; i++) {
    var location = response.features[i].geometry.coordinates;
    
    console.log(location)

    if (location) {
      heatArray.push([location[1], location[0]]);
    }
  }
  
  var heat = L.heatLayer(heatArray, {
    radius: 60,
    blur: 6,
    gradient: {
      0.2: 'green',
      0.4: 'yellow',
      0.3: 'red'
  }
  }).addTo(myMap);

  var north = L.control({ position: "bottomright" });
  north.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info_legend");
    div.innerHTML = '<img src="north-arrow.png">';
    return div;
  }
  north.addTo(myMap);

});
