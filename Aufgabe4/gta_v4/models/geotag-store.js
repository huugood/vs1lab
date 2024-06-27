// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const geo = require("ejs");
const GeoTag = require("./geotag");
const {tagList} = require("./geotag-examples");

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    #geoTags = [];

    constructor() {
        tagList.forEach(tag => {this.addGeoTag(new GeoTag(tag[0], tag[1], tag[2], tag[3]));});
    }

    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter((geoTag) => geoTag.name !== name);
    }

    getNearbyGeoTag(latitude, longitude) {
        const rad = 1.555;
        return this.#geoTags.filter((geoTag) =>
            (Math.abs(geoTag.longitude - longitude) <= rad) &&
                (Math.abs(geoTag.latitude - latitude) <= rad)
        );
    }

    searchNearbyGeoTag(latitude, longitude, search) {
        return this.getNearbyGeoTag(latitude, longitude).filter((geoTag) =>
            search.toLowerCase().includes(geoTag.name.toLowerCase()) ||
            search.toLowerCase().includes(geoTag.hashtag.toLowerCase()) ||
            geoTag.name.toLowerCase().includes(search.toLowerCase()) ||
            geoTag.hashtag.toLowerCase().includes(search.toLowerCase())
        );
    }

    get geoTags() {
        return this.#geoTags;
    }
}

module.exports = InMemoryGeoTagStore