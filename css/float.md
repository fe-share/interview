## Q: float清除浮动

## A:


### clear: both
```css
  selector::after{
    content: '';
    display: block;
    height: 0;
    clear: both;
  }
```


### overflow
```css
  selector {
    overflow: auto;
  }
```

原理: overflow属性值不为visible时，该元素会创建一个BFC