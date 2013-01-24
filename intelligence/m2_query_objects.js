//top five facebook likes total/day WORKING
var singleBrandFbLikesTotal = {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_total"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var singleBrandFbLikesToday= {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "facebook_likes_count_today"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var singleBrandFbEngagement = {
    "brands" : [{ "brand_id" : "74"}],
    "fact_fb_post" : {
        "metrics": [
            "facebook_post_like_interaction_rate"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}



var singleBrandTwFollowersTotal= {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_total"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var singleBrandTwFollowersToday= {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_follower_count_today"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var singleBrandTwTweetsToday= {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "twitter_tweets_count_today"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}



var singleBrandYtViewsTotal = {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_videos_views_count_total"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}


var singleBrandYtUploadsToday = {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_uploads_count_today"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}

var singleBrandYtViewsGrowth = {
    "brands" : [{ "brand_id" : "74"}],
    "fact_brand_daily" : {
        "metrics": [
            "youtube_videos_views_count_total_growth30"
        ],
        "constraints" : {
            "start_date" : "20120101", 
            "end_date" : "20130101"
        }
    }
}
