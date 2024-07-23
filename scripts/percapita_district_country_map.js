var WD = 1000, HT = 800
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom


var tooltip = d3.select("#scene6_district_country_map").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svg = d3.select("#scene6_district_country_map")
            .append("svg")                
                .attr("width",WD)
                .attr("height",HT)
                .attr("transform","scale("+0.9+","+0.9+")")
            .append("g")
             .attr("class","geo");

// Affordance 

var aff_svg = d3.select("body")
            .select("#scene6_district_country_map")
            .append("svg")
                .attr("id","svg-affordance")             
                .attr("width", width + margin.left + margin.right)
                .attr("height", 30);

var affordance_g = aff_svg.append("g")
                      .attr("class","accordance");

affordance_g.append("path")
            .attr("d","M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z")
            .attr("id","affordance-logo")
            .attr("stroke","grey")
            .attr("stroke-width",0.7)
            .style("fill", "grey")
            .attr("transform", "scale(0.4,0.4) translate("+1.7*WD+",20)")

affordance_g.append("text")
            .attr("id","affordance-txt")
            .attr("x", WD-290)
            .attr("y", margin.top) 
            .style("fill", "grey")
            .text("Hover mouse over map to see tooltip")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("stroke","black")
            .attr("stroke-width",0.3)
            .attr("font-style","italic")
        


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

var percapita_dist_status = new Map();
var unique_states = new Set();

var keys = ['Absolute scarcity [<500 m3]', 'Scarcity [500−1000 m3]', 'Stress [1000−1700 m3]', 'No Stress [>1700 m3]' ]

var percapita_status_colorscale = d3.scaleOrdinal()
  .domain(keys)  
  .range(["red","orange","#F7DC6F","green"]); 

var promises = [
    d3.json("data/india-districts-2019-734.json"),    
    d3.csv("data/Per_Capita_Water_Availability.csv",  function(d) {
      percapita_dist_status.set(d.DISTRICT_CODE, d.Current2025); 
       unique_states.add(d.State);       
      })      
  ]

Promise.all(promises).then(function(data){
    process_geo(data[0])
}).catch(function(error){
    console.log(error);
});




function process_geo(districts,district_rainfall,state_rainfall){
    
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
    

    //load district map
    svg.selectAll("path")
       .data(feature_collection)
       .enter().append("path")
            .attr("d", path)
            .attr("class",function(d) { return d.properties.st_nm.toUpperCase(); })
            .attr("fill","white")
            .attr("stroke","grey")
            .attr("stroke-width",0.1)
            //.style("fill", "blue")            
            .on('mouseover', onMouseOver) 
            .on('mousemove',onMouseMove)               
            .on('mouseout', onMouseOut) 

svg.selectAll("path")
      .transition().duration(500)
      .attr('fill',function(d) { return percapita_status_colorscale(percapita_dist_status.get(d.properties.dt_code)); })
      .attr("stroke","white")

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

tooltip_div.html("<span>District: " + d.properties.district + "<br/>" 
  + "State: " + d.properties.st_nm + "<br />"
  + "PerCapita Water: " + percapita_dist_status.get(d.properties.dt_code) + "<br /></span>")
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

// Annotation
const annotations = [
  {
    note: {
      label: "",
      title: "Absolute Scarcity",
      // align: "left",  // right or left
      wrap: 250,   
      // padding: 10  // More = text lower
    },
    connector: {
       end: "none",        // Can be none, or arrow or dot
       type: "line",      // "curve" with point
       //point: 3,  //goes with curve
       lineType : "vertical",    
       endScale: 2     // dot size
     },
    type: d3.annotationCalloutCircle,
    subject: {
      radius: 70,
      radiusPadding: 5
    },
    color: ["purple"],
    x: 480,
    y: 630,
    dx: -150,
    dy: -50,  
 
  }



]


// Add annotation to the chart
const makeAnnotations = d3.annotation()  
  .annotations(annotations)
  

d3.select("#scene6_district_country_map")
  .select("svg")   
  .append("g")
  .attr("class","scene6-annotation")
  // .attr("transform","translate("+margin.left+","+margin.top+")")
  .call(makeAnnotations) 
     

// set attr pointer-events none for annotation to not block tooltips ( set in CSS)

//Add Legends

// Add one rect in the legend for each name.  
svg.selectAll("legend_rect")
  .data(keys)
  .enter()
  .append("rect")    
    .attr("x", WD - 200)
    .attr("y", function(d,i){ return 100 + i*25 -10 }) 
    .attr("width", 20)
    .attr("height",20)
    .attr("stroke","grey")
    .attr("stroke-width",0.7)
    .style("fill", function(d){ return percapita_status_colorscale(d)})

// Add text for each rect    
svg.selectAll("legend_label")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", WD - 160)
    .attr("y", function(d,i){ return 100 + i*25}) 
    .style("fill", function(d){ return percapita_status_colorscale(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("stroke","grey")
    .attr("stroke-width",0.7)



};






 