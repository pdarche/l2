requirejs.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app',
        helpers: '../helpers',
        charts: '../charts',
        data: '../data',
    }
});

var likeData = undefined

require([ "jquery", "jquery-ui", "d3", "handlebars", "helpers/brandObjs", "highcharts-2.3.5/js/highcharts.src",
		  "date", "data/ranking", "data/reportRankings", "data/fullRanking",
		  "charts/engagement", "charts/fullspider", "charts/line", "charts/topten",
		  "app/researchReports", "app/spiderChart", "app/engagementChart", "app/timeseries", "app/topTen", "app/setDefault"
 		   ], function($, jQuery, d3, bars, brandObjs, highcharts, date, ranking, rranking, fullranking, engagement, radar, line, topten, rr, sc, ec, ts, tt, sd ) {	

	var userEmail = $('#user_email').html()
	window.user = undefined
	window.brandList = []

	var configureUserQuery = function( email ){
	
		getUserFavorites.users[0].user_email = email
	
	}

	var checkUserStatus = function( data ){

		// if user default brand isn't set, send them to the registration page
		if ( data.users.length === 0 || data.users[0].default_brand.brand_id === null ) {
			//render 
			SetDefaultView.init()

		// else send them to the line chart
		} else {

			user = data

			$('#member_brand h1').html( user.users[0])
			TimeseriesView.init()		
			TimeseriesView.bindEvents()

			getBrand.brands[0].brand_id = user.users[0].default_brand_id
			
			$.when( fetch( "GET", "ref", getBrand, this ) )
			.done( 
				function( data ){
					user.users[0]["default_category_id"] = data.brands[0].category_id
				}
			)
		}
	}

	configureUserQuery( userEmail )
    $.when( TimeseriesView.fetch("GET", "ref", getUserFavorites, this))
        .done( checkUserStatus )


	// $('#reports_li').click( function() {

	// 	$('#module_container').empty()

	// 	RRView.renderView()
	// 	RRView.renderReports( reportRankings )
	// 	RREvents.bind()

	// })

	// $('#report_card_li').click( function() {

	// 	SpiderView.renderView()
	// 	// SpiderView.initBrands()
	// 	SpiderView.renderBrandList()

	// 	SpiderEvents.toggleBrand()
	// 	SpiderEvents.changeCategories()
	// 	SpiderEvents.toggleBenchmarkContainer()
	// 	SpiderEvents.addBrand()

	// })

	$('#engagement_chart_li').click( function() {

		EngagementView.init()	

	})

	$('#timeseries_chart_li').click( function() {

		TimeseriesView.init()		

	})

	$('#top_ten_li').click( function() {

		TopTenView.init()

	})

	var fetch = function( method, db, queryObject, postData ){

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
    }
	

});
