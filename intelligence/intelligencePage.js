var clickedBenchmarks = []

$(document).ready(function(){

   //globals.
    var rankNames,
       ranking,
       engagementInformation,
       currentEngagementData,
       communitySizes = [ [20000, 100000], [ 100001, 500000], [500001, 1000000], [1000001, 100000000] ],
       colors = [ "#C5DE97", "#88C9BF", "#D1D2D4", "#90C086", "#F9AF88", "#B2DBB6", "#8775B1", "#F3879E", "#DED6B3", "#ECDC66", "#8DB9C0" ],
       favorites = [],
       searchedLinks = [],
       searchedBrands = [],
       engagementResetBrands = [],
       removedBrands = [],
       hiddenBrands = [], 
       counter = 0,
       m1CategoryId = $('#m1_category_benchmark_drop').val();

//***********************************************************************************************************//
//*********************************************** ON DOCUMENT READY *****************************************//
//***********************************************************************************************************//

  var wpid = $('#u').val(),
      brandName = $('#brand_name').html()
      brandName = brandName.split(" <")
      brandName = brandName[0]
      var ampTest = /&amp;/g
      
      var amp = ampTest.test(brandName)

      amp ? brandName = brandName.replace(/&amp;/g, '%26') : brandName = encodeURIComponent(brandName),

      brandName.replace(/&amp;/g, '%26')

  //initial call to get brands' scraper id
  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrandIdFromName?u=' + wpid + '&brandName=' + brandName + '&callback=?', function(data){

    //create module one chart
    createM1Chart()

    //populate module one chart with data
    populateM1Chart(data.brandId, data.categoryId)

    //create module two charts
    createM2Charts()
    
    //populate module two charts with data 
    populateM2Chart(data.categoryId)
    
    //populate salesforce data
    populateSalesForceData()

    //execute autocomplete functions
    listBrandsAutoComplete()

    gseListBrandsAutoComplete()

    getCategoryBrandList()


})


/****************************************************************/
/******************** MODULE ONE FUNCTIONS **********************/
/****************************************************************/

function createM1Chart(){

   lineChart = new Highcharts.Chart({
         chart: {
            renderTo: 'primary_chart',
            zoomType: 'x',
            type: 'line'
         },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Drag your finger over the plot to zoom in'
        },
         legend: {
            layout: 'horizontal',
              borderRadius:0,
              borderWidth:0,
              symbolWidth: 15
         }, 
         tooltip: {
            pointFormat: '<span style="color:{series.color}; font-weight:bold">{series.name}</span>: <b>{point.y}</b><br/>',
            crosshairs: {
              width: 1,
              color: 'gray',
              dashStyle: 'shortdot'
            },
            shared: true
         },
         credits:{
            enabled: false
         },
         title: {
            text: 'Likes'
         },
         xAxis: {
              // categories: last30days,
              type: 'datetime',
              dateTimeLabelFormats: { 
                  month: '%b %e',
                  year: '%b'
              },
              labels: {
                  // rotation: -90,
                  // align: 'right'
               },
         },
         yAxis: {
            title: {
               text: ''
            }
         },
         exporting : {
          enabled : true,
        },
         plotOptions: {
            series: {
                marker: {
                    states: {
                      hover: {
                        enabled: true
                      },
                    },
                    enabled: false
                },
                shadow: false
          },
          line: {
              events: {
                legendItemClick: function () {
                toggleHiddenSeries(this.name)                  
                  if(clickedBenchmarks.length > 1){

                    removeChartSeries(this.name)
                    // toggleLegendSeries(this.name)
                  } 
                  return false; // <== returning false will cancel the default action
              }
            }
          }
      }
     });
 
    if ( BrowserDetect.browser === 'Chrome' || BrowserDetect.browser === 'Safari'){
      console.log("browser is", BrowserDetect.browser )
      d3.select('.highcharts-subtitle').attr('dx', 200).attr('dy', -15);
    } else {
      console.log( "browser", BrowserDetect.browser )
      console.log("not chrome")
      d3.select('.highcharts-subtitle').attr('dx', 400).attr('dy', -15);
    }
 }


function populateM1Chart(brandId, category){
  
  //get member brand's data from ws
  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrandDataHistoryNumeric?u=' + wpid + '&days=365&brandid=' + brandId + '&callback=?', function(data){
      
      //set m1 category drop down to member category
      changeM1CategoryDrop(); 

      //create brand data object
      var brand = create30DayBrandDataObject(data);

      //set id in brand object to brand id
      brand.id = brandId;

      //push brand data object to clicked benchmarks array
      clickedBenchmarks.push(brand)

      //pass clickedBenchmarks into toggleServices 
      toggleService('m1', 'facebook', clickedBenchmarks); 

      //populate favorites
      populateFavorites();

      //populate m1 category benchmarks
      populateM1CatgoryBenchmarks(category);

      //create engagement chart 
      createEngagementChart(category, brandId);

      //set member links
      setMemberLinks(brand);

      //if user changes metric...
      $('.metric').click(function(){
        var platform = getClass($(this).parent().parent().attr('class'), 1),
            dataType = String($(this).html()).toLowerCase(),
            classes = $(this).attr("class"),
            module = getClass(classes, 2);

         $('#no_data').remove()
         $('#engagement-note').remove()
         $('.active').removeClass('active');
         $(this).addClass("active");

        //manage engagement, lancome notes
        manageChartNotes(dataType);

        //change links to reflect new service
        changeLinks();

        //change data to clicked metric 
        toggleDataType(module, dataType, platform, clickedBenchmarks);

        //create new category benchmarks
        changeMetricBenchmarks(rankNames, 'm1')

        //add favorite stars to any favorited brands
        fixFavoriteStarsAddition();

      })
   });
}


function populateM1CatgoryBenchmarks(categoryNumber){
  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getCategoryDataTop10?u=' + wpid + '&categoryId=' + categoryNumber + '&callback=?', function(data){

      //create ranking object 
      var ranks = createCategoryTop10DataObject(data);

      //set rankingNames variable for later use   
      rankNames = ranks;

      //populate category bencmarks
      changeMetricBenchmarks(ranks, 'm1');
  
  });

}


function changeM1CategoryDrop(){  

  $('#m1_category_benchmark_drop').change(function(){

    var opt = $(this).val();

    $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getCategoryDataTop10?u=' + wpid + '&categoryId='+ opt +'&callback=?', function(data){

      var newestBenchmarks = createCategoryTop10DataObject(data);

      changeMetricBenchmarks(newestBenchmarks, 'm1');

      //************ set drop down default to selected category 
      var textToFind = newestBenchmarks.categoryName;

      var dd = document.getElementById('m1_category_benchmark_drop');
      for (var i = 0; i < dd.options.length; i++) {
          if (dd.options[i].text === textToFind) {
              dd.selectedIndex = i;
              break;
          }
      }

      m1CategoryId = $('#m1_category_benchmark_drop').val();

    })
  })
}


function setMemberLinks(brand){
    var fbLink = 'http://www.facebook.com/' + brand.links.facebook,
        twLink = 'http://www.twitter.com/' + brand.links.twitter,
        ytLink = 'http://www.youtube.com/' + brand.links.youtube;

      $('#member_fb').attr('href', fbLink )
      $('#member_tw').attr('href', twLink )
      $('#member_yt').attr('href', ytLink )
}


//facebook engagement tooltip configuration code
var engagementTip = {
  title : function() {
    return 'Average Facebook likes, comments, and shares per post as a percentage of total community size' 
  },
  gravity : 'n',
  fade : true
}


function manageChartNotes(dataType){
      if ( dataType === 'engagement' && $('#lancome-note').length > 0 ) {
        console.log("both")

        d3.select('#highcharts-0').select('svg').append('text')
            .text("note: discrepancies may exist for brands utilizing geotargeting")
              .attr('x', 485)
              .attr('y', 358)
              .attr('id', 'engagement-note')
              .style('opacity', .6)
              .style('font-size', '10px')
              .style('font-style', 'italic')

      } else if ( dataType === 'engagement' ) {
        console.log("no lancome", $('#highcharts-0'))       

        d3.select('#highcharts-0').select('svg').append('text')
            .text("note: discrepancies may exist for brands utilizing geotargeting")
              .attr('x', 485)
              .attr('y', 372)
              .attr('id', 'engagement-note')
              .style('opacity', .6)
              .style('font-size', '10px')
              .style('font-style', 'italic')

         console.log('note appended')     
      } else{
        
        d3.select('#lancome-note').attr('dy', '0px').style('opacity', .6)
      }
}


//facebook engagement tooltip
$('#engagement').tipsy(engagementTip)

//brand list for a given category
function getCategoryBrandList(){

    $('#m1_brand_list').click(function(){

      $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrandsByCat?u=' + wpid + '&categoryId=' + m1CategoryId + '&callback=?', function(data){
        
        $('body').append('<div id="category_brand_list"></div>')

        var offset = $('.benchmark-drop-title').offset()

        $('#category_brand_list').css('top', offset.top + 40).css('left', offset.left)

        $.each(data, function(i){
          $('#category_brand_list').append('<div class="category-brand">' + data[i].brandName + '</div>')
        })
    
    })

  })

  $('#main').click(function(){
    $('#category_brand_list').remove()
  })

}


function removeChartSeries(brandName){
  var names = []

  $.each(clickedBenchmarks, function(index){
    names.push(clickedBenchmarks[index].name);
  })
  
  //if brandId is in clickedBenchmarks, remove from clicked benchmarks and add to removed benchmarks
  var brandIndex = $.inArray(brandName, names)

  if (brandIndex !== Number(-1)){
      var brandString = '.' + clickedBenchmarks[brandIndex].id
      $(brandString).attr('checked', false)

      //remove brand
      removeSeries(clickedBenchmarks[brandIndex].id);

  }

}


function toggleSeriesCheck(){ //RENAME THIS!!!  THIS IS THE WORST NAME EVAR.
     
     var buttonIndex = [];

     $('.toggle-series-check').click(function(){ //create a toggle favorite function????????? PROBABLY YES

      var brandId = getClass($(this).attr('class'), 1),
          chartStateService = getClass($('.active').attr("class"), 1),
          chartStateDataType = lineChart.title.textStr.toLowerCase();

        //if button is not already clicked / brand info is not already displayed
        if( this.checked ){
          $(this).hide()
          $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

          //add series to line chart
          addSeries(brandId, chartStateService, chartStateDataType);
           
        } 
        else{
          removeSeries(brandId);
        }

        clearResults();
     })

}


//ALL THE TOGGLE SERIES FUNCTIONS SHOULD BE ABLE TO BE REFACTORED INTO ONE BLOCK
function toggleSearchedForSeriesCheck(brandId, brandName, module){
 
    var brandId = String(brandId),
        chartStateService = getClass($('.active').attr("class"), 1),
        chartStateDataType = lineChart.title.textStr.toLowerCase(),
        selectorString = '.' + brandId;

      //append clicked brand to results display
      var searchResultString = '<div class="benchmark_search_result"><div class="remove-button"><p>X</p></div><div class="favorite-check-wrapper"><div class="favorite-icon-wrapper">'
      searchResultString += '<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/></div>' 
      searchResultString += '<input class="toggle-searched-series-check ' + brandId + '" type="checkbox" checked="checked"/><img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/></div>' 
      searchResultString += '<div class="engagement-name-link-wrapper"><div class="searched_name"><a href="" Target="_blank">' + brandName + '</a></div></div></div>' 

      $('#benchmark_search_results').append(searchResultString)

      $('.benchmark_search_result').last().find('.toggle-searched-series-check').hide();

      addSeries(brandId, chartStateService, chartStateDataType, 'doIt');

      $('.benchmark_search_result').find(selectorString).click(function(){
          //if button is not already clicked / brand info is not already displayed
            if( this.checked ){ 
              $(this).hide()
              $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

              addSeries(brandId, chartStateService, chartStateDataType);

            } else{

              removeSeries(brandId);  
            } 
      })
      clearResults();
}


