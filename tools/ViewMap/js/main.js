//设置基本参数，定义相关初始化操作
require = {
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-2.1.3',
        viewMap: '../../../src/br-dev-ViewMap',
        //bare: '../../../src/br-dev-bare',
        headCon: 'presenter/headControl',
        mainCon: 'presenter/mainControl'
    }
};

//公用变量，用于保存当前状态等
var CommonData = {
    //当前任务
    task: ""
};
(function () {
    //require载入完后运行的方法
    require.ready = function () {
        //载入br插件后载入jquery
        //var r1 = require('viewMap').require('bare', 'jquery');
        var r1 = require('viewMap').require('jquery');
        //载入高度定义初始化定义、界面数据
        r1.require('init/frameSet');
        //初始化的填充数据
        r1.require('face/cn').require('headCon', 'task/inputData').ready = function (headCon, task) {
            //iData为载入的界面数据(face/cn)中自定义的id
            var iData = require.use('iData');

            //填充header
            $(iData.header).each(function (i, e) {
                headCon.add(e);
            });

            //添加点击逻辑
            headCon.clickHandle('inputData', function () {
                //判断当前状态决定是否改变task
                if (CommonData.task == 'inputData') {
                    return;
                }

                //点击inputData 按钮跳入inputData任务
                task.inputData();
            });

            //首次进入inputData任务
            task.inputData();
        };
    };
})();