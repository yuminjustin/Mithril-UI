define(function (require, exports, module) {
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Tabs = function (opts) {
			this.opts = {
				vertical: 0, //是否竖向
				width: window.innerWidth,
				height: window.innerHeight,
				type: "click" //切换方式 hover click
			};
			Tool.extend(this.opts, opts);
		},
		fn = Tabs.prototype,
		vm = function (data) {
			var model = function (data) { /*单个对象*/
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			!data.inner && (data.inner = []);
			data.title.map(function (v, k) {
				var mm = new model({
					title: v,
					inner: data.inner[k] || " ",
					rendered: 0
				});
				if (data.hide) {
					var bool = true;
					data.hide.map(function (n) {
						n == k && (bool = !bool);
					});
					bool && collection.push(mm);
				} else collection.push(mm);
			});
			return {
				collection: collection
			};
		},
		composition = {
			head: function (t) {
				var h = (t.opts.vertical ? t.opts.height - 14 : 36) + "px",
					labels = t.vm.collection.map(function (v, k) {
						return m("a", {
							href: "javascript:;",
							class: "db l pr" + (t.picked == k ? " active" : ""),
							config: function (elem) {
								(t.picked == k) && (t.selected = elem)
							},
							onmouseenter: function (e) {
								(t.picked != k && t.opts.type == "hover") && composition.transform(e, t, k)
							},
							onclick: function (e) {
								(t.picked != k && t.opts.type == "click") && composition.transform(e, t, k)
							}
						}, v.title());
					});
				return m("div", {
					class: "_tabs_head",
					style: {
						height: h
					}
				}, labels);
			},
			body: function (t) {
				var h = t.opts.vertical ? t.opts.height : t.opts.height - 36,
					w = t.opts.vertical ? t.opts.width - 150 + "px" : "auto",
					inners = t.vm.collection.map(function (v, k) {
						var h2 = Math.round(h * 0.96),
							bool = t.picked == k;
						bool && v.rendered(bool);
						!bool && v.rendered() && (bool = !bool);
						return m("div", {
							class: "_tabs_item" + (t.picked == k ? " active" : ""),
							style: {
								height: h2 + "px",
								margin: Math.floor((h - h2) / 2) + "px 2%"
							}
						}, bool ? v.inner()() : "");
					});
				return m("div", {
					class: "_tabs_body",
					style: {
						height: h + "px",
						width: w
					}
				}, inners)
			},
			transform: function (e, t, k) {
				var target = e.currentTarget;
				target.className += " active";
				t.selected.className = "db l pr";
				t.selected = target;
				t.picked = k;
			}
		};
	fn.init = function (data) {
		var t = this;
		if (!data || !data.title) return;
		(typeof t.picked == "undefined") && (t.picked = data.picked || 0);
		!t.vm && (t.vm = vm(data));
		return m("div", {
			class: "_tabs c" + (t.opts.vertical ? " _tabs_vertical" : ""),
			style: {
				width: t.opts.width + "px",
				height: t.opts.height + "px"
			}
		}, [composition.head(t), composition.body(t)]);
	}
	return Tabs;
});