var WD = 800, HT = 600
var margin = { left: 20, right: 20, top: 20, bottom: 50 }
var width = WD - margin.left - margin.right
var height = HT - margin.top - margin.bottom
var radius = Math.min(width, height) / 2 - margin.left

var color = ['dodgerblue','yellow','lightgreen','cyan','lightblue','violet'];
var pie = d3.pie().sort(null).value(function(d){return +d.Usage;});
var arc = d3.arc().innerRadius(0).outerRadius(radius * 0.75);
var hoverarc = d3.arc().innerRadius(0).outerRadius(radius * 0.85);
var arclabel = d3.arc().innerRadius(0).outerRadius(radius *  2.1);

var svg = d3.select("#scene3_sector_usage")
            .append("svg")
                .attr("width",WD)
                .attr("height",HT)
            .append("g")
                .attr("transform","translate("+width/2+","+height * 0.6+")")

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

    // console.log(data);
    // console.log(pie(data));
   
    svg.selectAll('pie-path')     
      .data(pie(data))
      .enter()
      .append('path')
          .attr("d",arc)
          .attr("fill",function(d,i){return color[i];})
          .style('stroke','white')
          .style('stroke-width',2)
          .on('mouseover', onMouseOver) 
          .on('mousemove',onMouseMove)               
          .on('mouseout', onMouseOut); 



    const labels =   svg.selectAll('pie-txt')
          .data(pie(data))
          .enter()
          .append('text')
        //   .text(function(d){ return d.data.Sector;})
          .style("text-anchor", "middle") 
          .style("alignment-baseline", "middle")
          .style("font-size", "20px")
          .attr("transform", function(d) {return "translate(" + arclabel.centroid(d) + ") " })
          
    labels.append("tspan")
        .attr('y', '-0.6em')
        .attr('x', 0)
        // .style('font-weight', 'bold')
        .text(function(d) {return d.data.Sector}); 
        
    labels.append('tspan')
        .attr('y', '0.6em')
        .attr('x', 0)
        .text(function(d) { return d.data.Usage + "%"});

// Annotation
const annotations = [
    {
      note: {
        label: "The trend hasn't changed much in the last few years",
        title: "Agriculture is the largest user of water in India",
        align: "left",  // right or left
        wrap: 250,   
        padding: 10  // More = text lower
      },
      connector: {
         end: "dot",        // Can be none, or arrow or dot
         type: "line",      // "curve" with point
         //point: 3,  //goes with curve
         lineType : "vertical",    
         endScale: 2     // dot size
       },
      color: ["grey"],
      x: 100,
      y: -50,
      dx: 60,
      dy: -150
   
    }
  ]
  
  // Add annotation to the chart
  const makeAnnotations = d3.annotation()
    .annotations(annotations)
  
  d3.select("#scene3_sector_usage")
    .select("g")   
    .append("g")
    // .attr("transform","translate("+margin.left+","+margin.top+")")
    .call(makeAnnotations)  


//Mouseover 
function onMouseOver(event,d){
        
    d3.select(this).transition()
         .duration(50)
         .attr('opacity', '.85')
         .transition()
         .duration(500)
         .attr('d',hoverarc)



    
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
  .transition()
         .duration(500)
         .attr('d',arc)
  
  tooltip_div.transition()
  .duration(50)
  .style("opacity", 0)
  }     
  
    // Affordance 

var aff_svg = d3.select("body")
.select("#scene3_sector_usage")
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
.attr("transform", "scale(0.4,0.4) translate("+1.5*WD+",0)")

affordance_g.append("text")
.attr("id","affordance-txt")
.attr("x", WD-290)
.attr("y", margin.top-10) 
.style("fill", "grey")
.text("Hover mouse over pie chart to see tooltip")
.attr("text-anchor", "left")
.style("alignment-baseline", "middle")
.attr("stroke","black")
.attr("stroke-width",0.3)
.attr("font-style","italic")

    });
 