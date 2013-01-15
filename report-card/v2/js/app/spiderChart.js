
var SpiderView = {

  renderView : function(){

    var source = $('#spider_view').html() 
    var template = Handlebars.compile( source )
    $('#module_container').html( template )

    SpiderView.initBrands( "Kate Spade" )

  },

  renderBrandList : function() {

    var source = $('#benchmark_list_partial').html() 
    var template = Handlebars.compile( source )
    $('#b_brand_list').html( template( fullRanking ) )

    $('.brand-name').eq(0).css('color', colors[0])
    $('.brand-name').eq(1).css('color', colors[1])

  },

  renderChart : function( data, categories ){

    loadViz( data, categories )

  },

  initBrands: function ( brandName ) {

    var initData = SpiderView.getData( [brandName, "Average"] )

    var source = $('#spider_brand_list').html()  
    var template = Handlebars.compile( source )
    $('#brand_list').html( template( initData ) )

    $('.series').hide()

    var initCategories = [ "social_media", "site", "digital_marketing", "mobile" ]

    SpiderView.renderChart( initData, initCategories )

  },

  getData: function( brandNames ){

    var brandIndex = undefined,
        len = fullRanking.data.length,
        brands = []

    for (brandName in brandNames ){

        for ( index in fullRanking.data ) {

            fullRanking.data[index].brand === brandNames[brandName] ? brands.push( fullRanking.data[index] ) : null

        }

    }

    $.inArray("Average", brandNames ) ? null : brands.push( fullRanking.data[len-1] )

    return { "data" : brands }

  }

}


var SpiderEvents = {
  
    brandNames: brandNames,

    addBrand: function(){

      if ( $('.brand-name').length < 3 ){  

          $('.brand-list-li').click(function(){

            var index = $(this).index(),
                data = { "data" : [ fullRanking.data[index] ] }

            var source = $('#spider_brand_list').html()  
            var template = Handlebars.compile( source )
            $('#brand_list').append( template( data ) )
            
            $('#benchmark_brand_list_container p').html('+ Add Brand Benchmark')
            $('#b_brand_list').delay(50).hide()
            $('.benchmark_brand_list').removeClass('expanded')


            var brandList = [ $('.brand-name').eq(0).html(), "Average", $('.brand-name').eq(2).html() ]

            var chartData = SpiderView.getData( brandList )

            var categories = [ "social_media", "site", "digital_marketing", "mobile" ] 

            series = []
            brandNames = []
            subcategories = []

            SpiderEvents.loadData( chartData, categories )

            addAxes()
            draw()

            $('.brand-name').eq(2).css('color', colors[2])

            SpiderEvents.toggleBrand()

          })
      }

    },

    toggleBrand: function(){

      $('.brand-name').unbind()

      $('.brand-name').click(function(){
        
        var index = $(this).parent().index(),
            brand = d3.selectAll('.series').filter(function(d,i){ return i == index})

        if ( brand.classed('shown') ) {

          brand.style('display', 'none')
          brand.classed('shown', false)
          Controls.removeRow(brandNames[index])

          // $('.brand-name').eq(index).parent().css('border-bottom', '0px solid ' + colors[index])
          $('.brand-name').eq(index).css('color', 'black')

        } else {
          
          brand.style('display', 'block')
          brand.classed('shown', true)
          Controls.addRow(series[index], brandNames[index])
          // $('.brand-name').eq(index).parent().css('border-bottom', '2px solid ' + colors[index])
          $('.brand-name').eq(index).css('color', colors[index])
          
        }

      })
        
    },

    addRow: function(brand, name){

      var newRow = '<tr><td>' + name + '</td><td>' + brand[0]  + '</td><td>' 
          newRow +=  brand[1]  + '</td><td>' + brand[2] + '</td>'
          newRow += '<td>' + brand[3] + '</td><td>' + brand[4] + '</td><td>' + brand[5] + '</td></tr>'

      $('#german_chart tbody').append(newRow)

      $('.benchmark_brand_list').removeClass('expanded')

    },

    removeRow: function(name){

      $.each($('#german_chart tr'), function(i){
          var targetName = $(this).find('td').eq(0).html()
          if ( name === targetName) {

              $('#german_chart tr').eq(i).remove()

          }
      })

    },

    changeCategories: function(){

      $('.category').click(function(){

          var boxes = $('.category').find('input[type=checkbox]'),
              categories = []

          $.each(boxes, function( i, obj ){
            
            var id = $( obj ).parent().attr('id')

            $(obj).attr('checked') ? categories.push(id) : console.log( "not checked" ) 
          
          })

          // $('#chart_container').children().remove()

          var brandList = [ $('.brand-name').eq(0).html(), "Average", $('.brand-name').eq(2).html() ]

          var data = SpiderView.getData( brandList )

          series = []
          brandNames = []
          subcategories = []

          SpiderEvents.loadData( data, categories )

          addAxes()
          draw()

          // SpiderEvents.toggleBrand()

      })

    },

    toggleBenchmarkContainer : function(){

      $('#benchmark_brand_list_container p').click(function(){

        if ( $('.benchmark_brand_list').hasClass('expanded') ) {

          $(this).html('+ Add Brand Benchmark')
          $('#b_brand_list').delay(50).hide()
          $('.benchmark_brand_list').removeClass('expanded')

        } else {

          $(this).html('- Add Brand Benchmark')
          $('.benchmark_brand_list').addClass('expanded')
          $('#b_brand_list').delay(150).fadeIn()

        } 
        

      })

    },

    loadData : function( data, categories ) {

      var objCount = 0

      data.data.forEach(function(obj){
        var brandName = obj.brand,
            brandData = []            

        brandNames.push( brandName )

        categories.forEach(function(key){
          var subCatObj = obj[key]          
            
          for (key in subCatObj){
            brandData.push( Number(subCatObj[key]) ) 
            objCount < 1 ? subcategories.push( key ) : null
          }
        
        })

        series.push( brandData )
        objCount++
      
      })

      //to complete the radial lines
      for (var m = 0; m < series.length; m++) {
          series[m].push(series[m][0]);
      }

  }
}