function toggleFavoriteSearchedSeries(brandId, brandName){

      $('.toggle-favorite-searched-series-check').click(function(){

        var brandId = getClass($(this).attr('class'), 1),
            brandName = $(this).html(),
            chartStateService = getClass($('.active').attr("class"), 1),
            chartStateDataType = lineChart.title.textStr.toLowerCase();
          
          //if button is not already clicked / brand info is not already displayed
          if( this.checked ){ 
            $(this).hide()
            $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

            addSeries(brandId, chartStateService, chartStateDataType);

          } else{
            removeSeries(brandId, $(this));  
          } 
      })

      clearResults();
}


function toggleFavoriteBenchmarksSeries(){

      $('.toggle-favorite-benchmark-series-check').click(function(){
        var brandId = getClass($(this).attr('class'), 1);
            brandName = $(this).html(),
            chartStateService = getClass($('.active').attr("class"), 1),
            chartStateDataType = lineChart.title.textStr.toLowerCase();

          //if button is not already clicked / brand info is not already displayed
          if( this.checked ){
            $(this).hide()
            $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

            addSeries(brandId, chartStateService, chartStateDataType);

          } else{
            removeSeries(brandId);  
          } 
      })

}


function togglePopulatedFavorites(){

      $('.toggle-favorite-series-check').click(function(){
        var brandId = getClass($(this).attr('class'), 1);
            brandName = $(this).html(),
            chartStateService = getClass($('.active').attr("class"), 1),
            chartStateDataType = lineChart.title.textStr.toLowerCase();

          //if button is not already clicked / brand info is not already displayed
          if(this.checked){
              $(this).hide()
              $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

              addSeries(brandId, chartStateService, chartStateDataType);

          } else{
            removeSeries(brandId, $(this));  
          } 
      })

      clearResults();
}


function changeLinks(){

  var service = getClass($('.active').attr("class"), 1);

  $.each($('.benchmark_search_result'), function(i){
      var link = returnSearchedLink(searchedLinks[i], service)
      $(this).find('a').attr( 'href', link[1] + link[0] )
  })

  //change favorite links on change
  $.each($('.favorite-benchmark'), function(index){
    var link = returnFavoriteLink(favorites[index], service)
    $(this).find('a').attr( 'href', link[1] + link[0] )
  })

}

function addSeries(brandId, chartStateService, chartStateDataType, addLink){

  var ids = []

  $.each(clickedBenchmarks, function(i){
    ids.push(clickedBenchmarks[i].id)
  })
  
  var notThere = $.inArray(brandId, ids)

  if ( notThere === -1 ){

  //get 30 day brand data from web service
   $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrandDataHistoryNumeric?u=' + wpid + '&days=365&brandid=' + brandId + '&callback=?', function(data){

      //create brand data object                
      brand = create30DayBrandDataObject(data);
      
      //set brand Id
      brand.id = brandId

      //add data to chart depending on currently displayed service and metric 
      switchServiceAndMetric(chartStateService, chartStateDataType, brand);
      
      //add brand data object to array of clicked brands
      brand.id = brandId;
      clickedBenchmarks.push(brand);

      //THIS IS A A TERRIBLE HACK.  FIGURE OUT HOW TO RESTRUCTURE THIS AREA OF THE CODE
      if(addLink !== undefined){
         var link = returnLink(brand, chartStateService)

         $('.benchmark_search_result').last().find('a').attr('href', link[1] + link[0])
        
         searchedLinks.push(brand.links); 
      }

      addBenchmarkChecks();

      var selectorString = '.' + brandId
      $(selectorString).parent().find('.loading-icon').remove()
      $(selectorString).fadeIn();

      $('#no_data').remove()
   });
      
      // if( brandId === '4330'){
      //   d3.select('.highcharts-subtitle').append('tspan')
      //       .text("note: As of July 2012 Lancome's Facebook 'like' data reflects a consolidation of all their pages.")
      //         .attr('dx', -445)
      //         .attr('dy', 345)
      //         .attr('id', 'lancome-note')
      // }

      // NEW CODE
      if ( brandId === '4330' && $( '#engagement-note' ).length > 0 ){
        console.log("both")

        d3.select('#engagement-note').attr('dy', '-15px')

        d3.select('#highcharts-0').select('svg').append('text')
            .text("note: As of July 2012 Lancome's Facebook 'like' data reflects a consolidation of all their pages.")
              .attr('x', 335)
              .attr('y', 372)
              .attr('id', 'lancome-note')
              .style('opacity', .6)
              .style('font-size', '10px')
              .style('font-style', 'italic')

      } else if ( brandId === '4330' ){
        
        console.log("just lancome")

        d3.select('#highcharts-0').select('svg').append('text')
            .text("note: As of July 2012 Lancome's Facebook 'like' data reflects a consolidation of all their pages.")
              .attr('x', 335)
              .attr('y', 372)
              .attr('id', 'lancome-note')
              .style('opacity', .6)
              .style('font-size', '10px')
              .style('font-style', 'italic')
      } 

  } else{
    
    var selectorString = '.' + brandId
    $(selectorString).parent().find('.loading-icon').remove()
    $(selectorString).fadeIn()
  }

}


function removeSeries(brandId, dr){ 

    //instantiate array for names of objects 
    var ids = [];
    
    //loop through clickedbenchmark objects and add brand names to name array
    $.each(clickedBenchmarks, function(i){
      ids.push(clickedBenchmarks[i].id);
    })

    //find array index of object with name matching clicked name
    var toRemoveIndex = $.inArray(brandId , ids);

    //if brand is in array of clicked benchmarks, remove brand from line chart
    if(toRemoveIndex !== -1){
      console.log("in there, removing")

      lineChart.series[toRemoveIndex].remove();

    //remove brand object from clicked benchmarks array
      clickedBenchmarks.remove(toRemoveIndex, toRemoveIndex); 
    }


   removeBenchmarkChecks(brandId);

  if( brandId === '4330'){
    d3.select('#lancome-note').remove()
    // d3.select('#engagement-note').attr('dy', '345px')
    d3.select('#engagement-note').attr('dy', '0px')
  }
}


function removeFavoriteFromArray(brandId){

  var ids = [];
  
  $.each(favorites, function(key, value){
    ids.push(value.brandId);
  })

  var toRemoveIndex = $.inArray(brandId , ids);

  favorites.remove(toRemoveIndex);

}


//provides brand search functionality and add searched-for brands
function listBrandsAutoComplete(){ // again, CHANGE THIS NAME.  BAD NAME.  

 var items = [],
     ids = [];
 var u = 6700;
  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrands?u=' + wpid + '&callback=?',function(data) {

    $.each(data, function(key, val) {
      items.push(val.brandName);
      ids.push(val.brandId);
     });

     $('#benchmark_search_input').keyup(function(){

        $('#benchmark_search_input').autocomplete({
          minLength: 1,
          source: items,
          select: function(event, ui){
            for(var j = 0; j < data.length; j++){
              if (data[j].brandName === ui.item.value){
                
                var brandId = String(data[j].brandId)

                var ids = [];

                $.each(clickedBenchmarks, function(index){
                    ids.push(clickedBenchmarks[index].id)
                })

                var inArray = $.inArray(ids, brandId)

                
                toggleSearchedForSeriesCheck(brandId, data[j].brandName, 'm1')

                //removed
                toggleSearchedFavorite(brandId, data[j].brandName);          

                removeSearchedBenchmark(brandId, '.benchmark_search_result')        

                //check if other things are favorited
                for(var k = 0; k < favorites.length; k++){
                  if(favorites[k].brandName === ui.item.value){
                    $('.searched_name').last().parent().prev().children().eq(0).remove();
                    $('.searched_name').last().parent().prev().prepend('<div class=favorite-icon-wrapper><img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/></div>');
                    
                    toggleSearchedFavorite(data[j].brandId, data[j].brandName);                  
                    // checkIfFavorited(favorites[k].brandId, 'm1_searched')
                  }
                }
              }
            }
          } 
        })
     });   
 });
}

//adds/removes favorite for searched-for favorites  
function toggleSearchedFavorite(brandId, brandName){
  var classString = '.' + brandId,
      m1FavoriteString,
      m3FavoriteString;

   $('.benchmark_search_result').find(classString).prev().click(function(){

      if(!$(this).children(0).hasClass('favorite')){

        m1FavoriteString = '<div class="favorite-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-searched-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
        m1FavoriteString += '<div class="favorite-benchmark-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

        $('#m1_favorites').append(m1FavoriteString)

        m3FavoriteString = '<div class="favorite-engagement-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-searched-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
        m3FavoriteString += '<div class="favorite-benchmark-engagement-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

        $('#m3_favorites').append(m3FavoriteString)

        addFavorite(brandId);
        toggleFavoriteSearchedSeries(brandId, brandName);
        toggleEngagementSearchedFavoriteSeriesCheck();

      } 
      else{

        var classString = '.' + brandId
        
        $('.favorite-benchmark, .favorite-engagement-benchmark').find(classString).parent().parent().remove();

        removeFavorite(brandId);
      }
   })

}

//clear all series data from chart
function clearResults(){   
  $('#m1_reset_button').click(function(){

     $('.toggle-series-check, .toggle-favorite-series-check, .toggle-searched-series-check, .toggle-favorite-benchmark-series-check, .toggle-favorite-searched-series-check').not('.4332').attr('checked', false)

     for(var i = lineChart.series.length -1; i > 0; i--){
        lineChart.series[i].remove();
        clickedBenchmarks.remove(i);
     }

     lineChart.redraw()

     if($('#lancome-note')){
        d3.select('#lancome-note').remove()
     }
     // clickedBenchmarks.length === 1
  })
}

//adds checks if same brand is in different area of the chart
function addBenchmarkChecks(){

  $.each($('.toggle-series-check'), function(i){
    var catId = getClass($(this).attr('class'), 1)

    $.each(clickedBenchmarks, function(j){
        if(catId === String(clickedBenchmarks[j].id)){
          $('.toggle-series-check').eq(i).attr('checked', true);
        }
    })
  })

  $.each($('.toggle-searched-series-check'), function(k){
    var searchedId = getClass($(this).attr('class'), 1)

    $.each(clickedBenchmarks, function(l){
        if(searchedId === String(clickedBenchmarks[l].id)){
          $('.toggle-searched-series-check').eq(k).attr('checked', true);
        }
    })
  })

  $.each($('.toggle-favorite-series-check'), function(m){
    var favId = getClass($(this).attr('class'), 1)

    $.each(clickedBenchmarks, function(n){
        if(favId === String(clickedBenchmarks[n].id)){
          $('.toggle-favorite-series-check').eq(m).attr('checked', true);
        }
    })
  })

}

