# BrowserRequire-ViewMap

The visualization tool for BrowserRequire.

BrowserRequire的可视化查看加载状况的工具。

###优势

* 可以从视图上查看每个文件或模块的加载状态；
* 查看工具纯web制作，不依赖第三方平台；
* 插件使用简单，添加文件即可；
* 工具与插件分开，插件负责生成数据，工具负责展示数据，只要添加插件，客户都是测试人员；
* 因为负责生成数据和查看工具的分离，我们也可以在不能调试的平台上（例如手机端，微信自带浏览器）测试加载情况（调试数据）；

###使用插件

####1.添加插件
```html
<script src="js/br.js"></script>
<!--框架主文件-->
<script src="js/br-dev-ViewMap.js"></script>
<!--viewMap插件-->
```

或采用异步方式添加，详情请查看[插件使用文档](https://github.com/kirakiray/BrowserRequire/wiki/插件使用和介绍)

####2.生成数据

在使用BrowserRequire加载完你的框架后，调用方法require.br.viewMap.expore方法，就能得到加载数据。

```javascript
var viewData = require.br.viewMap.expore();
```

viewData是json字符串，得到字符串后可以通过ajax返回给服务端，当然，我们本地调试直接从在命令行使用require.br.viewMap.expore()就能得到数据。

####3.视图工具

直接将字符串复制粘贴到文本域中即可

###路径解释

dist————viewMap数据获取插件压缩文件

tools————放viewMap视图查看工具的主目录

src————BrowserRequire源文件，viewMap数据获取插件

###其他

viewMap视图查看器必须运行在支持h5的浏览器中使用。（常规性使用chrome或者firefox打开就好了）

注：viewMap视图查看器虽然只支持最新浏览器，但是数据生成插件是兼容全浏览器的，查看的话只要我们开发者安装h5浏览器查看就得了，不会影响客户使用。

打开viewMap视图查看请点击相应viewMap目录的index.html文件使用浏览器打开。

该视图化工具也是使用BrowserRequire开发的，并且已经添加了ViewMap插件，所以打开调试模式，输入`require.br.viewMap.expore()`指令即可得到加载数据。


###工具解释：

* 模块名：在使用requre加载指令的时的路径；
* 注册资源：在config中注册的真实链接地址；
* 开始加载：开始加载当前文件/模块的时间；
* 结束加载：结束加载当前文件/模块的时间；
* 使用时间：加载当前文件/模块使用的时间；
* 同组模块：同一组中加载的所有文件/模块名；
* 前组模块：前面一个组的文件/模块名；
* 父节点：引用该模块的上一级模块；

**example:**


```javascript
//file moduleA.js
define(function(require){
	require('js/a.js','js/b.js').require('js/c.js')
});
```

```javascript
//file main
require('js/moduleA')
```

如上代码，main文件引入moduleA模块，moduleA模块引用了三个文件，那么它们的关系是：

* a.js和b.js是**同组模块**；
* c.js的**前组模块**是a.js和b.js；
* moduleA.js是a.js和b.js的父节点；

只要有联系关系的组，都会被分在一个视图列表内；

这里特别说明，按道理说c.js的父节点也是moduleA，但是它的前组节点（a.js和b.js）已经附带了父节点信息，为了更快速查找链上的关系，**链上的第一组才会拥有父节点信息**；（因为链上的非第一链就算带上父链，也和父链没有直接关系）
