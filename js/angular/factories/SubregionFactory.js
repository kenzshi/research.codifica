research.factory('subregionService', ['Subregion', function(Subregion) {
    return {
        createFromData: function(subregionsData) {
            var subregions = [];
            for(var i in subregionsData) {
                var s = subregionsData[i];
                subregions.push(new Subregion(s.id,s.name,s.coords,s.poiData,this));
            }
            return subregions;
        }
    }
}]);
