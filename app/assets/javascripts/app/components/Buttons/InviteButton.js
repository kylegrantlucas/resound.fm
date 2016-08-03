/** @jsx React.DOM */
var SimpleButton = require('app/components/Buttons/SimpleButton');

var InviteButton = React.createFluxClass({

  inviteUsers: function () {
    window.scrollTo(0, 0);
    $('body').addClass('onboarding');
    ga('send', 'event', 'Invites', 'Opened Dialog');

    FB.ui({method: 'send',
      link: "http://resound.fm"
    }, function(){
        $('body').removeClass('onboarding');
    });
  },

  render: function () {
    return this.transferPropsTo(
      <SimpleButton color='dark-grey' fullWidth icon='users' filled={false} text='Invite Facebook Friends' onClick={this.inviteUsers}/>
    );
  }
});

module.exports = InviteButton;
