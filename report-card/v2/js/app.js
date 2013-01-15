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

require([ "jquery", "d3", "handlebars", "helpers/brandObjs",
		  "data/ranking", "data/reportRankings", "data/fullRanking",
		  "charts/engagement", "charts/fullspider", 
		  "app/researchReports", "app/spiderChart", "app/engagementChart", 
		   ], function($, d3, bars, brandObjs, ranking, rranking, fullranking, engagement, radar, rr, sc, ec ) {	

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

});
