//适配框架高度
(function () {
    var $win = $(window),
        $main_content = $('.main_content'),
        beforeHeight = 0,
        reWin = function () {
            var winHeight = $win.height();
            var mainHei = winHeight - 172;
            //优化横向resize不操纵节点
            if (beforeHeight != mainHei) {
                $main_content.css('height', mainHei + 'px');
                beforeHeight = mainHei;
            }
        };
    //载入完Reduce执行
    require('utils/Reducer').ready = function (Rerucer) {
        var reducer = new Rerucer(200);
        $win.resize(function () {
            reducer.use(reWin);
        });
    };
    //窗口宽度适应
    reWin();
})();