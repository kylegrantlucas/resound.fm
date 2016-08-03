// There is no good reason this is necessary since jQuery is loaded in the head, but something has gone awry.

$(document).ready(function() {
  // Setup FlowType
  $('body').flowtype({
    minimum : 600,
    maximum : 1200,
    minFont : 22,
  });
});

$(window).load(function() {
  $('body').css('opacity', '1');
});