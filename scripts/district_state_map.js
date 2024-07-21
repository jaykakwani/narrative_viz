
//config var and add svg


var WD = 800, HT = 600
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom

//Generate Initial

var state_json_files = new Map();
var state_geometry = new Map();
var unique_states = new Set();
var defaultOptionName = "ASSAM";

var rain_dist_status = new Map();
var rain_st_status = new Map();

var rain_dist_recorded = new Map();
var rain_st_recorded = new Map();

var keys = ['Large-Deficient', 'Deficient', 'Normal', 'Excess','Large-Excess' ]

var rain_status_colorscale = d3.scaleOrdinal()
  .domain(keys)  
  .range(["yellow","orange","green","lightblue","dodgerblue"]); 


//tooltip
var tooltip_state_div = d3.select("body").append("div")
     .attr("id", "tooltip_state_map")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);

var tooltip_country_div = d3.select("body").append("div")
     .attr("id", "tooltip_country_map")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);     



var promises = [
    d3.json("data/state/andamannicobar.json"),
    d3.json("data/state/andhrapradesh.json"),
    d3.json("data/state/arunachalpradesh.json"),
    d3.json("data/state/assam.json"), 
    d3.json("data/state/bihar.json"),
    d3.json("data/state/chandigarh.json"), 
    d3.json("data/state/chhattisgarh.json"),
    d3.json("data/state/dadranagarhaveli.json"), 
    d3.json("data/state/delhi.json"),
    d3.json("data/state/goa.json"), 
    d3.json("data/state/gujarat.json"),
    d3.json("data/state/haryana.json"), 
    d3.json("data/state/himachalpradesh.json"),
    d3.json("data/state/jammukashmir.json"), 
    d3.json("data/state/jharkhand.json"),
    d3.json("data/state/karnataka.json"), 
    d3.json("data/state/kerala.json"),
    d3.json("data/state/ladakh.json"), 
    d3.json("data/state/lakshadweep.json"),
    d3.json("data/state/madhyapradesh.json"), 
    d3.json("data/state/maharashtra.json"),
    d3.json("data/state/manipur.json"), 
    d3.json("data/state/meghalaya.json"),
    d3.json("data/state/mizoram.json"), 
    d3.json("data/state/nagaland.json"),
    d3.json("data/state/odisha.json"), 
    d3.json("data/state/puducherry.json"),
    d3.json("data/state/punjab.json"), 
    d3.json("data/state/rajasthan.json"),
    d3.json("data/state/sikkim.json"), 
    d3.json("data/state/tamilnadu.json"),
    d3.json("data/state/telangana.json"),
    d3.json("data/state/tripura.json"),
    d3.json("data/state/uttarakhand.json"), 
    d3.json("data/state/uttarpradesh.json"),
    d3.json("data/state/westbengal.json"),
    d3.json("data/india_states.json"),               
    d3.csv("data/district_rainfall_2021.csv", function(d) {
      let rain_annual = +d.Annual;
      let rain_state = '';
      
      rain_dist_recorded.set(d.DISTRICT_CODE,d);      
      
      switch (true) {
          case (rain_annual <= 361):
              rain_state = "Large-Deficient";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state);  
              break;
          case (rain_annual > 361  && rain_annual <= 681):
              rain_state = "Deficient";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state); 
              break;
          case (rain_annual > 681  && rain_annual <= 1641):
              rain_state = "Normal";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state); 
              break;
          case (rain_annual > 1641  && rain_annual <= 2601 ):
              rain_state = "Excess";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state);  
              break;
          case (rain_annual > 2601):
              rain_state = "Large-Excess";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state);  
              break;
          default:
              rain_state = "No Data";
              rain_dist_status.set(d.DISTRICT_CODE, rain_state);
              break;  
      }
     
      
         
     }),
    d3.csv("data/state_rainfall_2021.csv",function(d){
      unique_states.add(d.State); 

      let rain_annual = +d.Annual;
      let rain_state = '';      
      rain_dist_recorded.set(d.STATE_CODE,d);


      switch (true) {
          case (rain_annual <= 361):
              rain_state = "Large-Deficient";
              rain_st_status.set(d.STATE_CODE, rain_state);  
              break;
          case (rain_annual > 361  && rain_annual <= 681):
              rain_state = "Deficient";
              rain_st_status.set(d.STATE_CODE, rain_state); 
              break;
          case (rain_annual > 681  && rain_annual <= 1641):
              rain_state = "Normal";
              rain_st_status.set(d.STATE_CODE, rain_state); 
              break;
          case (rain_annual > 1641  && rain_annual <= 2601 ):
              rain_state = "Excess";
              rain_st_status.set(d.STATE_CODE, rain_state);  
              break;
          case (rain_annual > 2601):
              rain_state = "Large-Excess";
              rain_st_status.set(d.STATE_CODE, rain_state);  
              break;
          default:
              rain_state = "No Data";
              rain_st_status.set(d.STATE_CODE, rain_state);
              break;  
      }
    
    })
  ]

