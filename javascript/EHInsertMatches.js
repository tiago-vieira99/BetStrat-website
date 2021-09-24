const map1 = new Map();
var count = 0;
info();
var matches;


setTimeout(function() {
  addBtnListeners();
}, 1000);


function addBtnListeners() {
  var allButtons = document.querySelectorAll('.oddbtn');
  console.log("length: " + allButtons.length);
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      var matchId = getBtnId(this);
      var odd = document.querySelector('#insOdd' + matchId).value;
      var match = map1.get(matchId);
      match.drawOdds = odd;
      httpPost(match);
    });
  }
}


function httpPost(match) {
  var url = "http://" + API_URL + "/api/betstrat/eurohandicap/match"

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
        alert(data.error + "\n" + data.message);
      } else {
        alert("Stake: " + data.stake);
        console.log(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


function getBtnId(elt) {
  // Traverse up until root hit or DIV with ID found
  while (elt && (elt.tagName != "DIV" || !elt.id))
    elt = elt.parentNode;
  if (elt) // Check we found a DIV with an ID
    return elt.id;
}


function info() {
  fetch("http://" + API_URL + "/api/betstrat/eurohandicap/nextmatches")
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


function addMatchDiv(idMatch, date, homeTeam, awayTeam) {
  $(document).ready(function() {
    $('.nextMatchesDiv').append(
      '<div id="' + idMatch + '" style="margin: 15px 0px 40px;" class="u-clearfix u-custom-color-2 u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-gutter-0 u-layout-wrap u-layout-wrap-1"><div class="u-gutter-0 u-layout"><div class="u-layout-row"><div class="u-align-left u-container-style u-layout-cell u-size-13 u-layout-cell-1"><div class="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-xl u-container-layout-1"><p class="u-align-center u-text u-text-grey-80 u-text-1">' + date + '</p></div></div><div class="u-align-left u-container-style u-layout-cell u-size-27 u-layout-cell-2"><div class="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xl u-container-layout-2"><p class="u-align-center u-text u-text-default-lg u-text-default-md u-text-default-sm u-text-default-xl u-text-grey-75 u-text-2">' + homeTeam + ' Vs ' + awayTeam + '</p></div></div><div class="u-container-style u-layout-cell u-size-20 u-layout-cell-3"><div class="u-container-layout u-valign-middle-md u-valign-top-sm u-valign-top-xs u-container-layout-3"><div class="u-align-center-sm u-align-center-xs u-form u-form-1"><form action="#" method="POST" class="u-clearfix u-form-horizontal u-form-spacing-9 u-inner-form" source="joomla" name="form" style="padding: 10px;"><div class="u-form-group"><label for="name-f32e" class="u-form-control-hidden u-label"></label><input type="text" placeholder="odd" id="insOdd' + idMatch + '" name="name" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white u-input-1" required="required"></div><div class="u-align-left u-form-group u-form-submit"><a class="u-border-none u-btn u-btn-round u-btn-submit u-button-style u-custom-color-3 u-radius-50 u-btn-1 oddbtn">Insert</a></div></form></div></div></div></div></div>'
    );
  });
}
