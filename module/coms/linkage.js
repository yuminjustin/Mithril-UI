define(function (require, exports, module) { /*链式下拉框*/
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Linkage = function (opts) {
			var t = this;
			t.opts = {
				selectedId: [],
				data: null,
				relate: null,
				onselected: null
			};
			Tool.extend(t.opts, opts);
			t.listHide = 1;
			t.selected = [];
			t.data = [];
			t.single = 1;
			document.addEventListener("click", function () {
				t.target && (!t.listHide) && t.target.click();
			}, false);
		},
		fn = Linkage.prototype,
		composition = {
			objBuild: function (t, idx, data) {
				t.selected[idx] && (t.opts.selectedId[idx] = t.selected[idx].id());
				t.opts.selectedId[idx] = t.opts.selectedId[idx] || (idx ? data[0].id : t.opts.data[0].id);
				t.data[idx] = composition.dataRebuild((idx ? data : t.opts.data), t.opts.selectedId[idx]);
			},
			dataRebuild: function (data, sid) {
				return data.map(function (v, index) {
					v.selected = (sid == v.id) ? 1 : 0;
					return v;
				});
			},
			position: function (t) {
				setTimeout(function () {
					t.listTarget.style.top = t.mainTarget.offsetHeight + "px";
				}, 1)
			},
			cb: function (model, t, n) {
				var _this = this,
					deferred = m.deferred();
				if (n != t.opts.relate.length && model) {
					t.opts.relate[n](model, function (data) {
						n && (t.single = 1);
						var m = n + 1;
						_this.getInner(model, data, t, n);
						(t.data[m]) ? (function () {
							t.data[m] = new vm(t.data[m], t, m);
							(m == t.opts.relate.length) ? deferred.resolve(): _this.cb(t.selected[m], t, m);
						})() : deferred.resolve();
					});
				} else {
					(t.linkList.length == 1) && t.opts.onselected(t.selected);
					t.single && (function () {
						t.target.click();
						t.single = 0;
					})()
					deferred.resolve();
				}
				deferred.promise.then(function () {
					t.linkList = t.data.map(function (models, k) {
						return _this.list(t, models, k);
					});
				});
			},
			list: function (t, models, idx) {
				return m("ul", models.collection.map(function (model) {
					return m("li", {
						class: "ellipsis" + (model.selected() ? " selected" : ""),
						onclick: function (e) {
							t.selected[idx] = model;
							(t.opts.relate.length == idx) ? t.opts.onselected(t.selected): (function () {
								((t.selected.length != 1) && (t.selected.length == idx + 1)) ? t.opts.onselected(t.selected): e.stopPropagation();
								t.opts.selectedId.length = idx;
							})()
							t.selected.length = idx + 1;
							t.data.length = idx + 1;
						}
					}, model.name())
				}));
			},
			getInner: function (model, objs, target, idx) {
				var data, t = this;
				for (var item in objs) {
					(item == model.id()) && (data = objs[item]);
				};
				data && t.objBuild(target, idx + 1, data);
			},
			process: function (t, s) {
				for (var i = s; i < t.opts.relate.length; i++) {
					composition.cb(t.selected[i], t, i);
				}
			},
			output: function (t) {
				var str = "";
				t.selected.map(function (model) {
					str += model.name() + "/";
				});
				return str.substring(0, str.length - 1);
			}
		},
		vm = function (data, t, idx) { /*数据处理*/
			var model = function (data) { /*单个对象*/
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			data.map(function (v) {
				var mm = new model(v);
				mm.selected() && (t.selected[idx] = mm);
				collection.push(mm);
			});
			return {
				collection: collection
			};
		};
	fn.init = function () {
		var t = this,
			box, header;
		composition.objBuild(t, 0);
		t.data[0] = new vm(t.data[0], t, 0);
		composition.process(t, 0);
		box = m("div", {
			class: "_linkage_list_box pa " + (t.listHide ? "_none" : "_in"),
			config: function (elem) {
				t.listTarget = elem;
			}
		}, t.linkList);
		header = m("div", {
			class: "_linkage-selected"
		}, composition.output(t));
		return m("div", {
			class: "_linkage",
			onclick: function (e) {
				e.stopPropagation();
				t.target = e.currentTarget;
				t.listHide = !t.listHide;
				t.target.style.zIndex = t.listHide ? 1 : 9999999;
				composition.position(t);
			},
			config: function (elem) {
				t.mainTarget = elem;
			}
		}, [header, box])
	}
	return Linkage;
})