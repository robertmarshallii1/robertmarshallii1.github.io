async function init() {
    await dvsyr();
    await decadeplots();
    var slideIndex = 1;
    showSlides(slideIndex);
}

function multiplesOf(numbers, number) { 
    var multiples = []; 
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] % number === 0) { // divide by the number
        multiples.push(numbers[i]); // add the current multiple to arr
        }
    }
    return multiples;
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

    d3.select('.right')
    .attr('margin-top',margin)

    // Initialize svg element
    svg = d3.select('#plot1');
    svg.attr('height', h + 2*margin)
    .attr('width', w + 2 * margin)

    // Initialize plot with ALL 

    svg.append('g')
    .attr('id','chart1')
    .attr('transform','translate('+margin+','+margin+')')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('id','bars1')
    .attr('y',h - 2*margin)
    .attr('height',0)
    .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
    .attr('width',function(d,i) {return xs(start_yr);})
    .attr('fill','#4E96A6')
    .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
    .attr('y',function(d,i) {return ys(parseInt(d.ALL));})
    .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d.ALL));})
    .attr('fill',function(d,i) {return cs(parseInt(d.ALL));})

    // Add select to change state
    d3.selectAll('#selectButton')
    .attr('transform','translate('+margin+','+margin+')')

    // List of states
    var allGroup = ['ALL','AK', 'AZ', 'CA', 'CO', 'ID', 'ME', 'MT', 'ND', 'NH', 'NM', 'NV', 'NY', 'OR', 'UT', 'VT', 'WA', 'WY']

    // add the state options to the select element
    d3.select('#selectButton')
    .selectAll('myOptions')
        .data(allGroup)
    .enter()
        .append('option')
    .text(function (d) { return d; }) // text shown in the menu
    .attr('value', function (d) { return d; }) // corresponding value returned by the button

    // A function that update the chart
    function update(selectedGroup) {

        // Give these new data to update rects
        // svg.selectAll('rect').remove()

        svg.select('#chart1')
        .selectAll('#bars1')
        .data(data)
        .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
        .attr('y',function(d,i) {return ys(parseInt(d[selectedGroup]));})
        .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d[selectedGroup]));})
        .attr('fill',function(d,i) {return cs(parseInt(d[selectedGroup]));})

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id','ttp')
        .offset([-10, 0])
        .html(function(d) { 
            s = '<strong>Year: </strong>' + d.YYYY + '</br><strong>Deaths: </strong>' + d[selectedGroup] + '</br>'
            return s;})

        d3.select('#ttb')
        .call(tip)
        .selectAll('#ttips').data(data)
        .attr('y',function(d,i) {return ys(parseInt(d[selectedGroup])+1);})
        .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d[selectedGroup])+1);})
        .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
        .attr('width',function(d,i) {return xs(start_yr);})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        // Update annotation
        d3.select('#ant')
        .data(data)
        .transition()
            .tween("text", function() {
                var selection = d3.select(this);    // selection of node being transitioned
                var start = d3.select(this).text().match(/\d+/)[0]; // start value prior to transition
                console.log(start)
                var end = d3.sum(data, function(d) {return d[selectedGroup];});                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
                return function(t) {selection.text('Total deaths: ' + Math.round(interpolator(t))); };  // return value
                
            })
            .duration(tt + 1250)
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property('value')
        // run the updateChart function with this selected option
        update(selectedOption)
    })

    // tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id','ttp')
        .offset([-10, 0])
        .html(function(d) {
            s = '<strong>Year: </strong>' + d.YYYY + '</br><strong>Deaths: </strong>' + d.ALL + '</br>'
            return s;})

    // .append('g')
    //     .attr('transform','translate('+margin+','+margin+')')
    // .selectAll('rect')
    // .data(data)
    // .enter()
    // .append('rect')
    //     .attr('y',h - 2*margin)
    //     .attr('height',0)
    //     .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
    //     .attr('width',function(d,i) {return xs(start_yr);})
    //     .attr('fill','#4E96A6')
    //     .transition().duration(tt).delay(function(d,i) {return(i-1)*25 + tdel;})
    //     .attr('y',function(d,i) {return ys(parseInt(d.ALL));})
    //     .attr('height',function(d,i) {return h - 2*margin - ys(parseInt(d['ALL']));})
    //     .attr('fill',function(d,i) {return cs(parseInt(d['ALL']));})
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
        .attr('id','ttb')
    .call(tip)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr('id','ttips')
        .attr('y',function(d,i) {return ys(parseInt(d.ALL)+1);})
        .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d.ALL)+1);})
        .attr('x',function(d,i) {return xs(parseInt(d.YYYY));})
        .attr('width',function(d,i) {return xs(start_yr);})
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
        .call(d3.axisBottom(xs).tickValues(ticks));

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
    .text('Year');

    // Title
    svg.append("text")
        .attr('id','plotitle')
        .attr("x", (w / 2))             
        .attr("y", 0.5*margin)
        .attr("text-anchor", "middle")  
        .style('font','15px "Lato", sans-serif')
        .style('letter-spacing','3px')
        .style('text-transform','uppercase')
        .text("Avalanche Deaths vs Year");

    // Annotation
    svg.append("text")
        .attr('transform','translate('+margin+','+margin+')')
        .attr('id','ant')
        .attr("x", xs(1953))             
        .attr("y", ys(33))
        .attr("text-anchor", "start")  
        .style('font','15px sans-serif')
        .data(data)
        .text('Total deaths: 0')
        .transition()
            .tween("text", function() {
                var selection = d3.select(this);    // selection of node being transitioned
                var start = d3.select(this).text().match(/\d+/)[0]; // start value prior to transition
                var end = d3.sum(data, function(d) {return d.ALL;});                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
                return function(t) {selection.text('Total deaths: ' + Math.round(interpolator(t))); };  // return value
                
            })
            .duration(tt + 1250)
}

