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
    #id_counter = 1;

    constructor() {
        tagList.forEach(tag => {this.addGeoTag(tag[0], tag[1], tag[2], tag[3])});
    }

    addGeoTag(name, latitude, longitude, hashtag) {
        this.#geoTags.push(new GeoTag(name, latitude, longitude, hashtag, this.#id_counter++));
    }

    newGeoTag(name, latitude, longitude, hashtag) {
        this.#geoTags.push(new GeoTag(name, latitude, longitude, hashtag, this.#id_counter));
        return this.getGeoTagByID(this.#id_counter++);
    }

    updateGeoTag(name, latitude, longitude, hashtag, id) {
        let tag = this.getGeoTagByID(id);
        if (tag !== undefined) {
            tag.name = name;
            tag.latitude = latitude;
            tag.longitude = longitude;
            tag.hashtag = hashtag;
            return tag;
        } else {
            return undefined;
        }
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter((geoTag) => geoTag.name !== name);
    }

    removeGeoTagByID(id) {
        let tag = this.getGeoTagByID(id);
        if (tag !== undefined) {
            tag = JSON.stringify(tag);
            this.#geoTags = this.#geoTags.filter((geoTag) => geoTag.id != id);
        }
        return tag;
    }

    getNearbyGeoTag(latitude, longitude) {
        const rad = 1.555;
        return this.#geoTags.filter((geoTag) =>
            (Math.abs(geoTag.longitude - longitude) <= rad) &&
                (Math.abs(geoTag.latitude - latitude) <= rad)
        );
    }

    searchNearbyGeoTag(latitude, longitude, search) {
        return this.filterGeotag(search, this.getNearbyGeoTag(latitude, longitude));
    }

    get geoTags() {
        return this.#geoTags;
    }

    searchGeoTag(search) {
        return this.filterGeotag(search, this.geoTags);
    }

    filterGeotag(search, geoTags) {
        return geoTags.filter((geoTag) =>
            search.toLowerCase().includes(geoTag.name.toLowerCase()) ||
            search.toLowerCase().includes(geoTag.hashtag.toLowerCase()) ||
            geoTag.name.toLowerCase().includes(search.toLowerCase()) ||
            geoTag.hashtag.toLowerCase().includes(search.toLowerCase())
        )
    }

    getGeoTagByID(id) {
        return this.#geoTags.find((tag) => tag.id == id);
    }
}

module.exports = InMemoryGeoTagStore