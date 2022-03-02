getTeams();

var teams;

setTimeout(function() {
  addBtnListeners();
}, 1000);

function addBtnListeners() {
  var allarchiveButtons = document.querySelectorAll('.archiveBtn');
  var allUpdateStakeButtons = document.querySelectorAll('.updateStakeBtn');

  console.log("length: " + allarchiveButtons.length);
  for (var i = 0; i < allarchiveButtons.length; i++) {
    allarchiveButtons[i].addEventListener('click', function() {
      if (archiveConfirmation(this)) {
        var teamId = getBtnId(this).substr(4);
        archiveTeamAPI(teamId);
      }
    });
  }

  for (var j = 0; j < allUpdateStakeButtons.length; j++) {
    allUpdateStakeButtons[j].addEventListener('click', function() {
      var teamId = getBtnId(this);
      var newStake = document.querySelector('#stake' + teamId).value;
      if (archiveConfirmation(this)) {
        updateTeamStake(teamId, newStake);
      }
    });
  }
}

function archiveConfirmation(Btn) {
  var retVal = confirm("Do you want to continue ?");
  return retVal;
}

function getBtnId(elt) {
  // Traverse up until root hit or DIV with ID found
  while (elt && (elt.tagName != "TR" || !elt.id))
    elt = elt.parentNode;
  if (elt) // Check we found a DIV with an ID
    return elt.id;
}

function getTeams() {
  fetch("http://"+API_URL+"/api/betstrat/onlydraws/teams")
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
        addTeamToTable("team" + team.id, team, admin);
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}


function addTeamToTable(idTeam, team, admin) {
  $(document).ready(function() {
    $('#teamsTable').append(
      '<tr id="' + idTeam + '" style="height: 64px; background-color: '+teamBackgroundColor(team.balance)+';"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><a style="color: black; font-weight: bold;" href="TeamInfoPage.html?'+idTeam+'&'+team.name+'"><u>' + team.name + '</u></a></td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><label class="switch"><input id="' + idTeam + '" onclick="toggleButton(this);"  type="checkbox" ' + admin + '><span class="slider round"></span></label></td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell" style="' + checkLeftMatchesToPlayColor(team.numMatchesToPlay, team.name) +'">' + team.numMatchesPlayed + ' / ' + team.numMatchesToPlay + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + team.season + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + team.oddAvg + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + team.balance + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + team.initialStake + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <table>  <tr><td style="padding: 0px;"><input id="stake' + idTeam + '" type="text" placeholder="stake" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white u-input-1" required="required"></td> <td> <form><input class="updateStakeBtn" type=button value="✔️" style="width:100%"></form></td> </tr></table></td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <form><input class="archiveBtn" type=button value="📜" style="max-width:100%; position: center;"></form> </td></tr>'
    );
  });
}

function checkLeftMatchesToPlayColor(matchesLeft, name) {
  if (matchesLeft <= 7 && !name.includes("_")) {
    return 'background-color: #e1e10c;'
  }
  return ''
}

function teamBackgroundColor(balance) {
  if (balance >= 0) {
    return '#afdfbd'
  } else {
    return '#e3c0c1'
  }
}

function toggleButton(tgBtn) {
  tgBtn.checked = toggleConfirmation(tgBtn);
  console.log(tgBtn.checked);
  console.log(tgBtn.id);
}


function toggleConfirmation(tgBtn) {
  var retVal = confirm("Do you want to continue ?");
  if (retVal == true) {
    // document.write ("User wants to continue!");
    updateTeamAdminAPI(tgBtn.id, tgBtn.checked);
    return tgBtn.checked;
  } else {
    // document.write ("User does not want to continue!");
    return !tgBtn.checked;
  }
}

function insertTeam() {
    name = document.querySelector('#name-6797').value;
    teamUrl = document.querySelector('#url-6797').value;
    analysisId = document.querySelector('#analid-6797').value;
    season = document.querySelector('#teamSeason').value;
    stake = document.querySelector('#stake-6797').value;
    var url = null;

    if (stake != '') {
      url = new URL("http://" + API_URL + "/api/betstrat/onlydraws/team?name=name&url=url&season=season&analysisID=analysisID&initialStake=initialStake");
      url.searchParams.set('initialStake', stake);
      console.log(url);
    } else {
      url = new URL("http://" + API_URL + "/api/betstrat/onlydraws/team?name=name&url=url&season=season&analysisID=analysisID");
    }
    url.searchParams.set('name', name);
    url.searchParams.set('url', teamUrl);
    url.searchParams.set('analysisID', analysisId);
    url.searchParams.set('season', season);
    console.log(url);
    
    fetch(url, {
        method: 'POST', // or 'PUT'
      })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          alert(data.error + "\n" + data.message);
        } else {
          alert(data.name + " inserted!");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

function updateTeamAdminAPI(teamId, admin) {
  var url = "http://" + API_URL + "/api/betstrat/onlydraws/" + teamId + "?admin=" + admin;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        alert(data.error + "\n" + data.message);
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function updateTeamStake(teamId, stake) {
  var url = "http://" + API_URL + "/api/betstrat/onlydraws/" + teamId + "?initial_stake=" + stake;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        alert(data.error + "\n" + data.message);
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function archiveTeamAPI(teamId) {
  var url = "http://" + API_URL + "/api/betstrat/onlydraws/team/archive" + teamId;

  fetch(url, {
      method: 'PUT', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        alert(data.error + "\n" + data.message);
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
