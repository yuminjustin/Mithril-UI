define(function (require, exports, module) {
	var m = require("mithril"),
		pop = require("comp/poptest"),
		routeAsync = require("pub/routeAsync"),
		//   /comp/dialogtest
		//   /comp/noticetest
		//   /comp/selecttest
		//   /comp/datetest
		//   /comp/test
		//   /comp/linkselecttest
		//   /comp/shiftertest
		//   /comp/linkagetest
		//   /comp/rangetest
		//   /comp/tabletest
		error = {
			controller: function () {

			},
			view: function () {
				return m("div", "您访问的页面不存在！\n", m("a", {
					href: "javascript:;",
					onclick: function () {
						m.route("/");
					}
				}, "<主页"))
			}
		},
		Route = {
            "": pop, //主页
			"/": pop, //主页
			"/error": error, //异常页面
			intermediary: routeAsync()
		};

	m.route.mode = "hash";
	m.route(document.getElementById("body"), "/", Route);

});