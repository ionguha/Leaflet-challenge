
/************ Function that creates the basemaps & overlay maps */
function createMap(earthquakes, tectonicPlates) {
  // Adding a tile layer (the background map image) to our map
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9", // Using Mapbox style: satellite-v9
    accessToken: API_KEY
  });
  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10", // Using Mapbox style: light-v10
    accessToken: API_KEY
  });
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11", // Using Mapbox style: outdoors-v11
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
    Satellite: satellite,
    Grayscale: grayscale, // Legend Light to select light style
    Outdoors: outdoors, // Legend Outdoors to select outdoors style
    Dark: dark // Legend Dark to select dark style
  };
  // Create overlay object to hold our overlay layer
  const overlayMaps = {
    Earthquakes: earthquakes,
    PlateBoundaries: tectonicPlates
  };

  // Create map object and set default layers
  const myMap = L.map("map", {
    center: [18.0, -18.0],
    zoom: 3,
    layers: [satellite, earthquakes, tectonicPlates] // Default layer is light style
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
      return magnitude * 35000; 
  } else { return 0}
}

// Define a function that runs for each feature in the data
function createFeatures(quakeData, tectonicData) {
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
     // Creating tectonic plates overlay map
     var tectonic_plates = L.geoJSON(tectonicData, {
       style: function(feature){
        return {color: "orange",
                weight: 2};
       },
       onEachFeature: function(feature, layer ){
         // Create a popup that provides detailed description
         popupContent = "<h3>" + feature.properties.Name +
         "</h3><h4> PlateA: " + feature.properties.PlateA + 
         "<br>PlateB:" + feature.properties.PlateB +"</h4> <hr><p>" + 
         feature.properties.Source + "</p>";
        layer.bindPopup(popupContent)
      }
     });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, tectonic_plates);
}

/** Load GeoJSON data from url */
(async function(){
  // Creating the query url for json data
  const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  // Using d3.json method for fetching .json files
  const geo_data = await d3.json(queryUrl);
  // Console log the data
  console.log(geo_data);
  console.log("Number of earthquakes recorded : " + geo_data.features.length);
  // A second data set on your map to illustrate the boundaries of tectonic plates
  const tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  // Using d3.json method for fetching .json files
  const tectonic_data = await d3.json(tectonicUrl);
  // Console log the data
  console.log(tectonic_data);
  console.log("Number of tectonic plate features : " + tectonic_data.features.length); 
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(geo_data.features,tectonic_data.features);
})()

