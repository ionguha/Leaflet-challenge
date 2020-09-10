![Earthquake_Map](https://static.sciencelearn.org.nz/images/images/000/000/351/full/EQS_IPP_ITV_Plate_boundaries_USGS.jpg?1522293997)
https://www.sciencelearn.org.nz/images/351-plate-boundaries
# Leaflet-challenge
### Visualizing earthquakes around the world using USGS database
It was my first day at USGS, and my manager was showing me their brand new facility. With a coffee mug in his hand he bellowed: "_Welcome to the **United States Geological Survey**, or **USGS** for short! The **USGS** is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Our scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes. As a new hire, you will be helping them out with an exciting new project!. We collect a massive amount of data from all over the world each day, but lack a meaningful way of displaying it. Our hope is that being able to visualize this data will allow us to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet."_ I was excited to show them my skills in HTML and Javascript and quickly went into action. I divided the project in two levels as described below:
#### Level 1: Basic Visualization
* **My Data Set** The USGS provides earthquake data in a number of different formats, updated every 5 minutes. I visited the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and picked a data set (**_"All Earthquakes from the Past 7 Days"_**) to visualize. Clicking on the a data set, I got the URL of the JSON representation of the data to pull in for our visualization.
* **Visualize the Data** I create a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.
   * The data markers reflect the magnitude of the earthquake in their size and color. 
   * Earthquakes with higher magnitudes appear larger and darker in color.
   * Included popups that provide additional information about the earthquake when a marker is clicked.
   * Created a legend that provides context for your map data.

#### Level 2: More Data
* **My Data Set** The USGS wanted me to plot a second data set on my map to illustrate the relationship between tectonic plates and seismic activity. I pulled in a second data set to visualize it along side my original set of data. Data on tectonic plates was sourced from <https://github.com/fraxen/tectonicplates>.
* **Visualize the Data** I plotted the second set of data on my map to show the relationship between tectonic plates and earthquakes
   * Added a number of base maps (like satelite, outdoor, greyscale and dark) to choose from. 
   * Tectonic plate boundaries and earthquake maps were added as overlays.
   * Included popups that provide additional information about the plate boundary.
   * With layer controls the map can be visualized in a number of ways.
