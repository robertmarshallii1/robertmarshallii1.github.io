async function init() {
    await decadeplots();
}

async function decadeplots() {
    const d50 = await d3.csv('avyAct50s.csv');
    const d60 = await d3.csv('avyAct60s.csv');
    const d70 = await d3.csv('avyAct70s.csv');
    const d80 = await d3.csv('avyAct80s.csv');
    const d90 = await d3.csv('avyAct90s.csv');
    const d00 = await d3.csv('avyAct00s.csv');
    const d10 = await d3.csv('avyAct10s.csv');
    var w = window.screen.width*0.75;
    var h = window.screen.height*0.5; 
    var margin = window.screen.height*0.1; 
    var xdomain = [0,10];
    var xrange = [0,w-2*margin];
    var xs = d3.scaleBand().domain(xdomain).range(xrange);
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

    svg.append('g')
    .attr('transform','translate('+margin+','+margin+')')
    .selectAll('rect')
    .data(d50)
    .enter()
    .append('rect')
    .attr('y',h - 2*margin)
    .attr('height',0)
    .attr('x',function(d,i) {return xs(i);})
    .attr('width',function(d,i) {return xs(1);})
    .attr('fill','#4E96A6')
    .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
    .attr('y',function(d,i) {return ys(parseInt(d.KL));})
    .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.KL));})
    .attr('fill',function(d,i) {return cs(parseInt(d.KL));})

    // // Add select to change state
    // d3.selectAll('#selectButton')
    // .attr('transform','translate('+margin+','+margin+')')

    // // List of states
    // var allGroup = ['ALL','AK', 'AZ', 'CA', 'CO', 'ID', 'ME', 'MT', 'ND', 'NH', 'NM', 'NV', 'NY', 'OR', 'UT', 'VT', 'WA', 'WY']

    // // add the state options to the select element
    // d3.select('#selectButton')
    // .selectAll('myOptions')
    //     .data(allGroup)
    // .enter()
    //     .append('option')
    // .text(function (d) { return d; }) // text shown in the menu
    // .attr('value', function (d) { return d; }) // corresponding value returned by the button

    // // A function that update the chart
    // function update(selectedGroup) {

    //     // Give these new data to update rects
    //     // svg.selectAll('rect').remove()

    //     svg.selectAll('rect')
    //     .data(data)
    //     .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
    //     .attr('y',function(d,i) {return ys(parseInt(d[selectedGroup]));})
    //     .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d[selectedGroup]));})
    //     .attr('fill',function(d,i) {return cs(parseInt(d[selectedGroup]));})

    //     var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .attr('id','ttp')
    //     .offset([-10, 0])
    //     .html(function(d) { 
    //         s = '<strong>Year: </strong>' + d.YYYY + '</br><strong>Deaths: </strong>' + d[selectedGroup] + '</br>'
    //         return s;})

    //     d3.select('#ttb')
    //     .call(tip)
    //     .selectAll('#ttips').data(data)
    //     .attr('y',function(d,i) {return ys(parseInt(d[selectedGroup])+1);})
    //     .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d[selectedGroup])+1);})
    //     .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
    //     .attr('width',function(d,i) {return xs(start_yr);})
    //     .on('mouseover', tip.show)
    //     .on('mouseout', tip.hide)

    //     // Update annotation
    //     d3.select('#ant')
    //     .data(data)
    //     .transition()
    //         .tween("text", function() {
    //             var selection = d3.select(this);    // selection of node being transitioned
    //             var start = d3.select(this).text().match(/\d+/)[0]; // start value prior to transition
    //             console.log(start)
    //             var end = d3.sum(data, function(d) {return d[selectedGroup];});                     // specified end value
    //             var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
    //             return function(t) {selection.text('Total deaths: ' + Math.round(interpolator(t))); };  // return value
                
    //         })
    //         .duration(tt + 1250)
    // }

    // // When the button is changed, run the updateChart function
    // d3.select("#selectButton").on("change", function(d) {
    //     // recover the option that has been chosen
    //     var selectedOption = d3.select(this).property('value')
    //     // run the updateChart function with this selected option
    //     update(selectedOption)
    // })

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
    .data(d50)
    .enter()
    .append('rect')
        .attr('id','ttips')
        .attr('y',function(d,i) {return ys(parseInt(d.KL)+1);})
        .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d.KL)+1);})
        .attr('x',function(d,i) {return xs(i);})
        .attr('width',function(d,i) {return xs(1);})
        .attr('opacity',0.0)
        .attr('stroke-width',0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
   
    // Axes

    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .call(d3.axisLeft(ys))

    // svg.append('g')
    //     .attr('transform','translate('+margin+','+(h-margin)+')')
    //     .call(d3.axisBottom(xs)); // .tickValues(ticks));

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
    svg.append("text")
        .attr('transform','translate('+margin+','+margin+')')
        .attr('id','ant')
        .attr("x", xs(5))             
        .attr("y", ys(100))
        .attr("text-anchor", "start")  
        .style('font','15px sans-serif')
        .data(d50)
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

// async function states() {
//     const data = await d3.csv('avydeaths.csv');
//     var w = window.screen.width*0.75;
//     var h = window.screen.height*0.5; 

//     var svg = d3.select("body")
//             .append("svg")
//             .attr("width", w)
//             .attr("height", h);
//     return
//