//removes checks if same brand is also on the chart
function removeBenchmarkChecks(brandId){
  
  var selectorString = '.' + brandId
  $('.category_benchmark, .favorite-benchmark, .benchmark_search_result').find(selectorString).attr('checked', false);

}

      /****************************************************************/
      /******* ALL THE INDENTED CODE HERE NEEDS TO BE REFACTORED*******/
      /****************************************************************/
      function toggleBenchmarkFavorite(){

         $('.category_benchmark').find('.favorite-icon-wrapper').click(function(){

            var brandId = getClass($(this).next().attr('class'), 1),
                brandName = $(this).parent().parent().find('a').html(),
                favoriteString;

            if(!$(this).children().hasClass('favorite')){

              m1FavoriteString = '<div class="favorite-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-benchmark-series-check ' + brandId.toString() + '" type="checkbox" /></div>'
              m1FavoriteString += '<div class="favorite-benchmark-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m1_favorites').append(m1FavoriteString);

              m3FavoriteString = '<div class="favorite-engagement-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-engagement-favorite-benchmark-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
              m3FavoriteString += '<div class="favorite-benchmark-engagement-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m3_favorites').append(m3FavoriteString)

              addFavorite(brandId);
              toggleFavoriteBenchmarksSeries();
              toggleEngagementBenchmarkFavoriteSeriesCheck();
              addBenchmarkChecks()

            } 
            else{

              var classString = '.' + brandId
              
              $('.favorite-benchmark, .favorite-engagement-benchmark').find(classString).parent().parent().remove();

              removeFavorite(brandId);
              removeBenchmarkChecks();
            }
         })

      }

      //THIS NEEDS TO BE REFACTORED.  IT CAN BE DONE MUCH MORE SIMPLY
      function fixFavoriteStarsAddition(){

        //for each benchmark search result
        for (var i = 0; i < $('.benchmark_search_result').length; i++){
          //and for each favorite
          for(var j = 0; j < favorites.length; j++){
            //compare each search result to each favorite.  if the brand is a favorite, make sure it has a star
            if(getClass($('.benchmark_search_result').eq(i).find('.toggle-searched-series-check').attr('class'), 1) === String(favorites[j].brandId)){
              $('.benchmark_search_result').eq(i).find('.favorite-icon-wrapper').children().remove()
              $('.benchmark_search_result').eq(i).find('.favorite-icon-wrapper').prepend('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/></div>')
            }
          }
        }
        
        //for each category benchmark
        for (var k = 0; k < $('.category_benchmark').length; k++){
          //and for each favorite
          for(var l = 0; l < favorites.length; l++){

            //compare each search result to each favorite.  if the brand is a favorite, make sure it has a star
            if(getClass($('.category_benchmark').eq(k).find('.toggle-series-check').attr('class'), 1) === String(favorites[l].brandId)){
              
              //if should be favorite and isn't yet, add star
              if(!$('.category_benchmark').eq(k).find('.favorite-icon').hasClass('favorite')){  
                
                $('.category_benchmark').eq(k).find('.favorite-icon-wrapper').children().remove()
                $('.category_benchmark').eq(k).find('.favorite-icon-wrapper').prepend('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>')

              }
            }
          }
        }

        for (var n = 0; n < $('.engagement_benchmark_search_result').length; n++){
          //and for each favorite
          for(var m = 0; m < favorites.length; m++){
            //compare each search result to each favorite.  if the brand is a favorite, make sure it has a star
            var engagementSearchedId = getClass($('.benchmark_search_result').eq(n).find('.engagement-searched-check').attr('class'), 1);

            if( engagementSearchedId === String(favorites[m].brandId)){
              $('.engagement_benchmark_search_result').eq(n).find('.favorite-icon-wrapper').children().remove()
              $('.engagement_benchmark_search_result').eq(n).find('.favorite-icon-wrapper').prepend('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/></div>')
            }
          }
        }

        for (var o = 0; o < $('.engagement_category_benchmark').length; o++){
          //and for each favorite
          for(var p = 0; p < favorites.length; p++){

            //compare each search result to each favorite.  if the brand is a favorite, make sure it has a star
            if(getClass($('.engagement_category_benchmark').eq(o).find('.toggle-engagement-series-check').attr('class'), 1) === String(favorites[p].brandId)){
              
              //if should be favorite and isn't yet, add star
              if(!$('.engagement_category_benchmark').eq(o).find('.favorite-icon').hasClass('favorite')){  
                
                console.log("favorite and not yet favorited, adding star - engagement style")
                $('.engagement_category_benchmark').eq(o).find('.favorite-icon-wrapper').children().remove()
                $('.engagement_category_benchmark').eq(o).find('.favorite-icon-wrapper').prepend('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>')

              }
              else{
                console.log("already favorited, no need to change anything")
              }

            }
          }
        }
      }

      /****************************************************************/
      /************************* END REFACTORED ***********************/
      /****************************************************************/

function fixFavoriteStarsRemoval(brandId){

  var idString = '.' + brandId
  $('.benchmark_search_result').find(idString).prev().children().remove()
  $('.benchmark_search_result').find(idString).prev().append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>')

  $('.category_benchmark').find(idString).prev().children(0).remove();
  $('.category_benchmark').find(idString).prev().append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>')  

  $('.engagement_benchmark_search_result').find(idString).prev().children().remove()
  $('.engagement_benchmark_search_result').find(idString).prev().append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>')

  $('.engagement_category_benchmark').find(idString).prev().children().remove()
  $('.engagement_category_benchmark').find(idString).prev().append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>')

}


/****************************************************************/
/******************** MODULE TWO FUNCTIONS **********************/
/****************************************************************/

function createM2Charts(){      
      likes = new Highcharts.Chart({
         chart: {
            renderTo: 'top_five_all_time_chart_container',
            type: 'bar',     
         },
         title: {
            text: '"likes"'
         },
         legend: {
            enabled: false
         },
         credits: {
            enabled: false
         },
          xAxis: {
            labels: {
                enabled: true,
                align: 'left',
                x: 0,
                y: 22,
                style: {
                    'width' : '300px'
                },
            },
            tickWidth: 0,
            lineWidth: 0
         },
         yAxis: {
            labels: {
               enabled: false,
            },
            title: {
               text: ''
            },
            gridLineWidth: 0
         },
        exporting : {
          enabled : false,
        },
         plotOptions: {
            series: {
                shadow: false,
                dataLabels: {
                  enabled: true,
                  align: 'right',
                  color: 'black',
                  y: -12,
                  formatter: function(){
                       var nStr = this.y
                       nStr += '';
                       x = nStr.split('.');
                       x1 = x[0];
                       x2 = x.length > 1 ? '.' + x[1] : '';
                       var rgx = /(\d+)(\d{3})/;
                       while (rgx.test(x1)) {
                         x1 = x1.replace(rgx, '$1' + ',' + '$2');
                      }
                      return x1 + x2;
                  }
               }
            }
         },
         series: [{
            data: []
         }]
      });

      likesPerDay = new Highcharts.Chart({
         chart: {
            renderTo: 'top_five_perday_chart_container',
            type: 'bar'
         },
         credits: {
            enabled: false
         },
         legend: {
            enabled: false
         },
         xAxis: {
            labels: {
                enabled: true,
                align: 'left',
                x: 0,
                y: 22,
                style: {
                    'width' : '300px'
                }
            },
            tickWidth: 0,
            lineWidth: 0
         },
         yAxis: {
            labels: {
               enabled: false
            },
            title: {
               text: ''
            },
            gridLineWidth: 0
         },
         exporting : {
          enabled : false,
         },
         title: {
            text: '"likes"/Day'
         },
         plotOptions: {
            series: {
                shadow: false,
                dataLabels: {
                  enabled: true,
                  align: 'right',
                  color: 'black',
                  y: -12,
                  formatter: function(){
                       var nStr = this.y
                       nStr += '';
                       x = nStr.split('.');
                       x1 = x[0];
                       x2 = x.length > 1 ? '.' + x[1] : '';
                       var rgx = /(\d+)(\d{3})/;
                       while (rgx.test(x1)) {
                         x1 = x1.replace(rgx, '$1' + ',' + '$2');
                      }
                      return x1 + x2;
                  }
               }
            }
         },
         series: [{
            data: [],
         }]
      });

      growth = new Highcharts.Chart({
         chart: {
            renderTo: 'top_five_growth_chart_container',
            type: 'bar'
         },
         legend: {
            enabled: false
         },
         credits: {
            enabled: false
         },
         xAxis: {
            labels: {
                enabled: true,
                align: 'left',
                x: 0,
                y: 22,
                style: {
                    'width' : '300px',
                    'overflow' : 'hidden'
                }
            },
            tickWidth: 0,
            lineWidth: 0
         },
         yAxis: {
            gridLineWidth: 0,
            labels: {
               enabled: false
            },
            title: {
               text: ''
            }
         },
         exporting : {
           enabled : false,
         },
         title: {
            text: 'Growth %'
         },
        plotOptions: {
            series: {
                shadow: false,
                dataLabels: {
                  enabled: true,
                  align: 'right',
                  color: 'black',
                  y: -12,
                  formatter: function(){
                       var nStr = this.y
                       nStr += '';
                       x = nStr.split('.');
                       x1 = x[0];
                       x2 = x.length > 1 ? '.' + x[1] : '';
                       var rgx = /(\d+)(\d{3})/;
                       while (rgx.test(x1)) {
                         x1 = x1.replace(rgx, '$1' + ',' + '$2');
                      }
                      return x1 + x2;
                  }
               }
            }
         },
         lineWidth: 0,
         series: [{
            data: []
         }]
      });
  }

function populateM2Chart(category){

  changeM2CategoryDrop();

  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getCategoryDataTop10?u=' + wpid + '&categoryId=' + category + '&callback=?', function(data){

      var ranking = createCategoryTop10DataObject(data);

      //set initial data population to Facebook 
      toggleService('m2', 'facebook', ranking);

      //if user toggles service 
      $('.m2_toggle').click(function(){
         var classes = $(this).attr("class");
         var module = getClass(classes, 2);
         var service = $(this).children().html();
         service = service.lowerize(service);

         toggleService(module, service, ranking);
      })

      setDropdowns(ranking);

   });
  
}

function changeM2CategoryDrop(){

  $('#category_benchmark_drop').change(function() {

    // if you want to do stuff based on the OPTION element:
    var opt = $(this).val();

    $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getCategoryDataTop10?u=' + wpid + '&categoryId=' + opt + '&callback=?', function(data){

      var ranking = createCategoryTop10DataObject(data);

      // rankingNames = ranking;

      toggleService('m2', 'facebook', ranking);

      $('.m2_toggle').click(function(){
         var classes = $(this).attr("class");
         var module = getClass(classes, 2);
         var service = $(this).children().html();
         service = service.lowerize(service);

         toggleService(module, service, ranking);
      })

      //************ set drop down default to selected category 
      var textToFind = ranking.categoryName;

      var dd = document.getElementById('category_benchmark_drop');
      for (var i = 0; i < dd.options.length; i++) {
          if (dd.options[i].text === textToFind) {
              dd.selectedIndex = i;
              break;
          }
      }
    });
  });
}

// this is an m2 helper function 
function getOffsetLeft( Elem )
{
    var offsetLeft = 0;
    do {
      if ( !isNaN( Elem.offsetLeft ) )
      {
          offsetLeft += Elem.offsetLeft;
      }
    } while( Elem = Elem.offsetParent );
    return offsetLeft;
}

//fixes left offset for modulte two data
function fixM2DataOffset(){

    var charts = [likes, likesPerDay, growth],
        likesRects = [],
        perDayRects = [],
        growthRects = [],
        dataRects = [likesRects, perDayRects, growthRects],
        b = 0,
        c = 0,
        j = 0,
        k = 0;

    for(var a = 0; a < $('.highcharts-data-labels').find('rect').length; a++){

        if(c == 5){
          c = 0;
          b++
        }

        dataRects[b].push($('.highcharts-data-labels').find('rect').eq(a).attr('width'))

        c++;
    }

    d3.selectAll('.highcharts-data-labels').selectAll('text').each(function(d,i){
        var dataWidth = dataRects[k][j],
            barWidth = charts[k].series[0].points[i].barH,
            offset = dataWidth - barWidth;

        if(dataWidth > barWidth){
          d3.select(this).attr('dx', offset);
        }

        if(j == 5){
          j = 0;
          k++;
        }

        j++;
    })
}


