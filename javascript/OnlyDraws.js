var x, y;
var context = document.querySelector('#graph').getContext('2d');
var chart;
drawFiboSeqEvolution();
drawFiboSeqInfo();

function drawFiboSeqEvolution() {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/evolution")
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

function drawFiboSeqEvolutionBySeason(season) {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/evolution/" + season)
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

document.getElementById("seasonSelect").addEventListener("change",function() {
  const season = this.value;
  if (season == "all") {
    chart.destroy();
    drawFiboSeqEvolution();
  } else {
    chart.destroy();
    drawFiboSeqEvolutionBySeason(season);
  }
})


function drawFiboSeqInfo() {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws")
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var balance = myJson.balance.toString();
      $("#balance-stat").text(balance.slice(0, 5) + "€");
      $("#success-stat").text(myJson.successRate + "%");
      $("#numteams-stat").text(myJson.numTeams);
      $("#nummatches-stat").text(myJson.numMatchesPlayed);
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}
