module.exports = {
    componentDidMount: function() {
      this._routerPopstateListener = function (e) {
        this.getFlux().actions.navigate(window.location.pathname, {popstate: true});   
      }.bind(this);
      window.addEventListener('popstate', this._routerPopstateListener);
    },
    componentWillUnmount: function() {
      window.removeEventListener('popstate', this._routerPopstateListener);
      this._routerPopstateListener = null;
    }
};