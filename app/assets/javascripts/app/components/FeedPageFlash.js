/** @jsx React.DOM */
var Button = require('app/components/Buttons/SimpleButton');
var DeleteBtn = require('app/components/Buttons/DeleteBtn');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = React.createClass({

  closeFlash: function (e) {
    this.props.curUser.save({feed_page_flash_id: 0});
  },

  render: function () {
    var curUser = this.props.curUser;
    var flash = curUser.feed_page_flash_id;

    if (flash === 0) {
        return <div/>;
    }

    var design;

    switch (flash) {
    case 1:
      design = (
        <div>
          <h3>
            {"Let the world know who " + UserHelpers.fullName(curUser) + " is!"}
          </h3>
          <Button red href={UserHelpers.profileUrl(curUser)} icon="pencil" className="flash-btn">Add your bio</Button>
        </div>
      );
      break;
    default:
      return <div/>;
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="flash feed-page-flash">
            {design}
            <DeleteBtn large model={undefined} onDelete={this.closeFlash}/>
          </div>
        </div>
      </div>
    );

  }

});
