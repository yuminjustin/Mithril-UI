define(function (require, exports, module) {
	var m = require("mithril"),
		Linkage = require("coms/linkage"),
		data = require("./citydata"),
		compent = {
			controller: function () {
				var l = new Linkage({
					data: data.data.plist, // 初始数据
					relate: [ //关联项 可以用于异步取值
						function (model, cb) { //返回的model对象和回调
							cb && cb(data.data.clist);
						},
						function (model, cb) {
							cb && cb(data.data.xlist);
						}
					],
					onselected: function (arr) { //选中
						var str = "";
						arr.map(function (v) {
							str += v.name();
						});
						console.log(str);
					}
				});
				return {
					l: l
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.l.init());
			}
		};
	return compent;
});