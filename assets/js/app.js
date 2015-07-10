$(function() {
  $(window).on('scroll', function() {
    var st = $(window).scrollTop();
    $('.navbar').css({ 'background-color' : 'rgba(10,10,10,' + Math.min(0.90, st/220) + ')' });
    $('.navbar-brand').css({ 'opacity' : Math.min(1, st/220)});
  });

  $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - $('#navbar').height()
      }, 600, 'easeInOutCubic');
      event.preventDefault();
  });
});
