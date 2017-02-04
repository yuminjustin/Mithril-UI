define(function (require, exports, module) {
	var m = require("mithril"),
        Popup = require("./popup"),
		Tool = require("pub/tool"),
		Lang = require("pub/lang"),
		Datepicker = function (opts) {
			var t = this;
			t.today = composition.today();
			t.years = composition.years(t.today);
			opts = opts || {};
			opts.style = opts.style || {};
			Tool.extend(opts, {
				className: "_datepicker_pop",
				style: {
					position: "absolute",
					width: 300,
					height: 300
				},
				animate: -1
			});
			opts.inner = null;
			t.opts = opts;
			this.pop = new Popup(opts);
		},
		composition = {
			years: function (today) { //年限限制上下100年
				return [today.y - 100, today.y + 100];
			},
			zeroPrefix: function (n) { //个位数补零
				return (n < 10) ? "0" + n : n;
			},
			leap: function (y) { //计算闰年
				return (y % 4) ? 0 : 1;
			},
			today: function () { //返回今天
				var date = new Date();
				return {
					y: date.getFullYear(),
					m: date.getMonth() + 1,
					d: date.getDate()
				};
			},
			weekHead: function () { //星期
				return Lang.weekText.map(function (v, k) {
					return (k == 0) ? m("span", {
						class: "_w"
					}, v) : m("span", v);
				});
			},
			weeks: function (pick) { //星期数据
				var first = new Date(pick.y + "-01-01"),
					num = 53,
					start = (first.getDay() == 0) ? first.getDate() : (31 - first.getDay()),
					weeks = [];
				start = (start != 1) ? {
					y: pick.y - 1,
					m: 12,
					d: start
				} : {
					y: pick.y - 1,
					m: 12,
					d: 31
				};
				for (var i = 0; i < num; i++) {
					var arr = this.weekList(start);
					weeks.push(arr);
				}
				return weeks;
			},
			weekList: function (s) { //星期数组
				var arr = [],
					o = s.m;
				for (var i = 0; i < 7; i++) {
					s = this.nextDate(s);
					arr.push({
						y: s.y,
						m: s.m,
						d: s.d
					});
				}
				return {
					m: (o != s.m) ? "[" + o + "],[" + s.m + "]" : "[" + o + "]",
					arr: arr
				};
			},
			nextDate: function (s) { //下一个日期
				var max = 31;
				if (s.m < 7) max = (s.m % 2 == 0) ? (s.m == 2) ? this.leap(s.y) ? 29 : 28 : 30 : max;
				else if (s.m > 8) max = (s.m % 2 != 0) ? 30 : max;
				s.d = (s.d + 1 <= max) ? s.d + 1 : 1;
				s.m = (s.d != 1) ? s.m : (s.m + 1 <= 12) ? s.m + 1 : 1;
				s.y = (s.m == 1 && s.d == 1) ? s.y + 1 : s.y;
				return s;
			},
			getWeekByIndex: function (w, i) { //通过角标查询星期
				return {
					start: this.datePrintObject(w[i - 1].arr[0]),
					stop: this.datePrintObject(w[i - 1].arr[6])
				};
			},
			datePrintModel: function (model, type) { //日期对象输出
				var re = model.y() + "";
				if (!type) re += "-" + this.zeroPrefix(model.m()) + "-" + this.zeroPrefix(model.d());
				else if (type == "month") re += "-" + this.zeroPrefix(model.m());
				return re;
			},
			datePrintObject: function (obj, type) { //日期对象输出
				var re = obj.y + "";
				if (!type) re += "-" + this.zeroPrefix(obj.m) + "-" + this.zeroPrefix(obj.d);
				else if (type == "month") re += "-" + this.zeroPrefix(obj.m);
				return re;
			},
			modelToObj: function (model) { //日期对象转换
				return {
					y: model.y(),
					m: model.m(),
					d: model.d()
				};
			},
			innerMaker: function (header, box) { //pop inner
				return function () {
					return m("div", {
						class: "_datepicker"
					}, [header, box]);
				};
			},
			dateSlider: function (p, t, fn, type) { //上下箭头
				if (type == "year") {
					t.picked.y = (p) ? ((t.picked.y + 12 <= t.years[1]) ? (t.picked.y + 12) : t.years[1]) : ((t.picked.y - 12 >= t.years[0]) ? (t.picked.y - 12) : t.years[0]);
				} else if (type == "month") {
					t.picked.y = (p) ? ((t.picked.y + 1 <= t.years[1]) ? (t.picked.y + 1) : t.years[1]) : ((t.picked.y - 1 >= t.years[0]) ? (t.picked.y - 1) : t.years[0]);
				} else {
					if (p) {
						if (t.picked.m < 12) {
							t.picked.m += 1;
						} else {
							t.picked.y += 1;
							t.picked.m = 1;
						}
					} else {
						if (t.picked.m > 1) {
							t.picked.m -= 1;
						} else {
							t.picked.y -= 1;
							t.picked.m = 12;
						}
					}
				}
				t.picked.d = 1;
				t.vm.setPicked(t);
				t.pop.close();
				t.open(fn);
			},
			strTodate: function (str) { //字符串转日期对象
				var arr = str.split("-");
				if (arr.length == 3)
					return {
						y: parseInt(arr[0]),
						m: parseInt(arr[1]),
						d: parseInt(arr[2])
					};
				else return false;
			},
			limit: function (opts, pd) { //设置限制解析
				var t = this,
					min = opts.min || 0,
					max = opts.max || 0;
				min = (min && typeof min == "string") ? t.strTodate(min) : null;
				max = (max && typeof max == "string") ? t.strTodate(max) : null;
				if (min && max && t.plusSum(min) < t.plusSum(max)) return [min, max];
				else if (min && !max) return [min, 0];
				else if (max && !min) return [0, max];
				else return false;
			},
			plusSum: function (obj) { //数字比较
				return (obj) ? parseInt(obj.y + "" + this.zeroPrefix(obj.m) + "" + this.zeroPrefix(obj.d)) : 0;
			},
			compare: function (arr, model, week, type) { //日期大小比较
				var t = this,
					min, max;
				if (type == "year") {
					arr[0].m = 1; //年头
					arr[0].d = 1;
				} else if (type == "month") {
					arr[0].d = 1; //月头
				}
				min = t.plusSum(arr[0]);
				max = t.plusSum(arr[1]);
				(max == 0) && (max = Infinity);
				if (model.type() == "week") {
					var start = t.strTodate(week.start),
						stop = t.strTodate(week.stop);
					start = t.plusSum(start);
					stop = t.plusSum(stop);
					return start >= min && start <= max && stop >= min && stop <= max;
				} else {
					var date = t.modelToObj(model);
					date = t.plusSum(date);
					return date >= min && date <= max;
				}
			},
			range: function (r, model, type) { //被选中范围
				var t = this,
					start = t.strTodate(r.start),
					stop = t.strTodate(r.stop);
				(type == "year") && (start.m = 1);
				(type == "month" || type == "year") && (start.d = 1);
				if (model.type() == "date") return t.compare([start, stop], model, type);
				else return false;
			},
			compareWeek: function (i, t) { //判断是这周是否选中
				var _this = this;
				if (t.range) {
					var week = t.weeks[i - 1].arr;
					week = {
						start: _this.datePrintObject(week[0]),
						stop: _this.datePrintObject(week[6])
					};
					if (week.start == t.range.start && week.stop == t.range.stop) return true;
					else return false;
				} else return false;
			},
			rebuildArr: function (arr) { //被选中范围 重构
				var t = this,
					n1 = t.plusSum(t.modelToObj(arr[0])),
					n2 = t.plusSum(t.modelToObj(arr[1]));
				return (n1 < n2) ? arr : [arr[1], arr[0]];
			},
			months: function (pick) {
				var t = this,
					num = 12,
					arr = [];
				for (var i = 0; i < num; i++) {
					arr.push({
						type: "date",
						y: pick.y,
						m: (i + 1),
						d: 1
					});
				}
				return arr;
			},
			yearArr: function (dp) {
				var t = dp,
					pick = t.picked,
					arr = [],
					start = (pick.y - 5 >= t.years[0]) ? pick.y - 5 : t.years[0],
					l = (pick.y + 6 <= t.years[1]) ? pick.y + 6 : t.years[1];
				for (var i = start; i <= l; i++) {
					arr.push({
						type: "date",
						y: i,
						m: pick.m,
						d: 1
					});
				}
				return arr;
			},
			cnMaker: function (c, model, t, limit, v, k, type) {
				var _this = this,
					arr = (type == "month") ? t.months[k] : (type == "year") ? t.yearArr[k] : _this.getWeekByIndex(t.weeks, v);
				c = (model.picked() && !t.range) ? "on " + c : c;
				c = (t.range && _this.range(t.range, model, type)) ? "on " + c : c;
				limit && (!_this.compare(limit, model, arr, type)) && (c = "_none");
				return c;
			},
			clickMaker: function (e, t, model, target, viewOpts, fn, v, type) {
				var _ran = viewOpts.range,
					_tar = e.currentTarget,
					_this = this;
				_tar.className = "_hover";
				if (_tar.className.indexOf("none") > -1) return false;
				if (type) {
					var initType = (type == "month") ? "date" : "month";
					t.picked = _this.modelToObj(model);
					t.vm.setPicked(t);
					fn && fn(_this.datePrintModel(model, type), target);
					if (!t.opts.lock) {
						t.opts.init = initType;
						t.pop.close();
						t.open(viewOpts);
					} else {
						t.pop.close();
					}

				} else {
					if (!_ran) {
						if (model.type() == "week") {
							t.range = _this.getWeekByIndex(t.weeks, v);
							t.picked = _this.strTodate(t.range.start);
							fn && fn(t.range, target, v);
						} else {
							t.picked = _this.modelToObj(model);
							t.range = null;
							t.vm.setPicked(t);
							fn && fn(_this.datePrintModel(model), target);
						}
					} else {
						(_ran.length < 2) && _ran.push(model);
						(_ran.length == 2) && (_ran = _this.rebuildArr(_ran));
						(_ran.length == 2) && (t.range = {
							start: _this.datePrintModel(_ran[0]),
							stop: _this.datePrintModel(_ran[1])
						});
						t.picked = (_ran.length == 2) ? _this.strTodate(t.range.start) : _this.modelToObj(model);
						fn && (_ran.length == 2) && fn(t.range, target);
					}
					if (_ran && _ran.length < 2) return;
					else t.pop.close();
				}
			}
		},
		Views = {
			head: function (t, viewOpts, cb) {
				var middle = m("a", {
						href: "javascript:;",
						class: "db",
						onclick: cb.click
					}, cb.view),
					left = m("i", {
						class: "_icon _icon-up pa",
						onclick: function () {
							composition.dateSlider(null, t, viewOpts, t.opts.init);
						}
					}),
					right = m("i", {
						class: "_icon _icon-down pa",
						onclick: function () {
							composition.dateSlider(1, t, viewOpts, t.opts.init);
						}
					});

				return m("div", {
					class: "c _dp_head pr"
				}, [middle, left, right]);
			},
			boxForMonth: function (t, viewOpts, limit, target, fn) {
				var head = m("div", {
						class: "c _week_text"
					}, composition.weekHead()),
					list = t.vm.collection.map(function (model) {
						var c, v;
						if (model.type() == "week") {
							v = model.num();
							c = (viewOpts.range) ? "_none" : "_w";
							c = composition.compareWeek(v, t) ? "on " + c : c;
						} else {
							v = model.d();
							c = (model.m() == t.picked.m) ? "" : "_n";
							Tool.objEqual(composition.modelToObj(model), t.today) && (c = "today");
						}
						c = composition.cnMaker(c, model, t, limit, v);
						model.hover() && (c = "_hover");
						return m("li", {
							class: model.hover() ? "_hover" : c,
							title: (c == "_none") ? Lang.overLimit : "",
							onclick: function (e) {
								composition.clickMaker(e, t, model, target, viewOpts, fn, v);
							}
						}, v);
					}),
					ul = m("ul", {
						class: "lil oh",
						config: function (elem) {
							t.list = elem;
						}
					}, list);

				return m("div", {
					class: "_month_box"
				}, [head, ul]);
			},
			boxForYear: function (t, viewOpts, limit, target, fn) {
				var list = t.vm.collection.map(function (model, k) {
						var c = composition.cnMaker("", model, t, limit, null, k, "month");
						return m("li", {
							class: c,
							title: (c == "_none") ? Lang.overLimit : "",
							onclick: function (e) {
								composition.clickMaker(e, t, model, target, viewOpts, fn, null, 'month');
							}
						}, model.m());
					}),
					ul = m("ul", {
						class: "lil oh"
					}, list);
				return m("div", {
					class: "_year_box"
				}, ul);
			},
			boxForCentury: function (t, viewOpts, limit, target, fn) {
				var list = t.vm.collection.map(function (model, k) {
						var c = composition.cnMaker("", model, t, limit, null, k, "year");
						return m("li", {
							class: c,
							title: (c == "_none") ? Lang.overLimit : "",
							onclick: function (e) {
								composition.clickMaker(e, t, model, target, viewOpts, fn, null, 'year');
							}
						}, model.y());
					}),
					ul = m("ul", {
						class: "lil oh"
					}, list);
				return m("div", {
					class: "_year_box"
				}, ul);
			}
		},
		fn = Datepicker.prototype,
		vm = function (data) { /*数据处理*/
			var model = function (data) { /*单个对象*/
					for (var i in data) {
						this[i] = m.prop(data[i]);
						this.picked = m.prop(false);
						this.hover = m.prop(false);
					}
				},
				collection = [];
			data.map(function (v) {
				collection.push(new model(v));
			});
			return {
				collection: collection,
				setPicked: function (dp) {
					var t = this,
						date = dp.picked;
					t.collection = t.collection.map(function (v) {
						v.picked() && v.picked(0);
						(v.type() == "date" && v.y() == date.y && v.m() == date.m && v.d() == date.d) && v.picked(1);
						return v;
					});
				}
			};
		};
	fn.monthViewer = function (viewOpts) { //月份视图
		var t = this,
			fn = viewOpts.picked || null,
			weeks = [],
			header, box,
			target = viewOpts.target,
			limit = composition.limit(viewOpts, t);
		t.weeks = composition.weeks(t.picked);
		for (var i = 0, l = t.weeks.length; i < l; i++) {
			var item = t.weeks[i];
			if (item.m.indexOf("[" + t.picked.m + "]") > -1) {
				if ((i == 0 && t.picked.m == 12) || (i == (l - 1) && t.picked.m == 1)) continue;
				var arr = [
					{
						type: "week",
						num: i + 1
					}
				];
				for (var j = 0, l2 = item.arr.length; j < l2; j++) {
					var temp = item.arr[j];
					Tool.extend(temp, {
						type: "date"
					});
					arr.push(temp);
				}
				weeks = weeks.concat(arr);
			}
		}
		t.vm = new vm(weeks);
		t.vm.setPicked(t);
		header = Views.head(t, viewOpts, {
			view: composition.datePrintObject(t.picked),
			click: function () {
				t.opts.init = "month";
				t.pop.close();
				t.open(viewOpts);
			}
		});
		box = Views.boxForMonth(t, viewOpts, limit, target, fn);
		t.pop.opts.inner = composition.innerMaker(header, box);
	};
	fn.yearViewer = function (viewOpts) { //年份视图
		var t = this,
			fn = viewOpts.picked || null,
			header, box,
			target = viewOpts.target,
			limit = composition.limit(viewOpts, t);
		t.months = composition.months(t.picked);
		t.vm = new vm(t.months);
		t.vm.setPicked(t);
		header = Views.head(t, viewOpts, {
			view: composition.datePrintObject(t.picked, "month"),
			click: function () {
				t.opts.init = "year";
				t.pop.close();
				t.open(viewOpts);
			}
		});
		box = Views.boxForYear(t, viewOpts, limit, target, fn);
		t.pop.opts.inner = composition.innerMaker(header, box);
	};
	fn.centuryViewer = function (viewOpts) { //年份视图
		var t = this,
			fn = viewOpts.picked || null,
			header, box,
			target = viewOpts.target,
			limit = composition.limit(viewOpts, t);
		t.yearArr = composition.yearArr(t);
		t.vm = new vm(t.yearArr);
		t.vm.setPicked(t);
		header = Views.head(t, viewOpts, {
			view: null,
			click: null
		});
		box = Views.boxForCentury(t, viewOpts, limit, target, fn);
		t.pop.opts.inner = composition.innerMaker(header, box);
	};
	fn.open = function (viewOpts) { //打开日期选择器
		var t = this;
		viewOpts = viewOpts || {};
		t.opts.init = t.opts.init || "date";
		(!t.picked) && (t.picked = Tool.clone(t.today));
		(viewOpts.range) && (Tool.arrOrObj(viewOpts.range) == "Object") && (!t.range) && (function () {
			t.range = {
				start: viewOpts.range.start,
				stop: viewOpts.range.stop,
			};
		})();
		(viewOpts.range) && ((viewOpts.range == 1) || viewOpts.range.start) && (viewOpts.range = []);
		switch (t.opts.init) {
			case "date":
				t.monthViewer(viewOpts);
				break;
			case "month":
				t.picked.d = 1;
				t.yearViewer(viewOpts);
				break;
			case "year":
				t.picked.d = 1;
				t.centuryViewer(viewOpts);
				break;
		}
		t.pop.open(function (elem) {
			var target = viewOpts.target;
			elem.style.cssText += "margin:" + (target.offsetTop + target.offsetHeight) + "px 0 0 " + target.offsetLeft + "px";
		});
	};
	return Datepicker;
});