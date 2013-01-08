requirejs.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app',
        helpers: '../helpers'
    }
});

var likeData = undefined

require([ "jquery", "d3", "highcharts/js/highcharts", 
          "app/lineChart", "helpers/brandObjs" ], function($, d3, hc, lc, bo) {	

    var brand = undefined

    function getData( query ){
        // var url = 'http://l2ws-dev.elasticbeanstalk.com/data?format=json&q=' + query

        var url = 'http://l2ws-dev.elasticbeanstalk.com/data?format=json&q=%7b%20%22companies%22:%5b%7b%22company_id%22:%226%22%7d%5d,%20%22metrics%22:%7b%20%22facebook_likes_count_total%22:%22%22,%20%22facebook_likes_count_today%22:%22%22,%20%22start_date%22:%2220111201%22,%20%22end_date%22:%2220111231%22%20%7d%20%7d'

        return $.getJSON( url )

    }

    function showData( data ){        

        var likes = data.companies[0].m_facebook_likes_count_today,
            name = data.companies[0].company_name

        likeData = likes

        console.log( "likes", likeData )

        lineChart = new Highcharts.Chart( chartConfig )

        lineChart.addSeries({
            name: name,
            data: likes,
            lineWidth: 4,
            color: '#3ea549'
        }, true);
    }

    $.when( getData() ).then( showData );

});