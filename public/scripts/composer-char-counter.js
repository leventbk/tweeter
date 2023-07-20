$(document).ready(function () {
  $("#tweet-text").on("keyup", function () {
    $(".counter").val(140 - $(this).val().length);

    // Color change to red if char size finished
    if ($(".counter").val() < 0) {
      $(".counter").css("color", "red");
    } else {
      $(".counter").css("color", "#545149");
    }
    // console.log($(".counter").val());
  });
});
