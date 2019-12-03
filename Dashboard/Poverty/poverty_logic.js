// Storing our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var queryUrl2 = "https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/7234d067-2d74-449a-9c61-22ae6d98d928/download/volcano.json";

// Defining streetmap and lightmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets-basic",
//   accessToken: API_KEY
// })
// Creating our map, giving it the streetmap and overlay layers to display on load
var myMap = L.map("map", {
  center: [44.34, 10.12],
  zoom: 2,
  layers: [streetmap]
});

var geoData = "static/data/custom.geo.json";
var povertyData = "/api/poverty";

var povertyjson;

// Grab data with d3
d3.json(povertyData, function (data) {
  d3.json(geoData, function (mapdata) {

    var mapFeatures = mapdata.features;
    var povertyFeatures = data.features;

    var mapDictionary = {};

    mapFeatures.forEach((curFeature, curIndex) => {
      mapDictionary[curFeature.properties.name] = curIndex;
    });
    console.log("mapDictionary", mapDictionary);
    povertyFeatures.forEach((curFeature) => {
      var country = curFeature.properties.Entity;
      var year = curFeature.properties.Year;
      var percentage = curFeature.properties.Percentage;

      var countryIndex = mapDictionary[country];
      // mapFeatures[countryIndex].properties.povertyPercentage = 0;
      if (countryIndex >= 0) {
        mapFeatures[countryIndex].properties.year = year;
        mapFeatures[countryIndex].properties.povertyPercentage = percentage;
      }
    })
    console.log("mapFeatures[1]", mapFeatures[1]);

    // Create a new choropleth layer
    povertyjson = L.choropleth(mapdata, {

      // Define what  property in the features to use
      valueProperty: "povertyPercentage",

      // Set color scale
      scale: ["#00876c", "#d43d51"],

      // Number of breaks in step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Country: " + feature.properties.Entity + "<br>Percent Poverty:<br>" +
          feature.properties.Percentage + "%");
      }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = povertyjson.options.limits;
      var colors = povertyjson.options.colors;
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Extreme Poverty</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
  });
})

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + ", Earthquake Mag.: "
    + feature.properties.mag + "</p>");
}

function onEachFeature2(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.Country +
    "</h3><hr><p>" + (feature.properties.V_Name) + ", Pop. Exposure Index: " +
    feature.properties.PEI + "</p>");
}

function onEachFeature3(feature, layer) {
  layer.bindPopup("<h3>" + "Tsunami ID: " + feature.properties.ID + ", Year: " +
    feature.properties.YEAR + "</h3><hr><p>" + (feature.properties.COUNTRY) + ", Tsunami Mag.: " +
    feature.properties.PRIMARY_MAGNITUDE + "</p>");
}

// Creating circle markers
function radiusSize(magnitude) {
  return magnitude * 20000;
}

function radiusSize2(magnitude) {
  return magnitude * 40000;
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

function circleColor2(magnitude) {
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

function circleColor3(magnitude) {
  if (magnitude < 3) {
    return "#d0eac8"
  }
  else if (magnitude < 4) {
    return "#acd0a2"
  }
  else if (magnitude < 5) {
    return "#89b77d"
  }
  else if (magnitude < 6) {
    return "#669e59"
  }
  else if (magnitude < 7) {
    return "#418536"
  }
  else {
    return "#116d0e"
  }
};

// function getColor(d) {
//   return d > 4 ? '#900C3F' :
//     d > 3 ? '#FA0505' :
//       d > 2 ? '#FF5733' :
//         d > 1 ? '#FFC300' :
//           '#DAF7A6';
// }
// function getColor2(d) {
//   return d > 7 ? '#000080' :
//     d > 6 ? '#01579B' :
//       d > 5 ? '#0288D1' :
//         d > 4 ? '#03A9F4' :
//           d > 3 ? '#4FC3F7' :
//             '#B3E5FC';
// }
// function getColor3(d) {
//   return d > 7 ? '#116d0e' :
//     d > 6 ? '#418536' :
//       d > 5 ? '#669e59' :
//         d > 4 ? '#89b77d' :
//           d > 3 ? '#acd0a2' :
//             '#d0eac8';
// }

// Performing a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);

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
    createMap(earthquakes);
  }
});

d3.json(queryUrl2, function (data) {
  createFeatures(data.features);

  function createFeatures(volcanoData) {
    var volcanos = L.geoJSON(volcanoData, {
      pointToLayer: function (volcanoData, latlng) {
        return L.circle(latlng, { radius: radiusSize2(volcanoData.properties.PEI) });
      },
      style: function (geoJsonFeature) {
        return {
          fillColor: circleColor2(geoJsonFeature.properties.PEI),
          fillOpacity: 0.6,
          weight: 0.5,
          color: 'black'
        }
      },
      onEachFeature: onEachFeature2
    }).addTo(myMap);
    createMap(volcanos);
  }
});

fetch("../Tsunami/data/cleaned_tsunami_data.json")
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    createFeatures(data.features);
  });

  function createFeatures(tsunamiData) {
    var tsunamis = L.geoJSON(tsunamiData, {
      pointToLayer: function (tsunamiData, latlng) {
        return L.circle(latlng, { radius: radiusSize2(tsunamiData.properties.PRIMARY_MAGNITUDE) });
      },
      style: function (geoJsonFeature) {
        return {
          fillColor: circleColor3(geoJsonFeature.properties.PRIMARY_MAGNITUDE),
          fillOpacity: 0.6,
          weight: 0.5,
          color: 'black'
        }
      },
      onEachFeature: onEachFeature3
    }).addTo(myMap);
    createMap(tsunamis);
  };
;

