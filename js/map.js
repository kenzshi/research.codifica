var width = window.innerWidth < 960 ? window.innerWidth * 0.66 : 960,
    height = Math.floor(window.innerHeight * 0.80);
    console.log(width,height);

var svg = d3.select("#hipster").append("svg")
    .attr('class', 'map')
    .attr('id', 'map')
    .attr('width', width)
    .attr('height', height);

var mapsvg = document.getElementById('map');
    mapsvg.style.marginTop = -height/2 + 130;
    mapsvg.style.marginLeft = -width/2;

/* JavaScript goes here. */
console.log("hello");
d3.json('us.json', function(error, us) {
    if (error) {
        return console.error(error);
    }
    d3.json('us.json', function(error, us) {
        if (error) {
            return console.error(error);
        }
        var subunits = topojson.feature(us, us.objects.subunits);
        var projection = d3.geo.albers()
            //.center([0, 55.4])
            //.rotate([4.4, 0])
            .parallels([29.5, 45.5])
            //.scale(6000)
            //.translate([width / 2, height / 2]);
        var path = d3.geo.path()
            .projection(projection);
        //svg.append('path')
        //    .datum(subunits)
        //    .attr('d', path);
        console.log(us.objects.subunits);
        svg.selectAll(".subunit")
            .data(topojson.feature(us, us.objects.subunits).features)
            .enter().append("path")
            .attr("class", function(d) { return "subunit " + d.id; })
            .attr("d", path);
    });
});
