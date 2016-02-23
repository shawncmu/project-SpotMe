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
          $("div[name="+removeEvent+"]").remove();
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
        date: $('#addevent [name="date"]').val(),
        location: $('#addevent [name="location"]').val(),
        activity: $('#addevent [name="activity"]').val(),
        duration: $('#addevent [name="duration"]').val()
      };

      $.ajax({
        type: "POST",
        url: "/api/events",
        data: newEvent,
        success: function(response){

          var newli = "<div class=\"newBox col-xs-12\" name="+response.ops[0]._id+"><div class=\"col-xs-2 col-md-2 calender\">"+response.ops[0].event_date+"</div><div class=\"col-xs-6 col-md-6 details\"><p>Time:" +response.ops[0].event_time+"</p><p>Workout:"+ response.ops[0].event_type+"</p><p>Location:"+ response.ops[0].event_location+"</p></div><div class=\"col-xs-4 col-md-4 optionbuttons\"><button class=\"btn btn-danger delete-event\" data-id="+response.ops[0]._id+">Delete Session</button></div></div>"

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
    $('#searchevent').off().on('submit', function (e) {
      e.preventDefault();

        activity = $('#searchevent [name="activity"]').val();
        place = $('#searchevent [name="location"]').val();
        date = $('#searchevent [name="date"]').val();
        time = $('#searchevent [name="time"]').val();
        if(activity == null) {activity = ""};
        if(place == null) {place = ""};

        window.location.href = "/events/?activity="+activity+"&place="+place+"&date="+date+"&time"+time;
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

          $("#image-box").attr("src", response.image);
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