'use strict';

exports = module.exports = function(config) {
  return {
    debug: function() {
      if (!config.logging.debug) {
        return;
      }

      console.log.apply(this, arguments);
    },
    error: function() {
      if (!config.logging.error) {
        return;
      }

      console.error.apply(this, arguments);
    }
  };
};
