const map1 = new Map();
var count = 0;
info();
var matches;

function info() {
  fetch("http://" + API_URL + "/api/betstrat/drawfiboseq/matches")
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      matches = resp;

      matches.sort(function(a, b) {
        var dateA = a.id,
          dateB = b.id;
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });
      matches.forEach(function(match) {
        var idMatch = "idmatch" + count++;
        map1.set(idMatch, match);
        addMatchLine(idMatch, match);
      });

      console.log(map1);

    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function addMatchLine(idMatch, match) {
  $(document).ready(function() {
    $('.all-matches-table').append(
      '<tr style="height: 74px;"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <form><input type=submit value="❌" style="max-width:80%; position: center;"></form> </td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">'+match.date+'</td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"><b>'+match.homeTeam+"&nbsp &nbsp - &nbsp &nbsp"+match.awayTeam+'</b></td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">'+match.ftresult+'</td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">'+match.drawOdds+'</td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">'+match.stake+'</td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">'+match.seqLevel+'</td> '+
      '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <table>  <tr><td style="padding: 0px;"><input type="text" placeholder="result" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white u-input-1" required="required"></td> <td> <form><input type=submit value="✔️" style="width:100%"></form></td> </tr></table></td> </tr>'
    );
  });
}