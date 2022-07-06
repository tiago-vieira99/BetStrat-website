var x, y;
var context = document.querySelector('#graph').getContext('2d');
var chart;

callGetSeqEvolution(ONLY_DRAWS_PATH);
callGetSeqInfo(ONLY_DRAWS_PATH);

function syncData() {
  var url = "http://" + API_URL + "/api/betstrat/onlydraws/sync";

  fetch(url, {
      method: 'POST'
    });
    setTimeout(() => { window.location.reload(); }, 2000);
}

function chartSetup(days, profit) {
  var data = {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        backgroundColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: profit,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        filler: {
          propagate: false,
        },
        legend: {
          position: 'top',
          display: false
        },
        title: {
          display: true,
          text: 'Strategy Profit Evolution',
          font: {
            size: 26
          },
        }
      },
      scales: {
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Profit (€)'
          }
        }
      }
    },
  };
  return data;
}

// ---------------------------------------------------------------------------------------------------------

document.getElementById("seasonSelect").addEventListener("change",function() {
  const season = this.value;
  if (season == "all") {
    chart.destroy();
    callGetSeqInfo(ONLY_DRAWS_PATH);
    callGetSeqEvolution(ONLY_DRAWS_PATH);
  } else {
    chart.destroy();
    callGetSeqEvolutionBySeason(ONLY_DRAWS_PATH, season);
  }
})



