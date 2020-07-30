async function init() {
    await dvsyr();
}

async function dvsyr() {
    var data = await d3.csv('./COVID/0720cases.csv');
    data['cnt'] = data['US'];
    var parser = d3.timeParse("%m.%d.%Y");
    data['dt'] = parser(data['Date'])
    console.log(dt)
    var w = window.screen.width*0.75;
    var h = window.screen.height*0.5; 
    var margin = window.screen.height*0.1; 
    var ddomain = [data['dt'][0],data['dt'][data['dt'].length - 1]];
    console.log(ddomain)
    var drange = [0,w-2*margin];
    var xs = d3.scaleBand().domain(ddomain).range(drange);
    var ydomain = [0,d3.max(data['cnt'])]
    console.log(ydomain)
    var yrange = [h-2*margin,0];
    // var ticks = ddomain;
    // if (ddomain.length > 25) {
    //     ticks = multiplesOf(ddomain,5)
    // }
    var ys = d3.scaleLinear().domain(ydomain).range(yrange);
    var cs = d3.scaleLinear().domain([0,36]).range(['#4E96A6','#D99E32']);
    var clrs = {'Cases': '#D99E32', 'Deaths': '#4E96A6', 'Northeast': '#C2C5C8'};
    var tdel = 50;
    var tt = 1500;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            s = '<strong>Year: </strong>' + d.dt + '</br><strong>Deaths: </strong>' + d.cnt + '</br>'
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
        .attr('x',function(d,i) {return xs(d.dt);})
        .attr('width',function(d,i) {return xs(d.dt[1]);})
        .attr('fill','#C2C5C8')
        .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
        .attr('y',function(d,i) {return ys(parseInt(d.cnt));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.cnt));})
        .attr('fill',function(d,i) {return cs(parseInt(d.cnt));})

}