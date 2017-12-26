/* eslint-disable */
var Promise = window.Promise = require('./src')
var assert = require('assert')
var $ = require('./jquery')
// setTimeout(function(){console.log(4)},0)

// new Promise(function(resolve){
//     console.log(1)
//     for( var i=0 ; i<10000 ; i++ ){
//         i==9999 && resolve()
//     }
//     console.log(2)
// }).then(function(){
//     console.log(5)
//   throw 6
// }).caught(function(err) {
//   console.log('catch', err)
// })
// console.log(3)

// Promise.resolve('resolve').then(function(val) {
//   return Promise.reject(val + 'reject')
// }).caught(function(err) {
//   console.log(err)
// })

// window.p1 = Promise.resolve(1234).catch(x => x + 1)

// window.p2 = Promise.resolve(1234).then(null, x => x + 1)

// console.log(7777, p1, p2)
// function unreach() {
//   console.log(123)
//   assert(false, 'will not reach here')
// }
    $.when().done(function(v1) {
      // assert.deepEqual(v1, undefined)
      console.log(7777, v1)
    })
    // var d1 = $.Deferred()
    // var d2 = $.Deferred()
    // var d3 = $.Deferred()
    // $.when(d1, d2, d3).done(function(v1, v2, v3) {
    //   console.log(77777, v1, v2, v3)
    //   assert.deepEqual([v1, v2, v3], [undefined, 'abc', 123])
    //   // done()
    // })
    // d1.resolve()
    // d2.resolve('abc')
    // d3.resolve(123)

// var _p = Promise.resolve(5)
// var p = Promise.reject(_p)
// // console.log(p)
// p.then(x => {
//   console.log('resolve1', x)
//   return x
// }, function(r) {
//   console.log('reject1', r)
//   return r
// }).then(x => {
//   console.log('resolve2', x)
// }, function(r) {
//   console.log('reject2', r)
// })
