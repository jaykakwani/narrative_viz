/*
*   Scene - 1 :Create Bar chart for comparing GW Extraction Countries
*
*
*/

const WD = 600, HT = 400
const margin = { left: 50, right: 10, top: 10, bottom: 40 }

const width = WD - margin.left - margin.right
const height = HT - margin.top - margin.bottom

var svg = d3.select("body")
            .select("#intro-bar-chart")
            .append("svg")            
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

var rect_g = svg.append("g")
            .attr("width", width)
            .attr("height", height)    
            .attr("transform","translate("+margin.left+","+margin.top+")");

// x label             
rect_g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .text("Countries")
    
    
// Y label  s
rect_g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (height / 2))
  .attr("y",-margin.left+15)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Water Extraction (KM³)")    

//tooltip
var tooltip_div = d3.select("body").append("div")
     .attr("id", "tooltip_gw_extract_bar")
     .attr("class","hidden")
     .attr("visbility","hidden")     
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")
     .style("opacity", 0);

     


d3.csv("data/extraction_countries.csv").then(data => {        
        data.forEach(d => {
          d.Extraction = Number(d.Extraction)
        });
       // console.log(data);


const xs = d3.scaleBand()
            .domain(data.map( d => d.Country))
            .range([0,width])
            .paddingInner(0.3)
            .paddingOuter(0.3)

const ys = d3.scaleLinear().domain([0,d3.max(data, d => d.Extraction)]).range([height,0])

 
rect_g.selectAll('rect')
   .data(data)
   .enter()
   .append('rect')
        .attr("class","gw_extract_bar")
        .attr("x",function(d,i) {return xs(d.Country);})
        .attr('y',function(d,i) {return ys(d.Extraction);})
        .attr("width",xs.bandwidth())
        .attr("height",function(d,i) {return height - ys(d.Extraction);})
        .attr("fill","lightskyblue")
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
        
        tooltip_div.html("<span>Country : " + d.Country + "<br/>" + "Water Extraction  : " + d.Extraction + " KM³ <br/>"  + "<br /></span>")
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

svg.append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .call(d3.axisLeft(ys));

svg.append("g")
        .attr("transform","translate("+margin.left+","+(height+margin.top)+")")
        .call(d3.axisBottom(xs));        
  

}).catch(error => {
        console.log(error);
    } );