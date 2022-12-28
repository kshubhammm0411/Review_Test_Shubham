var impressionsData;
var impressionsOptions;
var share_report_link = "";

(function($) {
  'use strict';
  $(function() {
    if ($('#circleProgress6').length) {
      var bar = new ProgressBar.Circle(circleProgress6, {
        color: '#001737',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 10,
        trailWidth: 10,
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 10
        },
        to: {
          color: '#2617c9',
          width: 10
        },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
  
          var value = '<p class="text-center mb-0">Score</p>' + Math.round(circle.value() * 100) + "%";
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(value);
          }
  
        }
      });
  
      bar.text.style.fontSize = '1.875rem';
      bar.text.style.fontWeight = '700';
      bar.animate(.75); // Number from 0.0 to 1.0
    }
    if ($('#circleProgress7').length) {
      var bar = new ProgressBar.Circle(circleProgress7, {
        color: '#9c9fa6',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 10,
        trailWidth: 10,
        easing: 'easeInOut',
        trailColor: '#1f2130',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 10
        },
        to: {
          color: '#2617c9',
          width: 10
        },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
  
          var value = '<p class="text-center mb-0">Score</p>' + Math.round(circle.value() * 100) + "%";
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(value);
          }
  
        }
      });
  
      bar.text.style.fontSize = '1.875rem';
      bar.text.style.fontWeight = '700';
      bar.animate(.75); // Number from 0.0 to 1.0
    }

  var eventData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
            label: 'Critical',
            data: [20, 35, 15, 45, 35, 40, 25, 44, 20, 30, 38, 15],
            backgroundColor: [
              'rgba(	255, 131, 0)'
            ],
            borderColor: [
                'rgba(	255, 131, 0)'
            ],
            backgroundColor: [
              'rgba(	255, 131, 0,.1)',
            ],
            borderWidth: 1,
            fill: true,
        },
        {
            label: 'Error',
            data: [30, 45, 25, 55, 45, 30, 35, 54, 30, 20, 48, 25],
            borderColor: [
                'rgba(242, 18, 38)',
            ],
            backgroundColor: [
              'rgba(242, 18, 38,.1)',
            ],
            borderWidth: 1,
            fill: true,
        },
        {
            label: 'Warning',
            data: [40, 55, 35, 65, 55, 40, 45, 64, 40, 30, 58, 35],
            borderColor: [
                'rgba(23, 23, 201)',
            ],
            backgroundColor: [
                'rgba(23, 23, 201,.1)',
            ],
            borderWidth: 1,
            fill: true,
        }
    ],
  };
  var eventOptions = {
      scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false,
              position: 'bottom',
              gridLines: {
                drawBorder: false,
                display: true,
              },
              ticks: {
                display: false,
                beginAtZero: true,
                stepSize: 10
              }
          }],

      },
      legend: {
          display: false,
          labels: {
            boxWidth: 0,
          }
      },
      elements: {
          point: {
              radius: 0
          },
          line: {
            tension: .1,
          },
      },
      tooltips: {
          backgroundColor: 'rgba(2, 171, 254, 1)',
      }
  };
  
  if ($("#eventChart").length) {
    var lineChartCanvas = $("#eventChart").get(0).getContext("2d");
    var saleschart = new Chart(lineChartCanvas, {
        type: 'line',
        data: eventData,
        options: eventOptions
    });
  }

  var salesanalyticData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [{
            label: 'Impression',
            data: [24, 23, 22, 24, 26, 23, 28],
            borderColor: [
                '#3022cb'
            ],
            borderWidth: 3,
            fill: false,
        }
    ],
  };
  var salesanalyticOptions = {
      scales: {
          yAxes: [{
              display: true,
              gridLines: {
                drawBorder: false,
                display: false,
            },
              ticks: {
                display: true,
                beginAtZero: false,
                stepSize: 1
              }
          }],
          xAxes: [{
            display: true,
              position: 'bottom',
              gridLines: {
                  drawBorder: false,
                  display: false,
              },
              ticks: {
                display: true,
                beginAtZero: true,
                stepSize: 1
              }
          }],

      },
      legend: {
          display: false,
          labels: {
            boxWidth: 0,
          }
      },
      elements: {
          point: {
              radius: 3
          },
          line: {
            tension: .4,
        },
      },
      tooltips: {
          backgroundColor: 'rgba(2, 171, 254, 1)',
      }
  };
  
  var barChartStackedData = {
    labels: ["jan", "feb", "mar", "apr", "may", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: 'Safari',
      data: [10,20,15,30,20,10,20,15,30,20, 10,20,],
      backgroundColor: [
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
      ],
      borderColor: [
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
      ],
      borderWidth: 1,
      fill: false
    },
    {
      label: 'Chrome',
      data: [5,25,10,20,30,5,25,10,20,30,25,10],
      backgroundColor: [
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
      ],
      borderColor: [
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
        '#bfccda',
      ],
      borderWidth: 1,
      fill: false
    }]
  };
  var barChartStackedOptions = {
    scales: {
      xAxes: [{
        display: false,
        stacked: true,
        gridLines: {
          display: false //this will remove only the label
        },
      }],
      yAxes: [{
        stacked: true,
        display: false,
      }]
    },
    legend: {
      display: false,
      position: "bottom"
    },
    legendCallback: function(chart) {
      var text = [];
      text.push('<div class="row">');
      for (var i = 0; i < chart.data.datasets.length; i++) {
        text.push('<div class="col-sm-5 mr-3 ml-3 ml-sm-0 mr-sm-0 pr-md-0 mt-3"><div class="row align-items-center"><div class="col-2"><span class="legend-label" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></span></div><div class="col-9"><p class="text-dark m-0">' + chart.data.datasets[i].label + '</p></div></div>');
        text.push('</div>');
      }
      text.push('</div>');
      return text.join("");
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };

  if ($("#barChartStacked").length) {
    var barChartCanvas = $("#barChartStacked").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: barChartStackedData,
      options: barChartStackedOptions
    });
  }

  var barChartStackedDarkData = {
    labels: ["jan", "feb", "mar", "apr", "may", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: 'Safari',
      data: [10,20,15,30,20,10,20,15,30,20, 10,20,],
      backgroundColor: [
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
      ],
      borderColor: [
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
        '#2b80ff',
      ],
      borderWidth: 1,
      fill: false
    },
    {
      label: 'Chrome',
      data: [5,25,10,20,30,5,25,10,20,30,25,10],
      backgroundColor: [
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
      ],
      borderColor: [
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
        '#1f2130',
      ],
      borderWidth: 1,
      fill: false
    }]
  };
  var barChartStackedDarkOptions = {
    scales: {
      xAxes: [{
        display: false,
        stacked: true,
        gridLines: {
          display: false //this will remove only the label
        },
      }],
      yAxes: [{
        stacked: true,
        display: false,
      }]
    },
    legend: {
      display: false,
      position: "bottom"
    },
    legendCallback: function(chart) {
      var text = [];
      text.push('<div class="row">');
      for (var i = 0; i < chart.data.datasets.length; i++) {
        text.push('<div class="col-sm-5 mr-3 ml-3 ml-sm-0 mr-sm-0 pr-md-0 mt-3"><div class="row align-items-center"><div class="col-2"><span class="legend-label" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></span></div><div class="col-9"><p class="text-dark m-0">' + chart.data.datasets[i].label + '</p></div></div>');
        text.push('</div>');
      }
      text.push('</div>');
      return text.join("");
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };

  if ($("#barChartStackedDark").length) {
    var barChartCanvas = $("#barChartStackedDark").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: barChartStackedDarkData,
      options: barChartStackedDarkOptions
    });
  }


  if ($("#salesTopChart").length) {
    var graphGradient = document.getElementById("salesTopChart").getContext('2d');;
    var saleGradientBg = graphGradient.createLinearGradient(25, 0, 25, 110);
    saleGradientBg.addColorStop(0, 'rgba(242,18,94, 1)');
    saleGradientBg.addColorStop(1, 'rgba(255, 255, 255, 1)');
    var salesTopData = {
        labels: [
        "Feb 1",
        "Feb 2",
        "Feb 3",
        "Feb 4",
        "Feb 5",
        "Feb 6",
        "Feb 7",
        "Feb 8",
        "Feb 9",
        "Feb 10",
        "Feb 11",
        "Feb 12",
        "Feb 13",
        "Feb 14",
        "Feb 15",
        "Feb 16",
        "Feb 17",
        "Feb 18",
        "Feb 19",
        "Feb 20",
        "Feb 21",
        "Feb 22",
        "Feb 23",
        "Feb 24",
        "Feb 25",
        "Feb 26",
        "Feb 27",
        "Feb 28",
        "Mar 1",
        "Mar 2",
        "Mar 3",
        "Mar 4",
        "Mar 5",
        "Mar 6",
        "Mar 7",
        "Mar 8",
        "Mar 9",
        "Mar 10",
        ],
        datasets: [{
            label: '# of Votes',
            data: [80, 79, 78, 65, 77, 68, 63, 73, 58, 46, 60, 65, 74, 72, 63, 54, 55, 64, 34, 46, 34, 35, 24, 64, 34, 23, 13, 54, 27, 43, 34, 43, 64, 50, 43, 55, 39, 43],
            backgroundColor: saleGradientBg,
            borderColor: [
                'rgba(242,18,94)',
            ],
            borderWidth: 2,
            fill: true, 
        }]
    };

    var salesTopOptions = {
        scales: {
            yAxes: [{
              display: true,
                gridLines: {
                    display: true,
                    drawBorder: true,
                },
                ticks: {
                  display: false,
                  beginAtZero: true,
                }
            }],
            xAxes: [{
              display: true,
                gridLines: {
                    display: true,
                    drawBorder: false,
                },
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    maxRotation: 360,
                    minRotation: 360,
                    padding: 10
                }
            }],
        },
        legend: {
            display: false
        },
        elements: {
          point: {
            radius: 0
        },
            line: {
                tension: 0.1,
            }
        },
        tooltips: {
            backgroundColor: 'rgba(31, 59, 179, 1)',
        }
    }
    var salesTop = new Chart(graphGradient, {
        type: 'line',
        data: salesTopData,
        options: salesTopOptions
    });

}

