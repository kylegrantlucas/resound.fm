/** @jsx React.DOM */
var NewPostForm = require('app/components/NewPostForm/NewPostForm');

module.exports =  React.createFluxClass({

    killClick: function(e) {
      // clicks on the content shouldn't close the modal
      e.stopPropagation();
    },

    handleBackdropClick: function() {
      this.getFlux().actions.closeNewPostModal();
    },

    componentDidMount: function () {
      window.addEventListener('keydown', this.onEscape);
    },

    componentWillUnmount: function () {
      window.removeEventListener('keydown', this.onEscape);
    },

    onEscape: function (e) {
      var newPostForm = this.props.newPostForm;
      if (e.keyCode === KeyEvent.DOM_VK_ESCAPE && newPostForm.modalShown) {
        this.getFlux().actions.closeNewPostModal();
      } 
    },

    render: function() {
      var newPostForm = this.props.newPostForm;

      var cx = React.addons.classSet;
      var bgClasses = cx({
        'modal-bg': true,
        'modal-show': newPostForm.modalShown
      });

      return (
        <div className={bgClasses} onClick={this.handleBackdropClick}>
          <div className="modal-inner" onClick={this.killClick}>
            <NewPostForm newPostForm={newPostForm} preview={this.props.preview}/>
          </div>
        </div>
      );
    }
});