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

research.controller('locationCtrl', ['$scope', function($scope) {
}]);

research.controller('birdseyeCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.regions = [{
        id: 'CA',
        name: 'California',
        subregions: [{
            id: 'LA',
            name: 'Los Angeles',
            poi: [
                new poi('Espresso Profetta'),
                new poi('Cafe Cielo'),
                new poi('Primo Passo')
            ]
        }, {
            id: 'SF',
            name: 'San Francisco',
            poi: [
            ]
        }],
        select: function(){
            $scope.subregions = this.subregions
        }
    }, {
        id: 'NY',
        name: 'New York',
        subregions: [{
            id: 'SOHO',
            name: 'SoHo',
            poi: [
                new poi('Two Hands'),
                new poi('Saturday\'s Surf')
            ]
        }, {
            id: 'WBBK',
            name: 'Williamsburg',
            poi: [
                new poi('Toby\'s Estate'),
                new poi('Blue Bottle')
            ]
        }],
        select: function(){
            console.log("hello");
            console.log(this.subregions);
            $scope.subregions = this.subregions
            console.log($scope.subregions);
        }
    }];
    $scope.subregions = [];
    $scope.poi = [];
}]);
