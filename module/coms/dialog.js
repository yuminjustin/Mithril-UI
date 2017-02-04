define(function (require, exports, module) {
	var m = require("mithril"),
        Popup = require("./popup"),
		Tool = require("pub/tool"),
		Lang = require("pub/lang"),
		Dialog = function (opts) {
			var t = this,
				inner;
			opts = opts || {};
			opts.style = opts.style || {};
			Tool.extend(opts, {
				className: "_dialog",
				style: {
					width: opts.style.width || 300,
					height: opts.style.height || 180
				}
			});
			inner = opts.inner ? opts.inner() : null;
			opts.inner = function () {
				var close = m("i", {
						class: "_icon _icon-cross r",
						title: Lang.close,
						onclick: t.close.bind(t)
					}),
					sure = m("button", {
						class: "_btn _orange",
						title: Lang.sure,
						onclick: opts.sure || t.close.bind(t)
					}, Lang.sure),
					cancel = m("button", {
						class: "_btn",
						title: Lang.cancel,
						onclick: opts.cancel || t.close.bind(t)
					}, Lang.cancel);
				return [m("div", {
					class: "title c"
				}, [m("p", opts.title || Lang.notice), close]), inner, m("div", {
					class: "_option_panle"
				}, [sure, cancel])];
			};
			this.pop = new Popup(opts);
		},
		fn = Dialog.prototype;
	/*销毁*/
	fn.distory = function () {
		this.pop.distory();
	};
	/*隐藏*/
	fn.hide = function () {
		this.pop.hide();
	};
	/*打开*/
	fn.open = function () {
		this.pop.open();
	};
	/*关闭 根据closeType*/
	fn.close = function () {
		this.pop.close();
	};
	return Dialog;
});