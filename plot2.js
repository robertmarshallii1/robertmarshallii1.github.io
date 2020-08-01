async function decadeplots() {
    const d50 = await d3.csv('avyAct50s.csv');
    const d60 = await d3.csv('avyAct60s.csv');
    const d70 = await d3.csv('avyAct70s.csv');
    const d80 = await d3.csv('avyAct80s.csv');
    const d90 = await d3.csv('avyAct90s.csv');
    const d00 = await d3.csv('avyAct00s.csv');
    const d10 = await d3.csv('avyAct10s.csv');

    data = d50;
    data = data.slice(0,10);

    var w = window.screen.width*0.8;
    var h = window.screen.height*0.5; 
    var margin = window.screen.height*0.1;
    var xrange = [0,w-2*margin];
    var ydomain = [0,120]
    var yrange = [h-2*margin,0];
    // var ticks = 
    var ys = d3.scaleLinear().domain(ydomain).range(yrange);
    var cs = d3.scaleLinear().domain(ydomain).range(['#4E96A6','#D99E32']);
    var tdel = 50;
    var tt = 1500;

    d3.select('.right')
    .attr('margin-top',margin)

    // Initialize svg element
    svg = d3.select('#plot2');
    svg.attr('height', h + 2*margin)
    .attr('width', w + 2 * margin)

    // Initialize plot with 50s 

    var xs = d3.scaleBand()
          .domain(data.map(function(d) {return d['Activity'];}))
          .range(xrange)

    svg.append('g')
    .attr('transform','translate('+margin+','+margin+')')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y',h - 2*margin)
    .attr('height',0)
    .attr('x',function(d,i) {return xs(d.Activity);})
    .attr('width',xs.bandwidth())
    .attr('fill','#4E96A6')
    .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
    .attr('y',function(d,i) {return ys(parseInt(d.KL));})
    .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.KL));})
    .attr('fill',function(d,i) {return cs(parseInt(d.KL));})

    // tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id','ttp')
        .offset([-10, 0])
        .html(function(d) {
            s = '<strong>Activity: </strong>' + d.Activity + '</br><strong>Deaths: </strong>' + d.KL + '</br>'
            return s;})

    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .attr('id','ttb')
    .call(tip)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr('id','ttips')
        .attr('y',function(d,i) {return ys(parseInt(d.KL)+1);})
        .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d.KL)+1);})
        .attr('x',function(d,i) {return xs(d.Activity);})
        .attr('width',xs.bandwidth())
        .attr('opacity',0.0)
        .attr('stroke-width',0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
   
    // Axes

    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .call(d3.axisLeft(ys))

    svg.append('g')
        .attr('transform','translate('+margin+','+(h-margin)+')')
        .call(d3.axisBottom(xs)); // .tickValues(ticks));

    // Axis labels
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0.5*margin)
    .attr("x",0 - (h/2))
    .attr("dy", "1em")
    .style('text-anchor', 'middle')
    .style('font','15px sans-serif')
    .text('Deaths');

    svg.append("text")             
    .attr("transform","translate("+(w/2)+" ,"+(h - 0.5*margin)+")")
    .style("text-anchor", "middle")
    .style('font','15px sans-serif')
    .text('Activity');

    // Title
    svg.append("text")
        .attr('id','plotitle')
        .attr("x", (w / 2))             
        .attr("y", 0.5*margin)
        .attr("text-anchor", "middle")  
        .style('font','15px "Lato", sans-serif')
        .style('letter-spacing','3px')
        .style('text-transform','uppercase')
        .text("Avalanche Deaths vs Activity: 1951-1959");

    // Annotation
    data = d50;
    svg.append("text")
        .attr('transform','translate('+margin+','+margin+')')
        .attr('id','ant')
        .attr("x", xs.bandwidth()*10)             
        .attr("y", ys(110))
        .attr("text-anchor", "end")  
        .style('font','15px sans-serif')
        .data(data)
        .text('Total deaths: 0')
        .transition()
            .tween("text", function() {
                var selection = d3.select(this);    // selection of node being transitioned
                var start = d3.select(this).text().match(/\d+/)[0]; // start value prior to transition
                var end = d3.sum(data, function(d) {return d.KL;});                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
                return function(t) {selection.text('Total deaths: ' + Math.round(interpolator(t))); };  // return value
                
            })
            .duration(tt + 1250)

}