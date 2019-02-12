#Call函数实现

```
Function.prototype.myCall = function(context){
    if (typeof this !== 'function'){
        throw new TypeError('Error')
    }
    context = context || window // 默认为window
    context.fn = this
    const args = [...arguments].slice(1) // 去除上下文引用
    const result = context.fn(...args)
    delete context.fn
    return result
}
```

#Apply
```
Function.prototype.myApply = function(context){
    if (typeof this !== 'function'){
        throw new TypeError('Error')
    }
    
    context = context || window
    context.fn = this
    let result
    // 处理参数时和call有区别
    if (arguments[1]){
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    delete context.fn
    return result
}
```

#Bind
```
Function.prototype.myBind = function(context){
    if (typeof this !== 'function'){
        throw new TypeError('Error')
    }
    const self = this
    const args = [...arguments].slice(1)
    // bind需要返回一个全新的函数
    return function F(){
        if (this instanceof F){
            return new self(...args, ...arguments)
        }
        return self.apply(context, args.concat(...arguments))
    }
}
```