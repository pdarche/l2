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

	$('.series').eq(1).show()

	RRView.renderView()
	RRView.renderReports( reportRankings )
	RREvents.bind()

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
