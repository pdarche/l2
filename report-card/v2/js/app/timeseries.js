TimeseriesView = {

    clickedBenchmarks : [],

	init : function() {

		var source = $('#timeseries_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	    //fetch top 8 facebook likes
	    $.when(TimeseriesView.fetch("GET", "data", fbLikesTopEight, this))
	    	.done( TimeseriesView.formatRankingData )
	    	.done( TimeseriesView.renderCategoryBenchmarks )

	    //populate brands for brand search functionality 
		$.when(TimeseriesView.fetch("GET", "ref", getAllBrands, this)).done( TimeseriesView.bindAutocomplete )

		//fetch member brand data 
        TimeseriesView.configureBrandQuery( "74" )
        $.when( TimeseriesView.fetch("GET", "data", brandData, this) )          
            .done( TimeseriesView.renderChart )
            .done( TimeseriesView.addSeries )


        //fetch favorites
        TimeseriesView.renderFavoriteBrands( user.users[0].favorite_brands)
            
	},
    //render chart
    renderChart : function(){

        TimeseriesView.lineChart = new Highcharts.Chart(config)

    },
	//bind events
	bindEvents : function() {

		$('#category_benchmark_drop').on('change', function(){
			
			var categoryId = $(this).val(),
                metric = $('.active').attr('id')

			TimeseriesView.categoryTopEight( categoryId, metric)

		})

        $('.metric').click(function(){

            var categoryId = $('#category_benchmark_drop').val(),
                metric = $(this).attr('id');

            //remove 'active' class from toggled-from class to toggled-to class
            $('.active').removeClass('active')
            $(this).addClass('active')

            //update category benchmarks
            TimeseriesView.categoryTopEight( categoryId, metric)

            //change displayed metrics
            TimeseriesView.toggleMetric()

        })

        $('#category_benchmark_results').delegate('.brand-check', 'click', function(){
            var id = $(this).attr('class').split(" ")[1]
            
            if ( $(this).is(':checked') ){
                
                TimeseriesView.addBrand( id )

            } else {

                TimeseriesView.removeBrand( id )

            }
        })

        $('#reset_button').click(function(){

            TimeseriesView.removeAllSeries()

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

    addSeries : function( data ){

        var metric = $('.active').attr('id')

        TimeseriesView.clickedBenchmarks.push( data )

        TimeseriesView.lineChart.addSeries({
             name: data.brands[0].brandfamily_name + ' - ' + data.brands[0].geography_name, //+ ' ' + value.brands[0].extra_modifier,
             data: data.brands[0][metric]
             // color: colors[clickedBenchmarks.length]
          });

        TimeseriesView.lineChart.redraw(true)

        console.log(TimeseriesView.clickedBenchmarks)
        console.log("chart series: ", TimeseriesView.lineChart.series)

        return data

    },

    removeAllSeries : function() {
        var seriesSize = TimeseriesView.lineChart.series.length;

        for(var i = seriesSize - 1; i >= 0; i-- ){
            TimeseriesView.lineChart.series[i].remove(true)
        }

        // TimeseriesView.clickedBenchmarks = []

    },

    toggleMetric : function(){

        var metric = $('.active').attr('id')

        TimeseriesView.removeAllSeries()

        $.each(TimeseriesView.clickedBenchmarks, function(key, value){

            if(key === 0){

                TimeseriesView.lineChart.addSeries({
                    name: value.brands[0].brandfamily_name + ' - ' + value.brands[0].geography_name, //+ ' ' + value.brands[0].extra_modifier,
                    data: value.brands[0][metric],
                    lineWidth: 4,            
                    color: '#3ea549'
                });

            } else{

                TimeseriesView.lineChart.addSeries({
                    name: value.brands[0].brandfamily_name + ' - ' + value.brands[0].geography_name, //+ ' ' + value.brands[0].extra_modifier,
                    data: value.brands[0][metric]
                });

           }
        }); 

    },

    // THE FOLLOWING TWO FUNCTIONS SHOULD BE COMBINED
    // THEY ARE NOT BECAUSE I DON'T KNOW HOW TO PASS ARGUMENTS
    // INTO DEFERRED OBJECTS
    addBrand : function( brandId ){

        TimeseriesView.configureBrandQuery( brandId)
        $.when( TimeseriesView.fetch("GET", "data", brandData, this) )          
            .done( TimeseriesView.addSeries )
            // .done( function(){console.log( "clickedBenchmarks", TimeseriesView.clickedBenchmarks )})

    },

    addSearchBrand : function( brandId ){

        TimeseriesView.configureBrandQuery( brandId )
        $.when( TimeseriesView.fetch("GET", "data", brandData, this) )          
            .done( TimeseriesView.addSeries )
            .done( TimeseriesView.renderSearchBrand )

        var brandSelector = '.' + brandId
        $(brandSelector).attr('checked', true)

    },

    removeBrand : function( brandId ) {

        var brandIndex = undefined

        $.each(TimeseriesView.clickedBenchmarks, function(i,v){
            v.brands[0].brand_id === brandId ? brandIndex = i : null
        })

        //remove brand index from series 
        TimeseriesView.lineChart.series[brandIndex].remove();
        //remove brand index from clickedBenchmarks
        TimeseriesView.clickedBenchmarks.remove( brandIndex )
        console.log(TimeseriesView.clickedBenchmarks)

    },

    categoryTopEight : function( categoryId, metric ){

    	TimeseriesView.configureCategoryBenchmarkObject( categoryId, metric )

    	$('#category_benchmark_results').empty()
        
        $.when(TimeseriesView.fetch("GET", "data", categoryBenchmarksQueryObject, this))
            .done( TimeseriesView.formatRankingData )
            .done( TimeseriesView.renderCategoryBenchmarks )

    },

    configureCategoryBenchmarkObject : function( categoryId, metric ){

    	categoryBenchmarksQueryObject.brands[0].category_id = categoryId
    	categoryBenchmarksQueryObject.fact_brand_daily.metrics[0] = metric
    	categoryBenchmarksQueryObject.fact_brand_daily.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		categoryBenchmarksQueryObject.fact_brand_daily.constraints.end_date = Date.today().toString("yyyyMMdd")
  		categoryBenchmarksQueryObject.fact_brand_daily.constraints[metric] = {"top" : 8}

        return categoryBenchmarksQueryObject

    },

    // THE FOLLOWING TWO FUNCTIONS SHOULD BE COMBINED
    // THEY ARE NOT BECAUSE I DON'T KNOW HOW TO PASS ARGUMENTS
    // INTO DEFERRED OBJECTS
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

    renderFavoriteBrands : function( brands ) {
        var favs = { "brands" : brands }  

        var source = $('#brand_partial').html() 
        var template = Handlebars.compile( source )
        $('#favorite_benchmarks_results').append( template(favs) )   
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
                
                var targetId = ui.item.value

                TimeseriesView.addSearchBrand( targetId )

            }
        })
        
        //to do: remove impediment to setting defalut
        $('#benchmark_search_input').attr("placeholder", "type to select brand")
        $('#benchmark_search_input').prop("disabled", false)

    },

    //
    configureBrandQuery : function( brandId ) {

    	brandData.brands[0].brand_id = brandId
    	brandData.fact_brand_daily.constraints.start_date = (1).year().ago().toString("yyyyMMdd")
  		brandData.fact_brand_daily.constraints.end_date = Date.today().toString("yyyyMMdd")

  		return brandData
    },    

    //this should be the model!!!!
    formatBrandData : function( data ){

        conosle.log("this is the brand data: ", data)

	    var brand = {

	          name: data.brands[0].brandfamily_name,
	          id: data.brands[0].brand_id,
	          categoryId: data.brands[0].category_id,
	          categoryName: data.brands[0].category_name,
	          likes: data.brands[0].facebook_likes_count_total,
	          likesPerDay: data.brands[0].facebook_likes_count_today,
	          likesPerDayAvg: data.brands[0].facebook_likes_count_today,
	          likesGrowth: data.brands[0].facebook_likes_count_total_growth30,
	          FBEngagement: data.brands[0].facebook_post_likes_interaction_rate,
	          followers: data.brands[0].twitter_follower_count_total,
	          followersDay: data.brands[0].twitter_follower_count_today,
	          followersPerDayAvg: data.brands[0].twitter_follower_count_today, 
	          tweets: data.brands[0].twitter_tweets_count_today, 
	          uploads: data.brands[0].youtube_uploads_count_today,
	          views: data.brands[0].youtube_videos_views_count_total,
	          viewsGrowth: data.brands[0].youtube_videos_views_count_total_growth30,
	          links : { facebook : "", twitter : "", youtube : "" }
	    
	    }

	    return brand
    },

    formatRankingData : function( data ){

        var metric = $('.active').attr('id')

        var sortedBrands = data.brands.sort(function(a,b){
                      return( a[metric][0][1] - b[metric][0][1] )
                  })

        sortedBrands.reverse()

        var rankedBrands = { "data" : sortedBrands }

        return rankedBrands

    },
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
            "end_date" : "",
            "timeseries" : true
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
    "brands" : [ { "category_id" : "74" }],
    "fact_brand_daily" : {
        "metrics": [],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
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

var getUserFavorites = {
    "users" : [
        { "user_email" : "" }
    ]
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
