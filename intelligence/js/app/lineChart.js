
var chartConfig = {
     chart: {
        renderTo: 'visualization',
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
          type: 'datetime',
          dateTimeLabelFormats: { 
              month: '%b %e',
              year: '%b'
          },
          labels: {
              rotation: -45,
              align: 'right'
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
                enabled: false,
            },
            shadow: false,

      },
      line: {
          events: {
            legendItemClick: function () {
            toggleHiddenSeries(this.name)                  
              if(clickedBenchmarks.length > 1){

                removeChartSeries(this.name)
              } 
              return false; // <== returning false will cancel the default action
          }
        }
      }
  }
 };

