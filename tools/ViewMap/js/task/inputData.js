//输入文本任务
define(function (require) {
    //任务控制器，界面数据
    var task = {},
        data = require.use('iData').card.inputData;
    require('headCon', 'mainCon').ready = function (headCon, mainCon) {
        //任务控制器的inputData方法
        task.inputData = function () {
            //激活相应menu
            headCon.active('inputData');

            //改变当前状态
            CommonData.task = 'inputData';

            //填充topTips
            mainCon.top(data.top.title, data.top.content);

            /**
                1.生成text;
                2.添加逻辑;
                3.填充主内容
            */
            var $text = $('<textarea id="data_input" />').attr('placeholder', data.main.textarea.placeholder);
            $text.bind('paste', function (event) {
                var e = event.originalEvent;
                e.stopPropagation();
                e.preventDefault();
                e.clipboardData = e.clipboardData || window.clipboardData;
                var dataStr = e.clipboardData.getData('text');
                try {
                    var viewMapData = JSON.parse(dataStr);
                    //正确数据走viewData任务
                    require('task/viewData').ready = function (inTask) {
                        inTask.viewData(viewMapData);
                    };
                    //console.log(viewMapData);
                } catch (err) {
                    $text.val('paste data error');
                    //console.error('paste data error');
                }
            });
            mainCon.main($text);

            //填充bottomTips
            mainCon.bottom(data.bottom.content);
        };
    };
    //返回任务控制器
    return task;
});