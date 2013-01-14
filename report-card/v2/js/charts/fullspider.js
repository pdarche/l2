  var series, 
      w = 590,
      h = 590

  // padding 
  var vizPadding = {
      top: 0,
      right: 100,
      bottom: 0,
      left: 60
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
      colors = [ 
              "#C5DE97", "#88C9BF", "#90C086", "#D1D2D4", "#F9AF88", "#B2DBB6", 
              "#8775B1", "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0", "#C5DE97", 
              "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", "#8775B1",
              "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0" 
      ],
      dimensions = [ 
              "technology", "search_nav", "customer_service", 
              "product_page", "account", "checkout" 
      ],
      dimensionNames = [ 
              "Technology", "Search and Nav",
              "Customer Service", "Product Page", 
              "Account", "Checkout"
      ],
      brandNames = [],
      series = [],
      subcategories = [],
      groups


  var loadViz = function( data, categories ){
    SpiderEvents.loadData( data, categories );
    buildBase();
    setScales();
    addAxes();
    draw();
  };

  var buildBase = function(){

      var viz = d3.select("#chart_container")
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

      groups = vizBody.append('svg:g')
        .attr('class', 'series-container')

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
        .style("fill", "none")
        .style("stroke-width", 1)

    circleAxes.append("svg:text")
        .attr("text-anchor", "middle")
        .attr("dy", function (d) {
            return -1 * radius(d);
        })
        .text(String);

    lineAxes = vizBody.selectAll('.line-ticks')
        .data(subcategories)

    lineAxes.enter().append('svg:g')
        .attr("transform", function (d, i) {
            return "rotate(" + ((i / subcategories.length * 360) - 90) +
                ")translate(" + radius(maxVal) + ")";
        })
        .attr("class", "line-ticks");

    lineAxes.append('svg:line')
        .attr("x2", -1 * radius(maxVal))
        .style("stroke", ruleColor)
        .style("fill", "none");

    lineAxes.append('svg:text')
        .data(subcategories)
        .text(function(d){
          return d
        })
        .attr("text-anchor", function(d, i){
          return "middle"
        })
        .style("font-family", "helvetica")
        .style("font-size", "10px")
        .attr("transform", function (d, i) {
            var rotVal = 90 - (i / subcategories.length * 360)
            return "rotate(" + rotVal + ")"
        });

        d3.selectAll('.line-ticks').select('text')
            .attr('dy', function(d, i){
                var deg = (( 360 / subcategories.length ) * i) * (Math.PI/180) 
                return -Math.cos(deg) * 15
            })
            .attr('dx', function(d, i){
                i === 1 || i === 2 || i === 4 || i === 5 ? i = -i : null 
                var deg = (( 360 / subcategories.length ) * i) * (Math.PI/180)
                return -Math.sin(deg) * 15
            })

      lineAxes.exit()
          .style('opacity', 0)
        .transition()
          .remove()
  };


  var draw = function () {
    // var groups,
      var lines,
          linesToUpdate;

    highlightedDotSize = 4;

    lines = groups.selectAll('.series')
        .data(series)

    lines.enter().append('svg:path')
        .attr("class", "series shown")
        .style('fill', function (d, i) {
            return colors[i]
        })
        .style('stroke', function (d, i) {
            return colors[i]
        })
        .style("stroke-width", 3)
        // .style("fill", "none")
        .style('fill-opacity', .2)

    lines.attr("d", d3.svg.line.radial()
        .radius(function (d) {
            return radius(d);
        })
        .angle(function (d, i) {
            if (i === subcategories.length) {
                i = 0;
            } //close the line
            return ( i / subcategories.length ) * 2 * Math.PI;
        }));

    lines.exit()
          .style('opacity', 0)
        .transition(1000)
          .remove()
  };

  function round2(num){
      return Math.round( Number(num) * 100 ) / 100 
  }

var Controls = {
    brandNames: brandNames,
    init: function(){

      var categories = [ 

          { name: "Social Media", x: 0, y: 0, tx: 10, ty: 20 }, 
          { name: "Site", x: 350, y: 0, tx: 660, ty: 20 },
          { name: "Mobile", x: 0, y: 350, tx: 10, ty: 690},
          { name: "Digital Marketing", x: 350, y: 350, tx: 600, ty: 690 } 
      
      ]

      d3.select('#body').selectAll('.category')
          .data(categories)
        .enter().append("g")
          .attr("transform", "translate(-350, -350)")
          .attr('class', 'category')
          .append('rect')
            .attr('width', 350)
            .attr('height', 350)
            .attr('x', function(data){
                return data.x              
            })
            .attr('y', function(data){
               return data.y
            })
            .attr('fill', '#999')
            .style('opacity', 0)


      d3.selectAll('.category').append('text')
            .data(categories)
            .attr('x', function(d){
                return d.tx
            })
            .attr('y', function(d){
                return d.ty
            })
            .text(function(d){
                return d.name
            })
            .style('font-family', 'helvetica')
            .style('font-size', 10)
            .style('color', '#999')
              
      d3.selectAll('.category').select('text')
          .on('mouseover', function(){
            d3.select(this.previousSibling)
                .style('opacity', .4)
          })
          .on('mouseout', function(d){
            d3.select(this.previousSibling)
                .style('opacity', 0)
          })

    },
    populateBrands: function(){

      $.each(this.brandNames, function(i){
        
        var brandTemplate = '<li class="brand-control"><div class="brand-name"> <input type="checkbox"/>' + ' ' + (i + 1) + '. ' +  brandNames[i] + '</div>'
            brandTemplate = brandTemplate + '<div class="brand-info"></div></li>'
        
        $('#brand_list').append(brandTemplate)

        // $('.brand-name').eq(i).css('border-bottom', '2px solid ' + colors[i])

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
        $('.series').eq(ind).find('.label').show()

      }, function() {

        $('.series').eq(ind).find('path').css('stroke-width', '3px')
        $('.series').find('path').css('opacity', '1')
        $('.series').eq(ind).find('.label').hide()
      
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
      $('.brand-name').eq(6).css('border-bottom', '2px solid ' + colors[6])

      $('.series').eq(0).show()
      $('.brand-name').eq(0).find("input").attr("checked", true)
      brand = d3.selectAll('.series').filter(function(d,i){ return i == 0}).classed('shown', true)
      Controls.addRow(series[0], brandNames[0])
      $('.brand-name').eq(0).css('border-bottom', '2px solid ' + colors[0])

    },
    toggleBrand: function(){

      $('.brand-name').find("input").click(function(){
        
        var index = $(this).parent().parent().index(),
            brand = d3.selectAll('.series').filter(function(d,i){ return i == index})

        if ( brand.classed('shown') ) {

          brand.style('display', 'none')
          brand.classed('shown', false)
          Controls.removeRow(brandNames[index])

          $('.brand-name').eq(index).css('border-bottom', '0px solid ' + colors[index])

        } else {
          
          brand.style('display', 'block')
          brand.classed('shown', true)
          Controls.addRow(series[index], brandNames[index])
          $('.brand-name').eq(index).css('border-bottom', '2px solid ' + colors[index])
          
        }

      })
        
    },
    addRow: function(brand, name){

      var newRow = '<tr><td>' + name + '</td><td>' + brand[0]  + '</td><td>' 
          newRow +=  brand[1]  + '</td><td>' + brand[2] + '</td>'
          newRow += '<td>' + brand[3] + '</td><td>' + brand[4] + '</td><td>' + brand[5] + '</td></tr>'

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




