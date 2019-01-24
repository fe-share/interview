## 原型继承和Class继承

`
涉及面试题: 原型如何实现继承? Class如何实现继承? Class的本质是什么?
`

在JS中其实并不存在类, Class只是语法糖, 本质还是一个函数
```
class Person {}
Person instanceof Function //true
```

## 组合继承
```
function Parent(value){
    this.val = value
}
Parent.prototype.getValue = function(){
    console.log(this.val)
}
function Child(value){
    Parent.call(this, value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```
这里如果不明白可以参考[原型链](./prototype.md)

这里的继承核心在于在子类的构造函数中通过Parent.call(this)继承父类构造函数中的属性,然后通过改变子类的原型链,指向父类的实例来继承父类的原型函数

这种继承方式的有点在于构造函数可以传参,不会与父类引用属性共享,可以复用父类的函数,但是这样也存在一个缺点就是在继承父类的时候调用了父类的构造函数,这样子类的原型上就多了父类构造函数中的属性,存在内存上的浪费
```
child.__proto__.value = undefined
```

## 寄生组合继承
这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了。

```
function Parent(value){
    this.val = value
}
Parent.prototype.getValue = function(){
    console.log(this.val)
}

function Child(value){
    Parent.call(this,value)
}

Child.prototype = Object.create(parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true
    }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

这样实现继承的核心是将父类的原型赋值给了子类, 并且将构造函数设置为子类, 这样既解决了无用父类属性的问题, 还能正确的找到子类的构造函数

## Class继承
以上两种继承方式都是通过原型去解决的，在 ES6 中，我们可以使用 class 去实现继承，并且实现起来很简单

```
class Parent {
    constructor(value) {
        this.val = value
    }
    getValue() {
        console.log(this.val)
    }
}

class Child extends Parent {
    constructor(value) {
        super(value)
        this.val = value
    }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```
class 实现继承的核心在于使用 extends 表明继承自哪个父类，并且在子类构造函数中必须调用 *super*, 这段代码可以看成 *Parent.call(this, value)*