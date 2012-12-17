	
var Spider = {
		series: undefined,
		minValue: undefined,
		maxValue: undefined,
		width: undefined,
		height: undefined,
		radius: undefined,
		radiusLength: undefined,
		ruleColor: undefined,
		colors: undefined,
		dimensions: undefined,
		brandNames: undefined,

		config: function(){

		},

		loadData: function(data){ //the structure of this function will depend on the data source
			var average = []

			//for each dimentions
		    for ( var i = 0; i < dimensions.length; i++ ){
		        
		        // add brandname to brandnames
		        var brand = []
		        	brandNames.push( ranking.data[i].brand )
		        
		        //make metric array from the ith dimension of each brand
		        for (var j = 0; j < 6 ; j++){
					var score = ranking.data[i][dimensions[j]]
						brand.push(score)
		        }
		        series.push(brand)
		    }

		    //to complete the radial lines
		    for ( var m = 0; m < series.length; m += 1 ) {
		        series[m].push(series[m][0]);
		    }

		    //attribute k
		    for ( var k = 0; k < 7; k++){
		        var dataPoint = 0
		        //brand l
		        for (var l = 0; l < 6; l++){
		            dataPoint += Number(series[l][k])
		        }

		      dataPoint = dataPoint/6
		      average.push(dataPoint)

		    }

		    series.push(average)
		    brandNames.push("Average")
		
		},

		buildBase: function(){

			var viz = d3.select("#viz")  // this will be whatever selector in the html templage
		        .append('svg:svg')
		        .attr('width', this.width )
		        .attr('height', this.height )
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

		},

		setScales: function(){

			  var heightCircleConstraint,
			      widthCircleConstraint,
			      circleConstraint,
			      centerXPos,
			      centerYPos;

			  //need a circle so find constraining dimension
			  heightCircleConstraint = this.height - vizPadding.top - vizPadding.bottom;
			  widthCircleConstraint = this.width - vizPadding.left - vizPadding.right;

			  circleConstraint = d3.min([
			      heightCircleConstraint, widthCircleConstraint
			  ]);

			  radius = d3.scale.linear().domain( [this.minVal, this.maxVal] )
			      .range( [0, (circleConstraint / 2 )] );
			  radiusLength = radius( this.maxVal );

			  //attach everything to the group that is centered around middle
			  centerXPos = widthCircleConstraint / 2 + this.vizPadding.left;
			  centerYPos = heightCircleConstraint / 2 + this.vizPadding.top;

			  vizBody.attr("transform",
			      "translate(" + centerXPos + ", " + centerYPos + ")");
		
		},

		addAxes: function(){
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
			  //     // .style('opacity', .5)
			  //     .style("fill", "none");

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
			      .data(dimensions)
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

		},

		draw: function(){
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

			  groups.selectAll(".label")
			      .data(function (d) {
			          return d[0];
			      })
			      .enter().append("svg:text")
			      .text(function(d){return d})
			      .attr("class", "label");

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
		} 








	