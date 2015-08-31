var Promise = require('../')
var assert = require('assert')

var p = new Promise(function(resolve, reject) {
	resolve('p1')
})

/*
p.then(function(x) {
	console.log(x)
}, function(r) {
	console.log('error', r)
})
*/
/*
var p2 = p.then(function(x) {
	console.log('p1', x)
	return 'p11'
})

.then(function(x) {
	console.log('p11', x)
}, function(r) {
	console.log(r)
})
*/

var p2 = new Promise(function(resolve, reject) {
	setTimeout(resolve, 100, 'p2')
})

var p3 = p2.then(function(x) {
	console.log(1, x)
	return 'p3'
})

p3.then(function(x) {
	console.log('p3', x)
})

p2.then(function(x) {
	console.log(2, x)
})
