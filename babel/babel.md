## Babel的工作流程
* 解析

    将代码解析抽象成AST语法树,每个js引擎都有自己的AST解析器,
    Babel采用Babylon,在解析过程中分为两个阶段:*词法分析*和*语法分析*,
    首先词法分析把代码转换成令牌(tokens)流,令牌相当于AST中的节点,节点有
    属于自己的类型标识type(如:FunctionDeclaration 就属于函数声明类型);
    语法分析会将这些令牌再转换成AST,形成真正的AST表述结构.      
* 转换
    
    在这个阶段,Babel接受得到的AST并通过babel-traverse对其进行深度优先遍历(AST的本质就是一个树形字典)
    并在此阶段对节点进行增删改查的操作,babel的插件也是在此阶段介入工作的
* 生成

    将经过转换的AST通过babel-generator再转换成js代码,过程依然是深度优先遍历,然后构建可执行的js代码
    
## AST(语法树)
```
const a = 10;
const b = 5;
function add(x){
    return a + b + x
}
const c = add(5) 
```
经过词法分析后,大致转换为如下形式
```
{
    type: "Program", // 节点的类型
    start: 0, // 这是整个module的起始位置
    end: 84, // 整个module的结束位置
    body: [
        {type: "VariableDeclaration", start: 0, end: 13, declarations: [], kind: "const"},
        ...
        {type: "FunctionDeclaration", start: 27, end: 66, body: {...}},
        {type: "VariableDeclaration", kind: "const"}
    ]
}
```
像这样的结构叫做节点(Node), 一个AST由一个或多个这样的节点组成,节点内部可以有多个这样的子节点,经过多次的词法和语法分析,构成一颗静态语法树
type字段表示节点类型,每种节点类型会有一些特定的属性描述该节点类型,帮助babel解析


语法分析后完整的结构
```
{
    type: "Program",
    start: 0, // 这是整个module的起始位置
    end: 84, // 整个module的结束位置
    body: [
        {
            type: "VariableDeclaration", 
            start: 0, 
            end: 13, 
            declarations: [
                {
                    type: "VariableDeclarator", 
                    start: 6, 
                    end: 12, 
                    id: {
                        type: "Identifier",
                        start: 6,
                        end: 7,
                        name: "a"
                    },
                    init: {
                        type: "Literal",
                        start: 10,
                        end: 12,
                        value: 10,
                        raw: "10"
                    }
                }
            ], 
            kind: "const"
        },
        ...
        {
            type: "FunctionDeclaration", 
            start: 27, 
            end: 66,
            id: {
                type: "Identifier",
                name: "add",
                ...
            },
            params: [
                {
                    type: "Identifier"
                    name: "x"
                }
            ], 
            body: {
                {
                    type: "ReturnStatement",
                    argument: {
                        type: "BinaryExpression",
                        left: {
                            type: "BinaryExpression",
                            operator: "+",
                            left: {
                                name: "a"
                                ...
                            }
                            ...
                            }
                    }
                }
            }
        },
        {type: "VariableDeclaration", kind: "const"}
    ]
}
```

## Visitor
当Babel处理一个节点时, 是以访问者的形式获取节点信息并进行相关操作,这种方式是通过一个visitor对象来完成的
在visitor对象中定义了对于各种节点的访问函数,这样就可以针对不同的节点做出不同的处理,我们编写Babel的插件其实也是通过定义一个实例化的visitor对象处理一系列的AST节点来完成我们对代码的修改操作

```
@path: 包含了当前节点及其父节点的信息和所在的位置,并提供了添加,更新,移动和删除节点等的方法,以供对节点进行操作
@state: 包含了当前plugin的信息,配置参数,也可获取当前节点的信息,也可以把插件处理过程中的自定义状态存储在其中
visitor: {
    Program: {
        enter(path, state){
            console.log('进入模块')
            // do something
        },
        exit(path, state){
            console.log('离开模块')
             // do something
        }
    },
    VariableDeclaration: {
        enter(){
            console.log('进入变量声明')
            ...
        },
        exit(){
            ...
        }
    }
}
```
当把这个vistor用于AST遍历时,就会呈现如下结果,注意此时Program一定是最后才退出的, 因为AST的遍历采用的是深度优先遍历
```
─ Program.enter() 
  ─ VariableDeclaration.enter()
  ─ VariableDeclaration.exit()
─ Program.exit() 
```

举个例子
```
// 现在我声明一个函数
function equal(x){
    return x * x;
}
// 我想在babel编译的时候,将equal的形参x=>n, 于是我定义如下的visitor
visiotr:{
    FunctionDeclaration(path, state){
        const param = path.node.params[0]
        paramName = param.name;
        param.name = "x";
    },
    Identifier(path, state){
        if (path.name === 'n'){
            path.name = "x";
        }
    }
}
```

这段代码虽然可以实现我们将x=>n的需求,但是局限性太强,如果我对上述代码稍作修改
```
function equal(x){
    return x * x;
}
var x = 1;
```
我们都知道, var x = 1 会被变量提升至顶部,而对于babel来说,会生成如下的AST
```
{
    type: "Program",
    ...,
    body: [
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "x",
            }
            ...
        }
    ]
}
```
此时babel会把外围的x也转换成n, 这并不是我们期望的结果, 所以对于这种情况我们可以嵌套的去声明一个visitor
```
visitor: {
     FunctionDeclaration(path, state){
       const updateParamsVisitor = {
        Identifier(path, state){
            if (path.node.name === this.paramName){
                path.node.name = "n";
            }
        }
       }
       const param = path.node.params[0];
       paramName = param.name;
       param.name = "n"
       path.traverse(updateParamNameVisitor, { paramName }); 
     }
}
```

此时每当Babel遇到FunctionDeclaration类型的节点时,会先将参数更名为n,之后再调用该节点的traverse函数,以我们新定义的visitor去更新函数内部节点信息,以此避免了修改外部的全局变量
以上便是babel的基本工作流程

参考文章

[深入Babel，这一篇就够了](https://juejin.im/post/5c21b584e51d4548ac6f6c99)