function createMap(earthquakes, volcanos, tsunamis) {
  // Defining a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Creating overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Volcanos: volcanos,
    Tsunamis: tsunamis
  };
  // Creating a layer control
  // Passing in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Creating a legend
<<<<<<< HEAD
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      magE = [0, 1, 2, 3, 4];

    div.innerHTML2 += '<div><b>EqMagnitude</b></div';
    for (var i = 0; i < magE.length; i++) {
      div.innerHTML += '<i style= "background:' + getColor(magE[i] + 1) + '"></i> ' +
        magE[i] + (magE[i + 1] ? '&ndash;' + magE[i + 1] + '<br>' : '+');
    }
    return div;
  }.addTo(myMap);

  var legend2 = L.control({ position: "bottomleft" });
  legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend2'),
      magV = [0, 3, 4, 5, 6, 7];

    div.innerHTML += '<div><b>Pop. Expose Index</b></div';
    for (var i = 0; i < magV.length; i++) {
      div.innerHTML += '<i style= "background:' + getColor2(magV[i] + 1) + '"></i> ' +
        magV[i] + (magV[i + 1] ? '&ndash;' + magV[i + 1] + '<br>' : '+');
    }
    return div;
  }.addTo(myMap);

  var legend3 = L.control({ position: "bottomcenter" });
  legend3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend3'),
      magT = [0, 3, 4, 5, 6, 7];

    div.innerHTML += "<h4 style='margin:4px'>Tsunami Mag.</h4>"

    for (var i = 0; i < magT.length; i++) {
      div.innerHTML += '<i style= "background:' + getColor3(magT[i] + 1) + '"></i> ' +
        magT[i] + (magT[i + 1] ? '&ndash;' + magT[i + 1] + '<br>' : '+');
    }
    return div;
  }.addTo(myMap);
};

var geoData = "data/custom.geo.json";

var povertyData = "data/poverty_data.json";

var povertyjson;

// Grab data with d3
d3.json(povertyData).then(function (data) {
  d3.json(geoData).then(function (response) {
    console.log(response);
    var mapdata = response;
    var mapFeatures = mapdata.features;
    var povertyFeatures = data.features;

    var mapDictionary = {};

    mapFeatures.forEach((curFeature, curIndex) => {
      mapDictionary[curFeature.properties.name] = curIndex;
    });
    console.log("mapDictionary", mapDictionary);
    povertyFeatures.forEach((curFeature) => {
      var country = curFeature.properties.Entity;
      var year = curFeature.properties.Year;
      var percentage = curFeature.properties.Percentage;
      var countryIndex = mapDictionary[country];
      if (curFeature.properties.Percentage === undefined) {
        percentage = 0;
      }
      // mapFeatures[countryIndex].properties.povertyPercentage = 0;
      if (countryIndex >= 0) {
        mapFeatures[countryIndex].properties.year = year;
        mapFeatures[countryIndex].properties.povertyPercentage = percentage;
      }
    })
    mapFeatures.forEach((presFeature) => {
      if (presFeature.properties.povertyPercentage === undefined) {
        presFeature.properties.povertyPercentage = 0;
      }
    }
    )
    console.log("mapFeatures[1]", mapFeatures[1]);

    // Create a new choropleth layer
    povertyjson = L.choropleth(mapdata, {

      // Define what  property in the features to use
      valueProperty: "povertyPercentage",

      // Set color scale
      scale: ["#00876c", "#d43d51"],

      // Number of breaks in step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        console.log(feature.properties);
        layer.bindPopup("Country: " + feature.properties.name + "<br>Percent Poverty:<br>" +
          feature.properties.povertyPercentage + "%");
      }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = povertyjson.options.limits;
      var colors = povertyjson.options.colors;
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Extreme Poverty</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

  });



})
=======
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function (map) {
  //   var div = L.DomUtil.create('div', 'info_legend'),
  //     magE = [0, 1, 2, 3, 4];

  //   div.innerHTML += '<div><b>Earthquake Mag</b></div';
  //   for (var i = 0; i < magE.length; i++) {
  //     div.innerHTML += '<i style= "background:' + getColor(magE[i] + 1) + '"></i> ' +
  //       magE[i] + (magE[i + 1] ? '&ndash;' + magE[i + 1] + '<br>' : '+');
  //   }
  //   return div;
  // }
  // legend.addTo(myMap);

  // var legend2 = L.control({ position: "bottomleft" });
  // legend2.onAdd = function (map) {
  //   var div = L.DomUtil.create('div', 'info_legend2'),
  //     magV = [0, 3, 4, 5, 6, 7];

  //   div.innerHTML += '<div><b>Pop. Expose Index</b></div';
  //   for (var i = 0; i < magV.length; i++) {
  //     div.innerHTML += '<i style= "background:' + getColor2(magV[i] + 1) + '"></i> ' +
  //       magV[i] + (magV[i + 1] ? '&ndash;' + magV[i + 1] + '<br>' : '+');
  //   }
  //   return div;
  // }
  // legend2.addTo(myMap);

  // var legend3 = L.control({ position: "topleft" });
  // legend3.onAdd = function (map) {
  //   var div = L.DomUtil.create('div', 'info_legend3'),
  //     magT = [0, 3, 4, 5, 6, 7];

  //   div.innerHTML += "<div><b>Tsunami Mag</b></div";
  //   for (var i = 0; i < magT.length; i++) {
  //     div.innerHTML += '<i style= "background:' + getColor3(magT[i] + 1) + '"></i> ' +
  //       magT[i] + (magT[i + 1] ? '&ndash;' + magT[i + 1] + '<br>' : '+');
  //   }
  //   return div;
  // }
  // legend3.addTo(myMap);
};
>>>>>>> e863d106f4f59f961f96ceb91424261eb2aa438c
