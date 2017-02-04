define(function (require, exports, module) {
	var m = require("mithril"),
        Popup = require("./popup"),
		Tool = require("pub/tool"),
		Lang = require("pub/lang"),
		Tip = function () {},
		fn = Tip.prototype,
		innerMaker = function (opts) {
			var pop = new Popup({
				style: {
					width: "auto",
					height: 32
				},
				animate:{
					in:"fadeInDown",
					out:"fadeOutDown"
				}
			});
			pop.opts.inner = function () {
				return m("div", {
					class: "_tip _" + opts.type
				}, [m("i", {
						class: "_icon "+opts.icon
					})
				], opts.text || Lang.normalTip);
			}
			open.apply(this, [opts.duration, pop]);
		},
		open = function (duration, pop) {
			pop.open();
			setTimeout(function () {
				pop.close();
			    pop = null; //释放内存
			}, duration || 3000);
		};
	fn.warn = function (text, duration) {
		innerMaker({
			type: "warn",
			icon: "_icon-exclamation-circle",
			text: text,
			duration: duration
		});
	}
	fn.info = function (text, duration) {
		innerMaker({
			type: "info",
			icon: "_icon-info-circle",
			text: text,
			duration: duration
		});
	}
	fn.success = function (text, duration) {
		innerMaker({
			type: "success",
			icon: "_icon-check-circle",
			text: text,
			duration: duration
		});
	}
	fn.load = function (text, duration) {
		innerMaker({
			type: "load",
			icon: "_icon-loading",
			text: text,
			duration: duration
		});
	}
	return Tip;
});