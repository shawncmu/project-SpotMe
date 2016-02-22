$(document).ready(function(){
  var bindSignup = function () {
    $('#signup').on('submit', function (e) {
      e.preventDefault();
      $('#signup-form-message').text('');

      var user = {
        firstName: $('#firstname').val(),
        lastName: $('#lastname').val(),
        email   : $('#email').val(),
        password: $('#password').val(),
        dateOfBirth: $('#dob').val(),
        gender: $('#genderM').val() || $('#genderF').val(),
        experience: "",
        height: "",
        weight: "",
        memberships: [],
        rating: 0,
        image: "http://i1.wp.com/www.techrepublic.com/bundles/techrepubliccore/images/icons/standard/icon-user-default.png"
      };

      $.ajax({
        method: "POST",
        url: '/api/signup',
        data: user,
        success: function (response) {
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
