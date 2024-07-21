/*
*   Scene 2 - Create chart for Per Capita water Usage
*
*
*/
{
let WD = 1000, HT = 550
let margin = { left: 20, right: 120, top: 20, bottom: 50 }
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
        .attr("id","per_capita_water_chart")            
        .attr("width", WD)
        .attr("height", HT)
        .attr("transform","scale("+0.9+","+0.9+")");


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
   .attr("fill-opacity","0")   
   .attr("transform","translate("+WD/(2*data.length)+",0)")       
   .attr("d",function(d){return d.dpath;})   
   .attr("fill","url(#zgradient)")

g.selectAll('path')
  .transition()        
  .duration(1000)    
  .attr("fill-opacity","1")   
   
g.selectAll('path')   
   .on('mouseover', onMouseOver) 
   .on('mousemove',onMouseMove)               
   .on('mouseout', onMouseOut)

//Mouseover 
function onMouseOver(event,d){
   
           d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
                .attr("fill","dodgerblue")
           
          //  tooltip_div.transition()
          //       .duration(50)
          //       .style("opacity", 1)
  
}     

//Mouse move
function onMouseMove(event,d){
   //console.log(d);
  //  tooltip_div.html("<span> Per Capita Water Availability <br/>" + d.Per_Capita_Water + " m³ "  + "<br /></span>")
  //       .style("left", (event.pageX + 10) + "px")
  //       .style("top", (event.pageY - 15) + "px")
  //       .transition()
  //        .duration(200) // ms         
  //        .style("opacity", 1)   
}


//Mouse Out
function onMouseOut(event,d){
d3.select(this).transition()
   .duration('50')
   .attr('opacity', '1')
   .attr("fill","url(#zgradient)")

// tooltip_div.transition()
//    .duration(50)
//    .style("opacity", 0)
}

   
   

glabel = svg.append('g').attr('class','row-label'); 

// gw text label
glabel.selectAll('text')
    .data(darray)   
    .enter()             
    .append("text")
        .attr("class", "water-drop-label")
        .attr("transform","translate("+WD/(2*data.length)+",0)")
        .attr("x", function(d) {return d.x;})
        // .attr("y", 300)
        .attr("fill","black")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle");
        //.text("Water Drops");
        //.text(function(d) {return d.Per_Capita_Water}) 

glabel.selectAll('text')
    .data(data)
    .attr("y", 350)
    .text(function(d){return d.Per_Capita_Water + " m³";}) ;   
    
    


gtxt = svg.append('g').attr('class','row-text'); 

//year text label
gtxt.selectAll('text')
    .data(darray)   
    .enter()             
    .append("text")
        .attr("class", "x axis-label")
        .attr("transform","translate("+WD/(2*data.length)+",0)")
        .attr("x", function(d) {return d.x;})        
        .attr("fill","grey")
        .attr("font-size", "20px")
        .attr("text-anchor", "middle");

gtxt.selectAll('text')
    .data(data)
    .attr("y", function(d) {return (HT - margin.bottom);})
    .text(function(d){return d.Year;}) ;   
 
// Annotation
const annotations = [
  {
    note: {
      label: "Less than 1700 cubic meter is considered as water stressed condition",
      title: "Fresh water availability has dropped more than 70% since 1951",
      align: "right",  // try right or left
      wrap: 250,  // try something smaller to see text split in several lines
      padding: 10 // More = text lower
    },
    connector: {
       end: "dot",        // Can be none, or arrow or dot
       type: "line",      // "curve" with point
       //point: 3,  //goes with curve
       lineType : "vertical",    // ?? don't know what it does
       endScale: 2     // dot size
     },
    color: ["grey"],
    // data: { Year: "2021", Per_Capita_Water: 1486 },
    x: WD-90,
    y: HT-250,
    dx: -WD/10,
    dy: -HT/5,
 
  }
]

// Add annotation to the chart
const makeAnnotations = d3.annotation()
  .annotations(annotations)
d3.select("#per_capita_water_chart")
  .select("g")
  .append("g")
  .call(makeAnnotations)  

d3.select("#subject")
  .selectAll("path") 
  .attr("pointer-events","none")  

 //Add legend
const legend = d3.select("#per_capita_water_chart")
// .select("g")   
.append("g")
  .attr("id","legend")

legend.append('rect')
  .attr("x", width-margin.right)
  .attr("y", 30)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "lightskyblue");

legend.append("text")
  .attr("x", width-margin.right+30)
  .attr("y", 45)
  .style("color","grey")
  .style("text-anchor", "start")
  .text("Per Capita Water Availability(m³)"); 


//   // Affordance 

// var aff_svg = d3.select("body")
// .select("#scene2_per_capita_water_usage")
// .append("svg")
//     .attr("id","svg-affordance")             
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", 30);

// var affordance_g = aff_svg.append("g")
//           .attr("class","accordance");

// affordance_g.append("path")
// .attr("d","M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z")
// .attr("id","affordance-logo")
// .attr("stroke","grey")
// .attr("stroke-width",0.7)
// .style("fill", "grey")
// .attr("transform", "scale(0.4,0.4) translate("+1.7*WD+",0)")

// affordance_g.append("text")
// .attr("id","affordance-txt")
// .attr("x", WD-290)
// .attr("y", margin.top-10) 
// .style("fill", "grey")
// .text("Hover mouse over water drop to see tooltip")
// .attr("text-anchor", "left")
// .style("alignment-baseline", "middle")
// .attr("stroke","black")
// .attr("stroke-width",0.3)
// .attr("font-style","italic")


});
}