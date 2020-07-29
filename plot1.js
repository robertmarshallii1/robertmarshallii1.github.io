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
    const data = await d3.csv('avydeaths.csv');
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
    var clrs = {'Continental': '#8C4C3E', 'Maritime': '#88BFB0', 'Northeast': '#D9BBB4'};
    var tdel = 250;
    var tt = 3000;

    svg = d3.select('#plot1');
    svg.attr('height', h + 2*margin)
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
        .attr('fill','black')
        .transition().duration(tt).delay(tdel)
        .attr('y',function(d,i) {return ys(parseInt(d.Continental));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.Continental));})
        .attr('fill',clrs['Continental'])
    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr('y',function(d,i) {return ys(parseInt(d.Continental));})
        .attr('height',0)
        .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
        .attr('width',function(d,i) {return xs(start_yr);})
        .attr('fill','black')
        .transition().duration(tt).delay(2*tdel+tt)
        .attr('y',function(d,i) {return ys(parseInt(d.Maritime) + parseInt(d.Continental));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.Maritime));})
        .attr('fill',clrs['Maritime'])
    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .call(d3.axisLeft(ys));
    svg.append('g')
        .attr('transform','translate('+margin+','+(h-margin)+')')
        .call(d3.axisBottom(xs).tickValues(ticks));
}