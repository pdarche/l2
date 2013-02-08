var likesConfig = {
     chart: {
        renderTo: 'top_ten_all_time_chart_container',
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
            y: 15,
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
              y: -15,
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
  }

var likesPerDayConfig = {
     chart: {
        renderTo: 'top_ten_perday_chart_container',
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
            y: 15,
            style: {
                'width' : '300px'
            }
        },
        tickWidth: 0,
        lineWidth: 0
     },
     exporting : {
      enabled : false,
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
              y: -15,
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
  }

var growthConfig = {
     chart: {
        renderTo: 'top_ten_growth_chart_container',
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
            y: 15,
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
              y: -15,
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
  }
