## Q: px、em、rem、vw、vh？rem 的根节点样式在什么时候设置？

## A:

### px

像素 (px) 是一种绝对单位(absolute units)， 因为无论其他相关的设置怎么变化，像素指定的值是不会变化的。

### em

- 1em与当前元素的字体大小相同(更具体地说，一个大写字母M的宽度)。

- CSS样式被应用之前，浏览器给网页设置的默认基础字体大小是16像素，这意味着对一个元素来说1em的计算值默认为16像素。

- em单位是会继承父元素的字体大小。

### rem

- 1rem与根元素节点的字体大小相同(如html的font-size为10px则1rem = 10px)

- 未设置根节点的字体大小时，1rem = 1em = 16px

- 应当在页面加载前设置


### vw, vh

- IE9+支持

- 相对于视口宽高而言(window.innerWidth & window.innerHeight)

- window.innerWidth = 100vw

- window.innerHeight = 100vh

