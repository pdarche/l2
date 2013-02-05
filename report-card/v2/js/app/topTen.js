
var TopTenView = {

	init : function() {

		var source = $('#top_ten_view').html() 
	    var template = Handlebars.compile( source )
	    $('#module_container').html( template )

	    $.when( TopTenView.fetch("GET", "data", likesTopTen, this))
	    	.done( TopTenView.formatRankingData )
	    	.done( TopTenView.renderLikes )
	    	// .done( function(data){console.log(data)} )


	},

	renderLikes : function( data ) {

	    TopTenView.likes = new Highcharts.Chart( likesConfig )		

	    while (TopTenView.likes.series.length > 0){
            TopTenView.likes.series[0].remove(true)
            // TopTenView.likesPerDay.series[0].remove(true)
            // TopTenView.growth.series[0].remove(true)
      	}

      	console.log(" the returned data is ", data.brands[0] )

	    TopTenView.likes.addSeries({
           stacking: 'normal',
           data: [ 
              data.brands[0].facebook_likes_count_total[0][1], 
              data.brands[1].facebook_likes_count_total[0][1], 
              data.brands[2].facebook_likes_count_total[0][1], 
              data.brands[3].facebook_likes_count_total[0][1], 
              data.brands[4].facebook_likes_count_total[0][1],
              data.brands[5].facebook_likes_count_total[0][1],
              data.brands[6].facebook_likes_count_total[0][1],
              data.brands[7].facebook_likes_count_total[0][1],
              data.brands[8].facebook_likes_count_total[0][1],
              data.brands[9].facebook_likes_count_total[0][1],
           ],
           color: '#2F4984',
           pointWidth: 17
        });

	},

	renderLikesDay : function() {

		var likesDay = new Highcharts.Chart( likesDayConfig )		
	},

	renderGrowth : function() {

		var growth = new Highcharts.Chart( growthConfig )

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

            return $.ajax({
                type: "POST",
                url: "http://l2ds.elasticbeanstalk.com/ref",
                // contentType: 'application/json',
                data: queryString,
                dataType : "json",
                success: function(r) {
                    console.log("favorite saved", r)
                }
            });

		}

    },

	formatRankingData : function( data ){

		var facebook = [ "facebook_likes_count_total", "facebook_likes_count_today" ]

        var metric = $('.active').attr('id')

        var sortedBrands = data.brands.sort(function(a,b){
                      return( a["facebook_likes_count_total"][0][1] - b["facebook_likes_count_total"][0][1] )
                  })

        sortedBrands.reverse()

        var rankedBrands = { "data" : sortedBrands }

        return rankedBrands

    },

}

var likesTopTen = {
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
                "top" : 10
            }
        }
    }
}