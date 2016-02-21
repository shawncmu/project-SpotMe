$(document).ready(function(){
  var bindSignup = function () {
    $('#signup').on('submit', function (e) {
      e.preventDefault();
      $('#signup-form-message').text('');

      var user = {
        email   : $('#signup [name="email"]').val(),
        firstName: $('#signup [name="firstname"]').val(),
        lastName: $('#signup [name="lastname"]').val(),
        gender: $('#signup [name="gender"]').val(),
        password: $('#signup [name="password"]').val(),
        dateOfBirth: $('#signup [name="dob"]').val(),
        experience: "",
        height: "",
        weight: "",
        memberships: ""
      };

      $.ajax({
        method: "POST",
        url: '/api/signup',
        data: user,
        success: function (response) {
          //display welcome modal
        $('#signin [name="email"]').val(user.email);
        $('#signin [name="password"]').val(user.password);
        $("#signin").submit();
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
