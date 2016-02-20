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

      var findEvent = {
        activity: $('#searchevent [name="activity"]').val(),
        location: $('#searchevent [name="location"]').val(),
        dateTime: $('#searchevent [name="dateTime"]').val()
      };

      $.ajax({
        type: "GET",
        url: "/events",
        data: findEvent,
        success: function(response){
          console.log("found");
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  };

  var init = function () {
    bindAddEvent();
    bindSearchEvent();
  };

  init();
});