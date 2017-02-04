define(function (require, exports, module) {
	var bool = (APP.language || "zh") == "zh" ? 1 : 0,
		Lang = (bool) ? {
			notice: "提示",
			sure: "确认",
			submit: "提交",
			cancel: "取消",
			close: "关闭",
			normalTip: "这是一个默认提示",
			weekText: ["星期", "日", "一", "二", "三", "四", "五", "六"],
			overLimit: "超过限制",
			tables: ["升序", "降序", "收起", "展开", "固定", "取消固定"],
			pages: ["上一页", "下一页", function (t) {
				return "共" + t + "条记录"
			}, function (t) {
				return "第" + t + "页"
			}],
            unit:"加载中..."
		} : {
			notice: "Notice",
			sure: "Sure",
			submit: "Submit",
			cancel: "Cancel",
			close: "Close",
			normalTip: "This is a normal notice",
			weekText: ["Week", "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
			overLimit: "over limit",
			tables: ["ASC", "DESC", "Hide", "Show", "Marked", "Unmark"],
			pages: ["Previous", "Next", function (t) {
				return "Total " + t + " Records"
			}, function (t) {
				return "Page " + t
			}],
            unit:"loading..."
		}
	return Lang;
});