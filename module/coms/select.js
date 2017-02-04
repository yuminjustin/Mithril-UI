define(function (require, exports, module) {
	var m = require("mithril"),
		Select = function (opts) {
			var t = this;
			this.opts = opts || {
				data: [],
				onselected: null,
				muti: 0
			};
			t.opts.muti && (t.muti = []);
			(!opts.muti && typeof opts.selectedId == "object") && (opts.selectedId = opts.selectedId[0]);
			composition.objBuild(this);
			document.addEventListener("click", function () {
				t.target && (!t.listHide) && t.target.click();
			}, false)
		},
		fn = Select.prototype,
		vm = function (t) { /*数据处理*/
			var data = t.opts.data,
				model = function (data) { /*单个对象*/
					for (var i in data) {
						this[i] = m.prop(data[i]);
					}
				},
				collection = [];
			data.map(function (v) {
				var mm = new model(v);
				(mm.selected()) && (t.selected = mm);
				collection.push(mm);
			});
			return {
				collection: collection,
				setSelected: function (i, t, obj, r) {
					var selected = t.opts.muti ? t.muti : null,
						func = function (idx, index, model) {
							if (selected) {
								if (index == idx) {
									if (model.selected()) {
										model.selected(0);
										selected = composition.push(selected, model);
									} else {
										model.selected(1);
										selected.push(model);
									}
								}
							} else(index == idx) ? model.selected(1) && (selected = model) : model.selected(0);
						};
					this.collection = this.collection.map(function (model, index) {
						(r && t.muti) && model.selected(0);
						if (i >= 0) func(i, index, model);
						else {
							if (typeof i == "object") {
								i.forEach(function (idx) {
									func(idx, index, model);
								});
							} else {
								if (obj.id() == model.id()) {
									model.selected(0);
									selected = composition.push(selected, model);
								}
							}
						}
						return model;
					});
					t.opts.onselected && t.opts.onselected(selected);
				}
			};
		},
		composition = {
			objBuild: function (t) {
				t.opts.selectedId = t.opts.selectedId || t.opts.data[0].id;
				t.opts.data = composition.dataRebuild(t);
				t.vm = new vm(t);
				t.listHide = 1;
			},
			dataRebuild: function (t) {
				var opts = t.opts
				return opts.data.map(function (v, index) {
					if (opts.muti && typeof opts.selectedId == "object") {
						v.selected = 0;
						opts.selectedId.forEach(function (id) {
							!v.selected && (v.selected = (id == v.id) ? 1 : 0);
						});
					} else v.selected = (opts.selectedId == v.id) ? 1 : 0;
					return v;
				});
			},
			getSelected: function (t) {
				var re = t.opts.muti ? [] : null;
				t.vm.collection.map(function (model, index) {
					if (!t.opts.muti) {
						(!re) && (t.selected = model.selected() ? model : t.selected);
						(!re) && (re = model.selected() ? model.name() : "");
					} else model.selected() && re.push(model);
				});
				t.opts.muti && (t.muti = t.muti.length ? composition.union(t.muti, re) : re) && (re = t.muti);
				return re;
			},
			listMaker: function (t) {
				var items = t.vm.collection.map(function (model, index) {
					return m("li", {
						onclick: function (e) {
							t.opts.muti && e.stopPropagation();
							t.vm.setSelected(index, t);
							composition.position(t);
						},
						config: function (elem) {
							elem.className = "ellipsis" + (model.selected() ? " selected" : "");
						}
					}, t.opts.muti ? m("i", {
						class: "_icon _icon-check"
					}) : "", model.name());
				});
				return items;
			},
			getData: function (t, data) {
				var index = [];
				t.opts.data.filter(function (v, k) {
					if (typeof data.name == "object") {
						data.name.forEach(function (item) {
							item == v.name && index.push(k);
						});
					} else if (typeof data.id == "object") {
						data.id.forEach(function (item) {
							item == v.id && index.push(k);
						});
					} else((data.name == v.name) || (data.id == v.id)) && index.push(k);
				});
				return index;
			},
			view: function (t) {
				return (t.opts.muti) ? m("div", {
					class: "_select_muti-selected",
				}, composition.getSelected(t).map(function (model) {
					return m("p", {
						class: "ellipsis"
					}, [
						m("span", model.name()),
						m("i", {
							class: "_icon _icon-cross",
							onclick: function (e) {
								e.stopPropagation();
								t.vm.setSelected(-1, t, model);
								composition.position(t);
							}
						})
					])
				})) : m("span", {
					class: "l db ellipsis",
					config: function (elem) {
						elem.innerHTML = composition.getSelected(t);
					}
				})
			},
			push: function (arr, obj) {
				var re = [];
				if (!arr.length) re.push(obj);
				else arr.forEach(function (model) {
					(model.id() != obj.id()) && re.push(model);
				});
				return re;
			},
			union: function (muti, arr) {
				var re = [];
				muti.map(function (model) {
					arr.map(function (model1) {
						model.id() == model1.id() && re.push(model);
					});
				});
				return re;
			},
			position: function (t) {
				setTimeout(function () {
					t.listTarget.style.top = t.mainTarget.offsetHeight + "px";
				}, 50)
			}
		};
	fn.init = function () {
		var t = this,
			view = composition.view(t);
		return m("div", {
			class: "_select pr " + (t.opts.muti ? "_select_muti" : ""),
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
		}, [view, t.opts.muti ? "" : m("i", {
				class: "_icon r " + (t.listHide ? "_icon-down" : "_icon-up")
			}),
				m("div", {
				class: "_select_list_box pa " + (t.listHide ? "_none" : "_in"),
				style: {
					left: "-1px"
				},
				config: function (elem) {
					t.listTarget = elem;
				}
			}, m("ul", composition.listMaker(t)))
	    ]);
	};
	fn.changeValueByIndex = function (index) {
		this.muti && (this.muti = []);
		index && this.vm.setSelected(index, this, null, 1);
	};
	fn.changeValueByName = function (name) {
		this.changeValueByIndex(composition.getData(this, {
			name: name
		}));
	};
	fn.changeValueById = function (id) {
		this.changeValueByIndex(composition.getData(this, {
			id: id
		}));
	};
	fn.changeData = function (data) {
		data && (this.opts.data = data.data);
		this.opts.selectedId = data.selectedId || null;
		composition.objBuild(this);
		this.muti && this.init();
	};
	return Select;
});