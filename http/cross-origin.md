## Q: 跨域是什么？http 协议中如何判断跨域？如何解决跨域问题？

## A:

[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。

这是一个用于隔离潜在恶意文件的重要安全机制。

**域名**，**协议**，**端口**中有一者不同则视为跨域。

### 解决方案

#### JSONP

JSONP 本质是利用 script 标签可以请求跨域资源而实现的。

```javascript
// 简单实现
function jsonp() {
  const cbName = `callback${+new Date()}`
  const script = document.createElement('script')

  window.cbName = function(data) {
    // do something with data
    document.body.removeChild(script)
  }

  script.src = `http://test.com/a?cb=${cbName}`
  document.body.appendChild(script)
}

// 返回的数据格式为 (假定请求url为 http://test.com/a?cb=cb)
// cb("{"name":"test"}")
// 之后会自动执行window下的cb函数
```

#### CORS

[CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)是一个 W3C 标准，全称是"跨域资源共享"(Cross-origin resource sharing)

CORS 有两种请求，**简单请求**和**非简单请求**

只要同时满足以下两大条件，就属于简单请求。

1. 请求方法是以下三种方法之一：

- HEAD
- GET
- POST

2. HTTP 的头信息不超出以下几种字段：

- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

非简单请求必须首先使用`OPTIONS`方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。"预检请求"的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。

预检请求中同时携带了下面两个首部字段:

```
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

首部字段 `Access-Control-Request-Method` 告知服务器，实际请求将使用 POST 方法。首部字段 `Access-Control-Request-Headers` 告知服务器，实际请求将携带两个自定义请求首部字段：`X-PINGOTHER` 与 `Content-Typ`e。服务器据此决定，该实际请求是否被允许。

以下为预检请求的响应头部分信息，表明服务器将接受后续的实际请求。

```
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

`Access-Control-Allow-Methods` 表明服务器允许客户端使用 POST, GET 和 OPTIONS 方法发起请求

`Access-Control-Allow-Headers` 表明服务器允许请求中携带字段 X-PINGOTHER 与 Content-Type

`Access-Control-Max-Age` 表明该响应的有效时间为 86400 秒(24 小时)

在有效时间内，浏览器无须为同一请求再次发起预检请求


### nginx代理

可以将请求的接口都代理到别的服务下



## 参考资料
[跨域问题-segmentfault](https://segmentfault.com/a/1190000015597029)
