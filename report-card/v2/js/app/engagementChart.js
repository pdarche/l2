
var EngagementView = {

    clickedBenchmarks : [],

    communitySizes : {

        "1" : { "min" : 20000, "max" : 100000 },
        "2" : { "min" : 100000, "max" : 500000 },
        "3" : { "min" : 500000, "max" : 1000000 },
        "4" : { "min" : 1000000, "max" : 1000000000 } 
    },

	init : function() {

		var source = $('#engagement_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

        brandDataEngagement.brands[0].brand_id = user.users[0].default_brand_id
        categoryDataEngagement.brands[0].category_id = user.users[0].default_category_id

	    //fetch top eight brands data
        $.when(

            EngagementView.fetch( "GET", "data", brandDataEngagement ), 
            EngagementView.fetch( "GET", "data", categoryDataEngagement ) 

        ).done(

            function( memberBrand, categoryLeaders ){

                EngagementView.clickedBenchmarks.push( memberBrand[0].brands[0] )

                brandDataEngagement.brands = []
                $.each(categoryLeaders[0].brands, function(i){                    
                    brandDataEngagement.brands.push( { "brand_id" : categoryLeaders[0].brands[i].brand_id } )
                })


                $.when( EngagementView.fetch( "GET", "data", brandDataEngagement ) )
                .done(

                    function( categoryLeaders ) {

                        var brands = [ EngagementView.clickedBenchmarks, categoryLeaders.brands ] 

                        var brandList = []
                        $.each(brands, function(i){
                            $.each(brands[i], function(j){
                                brandList.push(brands[i][j])
                            })
                        })

                        EngagementView.clickedBenchmarks = brandList

                        var engagementData = EngagementView.formatData( brandList )

                        EngagementView.renderChart( engagementData )

                        // set community size dropdown
                        var cat = getCommunityCategory( EngagementView.clickedBenchmarks[0].facebook_likes_count_total[0][1] )
                        $('#community_size_drop').val(cat)
                    }
                )
            }
        )


        //populate/bind brand list
		if ( brandList.length > 0 ){
            
            console.log("already set")
            TimeseriesView.bindAutocomplete()

        } else {
        	console.log("not yet set, setting")

            $.when(TimeseriesView.fetch("GET", "ref", getAllBrands, this))
                .done( TimeseriesView.setBrandList )
                .done( TimeseriesView.bindAutocomplete )

        }


	   	//fetch top 8 facebook engagement for category
	    $.when( EngagementView.fetch("GET", "data", categoryDataEngagement, this) )
	    	.done( EngagementView.renderCategoryBenchmarks )
            .done( function() { 

                $('#category_benchmark_results .brand-check').attr('checked', true)
                $('#category_benchmark_drop').val(user.users[0].default_category_id)
            
            })


        $.when( TimeseriesView.renderFavoriteBrands( user.users[0].favorite_brands) )
            .done( TimeseriesView.synchFavorites )

        EngagementView.bindEvents()

	},

    bindEvents : function() {

        $('#category_benchmark_results, #favorite_benchmarks_results, #search_benchmarks_results').delegate('.brand-check', 'click', function(){
            var id = $(this).attr('class').split(" ")[1]
            
            if ( $(this).is(':checked') ){

                $.when( EngagementView.configUserObject( id ) )
                .done(

                    $.when( EngagementView.fetch( "GET", "data", brandDataEngagement, this) )
                    .done(
                        function( data ){
                            
                            EngagementView.clickedBenchmarks.push( data.brands[0] )
                            var engagementData = EngagementView.formatData( EngagementView.clickedBenchmarks )
                            EngagementView.renderChart( engagementData )

                        }
                    )
                )
                
            } else {

                EngagementView.removeFromBenchmarks( id )
                var data = EngagementView.formatData( EngagementView.clickedBenchmarks )
                EngagementView.renderChart( data )                

            }
        })

        $('#category_benchmark_drop, #community_size_drop').on('change', function(){

            var category = $('#category_benchmark_drop').val(),
                community = $('#community_size_drop').val()
            
            $.when( EngagementView.configTopEightEngagement( category, community ) )
            .done(
                $.when( EngagementView.fetch("GET", "data", categoryDataEngagement, this) )
                    .done( EngagementView.renderCategoryBenchmarks )
            )

        })

    },

    bindAutocomplete : function(data){

        $('#benchmark_search_input').autocomplete({
            source : brandList,
            select : function(evet, ui){
                $('#benchmark_search_input').val( ui.item.label )
                
                var targetId = ui.item.value

                TimeseriesView.addSearchBrand( targetId )

            }
        })
        
        //to do: remove impediment to setting defalut
        $('#benchmark_search_input').attr("placeholder", "type to select brand")
        $('#benchmark_search_input').prop("disabled", false)

    },

    removeFromBenchmarks : function( brandId ){

        var index = $.inArray( EngagementView.clickedBenchmarks, brandId )

        EngagementView.clickedBenchmarks.remove( index )

    }, 

	renderChart : function( engagementData ) {

        $('#engagement_chart_container').children().remove()
        engagementChart(engagementData, 12, '#engagement_chart_container')
        $('#engagement_chart_container').children().hide().fadeIn()

	},

	renderCategoryBenchmarks : function( brands ){

    	var source = $('#brand_partial').html()	
		var template = Handlebars.compile( source )
		$('#category_benchmark_results').html( template(brands) )

        $('#category_benchmark_results').children().hide().fadeIn(150)

    },

    renderSearchBrand : function( brands ){

        var source = $('#brand_partial').html() 
        var template = Handlebars.compile( source )
       $('#search_benchmarks_results').append( template(brands) )

    },

    renderFavoriteBrands : function() { //brands
        $('#favorite_benchmarks_results').children().remove()

        var brands = user.users[0].favorite_brands

        var favs = { "brands" : brands }  

        var source = $('#brand_partial').html() 
        var template = Handlebars.compile( source )
        $('#favorite_benchmarks_results').append( template(favs) )
            .children().find('.favorite-icon')
            .addClass('favorite')

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
            console.log("trying to post", queryObject)

			return $.ajax({
			    type: "POST",
			    url: String(baseURL + db),
			    contentType: 'application/json',
			    data: queryObject,
			    success: function(r) {
			    	console.log("yuuccchhh", r)
			    }
			});
		}

    },

    formatData : function( brandsAr ){

        var data = []

        for ( i = 0; i < brandsAr.length; i++ ) {

              x = brandsAr[i].facebook_likes_count_total_growth30[0][1],
              y = brandsAr[i].facebook_likes_interaction_rate[0][1]/100,
              d = brandsAr[i].facebook_likes_count_total[0][1],
              name = brandsAr[i].brandfamily_name,
              id = brandsAr[i].brand_id;

              data.push([ x, y, d, name, id ])      
        }

        return data
    },

    configTopEightEngagement : function( categoryId, sizeId ){	

        categoryDataEngagement.brands[0].category_id = categoryId
        categoryDataEngagement.fact_brand_daily.constraints.facebook_likes_count_total["min"] = EngagementView.communitySizes[sizeId]["min"]
        categoryDataEngagement.fact_brand_daily.constraints.facebook_likes_count_total["max"] = EngagementView.communitySizes[sizeId]["max"]

    },

    configUserObject : function( brandId ){

        brandDataEngagement.brands = []
    	brandDataEngagement.brands.push( { "brand_id" : brandId})

        return brandDataEngagement

    }

}

var brandDataEngagement = {
    "brands" : [{ "brand_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",    
            "facebook_likes_count_total_growth30",
            "facebook_likes_interaction_rate"
        ],
        "constraints" : {
            "start_date" : (3).days().ago().toString("yyyyMMdd"),
            "end_date" : (2).days().ago().toString("yyyyMMdd"),
            "timeseries" : false
        }
    }
}

var categoryDataEngagement = {
    "brands" : [{ "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_interaction_rate",
            "facebook_likes_count_total"           
        ],
        "constraints" : {
            "start_date" : (3).days().ago().toString("yyyyMMdd"),
            "end_date" : (2).days().ago().toString("yyyyMMdd"),
            "timeseries" : false,
            "facebook_likes_interaction_rate" : {
                "top" : 8
            },
            "facebook_likes_count_total" : {
                "min" : 1000000
            }
        }
    }
}

var getCommunityCategory = function( communitySize ){

    for ( var i = 1; i <= 4; i++ ){

        if ( communitySize > EngagementView.communitySizes[String(i)]["min"] && communitySize < EngagementView.communitySizes[String(i)]["max"] ){

            return String(i)
        } 

    }
}

