function resolve(promise, x) {
  if (promise === x) {
    return promise.reject(new TypeError())
  }
  
  // make sure that a promise resolves only once
  var called = false
  
  // x maybe `null`
  if (x && (typeof x === 'function' || typeof x === 'object')) {
    try {
      // avoid calling getter multiple times
      var then = x.then
      
      if (typeof then === 'function') {
        then.call(x, function(y) {
          if (called) return 
          else        called = true
          
          resolve(promise, y)
        }, function(r) {
          if (called) return 
          else        called = true
          
          promise.reject(r)
        })
      } else {
        promise.fulfill(x)
      }
    } catch(e) {
      if (called) return 
      else        called = true
      
      promise.reject(e)
    }
  } else {
    promise.fulfill(x)
  }
}

function handle(onFulfilled, onRejected) {
  // unresolved promise 
  if (this._status === 'pending') {
    this._thens.push({
      onFulfilled: onFulfilled,
      onRejected: onRejected
    })
  } else {
    // already resolved promise
    setTimeout(function() {
      if (this._status === 'fulfill' && typeof onFulfilled === 'function') {
        onFulfilled(this._value)
      } else if (this._status === 'reject' && typeof onRejected === 'function') {
        onRejected(this._value)
      }
    }.bind(this))
  }
}

function Promise() {
  this._status = 'pending'
  
  this._thens = []
  
  this._handle = handle.bind(this)
}

Promise.prototype.fulfill = function(value) {
  if (this._status === 'pending') {
    this._status = 'fulfill'
    this._value = value
    
    setTimeout(function() {
      this._thens.forEach(function(then) {
        if (typeof then.onFulfilled === 'function') then.onFulfilled(value)
      })
      
      this._thens = []
    }.bind(this))
  }
  return this;
}

Promise.prototype.reject = function(value) {
  if (this._status === 'pending') {
    this._status = 'reject'
    this._value = value
    
    setTimeout(function() {
      this._thens.forEach(function(then) {
        if (typeof then.onRejected === 'function') then.onRejected(value)
      })
      
      this._thens = []
    }.bind(this))
  }
  return this;
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  var promise = new Promise()

  this._handle(function(x) {
    if (typeof onFulfilled === 'function') {
      try {
        resolve(promise, onFulfilled(x))
      } catch(e) {
        promise.reject(e)
      }
    } else {
      promise.fulfill(x)
    }
  }, function(x) {
    if (typeof onRejected === 'function') {
      try {
        resolve(promise, onRejected(x))
      } catch(e) {
        promise.reject(e)
      }
    } else {
      promise.reject(x)
    }
  })
  
  return promise
}


module.exports = Promise;