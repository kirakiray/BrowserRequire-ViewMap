//控制头部
define(function () {
    //私有变量
    var $menu = $('#menu');
    var header = {
        add: function (obj) {
            /*obj = {
                id: "",
                text: ""
            };*/
            var $li = $('<li id="header_' + obj.id + '">' + obj.text + '</li>');
            $menu.append($li);
            return $li;
        },
        remove: function (id) {
            $menu.find('#header_' + id).remove();
        },
        active: function (id) {
            $menu.find('li').removeClass('active');
            $menu.find('#header_' + id).addClass('active');
        },
        clickHandle: function (id, fun, data) {
            var $activeLi = $menu.find('#header_' + id);
            $activeLi.click(function (e) {
                if (data) {
                    fun(data);
                } else {
                    fun(e);
                }
            });
        }
    };
    return header;
});