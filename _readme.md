Support Both `ES2015 Promise` and `Promises/A+`

100% compliant with [Promises/A+ Spec](https://promisesaplus.com/), and listed in [implements](https://promisesaplus.com/implementations)

Check all tests in [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)

Feature
---

Support `.caught` like `.catch` for ES3 support, inspired by [bluebird](https://github.com/petkaantonov/bluebird)

- `new Promise()` in ES2015
- `Promise.all()` in ES2015
- `Promise.race()` in ES2015

Deferred
---

jQuery style or `CommonJS Promises/A` Deferred object

> Promise is subset of Deferred

```js
var Deferred = require('min-promise/deferred')
var deferred = Deferred()

```

Tool function
---

`setTimeout` in promise style

- `Promise.delay(ms)`
- `.delay(ms)`