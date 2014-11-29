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
                if (name == "Los Angeles" || name == "San Francisco" || name == "New York" || name == "New Haven" || name == "Portland") {
                    truncatedCities.push(el);
                }
            });

            this.svgMap.selectAll(".places")
                .data(truncatedCities)
                .enter().append("path")
                .attr("class", function(d) { return "place " + d.properties.name.replace(/\ /,'_').toLowerCase(); })
                .attr("id", function(d) { return d.properties.name.replace(/\ /,'_').toLowerCase(); })
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
