//主题数据查看控件
(function ($) {
    //Class
    //进度条类
    function Process(options, blockCount) {
        var precent = this.totalPercent;
        if (blockCount == 6) {
            precent = this.totalPercent = 0.96;
        }
        var processLen = options.len * precent,
            processMarLen = options.left * precent;
        this.element = $('<div class="module_block"><div class="module_name" title="' + options.nameTitle + '">m1</div><div class="tip_line" style="width:' + (processMarLen + 1) + '%;"></div><div class="load_block" style="width:' + processLen + '%;margin-left:' + processMarLen + '%;">' + (options.text || "") + '</div></div>');
        options.name && this.changeName(options.name);
        options.color && this.changeColor(options.color);
    }
    //默认总长度占用为95%
    Process.prototype.totalPercent = 0.95;
    //改变长度
    Process.prototype.changeLen = function (len) {
        this.element.find('.load_block').css('width', (len * this.totalPercent) + '%');
    };
    //改变向左的距离
    Process.prototype.changeLeft = function (len) {
        var precent = this.totalPercent;
        this.element.find('.tip_line').css('width', (len * precent + 1) + '%');
        this.element.find('.load_block').css('margin-left', (len * precent) + '%');
    };
    //改变文本
    Process.prototype.changeText = function (text) {
        this.element.find('.load_block').text(text);
    };
    //改变颜色
    Process.prototype.changeColor = function (color) {
        var pColor = "";
        switch (color) {
        case 'blue':
            pColor = 'fir';
            break;
        case 'yellow':
            pColor = 'par';
            break;
        case 'green':
            pColor = 'cah';
            break;
        case 'red':
            pColor = 'err';
            break;
        }
        this.element.find('.load_block').removeClass('fir').removeClass('par').removeClass('cah').removeClass('err');
        this.element.find('.load_block').addClass(pColor);
    };
    //改变行名称
    Process.prototype.changeName = function (name) {
        this.element.find('.module_name').text(name);
    };
    //选中当前块
    Process.prototype.select = function () {
        this.element.addClass('select');
    };
    //取消选中当前块
    Process.prototype.cancel = function () {
        this.element.removeClass('select');
    };

    //Plug-in
    $.fn.infoView = function (options) {
        var defaults = {
            title: "",
            scale: [0, 1, 2, 3, 4, 5]
        };
        $.extend(defaults, options);
        var $this = $(this),
            blockCount = 5;
        //主体代码
        var $code = $('<div><div class="block_title">' + defaults.title + '</div><div class="info_table"><div class="table_header"></div><div class="table_body"><div class="table_bg"></div><div class="table_main"></div></div></div></div>'),
            $table_bg = $code.find('.table_bg');
        //判断是否六格度
        if (defaults.scale.length == 7) {
            $code.find('.info_table').addClass('sixtab');
            blockCount = 6;
        }
        //添加刻度
        var $table_header = $code.find('.table_header');
        $(defaults.scale).each(function (i, e) {
            $table_header.append('<div class="table_point"><div class="point_title">' + e + '</div><div class="point_graduation"></div></div>');

            //添加刻度辅助线
            $table_bg.append('<div class="table_point"><div class="time_line"></div></div>');
        });
        //添加一条数据的方法
        var $table_main = $code.find('.table_main');
        var addProcess = function (opt) {
            var process = new Process(opt, blockCount);
            $table_main.append(process.element);
            return process;
        };

        $this.append($code);

        return {
            element: $code,
            add: addProcess
        };
    };
})(jQuery);