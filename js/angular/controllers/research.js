var research = angular.module('research', [
    'ngRoute',
]);

research.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/locations/:location', {
            templateUrl: '/views/partials/location-zoom.html',
            controller: 'locationCtrl'
        }).
        when('/', {
            templateUrl: '/views/partials/birdseye.html',
            controller: 'birdseyeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

function poi(name) {
    this.name = name;
}

research.factory('POI', [function() {
    function POI(id,name,address,geo) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.geo = geo;
    }
    return POI;
}]);

research.factory('poiService', ['POI', function(POI) {
    return {
        createFromData: function(poiData) {
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
                    geo = {
                        lat : p.lat,
                        lon : p.lon
                    };
                pointsOfInterest.push(new POI(id,name,address,geo));
            }
            return pointsOfInterest;
        }
    }
}]);

research.factory('Subregion', ['poiService', function(poiService) {
    function Subregion(id,name,poiData,scope) {
        this.id = id;
        this.name = name;
        this.poi = poiService.createFromData(poiData);
        this.scope = scope;
    }
    Subregion.prototype.select = function() {
        this.scope.poi = this.poi;
    };
    return Subregion;
}]);

research.factory('subregionService', ['Subregion', function(Subregion) {
    return {
        createFromData: function(subregionsData) {
            var subregions = [];
            for(var i in subregionsData) {
                var s = subregionsData[i];
                subregions.push(new Subregion(s.id,s.name,s.poiData,this));
            }
            return subregions;
        }
    }
}]);

research.factory('Region', ['subregionService', function(subregionService) {
    function Region(id,name,subregionsData,scope) {
        this.id = id;
        this.name = name;
        this.scope = scope;
        this.subregions = subregionService.createFromData.call(this.scope,subregionsData);
    }
    Region.prototype.select = function() {
        this.scope.subregions = this.subregions
        this.scope.poi = [];
    };
    return Region;
}]);

research.factory('regionService', ['$http','Region', function($http, Region) {
    return {
        retrieveFromData: function() {
            var that = this;
            that.regions = [];
            that.subregions = [];
            that.poi = [];
            $http.get('/data/research.json').success(function(data) {
                console.log(data);
                //var regions = JSON.parse(data);
                var regions = data;
                for(var i in regions) {
                    var r = regions[i];
                    that.regions.push(new Region(r.id,r.name,r.subregionsData,that));
                }
            });
        }
    }
}]);

research.controller('birdseyeCtrl', ['$scope', 'regionService', function($scope, regionService) {
    regionService.retrieveFromData.call($scope);
}]);
