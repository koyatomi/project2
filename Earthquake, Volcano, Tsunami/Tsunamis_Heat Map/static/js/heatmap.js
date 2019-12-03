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

fetch("static/js/data/cleaned_tsunami_data.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      console.log(data);

  var heatArray = [];

  for (var i = 0; i < data.features.length; i++) {
    var location = data.features[i].geometry.coordinates;
    
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
