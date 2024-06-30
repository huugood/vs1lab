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
let searchterm = "";
let latitude = "";
let longitude = "";
let name = "";
let hashtag = "";
let mapManager = undefined;

function readInputDiscovery() {
    this.searchterm = document.getElementById("search-input").value;
    this.latitude = document.getElementById("discovery-latitude").value;
    this.longitude = document.getElementById("discovery-longitude").value;
}

function readInputTagging() {
    readInputDiscovery();
    this.name = document.getElementById("name-input").value;
    this.hashtag = document.getElementById("hashtag-input").value;
}

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
    if (this.mapManager === undefined) {
        this.mapManager = new MapManager();
    }
    this.mapManager.initMap(location.latitude, location.longitude);
    //mapManager.updateMarkers(location.latitude, location.longitude);
    let element = document.getElementById("map");
    this.mapManager.updateMarkers(location.latitude, location.longitude, JSON.parse(element.dataset.tags || "[]"));
}

function updateMapMarkers(taglist) {
    this.mapManager.updateMarkers(latitude, longitude, taglist);
}

document.getElementById("search-submit").addEventListener("click", function (e) {
    e.preventDefault();
    searchEvent();
})

function searchEvent() {
    readInputDiscovery();
    fetchResults().then(result => result.json()).then((data) => {
        updateSearch(data);
    });
}

document.getElementById("add-tag-submit").addEventListener("click", function (e) {
    e.preventDefault();
    readInputTagging();
    addTag().then(() => {
        searchEvent();
    })
});

async function addTag() {
    return fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"name": this.name, "hashtag": this.hashtag, "latitude": this.latitude, "longitude": this.longitude})
    })
}

async function fetchResults() {
    return fetch("http://localhost:3000/api/geotags/?" + new URLSearchParams({
        searchterm: this.searchterm,
        latitude: this.latitude,
        longitude: this.longitude
    }).toString(), {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
}

function updateSearch(taglist) {
    document.getElementById("discoveryResults").innerHTML = ejs.render(`<% if (taglist !== undefined) taglist.forEach(gtag => { %>
                        <li><%= gtag.name %> ( <%= gtag.latitude %>,<%= gtag.longitude %>) <%= gtag.hashtag %> </li>
                    <% }); %>`, {taglist: taglist});
    updateMapMarkers(taglist);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});