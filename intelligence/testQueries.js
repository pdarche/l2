//JSFIDDLE FOR POPUP LOCATED AT: http://jsfiddle.net/hqEhZ/7/
//JSFIDDLE FOR QUERY TESTS LOCATED AT: http://jsfiddle.net/jwMVj/

/******************** TEST QUERIES ********************/
var getUserFavorites = {
  "user" : "peterd@l2thinktank.com"
}

var getAllBrandsForCategory = {
  "brands" : { "category_id" : "2" }
}

var getAllBrands = {
  "categories" : "%"
}
 
var oneMonthSingleBrandSingleMetricTimeConstraint = {
    "brands" : [ { "brand_id" : "74" } ],
    "fact_brand_daily" : {
        "metrics" : [
            "facebook_likes_count_total",
            "youtube_video_views_count_total",
            "youtube_video_views_growth_today"
        ],
        "constraints" : {
            "time" : { "start_date" : "20120912" , "end_date" : "20121012" }
        }
    }
}

var threeMonthMultiBrandFacebookMultiConstraint = {
    "brands" : [], //RETURNED BRANDS FROM CATEGORY QUERY
    "brand_daily" : {
        "metrics" : [
            "facebook_checkins_count_total",
            "facebook_checkins_count_today",
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "facebook_talking_about_count_total",
            "facebook_talking_about_count_today",
            "facebook_likes_per_post_average",
            "facebook_comments_per_post_average,"
            "facebook_shares_per_post_average",
            "facebook_likes_interaction_rate",
            "facebook_comments_interaction_rate",
            "faceook_shares_interaction_rate",
        ],
        "constraints" : {
            "time" : { "start_date" : 20120912, "end_date" : 20121212 },
            "facebook_checkins_count_total" : {
                "min" : 0,
                "max" : 1000,       
            },
            "facebook_checkins_count_today" : {
                "top" : 5,
                "agg" : "max"
            },
            "facebook_likes_count_total" : {
                "min" : 1000,
                "max" : 100000
            },
            "facebook_likes_count_today" : {
                "bottom" : 5,
                "agg" : "min"
            },
            "facebook_talking_about_count_total" : {
                "min" : 0,
                "max" : 10
            },
            "facebook_talking_about_count_today" : {
                "agg" : "avg"
            },
            "facebook_likes_per_post_average" : {
                "top" : 10,
            },
            "facebook_comments_per_post_average" : {
                "bottom" : 5,
                "agg" : "sum"
            },
            "facebook_shares_per_post_average" : {
                "top" : 5,
                "agg" : "sum"
            }, 
            "facebook_likes_interaction_rate" : {
                "top" : 5, 
                "agg" : "sum"
            },
            "facebook_comments_interaction_rate" : {
                "top" : 5,
                "agg" : "sum" 
            },
            "faceook_shares_interaction_rate" : {
                "top" : 5,
                "agg" : "sum" 
            },
        }
    }    
}

var oneYearMultiBrandMultiPlatformMultiConstraint = {
    "brands" : [], //RETURNED LIST OF BRANDS FROM CATEGORY QUERY
    "brand_daily" : {
        "metrics": [
            "facebook_checkings_count_total",
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_count_today",
            "youtube_video_views_count_total",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_today"    
        ],
        "constraints" : {
            "time" : { "start_date" : 20111212, "end_date" : 20121212 },
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
    }
}

var oneYearMultiBrandMultiMetricWithConstraints = {
    "brands" : [],  // BRANDS RETURNED FROM REF REQUEST
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start_date" : 20111212, "end_date" : 20121212 },
            "likes_per_post_average" : {
                "min" : 0.2,
                "max" : 5
            },
        }
    }
}


// INTELLIGENCE PAGE
// line chart
var oneYearSingleBrandMultiMetric = {
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
            "time" : { "start_date" : 20111212, "end_date" : 20121212 }
        }
    },
}

var oneYearSingleBrandEngagementData = {
    "brands" : [ { "brand_id" : "74" } ],
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start_date" : 20111212, "end_date" : 20121212 }
        }
    }
}

