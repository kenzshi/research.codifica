research.factory('poiService', ['POI', function(POI) {
    return {
        createFromData: function(poiData, scope) {
            // poi must be a data array of poi
            var pointsOfInterest = [];
            for(var i in poiData) {
                var p = poiData[i],
                    id = p.id,
                    name = p.name,
                    address = {
                        line1 : p.address1,
                        line2 : p.address2,
                        city : p.city,
                        state : p.state,
                        zip : p.zip,
                        country : p.country
                    },
                    coords = p.coords;
                    if (p.hasOwnProperty('images')) {
                        var images = p.images;
                    } else {
                        var images = [];
                    }
                pointsOfInterest.push(new POI(id,name,address,images,coords,scope));
            }
            return pointsOfInterest;
        }
    }
}]);
