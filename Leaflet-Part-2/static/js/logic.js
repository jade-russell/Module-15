// First, we create our base map
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
  // Create the map object
  let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
  });
  
  // Add the base map layer to the map
  basemap.addTo(map);
  
  // This function determines the color of the marker based on the depth
  function getColor(depth) {
    if (depth > 90) {
      return "#ea2c2c";
    } else if (depth > 70) {
      return "#ea822c";
    } else if (depth > 50) {
      return "#ee9c00";
    } else if (depth > 30) {
      return "#eecc00";
    } else if (depth > 10) {
      return "#d4ee00";
    } else {
      return "#98ee00";
    }
  }
  
  // This function determines the radius of the marker based on magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  
  // This function returns the style data for each earthquake
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  
  // Get the earthquake data and create the visualization
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    // Create a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: " + feature.properties.mag +
          "<br>Depth: " + feature.geometry.coordinates[2] +
          "<br>Location: " + feature.properties.place
        );
      }
    }).addTo(map);
  
    // Create a legend
    let legend = L.control({
      position: "bottomright"
    });
  
    // Add the details for the legend
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // Generate the HTML for the legend
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Add the legend to the map
    legend.addTo(map);
  });