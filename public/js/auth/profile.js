$(document).ready(function () {
  var bindDeleteEvent = function () {
    $('.delete-event').on('click', function (e) {
      e.preventDefault();

      var removeEvent = $(this).data("id");
      $("#delete-modal").modal("show");
      bindConfirmDeleteEvent(removeEvent);

    });
  };
  var bindConfirmDeleteEvent = function (removeEvent) {
    $('#confirm-delete-event').on('click', function (e) {
      e.preventDefault();
      console.log(removeEvent);
      // $.ajax({
      //   type: "DELETE",
      //   url: "/api/events",
      //   data: {removeEvent},
      //   success: function(response){
      //     console.log("added");
      //   },
      //   error: function(response){
      //     console.log(response);
      //   }
      // });
    });
  };










  // var bindSearchEvent = function () {
  //   $('#searchevent').on('submit', function (e) {
  //     e.preventDefault();

  //       activity = $('#searchevent [name="activity"]').val();
  //       place = $('#searchevent [name="location"]').val();
  //       dateAndTime = $('#searchevent [name="dateTime"]').val();

  //       window.location.href = "/events/?activity="+activity+"&place="+place+"&dateAndTime="+dateAndTime;
  //   });
  // };

  // var bindJoinEvent = function () {
  //   $('.joinevent').on('click', function (e) {
  //     e.preventDefault();
  //     var selectedEvent = $(this).data("id");

  //     $.ajax({
  //       type: "PUT",
  //       url: "/api/joinevent",
  //       data: {selectedEvent},
  //       success: function(response){
  //         //$('#event-joined').modal('show');
  //         window.location.href = "/profile";
  //       },
  //       error: function(response){
  //         console.log(response);
  //       }
  //     });
  //   });
  // };

  // var bindViewProfile = function () {
  //   $('.viewprofile').on('click', function (e) {
  //     e.preventDefault();
  //     var selectedProfile = $(this).data("id");

  //     $.ajax({
  //       type: "GET",
  //       url: "/api/viewprofile/"+selectedProfile,
  //       success: function(response){
  //         $("#view-profile [class=modal-title]").text(response.firstName+" "+response.lastName);
  //         $("#view-profile [name=dateofbirth]").text(response.dateOfBirth);
  //         $("#view-profile [name=experience]").text(response.experience);
  //         $("#view-profile [name=gender]").text(response.gender);
  //         $("#view-profile [name=height]").text(response.height);
  //         $("#view-profile [name=weight]").text(response.weight);
  //         $("#view-profile [name=memberships]").text(response.memberships);
  //         $('#view-profile').modal('show');
  //       },
  //       error: function(response){
  //         console.log(response);
  //       }
  //     });
  //   });
  // };



  var init = function () {
    bindDeleteEvent();
    //bindUnjoinEvent();
  };

  init();
});