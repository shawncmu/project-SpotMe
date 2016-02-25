$(document).ready(function () {
  var bindUnjoinEvent = function () {
    $('.unjoin-event').off().on('click', function (e) {
      e.preventDefault();

      var unjoinEvent = $(this).data("id");
      $("#unjoin-modal").modal("show");
      bindConfirmUnjoinEvent(unjoinEvent);

    });
  };
  var bindConfirmUnjoinEvent = function (unjoinEvent) {
    $('#confirm-unjoin-event').off().on('click', function (e) {
      e.preventDefault();

      $.ajax({
        type: "DELETE",
        url: "/api/unjoinevents",
        data: {unjoinEvent},
        success: function(response){
          console.log("Unjoined");
          $("div[name="+unjoinEvent+"]").remove();
          $("#unjoin-modal").modal("hide");
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  };

  var init = function () {
    bindUnjoinEvent();
  };

  init();
});