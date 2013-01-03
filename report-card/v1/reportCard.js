var Events = {

	bind		: function(){

		$('select').on('change', Events.addBrand )

	},

	addBrand	: function(){

		var index = $(this).find(':selected').val()

		$('.series').eq(index).show()
	}
}

