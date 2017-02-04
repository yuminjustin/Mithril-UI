define(function (require, exports, module) {
	var m = require("mithril"),
		Datepicker = require("coms/datepicker"),
		compent = {
			controller: function () {
				var date = new Datepicker(),
					date2 = new Datepicker(),
					date3 = new Datepicker(),
					date4 = new Datepicker(),
					date5 = new Datepicker({
						init: "month"
					}),
					date6 = new Datepicker({
						init: "year",
						lock:1//是否锁定当前视图
					});
				return {
					date: date,
					date2: date2,
					date3: date3,
					date4: date4,
					date5: date5,
					date6: date6
				}
			},
			view: function (ctrl) {
				var input = m("input", {
						class: "_mr10",
						placeholder: "无限制",
						onclick: function (e) {
							ctrl.date.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								}
							})
						}
					}),
					input2 = m("input", {
						class: "_mr10",
						placeholder: "区域限制",
						onclick: function (e) {
							ctrl.date2.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								},
								max: "2016-07-25",
								min: "2016-07-05"
							})
						}
					}),
					input3 = m("input", {
						class: "_mr10",
						placeholder: "范围选择",
						onclick: function (e) {
							ctrl.date3.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								},
								range: 1
							})
						}
					}),
					input4 = m("input", {
						class: "_mr10",
						placeholder: "预设范围",
						onclick: function (e) {
							ctrl.date4.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								},
								max: "2016-07-25",
								min: "2016-07-05",
								range: { //预设已选范围
									stop: "2016-07-20",
									start: "2016-07-06"
								}
							})
						}
					}),
					input5 = m("input", {
						class: "_mr10",
						placeholder: "初始显示月份",
						onclick: function (e) {
							ctrl.date5.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								},
								max: "2016-07-25",
								min: "2015-01-05",
								range: { //预设已选范围
									stop: "2016-07-20",
									start: "2015-07-06"
								}
							})
						}
					}),
					input6 = m("input", {
						class: "_mr10",
						placeholder: "初始显示年并锁定",
						onclick: function (e) {
							ctrl.date6.open({
								target: e.currentTarget, //指定目标
								picked: function (data, elem, k) {
									if (typeof data == "string") elem.value = data;
									else {
										elem.value = data.start + "~" + data.stop;
										(k) && (elem.value += " 第" + k + "周")
									}
								},
								min: "2015-01-05"
							})
						}
					});
				return m("div", [
					input, input2, input3, input4, m("div", {
						style: {
							height: "300px",
							width: "100%"
						}
					}), input5, input6
				]);
			}
		};
	return compent;
});