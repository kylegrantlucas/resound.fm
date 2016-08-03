/** @jsx React.DOM */
var BigCard = require('app/components/BigCard/BigCard');
var Spinner = require('app/components/Spinner');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('PagePosts')],

  componentWillMount: function () {
    _.defer(this.getFlux().actions.setPage, 'post', {postId: this.props.id});
    _.defer(this.getFlux().actions.fetchPost(parseInt(this.props.postId)));
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('PagePosts');

    return {
      post: store.getPost(parseInt(this.props.postId))
    };
  },

  render: function () {
    var post = this.state.post;
    var curUser = this.props.curUser;

    if (post) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className='feed'>
                <BigCard post={post} curUser={curUser} playState={0} key={post.id}/>
              </div>
            </div>
          </div>
        </div>
        );
    } else {
      return <Spinner />;
    }

  }

});
