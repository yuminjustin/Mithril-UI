define(function (require, exports, module) {
	var Tool = {
		ajax: function (opts) {/*独立ajax  m.request也能用*/
			/*
			   url: 地址 必填
			   success:成功回调 必填
			   method: get||post 选填
			   contentType:请求头  选填
			   data: 传值 选填 
			   error：失败回调  选填
			   dataType：jsonp 或不填
			   callback：jsonp 约定名称
			   timeout：超时时间
			*/
			opts = opts || {};
			if (!opts.url) return;
			if (opts.dataType == "jsonp") {
				var callbackName = ('jsonp_' + Math.random()).replace(".", "");
				var oHead = document.getElementsByTagName('head')[0];
				var params = "";
				if (opts.data) {
					opts.data[opts.callback] = callbackName;
					params += Tool.jsonpFormat(opts.data);
				} else params += opts.callback + "=" + callbackName;
				var oS = document.createElement('script');
				oHead.appendChild(oS);
				window[callbackName] = function (json) {
					oHead.removeChild(oS);
					clearTimeout(oS.timer);
					window[callbackName] = null;
					opts.success && opts.success(json);
				};
				oS.src = opts.url + '?' + params;
				if (opts.timeout) {
					oS.timer = setTimeout(function () {
						window[callbackName] = null;
						oHead.removeChild(oS);
						opts.error && opts.error({
							message: "timeout"
						});
					}, opts.timeout);
				}
			} else {
				var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
					data = this.O2S(opts.data),
					timer;
				xmlhttp.onreadystatechange = function () {
					if (xmlhttp.readyState == 4) {
						if (opts.timeout) clearTimeout(timer);
						var re = JSON.parse(xmlhttp.responseText);
						if (xmlhttp.status == 200) opts.success(re);
						else {
							if (opts.error) opts.error(re, xmlhttp.status);
							else console.log(re, xmlhttp.status);
						}
					}
				}
				if (opts.method == "post" || opts.method == "POST") {
					xmlhttp.open("POST", opts.url, true);
					xmlhttp.setRequestHeader("Content-type", opts.contentType || "application/x-www-form-urlencoded");
					xmlhttp.send(data);
				} else {
					xmlhttp.open("GET", opts.url + "?" + data, true);
					xmlhttp.send();
				}
				if (opts.timeout) {
					timer = setTimeout(function () {
						if (opts.error) opts.error("timeout");
						else console.log("timeout");
					}, opts.timeout);
				}
			}
		},
		jsonpFormat: function (data) {
			var arr = [];
			for (var name in data) {
				arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
			}
			return arr.join('&');
		},
		O2S: function (data, flag) {
			var str = "",
				err = false;
			flag = flag || "&";
			if (data) {
				if (typeof data == "string") str = data;
				else {
					for (var i in data) {
						if (!err) {
							if (typeof data[i] != "object") {
								str += i + "=" + data[i] + flag;
							} else err = true;
						} else {
							str = JSON.stringify(data);
							break;
						}
					}
					if (!err) str = str.replace(/&$/, "");
				}
			}
			return str;
		},
		randomN: function (n) {
			return Math.ceil(Math.random() * n);
		},
		addCSS: function (cssText) {
			var style = document.createElement('style'),
				head = document.head || document.getElementsByTagName('head')[0];
			style.type = 'text/css';
			var textNode = document.createTextNode(cssText);
			style.appendChild(textNode);
			head.appendChild(style);
		},
		trim: function (str) {
			return str.replace(/(^\s*)|(\s*$)/g, '');
		},
		clone: function (sObj) {
			//对象和数组的深拷贝 
			if (typeof sObj !== "object") return sObj;
			var s = {};
			if (sObj.constructor == Array) s = [];
			for (var i in sObj) {
				s[i] = Tool.clone(sObj[i]);
			}
			return s;
		},
		extend: function (tObj, sObj) {
			//对象扩展，tObj被扩展对象，sObj扩展对象  
			for (var i in sObj) {
				if (typeof sObj[i] !== "object") {
					tObj[i] = sObj[i];
				} else if (sObj[i].constructor == Array) {
					tObj[i] = Tool.clone(sObj[i]);
				} else {
					tObj[i] = tObj[i] || {};
					Tool.extend(tObj[i], sObj[i]);
				}

			}
		},
		objEqual: function (o1, o2) {
			if (typeof o1 != typeof o2) return false;
			if (typeof o1 == 'object') {
				for (var o in o1) {
					if (typeof o2[o] == 'undefined') return false;
					if (!Tool.objEqual(o1[o], o2[o])) return false;
				}
				return true;
			} else {
				return o1 === o2;
			}
		},
		arrOrObj: function (o) {
			if (typeof o == 'object') {
				if (typeof o.length == 'number') return 'Array';
				else return 'Object';
			} else return false;
		}
	}
	return Tool;
});