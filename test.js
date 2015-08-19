// Reference Document
// v8 https://github.com/v8/v8/blob/f0c9cc0bbfd461c7f516799d9a58e9a7395f737e/test/mjsunit/es6/promises.js
// jQuery https://github.com/jquery/jquery/blob/master/test/unit/deferred.js
// ypromise https://github.com/yahoo/ypromise/blob/master/tests/unit/assets/promise-tests.js
// bluebird https://github.com/petkaantonov/bluebird/blob/master/test/mocha/3.2.6.js
// Q https://github.com/kriskowal/q/blob/v1/spec/q-spec.js

var assert = require('assert')
var _ = require('min-util')
var is = _.is
//var Promise = require('./')

function unreach() {
	assert(false, 'will not reach here')
}

function delay(time) {
	time = time || 5
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(time)
		}, time)
	})
}

describe('basic', function() {

	it('resolver only accept function', function() {
		var arr = [0, null, undefined, 'foo']
		_.each(arr, function(val) {
			var err
			try {
				new Promise(val)
			} catch (e) {
				err = e
			}
			assert(err instanceof TypeError)
		})
	})

	it('return instance of Promise', function() {
		var p = new Promise(function() {})
		assert(p instanceof Promise)
	})

	it('support mocha return promise async test', function() {
		return delay(20)
	})

	it('can catch error from resolver', function() {
		var p = new Promise(function() {
			throw 5
		})
		return p.then(unreach, function(r) {
			assert(5 === r)
		})
	})

	it('resolved/then-nohandler-undefined', function() {
		return Promise.resolve(5)
			.then(undefined, unreach)
			.then(function(x) {
				assert(5 === x)
			}, unreach)
	})

	it('resolved/then-nohandler-null', function() {
		return Promise.resolve(6)
			.then(null, unreach)
			.then(function(x) {
				assert(6 === x)
			}, unreach)
	})

	it('rejected/then-nohandler-undefined', function() {
		return Promise.reject(5)
			.then(unreach, undefined)
			.then(unreach, function(r) {
				assert(5 === r)
			})
	})

	it('rejected/then-nohandler-null', function() {
		return Promise.reject(6)
			.then(unreach, null)
			.then(unreach, function(x) {
				assert(6 === x)
			})
	})

	it('can resolve promise', function() {
		var p1 = Promise.resolve(5)
		var p2 = Promise.resolve(p1)
		var p3 = Promise.resolve(p2)
		return p3.then(function(x) {
			assert(5 === x)
		}, unreach)
	})

	it('can then/then return value', function() {
		var p1 = Promise.resolve(5)
		var p2 = Promise.resolve(p1)
		var p3 = Promise.resolve(p2)
		return p3.then(function(x) {
			return x
		}, unreach).then(function(x) {
			assert(5 === x)
		}, unreach)
	})

	it('can then/then return promise', function() {
		var p1 = Promise.resolve(5)
		var p2 = Promise.resolve(p1)
		var p3 = Promise.resolve(p2)
		return p3.then(function(x) {
			return Promise.resolve(x + 1)
		}, unreach).then(function(x) {
			assert(6 === x)
		}, unreach)
	})

	it('can then/then return promise', function() {
		var p1 = Promise.resolve(5)
		var p2 = Promise.resolve(p1)
		var p3 = Promise.resolve(p2)
		return p3.then(function(x) {
			return Promise.resolve(x + 1)
		}, unreach).then(function(x) {
			assert(6 === x)
		}, unreach)
	})

	it('can then-throw/then', function() {
		var p1 = Promise.resolve(5)
		var p2 = Promise.resolve(p1)
		var p3 = Promise.resolve(p2)
		return p3.then(function() {
			throw 6
		}, unreach).then(unreach, function(r) {
			assert(6 === r)
		})
	})

	it('support thenable', function() {
		var p1 = Promise.resolve(5)
		var p2 = {then: function(resolve, reject) {resolve(p1)}}
		var p3 = Promise.resolve(p2)
		return p3.then(function(x) {
			assert(5 === x)
		}, unreach)
	})

	it('`this` in resolver should be undefined', function() {
		return new Promise(function(resolve) {
			assert(this == global || this == undefined)
			resolve()
		})
	})

	it('catch do nothing when nothing is reject', function() {
		return Promise.resolve(5)['catch'](unreach).then(function(x) {
			assert(5 === x)
		})
	})

	it('can resolve a rejected promise', function() {
		var p = Promise.resolve(Promise.reject(5))
		return p.then(unreach, function(r) {
			assert(5 === r)
		})
	})

})

describe('resolver', function() {
	
	it('resolver support resolve a pending promise', function(done) {
		var p = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve(new Promise(function(resolve, reject) {
					setTimeout(function() {
						resolve(5)
					}, 10)
				}))
			}, 10)
		})
		p.then(function(x) {
			assert(5 === x)
			done()
		}, unreach)
	})

	it('resolver from then can do same thing', function(done) {
		var p = Promise.resolve(5).then(function() {
			return {
				then: function(resolve) {
					setTimeout(function() {
						resolve({
							then: function(resolve) {
								setTimeout(function() {
									resolve(6)
								}, 10)
							}
						})
					}, 10)
				}
			}
		})
		p.then(function(x) {
			assert(6 === x)
			done()
		})
	})

})

