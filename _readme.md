Support Both `ES2015 Promise` and `Promises/A+`

100% compliant with [Promises/A+ Spec](https://promisesaplus.com/), and listed in [implements](https://promisesaplus.com/implementations)

Check all tests in [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)


Feature
---

Support basic thenable in `Promises/A+ Spec`

Support ES2015 promise

- `new Promise()` in ES2015
- `Promise.all()` in ES2015
- `Promise.race()` in ES2015

Support `.caught` like `.catch` for ES3 support, inspired by [bluebird](https://github.com/petkaantonov/bluebird)


Deferred
---

jQuery style or `CommonJS Promises/A` Deferred object

> Promise is subset of Deferred

```js
var $ = require('min-promise/jquery') // export `Deferred` and `when`

// $.Deferred
var dfd = $.Deferred()
dfd.done(function(v1, v2) {
  console.log(v1) // 1
  console.log(v2) // 2
})
Promise.delay(50).then(function() {
  dfd.resolve(1, 2)
})

// $.when
var d1 = $.Deferred()
var d2 = $.Deferred()
var d3 = $.Deferred()
$.when(d1, d2, d3).done(function(v1, v2, v3) {
  console.log([v1, v2, v3]) // [undefined, 'abc', 123]
})
d1.resolve()
d2.resolve('abc')
d3.resolve(123)
```

Tool function
---

`setTimeout` in promise style

- `Promise.delay(ms)`
- `.delay(ms)`
