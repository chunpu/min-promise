var Promise = require('./src')
setTimeout(function(){console.log(4)},0)

new Promise(function(resolve){
    console.log(1)
    for( var i=0 ; i<10000 ; i++ ){
        i==9999 && resolve()
    }
    console.log(2)
}).then(function(){
    console.log(5)
	throw 6
}).caught(function(err) {
	console.log('catch', err)
})
console.log(3)
