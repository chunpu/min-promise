// Promises/A+: https://promisesaplus.com/

var _ = require('min-util')
var is = _.is

// promise state
var pending = 0
var fulfilled = 1
var rejected = -1

module.exports = Promise

// constructor, es5 promise
function Promise(executor) {
	var me = this
	me.handlers = {}
	me.children = []
	me.state = pending
	var resolve = setResult(me, fulfilled)
	var reject = setResult(me, rejected)

	try {
		// avoid resolve() with curry..
		executor(function(value) {
			resolve(value)
		}, function(reason) {
			reject(reason)
		})
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
	// 2.2.7
	return ret
}

var setResult = _.curry(function(promise, state, result) {
	// [[Resolve]](promise, y) => setResult(promise, resolved, y)
	if (promise === result) {
		// 2.3.1
		return setResult(promise, rejected, new TypeError('circle promise'))
	}
	if (promise.state != pending) return // careful, only pending can be set result

	// 2.3.2 2.3.3 treat promise just like thenable(object or function)
	var then
	if (is.oof(result)) {
		try {
			// 2.3.3.1
			then = result.then
		} catch (err) {
			// 2.3.3.2
			return finalSetResult(promise, rejected, err)
		}
	}
	if (is.fn(then)) {
		// 2.3.3.3
		var onceSet = _.once(function(state, result) {
			// 2.3.3.3.3 2.3.3.3.4.1
			if (state == rejected) {
				// 2.3.3.3.1
				finalSetResult(promise, state, result)
			} else {
				// 2.3.3.3.2
				setResult(promise, state, result)
			}
		})
		try {
			// 2.3.3.3 careful, should has context which is result
			then.call(result, function(value) {
				// 2.3.3.3.1
				onceSet(fulfilled, value)
			}, function(reason) {
				// 2.3.3.3.2
				onceSet(rejected, reason)
			})
		} catch (e) {
			// 2.3.3.3.4 careful, call then can also be crashed
			onceSet(rejected, e)
		}
	} else {
		// 2.3.3.4 2.3.4
		finalSetResult(promise, state, result)
	}
})

function finalSetResult(promise, state, result) {
	// directly set result, ignore if result is thenable
	promise.state = state
	promise.result = result
	_.each(promise.children, function(child) {
		// 2.2.6
		triggerHandler(child, state, result)
	})
}

function triggerHandler(promise, state, result) {
	// carefull, should always async
	nextTick(function() {
		var handler = promise.handlers[state]
		if (is.fn(handler)) {
			// 2.2.1, 2.2.2, 2.2.3
			var value
			try {
				value = handler(result) // 2.2.5
			} catch (reason) {
				// 2.2.7.2 use final because reason should never be promise
				return finalSetResult(promise, rejected, reason)
			}
			setResult(promise, fulfilled, value) // 2.2.7.1
		} else {
			// 2.2.7.3 2.2.7.4 chain to child
			setResult(promise, state, result)
		}
	})
}

function nextTick(fn) {
	if (global.process && process.nextTick) {
		process.nextTick(fn)
	} else {
		setTimeout(fn)
	}
}
