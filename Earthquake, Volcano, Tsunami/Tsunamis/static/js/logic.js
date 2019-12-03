fetch("static/js/data/cleaned_tsunami_data.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      console.log(data);
     
      createFeatures(data.features);
    });

    function createFeatures(tsunamiData) {

      // Defining a function we want to run once for each feature in the features array
      // Giving each feature a popup describing the features of tsunamis
      function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + "Tsunami ID: " + feature.properties.ID + ", Year: " +  feature.properties.YEAR +
          "</h3><hr><p>" + (feature.properties.COUNTRY) + ", Primary Magnitude: " + feature.properties.PRIMARY_MAGNITUDE + "</p>");
      }
    
      // Creating circle markers
    
      function radiusSize(magnitude) {
        return magnitude * 40000;
      }
    
      function circleColor(magnitude) {
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
    
      // Creating a GeoJSON layer containing the features array on the tsunamiData object
      // Running the onEachFeature function once for each piece of data in the array
    
      var tsunamis = L.geoJSON(tsunamiData, {
        pointToLayer: function (tsunamiData, latlng) {
          return L.circle(latlng, { radius: radiusSize(tsunamiData.properties.PRIMARY_MAGNITUDE) });
        },
    
        style: function (geoJsonFeature) {
          return {
            fillColor: circleColor(geoJsonFeature.properties.PRIMARY_MAGNITUDE),
            fillOpacity: 0.6,
            weight: 0.5,
            color: 'black'
          }
    
        },
    
        onEachFeature: onEachFeature
      });
    
    
    
      // Sending our volcano layer to the createMap function
      createMap(tsunamis);
    
    };
    
    function createMap(tsunamis) {
    
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
    
      // Defining a baseMaps object to hold our base layers
      var baseMaps = {
        "Street Map": streetmap,
        "Light Map": lightmap
      };
    
      // Creating overlay object to hold our overlay layer
      var overlayMaps = {
        Tsunamis: tsunamis,
      };
    
      // Creating our map, giving it the streetmap and volcano layers to display on load
      var myMap = L.map("map", {
        center: [
          44.34, 10.12
        ],
        zoom: 2,
        layers: [lightmap, tsunamis]
    
      });
    
      // Creating a layer control
      // Passing in our baseMaps and overlayMaps
      // Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
      }).addTo(myMap);
    
    
      // Creating a legend
    
      function getColor(d) {
        return d > 7 ? '#116d0e' :
          d > 6 ? '#418536' :
            d > 5 ? '#669e59' :
              d > 4 ? '#89b77d' :
                d > 3 ? '#acd0a2' :
                  '#d0eac8';
    
      }
    
      var legend = L.control({ position: "bottomright" });
    
      legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
          magn = [0, 3, 4, 5, 6, 7],
          labels = [];
    
        div.innerHTML += "<h4 style='margin:4px'>P. Magnitude</h4>"
    
        for (var i = 0; i < magn.length; i++) {
          div.innerHTML +=
            '<i style= "background:' + getColor(magn[i] + 1) + '"></i> ' +
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
    
    