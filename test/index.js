var promisesAplusTests = require('promises-aplus-tests')
//var promise = require('bluebird')
var adapter = require('../adapter')

promisesAplusTests(adapter, function(err) {
  if (!err) console.log('done!')
  else      console.log(err)
})
