define(function (require) {
    var task = {},
        data = require.use('iData').card.viewData;
    require('headCon', 'mainCon', 'utils/transToView', 'widget/viewTable', 'widget/totalProcess', 'jq/jq-infoView').ready = function (headCon, mainCon, transToView, viewTable, totalProcess) {
        task.viewData = function (viewMapData) {
            //激活相应menu
            headCon.active('viewData');

            //改变当前状态
            CommonData.task = 'viewData';

            //填充topTips
            mainCon.top(data.top.title, data.top.content);

            //容器
            var $container = viewTable.container;

            //初始化容器
            viewTable.init();

            //初始化总进度
            totalProcess.init();

            //选择中的元素
            var beforeSelect = {
                cancel: function () {}
            };

            //转化数据后执行方法
            transToView(viewMapData).action = function (infoData) {

                //添加主要的进度视图
                $(infoData.processData).each(function (i, e) {
                    var scale = e.scale;
                    //主体
                    var $contentBlock = $('<div class="main_content_block" />');

                    //添加view
                    var viewControl = $contentBlock.infoView({
                        title: e.title,
                        scale: scale
                    });

                    //框架class名
                    viewControl.element.addClass('info_block');

                    //添加块
                    $(e.data).each(function (index, element) {
                        //获取控制对象
                        var process = viewControl.add(this);

                        //为process添加id
                        if (this.orginData && this.orginData.loadId) {
                            process.element.attr('id', "view_" + element.orginData.loadId);
                        }

                        //添加点击转换数据事件
                        process.element.click(function (event) {
                            //取消之前选择
                            beforeSelect.cancel();

                            //选择
                            process.select();

                            //替换之前的选择对象
                            beforeSelect = process;

                            //刷新信息视图
                            viewTable.refresh(element.orginData);

                            //移动totalProcess的焦点
                            totalProcess.moveTo(element.orginData.loadId);

                            //更换totalProcess的焦点的文字
                            var thisTime = new Date(element.orginData.start);
                            totalProcess.moverText(thisTime.toTimeString().slice(0, 8) + '.' + thisTime.getMilliseconds());
                        });
                    });

                    //填入容器
                    $container.append($contentBlock);
                })

                //填充容器
                mainCon.main(viewTable.element);
                //console.log(infoData);

                //添加总进度
                var beforeLoadTime = ""; //前一上距离
                $(infoData.sortDatas).each(function (i, e) {
                    //节点的形状（默认圆形）
                    var sharp = 'circle';

                    //判断是否时间与之前相等
                    if (e.start == beforeLoadTime) {
                        sharp = 'square';
                    }

                    //载入颜色（默认蓝色）
                    var color;
                    switch (e.loadType) {
                    case 0:
                        color = 'blue';
                        break;
                    case 1:
                        color = 'yellow';
                        break;
                    case 2:
                        color = 'green';
                        break;
                    case 3:
                        color = 'red';
                        break;
                    }

                    //添加节点
                    var pointControl = totalProcess.control.addPoint(e.loadId, e.orginUri, sharp, color);

                    //点击事件
                    pointControl.element.click(function () {
                        //获取相应的loadProcess
                        var $process = $("#view_" + e.loadId);

                        //模拟点击
                        $process.click();

                        //滚动到相应的loadProcess上
                        //$process[0].scrollIntoView();

                        //判断容器table的上距离
                        var marTop = $process.position().top + $process.parents('.main_content_block').position().top;

                        //动效滚动到相应位置
                        $('.main_content').animate({
                            scrollTop: marTop
                        }, 300);

                        //设置前一个上距离
                        beforeScrollTop = marTop;
                    });

                    //设置前一个时间
                    beforeLoadTime = e.start;
                });

                //填充bottomTips
                mainCon.bottom(totalProcess.element);
            };
        };
    };
    return task;
});