/** @jsx React.DOM */
var LayeredComponentMixin = require('app/mixins/LayeredComponentMixin');

var ModalBG = React.createClass({
    
    killClick: function(e) {
      // clicks on the content shouldn't close the modal
      e.stopPropagation();
    },

    handleBackdropClick: function() {
      // when you click the background, the user is requesting that the modal gets closed.
      // note that the modal has no say over whether it actually gets closed. the owner of the
      // modal owns the state. this just "asks" to be closed.
      this.props.onRequestClose();
    },

    render: function() {

      var cx = React.addons.classSet;
      var bgClasses = cx({
        'modal-bg': true,
        'modal-show': this.props.shown
      });

      return this.transferPropsTo(
        <div className={bgClasses} onClick={this.handleBackdropClick}>
            <div className="modal-inner" onClick={this.killClick}>
                {this.props.children}
            </div>
        </div>
      );
    }
});

module.exports = React.createClass({
    
    mixins: [LayeredComponentMixin],
    
    handleClick: function() {
      this.setState({shown: !this.state.shown});
    },

    getInitialState: function() {
      return {shown: false};
    },

    componentDidUpdate: function () {
      $('#app').toggleClass('modal-blur', this.state.shown);

    },

    renderLayer: function() {
      var content = this.state.shown ? this.props.modalContent : <span />;

      return (
        <ModalBG shown={this.state.shown} onRequestClose={this.handleClick}>
          {content}
        </ModalBG>
      );
    },

    render: function() {
      return React.addons.cloneWithProps(React.Children.only(this.props.children), {onClick: this.handleClick});
    }
});
