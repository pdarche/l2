var EngagementView = {

	renderView : function() {

		var source = $('#engagement_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	},

	renderChart : function() {



	}

}