describe('constructor', function() {

	it('resolver will be called, not by then', function(done) {
		var arr = []
		var p1 = new Promise(function() {
			arr.push(1)
		})
		var p2 = new Promise(function() {
			setTimeout(function() {
				arr.push(2)
			})
		})
		arr.push(3)
		setTimeout(function() {
			assert.deepEqual(arr, [1, 3, 2])
			done()
		}, 10)
	})

	it('throw in ctor can be caught', function(done) {
		var p = new Promise(function() {
			throw 5
		})
		p.then(unreach, function(r) {
			assert(5 === r)
			done()
		})
	})

})

describe('`return value can be passed`', function() {

	it('can pass value by result of handler', function() {
		return Promise
			.resolve(1)
			.then(function(x) {
				return x + 2
			})
			.then(function(x) {
				return x * 2
			})
			.then(function(x) {
				assert(6 === x)
			})
	})

})

describe('then', function() {

	it('will return a new promise', function(done) {
		var p1 = Promise.resolve(1)
		var p2 = p1.then(function() {
		})
		var p3 = p2.then(function() {
		})
		p3.then(function() {
			assert(p1 !== p2)
			assert(p2 !== p3)
			assert(p1 !== p3)
			done()
		})
	})

	it('should resolve one by one', function(done) {
		var p = new Promise(function() {
			
		})
		p.then(unreach, unreach)
		setTimeout(done, 10)
	})

})

describe('composition by returned promise handler', function() {

	it('basic onResolve support', function(done) {
		var p = Promise.resolve(5).then(function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve(6)
				}, 10)
			})
		}, unreach)
		p.then(function(x) {
			assert(6 === x)
			done()
		})
	})

	it('basic onReject support', function(done) {
		var p = Promise.reject(5).then(unreach, function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve(7)
				}, 10)
			})
		})
		p.then(function(x) {
			assert(7 === x)
			done()
		})
	})

	it('return a resolved promise', function() {
		var p = Promise.resolve(5).then(function() {
			return Promise.resolve(6)
		})
		return p.then(function(x) {
			assert(6 === x)
		}, unreach)
	})

	it('return a rejected promise', function() {
		var p = Promise.resolve(5).then(function() {
			return Promise.reject(6)
		})
		return p.then(unreach, function(x) {
			assert(6 === x)
		})
	})

	it('do nothing when return a pending promise', function(done) {
		var p = Promise.resolve(5).then(function() {
			return new Promise(function(resolve, reject) {
				// do nothing
			})
		})
		p.then(unreach, unreach)
		setTimeout(done, 10)
	})

	it('support return thenable resolve', function() {
		var p = Promise.resolve(5).then(function() {
			return {
				then: function(resolve) {
					resolve(6)
				}
			}
		})
		return p.then(function(x) {
			assert(6 === x)
		}, unreach)
	})

	it('support return thenable reject', function() {
		var p = Promise.resolve(5).then(function() {
			return {
				then: function(resolve, reject) {
					reject(6)
				}
			}
		})
		return p.then(unreach, function(r) {
			assert(6 === r)
		})
	})

	it('return object has then is just a value', function() {
		var p = Promise.resolve(5).then(function() {
			return {
				then: 6
			}
		})
		return p.then(function(x) {
			assert.deepEqual(x, {then: 6})
		}, unreach)
	})

})

describe('sync and async', function() {

	it('resolver can be sync', function() {
		// is not confirm to be standard
		var arr = []
		var p = new Promise(function(resolve) {
			arr.push(1)
			resolve()
		})
		arr.push(2)
		return p.then(function() {
			assert.deepEqual(arr, [1, 2])
		}, unreach)
	})

	it('resolver can be async', function(done) {
		// here use done instead of return promise
		var arr = []
		var p = new Promise(function(resolve) {
			setTimeout(function() {
				arr.push(1)
				resolve()
			}, 10)
		})

		p.then(function() {
			arr.push(2)
		}, unreach)

		arr.push(3)

		p.then(function() {
			assert.deepEqual(arr, [3, 1, 2])
			done()
		})
	})

	it('`.then` is async', function() {
		var arr = []
		var p = Promise.resolve().then(function() {
			arr.push(1)
		}).then(function() {
			assert.deepEqual(arr, [2, 1])
		})
		arr.push(2)
		assert.deepEqual(arr, [2])
	})

})

describe('when status is sure, value can not be changed', function() {

	it('should not change value if resolve more than once', function() {
		return new Promise(function(resolve) {
			resolve(true)
			resolve(5)
		}).then(function(val) {
			true === val
		}, unreach)
	})

	it('should not change value if resolve more than once', function() {
		return new Promise(function(resolve, reject) {
			reject(5)
			reject(6)
		}).then(unreach, function(r) {
			assert(5 === r)
		})
	})

	it('resolve and reject', function() {
		var p = new Promise(function(resolve, reject) {
			resolve(5)
			reject(6)
		})
		return p.then(function(val) {
			assert(5 === val)
		})
	})

})

describe('nested promise wrapper', function() {

	it('resolve a resolve promise', function() {
		var p = Promise.resolve(Promise.resolve(5))
		return p.then(function(x) {
			assert(5 === x)
		}, unreach)
	})

	it('resolve a reject promise', function() {
		var p = Promise.resolve(Promise.reject(5))
		return p.then(unreach, function(r) {
			assert(5 === r)
		})
	})

	it('reject a reject promise', function() {
		var p = Promise.reject(Promise.reject(5))
		return p.then(unreach, function(r) {
			return r
		}).then(unreach, function(r) {
			assert(5 === r)
		})
	})

	it('reject a resolve promise', function() {
		var p = Promise.reject(Promise.resolve(5))
		return p.then(unreach, function(r) {
			return r
		}).then(function(x) {
			assert(5 === x)
		}, unreach)
	})

})
