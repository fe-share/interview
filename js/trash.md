##垃圾回收机制

V8实现了准确式GC, GC算法采用了分代式垃圾回收机制.因此,V8将内存(堆)分为新生代和老生代两部分

##新生代算法

新生代中的对象一版存活时间较短,使用Scavenge GC算法.

在新生空间中,内存空间分为From和To,在这两个空间中,必定有一个空间是使用的,另一个是空闲的.
新分配的对象会被放入From空间中,当From空间被占满时,新生代GC就会启动,算法会检查From空间中
存活的对象并复制到To空间中,如果有失活的对象就会销毁.当复制完成后将From空间和To空间互换,
这样GC就结束了

##老生代算法
老生代中的对象一般存活时间较长,数量也多,使用了两个算法,分别是标记清除算法和标记压缩算法

* 什么情况下对象会出现在老生代空间?
    * 在新生代空间中,经历过一次GC算法,如果经历过的画,会将对象从新生代空间移至老生代空间中
    * To空间的对象占比大小超过25%,在这种情况下为了不影响内存分配,会将对象存新生代空间移至老生代空间