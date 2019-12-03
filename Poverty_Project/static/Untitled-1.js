

	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(map);


	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
			: 'Hover over a state');
	};

	info.addTo(map);


	// get color depending on population density value
	function getColor(d) {
		return d > 1000 ? '#800026' :
				d > 500  ? '#BD0026' :
				d > 200  ? '#E31A1C' :
				d > 100  ? '#FC4E2A' :
				d > 50   ? '#FD8D3C' :
				d > 20   ? '#FEB24C' :
				d > 10   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 50, 100, 200, 500, 1000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);

// d3.csv("static/data/poverty.csv", function (error, data) {
// 	if (error) throw error;
// 	console.log(data);
// 	//format data if required...
// 	//draw chart
// });


// d3.csv("static/data/poverty.csv", function(data) {
//     for (var i = 0; i < data.length; i++) {
//         console.log(data[i].Name);
//         console.log(data[i].Age);
//     }
// });
// d3.csv("static/data/poverty.csv")

// 	.then(function (data) {
// 		var povertydata = data.map(d => {
// 			return {
// 				entity: d.Entity,
// 				code: d.Code,
// 				year: +d.Year,
// 				percentage: +d.Percentage
// 			}
// 		});
// console.log(povertydata)
// Create a new choropleth layer
// console.log(data)
// var url = "postgres://mzedobeawmveaa:6988c0251dcc5057de82f185f796d31c7a7d58a94c7245ffa687ed1db2d41cfc@ec2-107-21-226-44.compute-1.amazonaws.com";

// d3.json(url, response => {
// 	console.log(response);
// 	data = response;
// 	var heatArray = [];

// 	for (var i = 0; i < response.features.length; i++) {
// 		var location = response.features[i].geometry.coordinates;

// 		console.log(location)

// 		if (location) {
// 			heatArray.push([location[1], location[0]]);
// 		}
// 	}

// 	var heat = L.heatLayer(heatArray, {
// 		radius: 60,
// 		blur: 6,
// 		gradient: {
// 			90: "#00876c",
// 			80: "#459e70",
// 			70: "#72b373",
// 			60: "#9fc878",
// 			50: "#cedc80",
// 			40: "#ffee8c",
// 			30: "#fdcd70",
// 			20: "#f9ab5c",
// 			10: "#f18851",
// 			5: "#e5644e",
// 			0: "#d43d51"
// 		}
// 	}).addTo(myMap);

// 	var north = L.control({ position: "bottomright" });
// 	north.onAdd = function (map) {
// 		var div = L.DomUtil.create("div", "info_legend");
// 		div.innerHTML = '<img src="north-arrow.png">';
// 		return div;
// 	}
// 	north.addTo(myMap);
// });
// 	d3.json(url, function (geojson) {
//       geojson = L.choropleth(data, {

//         // Define what  property in the features to use
//         valuePercentage: "Percentage",

//         // Set color scale
//         scale: ["#ffffb2", "#b10026"],

//         // Number of breaks in step range
//         steps: 10,

//         // q for quartile, e for equidistant, k for k-means
//         mode: "q",
//         style: {
//           // Border color
//           color: "#fff",
//           weight: 1,
//           fillOpacity: 0.8
//         },

//         // Binding a pop-up to each layer
//         onEachFeature: function (feature, layer) {
//           layer.bindPopup("Country: " + feature.properties.entity + "<br>Share of the population living with less than $3.10 international per day:<br>" +
//             "%" + feature.properties.valuePercentage);
//         }
//       }).addTo(myMap)
//     });
//   });
//   var info = L.control();

// 	info.onAdd = function (map) {
// 		this._div = L.DomUtil.create('div', 'info');
// 		this.update();
// 		return this._div;
// 	};

// 	info.update = function (props) {
// 		this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
// 			'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
// 			: 'Hover over a state');
// 	};

// 	info.addTo(map);


// 	// get color depending on population density value
// 	function getColor(d) {
// 		return d > 60 ? '#800026' :
// 				d > 50  ? '#BD0026' :
// 				d > 40  ? '#E31A1C' :
// 				d > 30  ? '#FC4E2A' :
// 				d > 20   ? '#FD8D3C' :
// 				d > 10   ? '#FEB24C' :
// 				d > 5   ? '#FED976' :
// 							'#FFEDA0';
// 	}

// 	function style(feature) {
// 		return {
// 			weight: 2,
// 			opacity: 1,
// 			color: 'white',
// 			dashArray: '3',
// 			fillOpacity: 0.7,
// 			fillColor: getColor(feature.properties.density)
// 		};
// 	}

// 	function highlightFeature(e) {
// 		var layer = e.target;

// 		layer.setStyle({
// 			weight: 5,
// 			color: '#666',
// 			dashArray: '',
// 			fillOpacity: 0.7
// 		});

// 		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
// 			layer.bringToFront();
// 		}

// 		info.update(layer.feature.properties);
// 	}

// 	var geojson;

// 	function resetHighlight(e) {
// 		geojson.resetStyle(e.target);
// 		info.update();
// 	}

// 	function zoomToFeature(e) {
// 		map.fitBounds(e.target.getBounds());
// 	}

// 	function onEachFeature(feature, layer) {
// 		layer.on({
// 			mouseover: highlightFeature,
// 			mouseout: resetHighlight,
// 			click: zoomToFeature
// 		});
// 	}

// 	geojson = L.geoJson(statesData, {
// 		style: style,
// 		onEachFeature: onEachFeature
// 	}).addTo(map);

// 	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


// 	var legend = L.control({position: 'bottomright'});

// 	legend.onAdd = function (map) {

// 		var div = L.DomUtil.create('div', 'info legend'),
// 			grades = [0, 10, 20, 50, 100, 200, 500, 1000],
// 			labels = [],
// 			from, to;

// 		for (var i = 0; i < grades.length; i++) {
// 			from = grades[i];
// 			to = grades[i + 1];

// 			labels.push(
// 				'<i style="background:' + getColor(from + 1) + '"></i> ' +
// 				from + (to ? '&ndash;' + to : '+'));
// 		}

// 		div.innerHTML = labels.join('<br>');
// 		return div;
// 	};

// 	legend.addTo(map);

  //   // Set up the legend
  //   var legend = L.control({ position: "bottomright" });
  //   legend.onAdd = function () {
  //     var div = L.DomUtil.create("div", "info legend");
  //     var limits = geojson.options.limits;
  //     var colors = geojson.options.colors;
  //     var labels = [];

  //     // Add min & max
  //     var legendInfo = "<h1>Percentage of Population in Poverty</h1>" +
  //       "<div class=\"labels\">" +
  //       "<div class=\"min\">" + limits[0] + "</div>" +
  //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //       "</div>";

  //     div.innerHTML = legendInfo;

  //     limits.forEach(function (limit, index) {
  //       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //     });

  //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //     return div;
  //   };

  //   // Adding legend to the map
  //   legend.addTo(myMap);

  // })
  // .catch(function (error) {
  //   console.log(error);
  // });