/****************************************************************/
/******************** MODULE THREE FUNCTIONS ********************/
/****************************************************************/

//create engagement chart function
function createEngagementChart(category, brandId){

  var index = clickedBenchmarks[0].likes.length - 1,
      communityCategory = returnEngagementCommunityCategory(clickedBenchmarks[0].likes[index][1])

  changeEngagementCategoryDrop(communityCategory);

  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getTop10EngagementBrandDataBySize?u=' + wpid + '&categoryId=' + category + '&likesMin=' + communitySizes[communityCategory][0] + '&likesMax=' + communitySizes[communityCategory][1] + '&callback=?', function(data){
      //set engagement info var to engagement data for future use 
      // engagementInformation = engagementData;
        changeMetricBenchmarks(data, 'm3');
        setCommunitySizeDrop(communityCategory);

        var returnedData = data;

        var data = [],
            minX,
            maxX,
            minY,
            maxY,
            numCircles = 5;

            //if there are less than 5 circles, set number of circles to number of brands returned
            returnedData.length < 5 ? numCircles = returnedData.length : null

      for ( i = 0; i < numCircles; i++ ) {

          x = (roundNumber(parseFloat(returnedData[i].likesGrowthPct30), 2)/100),
          y = (roundNumber(parseFloat(returnedData[i].FBEngagement), 2)/100),
          d = parseInt(returnedData[i].likesTotal.replace(/,/g , "")),
          name = returnedData[i].brandName;
          id = String(returnedData[i].brandId);

            data.push([ x, y, d, name, id ])      
      }


      var growthIndex = clickedBenchmarks[0].likesGrowth.length - 1,
          engagementIndex = clickedBenchmarks[0].FBEngagement.length - 1,
          likesIndex = clickedBenchmarks[0].likes.length - 1

      memberAr = [ roundNumber(clickedBenchmarks[0].likesGrowth[growthIndex][1], 2)/100 , roundNumber(clickedBenchmarks[0].FBEngagement[engagementIndex][1], 2)/100, clickedBenchmarks[0].likes[likesIndex][1], clickedBenchmarks[0].name, clickedBenchmarks[0].id ]   

      var ids = []

      $.each(data, function(i){
          ids.push(data[i][4])
      })

      var inAr = $.inArray(String(memberAr[4]), ids)

      inAr === -1 ? data.push(memberAr) : null

      currentEngagementData = data;
      
      //this looks like redundant code REFACTOR
      $.each(data, function(index, value){
        engagementResetBrands.push(String(value[4]))
      })

      /********* M3 ENGAGEMENT CHART ************/
      engagementChart(data, String(brandId));
    
      clearEngagementChart(brandId);

      addEngagementBenchmarkChecks();
  })

}


//sets size of community size drop down
function setCommunitySizeDrop(catId){

  catId = String(catId);
  
  var cd = document.getElementById('community_size_drop');
  for (var i = 0; i < cd.options.length; i++) {
      
      if (cd.options[i].value === catId) {
          cd.selectedIndex = i;
          break;
      }
  }

}


//populates salesforce data
function populateSalesForceData(){
  
  var brandName = $('#brand_name').html()
      brandName = brandName.split(' -')
      brandName = brandName[0].split(' <')
      brandName = brandName[0]

      var ampTest = /&amp;/g,
          amp = ampTest.test(brandName)

      amp ? brandName = brandName.replace(/&amp;/g, '%26') : brandName = encodeURIComponent(brandName),

      dataString = 'brand=' + brandName

      console.log("dataString ", dataString)

   $.ajax({
      url: 'http://www.l2thinktank.com/wp-content/themes/l2/js/intelligencePage/salesforce/demo_rest.php', //  /intelligencePage/salesforce/demo_rest.php
      type: 'POST',
      data: dataString,
      success : function(data){

        var salesforce = $.parseJSON(data);

        console.log("returned data", data)

        //if the brand has been in L2 studies, append study info
        if (salesforce.records.length > 0){ 

            salesforce = salesforce.records[0].L2_Research_Reports__r.records;

            console.log("salesforce", salesforce)

            $.each(salesforce, function(key, value){
                  
                  var name = value.Name,
                      split = name.split(" "),
                      rank = value.Ranking__c,                    
                      report_name = "",
                      report_type = "",
                      digPatt = /Digital/,
                      presPatt = /Prestige/g,
                      fragPatt = /Fragrance/

                  if( fragPatt.test(name) ){
                      
                      var link = research_reports.studies[0]["Digital IQ Index Fragrance 2012"].download,
                          date = new Date(research_reports.studies[0]["Digital IQ Index Fragrance 2012"].date),
                          date = date.toString("MMMM dd, yyyy"),
                          counter = 5

                          while (counter > 0 ){
                            split.pop()
                            counter--
                          }

                          var index = $.inArray(split, "Digital")

                          split.remove(index)

                          for(var k = 0; k < split.length; k++){
                            report_name += split[k] + " "
                          }

                          report_type = "Digital IQ Index"
                          report_name += "Fragrance 2012"
                          
                  } else {
                        
                      var link = research_reports.studies[0][name].download,
                          date = new Date(research_reports.studies[0][name].date),
                          date = date.toString("MMMM dd, yyyy")

                      if( digPatt.test(name) ){
                          report_type = "Digital IQ Index"
                        
                        for (var j = 3; j < split.length; j++){
                          report_name += split[j] + " ";
                        }
                      } else if(presPatt.test(name)){ 
                        report_type = "Prestige 100"
                        for (var j = 2; j < split.length; j++){
                          report_name += split[j]  + " ";
                        }
                      } else{
                        report_type = "Featured"
                        report_name = name
                      }
                }

              $('#l2rr_content').append('<div id="rr_' + (key + 1) + '" class="research_rank_data"><div class="ranking">' + rank + '</div><div class="report_text_wrapper"><div class="ranking_title"><p><a href="' + link + '" target="_blank">'+ report_type +'</a></p> </div><div class="report_name"><p><a href="' + link + '" target="_blank">' + report_name +'</a></p></div><div class="date"><p>' + date + '</p></div></div>  </div>');
            })
            
            $('.date').sort(function(a,b){
                return new Date($(a).children().html()) > new Date($(b).children().html()); 
            }).each(function(){
              $('#l2rr_content').prepend($(this).parent().parent());
            })

            $('.research_rank_data').eq(0).css('margin-top', '20px')
        }
        //else append no studies message
        else{
            $('#l2rr_content').append('<div id="l2_rr_error_msg"><p>No study information available</p></div>')
        }
        
      }
  })

}

function toggleSearchedEngagementSeries(brandId, brandName){
      
  //append clicked brand to results display
  var searchResultString = ''
  searchResultString += '<div class="engagement_benchmark_search_result"><div class="engagement-remove-button"><p>X</p></div><div class="favorite-check-wrapper"><div class="favorite-icon-wrapper">'
  searchResultString += '<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/></div>'
  searchResultString += '<input type="checkbox" class="engagement-searched-check ' + brandId + '" checked="checked" /><img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/></div>'
  searchResultString += '<div class="engagement-searched-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

  $('#engagement_benchmark_search_results').append(searchResultString);

  $('.engagement_benchmark_search_result').last().find('.engagement-searched-check').hide()

  addEngagementSeries(brandId, 'doIt');

  $('.engagement-searched-check').click(function(){
      if(this.checked){
          addEngagementSeries(brandId, 'doIt')
          
      } else{
          removeEngagementSeries(brandId, $(this));
      }
  })
}

function toggleEngagementSeriesCheck(){
  
  $('.toggle-engagement-series-check, .toggle-engagement-favorite-benchmark-series-check').click(function(){

      var brandId = getClass($(this).attr('class'), 1);

    //if button is not already clicked / brand info is not already displayed
      if( this.checked ){
        $(this).hide()
        $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

        addEngagementSeries(brandId);
      } 
      else{
        removeEngagementSeries(brandId, $(this));
      }
    })
}

function toggleEngagementBenchmarkFavoriteSeriesCheck(){
  
  $('.toggle-engagement-favorite-benchmark-series-check').click(function(){

      var brandId = getClass($(this).attr('class'), 1);

    //if button is not already clicked / brand info is not already displayed
      if( this.checked ){
        $(this).hide()
        $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')
        
        addEngagementSeries(brandId);
      } 
      else{
        removeEngagementSeries(brandId, $(this));
      }
    })
}

function toggleEngagementSearchedFavoriteSeriesCheck(){
  
  $('.toggle-engagement-favorite-searched-series-check').click(function(){

      var brandId = getClass($(this).attr('class'), 1);

    //if button is not already clicked / brand info is not already displayed
      if( this.checked ){
        $(this).hide()
        $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

        addEngagementSeries(brandId);
      } 
      else{
        removeEngagementSeries(brandId, $(this));
      }
    })
}

function toggleEngagementFavoriteSeriesCheck(){
  
  $('.toggle-engagement-favorite-series-check').click(function(){

      var brandId = getClass($(this).attr('class'), 1);

    //if button is not already clicked / brand info is not already displayed
      if( this.checked ){
        $(this).hide()
        $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

        addEngagementSeries(brandId);
      } 
      else{
        removeEngagementSeries(brandId, $(this));
      }
    })
}


function addEngagementSeries(brandId, addLink){

    //get 30 day brand data from web service
   $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrandDataHistoryNumeric?u=' + wpid + '&days=365&brandid=' + brandId + '&bm=false&callback=?', function(data){

      //create brand data object                
      var brand = create30DayBrandDataObject(data);

      //THIS IS A A TERRIBLE HACK.  FIGURE OUT HOW TO RESTRUCTURE THIS AREA OF THE CODE
      if(addLink !== undefined){
         $('.engagement_benchmark_search_result').last().find('a').attr('href', 'http://www.facebook.com./' + brand.links.facebook )
         searchedLinks.push(brand.links);
      }
      //set objects brandid to current brand Id.
      brand.id = brandId;
      
      //add data to chart depending on currently displayed service and metric 
      redrawChart(brand);     

      addEngagementBenchmarkChecks()

      var selectorString = '.' + brandId
      $(selectorString).parent().find('.loading-icon').remove()
      $(selectorString).fadeIn();  
   });
}


function removeEngagementSeries(brandId, button){
    var memberBrandId = String(clickedBenchmarks[0].id)

    //instantiate array for names of objects 
    var arrayNames = [];
    //loop through clickedbenchmark objects and add brand names to name array
    $.each(currentEngagementData, function(key, value){
      arrayNames.push(value[4]);
    })

    //find array index of object with name matching clicked name
    var toRemoveIndex = $.inArray(brandId , arrayNames);
    
    //remove brand object from clicked benchmarks array
    currentEngagementData.remove(toRemoveIndex);

    $('#gse_chart').children().remove(); 

    engagementChart(currentEngagementData, memberBrandId);

    $('#gse_chart').hide().fadeIn();

    removeEngagementBenchmarkChecks(brandId);
}


function redrawChart(brand){

    var memberBrandId = String(clickedBenchmarks[0].id)

    $('#gse_chart').children().remove();

      var data = [],
          growthIndex = brand.likesGrowth.length - 1
          engagementIndex = brand.FBEngagement.length - 1
          newBrandEngagement = [brand.likesGrowth[growthIndex][1]/100 , brand.FBEngagement[engagementIndex][1]/100, brand.likes[growthIndex][1], brand.name, brand.id ],
          circleCount = 5;

      data = currentEngagementData;

      //push new brand data to existing data
      data.push(newBrandEngagement);

      //set current engagement data array to new data array 
      currentEngagementData = data;

      //redraw engagement chart
      engagementChart(data, memberBrandId)

      $('#gse_chart').hide().fadeIn();

}


