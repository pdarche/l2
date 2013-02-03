TimeseriesView = {

    clickedBenchmarks : [],

    brandList : [],

	init : function() {

        // render the module view
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
        $.when( TimeseriesView.renderFavoriteBrands( user.users[0].favorite_brands) )
            .done( TimeseriesView.synchFavorites )
            
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

        $('#category_benchmark_results, #favorite_benchmarks_results, #search_benchmarks_results').delegate('.brand-check', 'click', function(){
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

        $('#category_benchmark_results, #favorite_benchmarks_results, #search_benchmarks_results').delegate('.favorite-icon', 'click', function(){

            var updateUserObject = function( data ){
                user.users[0].favorite_brands.push( data.brands[0] )
            }

            if ( $(this).hasClass('favorite') ){
                //remove 'favorite' class
                $(this).removeClass('favorite')

                //get the brand id
                var brandId = $(this).next().attr('class').split(" ")[1]

                //make array of current favorites
                var favorites_ids = []
                $.each(user.users[0].favorite_brands, function(i){
                    favorites_ids.push(user.users[0].favorite_brands[i].brand_id)
                })

                // find the index of the to-remove brand
                var index = $.inArray( brandId, favorites_ids )

                //remove it from the query object
                user.users[0].favorite_brands.remove(index)

                $.when( TimeseriesView.fetch( "POST", "ref", user, this) )
                    .done( TimeseriesView.renderFavoriteBrands )
                    .done( TimeseriesView.synchFavorites )

            } else {
                //add 'favorite' class
                $(this).addClass('favorite')
                
                var brandId = $(this).next().attr('class').split(" ")[1]

                //configure the query object
                getBrand.brands[0].brand_id = brandId

                $.when( TimeseriesView.fetch("GET", "ref", getBrand, this))
                    .done( updateUserObject )
                    .done( TimeseriesView.fetch( "POST", "ref", user, this) )
                    .done( TimeseriesView.renderFavoriteBrands )
                    .done( TimeseriesView.synchFavorites )

            }
        })

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
            console.log("trying to post")

            // return $.post( query, function(data){
            //     console.log(data)
            // }, 'json')
            return "done"
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
            .done( TimeseriesView.synchChecks )

    },

    addSearchBrand : function( brandId ){

        var checkBrand = function(){
            
            var brandSelector = '.' + brandId
            $(brandSelector).attr('checked', true)

        }

        TimeseriesView.configureBrandQuery( brandId )
        $.when( TimeseriesView.fetch("GET", "data", brandData, this) )          
            .done( TimeseriesView.addSeries )
            .done( TimeseriesView.renderSearchBrand )
            .done( checkBrand )
            .done( TimeseriesView.synchFavorites )
            .done( TimeseriesView.synchChecks )

    },

    removeBrand : function( brandId ) {

        var brandIndex = undefined

        $.each(TimeseriesView.clickedBenchmarks, function(i,v){
            v.brands[0].brand_id === brandId ? brandIndex = i : null
        })

        //remove brand index from series 
        TimeseriesView.lineChart.series[brandIndex].remove();
        //remove brand index from clickedBenchmarks
        $.when( TimeseriesView.clickedBenchmarks.remove( brandIndex ) )            
            .done( TimeseriesView.synchChecks )

    },

    categoryTopEight : function( categoryId, metric ){

    	TimeseriesView.configureCategoryBenchmarkObject( categoryId, metric )

    	$('#category_benchmark_results').empty()

        $.when(TimeseriesView.fetch("GET", "data", categoryBenchmarksQueryObject, this))
            .done( TimeseriesView.formatRankingData )
            .done( TimeseriesView.renderCategoryBenchmarks )
            .done( TimeseriesView.synchFavorites )
            .done( TimeseriesView.synchChecks )

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

    synchFavorites : function() {
        console.log("synching favorites")

        var favorites = $('.favorite')
        $.each( favorites, function(i){
            //get brand id and make sure it has the favorite class
            var selector = '.' + $(this).next().attr('class').split(" ")[1]
            $(selector).prev().addClass('favorite')

            if ( $(selector).prev().attr('src') === 'images/emptyStar.png' ){
                $(selector).prev().attr('src', 'images/clickedStar.png')
            }
        })

        var non_favorites = $('.favorite-icon').not('.favorite')
        $.each( non_favorites, function(i){
            if ( $(this).attr('src') === 'images/clickedStar.png' ){
                $(this).attr('src', 'images/emptyStar.png')
            }
        })

    },

    synchChecks : function() {
        console.log("synching checks")

        var checked = $('inupt:checked')
        $.each( TimeseriesView.clickedBenchmarks, function(i){
            var selector = '.' + this.brands[0].brand_id
            $(selector).attr('checked', true)
        })

        var displayedIds = []
        $.each( TimeseriesView.clickedBenchmarks, function(i){
            displayedIds.push( this.brands[0].brand_id )
        })

        $.each( $('input[type=checkbox]'), function(i){
            var id = $(this).attr('class').split(" ")[1]
            $.inArray(id, displayedIds) === -1 ? $(this).attr('checked', false) : null
        })

    },

    bindAutocomplete : function(data){

    	var brandList = []
        
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
        
        TimeseriesView.brandList = brandList

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

var getBrand = { "brands" : [ { "brand_id" : ""} ] }

var getUserFavorites = {
    "users" : [
        { "user_email" : "" }
    ]
}

var testUser = {"users":[{"favorite_companies":[],"default_brandfamily":[],"default_brand":[{"geography_name":"Global","geography_id":"3","brandfamily_id":"376","category_name":"Retail","brandfamily_name":"Abercrombie & Fitch","is_active":true,"brand_id":"6155","category_id":"12","extra_modifier":""}],"default_company":[],"favorite_brands":[{"geography_name":"Global","geography_id":"3","brandfamily_id":"376","category_name":"Retail","brandfamily_name":"Abercrombie & Fitch","is_active":true,"brand_id":"6155","category_id":"12","extra_modifier":""}],"default_brandfamily_id":null,"user_id":"u1","default_company_id":null,"favorite_brandfamilies":[],"default_brand_id":"6155","user_email":"jack@l2thinktank.com"}]}


Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
