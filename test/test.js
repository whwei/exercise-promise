var Promise = require('../adapter')

var deferred = Promise.deferred

var resolved = Promise.resolved
var rejected = Promise.rejected

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

var md = {tset:'test'}

function xFactory() {
    return {
        then: function (onFulfilled) {
            onFulfilled(yFactory(md));
        }
    }
}

function yFactory(value) {
    return {
        then: function (onFulfilled) {
            onFulfilled(value);
        }
    }
}

// testPromiseResolution(xFactory, function (promise, done) {
//     promise.then(function (value) {
//         console.log(value, md);
//     });
// });

resolved(null).then(function() {
    return {
        then: function (onFulfilled) {
            onFulfilled(function() {
                return {
                    then: function (onFulfilled) {
                        onFulfilled(md)
                    }
                }
            });
        }
    }
}).then(function(value) {
    console.log('result', value, md)
})