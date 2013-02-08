var SetDefaultView = {

	init : function(){

		SetDefaultView.renderView()

	    $.when(SetDefaultView.fetch("GET", "ref", getAllBrands, this))
	        .done( SetDefaultView.setBrandList )
	        .done( SetDefaultView.bindAutocomplete )

	},

	renderView : function() {

		var source = $('#landing_page_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	},

    setBrandList : function( data ) {
        
        $.each(data.brands, function(i){
          var brandName = data.brands[i].brandfamily_name,
              brandGeo = data.brands[i].geography_name,
              brandMod = data.brands[i].extra_modifier,
              brandElement = String( brandName + ' - ' + brandGeo),
              brandId = data.brands[i].brand_id

          brandMod !== '' ? brandElement += ' - ' + brandMod : null

          var brandObject = { label : brandElement, value : brandId }
               
          brandList.push( brandObject )
        })

    },

    bindAutocomplete : function( data ){

        $('#set_default_input').autocomplete({
            source : brandList,
            select : function(evet, ui){
                $('#benchmark_search_input').val( ui.item.label )
                
                var targetId = ui.item.value

                getBrand.brands[0].brand_id = targetId
                
                $.when( SetDefaultView.fetch( "GET", "ref", getBrand, this ) )
                .done( 
                	function( data, status, jqXHR ){
                		$.when( SetDefaultView.configUserObject(data) )
                		.done( 
                			function( data, status, jqXHR ){
	                			$.when( SetDefaultView.fetch( "POST", "ref", data, this) )
	                			.success( 
	                				TimeseriesView.init()
	                			)                			
                			}
                		)	
                	}
                )
            }
        })
        
        //to do: remove impediment to setting defalut
        $('#set_default_input').attr("placeholder", "Type in your brands name...")
        $('#set_default_input').prop("disabled", false)

    },

    configUserObject : function( data ) {

    	var newUser = $.extend( true, {}, emptyUser );

    	newUser.default_brand = data.brands[0]
    	newUser.default_brand_id = data.brands[0].brand_id
    	newUser.default_brandfamily_id = data.brands[0].brandfamily_id
    	newUser.default_company_id = data.brands[0].company_id
    	newUser.favorite_brandfamilies = [],
    	newUser.favorite_brands = [],
    	newUser.favorite_companies = [],
    	newUser.user_email = $('#user_email').html()

    	return { "users" : [ newUser ] } 
    },

    setDefault : function( brandId ) {



    },

	fetch : function( method, db, queryObject, postData ){

		//build query
		var baseURL = "http://l2ds.elasticbeanstalk.com/",
			db = db + "?format=json&q=",
			queryString = JSON.stringify( queryObject ),
			query = encodeURI( baseURL + db + queryString )

		//make request
		if ( method === "GET" ){
            
			return $.getJSON( query )
		}
		else if ( method === "POST" ){

			console.log("this is the querystring ", queryString )

            return $.ajax({
                type: "POST",
                url: "http://l2ds.elasticbeanstalk.com/ref",
                data: queryString,
                dataType : "json",
                success: function(r) {
                    console.log("favorite saved", r)
                }
            });

		}

    },
}

var emptyUser = {
	"default_brand" : {},
	"default_brand_id" : null,
	"default_brandfamily_id" : null,
	"default_company_id" : null,
	"favorite_brandfamilies" :[],
	"favorite_brands" : [],
	"favorite_companies" : [],
	"user_email" : null
}