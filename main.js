var map = L.map('map').setView([49.7447656, 13.3752194], 3);
var newPolygon;
var newPoint;
var grid;
var newPoints = [];
var geoApiUrl = "http://geoapi.pya.cz"

getTiles = function(source){
    return L.tileLayer(source, {}).addTo(map);
}

var tiles = getTiles('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

setMapSource = function(){
    map.removeLayer(tiles);
    tiles = getTiles(document.getElementById("mapSource").value)
}

setApiUrl = function(){
    geoApiUrl = document.getElementById("apiUrl").value;
}

removeGrid = function(){
    grid.forEach(function(e){map.removeLayer(e)});
    grid = [];
}

updateGrid = function(){
    removeGrid();
    setGrid(Number(document.getElementById("grid").value))
}

ArrayRemove = function(a, e){
    while (true) {
        index = a.indexOf(e);
        if (index > -1) a.splice(index, 1);
        else break;
    }
    return a;
}

createNewPolygon = function(){
    rmPolygon();
    polygon = document.getElementById("newPolygonStr").value
    var polygon2 = [];
    regexp = /\(([^()]+)\)/g;
    var results;
    while( results = regexp.exec(polygon) ) polygon2.push(results[1]);
    polygon = [];
    polygon2[0].split(",").forEach(function(e){
        coords = ArrayRemove(e.split(" "), "");
        polygon.push([Number(coords[1]), Number(coords[0])]);
    });
    // polygon is list of points
    newPolygon = L.polygon(polygon, {weight:1, color:"red"}).addTo(map);
}

rmPolygon = function(){
    if (newPolygon) map.removeLayer(newPolygon);
}

createNewPoint = function(){
    rmPoint();
    point = document.getElementById("newPointStr").value
    point = point.substring(point.indexOf("(")+1, point.indexOf(")")).split(" ");
    newPoint = L.circleMarker([Number(point[1]), Number(point[0])], {radius:5, color:"red"}).addTo(map);
}

rmPoints = function(){
    if (newPoints) newPoints.forEach(function(e){map.removeLayer(e)});
}

createNewPoints = function(){
    rmPoints();
    document.getElementById("newPointsStr").value.split(",").forEach(function(e){
        point = ArrayRemove(e.split(" "), "")
        newPoints.push(L.circleMarker([Number(point[1]), Number(point[0])], {radius:4, color:"green"}).addTo(map));
    })
}

rmPoint = function(){
    if (newPoint) map.removeLayer(newPoint);
}

var grid = [];
setGrid = function(step){
    for(i = 0 ; i <= 90; i=i+step){
        line = L.polygon([
            [0+i, -180],
            [0+i, 180]
        ], {weight:1}).addTo(map);
        grid.push(line);
        line = L.polygon([
            [0-i, -180],
            [0-i, 180]
        ], {weight:1}).addTo(map);
        grid.push(line);
    }
    for(i = 0; i <= 180; i=i+step){
        line = L.polygon([
            [-180, 0+i],
            [180, 0+i]
        ], {weight:1}).addTo(map);
        grid.push(line);
        line = L.polygon([
            [-180, 0-i],
            [180, 0-i]
        ], {weight:1}).addTo(map);
        grid.push(line);
    }
}

var dotComma = ".";
dotCommaSwitch = function(){
    if (dotComma == ".") {
        dotComma = ",";
        getCoords();
        return;
    }
    if (dotComma == ",") {
        dotComma = ".";
        getCoords();
        return;
    }
}

getRawPolygon = function(a, b){
    return "POLYGON(("+a[0]+" "+a[1]+", "+b[0]+" "+a[1]+", "+b[0]+" "+b[1]+", "+a[0]+" "+b[1]+", "+a[0]+" "+a[1]+"))";
}

getPolygon = function(){
    a = [map.getBounds().getEast(), map.getBounds().getSouth()];
    b = [map.getBounds().getWest(), map.getBounds().getNorth()];
    return getRawPolygon(a, b);
}

getCoords = function(){
    document.getElementById("center").innerHTML =  map.getBounds().getCenter().lng.toString().replace(".", dotComma) + " " + map.getBounds().getCenter().lat.toString().replace(".", dotComma);
    document.getElementById("north").innerHTML = map.getBounds().getNorth().toString().replace(".", dotComma);
    document.getElementById("south").innerHTML = map.getBounds().getSouth().toString().replace(".", dotComma);
    document.getElementById("east").innerHTML = map.getBounds().getEast().toString().replace(".", dotComma);
    document.getElementById("west").innerHTML = map.getBounds().getWest().toString().replace(".", dotComma);
    document.getElementById("eastWest").innerHTML = (map.getBounds().getEast() - map.getBounds().getWest()).toString().replace(".", dotComma);
    document.getElementById("northSouth").innerHTML = (map.getBounds().getNorth() - map.getBounds().getSouth()).toString().replace(".", dotComma);
    document.getElementById("zoom").innerHTML = map.getZoom();
    document.getElementById("polygon").value = getPolygon();

    document.getElementById("geoapiv1").href = geoApiUrl+"/api/v1/?longitude="+map.getBounds().getCenter().lng.toString() + "&latitude=" + map.getBounds().getCenter().lat.toString();
}

setMapWidthHeight = function(){
    document.getElementById("map").style.width = document.getElementById("mapWidth").value;
    document.getElementById("map").style.height = document.getElementById("mapHeight").value;
}


var tabs = ["tabInfo", "tabSettings", "tabDraw"];
var tabs_p = 0;

hideAllTabs = function(){
    tabs.forEach(function(e){
        document.getElementById(e).style.display = "none";
    })
}

showTab = function(tab){
    hideAllTabs();
    document.getElementById(tab).style.display = "block";
}

map.on('move', getCoords);
getCoords();
hideAllTabs();
if (tabs.indexOf(window.location.hash.substr(1)) != -1) showTab(window.location.hash.substr(1));
else showTab("tabInfo");

document.getElementsByClassName("leaflet-control-attribution")[0].style.display = "none";