console.log(reviews);

var eCommerceAnalyticData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
  datasets: [{
          label: 'Critical',
          data: [56, 56, 55, 59, 59, 59, 57, 56, 57, 54, 56, 58, 57, 59, 58, 59, 57, 55, 56, 54, 52, 52, 50, 50, 50, 52, 48, 49, 50, 52, 53, 52, 55, 54, 53, 56, 55, 56, 55, 54, 55, 57, 58, 56, 55, 56, 57, 58, 59, 58, 57, 55, 53, 52, 55, 57, 55, 54, 52, 55, 57, 56, 57, 58, 59, 58, 59, 57, 56, 55, 57, 58, 59, 60, 62, 60, 59, 58, 57, 56, 57, 56, 58, 59],
          borderColor: [
              '#392ccd'
          ],
          borderWidth: 3,
          fill: true,
          backgroundColor:"rgba(242, 250, 247, .6)"
      },
      {
          label: 'Warning',
          data: [32, 32, 35, 39, 39, 39, 37, 36, 37, 34, 36, 38, 37, 39, 38, 39, 37, 35, 36, 34, 30, 28, 31, 29, 27, 24, 23, 26, 25, 27, 28, 29, 32, 30, 33, 31, 35, 34, 32, 35, 37, 35, 36, 34, 30, 28, 28, 28, 32, 29, 33, 35, 33, 32, 35, 37, 35, 34, 32, 35, 37, 36, 37, 38, 39, 38, 39, 37, 36, 35, 37, 38, 39, 36, 37, 35, 39, 38, 37, 36, 37, 36, 38, 39],
          borderColor: [
              '#17c964',
          ],
          borderWidth: 3,
          fill: true,
          backgroundColor:'rgba(200, 200, 200,.5)',
      }
  ],
};

