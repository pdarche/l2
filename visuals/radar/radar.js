var series, 
    hours,
    minVal,
    maxVal,
    w = 400,
    h = 400,
    vizPadding = {
        top: 10,
        right: 0,
        bottom: 15,
        left: 0
    },
    radius,
    radiusLength,
    ruleColor = "#CCC";

var loadViz = function(){
  loadData();
  buildBase();
  setScales();
  addAxes();
  draw();
};

var loadData = function(){
    var randomFromTo = function randomFromTo(from, to){
       return Math.floor(Math.random() * (to - from + 1) + from);
    };

    series = [
      [],[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    ];

    console.log(ranking)

    hours = [];

    for (var i = 0; i < series.length; i++){
        series[i][ 
          ranking.data[i].account, 
          ranking.data[i].product_page, 
          ranking.data[i].total_size, 
          ranking.data[i].checkout, 
          ranking.data[i].customer_service,
          ranking.data[i].search_nav,
          ranking.data[i].technology,
          ranking.data[i].rank
        ]
    }
    
    //hours[i] = i; //in case we want to do different formatting

    mergedArr = series[0]

    for ( var i = 0; i < series.length - 1; i++ ){
        mergedArr = mergedArr.concat(series[i + 1])
    }

    minVal = d3.min(mergedArr);
    maxVal = d3.max(mergedArr);
    //give 25% of range as buffer to top
    maxVal = maxVal + ((maxVal - minVal) * 0.25);
    minVal = 0;

    //to complete the radial lines
    for (i = 0; i < series.length; i += 1) {
        series[i].push(series[i][0]);
    }

    console.log("series", series)
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

  circleAxes.append("svg:circle")
      .attr("r", function (d, i) {
          return radius(d);
      })
      .attr("class", "circle")
      .style("stroke", ruleColor)
      .style("fill", "none");

  circleAxes.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("dy", function (d) {
          return -1 * radius(d);
      })
      .text(String);

  lineAxes = vizBody.selectAll('.line-ticks')
      .data(hours)
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
          return "rotate(" + ((i / hours.length * 360) - 90) +
              ")translate(" + radius(maxVal) + ")";
      })
      .attr("class", "line-ticks");

  lineAxes.append('svg:line')
      .attr("x2", -1 * radius(maxVal))
      .style("stroke", ruleColor)
      .style("fill", "none");

  lineAxes.append('svg:text')
      .text(String)
      .attr("text-anchor", "middle")
      .attr("transform", function (d, i) {
          return (i / hours.length * 360) < 180 ? null : "rotate(180)";
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
          if(i === 0){
            return "green";
          } else {
            return "blue";
          }
      })
      .style('stroke', function (d, i) {
          if(i === 0){
            return "green";
          } else {
            return "blue";
          }
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
          if (i === 7) {
              i = 0;
          } //close the line
          return (i / 7) * 2 * Math.PI;
      }));
};