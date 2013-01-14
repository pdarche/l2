
var SpiderView = {

  renderView : function(){

    var source = $('#spider_view').html() 
    var template = Handlebars.compile( source )
    $('#module_container').html( template )

    SpiderView.initBrands( "Kate Spade" )

  },

  renderBrandList : function() {

    // console.log( fullRanking )

    var source = $('#benchmark_list_partial').html() 
    var template = Handlebars.compile( source )
    $('#b_brand_list').html( template( fullRanking ) )

  },

  renderChart : function( data, categories ){

    loadViz( data, categories )

  },

  initBrands: function ( brandName ) {

    var initData = SpiderView.getData( brandName )

    var source = $('#spider_brand_list').html()  
    var template = Handlebars.compile( source )
    $('#brand_list').html( template( initData ) )

    $('.series').hide()

    var initCategories = [ "social_media", "site", "digital_marketing", "mobile" ]

    SpiderView.renderChart( initData, initCategories )

  },

  getData: function( brandName ){


    var brandIndex = undefined,
        len = fullRanking.data.length

    for ( index in fullRanking.data ) {

        fullRanking.data[index].brand === brandName ? brandIndex = index : null

    }

    return { "data" : [ fullRanking.data[brandIndex], fullRanking.data[len-1] ] }

  }

}


var SpiderEvents = {
  
    brandNames: brandNames,

    expandBrand: function(){
      
      $('.brand-control').click(function(){        
        var index = $(this).index(),
            currBrand = $(this)        
        
        $(this).css('height', '100px')
        
        $.each(series, function(i){
          currBrand.find('.brand-info').append('<div class="brand-datum">' + dimensions[i] + ': ' + series[i][index] + '</div>')
        })

        $(this).find('.brand-info').delay(400).fadeIn()
          
      })

    },

    initBrands: function(){
      
      $('.series').hide()
      
      $('.series').eq(6).show()
      $('.brand-name').eq(6).find("input").attr("checked", true)
      brand = d3.selectAll('.series').filter(function(d,i){ return i == 6}).classed('shown', true)
      Controls.addRow(series[6], brandNames[6])
      // $('.brand-name').eq(6).parent().css('border-bottom', '2px solid ' + colors[6])
      $('.brand-name').eq(6).css('color', colors[6])

      $('.series').eq(0).show()
      $('.brand-name').eq(0).find("input").attr("checked", true)
      brand = d3.selectAll('.series').filter(function(d,i){ return i == 0}).classed('shown', true)
      Controls.addRow(series[0], brandNames[0])
      // $('.brand-name').eq(0).parent().css('border-bottom', '2px solid ' + colors[0])
      $('.brand-name').eq(0).css('color', colors[0])

    },

    toggleBrand: function(){

      $('.brand-name').find("input").click(function(){
        
        var index = $(this).parent().parent().index(),
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

          var data = SpiderView.getData("Kate Spade")

          series = []
          brandNames = []
          subcategories = []

          SpiderEvents.loadData( data, categories )

          // loadViz( data, categories )
          addAxes()
          draw()

      })

    },

    toggleBenchmarkContainer : function(){

      $('#benchmark_brand_list_container').click(function(){

        if ( $('.benchmark_brand_list').hasClass('expanded') ) {

          $('#b_brand_list').delay(50).hide()
          $('.benchmark_brand_list').removeClass('expanded')

        } else {

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