async function decadeplots() {
    const d50 = await d3.csv('avyAct50s.csv');
    const d60 = await d3.csv('avyAct60s.csv');
    const d70 = await d3.csv('avyAct70s.csv');
    const d80 = await d3.csv('avyAct80s.csv');
    const d90 = await d3.csv('avyAct90s.csv');
    const d00 = await d3.csv('avyAct00s.csv');
    const d10 = await d3.csv('avyAct10s.csv');

    var dfs = [d50,d60,d70,d80,d90,d00,d10];
    var yr = ['1951-1959','1960-1969','1970-1979','1980-1989','1990-1999','2000-2009','2010-2019'];

    var w = window.screen.width*0.8;
    var h = window.screen.height*0.5; 
    var margin = window.screen.height*0.1;
    var xrange = [0,w-2*margin];
    var ydomain = [0,120]
    var yrange = [h-2*margin,0];
    var ys = d3.scaleLinear().domain(ydomain).range(yrange);
    var cs = d3.scaleLinear().domain(ydomain).range(['#4E96A6','#D99E32']);
    var tdel = 50;
    var tt = 1500;

    // Loop through decades
    var i;
    for (i=0; i < dfs.length; i++) {

        var data = dfs[i];
        data = data.slice(0,10);

        var sname = '#slide' + (i+1);

        svg2 = d3.select(sname);
        svg2.attr('height', h + 2*margin)
        .attr('width', w + 2 * margin)

        var xs = d3.scaleBand()
            .domain(data.map(function(d) {return d.Activity;}))
            .range(xrange)

        var bid = 'decbars' + i;
        var chid = 'dechart' + i;
        svg2.append('g')
        .attr('id',chid)
        .attr('transform','translate('+margin+','+margin+')')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('id',bid)
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
            .attr('id','ttp2')
            .offset([-10, 0])
            .html(function(d) {
                s = '<strong>Activity: </strong>' + d.Activity + '</br><strong>Deaths: </strong>' + d.KL + '</br>'
                return s;})

        svg2.append('g')
            .attr('transform','translate('+margin+','+margin+')')
            .attr('id','ttb2')
        .call(tip)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr('id','ttips2')
            .attr('y',function(d,i) {return ys(parseInt(d.KL)+1);})
            .attr('height',function(d,i) {return h-2*margin-ys(parseInt(d.KL)+1);})
            .attr('x',function(d,i) {return xs(d.Activity);})
            .attr('width',xs.bandwidth())
            .attr('opacity',0.0)
            .attr('stroke-width',0)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
    
        // Axes

        svg2.append('g')
            .attr('transform','translate('+margin+','+margin+')')
            .call(d3.axisLeft(ys))

        svg2.append('g')
            .attr('transform','translate('+margin+','+(h-margin)+')')
            .call(d3.axisBottom(xs)); // .tickValues(ticks));

        // Axis labels
        svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0.5*margin)
        .attr("x",0 - (h/2))
        .attr("dy", "1em")
        .style('text-anchor', 'middle')
        .style('font','15px sans-serif')
        .text('Deaths');

        svg2.append("text")             
        .attr("transform","translate("+(w/2)+" ,"+(h - 0.5*margin)+")")
        .style("text-anchor", "middle")
        .style('font','15px sans-serif')
        .text('Activity');

        // Title
        svg2.append("text")
            .attr('id','plotitle2')
            .attr("x", (w / 2))             
            .attr("y", 0.5*margin)
            .attr("text-anchor", "middle")  
            .style('font','15px "Lato", sans-serif')
            .style('letter-spacing','3px')
            .style('text-transform','uppercase')
            .text("Avalanche Deaths vs Activity: " + yr[i]);

        // Annotation
        var ant = "ant" + i
        data = dfs[i];
        svg2.append("text")
            .attr('transform','translate('+margin+','+margin+')')
            .attr('id',ant)
            .attr("x", xs.bandwidth()*10)             
            .attr("y", ys(110))
            .attr("text-anchor", "end")  
            .style('font','15px sans-serif')
            .data(data)
            .text('Total deaths: ' + d3.sum(data, function(d) {return d.KL;}))
    }
}

//
//

// Slideshow stuff //

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    
    dots[slideIndex-1].className += " active";
}