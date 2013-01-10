
var EngagementView = {

	renderView : function() {

		var source = $('#engagement_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	},

	renderChart : function( callback ) {

		// var get = EngagementView.getData(3)
		// var show = EngagementView.showData()

		$.when( EngagementView.getData(3, callback) ).then( EngagementView.showData() );

	},

	getData : function ( category, callback ){

		var url = 'http://l2-data.com/ajax/scraperDataWS.svc/getTop10EngagementBrandDataBySize?u=6700' 
			url += '&categoryId=3&likesMin=500001'
			url += '&likesMax=1000000&callback=?'

		console.log( "url" , url )

        return $.getJSON( url, function(data) {

        	var returnedData = data;

	        var data = [],
	            minX,
	            maxX,
	            minY,
	            maxY,
	            numCircles = 5;

            //if there are less than 5 circles, set number of circles to number of brands returned
            returnedData.length < 5 ? numCircles = returnedData.length : null

        	for ( i = 0; i < numCircles; i++ ) {

		          x = (roundNumber(parseFloat(returnedData[i].likesGrowthPct30), 2)/100),
		          y = (roundNumber(parseFloat(returnedData[i].FBEngagement), 2)/100),
		          d = parseInt(returnedData[i].likesTotal.replace(/,/g , "")),
		          name = returnedData[i].brandName;
		          id = String(returnedData[i].brandId);

		            data.push([ x, y, d, name, id ])      
		      }

        	engagementChart(data, 12, '#engagement_chart_container')

        } )

    },

    showData : function ( data ){        

        console.log( "data", data )

    }    

}