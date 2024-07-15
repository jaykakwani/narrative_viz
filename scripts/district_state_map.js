
//config var and add svg


var WD = 600, HT = 600
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom

//Generate Initial

var state_json_files = new Map();
var state_geometry = new Map();
var unique_states = new Set();
var defaultOptionName = "ASSAM";

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
    d3.csv("data/district_rainfall_2021.csv"),
    d3.csv("data/state_rainfall_2021.csv",function(d){unique_states.add(d.State); })
  ]

Promise.all(promises).then(function(data){
        
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
    plot_country_map(data[36]);

}).catch(function(error){
    console.log(error);
});

function plot_country_map(mapdata) {

    var projection = d3.geoMercator().fitSize([WD*0.90, HT*0.90], mapdata);
    var path = d3.geoPath().projection(projection);


 const countrysvg = d3.select('#scene4_district_country_map') 
    .append('svg')
      .attr('class', 'India') 
      .attr('width', width)
      .attr('height', height)
    
  var g = countrysvg.append("g");

  countrysvg.selectAll("path")
    .data(mapdata.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr("fill","grey")
  
  };



//process initial data func
function plot_state_map(OptionName) {

    console.log("Inside plot_state_map with "+OptionName);   

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
    d3.select("#scene4_district_state_map").selectAll('*').remove();

    //setup svg
    var svg = d3.select("#scene4_district_state_map")
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
             .attr("class",OptionName)
             //.attr("class",function(d) { return d.properties.st_nm.toUpperCase(); })
             .style("fill", "grey")
             //.attr('fill',function(d) { return gw_status_colorscale(gw_dist_status.get(d.properties.dt_code)); })
            //  .on('mouseover', onMouseOver) 
            //  .on('mousemove',onMouseMove)               
            //  .on('mouseout', onMouseOut) 
            
            
    // remove old elements
    svg.exit().remove();            

};




//Change Events Handling (State Dropdown)

d3.select("#select-state").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    console.log(selectedOption);
    // run the updateChart function with this selected option
    //select_state_update(selectedOption)
    plot_state_map(selectedOption);
  })     


