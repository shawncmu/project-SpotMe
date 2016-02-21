$(document).ready(function(){
  var bindSignup = function () {
    $('#signup').on('submit', function (e) {
      e.preventDefault();
      $('#signup-form-message').text('');

      var user = {
        email   : $('#signup [name="email"]').val(),
        firstName: $('#signup [name="firstname"]').val(),
        lastName: $('#signup [name="lastname"]').val(),
        //dateOfBirth: $('#signup [name="dob"]').val(),
        experience: $('#signup [name="experience"]').val(),
        gender: $('#signup [name="gender"]').val(),
        height: $('#signup [name="height"]').val(),
        weight: $('#signup [name="weight"]').val(),
        password: $('#signup [name="password"]').val()
      };

      $.ajax({
        method: "POST",
        url: '/api/signup',
        data: user,
        success: function (response) {
          //display welcome modal
          window.location.href = "/signin?message=Account Created, Please Sign In";
        },
        error: function (response) {
          console.log(response);
          var text = response.responseJSON ? response.responseJSON.message : response.responseText;
          $('#signup-form-message').text(text);
        }
      });
    });
  };

  var init = function () {
    bindSignup();
  };

  init();
});