function clearEngagementChart(brandId){
  $('#engagement_reset_button').click(function(){  

    for(var index = currentEngagementData.length; index >= 0; index--)  
      if( typeof currentEngagementData[index] !== 'undefined'){      
        var inAr = $.inArray(String(currentEngagementData[index][4]), engagementResetBrands)

        if ( inAr === -1 ) {

          var selectorString = '.' + currentEngagementData[index][4]

          console.log(currentEngagementData[index][4])
          
          console.log(selectorString)

          $(selectorString).attr('checked', false)

          currentEngagementData.remove(index)

        }
      }

    // $('.toggle-engagement-series-check, .toggle-engagement-favorite-series-check, .engagement-searched-check').attr('checked', false);

    $('#gse_chart').children().remove(); 

    engagementChart(currentEngagementData, String(brandId));

    $('#gse_chart').hide().fadeIn();

    addEngagementBenchmarkChecks();

  })
}


//BRAND BENCHMARK SEARCH FOR ENGAGEMENT CHART.  THIS SHOULD BE ONE  
function gseListBrandsAutoComplete(){
 var gseItems = [],
     gseIds = [];

  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getBrands?u='+ wpid +'&callback=?',function(data) {
    $.each(data, function(key, val) {
      gseItems.push(val.brandName);
      gseIds.push(val.brandId);
     });

     $('#engagement_benchmark_search_input').keyup(function(){

        $('#engagement_benchmark_search_input').autocomplete({
          minLength: 1,
          source: gseItems,
          select: function(event, ui){
            for(var j = 0; j < data.length; j++){
              if (data[j].brandName === ui.item.value){
                toggleSearchedEngagementSeries(data[j].brandId, ui.item.value, 'm1');
                
                removeSearchedBenchmark(data[j].brandId, '.engagement_benchmark_search_result')

              
                toggleEngagementSearchedFavorite(data[j].brandId, data[j].brandName);   
                //check if other things are favorited
                for(var k = 0; k < favorites.length; k++){
                  if(favorites[k].brandName === ui.item.value){
                    
                    $('.engagement_benchmark_search_result').last().find('.favorite-icon-wrapper').children().remove();
                    $('.engagement_benchmark_search_result').last().find('.favorite-icon-wrapper').append('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>');
                    

                    toggleEngagementSearchedFavorite(data[j].brandId, data[j].brandName);                  
                    // checkIfFavorited(favorites[k].brandId, 'm1_searched')
                  }
                }
              }
            }
              // toggleSearchedEngagementSeries(ui.item.value); 
          } 
        })
     })
  })
}

//adds checks to other brands also displayed on the engagement chart
function addEngagementBenchmarkChecks(){

  $.each($('.toggle-engagement-series-check'), function(i){
    var catId = getClass($(this).attr('class'), 1)

    $.each(currentEngagementData, function(j){
        if(catId === currentEngagementData[j][4]){
          $('.toggle-engagement-series-check').eq(i).attr('checked', true);
        }
    })
  })

  $.each($('.engagement-searched-check'), function(k){
    var searchedId = getClass($(this).attr('class'), 1)

    $.each(currentEngagementData, function(l){
        if(searchedId === String(currentEngagementData[l][4])){
          $('.engagement-searched-check').eq(k).attr('checked', true);
        }
    })
  })

  $.each($('.toggle-engagement-favorite-series-check'), function(m){
    var favId = getClass($(this).attr('class'), 1)

    $.each(currentEngagementData, function(n){
        if(favId === String(currentEngagementData[n][4])){
          $('.toggle-engagement-favorite-series-check').eq(m).attr('checked', true);
        }
    })
  })

}

//removes checks from removed brand if it's displayed elsewhere
function removeEngagementBenchmarkChecks(brandId){
  var selectorString = '.' + brandId
  
  $('.engagement_benchmark_search_result, .favorite-engagement-benchmark, .engagement_category_benchmark').find(selectorString).attr('checked', false);

}

      /****************************************************************/
      /******* ALL THE INDENTED CODE HERE NEEDS TO BE REFACTORED*******/
      /****************************************************************/

      function toggleEngagementBechmarkFavorite(){

           $('.engagement_category_benchmark').find('.favorite-icon-wrapper').click(function(){

            var brandId = getClass($(this).next().attr('class'), 1),
                brandName = $(this).parent().parent().find('a').html(),
                favoriteString;

            if(!$(this).children(0).hasClass('favorite')){

              $(this).children(0).remove();
              $(this).append('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>');

              m1FavoriteString = '<div class="favorite-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-benchmark-series-check ' + brandId.toString() + '" type="checkbox" /></div>'
              m1FavoriteString += '<div class="favorite-benchmark-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m1_favorites').append(m1FavoriteString);

              m3FavoriteString = '<div class="favorite-engagement-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-engagement-favorite-benchmark-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
              m3FavoriteString += '<div class="favorite-benchmark-engagement-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m3_favorites').append(m3FavoriteString)

              addFavorite(brandId);
              // toggleFavoriteBenchmarksSeries();
              toggleEngagementBenchmarkFavoriteSeriesCheck();

            } 
            else{

              $(this).children().remove();
              $(this).append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>');

              var classString = '.' + brandId
              
              $('.favorite-benchmark, .favorite-engagement-benchmark').find(classString).parent().parent().remove();

              removeFavorite(brandId);
            }
         })

      }


      function toggleEngagementSearchedFavorite(brandId, brandName){

            var classString = String('.' + brandId),
                favoriteString;

            // console.log("clicky", $('.engagement_benchmark_search_result').find(classString).prev())

         $('.engagement_benchmark_search_result').find(classString).prev().click(function(){

            if(!$(this).children(0).hasClass('favorite')){

              $(this).children(0).remove();
              $(this).append('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>');

              m1FavoriteString = '<div class="favorite-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-searched-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
              m1FavoriteString += '<div class="favorite-benchmark-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m1_favorites').append(m1FavoriteString)

              m3FavoriteString = '<div class="favorite-engagement-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-searched-series-check ' + brandId.toString() + '" type="checkbox"/></div>'
              m3FavoriteString += '<div class="favorite-benchmark-engagement-name"><a href="" Target="_blank">' + brandName + '</a></div></div>'

              $('#m3_favorites').append(m3FavoriteString)
              
              
              addFavorite(brandId);
              toggleFavoriteSearchedSeries(brandId, brandName);
              toggleEngagementSearchedFavoriteSeriesCheck();

            } 
            else{

              $(this).children().remove();
              $(this).append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>');

              var classString = '.' + brandId
              
              $('.favorite-benchmark, .favorite-engagement-benchmark').find(classString).parent().parent().remove();

              removeFavorite(brandId);
            }
         })

      }

      //WHY IS THERE NOT A TOGGLE SEARCHED BENCHMARK FAVORITE?  ALSO, THIS NEEDS TO BE REFACTORED
      function toggleEngagementBenchmarkFavorite(){
          
          $('.toggle-engagement-favorite-series-check').click(function(){

            var brandId = getClass($(this).attr('class'), 1);

            //if button is not already clicked / brand info is not already displayed
            if( this.checked ){
              $(this).hide()
              $(this).parent().append('<img class="loading-icon" src="/wp-content/themes/l2/images/intelligencePage/arrow-loader.gif"/>')

              addEngagementSeries(brandId);
            } 
            else{
              removeEngagementSeries(brandId, $(this));
            }
          })
      }

      /****************************************************************/
      /************************* END REFACTORED ***********************/
      /****************************************************************/

/****************************************************************/
/*************** HELPER / MULTI-MODULE FUNCTIONS ****************/
/****************************************************************/

// remove elements from array 
Array.prototype.remove = function(from, to) {
 var rest = this.slice((to || from) + 1 || this.length);
 this.length = from < 0 ? this.length + from : from;
 return this.push.apply(this, rest);
};

//clear up array
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

//hack to redraw line chart after svg issue from engagement chart
$('#module_three').hover(function(){
  
}, function(){
  lineChart.addSeries([])
  var toRemove = lineChart.series.length - 1
  lineChart.series[toRemove].remove();
})

function populateFavorites(){

  $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getUserFavorites?u=' + wpid + '&callback=?', function(data){

      var chartState = getM1ChartState(),
          state =  chartState.service,
          statelink = state + "link";    

      $.each(data, function(key, value){
        m1_string = '<div class="favorite-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-favorite-series-check ' + value.brandId.toString() + '" type="checkbox" /></div>'
        m1_string += '<div class="favorite-benchmark-name"><a href="http://www.' + state + '.com/' + value[statelink] +'" Target="_blank">' + value.brandName + '</a></div></div>'
        
        m3_string = '<div class="favorite-engagement-benchmark"><div class="toggle-series-check-wrapper"><input class="toggle-engagement-favorite-series-check ' + value.brandId.toString() + '" type="checkbox" /></div>'
        m3_string += '<div class="favorite-benchmark-engagment-name"><a href="http://www.' + state + '.com/' + value[statelink] +'" Target="_blank">' + value.brandName + '</a></div></div>'
        
        $('#m1_favorites').append(m1_string);
        
        $('#m3_favorites').append(m3_string);
        
        favorites.push(value);

      })

      togglePopulatedFavorites();
      toggleEngagementFavoriteSeriesCheck();
  
  })

}

function checkIfFavorited(brandId, source){

    var sourceInfo = favoriteSource(source)
        brandInstance = sourceInfo.brandInstance,
        checkType = sourceInfo.brandCheck,
        targetType = sourceInfo.targetInstance


    for(var i = 0; i < $(brandInstance).length; i++){
        if(String(brandId) === getClass($(checkType).eq(i).attr('class'), 1)) {                      
          
          if(!$(targetType).eq(i).find('.favorite-icon').hasClass('favorite')){          
            console.log("isnt' favorited so add favorite star");
            $(targetType).eq(i).find('.favorite-icon-wrapper').children().remove();
            $(targetType).eq(i).find('.favorite-icon-wrapper').append('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>');
          } else{
            console.log("is favorited so remove favorite star");
            $(targetType).eq(i).find('.favorite-icon-wrapper').children().remove();
            $(targetType).eq(i).find('.favorite-icon-wrapper').append('<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/>');
          }

        } else{
          console.log("nope")
        }
    }

}


//add brand favorite
function addFavorite(brandId){

    $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/setUserFavorites?u=' + wpid + '&b=' + brandId +'&a=add&callback=?', function(data){

        //add brand object to array of favorites
        favorites.push(data);
        //get current m1 service
        var service = getM1ChartState();
        service = service.service
        //get links from brand data object 
        var links = returnFavoriteLink(data, service)

        //append links
        $('.favorite-benchmark').last().find('a').attr('href', links[1] + links[0])

        fixFavoriteStarsAddition();
        addBenchmarkChecks();
    })

}

//remove brand favorite 
function removeFavorite(brandId){

    $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/setUserFavorites?u=' + wpid + '&b=' + brandId +'&a=delete&callback=?', function(data){
        console.log("successfully deleted");

        //remove brand from favorites array
        removeFavoriteFromArray(brandId)

        fixFavoriteStarsRemoval(brandId);

        removeBenchmarkChecks();
    })

}


