
/************ Function that creates the basemaps & overlay maps */
function createMap(earthquakes) {
  // Adding a tile layer (the background map image) to our map
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10", // Using Mapbox style: light-v10
    accessToken: API_KEY
  });
  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10", // Using Mapbox style: dark-v10
    accessToken: API_KEY
  });
  // Only one base layer can be shown at a time
  const baseMaps = {
    Light: light, // Legend Light to select light style
    Dark: dark // Legend Dark to select dark style
  };
  // Create overlay object to hold our overlay layer
  const overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create map object and set default layers
  const myMap = L.map("map", {
    center: [37.0902, -98.4842],
    zoom: 5,
    layers: [light, earthquakes] // Default layer is light style
  });
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);
  
  /*** Creating Legend for the leaflet map */
  var legend = L.control({position: 'bottomright'});
  // Create an event of adding legends on map using .onAdd() method
  legend.onAdd = function (myMap) {
      // Create a division using DomUtil & add that to the map
      var div = L.DomUtil.create('div', 'info legend');
      // Top label for the legend
      labels = ['<strong>Magnitude</strong>'],
      categories = ['0-1','1-2','2-3','3-4','4-5','5+'];
      color_values = [0.5,1.5,2.5,3.5,4.5,5.5]
      // HTML element div has styled inside loop having background colour values from MarkerColors() method
      for (var i = 0; i < color_values.length; i++) {

              div.innerHTML += 
              labels.push(
                  '<i style="background:' + MarkerColors(color_values[i]) + '"></i> ' +
              (categories[i] ? categories[i] : '+'));

          }
          div.innerHTML = labels.join('<br>');
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

 // Inserting USGS Logo in the left bottom of the page
  var MyControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function (map) {
      // ** We add the image to the div as a background image using css
      var container = L.DomUtil.create('div', 'my-custom-control');
      return container;
    }
  });
  // Adding the div with logo to myMap
  myMap.addControl(new MyControl());

}

/**** Marker Fill Colors *********** */
function MarkerColors(magnitude){
  return  magnitude > 5  ? '#b30000' :
          magnitude > 4  ? '#ff4000' :
          magnitude > 3  ? '#ff8000' :
          magnitude > 2  ? '#ffbf00' :
          magnitude > 1  ? '#80ff00' :
                           '#00ff00' ;
}
/**** Marker Size proportional to magnitude ******** */
function MarkerSize(magnitude){
  // Filter positive magnitudes, there ARE negative magnitude recordings in the data
  if (magnitude > 0) {
      return magnitude * 17000; 
  } else { return 0}
}

// Define a function that runs for each feature in the data
function createFeatures(quakeData) {
    /**** onEachFeature properties ******** */
    function onEachFeature(feature, layer) {
      // Does this feature have a property ?
      if (feature.properties) {
        // Create a popup that provides detailed description
          popupContent = "<h3>" + feature.properties.place +
          "</h3> <h4> Magnitude: " + feature.properties.mag + "</h4><hr><p>" + 
          new Date(feature.properties.time) + "</p>";
          layer.bindPopup(popupContent,{offset: new L.Point(0, -10)});
      }
    }
    // Creating earthquakes overlay map
    var earthquakes = L.geoJSON(quakeData, {
      pointToLayer: function(quakeData, latlng){
        return L.circle ( latlng,{    
          radius: MarkerSize(quakeData.properties.mag),
          fillColor: MarkerColors(quakeData.properties.mag),
          fillOpacity: 1.0,
          weight: 1,
          color: "black",
          className: 'blinking'
        });
      },
      onEachFeature: onEachFeature
    }); 
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

/** Load GeoJSON data from url */
(async function(){
  // Creating the query url for json data
  const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  // Using d3.json method for fetching .json files
  const data = await d3.json(queryUrl);
  // Console log the data
  console.log(data);
  console.log("Number of earthquakes recorded : " + data.features.length);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
})()

