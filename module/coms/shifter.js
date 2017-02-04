define(function (require, exports, module) {
	var m = require("mithril"),
		Shifter = function (opts) {
			this.opts = opts || {
				init: 0,
				onclick: null
			};
			this.vm = new vm({
				status: this.opts.init
			})
		},
		vm = function (arr) {
			var model = function (data) {
				for (var i in data) {
					this[i] = m.prop(data[i]);
				}
			};
			return {
				model: new model(arr)
			};
		},
		fn = Shifter.prototype;
	fn.init = function () {
		var t = this;
		return m("div", {
			class: "_shifter " + (t.vm.model.status() ? "_on" : "_off"),
			onclick: function () {
				t.vm.model.status(!t.vm.model.status());
				t.opts.onclick && t.opts.onclick(t.vm.model.status());
			}
		}, [
				  m("i", {
				class: "_icon _icon-check"
			}),
				  m("i", {
				class: "_icon _icon-cross"
			}),
				  m("a", {
				href: "javascript:;"
			})
		])
	}
	return Shifter;
});