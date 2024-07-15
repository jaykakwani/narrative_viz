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
             .attr("class","geo");

var state_svg = d3.select("#state_maps")
             .append("svg")                
                 .attr("width",WD)
                 .attr("height",HT)
             .append("g")
              .attr("class","geo");             

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
unique_states = new Set();

var gw_status_colorscale = d3.scaleOrdinal()
  .domain(['Over-exploited', 'Critical', 'Semi-critical', 'Safe','Saline' ])  
  .range(["red","orange","yellow","green","blue"]); 

var promises = [
    d3.json("data/india-districts-2019-734.json"),    
    d3.csv("data/district_gw_status.csv",  function(d) {
       gw_dist_status.set(d.DISTRICT_CODE, d.GW_Status); 
       unique_states.add(d.STATE);       
      }),
    d3.csv("data/district_rainfall_2021.csv"),
    d3.csv("data/state_rainfall_2021.csv")
  ]

Promise.all(promises).then(function(data){
    process_geo(data[0],data[2],data[3])
}).catch(function(error){
    console.log(error);
});




function process_geo(districts,district_rainfall,state_rainfall){
    
    // console.log(district_rainfall);
    // console.log(state_rainfall);
    // console.log(districts);  
    // console.log(gw_dist_status);  
    // console.log(Array.from(unique_states));
    
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
    
    let unique_states_array = Array.from(unique_states).sort();
    var defaultOptionName = "DELHI";
    //load state drop-down
    d3.select("#select-state")
      .selectAll("state-options")
      .data(unique_states_array)
      .enter()
        .append("option")
        .text(function(d){return d;})
        .attr("value",function(d){return d;})
        .property("selected",function(d){return d == defaultOptionName;})
        

    //load district map
    svg.selectAll("path")
       .data(feature_collection)
       .enter().append("path")
            .attr("d", path)
            .attr("class",function(d) { return d.properties.st_nm.toUpperCase(); })
            //.style("fill", "blue")
            .attr('fill',function(d) { return gw_status_colorscale(gw_dist_status.get(d.properties.dt_code)); })
            .on('mouseover', onMouseOver) 
            .on('mousemove',onMouseMove)               
            .on('mouseout', onMouseOut) 



//function get state map
function drawStateMap(selectedOptionName) {
var state_json_path = "data/state/"+selectedOptionName.toLowerCase()+".json";
  
switch(selectedOptionName.toLowerCase()){
    case "delhi":
      d3.json(state_json_path).then(function(state){      
        console.log(topojson.feature(state,state.objects.delhi).features)
        st_feature_collection = topojson.feature(state,state.objects.delhi).features;

           //load state map
              state_svg.selectAll("path")
              .data(getStateMap(defaultOptionName))
              .enter().append("path")
                .attr("d", path)
                .attr("class",function(d) { return d.properties.st_nm.toUpperCase(); })
                //.style("fill", "blue")
                .attr('fill',function(d) { return gw_status_colorscale(gw_dist_status.get(d.properties.dt_code)); })
                .on('mouseover', onMouseOver) 
                .on('mousemove',onMouseMove)               
                .on('mouseout', onMouseOut) 
        });        
      break;
    case "sikkim":
        d3.json(state_json_path).then(function(state){      
          console.log(topojson.feature(state,state.objects.sikkim).features)
          st_feature_collection = topojson.feature(state,state.objects.delhi).features;
          });
        break;  

    default:

}

    
    

    //  console.log("state map -->"+data);
    //  var st_feature_collection = topojson.feature(data,data.objects.delhi).features;
    //  console.log("st_feature_coll -->"+st_feature_collection);   
      // var proj = d3.geoMercator().translate([WD/2,HT/2])
      // var path = d3.geoPath().projection(proj);;
      
      // var bounds = d3.geoBounds(topojson.feature(districts,districts.objects.districts));
      // var center = d3.geoCentroid(topojson.feature(districts,districts.objects.districts));
      
      // // Compute the angular distance between bound corners
      // var distance = d3.geoDistance(bounds[0], bounds[1]),
      // scale = (HT+300) / distance / Math.sqrt(2);
    
      // // Update the projection scale and centroid
      // proj.scale(scale).center(center);
     

   }
            
            
// When the state drop-down is changed 
d3.select("#select-state").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value")
  // run the updateChart function with this selected option
  //select_state_update(selectedOption)
  // drawStateMap(selectedOption);
})            

//select state update
function select_state_update(selectedOption){    
  // stateclass = '.'+selectedOption;
  // d3.selectAll(stateclass)
  //   .style("opacity","0.2") 

}


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






 