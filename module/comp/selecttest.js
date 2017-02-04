define(function (require, exports, module) {
	var m = require("mithril"),
		Tool = require("pub/tool"),
		Select = require("coms/select"),
		compent = {
			controller: function () {
				var select = new Select({
						data: province,
						onselected: function (model) {
							alert("id:" + model.id() + "\nname:" + model.name());
						}
					}),
					select2 = new Select({
						data: province,
						selectedId: [15, 16],
						onselected: function (model) {
							alert("id:" + model.id() + "\nname:" + model.name());
						}
					}),
					select3 = new Select({
						muti: 1,
						data: province,
						selectedId: [15, 16],
						onselected: function (arr) {
							console.log(arr);
						}
					})
				return {
					select: select,
					select2: select2,
					select3: select3
				};
			},
			view: function (ctrl) {
				var button1 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select.changeValueByName("上海市");
						}
					}, "name: 上海市"),
					button2 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select.changeValueById(14);
						}
					}, "Id:14"),
					button3 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select2.changeData({
								data: datas
							});
						}
					}, "数据全换"),
					button4 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select2.changeValueByIndex(2);
						}
					}, "index:2"),
					button12 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select3.changeValueByName(["上海市", "河北省"]);
						}
					}, "上海市,河北省"),
					button22 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select3.changeValueById([14, 15]);
						}
					}, "14,15"),
					button32 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select3.changeData({
								data: datas,
								selectedId: ["01", "02"]
							});
						}
					}, "数据全换"),
					button42 = m("button", {
						class: "_btn _mr10 white",
						onclick: function () {
							ctrl.select3.changeValueByIndex([2, 3]);
						}
					}, "index:2,3")
				return m("div", [ctrl.select.init(), button1, button2,m("div", {
					style: {
						height: "300px"
					}
				}),ctrl.select2.init(), button3, button4, m("div", {
					style: {
						height: "300px"
					}
				}), ctrl.select3.init(), m("div", {
					style: {
						height: "200px"
					}
				}), button12, button22, button32, button42]);
			}
		},
		province = [{
			id: "10",
			name: "北京市"
		}, {
			id: "11",
			name: "上海市"
		}, {
			id: "12",
			name: "天津市"
		}, {
			id: "13",
			name: "重庆市"
		}, {
			id: "14",
			name: "河北省"
		}, {
			id: "15",
			name: "山西省"
		}, {
			id: "16",
			name: "内蒙古自治区"
		}, {
			id: "17",
			name: "辽宁省"
		}, {
			id: "18",
			name: "吉林省"
		}, {
			id: "19",
			name: "黑龙江省"
		}, {
			id: "20",
			name: "江苏省"
		}, {
			id: "21",
			name: "浙江省"
		}, {
			id: "22",
			name: "安徽省"
		}, {
			id: "23",
			name: "福建省"
		}, {
			id: "24",
			name: "江西省"
		}, {
			id: "25",
			name: "山东省"
		}, {
			id: "26",
			name: "河南省"
		}, {
			id: "27",
			name: "湖北省"
		}, {
			id: "28",
			name: "湖南省"
		}, {
			id: "29",
			name: "广东省"
		}, {
			id: "30",
			name: "广西自治区"
		}, {
			id: "31",
			name: "海南省"
		}, {
			id: "32",
			name: "四川省"
		}, {
			id: "33",
			name: "贵州省"
		}, {
			id: "34",
			name: "云南省"
		}, {
			id: "35",
			name: "西藏自治区"
		}, {
			id: "36",
			name: "陕西省"
		}, {
			id: "37",
			name: "甘肃省"
		}, {
			id: "38",
			name: "青海省"
		}, {
			id: "39",
			name: "宁夏自治区"
		}, {
			id: "40",
			name: "新疆自治区"
		}, {
			id: "41",
			name: "台湾省"
		}, {
			id: "42",
			name: "香港特别行政区"
		}, {
			id: "43",
			name: "澳门特别行政区"
		}, {
			id: "44",
			name: "海外"
		}],
		datas = [
			{
				id: "01",
				name: "选项一"
			},
			{
				id: "02",
				name: "选项二"
			},
			{
				id: "03",
				name: "选项三"
			}, {
				id: "04",
				name: "选项四"
			}
			, {
				id: "05",
				name: "选项五"
			}
		];


	return compent;
});