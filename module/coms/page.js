define(function (require, exports, module) {
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Lang = require("pub/lang"),
		Page = function (opts) {
			this.opts = {
				pagesize: 5, //每页条数
				onPageChange: null //换页事件
			}
			Tool.extend(this.opts, opts);
		},
		vm = function (arr) {
			var model = function (data) {
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			arr.map(function (v) {
				!v.cn && (v.cn = "");
				collection.push(new model(v))
			})
			return {
				collection: collection
			};
		},
		fn = Page.prototype,
		composition = {
			btns: function (t) {
				var _this = this,
					arr = [];
				t.pages = Math.ceil(t.total / t.opts.pagesize); //总页数
				t.page != 1 && arr.push(_this.iconBtn(1));
				arr = arr.concat(_this.numberBtn(t));
				t.page != t.pages && arr.push(_this.iconBtn());
				return arr;
			},
			iconBtn: function (p) {
				var _this = this,
					cn = "_icon " + (p ? "_icon-left" : "_icon-right"),
					text = p ? Lang.pages[0] : Lang.pages[1],
					re = {
						type: "icon",
						cn: cn,
						title: text
					}
				return re;
			},
			numberBtn: function (t) {
				var _this = this,
					arr = [],
					l, r;
				if (t.page < 3) {
					l = 1;
					r = t.pages > 5 ? 5 : t.pages;
				} else if (t.pages - t.page < 2) {
					r = t.pages;
					l = (t.pages - 4 > 0) ? t.pages - 4 : 1;
				} else {
					l = t.page - 2;
					r = t.page + 2;
				}
				t.pages > 5 && (arr = arr.concat(_this.edge(t)));
				for (var i = l; i <= r; i++) {
					var v = (i == t.page) ? {
						type: "span",
						cn: "_page_on",
						value: i
					} : {
						type: "page",
						value: i
					}
					arr.push(v);
				}
				t.pages > 5 && (arr = arr.concat(_this.edge(t, 1)));
				return arr;
			},
			edge: function (t, p) {
				var _this = this,
					arr = [],
					l = {
						type: "page",
						value: 1
					},
					e = {
						type: "span",
						value: "..."
					},
					r = {
						type: "page",
						value: t.pages
					};
				if (p) {
					(t.pages - t.page > 3) && arr.push(e);
					(t.pages - t.page > 2) && arr.push(r);
				} else {
					(t.page > 3) && arr.push(l);
					(t.page > 4) && arr.push(e);
				}
				return arr;
			},
			change: function (t, model) {
				var page;
				if (model.type() == "icon") {
					page = ~model.cn().indexOf("left") ? t.page == 0 ? t.page : t.page - 1 : t.pages == t.page ? t.page : t.page + 1;
				} else page = model.value();
				t.opts.onPageChange && t.opts.onPageChange(page);
			},
			pages: function (t) {
				var _this = this;
				return t.vm.collection.map(function (model) {
					if (model.type() == "icon")
						return m("a", {
							href: "javascript:;",
							class: model.cn(),
							title: model.title(),
							onclick: function () {
								_this.change(t, model)
							}
						})
					else if (model.type() == "span")
						return m("span", {
							class: model.cn() || "",
							title: Number(model.value()) ? Lang.pages[3](model.value()) : model.value()
						}, model.value())
					else
						return m("a", {
							href: "javascript:;",
							class: model.cn() || "",
							title: Lang.pages[3](model.value()),
							onclick: function () {
								_this.change(t, model)
							}
						}, model.value())
				});
			}
		}
	fn.init = function (data) {
		var t = this,
			pages;
		!t.page && (t.page = data.page);
		!t.total && (t.total = data.total);
		t.vm = vm(composition.btns(t));
		pages = composition.pages(t);
		pages.unshift(m("span", Lang.pages[2](t.total)))
		return m("div", {
			class: "_page"
		}, pages);
	}
	fn.redraw = function (n) {
		this.page = n;
	}
	return Page;
});