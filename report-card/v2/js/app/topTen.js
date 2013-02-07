
var TopTenView = {

  metrics : { 
        "facebook" : [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "facebook_likes_count_total_growth30"
        ],
        "twitter" : [
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_follower_count_total_growth30"
        ],
        "youtube" : [
            "youtube_channel_views_count_total",
            "youtube_channel_views_count_today",
            "youtube_channel_views_count_total_growth30"
        ]
  },

	init : function() {

  		var source = $('#top_ten_view').html() 
      var template = Handlebars.compile( source )
      $('#module_container').html( template )

  	  TopTenView.renderCharts()

      TopTenView.populateCharts( "3" )

      TopTenView.bindEvents()

	},

  bindEvents : function() {

      $('#category_benchmark_drop').on('change', function(){
          var categoryId = $(this).val()

          TopTenView.populateCharts( categoryId )

      })

      $('.top-ten-metric').click( function(){
          $('.active').removeClass('active')

          $(this).addClass('active')

          var categoryId = $('#category_benchmark_drop').val()

          TopTenView.populateCharts( categoryId )

      })

  },

	renderCharts : function() {

		TopTenView.likes = new Highcharts.Chart( likesConfig )
		TopTenView.likesDay = new Highcharts.Chart( likesPerDayConfig )
		TopTenView.growth = new Highcharts.Chart( growthConfig )

	},

	clearSeries : function() {

		while ( TopTenView.likes.series.length > 0 ){

        TopTenView.likes.series[0].remove(true)
        TopTenView.likesPerDay.series[0].remove(true)
        TopTenView.growth.series[0].remove(true)

    }

	},

  populateCharts : function( categoryId ){

      var platform = $('.active').attr('class').split(" ")[0]

      $.when( TopTenView.configQuery( categoryId, TopTenView.metrics[platform][0] ) )
        .done(
          function( data, textStatus, jqXHR ) { 
              $.when ( TopTenView.fetch("GET", "data", data, this) )
                .done( function( data, textStatus, jqXHR ){
                  TopTenView.formatRankingData( data, "facebook_likes_count_total" ) 
                })
                .done( function( data, textStatus, jqXHR ) {            
                  TopTenView.renderLikes( data, TopTenView.likes, TopTenView.metrics[platform][0] )
                })
              }
        )

      $.when( TopTenView.configQuery( categoryId, TopTenView.metrics[platform][1] ) )
        .done(
            function(data, textStatus, jqXHR) {
              $.when ( TopTenView.fetch("GET", "data", data, this) )
                .done( function( data, textStatus, jqXHR ){
                  TopTenView.formatRankingData( data, "facebook_likes_count_today" ) 
                })
                .done( function( data, textStatus, jqXHR ) {            
                  TopTenView.renderLikes( data, TopTenView.likesDay, TopTenView.metrics[platform][1] )
                })
            }
        )

      $.when( TopTenView.configQuery( categoryId, TopTenView.metrics[platform][2] ) )
        .done(
            function(data, textStatus, jqXHR) {
              $.when ( TopTenView.fetch("GET", "data", data, this) )
                .done( function( data, textStatus, jqXHR ){
                  TopTenView.formatRankingData( data, "facebook_likes_count_total_growth30" ) 
                })
                .done( function( data, textStatus, jqXHR ) {            
                  TopTenView.renderLikes( data, TopTenView.growth, TopTenView.metrics[platform][2] )
                })
            }
        )
  },

	renderLikes : function( data, chart, metric ) {    

    console.log( "this is the chart: ", chart )

    var brandData = [],
        brandNames = []

    $.each( data.brands, function(i) {
      brandData.push( data.brands[i][metric][0][1] )
      brandNames.push( data.brands[i].brandfamily_name + ' - ' + data.brands[i].geography_name )
      // console.log(data.brands[i].brandfamily_name)
    })

	    chart.addSeries({
           stacking: 'normal',
           data: brandData,
           color: '#2F4984',
           pointWidth: 17
        });

      // chart.xAxis[0].setCategories( brandNames )

      chart.redraw(true)

	},

	fetch : function( method, db, queryObject, postData ){

		//build query
		var baseURL = "http://l2ds.elasticbeanstalk.com/",
			db = db + "?format=json&q=",
			queryString = JSON.stringify( queryObject ),
			query = encodeURI( baseURL + db + queryString )

		//make request
		return $.getJSON( query )

  },

	formatRankingData : function( data, metric ){

        // var metric = $('.active').attr('id')

        var sortedBrands = data.brands.sort(function(a,b){
                      return( a[metric][0][1] - b[metric][0][1] )
                  })

        sortedBrands.reverse()

        return sortedBrands

    },

    configQuery : function ( categoryId, metric ) {

        var clone = $.extend( true, {}, topTenQueryObject )

        clone.brands[0].category_id = categoryId
        clone.fact_brand_daily["metrics"][0] = metric
        clone["fact_brand_daily"]["constraints"][metric] = { "top" : 10 }

        return clone
    },

}

var topTenQueryObject = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "",
        ],
        "constraints" : {
            "start_date" : (3).days().ago().toString("yyyyMMdd"), 
            "end_date" : (2).days().ago().toString("yyyyMMdd"),
            "timeseries" : false
        }
    }
}




