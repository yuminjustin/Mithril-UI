define(function (require, exports, module) {
	var m = require("mithril"),
		Tip = require("coms/tip"),
		compent = {
			controller: function () {
				var tip = new Tip();
				return {
					tip: tip
				}
			},
			view: function (ctrl) {
				var button = m("button", {
						class: "_btn _red _mr10",
						onclick: function () {
							ctrl.tip.warn("这是一个异常&警告提示", 1500);
						}
					}, "异常&警告"),
					button2 = m("button", {
						class: "_btn _blue _mr10",
						onclick: function () {
							ctrl.tip.info();
						}
					}, "提示&信息"),
					button3 = m("button", {
						class: "_btn _green _mr10",
						onclick: function () {
							ctrl.tip.success("这是一个成功提示");
						}
					}, "成功"),
					button4 = m("button", {
						class: "_btn _mr10 _white",
						onclick: function () {
							ctrl.tip.load("这是一个正在执行提示");
						}
					}, "正在执行");
				return m("div", [
					button, button2, button3, button4
				]);
			}
		};
	return compent;
});