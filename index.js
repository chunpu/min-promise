// Promises/A+: https://promisesaplus.com/

// 先实现 promise A, 再实现 promise Ecma
// promise 比喻成 tree 并不恰当, 仅仅是说明了分叉与生长的现象, 无法体现惰性求值的过程
// promise 比喻成管道水流
// promise 必须提供 then 让我们获取他的值, 水管必须提供出水口
// then 表示接管道, 体现了惰性求值
// 一个 promise 对应一跟水管, promise 相接就是水管接水管
// 执行 handler 表示水流, 上一个水管接到水(value), 后面的水管就开始接水
// 水流是一泄如注的, 但也有可能动态在中间插入新水管(返回 thenable 对象)
// 水从头流到尾就是 pending 过程
// 水流根本停不下来, 只要有水管的, 立马就接水

var _ = require('min-util')
var is = _.is

// promise state
var pending = 0
var fulfilled = 1
var rejected = -1

// module.exports = BasePromise
module.exports = Promise

// constructor
function Promise(executor) {
	var me = this
	BasePromise.call(me)
	var resolve = setResult(me, fulfilled)
	var reject = setResult(me, rejected)
	try {
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}

_.inherits(Promise, BasePromise)

function BasePromise() {
	this.handlers = {}
	this.children = []
	this.state = pending
	// this.id = Math.random() // for debug
}

var proto = BasePromise.prototype

proto.then = function(onFulfilled, onRejected) {
	var me = this
	var ret = new BasePromise
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

