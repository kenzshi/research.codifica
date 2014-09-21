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
        $scope.pointOfInterest = null;
        for (var i in poi) {
            poi[i].selected = false;
        }
    };
}]);
