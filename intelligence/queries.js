//top five facebook likes total WORKING
var topFiveBarFbLikesTotal = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "facebook_likes_count_total" : {
                "top" : 5            
            }
        }
    }
}

//to five facebook likes/day WORKING
var topFiveBarFbLikesToday = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_today"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "facebook_likes_count_today" : {
                "top" : 5            
            }
        }
    }
}

//to five facebook likes growth WORKING
var topFiveBarFbLikesTodayGrowth = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "facebook_likes_count_total_growth30" : {
                "top" : 5            
            }
        }
    }
}

//to five twitter followers count total WORKING
var topFiveBarTwFollowersTotal = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_total"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "twitter_follower_count_total" : {
                "top" : 5            
            }
        }
    }
}

//to five twitter followers count today WORKING
var topFiveBarTwFollowersToday = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_today"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "twitter_follower_count_today" : {
                "top" : 5            
            }
        }
    }
}

var topFiveBarTwFollowersTotalGrowth = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "twitter_follower_count_total_growth30" : {
                "top" : 5            
            }
        }
    }
}


//to five youtube views WORKING
var topFiveBarYtViewsTotal = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_channel_views_count_total"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "youtube_channel_views_count_total" : {
                "top" : 5            
            }
        }
    }
}

//to five youtube views WORKING
var topFiveBarYtViewsToday = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_channel_views_count_today"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "youtube_channel_views_count_today" : {
                "top" : 5            
            }
        }
    }
}

//to five youtube views growth WORKING
var topFiveBarYtViewsTotalGrowth = {
    "brands" : [{ "category_id" : "2"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_channel_views_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "20121201", 
            "end_date" : "20130101",
            "aggregation" : [ "entity" ],
            "youtube_channel_views_count_total_growth30" : {
                "top" : 5            
            }
        }
    }
}


