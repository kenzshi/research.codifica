research.factory('gMap', [function() {
    function gMap(dom, coords, poi) {
        this.mapOptions = {
            zoom: coords.zoom,
            center: new google.maps.LatLng(coords.lat, coords.long)
        }
        this.map = new google.maps.Map(dom, this.mapOptions);
        this.poi = {};
        this.renderPoi(poi);
    }
    gMap.prototype = {
        relocate : function(coords, poi) {
            this.mapOptions = {
                zoom: coords.zoom,
                center: new google.maps.LatLng(coords.lat, coords.long)
            };
            this.map.setZoom(this.mapOptions.zoom);
            this.map.panTo(this.mapOptions.center);
            if (poi) {
                this.renderPoi(poi);
            }
        },
        renderPoi : function(poi) {
            for(var i in poi) {
                if (this.poi.hasOwnProperty(poi[i].id)){
                    continue;
                } else {
                    var key = poi[i].id;
                    this.poi[key] = new google.maps.Marker({
                        position: new google.maps.LatLng(poi[i].coords.lat,poi[i].coords.long),
                        map: this.map,
                        title: poi[i].name
                    });
                }
            }
            console.log(this.poi);
        }
    };
    return gMap;
}]);
