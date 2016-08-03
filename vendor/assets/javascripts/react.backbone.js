(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['backbone', 'react/react'], factory);
  } else {
    // Browser globals
    root.amdWeb = factory(root.Backbone, root.React);
  }
}(this, function (Backbone, React) {

  React.BackboneMixin = {

    // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    _getNested: function (o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      while (a.length) {
        var n = a.shift();
        if (n in o) {
          o = o[n];
        } else {
          return;
        }
      }
      return o;
    },

    _subscribe: function(model, events) {
      // Whenever there may be a change in the Backbone data, trigger a reconcile.

      if (model instanceof Backbone.Collection) {
        var _throttledForceUpdate = _.debounce(this.forceUpdate.bind(this, null),  10);

        if (!events || events === 'default') {
          events = 'add remove reset sort';
        }

        model.on(events, _throttledForceUpdate, this);

      } else if (model instanceof Backbone.Model) {

        if (!events || events === 'default') {
          events = 'change';
        }

        model.on(events, function () { this.forceUpdate(); }, this);

      } else if (typeof model.on === 'function' && typeof model.off === 'function') {
        if (!events || events === 'default') {
          events = 'change';
        }

        model.on(events, function () { this.forceUpdate(); }, this);
      } else {
        console.error('Invalid Backbone model being watched in component.', this);
      }
    },

    _subscribeAll: function () {
      _.each(this.backboneEvents, function (events, prop) {
        this._subscribe(this._getNested(this.props, prop), events);
      }, this);
    },

    _unsubscribe: function(model) {
      model.off(null, null, this);
    },

    _unsubscribeAll: function () {
      // Ensure that we clean up any dangling references when the component is
      // destroyed.
      _.each(this.backboneEvents, function (events, prop) {
        this._unsubscribe(this._getNested(this.props, prop));
      }, this);
    },

    componentDidMount: function() {
      // Whenever there may be a change in the Backbone data, trigger a reconcile.
      this._subscribeAll();
    },

    componentWillReceiveProps: function(nextProps) {

      _.each(this.backboneEvents, function (events, prop) {
        var model = this._getNested(this.props, prop);
        var nextModel = this._getNested(nextProps, prop);

        if (model !== nextModel) {
          this._unsubscribe(model);
          this._subscribe(nextModel, events);
        }
      }, this);

    },

    componentWillUnmount: function() {
      // Ensure that we clean up any dangling references when the component is destroyed.
      this._unsubscribeAll();
    }

  };

  React.createBackboneClass = function(spec) {
    var currentMixins = spec.mixins || [];

    spec.mixins = currentMixins.concat([React.BackboneMixin]);
    spec.el = function() {
      return this.isMounted() && this.getDOMNode();
    };

    return React.createClass(spec);
  };

  return React;

}));