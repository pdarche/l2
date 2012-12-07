var series, 
    hours,
    minVal,
    maxVal,
    w = 800,
    h = 800,
    vizPadding = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    radius,
    radiusLength,
    ruleColor = "#CCC",
    colors = [ "#C5DE97", "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", "#8775B1", "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0", "#C5DE97", "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", "#8775B1", "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0" ],
    brandNames = []

var loadViz = function(){
  loadData();
  buildBase();
  setScales();
  addAxes();
  draw();
};


// var controls = {
//     brandNames = brandNames,
//     populateBrands: function(){
//     //   $.each()
//     // }
//     }

// }

var loadData = function(){
    var randomFromTo = function randomFromTo(from, to){
       return Math.floor(Math.random() * (to - from + 1) + from);
    };

    series = [];
    hours = [];
    attributes = [ "technology", "search_nav", "customer_service", "product_page", "account", "checkout" ]

    for ( var i = 0; i < attributes.length ; i++ ){
        console.log("ranking", ranking)
        var metric = []
        for (var j = 0; j < 5 ; j++){
           var score = ranking.data[j][attributes[i]]
           metric.push(score)
        }
        series.push(metric)
    }


    mergedArr = series[0]

    for ( var i = 0; i < series.length - 1; i++ ){
        mergedArr = mergedArr.concat(series[i + 1])
    }

    console.log(mergedArr)

    minVal = 0//d3.min(mergedArr);
    maxVal = 5//d3.max(mergedArr);
    //give 25% of range as buffer to top
    // maxVal = maxVal + ((maxVal - minVal) * 0.25);
    minVal = 0;

    //to complete the radial lines
    for (var i = 0; i < series.length; i += 1) {
        series[i].push(series[i][0]);
    }

    for (var n = 0; n < series.length; n++){
        series[n].push(series[n][5])
    }

    console.log("series",series)


};

var buildBase = function(){
    var viz = d3.select("#viz")
        .append('svg:svg')
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'vizSvg');

    viz.append("svg:rect")
        .attr('id', 'axis-separator')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 0)
        .attr('width', 0)
        .attr('height', 0);
    
    vizBody = viz.append("svg:g")
        .attr('id', 'body');
};

setScales = function () {
  var heightCircleConstraint,
      widthCircleConstraint,
      circleConstraint,
      centerXPos,
      centerYPos;

  //need a circle so find constraining dimension
  heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
  widthCircleConstraint = w - vizPadding.left - vizPadding.right;
  circleConstraint = d3.min([
      heightCircleConstraint, widthCircleConstraint]);

  radius = d3.scale.linear().domain([minVal, maxVal])
      .range([0, (circleConstraint / 2)]);
  radiusLength = radius(maxVal);

  //attach everything to the group that is centered around middle
  centerXPos = widthCircleConstraint / 2 + vizPadding.left;
  centerYPos = heightCircleConstraint / 2 + vizPadding.top;

  vizBody.attr("transform",
      "translate(" + centerXPos + ", " + centerYPos + ")");
};

addAxes = function () {
  var radialTicks = radius.ticks(5),
      i,
      circleAxes,
      lineAxes;

  vizBody.selectAll('.circle-ticks').remove();
  vizBody.selectAll('.line-ticks').remove();

  circleAxes = vizBody.selectAll('.circle-ticks')
      .data(radialTicks)
      .enter().append('svg:g')
      .attr("class", "circle-ticks");

  // circleAxes.append("svg:circle")
  //     .attr("r", function (d, i) {
  //         return radius(d);
  //     })
  //     .attr("class", "circle")
  //     .style("stroke", ruleColor)
  //     .style("fill", "none");

  circleAxes.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("dy", function (d) {
          return -1 * radius(d);
      })
      .text(String);

  lineAxes = vizBody.selectAll('.line-ticks')
      .data(attributes)
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
          return "rotate(" + ((i / attributes.length * 360) - 90) +
              ")translate(" + radius(maxVal) + ")";
      })
      .attr("class", "line-ticks");

  lineAxes.append('svg:line')
      .attr("x2", -1 * radius(maxVal))
      .style("stroke", ruleColor)
      .style("fill", "none");

  lineAxes.append('svg:text')
      .data(attributes)
      .text(function(d){
        return d
      })
      .attr("text-anchor", function(d, i){
        console.log(i)
        if( i === 0 || i === 3){
          return "middle"
        } else if (i === 1 || i === 2 ){
          return "start"
        } else if (i === 4 || i === 5 ){
          return "end"
        }
      })
      // .attr("dy", "-1em")
      .style("font-family", "helvetica")
      .style("font-size", "12px")
      .attr("transform", function (d, i) {
          var rotVal = 90 - (i / attributes.length * 360)
          return "rotate(" + rotVal + ")"
      });
};

var draw = function () {
  var groups,
      lines,
      linesToUpdate;

  highlightedDotSize = 4;

  groups = vizBody.selectAll('.series')
      .data(series);
  groups.enter().append("svg:g")
      .attr('class', 'series')
      .style('fill', function (d, i) {
          return colors[i]
      })
      .style('stroke', function (d, i) {
          return colors[i]
      });
  groups.exit().remove();

  lines = groups.append('svg:path')
      .attr("class", "line")
      .attr("d", d3.svg.line.radial()
          .radius(function (d) {
              return 0;
          })
          .angle(function (d, i) {
              if (i === 7) {
                  i = 0;
              } //close the line
              // console.log("d", d)
              // console.log("i", i)
              // console.log(" ")
              return (i / 7) * 2 * Math.PI;
          }))
      .style("stroke-width", 3)
      .style("fill", "none");

  groups.selectAll(".curr-point")
      .data(function (d) {
          return [d[0]];
      })
      .enter().append("svg:circle")
      .attr("class", "curr-point")
      .attr("r", 0);

  groups.selectAll(".clicked-point")
      .data(function (d) {
          return [d[0]];
      })
      .enter().append("svg:circle")
      .attr('r', 0)
      .attr("class", "clicked-point");

  lines.attr("d", d3.svg.line.radial()
      .radius(function (d) {
          return radius(d);
      })
      .angle(function (d, i) {
          if (i === 6) {
              i = 0;
          } //close the line
          return (i / 6) * 2 * Math.PI;
      }));
};

