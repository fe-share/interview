## React源码分析之ReactDOM.render
```
    ReactDOM = {
        render(
            element, // 渲染的组件 <ReactElement>,
            container, // 挂载的DOM <DOMcontainer>
            callback // 渲染完成的回调 <?Function>
        ){
            // 省去了dev和warnning
            return legacyRenderSubtreeIntoContainer(
                null，
                element,
                container,
                false,
                callback
            )
        }，
        ...
    }
```
这里就是我们渲染React时调用的函数，我们看到它实际上去调用了`legacyRenderSubtreeIntoContainer`这个函数
这里有一点需要注意，`element`只是通过`React.createElement`创建的一个`ReactComponentClass`并没有进行实例化
```
    function legacyRenderSubtreeIntoContainer( // 将遗留的子树(children)渲染到Container
        parentComponent, // <?ReactComponent>  父级
        children, // <ReactNodeList>  子级
        container, // <DOMcontainer>  挂载的容器
        forceHydrate, // <Boolean>  是否需要调合SSR
        callback， // <?Function>  回调
    ){
         let root: Root = (container._reactRootContainer: any); // 第一次渲染的时候不存在，此时root只是一个普通的element标签
         if (!root) {
              // Initial mount
              root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
                container,
                forceHydrate,
              ); // 
              if (typeof callback === 'function') {
                const originalCallback = callback;
                callback = function() {
                  const instance = getPublicRootInstance(root._internalRoot);
                  originalCallback.call(instance);
                };
              }
              // Initial mount should not be batched.
              unbatchedUpdates(() => {
                if (parentComponent != null) {
                  root.legacy_renderSubtreeIntoContainer(
                    parentComponent,
                    children,
                    callback,
                  );
                } else {
                  root.render(children, callback);
                }
              });
         } else {
            // 有root的情况
         }
         return getPublicRootInstance(root._internalRoot)
    }
```
由于是第一次渲染，element下并没有`_reactRootContainer`, 所以此时需要我们去创建一个
通过render的调用情况也可以发现`parentComponent`是写死的`null`
`unbatchedUpdates`是指定不使用`batchedUpdates`，因为这是初次渲染，需要尽快完成
```
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): Root {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container)
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false
    let rootSibling
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling)
    }
  }
  // Legacy roots are not async by default.
  const isConcurrent = false
  return new ReactRoot(container, isConcurrent, shouldHydrate)
}

function ReactRoot(
  container: Container,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  const root = createContainer(container, isConcurrent, hydrate) // 创建了一个FiberRoot
  this._internalRoot = root
}

ReactRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot
  const work = new ReactWork() // 不重要 跳过
  callback = callback === undefined ? null : callback
  
  if (callback !== null) {
    work.then(callback)
  }
  
  updateContainer(children, root, null, work._onCommit)
  return work
}
```
这里实际上是创建了一个ReactRoot的实例，并将这个实例赋值给了`container._reactRootContainer`,我们可以看到`ReactRoot`中的原型方法，
`legacyRenderSubtreeIntoContainer`中调用的`render`就是它

这里还有一个要点就是`createContainer`，我们看到在`ReactRoot`这个构造函数中，只做了一件事，就是调用`createContainer`,这个函数会为我们创建一个`FiberRoot`，
React后期调度更新的过程，和hooks的实现，都是基于`Fiber`这个概念，因此这个节点非常重要

`shouldHydrateDueToLegacyHeuristic`的作用是区分该次渲染是否需要调和SSR的情况，如果需要的话React会复用SSR渲染时服务端返回的节点，以提高性能

我们继续往下看，调用了root.render后，我们拿到了FiberRoot， 然后调用了`updateContainer`
```
function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot, // 这里接收的是Fiber
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current; // 这里是个未初始化的FiberNode，详情参照源码createContainer
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```
这里是个很重要的点`expirationTime`，用于计算任务优先级，React16中的新APi，`ConcurrentMode`就是基于此，可以根据不同的任务优先级去调度更新，
到此我们只需要先知道这里计算了一个`expirationTime`, 我们继续往下看,追踪`updateContainerAtExpirationTime`->`scheduleRootUpdate`->`createUpdate`
```
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  const update = createUpdate(expirationTime);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element}; // update的载体，其实就是setState的内容，第一次为空

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(current, update); 
  scheduleWork(current, expirationTime); 

  return expirationTime;
}
```
`enqueueUpdate` 把update加入Fiber对象中对应的updatequeue中，因为React是可以在某个节点上有多个更新的，这就涉及到了batchUpdates

`scheduleWork` 开始进行任务调度， React16 提供了任务优先级的概念，所以在同一时间我们可能有各种不同优先级的任务要进行更新，所以我们要根据优先级来进行更新，这也是React16中最核心的地方

这里只是讲述了大概流程， 我们只需要先了解整体流程，最后再去深入每个细节