function favoriteSource(source){

      switch (source){
        case 'm1_benchmarks':
          return { brandInstance : '.searched_name', brandCheck : '.toggle-searched-series-check', targetInstance : '.benchmark_search_result'}
        break;

        case 'm1_searched':
          return { brandInstance : '.benchmark_name', brandCheck : '.toggle-series-check', targetInstance : '.category_benchmark'}
        break;

        // case: 'm3_benchmarks':
        //   return { brandInstance : '.searched_name', brandCheck : 'toggle-searched-series-check', targetInstance : 'benchmark_search_result'}
        // break;

        // case: 'm3_searched':
        //   return { brandInstance : '.searched_name', brandCheck : 'toggle-searched-series-check', targetInstance : 'benchmark_search_result'}
        // break;
    }
}

 //toggle benchmark input greeting text
 $('#benchmark_search_input, #engagement_benchmark_search_input').focus(function(){
    $(this).val('')
 }).blur(function(){
    $(this).val('Search brands')
    $('.benchmark_search_result_li').remove();
    $('#benchmark_search_results_list').hide();
 }); 

function setDropdowns(ranking){

    var idToFind = String(ranking.categoryId);

    var drop = ['m1_category_benchmark_drop', 'category_benchmark_drop', 'engagement_category_benchmark_drop'];

    for (var i = 0; i < 3; i++){
      var dd = document.getElementById(drop[i]);

      for (var j = 0; j < dd.options.length; j++) {
          if (dd.options[j].value === idToFind) {
              dd.selectedIndex = j;
              break;
          }
      }
    };
}


function removeSearchedBenchmark(brandId, source){
  var selectorString = '.' + brandId
  $(source).find(selectorString).parent().prev().click(function(){

    $(source).find(selectorString).parent().parent().remove()
    

    if (source === '.benchmark_search_result'){
      removeSeries(brandId);
    } else{
      console.log("removing engagement brand")
      removeEngagementSeries(brandId)
    }
  })
}

 //get ith class of an html element 
 function getClass(classes, index){
    var split = classes.split(" ");
    return split[index];
 }

 // ****************** toggle service **************** //
 function toggleService(module, service, data){
    var currentState = service; 
    var toRemove = String('.current_state.' + module);
    var selectorString = String('.toggle.' + service + '.' + module)
    var dataType = undefined;

    $(toRemove).removeClass("current_state");
    $(selectorString).addClass("current_state");

    switch(module){
       case 'm1':

          switch(service){
             case 'facebook':

                toggleDataType(module, '"likes"', service, data);
             break;
             case 'twitter':  

                toggleDataType(module, 'followers', service, data)
             break;
             case 'youTube':

                toggleDataType(module, 'views', service, data)
          }
       break;

       case 'm2':

          while (likes.series.length > 0){
                likes.series[0].remove(true)
                likesPerDay.series[0].remove(true)
                growth.series[0].remove(true)
          }

          switch(service){
             case 'facebook':

                $('#m2_service_icon').children().remove();
                $('#m2_service_icon').append('<img src="/wp-content/themes/l2/images/intelligencePage/Facebook.png"/>');

                $('#top_five').html('Facebook');

                $('#top_five_perday_title p').html('30 DAYS')

                likes.addSeries({
                   stacking: 'normal',
                   data: [ data.likesTotal[1][0], data.likesTotal[1][1], data.likesTotal[1][2], data.likesTotal[1][3], data.likesTotal[1][4] ],
                   color: '#2F4984',
                   pointWidth: 17
                });

                likesPerDay.addSeries({
                   stacking: 'normal',
                   data: [ data.likesDayAvg[1][0], data.likesDayAvg[1][1], data.likesDayAvg[1][2], data.likesDayAvg[1][3], data.likesDayAvg[1][4] ], 
                   color: '#5A5D9B',
                   pointWidth: 17
                });

                growth.addSeries({
                   stacking: 'normal',
                   data: [ data.likesGrowth[1][0], data.likesGrowth[1][1], data.likesGrowth[1][2], data.likesGrowth[1][3], data.likesGrowth[1][4] ],
                   color: '#B5B6D8',
                   pointWidth: 17
                })

                likes.xAxis[0].setCategories([ data.likesTotal[0][0], data.likesTotal[0][1], data.likesTotal[0][2], data.likesTotal[0][3], data.likesTotal[0][4] ])
                likesPerDay.xAxis[0].setCategories([ data.likesDayAvg[0][0], data.likesDayAvg[0][1], data.likesDayAvg[0][2], data.likesDayAvg[0][3], data.likesDayAvg[0][4] ])
                growth.xAxis[0].setCategories([ data.likesGrowth[0][0], data.likesGrowth[0][1], data.likesGrowth[0][2], data.likesGrowth[0][3], data.likesGrowth[0][4] ])

                likes.setTitle({text: '"Likes"'});
                likesPerDay.setTitle({text: '"Likes"/Day'});
                growth.setTitle({text: 'Growth %'});

                fixM2DataOffset();

             break;
             case 'twitter':

                $('#m2_service_icon').children().remove();
                $('#m2_service_icon').append('<img src="/wp-content/themes/l2/images/intelligencePage/Twitter.png"/>')

                $('#top_five').html('Twitter');

                $('#top_five_perday_title p').html('30 DAYS')

                likes.addSeries({
                   stacking: 'normal',
                   data: [ data.followersTotal[1][0], data.followersTotal[1][1], data.followersTotal[1][2], data.followersTotal[1][3], data.followersTotal[1][4] ],
                   color: '#3793D0',
                   pointWidth: 17
                });

                likesPerDay.addSeries({
                   stacking: 'normal',
                   data: [ data.followersDayAvg30[1][0], data.followersDayAvg30[1][1], data.followersDayAvg30[1][2], data.followersDayAvg30[1][3], data.followersDayAvg30[1][4] ],
                   color: '#70A8DA',
                   pointWidth: 17
                });

                growth.addSeries({
                   stacking: 'normal',
                   data: [ data.followersGrowthPct30[1][0], data.followersGrowthPct30[1][1], data.followersGrowthPct30[1][2], data.followersGrowthPct30[1][3], data.followersGrowthPct30[1][4] ],
                   color: '#9EC0E5',
                   pointWidth: 17
                });

                likes.xAxis[0].setCategories([ data.followersTotal[0][0], data.followersTotal[0][1], data.followersTotal[0][2], data.followersTotal[0][3], data.followersTotal[0][4] ])
                likesPerDay.xAxis[0].setCategories([ data.followersDayAvg30[0][0], data.followersDayAvg30[0][1], data.followersDayAvg30[0][2], data.followersDayAvg30[0][3], data.followersDayAvg30[0][4] ])
                growth.xAxis[0].setCategories([ data.followersGrowthPct30[0][0], data.followersGrowthPct30[0][1], data.followersGrowthPct30[0][2], data.followersGrowthPct30[0][3], data.followersGrowthPct30[0][4] ])

                likes.setTitle({text: 'Followers'});
                likesPerDay.setTitle({text: 'Followers/Day'});
                growth.setTitle({text: 'Growth %'});

                fixM2DataOffset();

             break;
             case 'youTube':
                $('#m2_service_icon').children().remove();
                $('#m2_service_icon').append('<img src="/wp-content/themes/l2/images/intelligencePage/YouTube.png"/>');

                $('#top_five').html('You Tube');

                $('#top_five_perday_title p').html('PER DAY')

                likes.addSeries({
                   stacking: 'normal',
                   data: [ data.videosViewsTotal[1][0], data.videosViewsTotal[1][1], data.videosViewsTotal[1][2], data.videosViewsTotal[1][3], data.videosViewsTotal[1][4] ], 
                   color: '#D6005A',
                   pointWidth: 17
                });

                likesPerDay.addSeries({
                   stacking: 'normal',
                   data: [ data.uploadsTotal[1][0], data.uploadsTotal[1][1], data.uploadsTotal[1][2], data.uploadsTotal[1][3], data.uploadsTotal[1][4] ],
                   color: '#F1688B',
                   pointWidth: 17
                });

                growth.addSeries({
                   data: [ data.videosViewsGrowthPct[1][0], data.videosViewsGrowthPct[1][1], data.videosViewsGrowthPct[1][2], data.videosViewsGrowthPct[1][3], data.videosViewsGrowthPct[1][4] ],
                   color: '#F59AAB',
                   pointWidth: 17
                });

                likes.xAxis[0].setCategories([ data.videosViewsTotal[0][0], data.videosViewsTotal[0][1], data.videosViewsTotal[0][2], data.videosViewsTotal[0][3], data.videosViewsTotal[0][4] ])
                likesPerDay.xAxis[0].setCategories([ data.uploadsTotal[0][0], data.uploadsTotal[0][1], data.uploadsTotal[0][2], data.uploadsTotal[0][3], data.uploadsTotal[0][4] ])
                growth.xAxis[0].setCategories([ data.videosViewsGrowthPct[0][0], data.videosViewsGrowthPct[0][1], data.videosViewsGrowthPct[0][2], data.videosViewsGrowthPct[0][3], data.videosViewsGrowthPct[0][4] ])

                likes.setTitle({text: 'Views'});
                likesPerDay.setTitle({text: '# Videos'});
                growth.setTitle({text: 'Growth %'});

                fixM2DataOffset();

             break
          }
       break
    }
 }

   //**************** toggle data type *************//
   function toggleDataType(module, dataType, service, data){

        var seriesSize = lineChart.series.length;

         switch(service){
            case('facebook'):
               switch(dataType){
                  case '"likes"':

                    lineChart.setTitle({text: '"Likes"'});

                    for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                    $.each(data, function(key, value){
                       if(key === 0){
                        
                        value.likes.length === 0 && clickedBenchmarks.length === 1  ? noData() : null
                        
                        lineChart.addSeries({
                          name: value.name,
                          data: value.likes,
                          lineWidth: 4,
                          // color: '#2F4984'
                          color: '#3ea549'
                        });
                       } else{
                        lineChart.addSeries({
                            name: value.name,
                            data: value.likes,
                            color: colors[key]
                        });
                       }
                    }); 

                  break;
                  
                  case '"likes"/day':
                    lineChart.setTitle({text: '"Likes"/Day'});

                    for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                    $.each(data, function(key, value){
                       if(key === 0){

                        value.likesPerDay.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                        lineChart.addSeries({
                          name: value.name,
                          data: value.likesPerDay,
                          lineWidth: 4,
                          // color: '#2F4984'
                          color: '#3ea549'

                        });
                       } else{
                        lineChart.addSeries({
                            name: value.name,
                            data: value.likesPerDay,
                            color: colors[key]
                        });
                       }
                    }); 

                  break;

                  case 'engagement':
                    lineChart.setTitle({text: 'Engagement'});

                    for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                    $.each(data, function(key, value){
                       if(key === 0){

                        value.FBEngagement.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                        lineChart.addSeries({
                          name: value.name,
                          data: value.FBEngagement,
                          lineWidth: 4,
                          // color: '#2F4984'
                          color: '#3ea549'
                        });
                       } else{
                        lineChart.addSeries({
                            name: value.name,
                            data: value.FBEngagement,
                            color: colors[key]
                        });
                       }
                    }); 

                  break;
               }
               break;
            
               case('twitter'):

                  switch(dataType){
                     case 'followers':
                       lineChart.setTitle({text: "Followers"});

                      for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                      $.each(data, function(key, value){
                         if(key === 0){

                          value.followers.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.followers,
                              lineWidth: 4,
                              // color: '#5CAEDC'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.followers,
                                color: colors[key]
                            });
                          }
                        }); 

                     break;

                     case 'followers/day':
                       lineChart.setTitle({text: "Followers/Day"});

                      for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                      $.each(data, function(key, value){
                         if(key === 0){

                          value.followersPerDayAvg.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.followersPerDayAvg,
                              lineWidth: 4,
                              // color: '#5CAEDC'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.followersPerDayAvg,
                                color: colors[key]
                            });
                          }
                        }); 

                     break;

                     case 'tweets/day':
                       lineChart.setTitle({text: "Tweets/Day"});

                      for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }  
                      
                      $.each(data, function(key, value){
                         if(key === 0){

                          value.tweets.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.tweets,
                              lineWidth: 4,
                              // color: '#5CAEDC'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.tweets,
                                color: colors[key]
                            });
                          }
                        });  

                     break;
                  }
               break;

               case('youTube'):
                  switch(dataType){
                     case 'views':
                       lineChart.setTitle({text: "Views"});

                    for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      }

                      $.each(data, function(key, value){
                         if(key === 0){

                          value.views.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.views,
                              lineWidth: 4,
                              // color: '#D6005A'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.views,
                                color: colors[key]
                            });
                          }
                        }); 

                     break;

                     case '# videos':
                       lineChart.setTitle({text: "# Videos"});
                    
                      for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      } 
                    
                      $.each(data, function(key, value){
                         if(key === 0){

                          value.uploads.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.uploads,
                              lineWidth: 4,
                              // color: '#D6005A'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.uploads,
                                color: colors[key]
                            });
                          }
                        }); 

                     break;

                     case '30 day growth %':
                       lineChart.setTitle({text: "30 Day Growth %"});

                      for(var i = seriesSize - 1; i >= 0; i-- ){
                        lineChart.series[i].remove(true)
                      } 

                      $.each(data, function(key, value){
                         if(key === 0){

                          value.viewsGrowth.length === 0 && clickedBenchmarks.length === 1  ? noData() : null

                            lineChart.addSeries({
                              name: value.name,
                              data: value.viewsGrowth,
                              lineWidth: 4,
                              // color: '#D6005A'
                              color: '#3ea549'
                            });
                         } else{
                            lineChart.addSeries({
                                name: value.name,
                                data: value.viewsGrowth,
                                color: colors[key]
                            });
                          }
                        }); 
                                                  
                     break;
                  }

               break
         }
   }

