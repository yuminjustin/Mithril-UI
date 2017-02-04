define(function (require, exports, module) {
	var m = require("mithril"),
		Page = require("coms/page"),
		Table = require("coms/table"),
		compent = {
			controller: function () {
				var page = new Page({
						pagesize: 5, //每页条数
						onPageChange: function (n) { //换页事件  返回所换页码
							page.redraw(n); //异步执行
							table.rebuild({
								data: data.data.list2
							})
						}
					}),
					table = new Table({
						title: [
							{
								text: "UID",
								sort: 1
							},
							{
								text: "IP",
								sort: 0
							},
							{
								text: "Mac",
								sort: 0
							},
							{
								text: "设备ID",
								sort: 0
							},
							{
								text: "创建时间",
								sort: 0
							},
							{
								text: "strId",
								sort: 0
							},
							{
								text: "认证方式",
								sort: 0
							},
							{
								text: "登陆模板",
								sort: 0
							},
							{
								text: "Portal模板",
								sort: 0
							},
							{
								text: "Code",
								sort: 0
							},
							{
								text: "设备名称",
								sort: 0
							},
							{
								text: "商家Id",
								sort: 0
							},
							{
								text: "商家名称",
								sort: 0
							},
							{
								text: "登录时间",
								sort: 0
							},
							{
								text: "持续时间",
								sort: 0
							},
							{
								text: "顾客名称",
								sort: 0
							}
						], //标题
						//width: 1200, //表格宽度，不填就100%
						onChoose: function (data) { //被选中
							console.log(data);
						}
					});
				return {
					page: page,
					table: table
				}
			},
			view: function (ctrl) {
				return m("div", [ctrl.table.init({
					data: data.data.list
				}), m("div", {
					class: "c"
				}), m("div", {
					class: "r"
				}, ctrl.page.init({
					total: data.data.total, //总的记录数
					page: 99 //当前页码
				}))]);
			}
		};


	/*模拟数据*/
	var data = {
		"status": "success",
		"info": "",
		"data": {
			"total": 10000,
			"page": 1,
			"list": [
				{
					"uid": "36",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:90",
					"routerid": "1398",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证",
					"logintype": "1",
					"auth_type": "3",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfang",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "37",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证5",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "38",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证4",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "39",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证3",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "40",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证2",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            }

        ],
			"list2": [
				{
					"uid": "41",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:90",
					"routerid": "1398",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证",
					"logintype": "1",
					"auth_type": "3",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfang",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "42",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证5",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "43",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证4",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "39",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证3",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            },
				{
					"uid": "40",
					"ip": "",
					"mac": "A0:88:B4:3F:EE:91",
					"routerid": "1390",
					"uptime": "1405923621",
					"strid": "361405923621",
					"method": "微信认证2",
					"logintype": "1",
					"auth_type": "7",
					"code": "123456",
					"routername": "零点免费WIFI2",
					"storeid": "21020",
					"storename": "chengfan",
					"logtime": "2014-07-21 14:20:21",
					"lasttime": "[14天20小时10分59秒]",
					"clientname": "顾客名称"
            }

        ]
		}
	}



	return compent;
});