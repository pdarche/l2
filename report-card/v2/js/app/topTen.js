
var TopTenView = {

	init : function() {

		var source = $('#top_ten_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	}

}