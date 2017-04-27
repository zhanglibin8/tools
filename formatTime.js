;(function (pro) {
    /**
     * 格式化时间字符串
     * @param template string 格式后字符串的格式
     */
    function formatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        template = template.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                result = ary[index];
            result = result || '00';
            result.length < 2 ? result = '0' + result : null;
            return result;
        });
        return template;
    }

    pro.formatTime = formatTime;
})(String.prototype);
