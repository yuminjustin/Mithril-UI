define(function (require, exports, module) {
	var m = require("mithril"),
		Tabs = require("coms/tab"),
		compent = {
			controller: function () {
				var tabs = new Tabs({
					vertical: 0,
					width: 600,
					height: 200
				});
				return {
					tabs: tabs
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.tabs.init({
					picked: 1, //被选中
					hide: [], //隐藏显示 角标
					title: [
						"选项一", "选项二", "选项三", "选项四", "选项五" //标签名
					],
					inner: [ //标签对应内容
						function () {
							return m("div", "内容一")
						},
						function () {
							return m("div", "内容二")
						},
						function () {
							return m("div", "内容三")
						},
						function () {
							return m("div", "内容四")
						},
						function () {
							return m("div", "内容五")
						}
					]
				}));
			}
		};
	return compent;
});