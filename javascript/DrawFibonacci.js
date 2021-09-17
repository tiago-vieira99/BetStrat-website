var x, y;
var context = document.querySelector('#graph').getContext('2d');
var chart;
drawFiboSeqEvolution();
drawFiboSeqInfo();

function drawFiboSeqEvolution() {
  fetch("http://" + API_URL + "/api/betstrat/drawfiboseq/evolution")
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      x = myJson.x;
      y = myJson.y;
      chart = new Chart(context, chartSetup(x, y));
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
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



function drawFiboSeqInfo() {
  fetch("http://20.101.56.205:8080/api/betstrat/drawfiboseq")
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      $("#balance-stat").text(myJson.balance + "€");
      $("#success-stat").text(myJson.successRate + "%");
      $("#numteams-stat").text(myJson.numTeams);
      $("#nummatches-stat").text(myJson.numMatchesPlayed);
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}
