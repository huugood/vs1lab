// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
/*
function updateLocation() {
    LocationHelper.findLocation(writeLocation);
}

function writeLocation(location) {
    document.getElementById("latitude-input").value = location.latitude;
    document.getElementById("longitude-input").value = location.longitude;
    document.getElementById("discovery-latitude").value = location.latitude;
    document.getElementById("discovery-longitude").value = location.longitude;
    document.getElementById("mapView").remove();
    document.getElementById("map-descr").remove();
    let mapManager = new MapManager();
    mapManager.initMap(location.latitude, location.longitude);
    mapManager.updateMarkers(location.latitude, location.longitude);
}*/

function updateLocation() {
    if (!isLocationSet()) {
        LocationHelper.findLocation(writeLocation);
    } else {
        const latitude = document.getElementById("discovery-latitude").value;
        const longitude = document.getElementById("discovery-longitude").value;
        const location = new LocationHelper(latitude, longitude);
        console.log(location);
        writeLocation(location);
    }
}

function isLocationSet() {
    const latitude = document.getElementById("discovery-latitude").value;
    const longitude = document.getElementById("discovery-longitude").value;
    return latitude && longitude;
}

function writeLocation(location) {
    document.getElementById("latitude-input").value = location.latitude;
    document.getElementById("longitude-input").value = location.longitude;
    document.getElementById("discovery-latitude").value = location.latitude;
    document.getElementById("discovery-longitude").value = location.longitude;
    document.getElementById("mapView").remove();
    document.getElementById("map-descr").remove();
    let mapManager = new MapManager();
    mapManager.initMap(location.latitude, location.longitude);
    //mapManager.updateMarkers(location.latitude, location.longitude);
    console.log(document.getElementById("map").dataset.tags);
    let element = document.getElementById("map");
    console.log(element);
    mapManager.updateMarkers(location.latitude, location.longitude, JSON.parse(element.dataset.tags || "[]"));
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});