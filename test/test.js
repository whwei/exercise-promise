var Promise = require('../index')

var deferred = Promise.defer

var resolved = deferred().resolve
var rejected = deferred().reject

var dummy = { dummy: "dummy" }

function testPromiseResolution(xFactory, test) {
  var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
      return xFactory();
  });

  test(promise);
  
  // promise = rejected(dummy).then(null, function onBasePromiseRejected() {
  //     return xFactory();
  // });

  // test(promise);
}

var numberOfTimesThenWasRetrieved = 0;

function xFactory() {
    return Object.create(null, {
        then: {
            get: function () {
                ++numberOfTimesThenWasRetrieved;
                return function thenMethodForX(onFulfilled) {
                    onFulfilled();
                };
            }
        }
    });
}

testPromiseResolution(xFactory, function (promise, done) {
    promise.then(function () {
        console.log(numberOfTimesThenWasRetrieved, 1);
    });
});