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
