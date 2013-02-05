
var EngagementView = {

	init : function() {

		var source = $('#engagement_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	    //fetch user brand
	    EngagementView.configUserObject( user.users[0].default_brand_id )
	    console.log( "the user's data is: ", engagementBrandData )
	    $.when( EngagementView.fetch( "GET", "data", brandNonEngagement ) )
	    	.done( function( data ){ console.log("this is the non-engagement data ", data) } )
	    	.done( EngagementView.fetch( "GET", "data", engagementBrandData ) )
	    	.done( function( data ){ console.log("this is the engagement data ", data) } )

		if ( brandList.length > 0 ){
            
            console.log("already set")
            TimeseriesView.bindAutocomplete()


        } else {
        	console.log("not yet set, setting")

            // $.when(TimeseriesView.fetch("GET", "ref", getAllBrands, this))
            //     .done( TimeseriesView.setBrandList )
            //     .done( TimeseriesView.bindAutocomplete )

        }

	   	//fetch top 10 facebook engagement for category
	    $.when( EngagementView.fetch("GET", "data", fbEngagementTopTen, this) )
	    	.done( EngagementView.renderCategoryBenchmarks )


        $.when( TimeseriesView.renderFavoriteBrands( user.users[0].favorite_brands) )
            .done( TimeseriesView.synchFavorites )

	},

	renderChart : function( callback ) {

		EngagementView.getData(3, callback)

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

	getData : function ( category, callback ){

		var url = 'http://l2-data.com/ajax/scraperDataWS.svc/getTop10EngagementBrandDataBySize?u=6700' 
			url += '&categoryId=3&likesMin=500001'
			url += '&likesMax=1000000&callback=?'

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

    configTopEightEngagement : function( categoryId, sizeId ){	

    },

    configUserObject : function( brandId ){

    	brandNonEngagement.brands[0].brand_id = "74" //brandId
    	brandNonEngagement.fact_brand_daily.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		brandNonEngagement.fact_brand_daily.constraints.end_date = Date.today().toString("yyyyMMdd")

  		engagementBrandData.brands[0].brand_id = "74" //brandId
    	engagementBrandData.fact_fbpost.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		engagementBrandData.fact_fbpost.constraints.end_date = Date.today().toString("yyyyMMdd")

    }

}


var brandNonEngagement = {
    "brands" : [{ "brand_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "",
            "end_date" : "",
            "timeseries" : false
        }
    }
}

var engagementBrandData = {
    "brands" : [{ "brand_id" : "" }],
    "fact_fbpost" : {
        "metrics": [
            "facebook_like_interaction_rate"
        ],
        "constraints" : {
            "start_date" : "",
            "end_date" : "",
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
