var research = angular.module('research', [
    'ngRoute',
]);

research.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/locations/:location', {
            templateUrl: 'views/partials/location-zoom.html',
            controller: 'locationCtrl'
        }).
        when('/', {
            templateUrl: 'views/partials/birdseye.html',
            controller: 'birdseyeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

// Models

research.factory('POI', [function() {
    function POI(id,name,address,geo) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.geo = geo;
    }
    POI.prototype.select = function() {
        this.selected = true;
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
        this.selected = false;
        this.poi = poiService.createFromData(poiData);
        this.scope = scope;
    }
    Subregion.prototype.select = function() {
        this.scope.clearSelectedSubregions(this.scope.subregions);
        this.selected = true;
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
    function Region(id,name,coords,subregionsData,scope) {
        this.id = id;
        this.name = name;
        this.coords = coords;
        this.selected = false;
        this.scope = scope;
        this.subregions = subregionService.createFromData.call(this.scope,subregionsData);
        this.selected = "";
    }
    Region.prototype.select = function() {
        this.scope.clearSelectedRegions(this.scope.regions);
        this.selected = true;
        this.scope.subregions = this.subregions
        this.scope.poi = [];
        this.scope.d3Map.focus(this.coords.x, this.coords.y, this.coords.scale, 1000);
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
            $http.get('data/research.json').success(function(data) {
                console.log(data);
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

research.factory('d3Map', [function() {
    function d3Map(dataUrl, options) {
        var that = this
        this.svgMap = d3.select(options.domEl).append('svg:svg')
            .attr('class', options.class)
            .attr('id', options.id)
            .attr('width', options.width)
            .attr('height', options.height).append('g');
        this.zoomListener = d3.behavior.zoom()
            .scaleExtent([1, 3000])
            .on("zoom", function () {
                that.svgMap.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"); });

        d3.json(dataUrl, function(error, us) {
            if (error) {
                return console.error(error);
            }
            var subunits = topojson.feature(us, us.objects.subunits);
            var projection = d3.geo.albers()
                .parallels([29.5, 45.5])
                .translate([375,220])
                .scale(900);
            var path = d3.geo.path()
                .projection(projection);

            // Populates the DOM element
            this.svgMap.selectAll(".subunit")
                .data(topojson.feature(us, us.objects.subunits).features)
                .enter().append("path")
                .attr("class", function(d) { return "subunit " + d.id; })
                .attr("d", path);
        }.bind(this));
    }

    d3Map.prototype= {
        focus : function(x,y,s,d) {
            this.zoomListener.translate([x,y]).scale(s);
            this.zoomListener.event(this.svgMap.transition().duration(d));
        } 
    }
    
    return d3Map;
}]);

// Controllers

research.controller('birdseyeCtrl', ['$scope', 'regionService', 'd3Map', function($scope, regionService, d3Map) {
    
    function renderMap() {
    }

    regionService.retrieveFromData.call($scope);

    var width = window.innerWidth < 960 ? window.innerWidth * 0.66 : 960,
        height = Math.floor(window.innerHeight * 0.80);
    var d3Options = {
        domEl: '#region-map',
        class: 'map',
        id: 'map',
        width: 760,
        height: 500
    }
    $scope.d3Map = new d3Map('us.json', d3Options); 

    $scope.clearSelectedRegions = function(r) {
        for (var i in r) {
            if (r[i].selected) {
                $scope.clearSelectedSubregions(r[i].subregions);
            }
            r[i].selected = false;
        }
    };
    $scope.clearSelectedSubregions = function(sr) {
        for (var i in sr) {
            if (sr[i].selected) {
                $scope.clearSelectedPointsOfInterests(sr[i].poi);
            }
            sr[i].selected = false;
        }
    };
    $scope.clearSelectedPointsOfInterests = function(poi) {
        for (var i in poi) {
            poi[i].selected = false;
        }
    };
}]);
