var brandObject = function(data){

      var dates = [],
          followersTotal = [],
          followersDay = [],
          followersDayAvg30 = [],
          followersGrowthPct30 = [],
          likesDay = [],
          likesDayAvg30 = [],
          likesGrowthPct30 = [],
          likesTotal = [],
          subscribersTotal = [],
          FBEngagement = [],
          tweetsDayAvg30 = [],
          uploadsTotal = [],
          videosViewsGrowthPct30 = [],
          videosViewsTotal = [];

      var fb_data_exists = data[0].fb_data_exists,
          tw_data_exists = data[0].tw_data_exists,
          yt_data_exists = data[0].yt_data_exists,
          funcsToExecute = [];

      var pushFacebook = function(date, value){
            value.likesDay !== null ? likesDay.push([date, value.likesDay]) : null
            value.likesDayAvg30 !== null ? likesDayAvg30.push([ date, value.likesDayAvg30 ]) : null
            value.likesGrowthPct30 !== null ? likesGrowthPct30.push([ date, value.likesGrowthPct30 ]) : null
            value.likesTotal !== null ? likesTotal.push([ date, value.likesTotal ]) : null
            value.subscribersTotal !== null ? subscribersTotal.push([ date, value.subscribersTotal ]) : null
            value.FBEngagement !== null ? FBEngagement.push([ date, value.FBEngagement ]) : null
      }

      var pushTwitter = function(date, value){
            value.followersTotal !== null ? followersTotal.push([date, value.followersTotal ]) : null
            value.followersDay !== null ? followersDay.push([ date, value.followersDay ]) : null 
            value.followersDayAvg30 !== null ? followersDayAvg30.push([ date, value.followersDayAvg30 ]) : null
            value.followersGrowthPct30 !== null ? followersGrowthPct30.push([ date, value.followersGrowthPct30 ]) : null
            value.tweetsDayAvg30 !== null ? tweetsDayAvg30.push([ date, value.tweetsDayAvg30 ]) : null
      }

      var pushYouTube = function(date, value){ 
          value.uploadsTotal !== null ? uploadsTotal.push([ date, value.uploadsTotal ]) : null
          value.videosViewsGrowthPct30 !== null ? videosViewsGrowthPct30.push([ date, value.videosViewsGrowthPct30 ]) : null
          value.videosViewsTotal !== null ? videosViewsTotal.push([ date, value.videosViewsTotal ]) : null
      }

      fb_data_exists ? funcsToExecute.push(pushFacebook) : null
      tw_data_exists ? funcsToExecute.push(pushTwitter) : null
      yt_data_exists ? funcsToExecute.push(pushYouTube) : null

      $.each(data, function(key, value){

          var split = value.coll_date.split('/'),
              month = Number(split[0]) - 1,
              day = Number(split[1]),
              year = Number(split[2]),
              date = Date.UTC(year, month, day);

              dates.push(value.coll_date);

              $.each(funcsToExecute, function(index){
                  funcsToExecute[index](date, value)
              })
      })
        
      var brand = {
            name: data[0].brandName,
            id: null,
            categoryId: data[0].categoryId,
            categoryName: data[0].categoryName,
            dates: dates.reverse(),
            likes: likesTotal.reverse(), 
            likesPerDay: likesDay.reverse(),
            likesPerDayAvg: likesDayAvg30.reverse(),
            likesGrowth: likesGrowthPct30.reverse(),
            subscribers: subscribersTotal.reverse(),
            FBEngagement: FBEngagement.reverse(), 
            followers: followersTotal.reverse(),
            followersDay: followersDay.reverse(),
            followersPerDayAvg: followersDayAvg30.reverse(), 
            followersGrowth: followersGrowthPct30.reverse(), 
            tweets: tweetsDayAvg30.reverse(), 
            uploads: uploadsTotal.reverse(),
            views: videosViewsTotal.reverse(),
            viewsGrowth: videosViewsGrowthPct30.reverse(),
            links : {facebook : data[0].facebookLink, twitter : data[0].twitterLink, youtube : data[0].youtubeLink }
      }

      console.log("brand", brand)
      return brand;

}