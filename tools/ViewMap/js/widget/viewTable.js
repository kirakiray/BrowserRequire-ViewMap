//查看数据的容器
define(function () {
    //UI展示key字段
    var UIdata = require.use('iData').card.viewData.main.infoTab;

    //主容器
    var $code = $('<div class="view_table"/>');

    //放view数据图的容器
    var $main = $('<div class="view_table_main" />');

    //右边查看信息的容器
    var $right = $('<div class="view_table_info" />');

    //模块查看面板
    var $info_text = $('<div class="info_text"><div class="info_text_title">' + UIdata.title + '</div><div class="info_text_content"></div></div>'),
        $info_text_content = $info_text.find('.info_text_content');

    //右边容器添加查看信息内容
    $right.append($info_text);

    //添加进主容器
    $code.append($main).append($right);

    //无相关内容的html
    var hasnotStr = '<span style="color:#de6262;">none</span>';

    //控制对象 
    var controlObj = {
        element: $code,
        container: $main,
        //初始化所有内容（清空）
        init: function () {
            //清空主内容
            $main.empty();

            //清空信息面板
            controlObj.empty();

            //添加提示
            controlObj.add('', '<span style="text-align:center;width:100%;display:inline-block;">' + UIdata.tips + '</span>');
        },
        //清空信息面板
        empty: function () {
            $info_text_content.html('');
        },
        //添加一条消息
        add: function (name, value) {
            $info_text_content.append('<span class="info_text_content_name">' + (name ? (name + "：") : "") + '</span><span class="info_text_content_value">' + value + '</span><br>');
        },
        //带有逻辑的视图添加方法
        refresh: function (orginData) {
            //先清空信息
            this.empty();

            //填写相关信息
            //模块名
            this.add(UIdata.moduleName, orginData.orginUri);

            //模块注册连接
            if (orginData.orginUri != orginData.uri) {
                this.add(UIdata.registName, orginData.uri);
            } else {
                this.add(UIdata.registName, hasnotStr);
            }

            //开始加载时间
            var startDate = new Date(orginData.start);
            this.add(UIdata.start, startDate.toTimeString().slice(0, 8) + "." + startDate.getMilliseconds());

            //加载结束时间
            var endDate = new Date(orginData.end);
            this.add(UIdata.end, endDate.toTimeString().slice(0, 8) + "." + endDate.getMilliseconds());

            //使用时间
            this.add(UIdata.userTime, (orginData.end - orginData.start) + "ms");

            //同组模块
            var groupStr = "";
            $(orginData.Group.arr).each(function (i, e) {
                //设置当前模块在数组中有颜色
                if (orginData.orginUri == e.orginUri) {
                    groupStr += '<span style="color:#fa682d;display:inline-block;">' + e.orginUri + "</span>　";
                } else {
                    groupStr += '<span style="display:inline-block;">' + e.orginUri + "</span>　";
                }
            });
            this.add(UIdata.group, groupStr);

            //上一组模块
            if (orginData.Group.prev) {
                var prevGroupStr = "";
                $(orginData.Group.prev.arr).each(function (i, e) {
                    prevGroupStr += e.orginUri + "　";
                });
                this.add(UIdata.prevGroup, prevGroupStr);
            } else {
                this.add(UIdata.prevGroup, hasnotStr);
            }

            //父载入节点
            if (orginData.Group.parent) {
                this.add(UIdata.parent, orginData.Group.parent.orginUri);
            } else {
                this.add(UIdata.parent, hasnotStr);
            }
        }
    };

    //返回控制对象
    return controlObj;
});