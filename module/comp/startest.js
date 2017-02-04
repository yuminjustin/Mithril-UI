define(function (require, exports, module) {
	require("pub/events")
	var m = require("mithril"),
		Star = require("coms/star"),
		compent = {
			controller: function () {
				var n = 0,
					star = new Star({
						score:1,
						tpl: function (n) {
							var str;
							if (n < 3) str = "不满意";
							else if (n < 5) str = "一般";
							else if (n < 8) str = "满意";
							else str = "非常满意";
							return str;
						},
						type: "half",
						onselected: function (n) {
							console.log(n);
							Events.trigger(document, "star:check");
						}
					});
				return {
					star: star
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.star.init());
			}
		};

	Events.on(document, "star:check", function (obj) {
		console.log(obj, 1);
	})

	return compent;
});