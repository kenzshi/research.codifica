research.factory('regionService', ['$http','Region', function($http, Region) {
    return {
        retrieveFromData: function() {
            var that = this;
            that.regions = [];
            that.subregions = [];
            that.poi = [];
            $http.get('data/research.json').success(function(data) {
                //var regions = JSON.parse(data);
                var regions = data;
                for(var i in regions) {
                    var r = regions[i];
                    that.regions.push(new Region(r.id,r.name,r.coords,r.subregionsData,that));
                }
            });
        }
    }
}]);
