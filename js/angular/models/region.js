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
