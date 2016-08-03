Tooltip.defaults = {
    baseClass:   'g-tooltip', // Base tooltip class name.
    typeClass:   null,      // Type tooltip class name.
    effectClass: null,      // Effect tooltip class name.
    inClass:     'in',      // Class used to transition stuff in.
    place:       'top',     // Default place.
    spacing:     null,      // Gap between target and tooltip.
    auto:        0          // Whether to automatically adjust place to fit into window.
};

window.gTooltip = new Tooltip();
window.gTooltipOwner = null;