$("#share-btn").click((e) => {
  $("#share-btn").html("Link Copied");
  navigator.clipboard.writeText(share_report_link);
  setTimeout(() => {
    $("#share-btn").html("Share Report");
  }, 1500);
})

var eCommerceAnalyticOptions = {
    scales: {
        yAxes: [{
            display: true,
            gridLines: {
              drawBorder: false,
              display: true,
          },
            ticks: {
              display: false,
              beginAtZero: false,
              stepSize: 5
            }
        }],
        xAxes: [{
          display: false,
            position: 'bottom',
            gridLines: {
                drawBorder: false,
                display: false,
            },
            ticks: {
              display: true,
              beginAtZero: true,
              stepSize: 5
            }
        }],

    },
    legend: {
        display: false,
        labels: {
          boxWidth: 0,
        }
    },
    elements: {
        point: {
            radius: 0
        },
        line: {
          tension: .4,
      },
    },
    tooltips: {
        backgroundColor: 'rgba(2, 171, 254, 1)',
    }
};
if ($("#ecommerceAnalytic").length) {
  var lineChartCanvas = $("#ecommerceAnalytic").get(0).getContext("2d");
  var saleschart = new Chart(lineChartCanvas, {
      type: 'line',
      data: eCommerceAnalyticData,
      options: eCommerceAnalyticOptions
  });
}

