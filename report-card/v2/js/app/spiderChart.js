
var SpiderView = {

  renderView : function(){

    var source = $('#spider_view').html() 
    var template = Handlebars.compile( source )
    $('#module_container').html( template )

  },

  renderChart : function(){

    loadViz()

  }

}


var Controls = {
  
    brandNames: brandNames,

    populateBrands: function(){

      $.each(this.brandNames, function(i){
        
        var brandTemplate = '<li class="brand-control"><div class="brand-name"> <input type="checkbox"/>' + ' ' + (i + 1) + '. ' +  brandNames[i] + '</div>'
            brandTemplate = brandTemplate + '<div class="brand-info"></div></li>'
        
        $('#brand_toggle').append(brandTemplate)

      })

      $('.series').hide()

    },
    highlightBrand: function(){
      
      var ind = undefined

      $('.brand-control').hover(function(){
        
        var index = $(this).index()
        ind = index

        $('.series').eq(index).find('path').css('stroke-width', '8px')
        $('.series').not($('.series').eq(index)).find('path').css('opacity', '.4')
        $('.series').eq(ind).find('.label').show()

      }, function() {

        $('.series').eq(ind).find('path').css('stroke-width', '3px')
        $('.series').find('path').css('opacity', '1')
        $('.series').eq(ind).find('.label').hide()
      
      })

    },
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

    }
}