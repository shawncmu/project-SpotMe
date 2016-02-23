$(document).ready(function(){
  var bindEditUser = function () {
    $('#edituser').on('submit', function (e) {
      e.preventDefault();

      var user = {
        email: $('#edituser [name="email"]').val(),
        image: $('#edituser [name="image"]').val(),
        firstName: $('#edituser [name="firstName"]').val(),
        lastName: $('#edituser [name="lastName"]').val(),
        dateOfBirth: $('#edituser [name="dob"]').val(),
        experience: $('#edituser [name="experience"]').val(),
        gender: $('#edituser [name="gender"]').val(),
        height: $('#edituser [name="height"]').val(),
        weight: $('#edituser [name="weight"]').val(),
        memberships: $('#edituser [name="memberships"]').val(),
        password: $('#edituser [name="password"]').val()
      };

      $.ajax({
        method: "PUT",
        url: '/api/editmyprofile',
        data: user,
        success: function (response) {
          window.location.href = "/profile";
        },
        error: function (response) {
          console.log(response);
          var text = response.responseJSON ? response.responseJSON.message : response.responseText;
         // $('#signup-form-message').text(text);
        }
      });
    });
  };
var bindCancel = function () {
    $('#cancel').off().on('click', function (e) {
      e.preventDefault();
      window.location.href = "/profile";
    });
  };
  var init = function () {
    bindEditUser();
    bindCancel();
  };

  init();
});