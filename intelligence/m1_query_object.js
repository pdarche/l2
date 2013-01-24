var modOne = {
    "brands" : [{ "brand_id" : "74" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
            "facebook_likes_count_today",
            "twitter_follower_count_total",
            "twitter_follower_count_today",
            "twitter_tweets_count_today",
            "youtube_videos_views_count_total",
            "youtube_uploads_count_today",
            "youtube_videos_views_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var fbLikesTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var fbLikesDayTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_today",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var fbEngagementTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_fbposts" : {
        "metrics": [
            "facebook_likes_interaction",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var twFollowerTotalTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_total",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var twFollowerTodayTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_today",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var twTweetsTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_tweets_count_today",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var ytViewsTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_videos_views_count_total",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var ytUploadsTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_uploads_count_today",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

var ytViewsGrowthTopEight = {
    "brands" : [ { "category_id" : "" }],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_videos_views_count_total_growth30",
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101",
            "top" : 8
        }
    }
}

