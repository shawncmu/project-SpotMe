$(document).ready(function () {
    var bindDeleteEvent = function () {
    $('.delete-event').off().on('click', function (e) {
      e.preventDefault();

      var removeEvent = $(this).data("id");
      $("#delete-modal").modal("show");
      bindConfirmDeleteEvent(removeEvent);

    });
  };

  var bindConfirmDeleteEvent = function (removeEvent) {
    $('#confirm-delete-event').off().on('click', function (e) {
      e.preventDefault();

      $.ajax({
        type: "DELETE",
        url: "/api/events",
        data: {removeEvent},
        success: function(response){
          console.log("Deleted");
          $("ul[name="+removeEvent+"]").remove();
          $("#delete-modal").modal("hide");
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  };

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
          console.log("added", response.ops[0]._id);
          var newli = "<ul name="+ response.ops[0]._id +"><li>"+ response.ops[0].creator_id +"</li><li>"+ response.ops[0].partner_id +"</li><li>"+ response.ops[0].event_time +"</li><li>"+ response.ops[0].event_type +"</li><li><button class=\"btn btn-danger delete-event\" data-id="+ response.ops[0]._id +">Delete Session</button></li></ul>"
          $("div[name=\"my-event-section\"]").append(newli);
          bindDeleteEvent();

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

        window.location.href = "/events/?activity="+activity+"&place="+place+"&dateAndTime="+dateAndTime;
    });
  };

  var bindJoinEvent = function () {
    $('.joinevent').on('click', function (e) {
      e.preventDefault();
      var selectedEvent = $(this).data("id");

      $.ajax({
        type: "PUT",
        url: "/api/joinevent",
        data: {selectedEvent},
        success: function(response){
          //$('#event-joined').modal('show');
          window.location.href = "/profile";
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  };

  var bindViewProfile = function () {
    $('.viewprofile').on('click', function (e) {
      e.preventDefault();
      var selectedProfile = $(this).data("id");

      $.ajax({
        type: "GET",
        url: "/api/viewprofile/"+selectedProfile,
        success: function(response){
          $("#view-profile [class=modal-title]").text(response.firstName+" "+response.lastName);
          $("#view-profile [name=dateofbirth]").text(response.dateOfBirth);
          $("#view-profile [name=experience]").text(response.experience);
          $("#view-profile [name=gender]").text(response.gender);
          $("#view-profile [name=height]").text(response.height);
          $("#view-profile [name=weight]").text(response.weight);
          $("#view-profile [name=memberships]").text(response.memberships);
          $('#view-profile').modal('show');
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
    bindJoinEvent();
    bindViewProfile();
    bindDeleteEvent();
  };

  init();
});