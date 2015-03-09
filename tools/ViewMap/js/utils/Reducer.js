//节流器
define(function () {
    function Reducer(time) {
        this.timeout = 0;
        this.time = time || 500;
    };
    //会在规定时间内重复执行节流
    Reducer.prototype.use = function (callback) {
        var _this = this,
            time = _this.time;
        if (!_this.timeout) {
            _this.timeout = setTimeout(function () {
                callback();
                //重置timeout
                _this.timeout = 0;
            }, time);
        }
    };
    //只会在停下动作后的规定时间内执行一次
    Reducer.prototype.useEnd = function (callback) {
        var _this = this,
            time = _this.time;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            callback();
        }, time);
    };
    return Reducer;
});