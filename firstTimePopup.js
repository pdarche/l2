var Popup = {
    
    defaultSet: false,
    
    brandListReturned: false,
    
    renderBase : function (el){

      var template = '<div id="new_user_popup">'
          template += '<h1>Welcome to the L2 Intelligence Page</h1>'
          template += "<h2>Please select the brand you'd like associated with your account</h2>"
          template += '<input id="set_default" type="text" placeholder="fetching brands... please wait">'
          template += "<h2>Please also select any favorite brands you'd like to use for benchmarking</h2>"
          template += '<input id="add_favorites" type="text" placeholder="fetching brands... please wait">'
          template += '</div>' 
        
          $(el).append(template)
    },
    //events
    bindEvents : function(){
        
        //disable input fields until brands are returned
        $('#set_default, #add_favorites').prop( "disabled", true )
        
        //fetch brand list 
        Popup.fetch( "ref", getAllBrandsForCategories, Popup.bindAutocompletes, this )
        
    },
    //data retrieval
    fetch : function( db, queryObject, callback, context ){
        
          //build query
          var baseURL = "http://l2ws-dev.elasticbeanstalk.com/",
              db = db + "?format=json&q=",
              queryString = JSON.stringify( queryObject ),
              query = encodeURI( baseURL + db + queryString )
              
          //make request
          if ( method === "GET" ){
              $.getJSON( query, $.proxy(function( data ){
                  console.log('gots the brand list')
                  callback( data )
              }, context))
          }

    },
    //callbacks
    bindAutocompletes : function( data ){
        var brandList = []
        
        $.each(data.brands, function(i){
            var brandName = data.brands[i].brandfamily_name,
                brandGeo = data.brands[i].geography_name,
                brandElement = String( brandName + ' - ' + brandGeo ),
                brandId = data.brands[i].brand_id,
                brandObject = { label : brandElement, value : brandId }
               
            brandList.push( brandObject )
        })
        
        $('#set_default').autocomplete({ 
            source : brandList,
            select : function(evet, ui){
                $('#set_default').val( ui.item.label )
                // Popup.fetch()
                Popup.defaultSet = true                
            }
        })
        $('#add_favorites').autocomplete({ source : brandList })
        
        //to do: remove impediment to setting defalut
        $('#set_default').attr("placeholder", "type to select brand")
        $('#add_favorites').attr("placeholder", "add favorite brand")
        $('#set_default, #add_favorites').prop("disabled", false)
    
    },
    setDefault : function(){
    
    } 
}



// QUERIES
var getAllBrandsForCategory = {
  "brands" : { "category_id" : "14" }
}

var getAllBrandsForCategories = {
  "brands" : [ { "category_id" : "3" }, { "category_id" : "4" }, { "category_id" : "12" },
               { "category_id" : "13" }, { "category_id" : "15" }, { "category_id" : "17" },
               { "category_id" : "18" }
             ]
}

var getUserFavorites = {
  "user" : "peterd@l2thinktank.com"
}

var oneMonthSingleBrandSingleMetricTimeConstraint = {
  "brands" : [ { "brand_id" : "74" } ],
  "brand_daily" : {
        "metrics" : [
            "facebook_likes_count_total"
        ],
        "constraints" : {
            "time" : { "start" : 20120912 , "end" : 20121012 }
        }
    }
}

//IMMA FIRIN MAH LAZER
$( document ).ready( function(){
    
    Popup.renderBase('#wrapper')
    Popup.bindEvents()
    
    console.log(Popup)
  
})