define(function (require, exports, module) {
	var m = require("mithril"),
		Popup = require("coms/popup"),
		compent = {
			controller: function () {
				var pop = new Popup({
					hasMask:1,
					closeType:1,
                    maskClose:1,
					inner: function () {
						return m("button", {
							onclick: function () {
								alert("我被执行了！");
							}
						}, "我来测试的");
					}
				});
				return {
					pop:pop
				}
			},
			view: function (ctrl) {
				var button = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.pop.open();
						}
					}, "打开一个popup"),
					button2 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.pop.close();
						}
					}, "关闭popup"),
					button3 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.pop.hide();
						}
					}, "隐藏popup"),
					button4 = m("button", {
						class: "_btn _mr10",
						onclick: function () {
							ctrl.pop.distory();
						}
					}, "销毁popup");
				return m("div", [
					button, button2, button3, button4
				]);
			}
		};
	return compent;
});