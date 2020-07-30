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
    var w = window.screen.width*0.75;
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
    var cs = d3.scaleLinear().domain([0,36]).range(['#4E96A6','#D99E32']);
    var clrs = {'Continental': '#D99E32', 'Maritime': '#4E96A6', 'Northeast': '#C2C5C8'};
    var tdel = 50;
    var tt = 1500;



    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            s = '<strong>Year: </strong>' + d.YYYY + '</br><strong>Deaths: </strong>' + d.ALL + '</br>'
            return s;})

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
        .attr('fill','white')
        .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
        .attr('y',function(d,i) {return ys(parseInt(d.ALL));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.ALL));})
        .attr('fill',function(d,i) {return cs(parseInt(d.ALL));})
        // .attr('fill',clrs['Continental'])
    // svg.append('g')
    //     .attr('transform','translate('+margin+','+margin+')')
    // .selectAll('rect')
    // .data(data)
    // .enter()
    // .append('rect')
    //     .attr('y',function(d,i) {return ys(parseInt(d.Continental));})
    //     .attr('height',0)
    //     .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
    //     .attr('width',function(d,i) {return xs(start_yr);})
    //     .attr('fill',clrs['Continental'])
    //     .transition().duration(tt).delay(function(d,i) {return(i-1)*15 + tdel + tt;})
    //     .attr('y',function(d,i) {return ys(parseInt(d.Maritime) + parseInt(d.Continental));})
    //     .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.Maritime));})
    //     .attr('fill',clrs['Maritime'])
    // svg.append('g')
    //     .attr('transform','translate('+margin+','+margin+')')
    // .selectAll('rect')
    // .data(data)
    // .enter()
    // .append('rect')
    //     .attr('y',function(d,i) {return ys(parseInt(d.Maritime) + parseInt(d.Continental));})
    //     .attr('height',0)
    //     .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
    //     .attr('width',function(d,i) {return xs(start_yr);})
    //     .attr('fill',clrs['Maritime'])
    //     .transition().duration(tt).delay(function(d,i) {return(i-1)*15 + tdel + 2*tt;})
    //     .attr('y',function(d,i) {return ys(parseInt(d.Northeast) + parseInt(d.Maritime) + parseInt(d.Continental));})
    //     .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.Northeast));})
    //     .attr('fill',clrs['Northeast'])
    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
    .call(tip)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr('y',function(d,i) {return ys(parseInt(d.Northeast) + parseInt(d.Maritime) + parseInt(d.Continental));})
        .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d.Northeast) + parseInt(d.Maritime) + parseInt(d.Continental));})
        .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
        .attr('width',function(d,i) {return xs(start_yr);})
        .attr('opacity',0.0)
        .attr('stroke-width',0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        
    svg.append('g')
        .attr('transform','translate('+margin+','+margin+')')
        .call(d3.axisLeft(ys));
    svg.append('g')
        .attr('transform','translate('+margin+','+(h-margin)+')')
        .call(d3.axisBottom(xs).tickValues(ticks));

    legend = svg.append('g')
        .attr('class','legend')
        .attr('transform','translate('+margin+','+margin+')')
        .style('font-size','12px')
        .call(d3.legend)
}

async function states() {
    const data = await d3.csv('avydeaths.csv');
    var w = window.screen.width*0.75;
    var h = window.screen.height*0.5; 

    var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
            .attr("height", h);
            
    
}