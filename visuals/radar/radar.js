  var series, 
      w = 700,
      h = 700

    // padding 
    var vizPadding = {
        top: 50,
        right: 110,
        bottom: 50,
        left: 50
    }

  // path radius
  var radius,
      radiusLength

  // min max
  var minVal = 0,
      maxVal = 5
      minVal = 0;

  // arrays 
  var ruleColor = "#CCC",
      colors = [ "#C5DE97", "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", 
                 "#8775B1", "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0", "#C5DE97", 
                 "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", "#8775B1",
                 "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0" 
      ],
      dimensions = [ 
              "technology", "search_nav", "customer_service", 
              "product_page", "account", "checkout" 
      ],
      dimensionNames = [ 
              "Technology", "Search and Navigation",
              "Customer Service", "Product Page", 
              "Account", "Checkout"
      ],
      brandNames = [],
      series = []


  var loadViz = function(){
    loadData();
    buildBase();
    setScales();
    addAxes();
    draw();
  };

var loadData = function(){

    //for each dimentions
    for ( var i = 0; i < dimensions.length; i++ ){
        
        // add brandname to brandnames
        brandNames.push(ranking.data[i].brand)
        var brand = []

        //make metric array from the ith dimension of each brand
        for (var j = 0; j < 6 ; j++){

           var score = ranking.data[i][dimensions[j]]
           brand.push(score)

        }
        series.push(brand)
    }

    console.log(series, brandNames)

    //to complete the radial lines
    for (var m = 0; m < series.length; m += 1) {
        series[m].push(series[m][0]);
    }

    average = []

    //attribute k
    for ( var k = 0; k < 7; k++){
      
        var dataPoint = 0
      
        //brand l
        for (var l = 0; l < 6; l++){

            dataPoint += Number(series[l][k])

        }

      dataPoint = round2(dataPoint/6)
      average.push(dataPoint)

    }

    series.push(average)
    brandNames.push("Average")

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


var setScales = function () {
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


var addAxes = function () {
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
      // .style('opacity', .5)
      .style("fill", "none");

  circleAxes.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("dy", function (d) {
          return -1 * radius(d);
      })
      .text(String);

  lineAxes = vizBody.selectAll('.line-ticks')
      .data(dimensions)
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
          return "rotate(" + ((i / dimensions.length * 360) - 90) +
              ")translate(" + radius(maxVal) + ")";
      })
      .attr("class", "line-ticks");

  lineAxes.append('svg:line')
      .attr("x2", -1 * radius(maxVal))
      .style("stroke", ruleColor)
      .style("fill", "none");

  lineAxes.append('svg:text')
      .data(dimensionNames)
      .text(function(d){
        return d
      })
      .attr("text-anchor", function(d, i){
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
          var rotVal = 90 - (i / dimensions.length * 360)
          return "rotate(" + rotVal + ")"
      });

      d3.selectAll('.line-ticks').select('text')
          .attr('dy', function(d, i){
              var deg = (( 360 / 6 ) * i) * (Math.PI/180) 
              return -Math.cos(deg) * 20
          })
          .attr('dx', function(d, i){
              i === 1 || i === 2 || i === 4 || i === 5 ? i = -i : null 
              var deg = (( 360 / 6 ) * i) * (Math.PI/180)
              return -Math.sin(deg) * 20
          })
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
      .style("stroke-width", 3)
      .style("fill", "none");

  //************** BRAND SCORE LABELS ************** 
  // groups.selectAll(".label")
  //     .data(function (d) {
  //         return d.slice(0, 6);
  //     })
  //     .enter().append("svg:text")
  //     .text(function(d){ return d })
  //     .attr("class", "label")
  //     .attr('dy', function(d, i){
  //         var deg = (( 360 / 6 ) * i) * (Math.PI/180) 
  //         return -Math.cos(deg) * ( radius(d) + 10 )
  //     })
  //     .attr('dx', function(d, i){
  //         i === 1 || i === 2 || i === 4 || i === 5 ? i = -i : null 
  //         var deg = (( 360 / 6 ) * i) * (Math.PI/180)
  //         return -Math.sin(deg) * ( radius(d) + 10 )
  //     })
  //     .attr("text-anchor", function(d, i){
  //       if( i === 0 || i === 3){
  //         return "middle"
  //       } else if (i === 1 || i === 2 ){
  //         return "start"
  //       } else if (i === 4 || i === 5 ){
  //         return "end"
  //       }
  //     })

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

function round2(num){
    return Math.round( Number(num) * 100 ) / 100 
}

var Controls = {
    brandNames: brandNames,
    populateBrands: function(){

      $.each(this.brandNames, function(i){
        
        var brandTemplate = '<li class="brand-control"><div class="brand-name"> <input type="checkbox"/>' + ' ' + (i + 1) + '. ' +  brandNames[i] + '</div>'
            brandTemplate = brandTemplate + '<div class="brand-info"></div></li>'
        
        $('#brand_list').append(brandTemplate)

      })

      $('.series').hide()

    },
    highlightBrand: function(){
      
      var ind = undefined

      $('.brand-control').hover(function(){
        
        var index = $(this).index()
        ind = index

        $('.series').eq(index).find('path').css('stroke-width', '8px')
        $('.series').not($('.series').eq(index)).find('path').css('opacity', '.4')

      }, function() {

        $('.series').eq(ind).find('path').css('stroke-width', '3px')
        $('.series').find('path').css('opacity', '1')
      
      })

    },
    expandBrand: function(){
      
      $('.brand-control').click(function(){        
        var index = $(this).index(),
            currBrand = $(this)        
        
        $(this).css('height', '100px')
        
        $.each(series, function(i){
          currBrand.find('.brand-info').append('<div class="brand-datum">' + dimensions[i] + ': ' + series[i][index] + '</div>')
        })

        $(this).find('.brand-info').delay(400).fadeIn()
          
      })

    },
    initBrands: function(){
      
      $('.series').hide()
      
      $('.series').eq(6).show()
      $('.brand-name').eq(6).find("input").attr("checked", true)
      brand = d3.selectAll('.series').filter(function(d,i){ return i == 6}).classed('shown', true)
      Controls.addRow(series[6], brandNames[6])

      $('.series').eq(0).show()
      $('.brand-name').eq(0).find("input").attr("checked", true)
      brand = d3.selectAll('.series').filter(function(d,i){ return i == 0}).classed('shown', true)
      Controls.addRow(series[0], brandNames[0])

    },
    toggleBrand: function(){

      $('.brand-name').find("input").click(function(){
        
        var index = $(this).parent().parent().index(),
            brand = d3.selectAll('.series').filter(function(d,i){ return i == index})

        if ( brand.classed('shown') ) {

          brand.style('display', 'none')
          brand.classed('shown', false)
          Controls.removeRow(brandNames[index])

        } else {
          
          brand.style('display', 'block')
          brand.classed('shown', true)
          Controls.addRow(series[index], brandNames[index])
          
        }

      })
        
    },
    addRow: function(brand, name){

      var newRow = '<tr><td>' + name + '</td><td>' + round2( brand[0] ) + '</td><td>' 
          newRow += round2( brand[1] ) + '</td><td>' + round2( brand[2] ) + '</td>'
          newRow += '<td>' + round2( brand[3] ) + '</td><td>' + round2( brand[4] ) + '</td><td>' + round2( brand[5] ) + '</td></tr>'

      $('#german_chart tbody').append(newRow)

    },
    removeRow: function(name){

      $.each($('#german_chart tr'), function(i){
          var targetName = $(this).find('td').eq(0).html()
          if ( name === targetName) {

              $('#german_chart tr').eq(i).remove()

          }
      })

    }
}


// HELPERS

var control = Object.create( Controls )

