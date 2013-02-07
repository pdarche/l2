
var EngagementView = {

    clickedBenchmarks : [],

	init : function() {

		var source = $('#engagement_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	    //fetch brands data
        $.when(
            EngagementView.fetch( "GET", "data", brandDataEngagement ), 
            EngagementView.fetch( "GET", "data", categoryDataEngagement ) 
        ).done(
            function( memberBrand, categoryLeaders ){

                EngagementView.clickedBenchmarks.push( memberBrand[0].brands[0] )
                console.log( "these are the clickedBnechies after first return ", EngagementView.clickedBenchmarks )


                brandDataEngagement.brands = []
                $.each(categoryLeaders[0].brands, function(i){                    
                    brandDataEngagement.brands.push( { "brand_id" : categoryLeaders[0].brands[i].brand_id } )
                })


                $.when( EngagementView.fetch( "GET", "data", brandDataEngagement ) )
                .done(
                    function( categoryLeaders ) {
                        console.log( "the category leaders are ", categoryLeaders.brands )
                        var brands = [ EngagementView.clickedBenchmarks, categoryLeaders.brands ] 

                        console.log("the brands array is ", brands)

                        var brandList = []
                        $.each(brands, function(i){
                            $.each(brands[i], function(j){
                                brandList.push(brands[i][j])
                            })
                        })

                        EngagementView.clickedBenchmarks = brandList

                        var engagementData = EngagementView.formatData( brandList )

                        EngagementView.renderChart( engagementData )
                    }
                )
            }
        )

        //populate/bind 
		if ( brandList.length > 0 ){
            
            console.log("already set")
            TimeseriesView.bindAutocomplete()

        } else {
        	console.log("not yet set, setting")

            $.when(TimeseriesView.fetch("GET", "ref", getAllBrands, this))
                .done( TimeseriesView.setBrandList )
                .done( TimeseriesView.bindAutocomplete )

        }

	   	//fetch top 10 facebook engagement for category
	    $.when( EngagementView.fetch("GET", "data", fbEngagementTopTen, this) )
	    	.done( EngagementView.renderCategoryBenchmarks )


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
                    function(data){ console.log ("returned query object ", data )},
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
        console.log("brands", brands)

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
            console.log("query string: ", queryString)

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

        console.log("these are the brands", brandsAr)

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



    },

    configUserObject : function( brandId ){

        brandDataEngagement.brands = []
    	brandDataEngagement.brands.push( { "brand_id" : brandId})

        return brandDataEngagement

    }

}

function round2(number){
    return Math.round( number*100 )/100 
}


var brandDataEngagement = {
    "brands" : [{ "brand_id" : "74" }],
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
    "brands" : [{ "category_id" : "3" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_interaction_rate"           
        ],
        "constraints" : {
            "start_date" : (3).days().ago().toString("yyyyMMdd"),
            "end_date" : (2).days().ago().toString("yyyyMMdd"),
            "timeseries" : false,
            "facebook_likes_interaction_rate" : {
                "top" : 8
            }
        }
    }
}


var engagementBrandData = {
    "brands" : [{ "brand_id" : "74" }],
    "fact_fbpost" : {
        "metrics": [
            "facebook_like_interaction_rate"
        ],
        "constraints" : {
            "start_date" : (3).year().ago().toString("yyyyMMdd"),
            "end_date" : (2).year().ago().toString("yyyyMMdd"),
            "timeseries" : false
        }
    }
}


var fbEngagementTopTen = {
    "brands" : [ { "category_id" : "3" }],
    "fact_fbpost" : {
        "metrics": [
            "facebook_post_likes_interaction_rate",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "timeseries" : false,
            "facebook_post_likes_interaction_rate" : {
                "top" : 8
                // "min" : 100000
            }
        }
    }
}