var eCommerceAnalyticDarkData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
  datasets: [{
          label: 'Critical',
          data: [56, 56, 55, 59, 59, 59, 57, 56, 57, 54, 56, 58, 57, 59, 58, 59, 57, 55, 56, 54, 52, 52, 50, 50, 50, 52, 48, 49, 50, 52, 53, 52, 55, 54, 53, 56, 55, 56, 55, 54, 55, 57, 58, 56, 55, 56, 57, 58, 59, 58, 57, 55, 53, 52, 55, 57, 55, 54, 52, 55, 57, 56, 57, 58, 59, 58, 59, 57, 56, 55, 57, 58, 59, 60, 62, 60, 59, 58, 57, 56, 57, 56, 58, 59],
          borderColor: [
              '#392ccd'
          ],
          borderWidth: 3,
          fill: true,
          backgroundColor:"rgba(0, 0, 0, .2)"
      },
      {
          label: 'Warning',
          data: [32, 32, 35, 39, 39, 39, 37, 36, 37, 34, 36, 38, 37, 39, 38, 39, 37, 35, 36, 34, 30, 28, 31, 29, 27, 24, 23, 26, 25, 27, 28, 29, 32, 30, 33, 31, 35, 34, 32, 35, 37, 35, 36, 34, 30, 28, 28, 28, 32, 29, 33, 35, 33, 32, 35, 37, 35, 34, 32, 35, 37, 36, 37, 38, 39, 38, 39, 37, 36, 35, 37, 38, 39, 36, 37, 35, 39, 38, 37, 36, 37, 36, 38, 39],
          borderColor: [
              '#17c964',
          ],
          borderWidth: 3,
          fill: true,
          backgroundColor:'rgba(0, 0, 0,.3)',
      }
  ],
};
var eCommerceAnalyticDarkOptions = {
    scales: {
        yAxes: [{
            display: true,
            gridLines: {
              drawBorder: false,
              display: true,
          },
            ticks: {
              display: false,
              beginAtZero: false,
              stepSize: 5
            }
        }],
        xAxes: [{
          display: false,
            position: 'bottom',
            gridLines: {
                drawBorder: false,
                display: false,
            },
            ticks: {
              display: true,
              beginAtZero: true,
              stepSize: 5
            }
        }],

    },
    legend: {
        display: false,
        labels: {
          boxWidth: 0,
        }
    },
    elements: {
        point: {
            radius: 0
        },
        line: {
          tension: .4,
      },
    },
    tooltips: {
        backgroundColor: 'rgba(2, 171, 254, 1)',
    }
};
if ($("#ecommerceAnalyticDark").length) {
  var lineChartCanvas = $("#ecommerceAnalyticDark").get(0).getContext("2d");
  var saleschart = new Chart(lineChartCanvas, {
      type: 'line',
      data: eCommerceAnalyticDarkData,
      options: eCommerceAnalyticDarkOptions
  });
}



  });
})(jQuery);

