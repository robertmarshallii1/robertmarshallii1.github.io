function multiplesOf(numbers, number) { 
    var multiples = []; 
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] % number === 0) { // divide by the number
        multiples.push(numbers[i]); // add the current multiple to arr
        }
    }
    return multiples;
}

async function init() {
    await dvsyr();
}

async function dvsyr() {
    const data = await d3.csv('avyYrKl.csv');
    var w = window.screen.width*0.9; 
    var h = window.screen.height*0.5; 
    var margin = window.screen.height*0.1; 
    var start_yr = 1951;
    var end_yr = 2019;
    var ddomain = Array.from(Array(end_yr - start_yr + 3), (_, index) => index + start_yr - 1);
    var drange = [0,w-2*margin];
    var xs = d3.scaleBand().domain(ddomain).range(drange);
    var ydomain = [0,36]
    var yrange = [h-2*margin,0];
    var ticks = ddomain;
    if (ddomain.length > 25) {
        ticks = multiplesOf(ddomain,5)
    }
    var ys = d3.scaleLinear().domain(ydomain).range(yrange);
    var cs = d3.scaleLinear().domain([0,40]).range(['lightblue','darkblue']);

    d3.select('#plot1')
    .attr('height', h + 2*margin)
    .attr('width', w + 2 * margin)
    .append('g')
        .attr('transform','translate('+margin+','+margin+')')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr('y',h - 2*margin)
        .attr('height',0)
        .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
        .attr('width',function(d,i) {return xs(start_yr);})
        .attr('fill','lightblue')
        .transition().duration(3000).delay(250)
        .attr('y',function(d,i) {return ys(parseInt(d.KL));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.KL));})
        .attr('fill',function(d,i) {return cs(parseInt(d.KL));})
    d3.select('svg')
    .append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .call(d3.axisLeft(ys));
    d3.select('svg')
    .append('g')
        .attr('transform','translate('+margin+','+(h-margin)+')')
        .call(d3.axisBottom(xs).tickValues(ticks));
}