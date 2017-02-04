define(function (require, exports, module) {
	var m = require("mithril"),
		Popup = function (opts) {
			opts = opts || {};
			opts.style = opts.style || {};
			this.opts = { /*默认配置*/
				style: { /*样式配置项*/
					width: opts.style.width || 100,
					/*宽度*/
					height: opts.style.height || 100,
					/*高度*/
					position: opts.style.position || "fixed",
					/*布局定位*/
					zIndex: opts.style.zIndex || 9 /*层级*/
				},
				/*内容 模板*/
				inner: opts.inner || null,
				/*是否显示 遮罩*/
				hasMask: opts.hasMask || 0,
				/*是否点击 遮罩关闭*/
				maskClose: opts.maskClose || 0,
				/*关闭方式 默认销毁 否则则隐藏*/
				closeType: opts.closeType || "distory",
				/*主体className 提供给子类*/
				className: opts.className || "_popup_main",
				/*动画*/
				animate: opts.animate || { in : "fadeIn", out: "fadeOut"
				}
			};
		},
		fn = Popup.prototype,
		close = function (t, cb) {
			if(!t.target) return;
			t.target.className = (t.opts.animate == -1) ? t.opts.className : (t.opts.className + " animated " + t.opts.animate.out);
			(t.opts.animate == -1) ? (cb && cb.bind(t)()) : (cb && setTimeout(cb.bind(t), 800));
		};
	fn.init = function (cb) {
			var t = this,
				popDom, popMain, mask, arr = []; /*基础dom*/
			t.opts.inner() && (function () {
				var s = t.opts.style;
				popDom = document.createElement("div");
				document.body.appendChild(popDom);
				cb && cb(popDom); //提供给子类的定位回调
				popDom.className = "_popup"
				t.popup = popDom;
				arr.push(m("div", {
					class: (t.opts.animate == -1) ? t.opts.className : (t.opts.className + " animated " + t.opts.animate.in),
					config: function (elem) {
						t.target = elem;
					},
					style: {
						position: s.position,
						width: s.width + "px",
						minHeight: s.height + "px",
						zIndex: s.zIndex
					}
				}, [t.opts.inner()]));
				mask = t.opts.hasMask ? m("div", {
					class: "_mask",
					onclick: function () {
						t.opts.maskClose && t.close();
					}
				}) : null;
				mask && arr.push(mask);
				m.render(popDom, arr);
			})()
		}
		/*销毁*/
	fn.distory = function () {
			close(this, function () {
				(this.popup) ? (function (t) {
					document.body.removeChild(t.popup);
					t.popup = null;
				})(this) : "";
			});
		}
		/*隐藏*/
	fn.hide = function () {
			close(this, function () {
				(this.popup) ? this.popup.style.display = "none": "";
			});
		}
		/*打开*/
	fn.open = function (cb) {
			var t = this;
			t.target && ((t.opts.animate == -1) ? t.opts.className : (t.target.className = t.opts.className + " animated " + t.opts.animate.in));
			(t.popup) ? t.popup.style.display = "block": (function () {
				t.init(cb);
				t.open(cb);
			})();
		}
		/*关闭 根据closeType*/
	fn.close = function () {
		(this.opts.closeType == "distory") ? this.distory(): this.hide();
	}
	return Popup;
});