// Creating map object
var myMap = L.map("map", {
  center: [44.34, 10.12],
  zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);
// get the data

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