// for category benchmarks
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
            "youtube_video_views_growth_30"
        ],
        "constraints" : {
            "time" : { "start_date" : 20111212, "end_date" : 20121212 },            
            "facebook_likes_count_total" : {
                "top" : 8,
                "agg" : "max" // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
            },
            "facebook_likes_count_today" : {
                "top" : 8,
                "agg" : "avg" // CREATE TOP 8 ON LIST OF AVERAGE LIKES/DAY
            },
            "twitter_follower_count_total" : {
                "top" : 8,
                "agg" : "max" // NOT AN AGGRIGATED VALUE? HOW SHOULD THESE BE HANDLED?
            },
            "twitter_follower_count_today" : {
                "top" : 8,
                "agg" : "avg" // CREATE TOP 8 ON LIST OF AVERAGE LIKES/DAY
            },
            "twitter_tweets_count_count_today" : {
                "top" : 8, 
                "agg" : "avg" // CREATE TOP 8 ON LIST OF AVERAGE LIKES/DAY
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
                "top" : 8,  // AGG ON LATEST VALUE?  HOW SHOULD THESE BE HANDLED?
            },
        }
    },
}

var oneYearTopEightBrandsByCategory = {
    "brands" : [], // RETURNED BRAND IDS FROM getAllBrandsForCategory
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start_date" : 20111212, "end_date" : 20121212 },
            "likes_per_post_average" : {
                "top" : 8 
            }
        }
    }
}


// top five bar chart
var topFiveBarCharts = {
    "brands" : [ RETURNED BRAND IDS FROM getAllBrandsForCategory ],
    "brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "facebook_likes_count_growth_30",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_follower_count_growth_30",
            "youtube_video_views_count_total" : "",
            "youtube_uploads_count_total",
            "youtube_video_views_growth_30"            
        ],
        "constraints" : {
            "time" : { "start_date" : 20121201, "end_date" : 20130101 },
            "facebook_likes_count_total" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                // "agg" : "max"
            },
            "facebook_likes_count_today" : {
                "top" : 5, 
                "agg" : "avg"   
            },
            "facebook_likes_count_growth_30" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                // "agg" : "max"           
            },
            "twitter_follower_count_total" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                "agg" : "max"           
            },
            "twitter_follower_count_today" : {
                "top" : 5, 
                // "agg" : "avg"
            },
            "twitter_follower_count_growth_30" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                // "agg" : "max"
            },
            "youtube_video_views_count_total" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                // "agg" : "max"           
            },
            "youtube_uploads_count_total" : {
                "top" : 5, 
                "agg" : "max"           // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
            },
            "youtube_video_views_growth_30" : {
                "top" : 5,              // NOT AN AGGRIGATED VALUE?  HOW SHOULD THESE BE HANDLED?
                // "agg" : "sum"           
            },
        }
    }
},

// top five engaegment
var oneMonthtopFiveEngagement = {
    "brands" : [ "returned_brands", "brand_id" ],
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start_date" : 20121201, "end_date" : 20130101 },
            "likes_per_post_average" : {
                "top" : 5, 
                "agg" : "max"
            }
        }
    }
}

var topFiveEngagement = {
    "brands" : [ "returned_brands", "brand_id" ],
    "brand_daily" : {
        "metrics" : [ 
            "facebook_likes_count_total",
            "facebook_likes_growth_30days" 
        ],
        "constraints" : {
            "time" : { "start_date" : 20121212 , "end_date" : 20130101 },
            "facebook_likes_count_total" : {
                "top" : 5,
                "agg" : "max"
            }
        }
    }
}

var singleBrandEngagement = {
    "brands" : [ "brand_id" ],
    "fb_posts" : {
        "metrics" : [ "likes_per_post_average" ],
        "constraints" : {
            "time" : { "start_date" : 20121212, "end_date" : 20130101 },
            "likes_per_post_average" : {
                "top" : 5, 
                "agg" : "max"
            }
        }
    }
}

var singleBrandEngagement = {
    "brands" : [ "brand_id" ],
    "brand_daily" : {
        "metrics" : [
            "facebook_likes_count_total",
            "facebook_likes_growth_30days" 
        ],
        "constraints" : {
            "time" : { "start_date" : 20121212 , "end_date" : 20130101 },
            "facebook_likes_count_total" : {
                "top" : 5,
                "agg" : "max"
            }
        }
    }
}


/******************** DATA RETRIEVAL FUNCTION ********************/
function getData( db, queryObject, callback ){

  //build query

  var baseURL = "http://l2ds.elasticbeanstalk.com/",
      db = db + "?format=json&q=",
      queryString = JSON.stringify( queryObject ),
      query = encodeURI( baseURL + db + queryString )
  
  //make request
  $.getJSON( query, function( data, callback ){
    
        callback( data )

  })

}

/******************** TEST CALLBACKS ********************/
var createCategoryBrandList = function ( data ){  
  $.each(data.brands, function(i){
    console.log(data.brands[i])
  })
}

var logData = function( data ){
  console.log( "returned data is: ", data )
}


