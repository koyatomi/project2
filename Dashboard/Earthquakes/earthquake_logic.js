// Storing our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Defining streetmap and lightmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
})
var myMap = L.map("map", {
  center: [
    44.34, 10.12],
  zoom: 2,
  layers: [streetmap]
});
var heat;

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + ", Magnitude: "
    + feature.properties.mag + "</p>");
}
// Creating circle markers
function radiusSize(magnitude) {
  return magnitude * 20000;
}
function circleColor(magnitude) {
  if (magnitude < 1) {
    return "#DAF7A6"
  }
  else if (magnitude < 2) {
    return "#FFC300"
  }
  else if (magnitude < 3) {
    return "#FF5733"
  }
  else if (magnitude < 4) {
    return "#FA0505"
  }
  else {
    return "#900C3F"
  }
};

d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng) {
      return L.circle(latlng, { radius: radiusSize(earthquakeData.properties.mag) });
    },
    style: function (geoJsonFeature) {
      return {
        fillColor: circleColor(geoJsonFeature.properties.mag),
        fillOpacity: 0.6,
        weight: 0.5,
        color: 'black'
      }
    },
    onEachFeature: onEachFeature
  }).addTo(myMap);

  //Heatmap  
  d3.json(queryUrl, response => {
    data = response;
    var heatArray = [];

    for (var i = 0; i < response.features.length; i++) {
      var location = response.features[i].geometry.coordinates;
      if (location) {
        heatArray.push([location[1], location[0]]);
      }
    }
    heat = L.heatLayer(heatArray, {
      radius: 50,
      blur: 4,
      gradient: {
        0.2: 'green',
        0.4: 'yellow',
        0.3: 'red'
      }
    }).addTo(myMap);
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, heat);
  })
};

function createMap(earthquakes, heat) {
  // Defining a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // Creating overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Heatmap: heat
  };
  // Creating a layer control
  // Passing in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Creating a legend
  function getColor(d) {
    return d > 4 ? '#900C3F' :
      d > 3 ? '#FA0505' :
        d > 2 ? '#FF5733' :
          d > 1 ? '#FFC300' :
            '#DAF7A6';
  }

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      magn = [0, 1, 2, 3, 4],
      labels = [];

    div.innerHTML += '<div><b>Magnitude</b></div';
    for (var i = 0; i < magn.length; i++) {
      div.innerHTML += '<i style= "background:' + getColor(magn[i] + 1) + '"></i> ' +
        magn[i] + (magn[i + 1] ? '&ndash;' + magn[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);

  var north = L.control({ position: "bottomleft" });
  north.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info_legend");
    div.innerHTML = '<img src="north-arrow.png">';
    return div;
  }
  north.addTo(myMap);

}

