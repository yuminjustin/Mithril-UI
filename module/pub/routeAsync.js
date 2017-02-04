define(function (require, exports, module) {
    /*路由 异步加载 mithril 扩展*/
    /*格式：module/action/condition*/
    var m = require("mithril"),
        Route = {
            split: function (path) {
                var condition = {};
                path = path.replace("\/", "").split("/");
                (path[2]) && (function () {
                    for (var i = 2, l = path.length; i < l; i++) {
                        var temp = path[i].split(":");
                        condition[temp[0]] = temp[1] ? temp[1] : null;
                    }
                })();
                return {
                    module: path[0] || null,
                    action: path[1] || null,
                    condition: condition
                }
            },
            init: function (path, render) {
                var t = this,
                    con = t.split(path),
                    arr = [t.root],
                    url;
                if (!con.module) {
                    m.route(t.error); //错误页面 需要在Route中定义
                    return;
                }
                arr.push(con.module);
                con.action && arr.push(con.action);
                url = arr.join("/");
                m.request({
                    url: "./" + url + ".js",
                    timeout: 2000,
                    deserialize: function (str) {
                        return str;
                    },
                    unwrapSuccess: function (re) {
                        re && require([url], function (comp) {
                            window.scrollTo(0, 0);
                            render(comp, con.condition);
                        });
                    },
                    unwrapError: function () {
                        m.route(t.error); //错误页面 需要在Route中定义
                    }
                });

            }
        }
    return function (c) {
        c = c || {};
        Route.root = c.root || "module"; //被加载js的根目录
        Route.error = c.error || "/error"; //异常页面
        return Route.init.bind(Route);
    };
});