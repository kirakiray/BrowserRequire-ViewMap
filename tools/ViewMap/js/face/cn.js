//定义界面数据，主要用于设置语言，固定的id名叫iData
define({
    header: [{
        id: "inputData",
        text: "输入数据"
    }, {
        id: "viewData",
        text: "查看数据"
    }],
    card: {
        inputData: {
            top: {
                title: "输入数据",
                content: "将数据字符串粘贴到文本域内"
            },
            main: {
                textarea: {
                    placeholder: "在此粘贴数据"
                }
            },
            bottom: {
                content: '<div style="line-height:50px;text-align:center;">可打开调试工具，运行 require.br.viewMap.expore 方法，可以得到测试用的 数据字符串 </div>'
            }
        },
        viewData: {
            top: {
                title: "加载数据",
                content: '<div class="tip_content"><div class="color_tip" title="没有下载过的模块或文件，第一次加载"><div class="color_example" style="background:#77b3de;"></div>初次加载</div><div class="color_tip" title="还未完成第一次加载的模块，重复调用该模块"><div class="color_example" style="background:#eba446;"></div>插队加载</div><div class="color_tip" title="已经下载完成的模块，从缓存获取模块数据"><div class="color_example" style="background:#72c380;"></div>缓存加载</div><div class="color_tip" title="加载失败的模块或文件"><div class="color_example" style="background:#df6164;"></div>加载错误</div></div>'
            },
            main: {
                infoTab: {
                    title: "加载信息",
                    tips: "点击模块可查看模块加载信息",
                    moduleName: "模块名",
                    registName: "注册资源",
                    start: "开始加载",
                    end: "结束加载",
                    userTime: "使用时间",
                    group: "同组模块",
                    prevGroup: "前组模块",
                    parent: "父节点"
                }
            },
            bottom: {
                content: ""
            }
        }
    }
}, 'iData');