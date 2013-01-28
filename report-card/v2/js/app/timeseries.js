TimeseriesView = {

	init : function() {

		var source = $('#timeseries_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	    //fetch top 8 facebook likes
	    $.when(TimeseriesView.fetch("GET", "data", fbLikesTopEight, this))
	    	.done( TimeseriesView.formatRankingData )
	    	.done( TimeseriesView.renderBrands )

	    //populate brands for brand search functionality 
		$.when(TimeseriesView.fetch("GET", "ref", getAllBrands, this)).done( TimeseriesView.bindAutocomplete )

		//fetch member brand data 
		$.when( TimeseriesView.formatBrandQuery("74") )
			.done( TimeseriesView.fetch("GET", "data", brandData, this) )
			// .done( TimeseriesView.formatBrandData )
			// .done()

	},
	//bind events
	bindEvents : function() {

		$('#category_benchmark_drop').on('change', function(){
			
			var categoryId = $(this).val()

			TimeseriesView.categoryTopEight( categoryId, "facebook_likes_count_total")

		})

	},

	fetch : function( method, db, queryObject, context ){
		  
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
			var data = null
			$.post( query, data, callback, 'json' )
		}

    },

    categoryTopEight : function( categoryId, metric ){

    	TimeseriesView.configureCategoryBenchmarkObject( categoryId, metric )

    	$('#category_benchmark_results').empty()

		$.when(TimeseriesView.configureCategoryBenchmarkObject( categoryId, metric ))
			.done(TimeseriesView.fetch("GET", "data", categoryBenchmarksQueryObject, this))
	    	.done( TimeseriesView.formatRankingData )
	    	.done( TimeseriesView.renderCategoryBenchmarks )

    },

    configureCategoryBenchmarkObject : function( categoryId, metric ){

    	console.log("here goes nothin")

    	categoryBenchmarksQueryObject.brands[0].category_id = categoryId
    	categoryBenchmarksQueryObject.fact_brand_daily.metrics[0] = metric
    	categoryBenchmarksQueryObject.fact_brand_daily.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		categoryBenchmarksQueryObject.fact_brand_daily.constraints.end_date = Date.today().toString("yyyyMMdd")
  		categoryBenchmarksQueryObject.fact_brand_daily.constraints[metric] = {"top" : 8}

  		// return brandData

    },

    renderCategoryBenchmarks : function( brands ){

    	var source = $('#brand_partial').html()	
		var template = Handlebars.compile( source )
		$('#category_benchmark_results').html( template(brands) )

    },

    bindAutocomplete : function(data){

    	var brandList = []
        
	    $.each(data.brands, function(i){
	      var brandName = data.brands[i].brandfamily_name,
	          brandGeo = data.brands[i].geography_name,
	          brandMod = data.brands[i].extra_modifier,
	          brandElement = String( brandName + ' - ' + brandGeo),
	          brandId = data.brands[i].brand_id

	      brandMod !== ''? brandElement += ' - ' + brandMod : null

	      var brandObject = { label : brandElement, value : brandId }
	           
	      brandList.push( brandObject )
	    })
        
        $('#benchmark_search_input').autocomplete({
            source : brandList,
            select : function(evet, ui){
                $('#benchmark_search_input').val( ui.item.label )
                
                var brandObj = undefined,
                    targetId = ui.item.value
                
                for (index in data.brands){
                    data.brands[index].brand_id === targetId ? brandObj = data.brands[index] : null
                }
            }
        })
        
        //to do: remove impediment to setting defalut
        $('#benchmark_search_input').attr("placeholder", "type to select brand")
        $('#benchmark_search_input').prop("disabled", false)

        console.log("autcomplete done loading")
    },
    //
    formatBrandQuery : function( brandId ) {

    	brandData.brands[0].brand_id = brandId
    	brandData.fact_brand_daily.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		brandData.fact_brand_daily.constraints.end_date = Date.today().toString("yyyyMMdd")

  		return brandData
    },    

    //this should be the model!!!!
    formatBrandData : function( data ){

	    var brand = {

	          name: data[0].brands[0].brandfamily_name,
	          id: data[0].brands[0].brand_id,
	          categoryId: data[0].brands[0].category_id,
	          categoryName: data[0].brands[0].category_name,
	          likes: data[0].brands[0].facebook_likes_count_total, 
	          likesPerDay: data[0].brands[0].facebook_likes_count_today,
	          likesPerDayAvg: data[0].brands[0].facebook_likes_count_today,
	          likesGrowth: data[0].brands[0].facebook_likes_count_total_growth30,
	          FBEngagement: data[1].brands[0].facebook_post_likes_interaction_rate,
	          followers: data[0].brands[0].twitter_follower_count_total,
	          followersDay: data[0].brands[0].twitter_follower_count_today,
	          followersPerDayAvg: data[0].brands[0].twitter_follower_count_today, 
	          tweets: data[0].brands[0].twitter_tweets_count_today, 
	          uploads: data[0].brands[0].youtube_uploads_count_today,
	          views: data[0].brands[0].youtube_videos_views_count_total,
	          viewsGrowth: data[0].brands[0].youtube_videos_views_count_total_growth30,
	          links : { facebook : "", twitter : "", youtube : "" }
	    
	    }

	    console.log( brand )

	    return brand
    },

    formatRankingData : function( data ){

	      var sortedBrands = data.brands.sort(function(a,b){
	                      return( a.facebook_likes_count_total[0][1] - b.facebook_likes_count_total[0][1] )
	                  })

	      sortedBrands.reverse()

	      var rankedBrands = { "data" : sortedBrands }

	      console.log("ranked brands:", rankedBrands)

	      return rankedBrands

    }
}

var brandData = {
    "brands" : [{ "brand_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "facebook_likes_count_total_growth30",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_today",
            "youtube_videos_views_count_total",
            "youtube_uploads_count_today",
            "youtube_videos_views_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "",
            "end_date" : ""
        }
    }
}

var getAllBrands = {
  "brands" : [ { "category_id" : "3" }, { "category_id" : "4" }, { "category_id" : "12" },
               { "category_id" : "13" }, { "category_id" : "15" }, { "category_id" : "17" },
               { "category_id" : "18" }
		]
}

var categoryBenchmarksQueryObject = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [],
        "constraints" : {
            "start_date" : "", 
            "end_date" : "",
            "timeseries" : false
        }
    }
}


var fbLikesTopEight = {
    "brands" : [ { "category_id" : "3" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "timeseries" : false,
            "facebook_likes_count_total" : {
                "top" : 8
            }
        }
    }
}

