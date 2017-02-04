define(function (require, exports, module) {
	var m = require("mithril"),
		Linkage = require("coms/linkselect"),
		data = require("./citydata"),
		compent = {
			controller: function () {
				var l = new Linkage({
					data: data.data.plist,
					relate: [ /*异步取值*/
						function (model, cb) {
							cb && cb(data.data.clist);
						},
						function (model, cb) {
							cb && cb(data.data.xlist);
						}
					],
					onselected: function (arr) {
						var str = "";
						arr.map(function(v){
							str += v.name;
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