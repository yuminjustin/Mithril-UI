define(function (require, exports, module) { /*下拉框联动*/
	var m = require("mithril"),
		Select = require("./select"),
		Linkage = function (opts) {
			var t = this;
			this.opts = opts || {};
			t.selects = [];
			var select = composition.selecter(t, t.opts.data);
			select && t.selects.push(select);
			composition.progress(t, 0);
		},
		composition = {
			progress: function (t, s) {
				for (var i = s; i < t.opts.relate.length; i++) {
					composition.cb(t.selects[i].selected, t, i)
				}
			},
			cb: function (model, t, n) {
				var _this = this,
					deferred = m.deferred();
				if (n != t.opts.relate.length) {
					t.opts.relate[n](model, function (data) {
						if ((n + 1) == t.selects.length) {
							(!data[0])&&(data = data[model.id()]);
							var select = _this.selecter(t, data);
							select && t.selects.push(select);
						} else {
							(!data[0])&&(data = data[model.id()]);
							if (data) {
								var target = t.selects[(n + 1)];
								target.changeData({
									data: data
								});
								_this.progress(t, (n + 1));
							} else t.selects.length = (!n) ? 1 : (t.selects.length - 1);
						}
						deferred.resolve(model);
					});
				} else deferred.resolve(model);
				return deferred.promise;
			},
			selecter: function (t, data) {
				var _this = this;
				if (data) {
					var n = t.selects.length;
					return new Select({
						data: data,
						onselected: function (model) {
							_this.cb(model, t, n).then(function () {
								_this.output(model, t, n);
							});
						}
					});
				}
				return false;
			},
			output: function (model, t, n) {
				t.selects[n].selected = model;
				var arr = t.selects.map(function (v) {
					return {
						id: v.selected.id(),
						name: v.selected.name()
					}
				});
				arr && t.opts.onselected && t.opts.onselected(arr);
			}
		},
		fn = Linkage.prototype;
	fn.init = function () {
		return this.selects.map(function (v) {
			return v.init();
		});
	}
	return Linkage;
});