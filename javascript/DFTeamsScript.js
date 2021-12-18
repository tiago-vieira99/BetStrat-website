getTeams();

var teams;

setTimeout(function() {
  addBtnListeners();
}, 1000);

function addBtnListeners() {
  var allarchiveButtons = document.querySelectorAll('.archiveBtn');

  console.log("length: " + allarchiveButtons.length);
  for (var i = 0; i < allarchiveButtons.length; i++) {
    allarchiveButtons[i].addEventListener('click', function() {
      if (archiveConfirmation(this)) {
        var teamId = getBtnId(this).substr(4);
        archiveTeamAPI(teamId);
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
  fetch("http://"+API_URL+"/api/betstrat/drawfiboseq/teams")
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
        addTeamToTable("team" + team.id, team.name, team.numMatchesPlayed, team.balance, admin, team.oddAvg, team.season);
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}


function addTeamToTable(idTeam, name, numMatches, balance, admin, oddAvg, season) {
  $(document).ready(function() {
    $('#teamsTable').append(
      '<tr id="' + idTeam + '" style="height: 64px;"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><a style="color: black;" href="Matches-By-Team.html?'+idTeam+'&'+name+'"><u>' + name + '</u></a></td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><label class="switch"><input id="' + idTeam + '" onclick="toggleButton(this);"  type="checkbox" ' + admin + '><span class="slider round"></span></label></td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + numMatches + '</td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + season + '</td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + oddAvg + '</td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + balance + '</td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <form><input class="archiveBtn" type=button value="📜" style="max-width:80%; position: center;"></form> </td></tr>'
    );
  });
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
    updateTeamAPI(tgBtn.id, tgBtn.checked);
    return tgBtn.checked;
  } else {
    // document.write ("User does not want to continue!");
    return !tgBtn.checked;
  }
}


function updateTeamAPI(teamId, admin) {
  var url = "http://" + API_URL + "/api/betstrat/drawfiboseq/" + teamId + "?admin=" + admin;

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
  var url = "http://" + API_URL + "/api/betstrat/drawfiboseq/team/archive" + teamId;

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
