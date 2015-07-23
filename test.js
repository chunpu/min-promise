// Reference Document
// v8 https://github.com/v8/v8/blob/f0c9cc0bbfd461c7f516799d9a58e9a7395f737e/test/mjsunit/es6/promises.js
// jQuery https://github.com/jquery/jquery/blob/master/test/unit/deferred.js
// ypromise https://github.com/yahoo/ypromise/blob/master/tests/unit/assets/promise-tests.js
// bluebird https://github.com/petkaantonov/bluebird/blob/master/test/mocha/3.2.6.js
// Q https://github.com/kriskowal/q/blob/v1/spec/q-spec.js

var assert = require('assert')
var _ = require('min-util')
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

})


