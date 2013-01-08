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

require([ "jquery", "d3", "handlebars", 
		  "data/ranking", "data/reportRankings", "charts/radar", 
		  "app/researchReports", "app/spiderChart", "app/engagementChart", 
		   ], function($, d3, bars, ranking, rranking, radar, rr, sc ) {	

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
		SpiderView.renderChart()

		Controls.populateBrands()
		Controls.highlightBrand()
		Controls.initBrands()
		Controls.toggleBrand()

	})

	$('#engagement_chart_li').click( function() {

		EngagementView.renderView()		

	})

});
