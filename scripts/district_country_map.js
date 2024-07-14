//import * as topojson from "topojson-client";

var WD = 600, HT = 600
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom


var tooltip = d3.select("#scene3_district_country_map").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svg = d3.select("#scene3_district_country_map")
            .append("svg")                
                .attr("width",WD)
                .attr("height",HT)
            .append("g")
             .attr("class","geo")

//tooltip
var tooltip_div = d3.select("body").append("div")
     .attr("id", "tooltip_geo_map")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);

var gw_dist_status = new Map();

var gw_status_colorscale = d3.scaleOrdinal()
  .domain(['Over-exploited', 'Critical', 'Semi-critical', 'Safe','Saline' ])  
  .range(["red","orange","yellow","green","blue"]); 

 

var promises = [
    d3.json("data/india-districts-2019-734.json"),
    d3.csv("data/district_gw_status.csv",  function(d) { gw_dist_status.set(d.DISTRICT_CODE, d.GW_Status); })
  ]


//d3.json("data/india-districts-2019-734.json").then(process_geo);

Promise.all(promises).then(function(data){
    process_geo(data[0])
}).catch(function(error){
    console.log(error);
});

function process_geo(districts){
    
    console.log(districts);  
    console.log(gw_dist_status);  
    
    var feature_collection = topojson.feature(districts,districts.objects.districts).features;
    
    var proj = d3.geoMercator().translate([WD/2,HT/2])
    var path = d3.geoPath().projection(proj);;
    
    var bounds = d3.geoBounds(topojson.feature(districts,districts.objects.districts));
    var center = d3.geoCentroid(topojson.feature(districts,districts.objects.districts));
    
    // Compute the angular distance between bound corners
    var distance = d3.geoDistance(bounds[0], bounds[1]),
    scale = (HT+300) / distance / Math.sqrt(2);
   
    // Update the projection scale and centroid
    proj.scale(scale).center(center);

    svg.selectAll("path")
       .data(feature_collection)
       .enter().append("path")
            .attr("d", path)
            //.style("fill", "blue")
            .attr('fill',function(d) { return gw_status_colorscale(gw_dist_status.get(d.properties.dt_code)); })
            .on('mouseover', onMouseOver) 
            .on('mousemove',onMouseMove)               
            .on('mouseout', onMouseOut)

//Mouseover 
function onMouseOver(event,d){
        
  d3.select(this).transition()
       .duration('50')
       .attr('opacity', '.85')
  
  tooltip_div.transition()
       .duration(50)
       .style("opacity", 1)

}     

//Mouse move
function onMouseMove(event,d){

tooltip_div.html("<span>District: " + d.properties.district + "<br/>" + "State: " + d.properties.st_nm + "<br /></span>")
.style("left", (event.pageX + 10) + "px")
.style("top", (event.pageY - 15) + "px")
.transition()
.duration(200) // ms
.style("opacity", 1)   
}


//Mouse Out
function onMouseOut(event,d){
d3.select(this).transition()
.duration('50')
.attr('opacity', '1')

tooltip_div.transition()
.duration(50)
.style("opacity", 0)
}



};






 