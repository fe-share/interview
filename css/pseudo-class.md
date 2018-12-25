## Q: 伪类是什么？有哪些？会有哪些兼容性问题？如何处理？

## A:

概念: CSS 伪类 是添加到选择器的关键字，指定要选择的元素的特殊状态。

### 常用伪类

- `:active`
- `:hover`
- `:link`
- `:visited`
- `:focus`

(> IE8)

- `:checked`
- `:disabled`
- `:not`
- `:first-child` & `:first-of-type`
- `:nth-child` & `:nth-of-type`
- `:last-child` & `:last-of-type`
- `:nth-last-child` & `:nth-last-of-type`
- `:only-child` & `:only-of-type`

### 常用伪元素

- `::before`
- `::after`

_IE8 仅支持 :before & :after 创建伪元素_

- `::placeholder`
  用于修改 placeholder 属性(IE 不支持)

_注: 需要配合浏览器前缀使用-webkit-input- or -moz-_

## 参考  资料

[MDN伪类 & 伪元素](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS/Pseudo-classes_and_pseudo-elements)
