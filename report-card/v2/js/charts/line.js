var config = {
     chart: {
        renderTo: 'timeseries_chart_container',
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
          dateTimeLabelFormats: { // don't display the dummy year
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
      // buttons : {
      //   enabled : true
      // }
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
                        
              if(clickedBenchmarks.length > 1){

                removeChartSeries(this.name)
              } 
              return false; // <== returning false will cancel the default action
          }
        }
      }
  }
 }