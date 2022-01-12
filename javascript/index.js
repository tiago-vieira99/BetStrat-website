// Notification.requestPermission();
//
// var interval = setInterval(test, 10000);
//
// function test() {
//   if ('Notification' in window) {
//     if (window.Notification.permission === 'granted') {
//       new window.Notification('Time is over!');
//     }
//   }
// }

function getBackup() {
  fetch("http://" + API_URL + "/api/betstrat/backup", {
      method: 'GET',
      headers: { 'Accept': '*/*',
    'Access-Control-Allow-Origin':'*'}
    })
    .then(function(response) {
      response.text().then(function (text) {
        var myblob = new Blob([text], {
            type: 'text/plain'
        });
        downloadBlob(myblob, 'backup.csv')
      })
      // reader = response.body.getReader();
      // reader.read().then(stream => new Response(stream))
      //   .then(response => response.blob())
      //   .then(blob => downloadBlob(blob, 'backup.csv'))
    })
    .then(function(resp) {


    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function downloadBlob(blob, name = 'file.txt') {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}
