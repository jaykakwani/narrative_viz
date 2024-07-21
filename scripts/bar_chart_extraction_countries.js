/*
*   Scene - 1 :Create Bar chart for comparing GW Extraction Countries
*
*
*/

const WD = 1000, HT = 400
const margin = { left: 100, right: 50, top: 10, bottom: 40 }

const width = WD - margin.left - margin.right
const height = HT - margin.top - margin.bottom

var svg = d3.select("body")
            .select("#intro-bar-chart")
            .append("svg")
                .attr("id","extract_countries_bar_chart")             
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

var rect_g = svg.append("g")
            .attr("width", width)
            .attr("height", height)    
            .attr("transform","translate("+margin.left+","+margin.top+")");

// x label             
rect_g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom)
    .attr("font-size", "17px")
    .attr("text-anchor", "middle")
    //.text("Countries")
    
    
// Y label  s
rect_g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (height/2 ))
  .attr("y",-margin.left+45)
  .attr("font-size", "17px")
  .attr("fill","grey")
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


     
// Affordance 

var aff_svg = d3.select("body")
            .select("#intro-bar-chart")
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
            .attr("transform", "scale(0.4,0.4) translate("+1.7*WD+",0)")

affordance_g.append("text")
            .attr("id","affordance-txt")
            .attr("x", WD-290)
            .attr("y", margin.top+2) 
            .style("fill", "grey")
            .text("Hover mouse over bars to see tooltip")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("stroke","black")
            .attr("stroke-width",0.3)
            .attr("font-style","italic")
        
                   
            



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
        .transition()
        .ease(d3.easeLinear)        
        .duration(1000)       
        .attr("height",function(d,i) {return height - ys(d.Extraction);})        
        .attr("fill","lightskyblue")
        
        
rect_g.selectAll('rect')        
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
        .call(d3.axisLeft(ys))
        .style("font-size","15px")
        .style("font","sans-serif")
        .style("color","grey");   

svg.append("g")
        .attr("transform","translate("+margin.left+","+(height+margin.top)+")")
        .call(d3.axisBottom(xs))
        .style("font-size","15px")
        .style("font","sans-serif")
        .style("color","grey");      
        
        
// Annotation
const annotations = [
  {
    note: {
      label: "More than China and USA combined",
      title: "India is world's largest groundwater user at 250 KM³ annually.",
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
    x: xs("India")+30,
    y: 30,
    dx: 120,
    dy: 60
 
  }
]

// Add annotation to the chart
const makeAnnotations = d3.annotation()
  .annotations(annotations)

d3.select("#extract_countries_bar_chart")
  .select("g")   
  .append("g")
  // .attr("transform","translate("+margin.left+","+margin.top+")")
  .call(makeAnnotations)           

  
//Add legend
const legend = d3.select("#extract_countries_bar_chart")
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
    .text("Water Extraction (KM³)");



}).catch(error => {
        console.log(error);
    } );