//viewData任务的下方总进度条组合控件
define(function (require) {
    //容器
    var $container = $('<div class="total_process_container" />'),
        reObj = {
            //元素
            element: $container
            //control: "",
        };
    //totalProcess插件的控制器，插件的element，向左滚动的距离，焦点距离左边位置
    var totalControl = "",
        $total_process = "",
        scrollLeft = 0,
        marLeft = "";

    //依赖totalProcess插件
    require('jq/jq-totalProcess').ready = function (Reducer) {
        //使用插件,挂载控制对象
        totalControl = reObj.control = $container.totalProcess();

        //挂载进度条插件的元素
        $total_process = totalControl.element;
    };

    //添加移动焦点
    //$container.append($focuser);

    //移动焦点
    var $focuser = $('<div class="total_process_mover"><div class="total_process_mover_title">1</div></div>'),
        $focusText = $focuser.find('.total_process_mover_title');

    //向左滚动的方法
    var scrLeft = function (value) {
        //记录滚动值
        scrollLeft = value;

        //设置样式
        $container.css("transform", "translateX(" + value + "px)");
    };

    //初始化元素方法（清空）
    reObj.init = function () {
        $total_process.empty();

        //修正容器滚动值
        scrLeft(0);

        //添加移动焦点
        $total_process.append($focuser);
    }

    //移动控制器（移动到相应id的节点上）
    reObj.moveTo = function (loadId) {
        if (!loadId) return;

        //获取目标节点
        var $target = reObj.control.find(loadId);

        //获取目标节点的左距离
        marLeft = $target.position().left;

        //修正准星
        marLeft = marLeft + 32;

        //设置焦点的左距离
        $focuser.css('left', marLeft + 'px');

        //修正总进度过长时，焦点走出边缘的问题
        this.fixScroll();
    };

    //修正进度过长滚动问题
    reObj.fixScroll = function () {
        var winWidth = $('body').width(),
            times = Math.floor(marLeft / winWidth);
        scrLeft(-winWidth * times);
    };

    //修正改变窗口大小时，totalProcess的滚动问题
    require('utils/Reducer').ready = function (Reducer) {
        var reducer = new Reducer(300);
        $(window).bind('resize', function () {
            reducer.useEnd(function () {
                reObj.fixScroll();
            });
        });
    };

    //移动焦点的标题替换
    reObj.moverText = function (text) {
        $focusText.text(text);
    };

    //返回容器
    return reObj;
});