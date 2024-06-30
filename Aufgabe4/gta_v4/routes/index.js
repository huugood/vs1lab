// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const {taglist} = require("../models/geotag-examples");
const geoTagStore = new GeoTagStore();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], latitude: '', longitude: '', search: '' })
});

router.post('/tagging', (req, res) => {
  geoTagStore.addGeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);
  res.render('index', { taglist: geoTagStore.getNearbyGeoTag(req.body.latitude, req.body.longitude), latitude: req.body.discovery_latitude, longitude: req.body.discovery_longitude, search: '' });
})

router.post('/discovery', (req, res) => {
  if (req.body.discovery_search === '') {
    res.render('index', { taglist: geoTagStore.getNearbyGeoTag(req.body.discovery_latitude, req.body.discovery_longitude), latitude: req.body.discovery_latitude, longitude: req.body.discovery_longitude, search: '' });
  } else {
    res.render('index', { taglist: geoTagStore.searchNearbyGeoTag(req.body.discovery_latitude, req.body.discovery_longitude, req.body.discovery_search), latitude: req.body.discovery_latitude, longitude: req.body.discovery_longitude, search: req.body.discovery_search })
  }

})

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (https://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  let result;
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let searchterm = req.query.searchterm;
  if (latitude !== undefined && longitude !== undefined) {
    result = geoTagStore.getNearbyGeoTag(latitude, longitude);
  } else {
    result = geoTagStore.geoTags;
  }
  if (searchterm !== undefined) {
    result = geoTagStore.filterGeotag(searchterm, result);
  }
  res.json(result);
})

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  let name = req.body.name;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let hashtag = req.body.hashtag;

  if (name !== undefined && /^[a-zA-Z]{1,10}$/.test(name) &&
      latitude !== undefined && /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(latitude) &&
      longitude !== undefined && /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/.test(longitude) &&
      hashtag !== undefined && /^#[a-zA-Z]{1,10}$/.test(hashtag)
  ) {
    let newGeotag = geoTagStore.newGeoTag(name, latitude, longitude, hashtag);
    res.status(201).json(newGeotag);
  } else {
    res.status(404).send("Not found!");
  }
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  let id = req.params.id.slice(1);
  if (id !== undefined) {
    let tag = geoTagStore.getGeoTagByID(id);
    if (tag !== undefined) {
      res.json(tag);
    } else res.status(404).send('Not Found');
  } else res.status(404).send("Error");
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  let id = req.params.id.slice(1);
  let name = req.body.name;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let hashtag = req.body.hashtag;

  if (name !== undefined && /^[a-zA-Z]{1,10}$/.test(name) &&
      latitude !== undefined && /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(latitude) &&
      longitude !== undefined && /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/.test(longitude) &&
      hashtag !== undefined && /^#[a-zA-Z]{1,10}$/.test(hashtag) &&
      id !== undefined
  ) {
    let updatedGeotag = geoTagStore.updateGeoTag(name, latitude, longitude, hashtag, id);
    if (updatedGeotag !== undefined) res.status(201).json(updatedGeotag);
    else res.status(404).send("Not Found");
  } else {
    res.status(404).send("Not found!");
  }

})


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  let id = req.params.id.slice(1);
  let removedTag = geoTagStore.removeGeoTagByID(id);
  console.log(removedTag);
  if (removedTag !== undefined) {
    res.status(200).json(JSON.parse(removedTag));
  } else {
    res.status(204).send();
  }
})

module.exports = router;
