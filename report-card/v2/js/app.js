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

require([ "jquery", "jquery-ui", "d3", "handlebars", "helpers/brandObjs", "highcharts/js/highcharts.src",
		  "date", "data/ranking", "data/reportRankings", "data/fullRanking",
		  "charts/engagement", "charts/fullspider", "charts/line",
		  "app/researchReports", "app/spiderChart", "app/engagementChart", "app/timeseries"
		   ], function($, jQuery, d3, bars, brandObjs, highcharts, date, ranking, rranking, fullranking, engagement, radar, line, rr, sc, ec, ts ) {	

	var userEmail = $('#user_email').html()
	window.user = undefined

	var configureUserQuery = function( email ){
	
		getUserFavorites.users[0].user_email = email
	
	}

	var checkUserStatus = function( data ){

		// if user default brand isn't set, send them to the registration page
		if ( data.users.length === 0 || data.users[0].default_brand.brand_id === null ) {
			//render 
			alert("please set your brand")

		// else send them to the line chart
		} else {

			user = data

			TimeseriesView.init()		
			TimeseriesView.bindEvents()
		}
	}

	configureUserQuery( userEmail )
    $.when(TimeseriesView.fetch("GET", "ref", getUserFavorites, this))
        .done( checkUserStatus )


	$('#reports_li').click( function() {

		$('#module_container').empty()

		RRView.renderView()
		RRView.renderReports( reportRankings )
		RREvents.bind()

	})

	$('#report_card_li').click( function() {

		SpiderView.renderView()
		// SpiderView.initBrands()
		SpiderView.renderBrandList()

		SpiderEvents.toggleBrand()
		SpiderEvents.changeCategories()
		SpiderEvents.toggleBenchmarkContainer()
		SpiderEvents.addBrand()

	})

	$('#engagement_chart_li').click( function() {

		EngagementView.renderView()
		EngagementView.renderChart( engagementChart )		

	})

	$('#timeseries_chart_li').click( function() {

		TimeseriesView.init()		
		TimeseriesView.bindEvents()

	})
	

});
