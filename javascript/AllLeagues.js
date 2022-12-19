
callGetLeagues();

var leagues;
var currStake;

// setTimeout(function() {
//   addBtnListeners();
// }, 5000);

// function addBtnListeners() {
//   var allarchiveButtons = document.querySelectorAll('.archiveBtn');
//   var allUpdateStakeButtons = document.querySelectorAll('.updateStakeBtn');

//   console.log("length: " + allarchiveButtons.length);
//   for (var i = 0; i < allarchiveButtons.length; i++) {
//     allarchiveButtons[i].addEventListener('click', function() {
//       if (dialogConfirmation(this)) {
//         var teamId = getBtnId(this).substr(4);
//         callArchiveTeam(strategyPath, teamId);
//       }
//     });
//   }

//   for (var j = 0; j < allUpdateStakeButtons.length; j++) {
//     allUpdateStakeButtons[j].addEventListener('click', function() {
//       var teamId = getBtnId(this);
//       var newStake = document.querySelector('#stake' + teamId).value;
//       if (dialogConfirmation(this)) {
//         callUpdateTeamStake(strategyPath, teamId, newStake);
//       }
//     });
//   }
// }

// function dialogConfirmation(Btn) {
//   var retVal = confirm("Do you want to continue ?");
//   return retVal;
// }

// function getBtnId(elt) {
//   // Traverse up until root hit or DIV with ID found
//   while (elt && (elt.tagName != "TR" || !elt.id))
//     elt = elt.parentNode;
//   if (elt) // Check we found a DIV with an ID
//     return elt.id;
// }


function addLeagueToTable(idLeague, league, admin) {
  if (league.name.includes("_")) {
    $(document).ready(function() {
      $('#archLeaguesTable').append(
        '<tr id="' + idLeague + '" style="height: 32px;">' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.name + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><b>' + league.country + '</b></td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.season + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.actualRound + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.lastUpdate + '</td></tr>'
      );
    });
  } else {
    $(document).ready(function() {
      $('#leaguesTable').append(
        '<tr id="' + idLeague + '" style="height: 32px;">' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.name + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><b>' + league.country + '</b></td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.season + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.actualRound + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + league.lastUpdate + '</td>' +
        '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><label class="switch"><input id="' + idLeague + '" onclick="toggleButton(this);"  type="checkbox" ' + admin + '><span class="slider round"></span></label></td></tr>'
      );
    });
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
    callUpdateLeagueAdmin(tgBtn.id, tgBtn.checked);
    return tgBtn.checked;
  } else {
    // document.write ("User does not want to continue!");
    return !tgBtn.checked;
  }
}

function insertLeague() {
    leaguename = document.querySelector('#leagueInsertedName').value;
    leagueUrl = document.querySelector('#leagueInsertedUrl').value;
    season = document.querySelector('#leagueSeason').value;
    country = document.querySelector('#leagueInsertedCountry').value;
    var url = null;

    url = new URL("http://" + API_URL + "/api/league/new?name=name&url=url&season=season&country=country");
    
    url.searchParams.set('name', leaguename);
    url.searchParams.set('url', leagueUrl);
    url.searchParams.set('country', country);
    url.searchParams.set('season', season);
    callInsertNewLeague(url);
}

