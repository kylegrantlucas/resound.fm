// Toolbox.js uses the Backbone/Underscore extend method as well as the Cocktail mixins method
// to allow Inheritence and Mixin support for javascript objects.

(function () {
    "use strict";

    var Toolbox = window.Toolbox = {};

    //     Cocktail.js 0.5.3
    //     (c) 2012 Onsi Fakhouri
    //     Cocktail.js may be freely distributed under the MIT license.
    //     http://github.com/onsi/cocktail

    var Cocktail = {};

    Cocktail.mixins = {};

    Cocktail.mixin = function mixin(klass) {
        var mixins = _.chain(arguments).toArray().rest().flatten().value();
        // Allows mixing into the constructor's prototype or the dynamic instance
        var obj = klass.prototype || klass;

        var collisions = {};

        _(mixins).each(function(mixin) {
            if (_.isString(mixin)) {
                mixin = Cocktail.mixins[mixin];
            }
            _(mixin).each(function(value, key) {
                if (_.isFunction(value)) {
                    // If the mixer already has that exact function reference
                    // Note: this would occur on an accidental mixin of the same base
                    if (obj[key] === value) return;

                    if (obj[key]) {
                        collisions[key] = collisions[key] || [obj[key]];
                        collisions[key].push(value);
                    }
                    obj[key] = value;
                } else if (_.isArray(value)) {
                    obj[key] = _.union(value, obj[key] || []);
                } else if (_.isObject(value)) {
                    obj[key] = _.extend({}, value, obj[key] || {});
                } else if (!(key in obj)) {
                    obj[key] = value;
                }
            });
        });

        _(collisions).each(function(propertyValues, propertyName) {
            obj[propertyName] = function() {
                var that = this,
                    args = arguments,
                    returnValue;

                _(propertyValues).each(function(value) {
                    var returnedValue = _.isFunction(value) ? value.apply(that, args) : value;
                    returnValue = (typeof returnedValue === 'undefined' ? returnValue : returnedValue);
                });

                return returnValue;
            };
        });

        return klass;
    };

    // `ctor` and `inherits` are from Backbone (with some modifications):
    // http://documentcloud.github.com/backbone/

    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function () {};

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var inherits = function (parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call `super()`.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
          _.extend(child.prototype, protoProps);

          if (protoProps.mixins) {
            Cocktail.mixin(child, protoProps.mixins);
          }
        }



        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Self-propagating extend function.
    // Create a new class that inherits from the class found in the `this` context object.
    // This function is meant to be called in the context of a constructor function.
    function extendThis(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        child.extend = extendThis;
        return child;
    }

    // A primitive base class for creating subclasses.
    // All subclasses will have the `extend` function.
    // Example:
    //     var MyClass = Toolbox.Base.extend({
    //         someProp: 'My property value',
    //         someMethod: function () { ... }
    //     });
    //     var instance = new MyClass();
    Toolbox.Base = function () {}
    Toolbox.Base.extend = extendThis;
})();
