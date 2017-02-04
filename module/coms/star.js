define(function (require, exports, module) {
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Star = function (opts) {
			this.opts = {
				tpl: function(s){
					return s;
				},
				type: "full", //全星 5分制 half 半星 10分制
				onselected: null,
				score: 0 //预制分数
			}
			Tool.extend(this.opts, opts);
			this.score = this.opts.score;
			this.vm = this.opts.type == "full" ? vm(5, this) : vm(10, this);
		},
		vm = function (n, t) {
			var model = function (data) {
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			for (var i = 0; i < n; i++) {
				var mm = new model({
					id: i,
					hover: 0,
					pick: (t.score > i) ? 1 : 0
				});
				collection.push(mm);
			}
			return {
				collection: collection,
				pickIt: function (model) {
					this.collection = this.collection.map(function (v) {
						(v.id() <= model.id()) ? v.pick(1): v.pick(0);
						return v;
					});
				},
				onIt: function (model) {
					this.collection = this.collection.map(function (v) {
						(v.id() <= model.id()) ? v.hover(1): v.hover(0);
						return v;
					});
				},
				leaveIt: function () {
					this.collection = this.collection.map(function (v) {
						v.hover(0);
						return v;
					});
				}
			};
		},
		composition = {
			full: function (t) {
				var _t = this;
				return t.vm.collection.map(function (model) {
					var cn = (model.pick() ? " active" : "");
					!cn && (cn = model.hover() ? " hover" : "");
					return m("span", {
						class: "_star_item" + cn,
						onmouseenter: function () {
							t.vm.onIt(model);
						},
						onclick: function () {
							_t.clickIt(t, model);
						}
					});
				});

			},
			half: function (t) {
				var _t = this,
					temp;
				return t.vm.collection.map(function (model, k) {
					var cn = (model.pick() ? " active" : ""),
						elem;
					!cn && (cn = model.hover() ? " hover" : "");
					elem = m("i", {
						class: cn,
						onmouseenter: function () {
							t.vm.onIt(model);
						},
						onclick: function () {
							_t.clickIt(t, model);
						}
					});
					if (k % 2) {
						var temp2 = elem;
						return m("span", {
							class: "_star_item harf"
						}, [temp, temp2]);
					} else temp = elem;
				});
			},
			clickIt: function (t, model) {
				t.vm.pickIt(model);
				t.score = model.id() + 1;
				t.opts.onselected && t.opts.onselected(t.score);
			}
		},
		fn = Star.prototype;
	fn.init = function () {
		var t = this,
			stars = composition[t.opts.type](t);
		stars.push(m("span", t.opts.tpl(t.score)));
		return m("div", {
			class: "_score",
			onmouseleave: t.vm.leaveIt.bind(t.vm)
		}, stars);
	}
	return Star;
});