//-------------------------------------------------------------------------------------------
//------------------------       STRATEGIES MAIN PAGE CALLS     -----------------------------
//-------------------------------------------------------------------------------------------
function callGetSeqInfo(stratPath) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath)
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

function callGetSeqEvolution(stratPath) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/evolution")
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

function callGetSeqEvolutionBySeason(stratPath, season) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/evolution/" + season)
    .then(function(response) {
      callGetStatsInfoBySeason(stratPath, season);
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

function callGetStatsInfoBySeason(stratPath, season) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/teams/")
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

      callGetNumMatchesBySeason(stratPath, season);
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

function callGetNumMatchesBySeason(stratPath, season) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/matches/")
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

//-------------------------------------------------------------------------------------------
//---------------------------       ALL MATCHES PAGE CALLS     ------------------------------
//-------------------------------------------------------------------------------------------

function callGetAllMatchesInfo(stratPath) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/matches")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      matches = resp;

      matches.sort(function(a, b) {
        var matchDateA = a.date.split('/');
        var matchDateB = b.date.split('/');

        var dateA = Date.parse(matchDateA[1].concat('/',matchDateA[0],'/',matchDateA[2])),
          dateB = Date.parse(matchDateB[1].concat('/',matchDateB[0],'/',matchDateB[2]))
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });
      matches.forEach(function(match) {
        var idMatch = "idmatch" + count++;
        map1.set(idMatch, match);
        addMatchLine(idMatch, match);
      });

      console.log(map1.size);

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function callPutUpdateMatch(stratPath, matchId, ftResult) {
  if (ftResult.includes('+')) {
    ftResult = ftResult.replace('+', '%2B');
  }
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/match/" + matchId + "?ftResult=" + ftResult;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      console.log(url);
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        modalBox("Match Updated!", "balance: " + data.balance);
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function callDeleteMatch(stratPath, matchId) {
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/match/" + matchId;

  fetch(url, {
      method: 'DELETE', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//-------------------------------------------------------------------------------------------
//-----------------------------       ALL TEAMS PAGE CALLS     ------------------------------
//-------------------------------------------------------------------------------------------

function callGetTeams(stratPath) {
  fetch("http://"+API_URL+"/api/betstrat/" + stratPath + "/teams")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      teams = resp.teams;

      teams.sort(function(a, b) {
        var nameA = a.name,
          nameB = b.name;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      teams.forEach(function(team) {
        var admin;
        if (team.admin) {
          admin = "checked";
        } else {
          admin = "";
        }
        
        getFirstMatchForTeam(team, admin);          
        
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function callUpdateTeamAdmin(stratPath, teamId, admin) {
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/" + teamId + "?admin=" + admin;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function callUpdateTeamStake(stratPath, teamId, stake) {
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/" + teamId + "?initial_stake=" + stake;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function callArchiveTeam(stratPath, teamId) {
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/team/archive" + teamId;

  console.log(url);

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        console.log(data);
        modalBox("Archived Team", "<p>OK!</p>");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function callInsertNewTeam(url) {
  fetch(url, {
    method: 'POST', // or 'PUT'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status) {
      modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
    } else {
      modalBox("New Team", data.name + " inserted!");
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

//-------------------------------------------------------------------------------------------
//--------------------------       INSERT MATCHES PAGE CALLS     ----------------------------
//-------------------------------------------------------------------------------------------

function callGetNextMatches(stratPath) {
  fetch("http://" + API_URL + "/api/betstrat/" + stratPath + "/nextmatches")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      matches = resp;

      matches.sort(function(a, b) {
        var dateA = a.date,
          dateB = b.date;
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      });
      matches.forEach(function(match) {
        var idMatch = "idmatch" + count++;
        map1.set(idMatch, match);
        addMatchDiv(idMatch, match.date, match.homeTeam, match.awayTeam);
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function callPostNewMatch(stratPath, match) {
  var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/match"

  fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        modalBox("New Match", "<p><b>Stake:</b> " + data.stake + "</p><p><b>SeqLevel:</b> " + data.seqLevel + "</p>");
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


//-------------------------------------------------------------------------------------------
//------------------------       MATCHES BY TEAM PAGE CALLS     -----------------------------
//-------------------------------------------------------------------------------------------

//these paths are always 'onlydraws' because the core API returns the correct info only based on id, whatever is the path,
function getTeamInfo() {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/team/" + teamId)
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      team = resp;

      var b = document.querySelector(".teamDataSheet");

      if (team.strategyID == ONLY_DRAWS_ID) {
        b.setAttribute("src", OD_DATA_SHEET_URL + "?gid=" + team.analysisID + "&single=true&range=B5:N14&widget=true&headers=false");
      } else if (team.strategyID == EURO_HANDICAP_ID) {
        b.setAttribute("src", EH_DATA_SHEET_URL + "?gid=" + team.analysisID + "&single=true&range=B5:N14&widget=true&headers=false");
      }
    
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function getMatchesForTeam() {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/teammatches/" + teamId)
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      matches = resp;

      matches.sort(function(a, b) {
        var matchDateA = a.date.split('/');
        var matchDateB = b.date.split('/');

        var dateA = Date.parse(matchDateA[1].concat('/',matchDateA[0],'/',matchDateA[2])),
          dateB = Date.parse(matchDateB[1].concat('/',matchDateB[0],'/',matchDateB[2]))
        if (dateA > dateB) { return -1; }
        if (dateA < dateB) { return 1; }
        return 0;
      });

      matches.forEach(function(match) {
        var idMatch = "idmatch" + count++;
        map1.set(idMatch, match);
        addMatchLine(idMatch, match);
      });

      matches.reverse();

      var matchesBalanceArray = [];
      var matchesDateArray = [];
      var barsBackgroundColorArray = [];
      var barsBorderColorArray = [];
      
      matches.forEach(function(match) {
        matchesBalanceArray.push(match.balance);
        matchesDateArray.push(match.date);
        if (match.balance > 0) {
          barsBackgroundColorArray.push("#afdfbd");
          barsBorderColorArray.push("#58F031");
        } else {
          barsBackgroundColorArray.push("#e3c0c1");
          barsBorderColorArray.push("#E46F73");
        }
      });

      var chart = new Chart(context, chartSetup(matchesDateArray, matchesBalanceArray, barsBackgroundColorArray, barsBorderColorArray));

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function getFirstMatchForTeam(team, admin) {
  fetch("http://" + API_URL + "/api/betstrat/onlydraws/teammatches/" + team.id)
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      var matches;
      matches = resp;

      matches.sort(function(a, b) {
        var matchDateA = a.date.split('/');
        var matchDateB = b.date.split('/');

        var dateA = Date.parse(matchDateA[1].concat('/',matchDateA[0],'/',matchDateA[2])),
          dateB = Date.parse(matchDateB[1].concat('/',matchDateB[0],'/',matchDateB[2]))
        if (dateA > dateB) { return -1; }
        if (dateA < dateB) { return 1; }
        return 0;
      });

      matches.reverse();

      if (matches[0] == null) {
        addTeamToTable("team" + team.id, team, admin, 0);
      } else {
        addTeamToTable("team" + team.id, team, admin, matches[0].stake);
      }

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}


//-------------------------------------------------------------------------------------------
//-----------------------------       ALL LEAGUES PAGE CALLS     ------------------------------
//-------------------------------------------------------------------------------------------

function callGetLeagues() {
  fetch("http://"+API_URL+"/api/league/")
    .then(function(response) {
      return response.json();
    })
    .then(function(leagues) {
      // league = resp.leagues;

      console.log(leagues);

      leagues.sort(function(a, b) {
        var nameA = a.name,
          nameB = b.name;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      leagues.forEach(function(league) {
        var admin;
        if (league.admin) {
          admin = "checked";
        } else {
          admin = "";
        }     

        addLeagueToTable("league" + league.id, league, admin);
        
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function callGetCandidateTeams() {
  fetch("http://"+API_URL+"/api/league/teamsInfo")
    .then(function(response) {
      return response.json();
    })
    .then(function(teams) {

      teams.sort(function(a, b) {
        var nameA = a.teamLeague.country,
          nameB = b.teamLeague.country;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      
      teams.forEach(function(team) {
        
        addCandidateTeamToTable(team);
        
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function callInsertNewLeague(url) {
  fetch(url, {
    method: 'POST', // or 'PUT'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status) {
      modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
    } else {
      modalBox("New League", data.name + " inserted!");
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function callUpdateLeagueAdmin(leagueId, admin) {
  var url = "http://" + API_URL + "/api/league/" + leagueId + "?admin=" + admin;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// function callUpdateTeamStake(stratPath, teamId, stake) {
//   var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/" + teamId + "?initial_stake=" + stake;

//   fetch(url, {
//       method: 'PUT', // or 'PUT'
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.status) {
//         modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
//       } else {
//         console.log(data);
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }

// function callArchiveTeam(stratPath, teamId) {
//   var url = "http://" + API_URL + "/api/betstrat/" + stratPath + "/team/archive" + teamId;

//   console.log(url);

//   fetch(url, {
//       method: 'PUT', // or 'PUT'
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.status) {
//         modalBox("Error", "<p>" + data.error + "</p><p>" + data.message + "</p>");
//       } else {
//         console.log(data);
//         modalBox("Archived Team", "<p>OK!</p>");
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }

