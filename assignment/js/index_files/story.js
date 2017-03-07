// Defining the value for first slide
var currentData = pageData[1];
var currentPath = currentData.info.features[0];

/* =====================
  Map Setup
===================== */

mapboxgl.accessToken = 'pk.eyJ1IjoibWFha3MiLCJhIjoiY2l6cjRrZDMxMDF4dTM2cWc3eGxsYjU3diJ9.5wHed5clNi25rKFn34ZMXg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/maaks/cizxbj1vs003a2ssj17j2ls5y',
zoom: 12,
center: currentData.center
});

var pathTrack = function(){
  map.on('load', function () {
    console.log(currentData);
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": currentData.info
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#EA1D1D",
            "line-width": 2,
            "line-opacity": 0.2
        }
      });
  });
}
/* =====================
  Turf - moving a point along the path
===================== */
var lengthAlongLines = turf.lineDistance(currentPath, 'kilometers');
var movingMarker = turf.along(currentPath,0, 'kilometers');


var addMovingMarker = function()
{
  map.on('load', function () {

    map.addSource("circleMarker", {
      "type": "geojson",
      "data": movingMarker,
    });

    map.addLayer({
      "id": "circleMarker",
      "type": "circle",
      "source": "circleMarker",
      "layout": {},
      "paint": {
        "circle-radius": 6,
        "circle-color" : "#EA1D1D"
      }
    });

    var step = 0;
    var numSteps = 200; //Change this to set animation resolution
    var timePerStep = 20; //Change this to alter animation speed
    var pointSource = map.getSource('circleMarker');
    var interval = setInterval(function() {
      step += 1;
      if (step < numSteps)  {
        var curDistance = step / numSteps * lengthAlongLines;
        //console.log(curDistance);
        //console.log(lengthAlongLines);
        var movingMarker = turf.along(currentPath, curDistance, 'kilometers');
        pointSource.setData(movingMarker);
        }

      if (step >= numSteps) {
        step = 0;

        }
      }, timePerStep);
    });
  }

/* =====================
  Slides
===================== */

// Map track Upodate

// Function for clicks
var clickFunction = function (i)
{
  $("#header").text(i.head); // Changing Header Information
  $("#paragraph01").text(i.par); // Changing Description
  map.setCenter(i.center); // reset the center of map to new city
  map.setZoom(12); // Just in case User moved around - click will correct the zoom
  lengthAlongLines = turf.lineDistance(currentPath, 'kilometers');
  movingMarker = turf.along(currentPath,0, 'kilometers');
  addMovingMarker(); // moving marker along the path
  pathTrack();
}





// Load first slide
clickFunction(currentData);


// Functions for previous and next clicks
var previousClick = function()
{
    var i = currentData.number-2;
    var len = pageData.length

    if ((len -i)<= len ) {
      currentData= pageData[i];
      currentPath = currentData.info.features[0];
      clickFunction(currentData);
      //console.log(currentPath);
      map.getSource('route').setData(currentPath);
      //var source = map.getSource('route')
      //console.log(source._data.geometry);

    }

    else if ((len-i)> len) {
      currentData = pageData[5];
      currentPath = currentData.info.features[0];
      clickFunction(currentData);
      map.getSource('route').setData(currentPath);
    }
}

var nextClick = function()
{
    var i = currentData.number;
    var len = (pageData.length-1)
    if ((len -i)>=0) {
      currentData = pageData[i];
      currentPath = currentData.info.features[0];
      clickFunction(currentData);
      map.getSource('route').setData(currentPath);

    }

    else if ((len-i)< 0) {
      currentData = pageData[0];
      currentPath = currentData.info.features[0];
      clickFunction(currentData);
      map.getSource('route').setData(currentPath);
    }
}
