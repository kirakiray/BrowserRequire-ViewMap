define(function () {
    //私有变量
    var $main = $('.main'),
        $tip_title = $main.find('.tip_title'),
        $tip_content = $main.find('.tip_content'),
        $bottom_tips = $main.find('.bottom_tips'),
        $main_content = $main.find('.main_content');

    //控制主体
    var control = {
        top: function (title, content) {
            $tip_title.text(title);
            $tip_content.empty().append(content);
        },
        main: function (content) {
            $main_content.empty().append(content);
        },
        bottom: function (content) {
            $bottom_tips.empty().append(content);
        }
    };
    return control;
});