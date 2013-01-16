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


/******************** TEST QUERIES ********************/

var oneYearMultiBrandMultiMetricWithConstraints = {
    "brands" : [ 
        { "brand_id" : "74" }, 
        { "brand_id" : "82" }, 
        { "brand_id" : "321" } 
    ],
    "brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_count_today",
            "youtube_video_views_count_total",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_today"       //NOT IN SPEC 
        ],
        "constraints" : {
            "time" : { "start" : 20121212, "end" : 20130101 },
            "facebook_likes_count_total" : {
                "min" : 100,
                "max" : 50000, 
                "agg" : "sum"
            },
            "facebook_likes_count_today" : {
                "min" : 50,
                "max" : 5000,
                "top" : 10,
                "agg" : "sum"
            },
            "twitter_follower_count_total" : {
                "min" : 1000,
                "max" : 5000,
                "top" : 10, 
                "agg" : "sum"
            },
            "twitter_follower_count_today" : {
                "min" : 1000,
                "max" : 5000,
                "top" : 10, 
                "agg" : "sum"
            },
            "twitter_tweets_count_count_today" : {
                "min" : 10,
                "max" : 50,
                "top" : 10, 
                "agg" : "sum"
            },
            "youtube_video_views_count_total" : {
                "min" : 1000,
                "max" : 50000,
                "top" : 10, 
                "agg" : "sum"
            },
            "youtube_uploads_count_total" : {
                "min" : 1000,
                "max" : 50000,
                "top" : 10, 
                "agg" : "sum"
            },
            "youtube_video_views_growth_30" : {
                "min" : 1000,
                "max" : 50000,
                "top" : 10, 
                "agg" : "sum"
            },
        }
    },
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start" : 20111212, "end" : 20121212 },
            "likes_per_post_average" : {
                "min" : 0.2,
                "max" : 5
            },
        }
    }
},



/******************** INTELLIGENCE PAGE ********************/

var getUserFavorites = {
  "user" : "peterd@l2thinktank.com"
}

var getAllBrandsForCategory = {
  "cagegories" : "category"
}

var getAllBrands = {
  "categories" : "%"
}

// LINE CHART 
var oneYearSingleBrandData = {
    "brands" : [ { "brand_id" : "74" } ],
    "brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_count_today",
            "youtube_video_views_count_total" : "",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_30"        //NOT IN SPEC 
        ],
        "constraints" : {
            "time" : { "start" : 20111212, "end" : 20121212 },
            "facebook_likes_count_total" : {

            },
            "facebook_likes_count_today" : {

            },            
            "twitter_follower_count_total" : {
            
            },
            "twitter_follower_count_today" : {

            },
            "twitter_tweets_count_count_today" : {

            },
            "youtube_video_views_count_total" : {

            },
            "youtube_uploads_count_total" : {

            },
            "youtube_video_views_growth_30" : {

            }
        }
    },
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start" : 20111212, "end" : 20121212 },
            "likes_per_post_average" : {},
        }
    }
}

var oneYearTopEightBrandsByCategory = {
    "brands" : [ RETURNED BRAND IDS FROM getAllBrandsForCategory ],
    "brand_daily" : {
        "metrics": [
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_count_today",
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "youtube_video_views_count_total" : "",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_30"        //NOT IN SPEC 
        ],
        "constraints" : {
            "time" : { "start" : 20111212, "end" : 20121212 },            
            "facebook_likes_count_total" : {
                "top" : 8,
                "agg" : "max" // AGG ON LATEST VALUE
            },
            "facebook_likes_count_today" : {
                "top" : 8,
                "agg" : "avg" // 
            },
            "twitter_follower_count_total" : {
                "top" : 8,
                "agg" : "max"
            },
            "twitter_follower_count_today" : {
                "top" : 8,
                "agg" : "avg"
            },
            "twitter_tweets_count_count_today" : {
                "top" : 8, 
                "agg" : "sum"
            },
            "youtube_video_views_count_total" : {
                "top" : 8,
                "agg" : "sum"  //AGG ON LATEST VALUE
            },
            "youtube_uploads_count_total" : {
                "top" : 8,
                "agg" : "sum"  //AGG ON LATEST VALUE
            },
            "youtube_video_views_growth_30" : {
                "top" : 8,
                "agg" : "sum"  //AGG ON LATEST VALUE
            },
        }
    },
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start" : 20111212, "end" : 20121212 },
            "likes_per_post_average" : {},
        }
    }
}


// TOP FIVE BAR CHARTS
var topFiveBarCharts = {
    "brands" : [ RETURNED BRAND IDS FROM getAllBrandsForCategory ],
    "brand_daily" : {
        "metrics": [
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_follower_count_growth_30",       // AVERAGE LIKES PER DAY OVER A 30 DAY PERIOD 
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "facebook_likes_count_growth_30",         // NOT IN SPEC
            "youtube_video_views_count_total" : "",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_30"           // NOT IN SPEC 
        ],
        "constraints" : {
            "time" : { "start" : 20121212, "end" : 20130101 },
            "twitter_follower_count_total" : {
                "top" : 5, 
                "agg" : "max"
            },
            "twitter_follower_count_today" : {
                "top" : 5, 
                "agg" : "avg"
            },
            "twitter_follower_count_growth_30" : {
                "top" : 5, 
                "agg" : "sum"
            },
            "facebook_likes_count_total" : {
                "top" : 5, 
                "agg" : "sum"
            },
            "facebook_likes_count_today" : {
                "top" : 5, 
                "agg" : "sum"
            },
            "facebook_likes_count_growth_30" : {
                "top" : 5, 
                "agg" : "sum"
            },
            "youtube_video_views_count_total" : {
                "top" : 5, 
                "agg" : "max"
            },
            "youtube_uploads_count_total" : {
                "top" : 5, 
                "agg" : "max"
            },
            "youtube_video_views_growth_30" : {
                "top" : 5, 
                "agg" : "sum"
            },
        }
    }
},


var topFiveEngagement = {
    "brands" : [ RETURNED BRAND IDS FROM getAllBrandsForCategory, "brand_id" ],
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start" : 20121212, "end" : 20130101 },
            "likes_per_post_average" : {
                "top" : 5, 
                "agg" : "max"
            }
        }
    },
    //does this need to be broken out into a separate query?
    "brand_daily" : {
        "metrics" : [ 
            "facebook_likes_count_total",
            "facebook_likes_growth_30days" 
        ],
        "constraints" : {
            "time" : { "start" : 20121212 , "end" : 20130101 },
            "facebook_likes_count_total" : {
                "top" : 5,
                "agg" : "max"
            }

        }}
    }
}

var singleBrandEngagement = {
    "brands" : [ "brand_id" ],
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start" : 20121212, "end" : 20130101 },
            "likes_per_post_average" : {
                "top" : 5, 
                "agg" : "max"
            }
        }
    },
    //does this need to be broken out into a separate query?
    "brand_daily" : {
        "metrics" : [ 
            "facebook_likes_count_total",
            "facebook_likes_growth_30days" 
        ],
        "constraints" : {
            "time" : { "start" : 20121212 , "end" : 20130101 },
            "facebook_likes_count_total" : {
                "top" : 5,
                "agg" : "max"
            }

        }}
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