function noData(){
  $('#primary_chart').append('<div id="no_data"><p>No Brand Data</p></div>')
}


String.prototype.lowerize = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}   


//WHAT IS THE DIFFERENCE BETWEEN THIS FUNCTION AND THE ONE BELOW?????
function getM1ChartState(){
  var service = getClass($('.active').attr('class'), 1),
  metric = lineChart.title.textStr.toLowerCase();

    var state = {
      "service" : service,
      "metric" : metric
    }

    return state
}

function getChartState(){
    var service = getClass($('.current_state').attr("class"), 1),
        metric = lineChart.title.textStr.toLowerCase();

    var state = {
      "service" : service,
      "metric" : metric
    }

    return state
}

function changeMetricBenchmarks(ranks, module){

  //create var for chartState
  if(module === 'm1'){

      var chartState = getM1ChartState();

      //fade out then remove current category benchmarks 
      $('.category_benchmark').fadeOut().queue(function(){
        $(this).remove();
        $(this).dequeue();
      })

      //get names of benchmarks for clicked metric 
      var newBenchmarks = displayCategoryBenchmarkBrands(chartState, ranks);

      //THIS SHOULD BE A TEMPLATE
      for(var i = 1; i <= 8; i++){
        var M1BenchmarkString = '<div class="category_benchmark"><div class="favorite-check-wrapper"><div class="favorite-icon-wrapper">'
        M1BenchmarkString += '<img class="favorite-icon icon" original-title="" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/></div>'
        M1BenchmarkString += '<input class="toggle-series-check ' + parseInt(newBenchmarks[4][i - 1].replace(/,/g , "")) + '" type="checkbox"/></div>'
        M1BenchmarkString += '<div class="rank">' + i + '. </div><div class="name-link-wrapper m1-nlw"><div class="benchmark_name"><a href="' + (newBenchmarks[2] + newBenchmarks[1][i - 1]) +'" Target="_blank">' + newBenchmarks[0][i - 1] + '</a></div></div></div>'

         $('#category_benchmark_results').append(M1BenchmarkString)
      
      };

      $('.category_benchmark').hide().fadeIn();

      //add highlighting to brands if they're a favorite 
      for (var j = 0; j < favorites.length; j++){
        for(var k = 0; k < $('.benchmark_name').length ; k++){
          if(String(favorites[j].brandId) === $('.benchmark_name').eq(k).attr('id')){
            $('.favorite-icon-wrapper').eq(k).children(0).remove();
            $('.favorite-icon-wrapper').eq(k).append('<img class="favorite-icon icon favorite" src="/wp-content/themes/l2/images/intelligencePage/clickedStar.png"/>');
          }
        }
      }

      toggleSeriesCheck();
      toggleBenchmarkFavorite();
      addBenchmarkChecks();
      fixFavoriteStarsAddition();

  } else if ( module === 'm3' ){

    $('.engagement_category_benchmark').fadeOut().queue(function(){
      $(this).remove();
      $(this).dequeue();
    })

    for(var i = 0; i <= 4; i++){
      
      if( typeof ranks[i] !== "undefined" ){

         var benchmarkString = '<div class="engagement_category_benchmark"><div class="engagement-favorite-check-wrapper"><div class="favorite-icon-wrapper">'
         benchmarkString += '<img class="favorite-icon icon" src="/wp-content/themes/l2/images/intelligencePage/emptyStar.png"/></div>'
         benchmarkString += '<input class="toggle-engagement-series-check ' + ranks[i].brandId + '" type="checkbox"/></div>'
         benchmarkString += '<div class="name-link-wrapper"><span class="engagement_benchmark_name">' + ( i  + 1 )+ '. <a href="http://www.facebook.com/' + ranks[i].facebookLink +'" Target="_blank">' + ranks[i].brandName + '</a></span></div></div>'

         $('#engagement_category_benchmark_results').append(benchmarkString);
      }
        
    }
    
    $('.engagement_category_benchmark').hide().fadeIn();
    // $('.engagement_category_benchmark').eq(0).css('margin-top', '10px') 
    
    // checkEngagementBenchmarks();

    toggleEngagementSeriesCheck();
    toggleEngagementBechmarkFavorite();


    counter > 1 ? addEngagementBenchmarkChecks() : null ;
    counter++;
    
  }
}

function displayCategoryBenchmarkBrands(chartState, rankingNames){  //RENAME THIS.  I DON'T KNOW WHAT IT MEANS

    switch(chartState["service"]){
      case 'facebook':
        switch(chartState["metric"]){
          case '"likes"':
            return [ rankingNames.likesTotal[0], rankingNames.likesTotal[2], 'http://www.facebook.com/', 'facebook.com/', rankingNames.likesTotal[3] ];
          break;
          case '"likes"/day':
            return [ rankingNames.likesDayAvg[0], rankingNames.likesDayAvg[2], 'http://www.facebook.com/', 'facebook.com/', rankingNames.likesDayAvg[3] ];
          break;
          case 'growth %':
            return [ rankingNames.likesGrowth[0], rankingNames.likesGrowth[2], 'http://www.facebook.com/', 'facebook.com/', rankingNames.likesGrowth[3] ]; 
          break;
          case 'engagement':
            return [ rankingNames.FBEngagement[0], rankingNames.FBEngagement[2], 'http://www.facebook.com/', 'facebook.com/', rankingNames.FBEngagement[3] ];
          break;
        }
      break

      case 'twitter':
        switch (chartState["metric"]){
          case 'followers':
            return [ rankingNames.followersTotal[0], rankingNames.followersTotal[2], 'http://www.twitter.com/', 'twitter.com/', rankingNames.followersTotal[3]]; 
          break;
          case 'followers/day':
            return [ rankingNames.followersDayAvg30[0], rankingNames.followersDayAvg30[2], 'http://www.twitter.com/', 'twitter.com/', rankingNames.followersDayAvg30[3] ];
          break;
          case 'growth %':
            return [ rankingNames.followersGrowthPct30[0], rankingNames.followersGrowthPct30[2], 'http://www.twitter.com/', 'twitter.com/', rankingNames.followersGrowthPct30[3] ];
          break;
          case 'tweets/day':
            return [ rankingNames.tweetsDayAvg[0], rankingNames.tweetsDayAvg[2], 'http://www.twitter.com/', 'twitter.com/', rankingNames.tweetsDayAvg[3] ];
          break;
        }
      break

      case 'youTube':
        switch(chartState["metric"]){
          case 'views':
            return [ rankingNames.videosViewsTotal[0], rankingNames.videosViewsTotal[2] , 'http://www.youtube.com/', 'youtube.com/', rankingNames.videosViewsTotal[3] ];
          break;
          case '# videos':
            return [ rankingNames.uploadsTotal[0], rankingNames.uploadsTotal[2], 'http://www.youtube.com/', 'youtube.com/', rankingNames.uploadsTotal[3] ];
          break;
          case '30 day growth %':
            return [ rankingNames.videosViewsGrowthPct[0], rankingNames.videosViewsGrowthPct[2], 'http://www.youtube.com/', 'youtube.com/', rankingNames.videosViewsGrowthPct[3] ];
          break;
        }
      break;
    }
}


function returnLink(brand, service){
    switch(service){
      case 'facebook':
        return [ brand.links.facebook, 'http://www.facebook.com/', 'facebook.com/' ];
      break
      case 'twitter':
        return [ brand.links.twitter, 'http://www.twitter.com/', 'twitter.com/' ];
      break
      case 'youTube':
        return [ brand.links.youtube, 'http://www.youtube.com/', 'youtube.com/' ];
      break;
    }
}

function returnSearchedLink(links, service){
    switch(service){
      case 'facebook':
        return [ links.facebook, 'http://www.facebook.com/', 'facebook.com/' ];
      break
      case 'twitter':
        return [ links.twitter, 'http://www.twitter.com/', 'twitter.com/' ];
      break
      case 'youTube':
        return [ links.youtube, 'http://www.youtube.com/', 'youtube.com/' ];
      break;
    }
}

function returnFavoriteLink(brand, service){
    switch(service){
      case 'facebook':
        return [ brand.facebooklink, 'http://www.facebook.com/', 'facebook.com/' ];
      break
      case 'twitter':
        return [ brand.twitterlink, 'http://www.twitter.com/', 'twitter.com/' ];
      break
      case 'youTube':
        return [ brand.youtubelink, 'http://www.youtube.com/', 'youtube.com/' ];
      break;
    }
}


function changeEngagementCategoryDrop(catId){

  $('#engagement_category_benchmark_drop, #community_size_drop').change(function(){

    var category = $('#engagement_category_benchmark_drop').val(),
        communityId = $('#community_size_drop option:selected').val(),
        community = communitySizes[communityId];

      $.getJSON('http://l2-data.com/ajax/scraperDataWS.svc/getTop10EngagementBrandDataBySize?u=' + wpid + '&categoryId=' + category + '&likesMin=' + community[0] + '&likesMax=' + community[1] + '&callback=?' , function(data){

        changeMetricBenchmarks(data, 'm3');

    })
  })
}

function create30DayBrandDataObject(data){

    // console.log("returned data:", data)

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
              date = Date.UTC(year, month ,day);

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

      // console.log("processed brand", brand)
      return brand;

}

