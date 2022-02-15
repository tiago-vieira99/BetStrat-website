getTeams();

var teams;

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
        addTeamToTable("team" + team.id, team.name, team.seqLevel);
      });

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}


function addTeamToTable(idTeam, name, seqLevel) {
  $(document).ready(function() {
    $('#teamsTable').append(
      '<tr id="' + idTeam + '" style="height: 64px;"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><a style="color: black;" href="Matches-By-Team.html?'+idTeam+'&'+name+'"><u>' + name + '</u></a></td>' +
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + buildEmojisString(seqLevel) + '</td></tr>'
    );
  });
}

function buildEmojisString(seqLevel) {
  var emojisStr = "&#9989  ";
  for (let i = 0; i < seqLevel-1; i++) {
    emojisStr += "   &#11093  ";
  }
    return emojisStr;
}
