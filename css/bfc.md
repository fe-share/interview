## Q: BFC 块级上下文、IFC，实现双栏高度对齐

## A:

### BFC

块格式化上下文(Block Formatting Context，BFC)是 Web 页面的可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

下列方式会创建块格式化上下文：

- 根元素或包含根元素的元素
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML 表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是 HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素
- display 值为 flow-root 的元素
- contain 值为 layout、content 或 strict 的元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
  column-span 为 all 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中。

块格式化上下文对浮动定位与清除浮动都很重要。

浮动定位和清除浮动时只会应用于同一个 BFC 内的元素。

浮动不会影响其它 BFC 中元素的布局，而清除浮动只能清除同一 BFC 中在它前面的元素的浮动。

外边距折叠（Margin collapsing）也只会发生在属于同一 BFC 的块级元素之间。

### IFC（Inline Formatting Contexts）行内级格式化上下文

行内级格式化上下文用来规定行内级盒子的格式化规则。

先来看看如何生成一个 IFC ：

IFC 只有在一个块级元素中仅包含内联级别元素时才会生成。

#### 布局规则

1. 内部的盒子会在水平方向，一个接一个地放置。

2. 这些盒子垂直方向的起点从包含块盒子的顶部开始。

3. 摆放这些盒子的时候，它们在水平方向上的 padding、border、margin 所占用的空间都会被考虑在内。

4. 在垂直方向上，这些框可能会以不同形式来对齐（vertical-align）：它们可能会使用底部或顶部对齐，也可能通过其内部的文本基线（baseline）对齐。

5. 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和存在的浮动来决定。

6. IFC 中的 line box 一般左右边都贴紧其包含块，但是会因为 float 元素的存在发生变化。float 元素会位于 IFC 与与 line box 之间，使得 line box 宽度缩短。

7. IFC 中的 line box 高度由 CSS 行高计算规则来确定，同个 IFC 下的多个 line box 高度可能会不同（比如一行包含了较高的图片，而另一行只有文本）

8. 当 inline-level boxes 的总宽度少于包含它们的 line box 时，其水平渲染规则由 text-align 属性来确定，如果取值为 justify，那么浏览器会对 inline-boxes（注意不是 inline-table 和 inline-block boxes）中的文字和空格做出拉伸。

9. 当一个 inline box 超过 line box 的宽度时，它会被分割成多个 boxes，这些 boxes 被分布在多个 line box 里。如果一个 inline box 不能被分割（比如只包含单个字符，或 word-breaking 机制被禁用，或该行内框受 white-space 属性值为 nowrap 或 pre 的影响），那么这个 inline box 将溢出这个 line box。

那么，IFC 的具体实用在何处呢？

- 水平居中：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC，通过设置父容器 text-align:center 则可以使其水平居中。

  - > 值得注意的是，设置一个块为 inline-block ，以单个封闭块来参与外部的 IFC，而内部则生成了一个 BFC。

- 垂直居中：创建一个 IFC，用其中一个元素撑开父元素的高度，然后设置其 vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。


## 参考资料
[CSS2.1](https://www.w3.org/TR/CSS21/visuren.html#block-formatting)
[CSS3](https://drafts.csswg.org/css-display/#block-formatting-context)