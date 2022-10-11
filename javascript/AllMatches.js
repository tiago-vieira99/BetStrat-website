var strategyPath = "";
if (ONLY_DRAWS_ID == currentStrategy) {
    strategyPath = ONLY_DRAWS_PATH;
} else if (EURO_HANDICAP_ID == currentStrategy) {
    strategyPath = EURO_HANDICAP_PATH;
} else if (DRAWS_HUNTER_ID == currentStrategy) {
  strategyPath = DRAWS_HUNTER_PATH;
}

const map1 = new Map();
var count = 0;
callGetAllMatchesInfo(strategyPath);
var matches;
var matchesArray = []
// State
// Number of products
var numberOfItems = matchesArray.length
const numberPerPage = 50
const currentPage = 1
// Number of pages
var numberOfPages = 1;


setTimeout(function() {

  numberOfPages = Math.ceil(matchesArray.length / numberPerPage);

  buildPage(1);
  addBtnListeners();
  buildPagination(currentPage);

  $('.paginator').on('click', 'button', function() {
    var clickedPage = parseInt($(this).val())
    buildPagination(clickedPage)
    console.log(`Page clicked on ${clickedPage}`)
    buildPage(clickedPage)
  });
}, 1500);


function addBtnListeners() {
  var allUpdateButtons = document.querySelectorAll('.updateBtn');
  var allDeleteButtons = document.querySelectorAll('.deleteBtn');

  console.log("length: " + allUpdateButtons.length);
  console.log("length: " + allDeleteButtons.length);
  for (var i = 0; i < allUpdateButtons.length; i++) {
    allUpdateButtons[i].addEventListener('click', function() {
      var matchId = getBtnId(this);
      var result = document.querySelector('#ftresult' + matchId).value;
      var match = map1.get(matchId); //only accept on null FTresult matches
      callPutUpdateMatch(strategyPath, match.id, result);
    });
  }

  for (var i = 0; i < allDeleteButtons.length; i++) {
    allDeleteButtons[i].addEventListener('click', function() {
      if (deleteConfirmation(this)) {
        var matchId = getBtnId(this);
        var match = map1.get(matchId);
        callDeleteMatch(strategyPath, match.id);
      }
    });
  }
}

function deleteConfirmation(Btn) {
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


function addMatchLine(idMatch, match) {
  matchesArray.push('<tr id="' + idMatch + '" style="height: 74px; background-color: '+matchBackgroundColor(match)+';"><td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <form><input class="deleteBtn" type=button value="❌" style="max-width:80%; position: center;"></form> </td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + match.date + '</td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell" style="text-align: center;"><b>' + match.homeTeam + "&nbsp &nbsp - &nbsp &nbsp" + match.awayTeam + '</b></td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + match.ftresult + '</td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + match.odd + '</td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + match.stake + '</td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell">' + match.seqLevel + '</td> ' +
    '<td class="u-border-1 u-border-grey-40 u-border-no-left u-border-no-right u-table-cell"> <table>  <tr><td style="padding: 0px;"><input id="ftresult' + idMatch + '" type="text" placeholder="result" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white u-input-1" required="required"></td> <td> <form><input class="updateBtn" type=button value="✔️" style="width:100%"></form></td> </tr></table></td> </tr>');
}


function matchBackgroundColor(match) {
  if (match.ftresult != null) {
    if (match.ftresult == 'X' || match.ftresult == '+1' || match.ftresult == '+2') {
      return '#afdfbd'
    } else {
      return '#e3c0c1'
    }
  } else {
    return '#e5f6f0'
  }
}

function buildPage(currPage) {
  const trimStart = (currPage - 1) * numberPerPage
  const trimEnd = trimStart + numberPerPage
  console.log(trimStart, trimEnd)
  // console.log(matchesArray.slice(trimStart, trimEnd))
  $('.all-matches-table').empty().append(matchesArray.slice(trimStart, trimEnd))
  // $('.grid-uniform').empty().append(listArray.slice(trimStart, trimEnd));
}

function accomodatePage(clickedPage) {
  if (clickedPage <= 1) {
    return clickedPage + 1
  }
  if (clickedPage >= numberOfPages) {
    return clickedPage - 1
  }
  return clickedPage
}

function buildPagination(clickedPage) {
  $('.paginator').empty().append(`<p><i>Pages: </i></p>`)
  const currPageNum = accomodatePage(clickedPage)
  if (numberOfPages >= 3) {
    for (let i = -1; i < 2; i++) {
      $('.paginator').append(`<button class="btn btn-secondary" style="margin: 5px;" value="${currPageNum+i}">${currPageNum+i}</button>`)
    }
  } else {
    for (let i = 0; i < numberOfPages; i++) {
      $('.paginator').append(`<button class="btn btn-secondary" style="margin: 5px;" value="${i+1}">${i+1}</button>`)
    }
  }
}
