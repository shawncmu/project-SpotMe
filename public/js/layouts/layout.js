$(document).ready(function () {
  var bindSignout = function () {
    $('#signout-btn').on('click', function (e) {
      $.ajax({
        type: "DELETE",
        url: "/api/signout",
        success: function (response) {
          window.location.href = '/';
        }
      });
    });
  };

  var bindTodaySearch = function () {
    $('#today-search').off().on('click', function (e) {
        var date = new Date(Date.now());
        // var dd = date.getDate();
        // var mm = date.getMonth()+1;
        // if(dd<10){dd = '0' + dd};
        // if(mm<10){mm = '0' + mm};
        // var yyyy = date.getFullYear();
        // var today = yyyy+"-"+mm+"-"+dd;

        $('#searchevent [name="navdate"]').val(date);
        $("#searchevent").submit();
    });
  };



  var init = function () {
    bindSignout();
    bindTodaySearch();
  };

  init();
});