$.ajax({
  url: `${window.location.origin}/share_report_link?email=${localStorage["email"]}`
}).then(function (response){
  share_report_link = response;
})

$.ajax({
  url: `${window.location.origin}/get-call-direction-metrics?email=${localStorage["email"]}`
}).then(function (response){
  $('#call-click').html(response['call_clicks'])
  $('#direction-req').html(response['direction'])
})

var impressions;
var dates;
$.ajax({
  url: `${window.location.origin}/get-impressions?email=${localStorage["email"]}`
}).then(function (response){
  impressions = response['impressions'];
  dates = response['dates'];

  impressionsData = {
    labels: dates,
    datasets: [{
            label: 'Impression',
            data: impressions,
            borderColor: [
                '#3022cb'
            ],
            borderWidth: 3,
            fill: false,
        }
    ],
  };
  impressionsOptions = {
      scales: {
          yAxes: [{
              display: true,
              gridLines: {
                drawBorder: false,
                display: false,
            },
              ticks: {
                display: true,
                beginAtZero: false,
                stepSize: 1
              }
          }],
          xAxes: [{
            display: true,
              position: 'bottom',
              gridLines: {
                  drawBorder: false,
                  display: false,
              },
              ticks: {
                display: true,
                beginAtZero: true,
                stepSize: 1
              }
          }],

      },
      legend: {
          display: false,
          labels: {
            boxWidth: 0,
          }
      },
      elements: {
          point: {
              radius: 2
          },
          line: {
            tension: .4,
        },
      },
      tooltips: {
          backgroundColor: 'rgba(2, 171, 254, 1)',
      }
  };

  var lineChartCanvas = $("#impressions").get(0).getContext("2d");
  var saleschart = new Chart(lineChartCanvas, {
      type: 'line',
      data: impressionsData,
      options: impressionsOptions
  });

})

$.ajax({
  url: `${window.location.origin}/get-website-conversation-metrics?email=${localStorage["email"]}`
}).then(function (response) {
  $('#conversation_count').html(response['conversations'])
  $('#website-click').html(response['website_clicks']) 
});

var reviews_html = '';
var recent_reviews_header_html = `<div class="d-flex justify-content-between mb-4">
<div class="font-weight-medium">Reviewer</div>
<div class="font-weight-medium">Rating</div>
</div>`;
var recent_reviews_html = '';
var editing_review_index;
var reviews;
var rating;
var review_count;
let rate_map = {"FIVE":5,"FOUR":4,"THREE":3,"TWO":2,"ONE":1};


const updateRatingReviewCount = (rating, review_count) => {
  const starTotal = 5
  const starPercentage = (rating / starTotal) * 100;
  document.querySelector(`.stars-inner`).style.width = `${starPercentage}%`;

  $('#rating').html(rating)
  $('#review-count').html(`\u00A0(${review_count})`)
}

const updateRecentReviews = (reviews) => {
  recent_reviews_html = recent_reviews_header_html;
  reviews.map((review, index) => {
    recent_reviews_html += `
    <div class="d-flex justify-content-between mb-4">
      <div class="text-secondary font-weight-medium d-flex align-self-center">
        <img class="img-sm rounded-circle" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
        <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
      </div>
      <div class="stars-outer-${index}">
        <div class="stars-inner-${index}"></div>
      </div>
    </div>
    `;
  })

  $("#recent-reviews").html(recent_reviews_html);

  reviews.map((review, index) => {
    const starTotal = 5
    const starPercentage = (rate_map[review["starRating"]] / starTotal) * 100;
    document.querySelector(`.stars-inner-${index}`).style.width = `${starPercentage}%`;
  })
}

