define(function (require, exports, module) {
	var m = require("mithril"),
		Dialog = require("coms/dialog"),
		compent = {
			controller: function () {
				var dialog = new Dialog({
					closeType: 1,
					inner: function () {
						return m("button", {
							onclick: function () {
								alert("我被执行了！");
							}
						}, "我来测试的");
					}
				});
				return {
					dialog: dialog
				};
			},
			view: function (ctrl) {
				var button = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.dialog.open();
						}
					}, "打开一个dialog"),
					button2 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.dialog.close();
						}
					}, "关闭dialog"),
					button3 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.dialog.hide();
						}
					}, "隐藏popup"),
					button4 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.dialog.distory();
						}
					}, "销毁dialog");
				return m("div", [
					button, button2, button3, button4
				]);
			}
		};
	return compent;
});