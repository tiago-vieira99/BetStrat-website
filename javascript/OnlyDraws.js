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
      statsInfoBySeason(season);
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

function statsInfoBySeason(season) {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/teams/")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp){
      var allTeams = resp.teams;
      var filteredTeams = [];
      var greenTeams = 0;
      var totalBalance = 0;

      allTeams.forEach(function(team) {
        if (team.season == season) {
          filteredTeams.push(team);
          totalBalance = totalBalance + team.balance;

          if (team.balance > 0) {
            greenTeams++;
          }
        }
      });

      numMatchesBySeason(season);
      var successRate = (greenTeams / filteredTeams.length)*100;
      setTimeout(function() {
        $("#balance-stat").text(totalBalance.toString().slice(0, 5) + "€");
        $("#numteams-stat").text(filteredTeams.length);
        $("#success-stat").text(successRate.toString().slice(0, 5) + "%");
      }, 720);
    }) 
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function numMatchesBySeason(season) {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/matches/")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp){
      var allMatches = resp;
      var filteredMatches = [];

      allMatches.forEach(function(match) {
        if (match.season == season) {
          filteredMatches.push(match);
        }
      });
      $("#nummatches-stat").text(filteredMatches.length);
    }) 
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

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
    drawFiboSeqInfo();
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
