define(function (require, exports, module) {
    var m = require("mithril"),
        Lang = require("pub/lang"),
        Unit = { /*小部件*/
            loading: function () {
                return m("div", {
                    class: "_aCenter _unit_load",
                }, m("span", {
                    class: "_icon _icon-loading"
                }), Lang.unit)
            }
        }

    return Unit;
});