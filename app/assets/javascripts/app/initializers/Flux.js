React.createFluxClass = function(spec) {
  var currentMixins = spec.mixins || [];

  spec.mixins = currentMixins.concat([Fluxxor.FluxChildMixin(React)]);

  return React.createClass(spec);
};