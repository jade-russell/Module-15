// Fetch data from a remote or local JSON file
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; // Remote URL
// OR
// const earthquakeUrl = "static/data/earthquakes.geojson"; // Local file

// Create a map object
let map = L.map("map").setView([0, 0], 2); // Center at lat=0, lng=0

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Marker size and color functions
function markerSize(magnitude) {
  return magnitude * 4;
}

function markerColor(depth) {
  return depth > 90 ? "red" :
         depth > 70 ? "orange" :
         depth > 50 ? "yellow" :
         depth > 30 ? "green" :
         depth > 10 ? "blue" : "purple";
}

// Fetch data and plot markers
d3.json(earthquakeUrl).then(data => {
  data.features.forEach(feature => {
    const [lon, lat, depth] = feature.geometry.coordinates;
    const magnitude = feature.properties.mag;
    const place = feature.properties.place;

    L.circleMarker([lat, lon], {
      radius: markerSize(magnitude),
      color: markerColor(depth),
      fillOpacity: 0.75
    }).bindPopup(`<h3>${place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`).addTo(map);
  });
});

let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  const grades = [-10, 10, 30, 50, 70, 90];
  const colors = ["purple", "blue", "green", "yellow", "orange", "red"];

  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      `<i style="background:${colors[i]}"></i> ` +
      `${grades[i]}${grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+"}`;
  }
  return div;
};

legend.addTo(map);

const tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonicPlatesUrl).then(data => {
  L.geoJson(data, {
    style: { color: "orange", weight: 2 }
  }).addTo(map);
});