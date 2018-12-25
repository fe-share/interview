## Q: 盒模型有哪几种？怪异模式和标准模式？

## A:

### 盒模型

- IE盒模型
  > 属性width,height包含border和padding，指的是content+padding+border。

- W3C盒模型
  > 属性width,height只包含内容content，不包含border和padding。

在IE8+浏览器中使用哪个盒模型可以由box-sizing(CSS新增的属性)控制。

默认值为content-box，即标准盒模型；

如果将box-sizing设为border-box则用的是IE盒模型。


### 怪异模式和标准模式

起源于W3C标准制定后，为了兼容旧IE的页面，通过文档声明来区分模式

- 标准模式指的是按照W3C盒模型渲染

- 怪异模式则会按照IE盒模型渲染