## Q: sprite（雪碧图）知道吗？svg 雪碧图了解吗？

## A:

### 雪碧图

概念：将多个小图片拼接到一个图片中。通过 background-position 和元素尺寸调节需要显示的背景图案。

优点：

1. 减少 HTTP 请求数，极大地提高页面加载速度。
2. 增加图片信息重复度，提高压缩比，减少图片大小。
3. 更换风格方便，只需在一张或几张图片上修改颜色或样式即可实现。

缺点：

1. 图片合并麻烦。
2. 维护麻烦，修改一个图片可能需要从新布局整个图片，样式。

实现方法：

1. 使用生成器将多张图片打包成一张雪碧图，并为其生成合适的 CSS。
2. 每张图片都有相应的 CSS 类，该类定义了 background-image、background-position 和 background-size 属性。
3. 使用图片时，将相应的类添加到你的元素中。

好处：

- 减少加载多张图片的 HTTP 请求数（一张雪碧图只需要一个请求）。但是对于 HTTP2 而言，加载多张图片不再是问题。
- 提前加载资源，防止在需要时才在开始下载引发的问题，比如只出现在:hover 伪类中的图片，不会出现闪烁。

参考

[https://css-tricks.com/css-sprites/](https://css-tricks.com/css-sprites/)

### SVG 雪碧图

1. 原理和普通图片雪碧图一样。
2. 好处是不再需要为高清屏准备额外的 2 倍图。因为 SVG 与分辨率无关。

#### 实现方式：

- > 方式 1：所有的图标使用<symbol>元素来定义在 SVG 代码中，并且隐藏它。然后使用<use>元素来通过<symbol> 的 xlink:href="#id"来引用它。

- > 方式 2：用 SVG 的 viewbox 属性来指定显示 SVG 画布的区域，跟 background-position 原理差不