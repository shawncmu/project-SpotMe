$(document).ready(function () {
  var bindAddEvent = function () {
    $('#addevent').on('submit', function (e) {
      e.preventDefault();

      var newEvent = {
        timing: $('#addevent [name="time"]').val(),
        activity: $('#addevent [name="event"]').val()
      };

      $.ajax({
        type: "POST",
        url: "/api/events",
        data: newEvent,
        success: function(response){
          console.log("added");
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  };

  var bindSearchEvent = function () {
    $('#searchevent').on('submit', function (e) {
      e.preventDefault();

        activity = $('#searchevent [name="activity"]').val();
        place = $('#searchevent [name="location"]').val();
        dateAndTime = $('#searchevent [name="dateTime"]').val();
        console.log(activity, place, dateAndTime);

        window.location.href = "/events/?activity="+activity+"&place="+place+"&dateAndTime="+dateAndTime;
    });
  };

  var init = function () {
    bindAddEvent();
    bindSearchEvent();
  };

  init();
});