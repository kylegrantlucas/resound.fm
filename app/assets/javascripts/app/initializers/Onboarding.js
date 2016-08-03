var introJs = require('intro.js');
var API = require('app/lib/API');

module.exports = {
  onReady: function (curUser) {
    if (curUser.onboarding_id === 0) {
      return;
    }
    
    var intro = introJs.introJs();
    window.scrollTo(0, 0);
    $('body').addClass('onboarding');

    var clickBlock = function (e) {
      e.preventDefault();
      //e.stopPropagation();
    };

    var els = [
      document.querySelectorAll('.center-nav li')[1],
      document.querySelectorAll('.center-nav li')[4],
      document.querySelector('.footer-player .cur-song .info'),
      document.querySelector('.nav-user-menu-popover')
    ];

    _.each(els, function (el) {
      el.addEventListener('click', clickBlock);
    });

    function dismissOnboarding () {
      _.each(els, function (el) {
        el.removeEventListener('click', clickBlock);
      });

      $('body').removeClass('onboarding');
 
      API.put('/api/users/' + curUser.id, {onboarding_id: 0});
    }

    $('.navbar-right .new-post').click(function () {
      intro.exit();
      dismissOnboarding();
    });

    intro.oncomplete(function() {
      dismissOnboarding();
    });

    intro.onexit(function() {
      dismissOnboarding();
    });

    intro.setOptions({
      showStepNumbers: false,
      exitOnOverlayClick: false,
      scrollToElement: false,
      doneLabel: "I'll post later",
      steps: [
        {
          intro: "Hey, " + curUser.first_name + ".<br/>Welcome to resound.fm! Let us give you a few quick tips to get started."
        },
        { 
          element: document.querySelectorAll('.center-nav li')[1],
          intro: "Check out the explore page to find all the latest posts on resound.fm.",
          position: 'bottom-middle-aligned'
        },
        { 
          element: document.querySelectorAll('.center-nav li')[4],
          intro: "Use search to find users and hashtags such as <span class=\"hashtag\">#chill</span> or <span class=\"hashtag\">#indie</span>.",
          position: 'bottom-middle-aligned'
        },
        { 
          element: document.querySelector('.footer-player .cur-song .info'),
          intro: "Click on the song title to go to the currently playing song.",
          position: 'top'
        },
        { 
          element: document.querySelector('.nav-user-menu-popover'),
          intro: "Clicking on your user icon lets you view your page and find more people to follow.",
          position: 'bottom-right-aligned'
        },
        { 
          element: document.querySelector('.navbar-right .new-post'),
          intro: "You're ready to go! Click 'Post a song' to make your first post to your friends!",
          position: 'bottom-right-aligned'
        }
      ]
    });

    intro.start();
  }
}