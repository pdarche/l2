// list of test queries

// LINE CHART INITIALIZATION, BRAND ADDITION
// single-brand, multi-metric, one year constraint
// single-brand, multi-metric, one month
// single-brand, multi-metric, three month

// CATEGORY BENCHMARK BRANDS
// multi-brand, multi-metric, top 10 

// TOP 5 BAR CHARTS 
// multi-brand, multi-metric, top 5

// ENGAGEMENT CHART 
// multi-brand, multi-metric, top 5 by facebook engagement 

var oneYearBrandData = {
  "brands" : [ { "brand_id" : "74" } ],
  "metrics": [
    "twitter_follower_count_total",
    "twitter_follower_count_today",
    "twitter_tweets_count_count_today",
    "facebook_likes_count_total",
    "facebook_likes_count_today",
    "facebook_engagement",
    "youtube_video_views_count_total" : "",
    "youtube_uploads_count_total",
    "youtube_video_views_growth_today"    //NOT IN SPEC 
  ],
  "constraints" : {
      "time" : { "start" : 20121212, "end" : 20130101 },
      "twitter_follower_count_total" : {
            "min" : 200,
            "max" : 50000,
            "top" : 10, 
            "agg" : "sum"
      },
      "facebook_likes_count_total" : {
            "min" : 100000,
            "max" : 500000,
            "top" : 10, 
            "agg" : "sum"
      },
      "youtube_video_views_count_total" : {
            "min" : 1000,
            "max" : 5000,
            "top" : 10, 
            "agg" : "sum"
      }
  }

}

var oneYearBrandData = {
  
  companies : [
      { "company_id" : "1" }, // ... through { "company_id" : "n" },
  ],
  metrics : [ "metric_1", "metric_2", "...metric_n" ],
  //optional
  constraints : { 
      time : { "start" : "start_time", "end" : "end_time" },
      metric_1 : { 
        min : "min_value",
        max : "max_value",
        top : "top_n",
        bottom : "bottom_n",
        agg : "min" //max, sum, or avg
      }
      //  ... through metric_n
  }


}


function testEndpoint( queryObject ){

  var baseURL = "http://l2ws-dev.elasticbeanstalk.com/data?format=json&q=",
      querySting = JSON.stringify( queryObject ),
      query = encodeURI( baseURL + queryString )

  $.getJSON( query, function(data){
    
    console.log( data )

  })

}

