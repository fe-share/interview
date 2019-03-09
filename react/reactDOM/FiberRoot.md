## FiberRoot是什么？

整个应用的起点，记录整个应用更新过程的信息，比如各种不同任务类型的`expirationTime`，异步调度任务的`callback`

直接上代码-。-

```
function createContainer(
  containerInfo: Container,
  isConcurrent: boolean,
  hydrate: boolean,
): OpaqueRoot {
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}
```

```
function createFiberRoot(
  containerInfo: any,
  isConcurrent: boolean,
  hydrate: boolean,
): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(isConcurrent);

  let root;
  if (enableSchedulerTracing) {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      pingCache: null,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,

      interactionThreadID: unstable_getThreadID(),
      memoizedInteractions: new Set(),
      pendingInteractionMap: new Map(),
    }: FiberRoot);
  } else {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      pingCache: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,
    }: BaseFiberRootProperties);
  }

  uninitializedFiber.stateNode = root;

  // The reason for the way the Flow types are structured in this file,
  // Is to avoid needing :any casts everywhere interaction tracing fields are used.
  // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
  // $FlowFixMe Remove this :any cast and replace it with something better.
  return ((root: any): FiberRoot);
```

其实我们看到`createFiberRoot`很简单，就是根据情况返回了一个对象,这些数据各自代表什么可以参照下表
[React数据结构](https://react.jokcy.me/book/api/react-structure.html)


## Fiber对象的创建
```
function createHostRootFiber(isConcurrent: boolean): Fiber {
  let mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}

const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

```
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag; // 不同的组件类型
  this.key = key; // 帮助diff的key
  this.elementType = null; // reactElement.type
  this.type = null; // 异步组件resolved之后返回的内容
  this.stateNode = null; // 节点实例 DOM或Class等

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps; // 新的props
  this.memoizedProps = null; // 老的props
  this.updateQueue = null; // 更新队列 
  this.memoizedState = null; // 老的state
  this.firstContextDependency = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null; // 可以理解为Fiber的副本，
    
   ....
}
```

`createHostRootFiber`就是创建了一个`Fiber`对象

Fiber对象的作用是什么？
*   每一个ReactElement对象都会对应一个Fiber对象，它会记录节点的各种状态，比如`ClassComponent`中的`State`、`Props`
这些东西其实是记录在Fiber对象上，然后在Fiber更新后才会更新到ClassComponent的this上，因此也给了实现`hooks`提供了便利，
因为我们记录`State`的对象不再是ReactElement，而是`Fiber`，所以我们有能力让`FunctionComponent`能拿到更新后的State

*   串联起了整个应用，我们在ReactElement中，我们通过`children`数学可以把每一个节点都串联起来，形成一个树结构，
在Fiber中也有这样的一个能力，来帮助我们记录节点属性，从而把整个应用的树形结构串联起来，形成一个Fiber树

我们看到Fiber对象中有这么三个属性 `child`、`sibling`、`return`， 这三个属性能帮助我们把整个应用的节点串联

这里主要说明一下`alternate`

根据当前的Fiber对象创建一个`alternate`，更新时我们实际更新的是新创建出来的`alternate`， 然后在更新完成后把`current`和`alternate`进行交换，达到复用的目的，从而不需要每次重新创建对象
这在React中叫做`doubleBuffer`


[Fiber](../../assets/fiber.png)

所以我们每一个父节点，只会存储第一个子节点(child)，其余的子节点都为child节点的`sibling`, 所有的`return`都指向父节点

