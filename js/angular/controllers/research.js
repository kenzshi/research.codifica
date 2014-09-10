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

research.factory('gMap', [function() {
    function gMap(dom, coords, poi) {
        this.mapOptions = {
            zoom: coords.zoom,
            center: new google.maps.LatLng(coords.lat, coords.long)
        }
        this.map = new google.maps.Map(dom, this.mapOptions);
    }
    gMap.prototype = {
        relocate : function(coords) {
            this.mapOptions = {
                zoom: coords.zoom,
                center: new google.maps.LatLng(coords.lat, coords.long)
            };
            this.map.setZoom(this.mapOptions.zoom);
            this.map.panTo(this.mapOptions.center);
        }
    };
    return gMap;
}]);

research.factory('Subregion', ['poiService', 'gMap', function(poiService, gMap) {
    function Subregion(id,name,coords,poiData,scope) {
        this.id = id;
        this.name = name;
        this.coords = coords;
        this.selected = false;
        this.scope = scope;
        this.poi = poiService.createFromData(poiData);
        this.dom = document.getElementById(this.id);

        this.dom.addEventListener('click', function() {
            this.scope.$apply(this.select.bind(this));
        }.bind(this));
    }
    Subregion.prototype = {
        select : function() {
            this.scope.clearSelectedSubregions(this.scope.subregions);
            this.selected = true;
            this.dom.setAttribute('class','place ' + this.id + ' selected');
            this.scope.poi = this.poi;
            // lazy load Google Map
            if (!this.scope.gMap) {
                this.scope.gMap = new gMap(this.scope.gMapDom, this.coords, poi);
            } else {
                this.scope.gMap.relocate(this.coords);
            }
            this.scope.d3MapDom.style.display = 'none';
            this.scope.gMapDom.style.display = 'block';
        },
        hoverOn : function() {
            console.log("HELLO WORLD");
            document.getElementById(this.id).setAttribute('class','place '+ this.id +' hover');
        },
        hoverOff : function() {
            var classString = 'place '+ this.id;
            if (this.selected == true) {
                classString += ' selected'
            }
            document.getElementById(this.id).setAttribute('class', classString);
        }
    };
    return Subregion;
}]);

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

research.factory('Region', ['subregionService', function(subregionService) {
    function Region(id,name,coords,subregionsData,scope) {
        this.id = id;
        this.name = name;
        this.coords = coords;
        this.selected = false;
        this.scope = scope;
        this.subregions = subregionService.createFromData.call(this.scope,subregionsData);
        this.selected = "";
        this.dom = document.getElementById(this.id);

        this.dom.addEventListener('click', function() {
            this.scope.$apply(this.select.bind(this)); 
        }.bind(this));
    }
    Region.prototype = {
        select : function() {
            this.scope.clearSelectedRegions(this.scope.regions);
            this.selected = true;
            this.dom.setAttribute('class','subunit ' + this.id + ' selected');
            console.log(this.dom);
            this.scope.subregions = this.subregions
            this.scope.poi = [];
            this.scope.birdseye.focus(this.coords.x, this.coords.y, this.coords.scale, 1500);
        },
        hoverOn : function() {
            document.getElementById(this.id).setAttribute('class','subunit '+ this.id +' hover');
        },
        hoverOff : function() {
            var classString = 'subunit '+ this.id;
            if (this.selected == true) {
                classString += ' selected'
            }
            document.getElementById(this.id).setAttribute('class', classString);
        }
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

research.factory('birdseye', [function() {
    function birdseye(dataUrl, options, callback) {
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
                .attr("id", function(d) { return d.id; })
                .attr("d", path);

            var cities = topojson.feature(us, us.objects.places).features;
            var truncatedCities = [];

            // So this is bad, but I'm too lazy to filter out the dataset right now
            cities.forEach(function(el,index) {
                var name = el.properties.name;
                if (name == "Los Angeles" || name == "San Francisco" || name == "New York") {
                    truncatedCities.push(el);
                }
            });

            this.svgMap.selectAll(".places")
                .data(truncatedCities)
                .enter().append("path")
                .attr("class", function(d) { return "place " + d.properties.name.replace(/\ /,'_'); })
                .attr("id", function(d) { return d.properties.name.replace(/\ /,'_'); })
                .attr("d", path);

            // Run callback
            callback();
        }.bind(this));
    }

    birdseye.prototype = {
        focus : function(x,y,s,d) {
            this.zoomListener.translate([x,y]).scale(s);
            this.zoomListener.event(this.svgMap.transition().duration(d));
        } 
    }
    
    return birdseye;
}]);

// Controllers

research.controller('birdseyeCtrl', ['$scope', 'regionService', 'birdseye', function($scope, regionService, birdseye) {
    
    var options = {
        domEl: '#region-map',
        class: 'map',
        id: 'map',
        width: 760,
        height: 500
    }
    $scope.d3MapDom = document.getElementById('region-map');
    $scope.gMapDom = document.getElementById('google-map');

    $scope.birdseye = new birdseye('us.json', options, regionService.retrieveFromData.bind($scope)); 

    $scope.clearSelectedRegions = function(r) {
        for (var i in r) {
            if (r[i].selected) {
                $scope.clearSelectedSubregions(r[i].subregions);
            }
            r[i].selected = false;
            r[i].dom.setAttribute('class', 'subunit ' + r[i].id);
        }
    };
    $scope.clearSelectedSubregions = function(sr) {
        for (var i in sr) {
            if (sr[i].selected) {
                $scope.clearSelectedPointsOfInterests(sr[i].poi);
            }
            sr[i].selected = false;
            sr[i].dom.setAttribute('class', 'place ' + sr[i].id);
        }
        $scope.d3MapDom.style.display = 'block';
        $scope.gMapDom.style.display = 'none';
    };
    $scope.clearSelectedPointsOfInterests = function(poi) {
        for (var i in poi) {
            poi[i].selected = false;
        }
    };
}]);
