define(function (require, exports, module) {
	var m = require("mithril"),
		Table = require("coms/table"),
		//		title = [{
		//			text: "姓名",
		//			sort: 0, //是否支持排序
		//			width: 128
		//			}, {
		//			text: "性别",
		//			sort: 0, //是否支持排序
		//			width: 80
		//			}, {
		//			text: "年龄",
		//			sort: 1, //是否支持排序
		//			width: 80
		//			}, {
		//			text: "数学",
		//			sort: 1, //是否支持排序
		//			width: 80
		//			}, {
		//			text: "语文",
		//			sort: 1, //是否支持排序
		//			width: 80
		//			}],
		//		data = [{
		//			id: 101,
		//			sid: "002654",
		//			name: "张三",
		//			sex: "男",
		//			age: 15,
		//			math: 90,
		//			yuwen: 90
		//			}, {
		//			id: 102,
		//			sid: "002655",
		//			name: "李四",
		//			sex: "男",
		//			age: 15,
		//			math: 90,
		//			yuwen: 90
		//			}, {
		//			id: 103,
		//			sid: "002656",
		//			name: "王五",
		//			sex: "女",
		//			age: 15,
		//			math: 88,
		//			yuwen: 95
		//			}, {
		//			id: 104,
		//			sid: "002657",
		//			name: "赵六",
		//			sex: "男",
		//			age: 14,
		//			math: 70,
		//			yuwen: 68
		//			}, {
		//			id: 105,
		//			sid: "002658",
		//			name: "吴七",
		//			sex: "女",
		//			age: 16,
		//			math: 95,
		//			yuwen: 80
		//			}, {
		//			id: 106,
		//			sid: "002659",
		//			name: "钱八",
		//			age: 13,
		//			sex: "女",
		//			math: 85,
		//			yuwen: 72
		//			}],
		title = [{
			text: "工号",
			sort: 1 //是否支持排序
			}, {
			text: "姓名",
			sort: 0 //是否支持排序
			}, {
			text: "性别",
			sort: 0 //是否支持排序
			}, {
			text: "年龄",
			sort: 1 //是否支持排序
			}, {
			text: "婚姻状况",
			sort: 0 //是否支持排序
			}, {
			text: "学历",
			sort: 0 //是否支持排序
			}, {
			text: "手机",
			sort: 0 //是否支持排序
			}, {
			text: "民族",
			sort: 0 //是否支持排序
			}, {
			text: "政治面貌",
			sort: 0 //是否支持排序
			}],
		data = [{
			id: 101,
			name: "张三1",
			sex: 1,
			age: 30,
			marriage: 1,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "汉族",
			zhengzhi: "群众"
			}, {
			id: 102,
			name: "张三2",
			sex: 1,
			age: 28,
			marriage: 1,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "汉族",
			zhengzhi: "群众"
			}, {
			id: 103,
			name: "张三3",
			sex: 0,
			age: 25,
			marriage: 0,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "汉族",
			zhengzhi: "群众"
			}, {
			id: 104,
			name: "张三4",
			sex: 2,
			age: 33,
			marriage: 1,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "白族",
			zhengzhi: "群众"
			}, {
			id: 105,
			name: "张三5",
			sex: 0,
			age: 38,
			marriage: 1,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "汉族",
			zhengzhi: "群众"
			}, {
			id: 106,
			name: "张三6",
			sex: 1,
			age: 30,
			marriage: 0,
			xueli: "本科",
			mobile: "13312345678",
			minzu: "维吾尔族",
			zhengzhi: "群众"
			}],
		compent = {
			controller: function () {
				var table = new Table({
					title: title, //标题
					width: 850, //表格宽度，不填就100%
					onChoose: function (data) { //被选中
						console.log(data);
					}
				});
				return {
					table: table
				}
			},
			view: function (ctrl) {
				return m("div", ctrl.table.init({
					data: data,
					//view: ["id", "name", "sex", "age", "marriage", "xueli", "mobile", "minzu", "zhengzhi"] //设定显示字段 不设置 就都显示
					translate: { //给特殊的值做适配
						marriage: function (value) {
							return value ? "已婚" : "未婚"
						},
						age: function (value) {
							return value >= 30 ? "大于30" : "小于30";
						},
						sex: function (value) {
							return value ? (value == 1) ? "男" : "怪物" : "女";
						}
					}
				}));
			}
		};
	return compent;
});