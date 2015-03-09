(function ($) {
    //Class
    function TotalProcessPoint(name) {
        this.element = $('<div class="total_process_point" title="' + name + '"><div class="total_process_point_name">' + name + '</div></div>');
    }
    //改变颜色
    TotalProcessPoint.prototype.changeColor = function (color) {
        //color = blue yellow green red

        //去掉原先的颜色class
        this.element.removeClass('blue yellow green red');

        //添加新改的颜色
        this.element.addClass(color);
    };
    //改变形状
    TotalProcessPoint.prototype.changeShape = function (shape) {
        //shape = circle square

        //去掉原先的形状class
        this.element.removeClass('circle square');

        //添加新形状
        this.element.addClass(shape);
    };

    //Plug
    $.fn.totalProcess = function (options) {
        var defaults = {
            width: ""
        };
        $.extend(defaults, options);
        var $this = $(this);

        //容器，style标签
        var $code = $('<div class="total_process"></div>'),
            $style = $('<style />');

        //添加style节点
        $('head').append($style);

        //添加主体内容
        $this.append($code);

        //节点个数
        var pointCount = 0;

        //修正进度条总长度的方法
        var fixedTotalWidth = function () {
            $code.css('width', pointCount * 56 + 'px');
            controlObj.width = pointCount * 56;
        };

        //控制对象
        var controlObj = {
            //totalProcess的总长度
            width: 0,
            /*  设置横条间距宽度样式方法
                会修改全部的totalProcess样式
                初始距离是37px
                向左距离是41px
                相差4px
            */
            setWidth: function (width) {
                //默认宽度
                width = width || 37;

                //样式内容
                var str = '.total_process_point:after {width: ' + width + 'px;} .total_process_point{margin-left: ' + (width + 4) + 'px;}';

                //载入字符串
                $style.html(str);
            },
            //添加一个节点
            addPoint: function (id, name, shape, color) {
                //递增节点数
                pointCount++;

                //生成对象
                var totalProcessPoint = new TotalProcessPoint(name);

                //添加id
                totalProcessPoint.element.attr('id', 'tp_' + id);

                //改变颜色和形状
                totalProcessPoint.changeShape(shape);
                totalProcessPoint.changeColor(color);

                //添加元素
                $code.append(totalProcessPoint.element);

                //修正长度
                fixedTotalWidth();

                //返回控制器
                return totalProcessPoint;
            },
            //根据id查找节点
            find: function (id) {
                return $code.find('#tp_' + id);
            },
            //主体元素
            element: $code
        };

        //是否有默认传入设置宽度
        if (defaults.width) {
            controlObj.setWidth(defaults.width);
        }

        //返回控制对象
        return controlObj;
    };
})(jQuery);