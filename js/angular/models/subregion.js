research.factory('Subregion', ['poiService', 'gMap', function(poiService, gMap) {
    function Subregion(id,name,coords,poiData,scope) {
        this.id = id;
        this.name = name;
        this.coords = coords;
        this.selected = false;
        this.scope = scope;
        this.poi = poiService.createFromData(poiData, this.scope);
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
                this.scope.gMap = new gMap(this.scope.gMapDom, this.coords, this.poi);
            } else {
                this.scope.gMap.relocate(this.coords, this.poi);
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
