先实现 promise A, 再实现 promise Ecma
promise 比喻成 tree 并不恰当, 仅仅是说明了分叉与生长的现象, 无法体现惰性求值的过程
promise 比喻成管道水流
promise 必须提供 then 让我们获取他的值, 水管必须提供出水口
then 表示接管道, 体现了惰性求值
一个 promise 对应一跟水管, promise 相接就是水管接水管
执行 handler 表示水流, 上一个水管接到水(value), 后面的水管就开始接水
水流是一泄如注的, 但也有可能动态在中间插入新水管(返回 thenable 对象)
水从头流到尾就是 pending 过程
水流根本停不下来, 只要有水管的, 立马就接水
