research.factory('POI', [function() {
    function POI(id,name,address,coords,scope) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.coords = coords;
        this.scope = scope;
        this.selected = false;
    }
    POI.prototype.select = function() {
        this.scope.clearSelectedPointsOfInterests(this.scope.poi); 
        this.selected = true;
        this.scope.pointOfInterest = this;
        this.scope.gMap.relocate(this.coords)
    }
    return POI;
}]);
