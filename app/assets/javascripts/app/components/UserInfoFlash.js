/** @jsx React.DOM */
var Button = require('app/components/Buttons/SimpleButton');
var DeleteBtn = require('app/components/Buttons/DeleteBtn');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = React.createClass({

  closeFlash: function (e) {
    this.props.curUser.save({user_page_flash_id: 0});
  },

  render: function () {
    var curUser = this.props.curUser;
    var flash = curUser.user_page_flash_id;
    var user = this.props.user;

    if (flash === 0 || user.id !== curUser.id) {
      return <div/>;
    }

    var design;

    switch (flash) {
    case 1:
      design = (
        <div>
          <h3>
            {"Let the world know who " + curUser.fullName() + " is!"}
          </h3>
          <Button color="red" href={UserHelpers.profileUrl(curUser)} icon="pencil" className="flash-btn">Add your bio</Button>
        </div>
      );
      break;
    default:
      return <div/>;
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="flash user-info-flash">
            {design}
            <DeleteBtn large model={undefined} onDelete={this.closeFlash}/>
          </div>
        </div>
      </div>
    );

  }

});
