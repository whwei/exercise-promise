var Target = require('./index');

module.exports = {
  deferred: function() {
    var target = new Target();
    return {
      promise: target,
      resolve: target.fulfill.bind(target),
      reject: target.reject.bind(target)
    };
  }
};