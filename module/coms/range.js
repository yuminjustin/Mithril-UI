define(function (require, exports, module) {
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Range = function (opts) {
			var t = this;
			t.opts = {
				min: 0,
				max: 100,
				step: 1,
				mark: null,
				dot: null,
				onselected: null
			}
			Tool.extend(t.opts, opts);
			t.opts.range = t.opts.max - t.opts.min;
			composition.build(t);
			!t.opts.dot && (t.opts.dot = [t.opts.min, t.opts.min]);
			t.opts.dot = t.opts.dot.map(function (v) {
				return {
					n: v,
					move: false,
					hover: false
				}
			})
			t.vm_dot = vm(t.opts.dot);
			document.addEventListener("mousemove", function (e) {
				t.active && (function () {
					var n = Math.floor((e.screenX - 20) / 360 * t.opts.range) + t.opts.min;
					(n >= t.opts.min && n <= t.opts.max) && t.active.model.n(n);
					m.redraw();
				})();
			}, false);
			document.addEventListener("mouseup", function (e) {
				t.active && (function () {
					t.active.model.move(0);
					t.active = null;
					m.redraw();
					composition.output(t);
				})();
			}, false);
		},
		vm = function (arr) {
			var model = function (data) { /*单个对象*/
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			arr.map(function (v) {
				collection.push(new model(v));
			});
			return {
				collection: collection
			};
		},
		fn = Range.prototype,
		composition = {
			build: function (t) {
				t.opts.mark = t.opts.mark.map(function (n) {
					(n < t.opts.min) && (n = t.opts.min);
					(n > t.opts.max) && (n = t.opts.max);
					return n;
				});
				t.opts.dot = t.opts.dot.map(function (n) {
					(n < t.opts.min) && (n = t.opts.min);
					(n > t.opts.max) && (n = t.opts.max);
					return n;
				});
			},
			marks: function (t) {
				var opts = t.opts,
					mark = opts.mark;
				mark = mark.concat([opts.min, opts.max]);
				return mark.map(function (item) {
					return m("span", {
						class: "_gd_c_mark",
						style: "left:" + (item - opts.min) / opts.range * 100 + "%",
						onclick: function () {
							composition.clickMark(t, item);
						}
					}, m("i", item))
				});
			},
			sliders: function (t) {
				var opts = t.opts,
					l, w, dots, len = t.vm_dot.collection.length;
				opts.dot = opts.dot || [0];
				opts.dot.length > 2 && (opts.dot.length = 2);
				dots = t.vm_dot.collection.map(function (model, k) {
					(!k) && (l = model.n());
					(k) && (w = Math.abs(model.n() - l));
					(model.n() < l) && (l = model.n());
					return m("div", {
						class: "_gd_c_slider",
						style: "left:" + (model.n() - opts.min) / opts.range * 100 + "%",
						onmousedown: function (e) {
							t.active = {
								dom: e.currentTarget,
								model: model
							}
							model.move(1);
						},
						onmouseenter: function (e) {
							model.hover(1);
						},
						onmouseleave: function (e) {
							model.hover(0);
						}
					}, [
						m("span", {
							class: "_dot " + ((model.hover() || model.move()) ? "on" : "")
						}),
						m("div", {
							class: "pa _gd_tip " + ((model.hover() || model.move()) ? "" : "none")
						}, [
							m("span", model.n()),
							m("i", {
								class: "_icon _icon-caret-down"
							})
						])
					]);
				});
				w = (len == 1) ? (l - opts.min) * 100 / t.opts.range : w * 100 / t.opts.range;
				l = (len == 1) ? 0 : (l - opts.min) * 100 / t.opts.range;
				dots.push(m("div", {
					class: "_gd_bar",
					style: "left:" + l + "%;width:" + w + "%;"
				}));
				return dots;
			},
			output: function (t) {
				t.opts.onselected && t.opts.onselected(t.vm_dot.collection.map(function (model) {
					return model.n();
				}));
			},
			clickMark: function (t, n) {
				var arr = t.vm_dot.collection.map(function (model) {
					return Math.abs(n - model.n());
				});
				(arr.length == 1) && (t.vm_dot.collection[0].n(n));
				(arr[0] < arr[1]) ? (t.vm_dot.collection[0].n(n)) : (t.vm_dot.collection[1].n(n));
				m.redraw();
				this.output(t);
			}
		};
	fn.init = function () {
		var t = this,
			mark = composition.marks(t),
			slider = composition.sliders(t);
		slider = slider.concat(mark);
		return m("div", {
			class: "_graduation pr",
			config: function (elem) {
				t.elem = elem;
			}
		}, m("div", {
			class: "_gd_cursor"
		}, slider));
	}
	return Range;
});