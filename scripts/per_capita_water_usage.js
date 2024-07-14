/*
*   Scene 2 - Create chart for Per Capita water Usage
*
*
*/
{
let WD = 600, HT = 400
let margin = { left: 20, right: 20, top: 20, bottom: 50 }
let width = WD - margin.left - margin.right
let height = HT - margin.top - margin.bottom

//tooltip
var tooltip_div = d3.select("body").append("div")
     .attr("id", "tooltip_per_capita_water")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);

d3.csv("data/per_capita_water_usage.csv").then(function(data){
   
  data.forEach(function(d) {
    d.Per_Capita_Water = +d.Per_Capita_Water;
    });
  
//console.log(data);

var ys = d3.scaleLinear().domain(d3.extent(data,d=>d.Per_Capita_Water)).range([0,HT])
var xs = d3.scaleBand().domain(d3.extent(data,d=>d.Year)).range([0,width-2*margin])

// create data array to hold water drops paths
function darray(width,height,click,rawdata) {

  var cell_width = width/rawdata.length;

  var data = new Array();
	var xpos = 0; 
	var ypos = 0;
  var x_l_anchor = cell_width;
  var y_anchor = 0;
  var x_r_anchor = -cell_width; 
  //var y_r_anchor = 0;
		
	// iterate for rows	
	for (var row = 0; row < rawdata.length; row++) {
		//data.push( new Array() );
    var path = d3.path();         
    ypos = (HT - ys(rawdata[row].Per_Capita_Water))/2;
    y_anchor = ys(rawdata[row].Per_Capita_Water) + 1.5 * ypos ;    
    path.moveTo(xpos,ypos);
    path.bezierCurveTo(x_l_anchor,y_anchor,x_r_anchor,y_anchor,xpos,ypos);
    path.closePath();
    
    //console.log("for -->"+rawdata[row].Per_Capita_Water+" yscale="+ys(rawdata[row].Per_Capita_Water));
    //console.log("(xpos,ypos)--> ("+xpos+","+ypos+")");    
    //console.log("(x_l_anchor,y_anchor)--> ("+x_l_anchor+","+y_anchor+")");    
    //console.log("y_anchor--> "+y_anchor);
   // console.log("(width,height)--> ("+width+","+height+")");     


    data.push({
      x: xpos,
      y: ypos,
      y_anchor: y_anchor,
      width: width,
      height: height,
      click: click,
      Per_Capita_Water: rawdata[row].Per_Capita_Water,
      dpath: path.toString()
    })
		
    xpos += cell_width;
    x_l_anchor += cell_width;
    x_r_anchor += cell_width;
	}
	return data;
}

  var darray = darray(WD,HT,0,data);
 // console.log(darray);


        
//transition
const t = d3.transition().duration(1000)

var svg = d3.select("body")
    .select("#scene2_per_capita_water_usage")
    .append("svg")            
        .attr("width", WD)
        .attr("height", HT);


var defs = svg.append("defs");

var gradient = defs.append("linearGradient")    
                  .attr("id", "zgradient")
                  .attr("gradientTransform", "rotate(0 0.5 0.5)")
                  .attr("x1","0%")
                  .attr("y1","0%")
                  .attr("x2","100%")
                  .attr("y2","0")    
                  .attr("spreadMethod", "reflect");
                  
// var colours = ["#0771B8", "#0F7AC0", "#1E97C4", "#2DA7C7", 
//   "#3CB7CB", "#4BC7CF"];   

var colours = ["#C9E9F5", "#BEE1F1", "#B2D8EE", "#3b9dff"];

gradient.selectAll(".stop")
  .data(colours)
  .enter().append("stop")
  .attr("offset", function(d,i) { return i/(colours.length-1); })
  .attr("stop-color", function(d) { return d; });  


// gradient.append("stop")
//           .attr("stop-opacity","1")
//           .attr("stop-color","rgba(240, 255, 255)")
//           .attr("offset","0")

// gradient.append("stop")
//           .attr("stop-opacity","1")
//           .attr("stop-color","rgba(137, 216, 230)")
//           .attr("offset","0")
          
// gradient.append("stop")
//           .attr("stop-opacity","1")
//           .attr("stop-color","rgba(0, 150, 255)")
//           .attr("offset","0.886015625")
       

g = svg.append('g').attr('class','row'); 

g.selectAll('path')
 .data(darray)
 .enter()
 .append('path')
   //.attr("fill-opacity","0")   
   .attr("transform","translate("+WD/(2*data.length)+",0)")
   .attr("d",function(d){return d.dpath;})
   .attr("fill","url(#zgradient)")
   .on('mouseover', onMouseOver) 
   .on('mousemove',onMouseMove)               
   .on('mouseout', onMouseOut)

//Mouseover 
function onMouseOver(event,d){
   
           d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
                .attr("fill","dodgerblue")
           
           tooltip_div.transition()
                .duration(50)
                .style("opacity", 1)
  
}     

//Mouse move
function onMouseMove(event,d){
   //console.log(d);
   tooltip_div.html("<span> Per Capita Water Availability <br/>" + d.Per_Capita_Water + " m³ "  + "<br /></span>")
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
   .attr("fill","url(#zgradient)")

tooltip_div.transition()
   .duration(50)
   .style("opacity", 0)
}

   
   

// glabel = svg.append('g').attr('class','row-label'); 

// // gw text label
// glabel.selectAll('text')
//     .data(darray)   
//     .enter()             
//     .append("text")
//         .attr("class", "water-drop-label")
//         .attr("transform","translate("+WD/(2*data.length)+",0)")
//         .attr("x", function(d) {return d.x;})
//         .attr("y", function(d) {return d.y_anchor;})
//         .attr("fill","black")
//         .attr("font-size", "15px")
//         .attr("text-anchor", "middle");
//         //.text("Water Drops");
//         //.text(function(d) {return d.Per_Capita_Water}) 

// glabel.selectAll('text')
//     .data(data)
//     .attr("y", function(d) {return d.Per_Capita_Water/24;})
//     .text(function(d){return d.Per_Capita_Water + " m³";}) ;       

gtxt = svg.append('g').attr('class','row-text'); 

//year text label
gtxt.selectAll('text')
    .data(darray)   
    .enter()             
    .append("text")
        .attr("class", "x axis-label")
        .attr("transform","translate("+WD/(2*data.length)+",0)")
        .attr("x", function(d) {return d.x;})        
        .attr("fill","red")
        .attr("font-size", "20px")
        .attr("text-anchor", "middle");

gtxt.selectAll('text')
    .data(data)
    .attr("y", function(d) {return (HT - margin.bottom);})
    .text(function(d){return d.Year;}) ;   
 


});
}