TimeseriesView = {

	renderView : function() {

		var source = $('#timeseries_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	}
}