const updateReviews = (reviews) => {
  reviews_html = '';
  reviews.map((review, index) => {
    let stars = '';

    let reply_form = `
    <div class="d-flex flex-row ml-sm-3 mt-sm-2">
      <input type="text" class="form-control" id="reply-container-${index}" placeholder="Reply message">
      <button type="${index}" class="reply btn btn-primary mx-2">Reply</button>
    </div>
    `;

    let edit_form = '';
    if(Object.keys(review).includes("reviewReply")){
      edit_form = `
      <div class="d-flex flex-row ml-sm-3 mt-sm-2">
        <i class="mdi mdi-reply" style="display: inline-block;font-size: 20px;text-align: left;color: #f2125e;"></i>
        <h5 class="m-sm-2 w-100" for="exampleInputPassword1">${review['reviewReply']['comment']}</h5>
        <button type="${index}" class="reply-edit btn btn-light mx-2">Edit</button>
        <button type="${index}" class="reply-delete btn btn-primary">Delete</button>
      </div>
      `;
    }

    let editing_form = '';
    if(Object.keys(review).includes("reviewReply")){
      editing_form = `
      <div class="d-flex flex-row ml-sm-3 mt-sm-2">
        <input type="text" class="form-control" id="reply-container-${index}" value="${review['reviewReply']['comment']}" placeholder="Reply message">
        <button type="${index}" class="reply-discard-editing btn btn-light mx-2">Discard</button>
        <button type="${index}" class="reply-update btn btn-light">Update</button>
      </div>
      `;
    }

    for(let i=0; i<rate_map[review["starRating"]]; i++){
      stars += `<svg width="25pt" height="25pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
      <path d="m375.58 177.32c-3.957 0.16797-7.3984 2.7812-8.6133 6.5547l-44.609 138.26-145.23-0.28516h-0.003906c-4.1133-0.007812-7.7578 2.6328-9.0273 6.543-1.2695 3.9102 0.125 8.1953 3.457 10.605l117.68 85.16-45.188 138.12c-1.2773 3.9062 0.11328 8.1914 3.4375 10.605 3.3242 2.418 7.8281 2.4141 11.148-0.007812l117.35-85.641 117.4 85.641h-0.003906c3.3242 2.4219 7.8242 2.4258 11.148 0.007812 3.3242-2.418 4.7109-6.6992 3.4336-10.605l-45.188-138.12 117.68-85.16h0.003906c3.3281-2.4102 4.7266-6.6914 3.4531-10.602-1.2695-3.9102-4.9141-6.5547-9.0234-6.5469l-145.24 0.28516-44.66-138.26c-1.3086-4.0469-5.1562-6.7266-9.4102-6.5508z" fill="#ffb258" fill-rule="evenodd"/>
      </svg>`;
    }

    for(let i=5; i>rate_map[review["starRating"]]; i--){
      stars += `<svg width="25pt" height="25pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
      <path d="m374.76 172.45c-1.543 0.41797-2.7695 1.5859-3.2617 3.1055l-48.633 146.07h-155.69c-2.0391 0.007812-3.8477 1.3242-4.4844 3.2656-0.63281 1.9414 0.046875 4.0703 1.6914 5.2812l126.48 92.461-48.633 150.89c-0.63672 1.957 0.0625 4.0977 1.7266 5.3008 1.6641 1.2031 3.918 1.1992 5.5742-0.015624l126.48-92.461 126.48 92.461h0.003907c1.6562 1.2148 3.9062 1.2188 5.5703 0.015624 1.668-1.2031 2.3633-3.3438 1.7305-5.3008l-48.633-150.89 126.48-92.461c1.6445-1.2109 2.3242-3.3398 1.6875-5.2812-0.63281-1.9414-2.4414-3.2578-4.4844-3.2656h-155.69l-48.633-146.07c-0.78125-2.4023-3.3125-3.7695-5.75-3.1055zm1.2422 19.734 45.215 135.66c0.69141 1.8867 2.5 3.1328 4.5078 3.1055h144.66l-117.62 85.934c-1.6484 1.207-2.3398 3.3398-1.7109 5.2852l45.215 140.32-117.46-85.934c-1.6641-1.2188-3.9258-1.2188-5.5938 0l-117.46 85.934 45.215-140.32c0.63281-1.9453-0.058594-4.0781-1.707-5.2852l-117.62-85.934h144.66c2.0078 0.027343 3.8164-1.2188 4.5039-3.1055z" fill="#ffb258" fill-rule="evenodd"/>
    </svg>`;
    }

    reviews_html += `
    <tr>
    <td>
      <div class="d-flex d-sm-none flex-column">
        <img class="img-sm rounded-circle mb-md-0 mr-2" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
        <div class="d-flex flex-column w-100">
          <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
          <div class="ratings w-100">
            ${stars}
          </div>
        </div>
        <small>${review["updateTime"]}</small>
      </div>
      <div class="d-none d-sm-flex flex-sm-row">
        <img class="img-sm rounded-circle mb-md-0 mr-2" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
        <div class="d-flex flex-column w-100">
          <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
          <div class="ratings w-100">
            ${stars}
          </div>
        </div>
        <small>${review["updateTime"]}</small>
      </div>
      <h4 class="m-sm-2">${Object.keys(review).includes("comment") ? review['comment'] : ""}</h4>
      ${Object.keys(review).includes("reviewReply") ?
        (editing_review_index!=undefined && editing_review_index==index) ?
          editing_form :
        edit_form :
      reply_form}
    </td>
    </tr>
    `
  })

  $('.table > tbody').html(reviews_html)

  $(".reply").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    let reply = $(`#reply-container-${clickIndex}`)[0].value;
    console.log(reply);

    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply?name=${reviews[clickIndex]["name"]}&reply=${reply}&email=${localStorage["email"]}`
    }).then((resp) => {
      reviews[clickIndex]["reviewReply"] = resp
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to reply on this review");
      updateReviews(reviews);
    })
  })

  $(".reply-edit").click((e) => {
    editing_review_index = parseInt(e.target.getAttribute("type"));
    updateReviews(reviews);
  })

  $(".reply-discard-editing").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    editing_review_index = undefined;
    updateReviews(reviews);
  })

  $(".reply-delete").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply_delete?name=${reviews[clickIndex]["name"]}&email=${localStorage["email"]}`
    }).then((resp) => {
      delete reviews[clickIndex]["reviewReply"];
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to delete this reply");
      updateReviews(reviews);
    })
  })

  $(".reply-update").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    let reply = $(`#reply-container-${clickIndex}`)[0].value;
    console.log(reply);

    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply_update?name=${reviews[clickIndex]["name"]}&reply=${reply}&email=${localStorage["email"]}`
    }).then((resp) => {
      reviews[clickIndex]["reviewReply"] = resp;
      editing_review_index = undefined;
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to update this reply");
      updateReviews(reviews);
    })
  })
}

$("#sp-name").html(`${localStorage["first_name"]} ${localStorage["last_name"]}`)
$("#sp-email").html(localStorage["email"])
$("#sp-image").attr('src', localStorage["picture"])

const getReviews = () => {
  $.ajax(
    {
      url: `${window.location.origin}/get-reviews?email=${localStorage["email"]}`
    }
  ).then(function (response) {
    // console.log(response['reviews'])
    reviews = response['reviews']
    rating = response['rating']
    review_count = response['review_count']

    updateRatingReviewCount(rating, review_count);
    updateReviews(reviews);
    updateRecentReviews(reviews.slice(0, 5));
  })
}

// getReviews();

const getRank = () =>{
  let date_today = new Date()
  let date = date_today.toISOString().split('T')[0]
  let place_id = localStorage['place_id']
  let payload = {
    place_id:place_id,
    date:date
  }

  console.log(payload);
  $.ajax({
    url: `${window.location.origin}/get-rank`,
    data: payload
  }).then(function (response){
    let html_body = '';
    for(res of JSON.parse(response)){
      html_body += `
        <li>
          <div>${res['keyword']}</div>
          <div>${res['search_volume']}</div>
        </li>
      `
    }
    document.getElementById('rank_list').innerHTML = html_body;
  });
}

// getRank();
