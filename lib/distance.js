geolib = require('geolib');

module.exports.dist = function(lat, lon) {
    var distance = geolib.getDistance(
        { latitude: lat, longitude: lon },
        { latitude: process.env.LAT, longitude: process.env.LON }
    );

    return Math.round(distance / 1000);
};
