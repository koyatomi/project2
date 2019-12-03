// Storing our API endpoint inside queryUrl
var queryUrl = "https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/7234d067-2d74-449a-9c61-22ae6d98d928/download/volcano.json";

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
// Creating our map, giving it the streetmap and volcano layers to display on load
var myMap = L.map("map", {
  center: [44.34, 10.12],
  zoom: 2,
  layers: [lightmap]
});
var heat;

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.Country +
    "</h3><hr><p>" + (feature.properties.V_Name) + ", Popl. Exposure Index: " +
    feature.properties.PEI + "</p>");
}
// Creating circle markers
function radiusSize(magnitude) {
  return magnitude * 40000;
}
function circleColor(magnitude) {
  if (magnitude < 3) {
    return "#B3E5FC"
  }
  else if (magnitude < 4) {
    return "#4FC3F7"
  }
  else if (magnitude < 5) {
    return "#03A9F4"
  }
  else if (magnitude < 6) {
    return "#0288D1"
  }
  else if (magnitude < 7) {
    return "#01579B"
  }
  else {
    return "#000080"
  }
};

// Performing a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(volcanoData) {
  var volcanos = L.geoJSON(volcanoData, {
    pointToLayer: function (volcanoData, latlng) {
      return L.circle(latlng, { radius: radiusSize(volcanoData.properties.PEI) });
    },
    style: function (geoJsonFeature) {
      return {
        fillColor: circleColor(geoJsonFeature.properties.PEI),
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
      radius: 60,
      blur: 6,
      gradient: {
        0.2: 'green',
        0.4: 'yellow',
        0.3: 'red'
      }
    }).addTo(myMap);
    createMap(volcanos, heat);
  })
};
// Sending our volcano layer to the createMap function
function createMap(volcanos, heat) {
  // Defining a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // Creating overlay object to hold our overlay layer
  var overlayMaps = {
    Volcanos: volcanos,
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
    return d > 7 ? '#000080' :
      d > 6 ? '#01579B' :
        d > 5 ? '#0288D1' :
          d > 4 ? '#03A9F4' :
            d > 3 ? '#4FC3F7' :
              '#B3E5FC';
  }

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      magn = [0, 3, 4, 5, 6, 7],
      labels = [];

    div.innerHTML += '<div><b>Pop. Expose Index</b></div';
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

