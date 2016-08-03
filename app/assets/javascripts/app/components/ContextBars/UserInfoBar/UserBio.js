/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');
var Callout = require('app/components/Callout');
var Button = require('app/components/Buttons/SimpleButton');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = React.createFluxClass({

  getInitialState: function () {
    return {
      editing: false
    };
  },

  edit: function (e) {
    e.preventDefault();
    this.setState({
      editing: true
    });
  },

  save: function (e) {
    e.preventDefault();

    var self = this;

    this.getFlux().actions.updateBio(this.refs.bio.getDOMNode().value);

    this.setState({
      editing: false
    });
  },

  cancel: function (e) {
    e.preventDefault();
    this.setState({
      editing: false
    });
  },

  dismissCallout: function(e) {
    e.preventDefault();
    this.getFlux().actions.dismissBioCallout();
  },

  render: function() {
    var user = this.props.user;
    var curUser = this.props.curUser;
    var isCurUser = user.id === curUser.id;

    var bio = isCurUser ? curUser.bio : user.bio;

    if (this.state.editing) {
      return (
        <div className="user-bio">
          <textarea ref="bio" placeholder={"Who is " + UserHelpers.fullName(curUser) + "?"} defaultValue={bio} maxLength="80" />
          <Button color="green" onClick={this.save} className="save pull-right">Save</Button>
          <Button color="grey" onClick={this.cancel} className="cancel pull-right">Cancel</Button>
        </div>
      );
    } else if (isCurUser && (!bio || bio === "")) {
      return (
        <div className="user-bio">
          <a href="" className="edit-bio-btn no-bio" onClick={this.edit}><i className="fa fa-pencil"/>Edit Bio</a>
          <Callout visible={curUser.user_page_bio_callout_id === 1} top left width={175}onDismiss={this.dismissCallout}>
            <div>
              <p>Let the world know what you listen to.</p>
              <Button color="red" fullWidth onClick={this.dismissCallout} className="pull-right">Got it.</Button>
            </div>
          </Callout>
        </div>
      );
    } else {
      return this.transferPropsTo(
        <div className="user-bio">
          <p>
            {bio}
            {ViewHelpers.showIf(user.id === curUser.id, <a href="" className="edit-bio-btn" onClick={this.edit}><i className="fa fa-pencil"/>Edit Bio</a>)}
          </p>
        </div>
      );
    }
  }
});
