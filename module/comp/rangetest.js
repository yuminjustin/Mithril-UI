define(function (require, exports, module) {
	var m = require("mithril"),
		Range = require("coms/range"),
		compent = {
			controller: function () {
				var range = new Range({
					min: -50,
					max: 50,
					mark: [-5, 5], //标记可点击
					dot: [-20,30], //预制范围
					onselected: function (arr) {
                        console.log(arr);
					}
				});
				return {
					range: range
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.range.init());
			}
		};
	return compent;
});