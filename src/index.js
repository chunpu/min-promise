// Promises/A+: https://promisesaplus.com/

var _ = require('min-util')
var is = _.is

// promise state
var pending = 0
var fulfilled = 1
var rejected = -1

module.exports = Promise

// constructor
function Promise(executor) {
	var me = this
	me.handlers = {}
	me.children = []
	me.state = pending
	var resolve = setResult(me, fulfilled)
	var reject = setResult(me, rejected)

	try {
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}

Promise.prototype.then = function(onFulfilled, onRejected) {
	var me = this
	var ret = new Promise(_.noop)
	var handlers = ret.handlers
	handlers[fulfilled] = onFulfilled
	handlers[rejected] = onRejected
	if (pending == me.state) {
		me.children.push(ret)
	} else {
		triggerHandler(ret, me.state, me.result)
	}
	return ret
}

var setResult = _.curry(function(promise, state, result) {
	if (promise === result) {
		// 2.3.1
		return setResult(promise, rejected, new TypeError('circle promise'))
	}
	// important, only pending can be set result
	if (promise.state != pending) return
	if (promise.called) return
	var then
	// important, get then can crash
	try {
		// 2.3.3.1
		then = getThenFn(result)
	} catch (e) {
		// 2.3.3.2
		return setResult(promise, rejected, e)
	}
	if (then) {
		// important, should has context should be result
		// thenFn can also be crashed
		var onceSet = _.once(function(state, result) {
			// 2.3.3.3.3
			if (state == rejected) {
				finalSetResult(promise, state, result)
			} else {
				setResult(promise, state, result)
			}
		})
		try {
			// 2.3.3.3
			then.call(result, function(value) {
				// 2.3.3.3.1
				onceSet(fulfilled, value)
			}, function(reason) {
				// 2.3.3.3.2
				onceSet(rejected, reason)
			})
		} catch (e) {
			// 2.3.3.3.4
			onceSet(rejected, e)
		}
	} else {
		finalSetResult(promise, state, result)
	}
})

function triggerHandler(promise, state, result) {
	if (state == null) debugger
	// should always async, important
	_.delay(function() {
		var handler = promise.handlers[state]
		if (is.fn(handler)) {
			var value
			try {
				value = handler(result)
			} catch (reason) {
				// use final because reason should never be promise
				return finalSetResult(promise, rejected, reason)
			}
			setResult(promise, fulfilled, value)
		} else {
			// chain to child
			setResult(promise, state, result)
		}
	})
}

function finalSetResult(promise, state, result) {
	// set result, ignore if result is thenable
	promise.state = state
	promise.result = result
	_.each(promise.children, function(child) {
		triggerHandler(child, state, result)
	})
}

function getThenFn(obj) {
	// 2.3.3 Otherwise, if x is an object or function
	if (is.oof(obj)) {
		// may be getter
		var fn = obj.then
		if (is.fn(fn)) {
			return fn
		}
	}
}

