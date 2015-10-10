var adapter = require('./adapter')
var tests = require('promises-aplus-tests')

tests(adapter, function(err) {
	console.log(err)
})
