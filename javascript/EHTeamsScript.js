getTeams();

var teams;

function getTeams() {
  fetch("http://"+API_URL+"/api/betstrat/eurohandicap/teams")
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
        addTeamToTable("team" + team.id, team.name, team.numMatchesPlayed, team.balance, admin);
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}


function addTeamToTable(idTeam, name, numMatches, balance, admin) {
  $(document).ready(function() {
    $('#teamsTable').append(
      '<tr style="height: 64px;"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + name + '</td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><label class="switch"><input id="' + idTeam + '" onclick="toggleButton(this);"  type="checkbox" ' + admin + '><span class="slider round"></span></label></td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + numMatches + '</td><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + balance + '</td></tr>'
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
  var url = "http://" + API_URL + "/api/betstrat/eurohandicap/" + teamId + "?admin=" + admin;

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