Promise.all(promises).then(function(data){
        
    // console.log(rain_dist_status)
   
    //load state drop-down
    let unique_states_array = Array.from(unique_states).sort();
    
    d3.select("#select-state")
          .selectAll("state-options")
          .data(unique_states_array)
          .enter()
            .append("option")
            .text(function(d){return d;})
            .attr("value",function(d){return d;})
            .property("selected",function(d){return d == defaultOptionName;})

    //console.log(data);

    state_json_files.set("ANDAMAN AND NICOBAR",data[0]);
    state_json_files.set("ANDHRA PRADESH",data[1]);
    state_json_files.set("ARUNACHAL PRADESH",data[2]);
    state_json_files.set("ASSAM",data[3]);

    state_json_files.set("BIHAR",data[4]);
    state_json_files.set("CHANDIGARH",data[5]);
    state_json_files.set("CHHATTISGARH",data[6]);
    //state_json_files.set("DADAR AND NAGAR HAVELI",data[7]);

    state_json_files.set("DELHI",data[8]);
    state_json_files.set("GOA",data[9]);
    state_json_files.set("GUJARAT",data[10]);
    state_json_files.set("HARYANA",data[11]);

    state_json_files.set("HIMACHAL PRADESH",data[12]);
    state_json_files.set("JAMMU AND KASHMIR",data[13]);
    state_json_files.set("JHARKHAND",data[14]);
    state_json_files.set("KARNATAKA",data[15]);

    state_json_files.set("KERALA",data[16]);
    state_json_files.set("LADAKH",data[17]);
    state_json_files.set("LAKSHADWEEP",data[18]);
    state_json_files.set("MADHYA PRADESH",data[19]);

    state_json_files.set("MAHARASHTRA",data[20]);
    state_json_files.set("MANIPUR",data[21]);
    state_json_files.set("MEGHALAYA",data[22]);
    state_json_files.set("MIZORAM",data[23]);

    state_json_files.set("NAGALAND",data[24]);
    state_json_files.set("ODISHA",data[25]);
    state_json_files.set("PUDUCHERRY",data[26]);
    state_json_files.set("PUNJAB",data[27]);

    state_json_files.set("RAJASTHAN",data[28]);
    state_json_files.set("SIKKIM",data[29]);
    state_json_files.set("TAMIL NADU",data[30]);
    state_json_files.set("TELANGANA",data[31]);

    state_json_files.set("TRIPURA",data[32]);
    state_json_files.set("UTTARAKHAND",data[33]);
    state_json_files.set("UTTAR PRADESH",data[34]);
    state_json_files.set("WEST BENGAL",data[35]);


    plot_state_map(defaultOptionName);
    plot_country_map(data[36],defaultOptionName);

}).catch(function(error){
    console.log(error);
});





//process initial data func
function plot_state_map(OptionName) {

    // console.log("Inside plot_state_map with "+OptionName);   

    var state_map = state_json_files.get(OptionName);
    var state_str = OptionName.toLowerCase().replaceAll(" ","-");
    // console.log(state_str);
    var state_map_geometry = state_map.objects[state_str];
    //var state_map_geometry = state_geometry.get(OptionName);
    

    // console.log(state_map);
    // console.log(state_map_geometry);

    var feature_collection = topojson.feature(state_map,state_map_geometry).features;
    var bounds = d3.geoBounds(topojson.feature(state_map,state_map_geometry));
    var center = d3.geoCentroid(topojson.feature(state_map,state_map_geometry));   
    
    // console.log(feature_collection);

    var proj = d3.geoMercator().translate([WD/2,HT/2])
    var path = d3.geoPath().projection(proj);;

    // Compute the angular distance between bound corners
    var distance = d3.geoDistance(bounds[0], bounds[1]),
    scale = (HT+300) / distance / Math.sqrt(2);

    // Update the projection scale and centroid
    proj.scale(scale).center(center);
    
    //clear div
    d3.select("#scene5_district_state_map").selectAll('*').remove();

    //setup svg
    var svg = d3.select("#scene5_district_state_map")
             .append("svg")                
                 .attr("width",WD)
                 .attr("height",HT)
             .append("g")
              .attr("class","geo");
              


    //load state map
    svg.selectAll("path")
        .data(feature_collection)
        .enter().append("path")             
             .attr("d", path)
             .attr("transform", "scale(0.9,0.9) translate(50,50)")
             .attr("class",OptionName)             
             .attr('fill',function(d) { return rain_status_colorscale(rain_dist_status.get(d.properties.dt_code)); })            
             .on('mouseover', function onMouseOver(event,d){
        
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.85')
                
                tooltip_state_div.transition()
                     .duration(50)
                     .style("opacity", 1)
            
              
              }    ) 
             .on('mousemove',function(event,d){
  
                tooltip_state_div.html("<span>District: " + d.properties.district + "<br/>" + "State: " + d.properties.st_nm + "<br /> Annual Rain: "+
                    (rain_dist_recorded.get(d.properties.dt_code).Annual == "" ? ("No Data Available") : (rain_dist_recorded.get(d.properties.dt_code).Annual) + " mm")
                    +"</span>")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 15) + "px")
                            .transition()
                            .duration(200) // ms
                            .style("opacity", 1)   
 
                ;})               
             .on('mouseout', function onMouseOut(event,d){
 
                d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1')
                 
                 tooltip_state_div.transition()
                 .duration(50)
                 .style("opacity", 0)
                 
                 
               
                 }) 


    // remove old elements
    svg.exit().remove();            


   //Add Legends


