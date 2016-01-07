var Promise = function() {
  this.status = 'pending'

  this._queue = []
}

Promise.defer = function() {
  var promise = new Promise()
  return {
    promise: promise,
    resolve: promise.resolve.bind(promise),
    reject: promise.reject.bind(promise)
  }
}

Promise.prototype.resolve = function(value){
  if (this.status !== 'pending') return
  
  this.status = 'fulfilled'
  this.value = value
  
  setImmediate(function() {
    this._handle()
  }.bind(this))
  
  return this
};


Promise.prototype.reject = function(reason){
  if (this.status !== 'pending') return
  
  this.status = 'rejected'
  this.reason = reason
  
  setImmediate(function() {
    this._handle()
  }.bind(this))
  
  return this
};

Promise.prototype.then = function(onResolved, onRejected) {
  var handle = this._handle.bind(this)

  onResolved = typeof onResolved === 'function' ? onResolved : null
  onRejected = typeof onRejected === 'function' ? onRejected : null

  var thenable = {
    resolve: onResolved,
    reject: onRejected
  }

  if (this.status !== 'pending') {
    setImmediate(function() {
      handle()
    })
  }
  
  thenable.promise = new Promise()

  this._queue.push(thenable)

  return thenable.promise
}

Promise.prototype._handle = function() {
  if (this._queue.length <= 0) return
  var thenable,
      i
      
  for (i = 0; i < this._queue.length;) {
    thenable = this._queue[i]
    
    var promise = thenable.promise
    var onResolve = thenable.resolve
    var onReject = thenable.reject
    var ret
    
    try {
      if (this.status === 'fulfilled') {
        if (onResolve) ret = onResolve(this.value)
        else 					 ret = promise.resolve(this.value)
      } else if (this.status === 'rejected') {
        if (onReject) ret = onReject(this.reason)
        else 					ret = promise.reject(this.reason)
      }
      
      if (ret instanceof Promise) {
        if (ret === promise) {
          promise.reject(new TypeError()) 
        } else {
          ret.then(promise.resolve.bind(promise), promise.reject.bind(promise)) 
        }
      } else if (typeof ret === 'object' || typeof ret === 'function') {
        try {
          var then = ret.then
          
          if (then)
            then.call(ret, promise.resolve.bind(promise), promise.reject.bind(promise))
          else 
            promise.resolve(ret)       
        } catch(e) {
          promise.reject(e)
        }
      } else {
        promise.resolve(ret)
      }
    } catch(e) {
      promise.reject(e)
    }

    this._queue.shift()
  }

  this._queue = []
}

module.exports = Promise
