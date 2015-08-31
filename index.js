// Reference Document
// MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// v8 https://github.com/v8/v8/blob/f0c9cc0bbfd461c7f516799d9a58e9a7395f737e/src/promise.js
// Spec: http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
// Promises/A+: https://promisesaplus.com/
// Yaku: https://github.com/ysmood/yaku/blob/master/docs/minPromiseA+.coffee

var _ = require('min-util')

var is = _.is

// 25.4.6 Properties of Promise Instances

// key
var PromiseState = 'PromiseState'
var PromiseResult = 'PromiseResult'

// promise state
var pending = 0
var fulfilled = 1
var rejected = -1

// promise list
var PromiseFulfillReactions = 'PromiseFulfillReactions' // fulfill list
var PromiseRejectReactions = 'PromiseRejectReactions' // reject list

module.exports = Promise

// state
// pending => resolve|reject => then => return => pending => then

function Promise(executor) {
	var me = this
	me[PromiseState] = pending
	var resolve = set(me, fulfilled)
	var reject = set(me, rejected)
	try {
		executor(resolve, reject)
	} catch (e) {
		set(me, rejected, e)
	}
	me[PromiseFulfillReactions] = []
	me[PromiseRejectReactions] = []
}

var set = _.curry(function(promise, state, result) {
	// 2.3 [[Resolve]](promise, x)
	if (promise == result) {
		// 2.3.1
		throw new TypeError('circle promise')
	}
	if (isThenable(result)) {
		result.then(function(value) {
			set(promise, fulfilled, value)
		}, function(reason) {
			set(promise, rejected, reason)
		})
	} else {
		// 2.3.4
		realSet(promise, state, result)
	}
})

function realSet(promise, state, result) {
	promise[PromiseState] = state
	promise[PromiseResult] = result
	// TODO trigger handler queue
	var queue = promise[PromiseFulfillReactions]
	if (state == rejected) {
		queue = promise[PromiseRejectReactions]
	}
	_.each(queue, function(fn) {
		fn(result)
	})
}

var proto = Promise.prototype

proto.then = function(onFulfilled, onRejected) {
	// 2.2.1 25.4.5.3
	var me = this
	var state = me[PromiseState]
	if (pending == state) {
		me[PromiseFulfillReactions].push(onFulfilled)
		me[PromiseRejectReactions].push(onRejected)
		// TODO return promise2 linked to promise1
	} else {
		var fn = onFulfilled
		if (state == rejected) {
			fn = onRejected
		}
		var ret
		try {
			// 2.2.7.1
			ret = fn(me[PromiseResult])
		} catch (error) {
			// 2.2.7.2
			return Promise.reject(error)
		}
		return Promise.resolve(ret)
	}
}

proto['catch'] = function(onRejected) {
	// es3 like IE8- not support because catch is keyword
	return this.then(undefined, onRejected)
}

Promise.resolve = function(val) {
	return new Promise(function(resolve) {	
		resolve(val)
	})
}

Promise.reject = function(reason) {
	return new Promise(function(resolve, reject) {
		reject(reason)
	})
}

Promise.all = function() {
}

Promise.race = function() {
}

function isThenable(val) {
	return is.fn(_.get(val, 'then'))
}
