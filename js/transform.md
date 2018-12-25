## Q: 弱类型转换规则

## A:

### 1. ToPrimitive 将值转换为原始值

`ToPrimitive(input[,PreferredType])`

ToPrimitive 会将输入值`input`转换为一个非对象类型。

如果一个对象可以转换为多种原始类型，那么必须使用可选参数`PerferredType`来指定类型。

对于其他主要的数据类型，均返回`input`，如果是对象则遵循以下步骤:

- 1.如果 _PerferredType_ 未指定，那么让 _hint_ 为 "**default**"
- 2.如果 _PerferredType_ 是 String，则让 _hint_ 为 "**string**"
- 3.如果 _PerferredType_ 是 Number，则让 _hint_ 为 "**number**"
- 4.如果对象上存在 _Symbol.toPrimitive_ 方法，然后
  - 4.1 执行 input._Symbol.toPrimitive_(hint)
  - 4.2 如果返回值不是一个 Object 类型，则返回该值
  - 4.3 否则抛出一个 **TypeError**
- 5.如果 _hint_ 是 "**default**"，那么将 _hint_ 改为 "**number**"
- 6.返回 OrdinaryToPrimitive(input,hint)

OrdinaryToPrimitive 执行以下步骤:

- 1.判断`input`类型为`Object`
- 2.判断 _hint_ 是一个字符串，并且值是"**string**"或者"**number**"
- 3.如果 _hint_ 值为"**string**", 那么让 _methodNames_ 为 <<"**toString**", "**valueOf**">>
- 4.否则让 _methodNames_ 为 <<"**valueOf**", "**toString**">>
- 5.对于在 _methodNames_ 列表里的每个方法名:
  - 5.1 如果该方法可调用，则调用
  - 5.2 如果返回值不是一个 Object 类型，则返回该值
- 6.抛出一个**TypeError**

### 2. ToBoolean 转换为 Boolean

`undefined`，`null`，`+0`，`-0`，`NaN`，`''`，`false` 返回 **false**

其他均返回 **true**

### 3. ToNumber

- `undefined` 返回 **NaN**
- `null` 返回 **+0**
- `true` 返回 **1**，`false`返回 **+0**
- `Symbol` 抛出一个 TypeError
- `Object` 执行下列操作
  - 执行 ToPrimitive(argument, hint Number) 得到 _primValue_
  - 返回 ToNumber(_primValue_)

### 4. ToString

- `undefined` 返回 "**undefined**"
- `null` 返回 "**null**"
- `true` 返回 "**true**", `false` 返回 "**false**"
- `Symbol` 抛出一个 TypeError
- `Object` 执行下列操作
  - 执行 ToPrimitive(argument, hint String) 得到 _primValue_
  - 返回 ToString(_primValue_)

### 四则运算符

只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。

其他运算只要其中一方是数字，那么另一方就转为数字。

并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串。

```javascript
  'a'+ +'b' // -> 'aNaN'
  // 可以理解为'a'+(+'b') -> +'b'会将'b'转换为数字类型，则为NaN
  // 'a'+NaN -> 'aNaN'

  + '1' // -> 1
  // 可以理解为 +'1'，此处的+为一元正值符，会尝试将操作数转换为number
```

### `==`操作符
![](../assets/transform.png)



## 参考资料
[ECMA-262](https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive)

[js操作符 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators)

[你所忽略的隐式转换 - 掘金](https://juejin.im/post/5a7172d9f265da3e3245cbca)

[interviewMap](https://yuchengkai.cn/docs/zh/frontend/#%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)