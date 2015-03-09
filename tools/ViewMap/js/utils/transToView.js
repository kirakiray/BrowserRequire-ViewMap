//转换mapView控件数据
define(function (require) {
    return function (viewMapData) {
        var transObj = {
            //后备用方法（载入完毕后执行的方法）
            action: function () {
                return '';
            }
        };

        //载入相应版本
        require('utils/trans/v_' + viewMapData.v).ready = function (transFun) {
            var transData = transFun(viewMapData.data);
            transObj.action(transData);
        };

        //返回执行对象
        return transObj;
    };
});