// Add one rect in the legend for each name.   
    svg.selectAll("legend_rect")
    .data(keys)
    .enter()
    .append("rect")    
    .attr("x", 10)
    .attr("y", function(d,i){ return 10 + i*25 -10}) 
    .attr("width", 15)
    .attr("height",15)
    .attr("stroke","grey")
    .attr("stroke-width",0.7)
    .style("fill", function(d){ return rain_status_colorscale(d)})


// Add text for each rect      
    svg.selectAll("legend_label")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 35)
    .attr("y", function(d,i){ return 10 + i*25}) 
    .style("fill", function(d){ return rain_status_colorscale(d)})
    .text(function(d){ return d})
    .attr('font-size',12)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("stroke","grey")
    .attr("stroke-width",0.7) 


};


function plot_country_map(mapdata,initialselection) {

  var projection = d3.geoMercator().fitSize([WD*0.90, HT*0.90], mapdata);
  var path = d3.geoPath().projection(projection);


const countrysvg = d3.select('#scene5_district_country_map') 
  .append('svg')
    .attr('class', 'India') 
    .attr('width', width)
    .attr('height', height)
  
var g = countrysvg.append("g");

//  console.log(mapdata.features[0].properties.ST_NM);

var feature_arr = mapdata.features;

countrysvg.selectAll("path")
  .data(mapdata.features)
  .enter()
  .append('path')
  .attr('id',function(d,i) {return feature_arr[i].properties.ST_NM.replaceAll(" ","-");})
  .attr('class','INDIA')
  .attr('d', path)
  .attr("fill","lightgrey")
  .attr("stroke","#95A5A6")
  .on('mouseover', function onMouseOver(event,d){
        
    d3.select(this).transition()
         .duration('50')
         .attr('opacity', '.85')
    
    tooltip_country_div.transition()
         .duration(50)
         .style("opacity", 1)

  
  }    ) 
  .on('mousemove',function(event,d){
  
    tooltip_country_div.html("<span>State: " + d.properties.ST_NM+"</span>")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", 1)   

    ;})               
  .on('mouseout', function(event,d){
 
    d3.select(this).transition()
     .duration('50')
     .attr('opacity', '1')
     
    tooltip_country_div.transition()
     .duration(50)
     .style("opacity", 0)

     }) 


//Initial selection
   d3.select('#'+initialselection)                
      .attr('fill','grey');



    // Affordance 

var aff_svg = d3.select("body")
    .select("#scene5_district_country_map")
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
    .attr("transform", "scale(0.4,0.4) translate("+1.5*WD+",20)")
    
    affordance_g.append("text")
    .attr("id","affordance-txt")
    .attr("x", WD-290)
    .attr("y", margin.top) 
    .style("fill", "grey")
    .text("Hover mouse over either map to see tooltip")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("stroke","black")
    .attr("stroke-width",0.3)
    .attr("font-style","italic")



};


 


//Change Events Handling (State Dropdown)

d3.select("#select-state").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // console.log("selected " + selectedOption);
    // run the updateChart function with this selected option
    //select_state_update(selectedOption)

    plot_state_map(selectedOption); 

    //clear last
    d3.select('.India')
      .selectAll('path')
      .attr('fill','lightgrey');

   let stnm = "#"+selectedOption.replaceAll(" ","-");
//    console.log(stnm);

    //highlight select state 
    d3.select(stnm)
       .attr('fill','grey')
       
  })     


