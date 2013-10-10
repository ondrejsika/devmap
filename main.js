var map = L.map('map').setView([49.7447656, 13.3752194], 3);

getTiles = function(source){
    return L.tileLayer(source, {}).addTo(map);
}

var tiles = getTiles('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

setMapSource = function(){
    map.removeLayer(tiles);
    tiles = getTiles(document.getElementById("mapSource").value)
}

updateGrid = function(){
    grid.forEach(function(e){map.removeLayer(e)});
    grid = [];
    setGrid(Number(document.getElementById("grid").value))
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
}

setMapWidthHeight = function(){
    document.getElementById("map").style.width = document.getElementById("mapWidth").value;
    document.getElementById("map").style.height = document.getElementById("mapHeight").value;
}

map.on('move', getCoords);
getCoords();

document.getElementsByClassName("leaflet-control-attribution")[0].style.display = "none";
