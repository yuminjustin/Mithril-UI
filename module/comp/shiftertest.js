define(function (require, exports, module) {
	var m = require("mithril"),
		Shifter = require("coms/shifter"),
		compent = {
			controller: function () {
				var shifter = new Shifter({
					init: 1,
					onclick: function (status) {
						console.log(status);
					}
				});
				return {
					shifter: shifter
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.shifter.init());
			}
		};
	return compent;
});