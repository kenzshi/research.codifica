$(window).scroll(function(){
  if ($(document).scrollTop() <= 400) {
    $('#header_nav').removeClass('tiny');
  } else {
    $('#header_nav').addClass('tiny');
  }
});

$(document).ready(function() {
  $("#logo").click(function() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
  });
  $("#locations-link").click(function() {
    $('html, body').animate({
        scrollTop: $("#locations").offset().top - 100
    }, 500);
  });
  $("#about-link").click(function() {
    $('html, body').animate({
        scrollTop: $("#about").offset().top - 100
    }, 500);
  });
  $("#team-link").click(function() {
    $('html, body').animate({
        scrollTop: $("#team").offset().top - 100
    }, 500);
  });
});