function createCategoryTop10DataObject(data) {

        var FBEngagementName = [],
            followersTotalName = [],
            followersDayAvg30Name = [],
            followersGrowthPct30Name = [],
            likesDayAvg30Name = [],
            likesGrowthPct30Name = [],
            likesTotalName = [],
            subscribersTotalName = [],
            tweetsDayAvg30Name = [],
            uploadsTotalName = [],
            videosViewsGrowthPct30Name = [],
            videosViewsTotalName = [],
            FBEngagementNum = [],
            followersTotalNum = [],
            followersDayAvg30Num = [],
            followersGrowthPct30Num = [],
            likesDayAvg30Num = [],
            likesGrowthPct30Num = [],
            likesTotalNum = [],
            subscribersTotalNum = [],
            tweetsDayAvg30Num = [],
            uploadsTotalNum = [],
            videosViewsGrowthPct30Num = [],
            videosViewsTotalNum = [],
            FBEngagementLink = [],
            followersTotalLink = [],
            followersDayAvg30Link = [],
            followersGrowthPct30Link = [],
            likesDayAvg30Link = [],
            likesGrowthPct30Link = [],
            likesTotalLink = [],
            subscribersTotalLink = [],
            tweetsDayAvg30Link = [],
            uploadsTotalLink = [],
            videosViewsGrowthPct30Link = [],
            videosViewsTotalLink = [],
            FBEngagementId = [],
            followersDayAvg30Id = [],
            followersGrowthPct30Id = [],
            followersTotalId = [],
            likesDayAvgId = [],
            likesGrowthPct30Id = [],
            likesTotalId = [],
            subscribersTotalId = [],
            tweetsDayAvgId = [],
            uploadsTotalId = [],
            videosViewsGrowthPct30Id = [],
            videosViewsTotalId = [];

      $.each(data, function(key, value){
         if(value.column === 5) {
            FBEngagementName.push(value.FBEngagement);
            followersTotalName.push(value.followersTotal);
            followersDayAvg30Name.push(value.followersDayAvg30);
            followersGrowthPct30Name.push(value.followersGrowthPct30);
            likesDayAvg30Name.push(value.likesDayAvg30);
            likesGrowthPct30Name.push(value.likesGrowthPct30);
            likesTotalName.push(value.likesTotal);
            subscribersTotalName.push(value.subscribersTotal);
            tweetsDayAvg30Name.push(value.tweetsDayAvg30);
            uploadsTotalName.push(value.uploadsTotal);
            videosViewsGrowthPct30Name.push(value.videosViewsGrowthPct30);
            videosViewsTotalName.push(value.videosViewsTotal);
         }

         else if(value.column === 6){
            FBEngagementNum.push(parseFloat(value.FBEngagement));
            followersTotalNum.push(parseInt(value.followersTotal.replace(/,/g , "")));
            followersDayAvg30Num.push(parseInt(value.followersDayAvg30.replace(/,/g , "")));
            followersGrowthPct30Num.push(parseFloat(value.followersGrowthPct30));
            likesDayAvg30Num.push(parseInt(value.likesDayAvg30.replace(/,/g , "")));
            likesGrowthPct30Num.push(parseFloat(value.likesGrowthPct30));
            likesTotalNum.push(parseInt(value.likesTotal.replace(/,/g , "")));
            subscribersTotalNum.push(parseInt(value.subscribersTotal.replace(/,/g , "")));
            tweetsDayAvg30Num.push(parseInt(value.tweetsDayAvg30.replace(/,/g , "")));
            uploadsTotalNum.push(parseInt(value.uploadsTotal.replace(/,/g , "")));
            videosViewsGrowthPct30Num.push(parseFloat(value.videosViewsGrowthPct30));
            videosViewsTotalNum.push(parseInt(value.videosViewsTotal.replace(/,/g , "")));
         }

        else if(value.column === 7){
            FBEngagementLink.push(value.FBEngagement);
            followersTotalLink.push(value.followersTotal);
            followersDayAvg30Link.push(value.followersDayAvg30);
            followersGrowthPct30Link.push(value.followersGrowthPct30)
            likesDayAvg30Link.push(value.likesDayAvg30);
            likesGrowthPct30Link.push(value.likesGrowthPct30);
            likesTotalLink.push(value.likesTotal);
            subscribersTotalLink.push(value.subscribersTotal);
            tweetsDayAvg30Link.push(value.tweetsDayAvg30);
            uploadsTotalLink.push(value.uploadsTotal);
            videosViewsGrowthPct30Link.push(value.videosViewsGrowthPct30);
            videosViewsTotalLink.push(value.videosViewsTotal);
        }

        else if(value.column === 8){
            FBEngagementId.push(value.FBEngagement);
            followersDayAvg30Id.push(value.followersDayAvg30);
            followersGrowthPct30Id.push(value.followersGrowthPct30);
            followersTotalId.push(value.followersTotal);
            likesDayAvgId.push(value.likesDayAvg30);
            likesGrowthPct30Id.push(value.likesGrowthPct30);
            likesTotalId.push(value.likesTotal);
            subscribersTotalId.push(value.subscribersTotal);
            tweetsDayAvgId.push(value.tweetsDayAvg30);
            uploadsTotalId.push(value.uploadsTotal);
            videosViewsGrowthPct30Id.push(value.videosViewsGrowthPct30);
            videosViewsTotalId.push(value.videosViewsTotal);
        }

      });

      ranking = {
          categoryId: data[0].categoryId,
          categoryName: data[0].categoryName,
          FBEngagement : [ FBEngagementName, FBEngagementNum, FBEngagementLink, FBEngagementId ],
          likesTotal: [ likesTotalName, likesTotalNum, likesTotalLink, likesTotalId ],
          likesDayAvg: [ likesDayAvg30Name, likesDayAvg30Num, likesDayAvg30Link, likesDayAvgId ],
          likesGrowth : [ likesGrowthPct30Name , likesGrowthPct30Num , likesGrowthPct30Link, likesGrowthPct30Id ],
          subscribersTotal: [ subscribersTotalName, subscribersTotalNum, subscribersTotalLink, subscribersTotalId ],
          followersTotal: [ followersTotalName, followersTotalNum, followersTotalLink, followersTotalId ], 
          followersDayAvg30: [ followersDayAvg30Name, followersDayAvg30Num, followersDayAvg30Link, followersDayAvg30Id ],
          followersGrowthPct30: [ followersGrowthPct30Name, followersGrowthPct30Num, followersGrowthPct30Link, followersGrowthPct30Id ],
          tweetsDayAvg: [ tweetsDayAvg30Name, tweetsDayAvg30Num, tweetsDayAvg30Link, tweetsDayAvgId ],
          uploadsTotal: [ uploadsTotalName, uploadsTotalNum, uploadsTotalLink, uploadsTotalId ],
          videosViewsGrowthPct: [ videosViewsGrowthPct30Name, videosViewsGrowthPct30Num, videosViewsTotalLink, videosViewsTotalId ],
          videosViewsTotal: [ videosViewsTotalName, videosViewsTotalNum, videosViewsTotalLink, videosViewsTotalId ]
      }

      return ranking;
}


function createTop10NameDataObject(data){

    var followersTotalName = [],
        followersDayAvg30Name = [],
        followersGrowthPct30Name = [],
        likesDayAvg30Name = [],
        likesGrowthPct30Name = [],
        likesTotalName = [],
        subscribersTotalName = [],
        engagementName = [],
        tweetsDayAvg30Name = [],
        uploadsTotalName = [],
        videosViewsGrowthPct30Name = [],
        videosViewsTotalName = [];

    $.each(data, function(key, value){
       if(value.column === 5) {
          followersTotalName.push(value.followersTotal);
          followersDayAvg30Name.push(value.followersDayAvg30)
          followersGrowthPct30Name.push(value.followersGrowthPct30)
          likesDayAvg30Name.push(value.likesDayAvg30);
          likesGrowthPct30Name.push(value.likesGrowthPct30);
          likesTotalName.push(value.likesTotal);
          subscribersTotalName.push(value.subscribersTotal);
          engagementName.push(value.FBEngagement);
          tweetsDayAvg30Name.push(value.tweetsDayAvg30);
          uploadsTotalName.push(value.uploadsTotal);
          videosViewsGrowthPct30Name.push(value.videosViewsGrowthPct30);
          videosViewsTotalName.push(value.videosViewsTotal);
       }

    });

    rankingNames = {
        categoryId: data[0].categoryId,
        categoryName: data[0].categoryName,
        likesTotal: likesTotalName,
        likesDayAvg: likesDayAvg30Name,
        likesGrowth: likesGrowthPct30Name, 
        subscribersTotal: subscribersTotalName,
        followersTotal: followersTotalName, 
        followersDayAvg30: followersDayAvg30Name,
        followersGrowthPct30: followersGrowthPct30Name,
        engagement: engagementName,
        tweetsDayAvg: tweetsDayAvg30Name,
        uploadsTotal: uploadsTotalName,
        videosViewsGrowthPct: videosViewsGrowthPct30Name,
        videosViewsTotal: videosViewsTotalName
    }

    return rankingNames;
}

function createEngagementChartDataObject(data){
        var engagement = [],
          likes = [],
          likesGrowth = [],
          name = [];

      $.each(data, function(key, value){
        name.push(value.brandName);
        engagement.push(parseFloat(value.FBEngagement.replace(/,/g, '')));
        likesGrowth.push(parseFloat(value.likesGrowthPct30.replace(/,/g, '')));
        likes.push(parseFloat(value.likesTotal.replace(/,/g, '')));
      })

      var engagementData = {
        name: name,
        engagement: engagement,
        likesGrowth: likesGrowth,
        likes: likes
      }

      return engagementData; 
}

function returnEngagementCommunityCategory(communitySize){

    if (communitySize > 0 && communitySize < 100000){
      return 0      
    }

    else if ( communitySize > 100000 && communitySize < 500000){
      return 1
    }

    else if (communitySize > 500000 && communitySize < 1000000){
      return 2
    }

    else if ( communitySize > 1000000){
      return 3
    }

}

function switchServiceAndMetric(chartStateService, chartStateDataType, brand){

      //add data to chart depending on currently displayed service and metric 
      switch(chartStateService){
        case 'facebook':
          switch(chartStateDataType){
            case '"likes"':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.likes,
                 color: colors[clickedBenchmarks.length]
              });
            break;
            case '"likes"/day':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.likesPerDay,
                 color: colors[clickedBenchmarks.length]
              });

            break;
            case 'engagement':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.FBEngagement,
                 color: colors[clickedBenchmarks.length]
              });
            break;
          }
        break

        case 'twitter':
          switch (chartStateDataType){
            case 'followers':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.followers,
                 color: colors[clickedBenchmarks.length]
              });
            break;
            case 'followers/day':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.followersPerDay,
                 color: colors[clickedBenchmarks.length]
              });
            break;
            case 'tweets/day':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.tweets,
                 color: colors[clickedBenchmarks.length]
              });
            break;
          }
        break

        case 'youTube':
          switch(chartStateDataType){
            case 'views':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.views,
                 color: colors[clickedBenchmarks.length]
              });
            break;
            case '# videos':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.uploads,
                 color: colors[clickedBenchmarks.length]
              });
            break;
            case '30 day growth %':
              lineChart.addSeries({
                 name: brand.name,
                 data: brand.viewsGrowth,
                 color: colors[clickedBenchmarks.length]
              });
            break;
          }
        break;
      }
      
  }

var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();



/****************************************************************/
/***************************** CRAP *****************************/
/****************************************************************/

//THIS MAY BE A VESTIGIAL FUNCTION!!!!!!!!!
function toggleHiddenSeries(brandName){
  var names = []

  $.each(clickedBenchmarks, function(index){
    names.push(clickedBenchmarks[index].name);
  })
  //if brandId is in clickedBenchmarks, remove from clicked benchmarks and add to removed benchmarks
  
  var brandIndex = $.inArray(brandName, names)

  if (brandIndex !== Number(-1)){
      //push clicked object to removed brands aray
      hiddenBrands.push(clickedBenchmarks[brandIndex])

  } else{
    var removedNames = []

    $.each(removedBrands, function(index){
      removedNames.push(removedBrands[index].name);
    })  

      var removedIndex = $.inArray(brandName, removedNames);

      hiddenBrands.remove(removedIndex);

  }
}










});
