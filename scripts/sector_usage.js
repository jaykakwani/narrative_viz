var WD = 600, HT = 400
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom
var radius = Math.min(width, height) / 2 - margin.left

var color = ['pink','lightyellow','lightgreen','lightcyan','lightblue','violet'];
var pie = d3.pie().value(function(d){return +d.Usage;});
var arc = d3.arc().innerRadius(0).outerRadius(radius);

var svg = d3.select("#scene2_sector_usage")
            .append("svg")
                .attr("width",WD)
                .attr("height",HT)
            .append("g")
                .attr("transform","translate("+width/2+","+height/2+")")

//tooltip
var tooltip_div = d3.select("body").append("div")
     .attr("id", "tooltip_sector_usage")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);                

d3.csv("data/sector_usage.csv").then(function(data){
    
    data.forEach(function(d) {
        d.Usage = +d.Usage.replaceAll('%','');
        });
    // const color = d3.scaleOrdinal()
    //                 .domain(data)
    //         .range(["#0072BC","#8EBEFF"])

    console.log(data);
    console.log(pie(data));
   
    svg.selectAll('path')     
      .data(pie(data))
      .enter()
      .append('path')
          .attr("d",arc)
          .attr("fill",function(d,i){return color[i];})
          .on('mouseover', onMouseOver) 
          .on('mousemove',onMouseMove)               
          .on('mouseout', onMouseOut);   



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
  
  tooltip_div.html("<span>Sector: " + d.data.Sector + "<br/>" + "Usage: " + d.data.Usage + " %<br /></span>")
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

    });
 