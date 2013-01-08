var RRView = {

	renderView : function(){

		var source = $('#reports_view').html()	
		var template = Handlebars.compile( source )
		$('#module_container').html( template )

	},

	renderReports: function(reports) {
		var source = $('#report_template').html()	
		var template = Handlebars.compile( source )
		$('#reports').html( template(reports) )

	}

}

var RREvents = {

	bind		: function(){

		$('select').on('change', RREvents.addBrand )

		$('.report').on( 'mouseover', RREvents.showArrow )

		$('.report').on( 'mouseout', RREvents.hideArrow )

		$('.report').on( 'click', RREvents.showReportDetails )

	},

	addBrand	: function(){

		var index = $(this).find(':selected').val()

      $('.series').eq(index).show()
	},

	showArrow	: function(){

	    if ( !$(this).find('.arrow').hasClass('gray') ){
	  	
	    	$(this).find('.arrow').show()

	    }

	},

	hideArrow 	: function(){

	    if ( !$(this).find('.arrow').hasClass('gray') ){

	        $(this).find('.arrow').hide()

	    }
		  
	},

	showReportDetails: function(){

		$('.details-shown').removeClass('details-shown')
	    $('.gray').removeClass('gray')

			$( $(this) ).addClass('details-shown')
	    $( $(this).find('.arrow') ).addClass('gray') 

		$('#report_pane').show()

	} 
}
