// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const {name} = require("ejs");

/** *
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    constructor(name, latitude, longitude, hashtag, id) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.hashtag = hashtag;
        this.id = id;
    }

}

module.exports = GeoTag;
