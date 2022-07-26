function modalBox(header, body) {

    if ($('#myModal.modal').length > 0) {
        $('#myModal.modal').replaceWith(setModalBoxInfo(header, body));
    } 

    $('body').append(setModalBoxInfo(header, body));

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("closeModal")[0];

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

}

function setModalBoxInfo(header, body) {
    return "<div id='myModal' class='modal'>" +
    "<!-- Modal content -->" +
    "<div class='modal-content'>" +
    "<div class='modal-header'>" +
    "<span class='closeModal'>&times;</span>" +
    "<h2 style='font-size: 99%; margin: 15px 0px; width: 80%'><b>" + header + "</b></h2>" +
    "</div>" +
    "<div class='modal-body'>" +
    "<p>" + body + "</p>" +
    "</div>" +
    "</div>" +
    "</div>";
}
