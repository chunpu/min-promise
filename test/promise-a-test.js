var adapter = require('../src/adapter')
var tests = require('promises-aplus-tests')

tests(adapter, function(err) {
  if (err) {
    console.error(err)
  }
})
