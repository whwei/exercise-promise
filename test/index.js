var promisesAplusTests = require('promises-aplus-tests')
//var promise = require('bluebird')
var promise = require('../index')

var adapter = {
  deferred: promise.defer
}

promisesAplusTests(adapter, function(err) {
  if (!err) console.log('done!')
  else      console.log(err)
})
