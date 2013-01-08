
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

        	engagementChart(data, 12, '#module_container')
        	console.log( "callback data", data )

        } )

    },

    showData : function ( data ){        

        console.log( "data", data )

    }    

}