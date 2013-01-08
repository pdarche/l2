var engagementChart = function(data, brandId, el){

	function Comparator(a,b){
		if (a[2] > b[2]) return -1;
		if (a[2] < b[2]) return 1;
		return 0;
	}

	data.sort(Comparator)

	/******************** STATIC ELEMENTS ******************/ 

	var w = 806,
		h = 390,
		padding = 60;

	var svg = d3.select(el) // 
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "chart_svg")		
		
	//growth label
	d3.select('#chart_svg').append('text') //chart_svg
			.text("LIKES GROWTH %")
			.attr('id', 'growth')
			.attr('class', 'label')
			.attr('x', h/2 + 30)
			.attr('y', h - 5)

	//interaction label
	d3.select('#chart_svg').append('text')  //chart_svg
			.text("ENGAGEMENT RATE")
			.attr('transform', 'rotate(-90)')
			.attr('id', 'interaction')
			.attr('class', 'label')
			.attr('x', -w/2)
			.attr('y', 20)

	d3.select('#chart_svg').append('text')
		.text('note: discrepancies may exist for brands utilizing geotargeting')
		.style('font-size', '10px')
		.style('font-style', 'italic')
		.style('opacity', .7)
		.attr('x', 220)
		.attr('y', h - 30)

	/************* DATA *************/ 

	minX = roundNumber(d3.min(data, function(d) { return d[0]}), 2)
	maxX = roundNumber(d3.max(data, function(d) { return d[0]}), 2);
	minY = roundNumber(d3.min(data, function(d) { return d[1]}), 2);
	maxY = roundNumber(d3.max(data, function(d) { return d[1]}), 2);


	/************* DYNAMIC CONTENT *************/ 
	setScales(svg, data, w, h, maxX, minX, brandId);

}

	function setScales(_svg, _data, _w, _h, maxX, minX, brandId){

		var data = _data,	
			w = _w,
			h = _h,
			svg = _svg,
			range = maxX - minX;

		var linearXScale = d3.scale.linear()
				 .domain([ -((maxX - minX)/8), d3.max(data, function(d) { return d[0] })])
	             .range([50, w - 20]);

		var xScale = d3.scale.log()
	             .domain([.01, d3.max(data, function(d) { return d[0] + d[0]/8; })])
	             .range([30, w - 20]);

	    var yScale = d3.scale.linear()
		        .domain([-.001, d3.max(data, function(d) { return d[1] + d[1]/4 })])
		        .range([h - 40, 20]);

		var dScale = d3.scale.linear()
		 	    .domain([d3.min(data, function(d) { return d[2]}), d3.max(data, function(d) { return d[2] })])
		 		.range([20, 80]);       

		setAxes(data, w, h, xScale, yScale, dScale, svg, maxX, minX, linearXScale);
		updateCircles(data, svg, xScale, yScale, dScale, w, h, linearXScale, range, brandId);
	}

	function setAxes(_data, _w, _h, _xScale, _yScale, _dScale, _svg, maxX, minX, _linearX){
		var data = _data,
			w = _w,
			h = _h,
			xScale = _xScale,
			yScale = _yScale,
			dScale = _dScale,
			svg = _svg,
			linearX = _linearX; 

		  var ticks = [];
	      $.each(yScale.ticks(8), function(key, value){
	      	ticks.push(value * 100);
	      })
	
          var range = maxX - minX,
          	  numTicks = 10,
          	  interval = range/numTicks,
          	  yValues = [];


/************* AXES AND TICK MARKS *************/
 		if(range > 5){
 			for (var i = 1; i <= numTicks; i++){
	      	  	var value = roundNumber( (interval * i)/(21 - (2 * i)), 4); //THIS IS SUPER JANKY FIGURE OUT THE ACTUAL MATH!!!!!!
	      	  	yValues.push(value);
	      	  }

	      	var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(8)
              .tickSize(1)
              .tickValues(yValues) //[0, log10(1.1), log10(1.3), log10(3), log10(7), log10(20), log10(300)]
              .tickFormat(d3.format(".0%"))             

 		} else{
 			var xAxis = d3.svg.axis()
              .scale(linearX)
              .orient("bottom")
              .ticks(8)
              .tickSize(1)
              // .tickValues(yValues) //[0, log10(1.1), log10(1.3), log10(3), log10(7), log10(20), log10(300)]
              .tickFormat(d3.format(".0%"))
 		}

		var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(8)
              .tickSize(1)
              .tickFormat(d3.format(".2%"))          	  

        //tick markers
	  	svg.selectAll("range")
		     .data(yScale.ticks(8))
		   .enter().insert("line", "#growth")
		     .attr("x1", 30)
		     .attr("x2", w - 20)
		     .attr("y1", yScale)
		     .attr("y2", yScale)
		     .attr("class", "gray_line")
		     .style("stroke", "#ccc")

         svg.insert("g", "#growth")
			  .attr("class", "axis x_axis")
			  .call(xAxis)

		svg.insert("g", "#growth")
			  .attr("class", "axis y_axis")
			  .style('stroke-width', '1px')
			  .call(yAxis)

		d3.select('.y_axis').selectAll('text').attr("dy", "1em")

		d3.selectAll('text').style('position', 'absolute');
		
		var yAxis = $('.y_axis'),
			xAxis = $('.x_axis'),
			grays = $('.gray_line');

		//OFFSET X AXIS
		d3.select('.x_axis').attr("transform", "translate(0," + xAxisOffset(yAxis, grays) + ")")
		
		//OFSET Y AXIS
		if(range > 5){
			d3.select('.y_axis').attr("transform", "translate(" + yAxisOffset(xAxis, grays, maxX, minX) + ",0)") //yAxisOffset(xAxis, grays, maxX, minX)
		} else{
			var offset = yAxisOffset(xAxis, grays)
			
			offset < 60 ? offset = 75 : null

			d3.select('.y_axis').attr("transform", "translate(" + offset + ",0)") //yAxisOffset(xAxis, grays, maxX, minX)
		}

		//REMOVE ZEROS
		removeZeroLine(xAxis);
	}

	function removeZeroLine(_xAxis){
		var xAxis = _xAxis,
			ticksLength = xAxis.find('text').length,
			zeroPoint = xAxis.find('text');	

		for(var i = 0; i < ticksLength; i++){
			if(xAxis.find('text').eq(i).text() === "0%"){
				xAxis.find('text').eq(i).remove();
			}
		}
	}

	function xAxisOffset(yAxis, grays){

		var	yTicks = yAxis.find('text').length,
			graysLength = grays.length;	

		for(var i = 0; i < yTicks; i++ ){
			if(yAxis.find('text').eq(i).text() === "0.00%"){

				var yOffsetValue = yAxis.find('line').eq(i).parent().attr('transform').split(',')	
					yOffsetValue = yOffsetValue[1].substr(0, yOffsetValue[1].length-1)				

				if( yOffsetValue !== undefined ){

					return yOffsetValue
				} 
				else {
					return yAxis.find('line').eq(i).parent().position().top;
				}

				//this needs to be changed
				if(graysLength >= 9){ 
					grays.eq(2).remove();
				} else{
					grays.eq(0).remove();
				}				
			}
		}
	}

	function yAxisOffset(_xAxis, _grays){
		var xAxis = _xAxis,
			grays = _grays,
			xTicks = xAxis.find('text').length;

		// if (((maxX * 100) - (minX * 100)) > 500){
		// 	return 45;
		// }
		// else{

			for (var i = 0; i < xTicks; i++){

				if(xAxis.find('text').eq(i).text() === "0%"){

					var xOffsetValue = xAxis.find('line').eq(i).parent().attr('transform').split(',')
						xOffsetValue = xOffsetValue[0].substr(10)

					if ( xOffsetValue !== undefined){
						
						return xOffsetValue
					}
					else {
						return xAxis.find('line').eq(i).parent().position().left;
					}
				} 
			}
		// }
	}

	function updateCircles(data, svg, xScale, yScale, dScale, w, h, linearX, range, brandId){

		var brand = svg.selectAll(".brand")
		      .data(data)
		    .enter().append("g")
		      .attr("class", "brand")
		      .attr("transform", function(d) { 
		      	if(range > 5){
		      		return "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")"; 
		      	} else {
		      		return "translate(" + (linearX(d[0]) - 7) + "," + yScale(d[1]) + ")"; 
		      	}
		      })

		brand.append('circle')
		  .attr("r", function(d) { return dScale(d[2])})
		  .style('stroke-width', function(d){
		  	if (String(d[4]) === brandId){
		  		return 4	
		  	} else{
		  		return 2
		  	}
		  }).style('fill', function(d){
		  	if (String(d[4]) === brandId){
		  		return '#3EA549'	
		  	}
		  }).style('stroke', function(d){
		  	if (String(d[4]) === brandId){
		  		return '#3EA549'	
		  	}
		  })
		  .attr('class', 'engagement-circle')
		  .on("mouseover", function(){
		  		d3.select(this)
		  			.transition()
		  				.style("fill-opacity", .85);})
		  .on("mouseout", function(){
		  		d3.select(this)
		  			.transition()
		  				.style("fill-opacity", .4);
		  })


	brand.on("mouseover", function(){
		
		var brandData = d3.select(this)[0][0].__data__,
			x = Number(d3.select(this).attr('transform').split(',')[0].substr(10))
			y = yScale(brandData[1]),
			d = dScale(brandData[2])

		d3.select('#chart_svg').append('rect')
			  .attr('x', function(){
			  	if( x + d >= .7 * w){
			  		return (-1 * d - 185) + x
			  	}else{
			  		return x + d + 5
			  	}
			  })
			  .attr('y', function(){
			   	if ( y <= .25 * h ){
			   		return 10
			   	} else{
			   		return (-1 * d) + y
			   	}
			  })
			  .attr('width', 180)
			  .attr('height', 55)
			  .attr('rx', 5)
			  .attr('ry', 5)
			  .attr('id', 'engagement_tooltip')

		//append brand title text
		d3.select('#chart_svg').append('text')
				.text(function() { return brandData[3] + "\n"})
			  	.style('font-weight' , 'bold')
			  	.style('font-size' , '10px')
			  	// .attr('dx', -10)
			  	.attr('class', 'tooltip-class')
		
		// append likes total text
		d3.select('#chart_svg').append('text')	
			.text(function(){return "total likes: " +  addCommas(brandData[2]) + "\n"})
			.style('font-size' , '10px')
			.attr('dy', '1.2em')
			// .attr('dx', -10)
			.attr('class', 'tooltip-class')

		//append likes growth text	
		d3.select('#chart_svg').append('text')
				.text(function(){return "likes growth: " + roundNumber((brandData[0] * 100), 2) + '% \n'})
				.style('font-size' , '10px')
				.attr('dy', '2.4em')
				// .attr('dx', -10)
				.attr('class', 'tooltip-class')
		
		//append engagement text
		d3.select('#chart_svg').append('text')
			.text(function(){return "engagement: " + roundNumber((brandData[1] * 100), 2) + '%'})
			.style('font-size' , '10px')
			.attr('dy', '3.6em')
			// .attr('dx', -10)
			.attr('class', 'tooltip-class')
			
		d3.select('#chart_svg').selectAll('.tooltip-class')	
			  .attr('x', function(){
			  	if( x + d >= .7 * w){
			  		return (-1 * d - 180) + x
			  	}else{
			  		return x + d + 10
			  	}
			  })
			  .attr('y', function(){
			   	if ( y <= .25 * h ){
			   		return 22
			   	} else{
			   		return (-1 * d) + y + 12
			   	}
			  })
			  .style('font-size', 10)
	

	})
	.on("mouseout", function(){
			d3.select('#chart_svg').selectAll('rect').remove();
			d3.select('#chart_svg').selectAll('.tooltip-class').remove();
	})
	

	}


	 function roundNumber(num, dec) {
	    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	    return result;
	 }

	function log10(val) {
	  return Math.log(val) / Math.log(10);
	}

	function addCommas(nStr){
	  nStr += '';
	  x = nStr.split('.');
	  x1 = x[0];
	  x2 = x.length > 1 ? '.' + x[1] : '';
	  var rgx = /(\d+)(\d{3})/;
	  while (rgx.test(x1)) {
	    x1 = x1.replace(rgx, '$1' + ',' + '$2');
	  }
	  return x1 + x2;
	}


