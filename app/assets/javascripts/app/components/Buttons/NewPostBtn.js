/** @jsx React.DOM */
var ModalTrigger = require('app/components/Modals/ModalTrigger');

module.exports = React.createFluxClass({

    onClick: function (e) {
      e.preventDefault();
      this.getFlux().actions.showPostModal();
    },
    
    render: function() {
      return (
        <a href='' onClick={this.onClick}>Post a song</a>
      );
    }
});


