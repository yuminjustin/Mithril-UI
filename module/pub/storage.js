define(function (require, exports, module) {
	/*本地存储 临时存储 session cookie*/
	var l = localStorage || null,
		s = sessionStorage || null,
		c = document.cookie || null,
		commons = function (o) {
			return {
				set: function (n, v) {
					if (o) {
						o[n] = v;
						return true;
					} else Storage.cookie.set(n, v);
				},
				get: function (n) {
					if (o) return o[n];
					else Storage.cookie.set(n);
				},
				remove: function (n) {
					if (o) o.removeItem(n);
					else Storage.cookie.del(n);
				},
				distory: function () {
					if (o) o.clear();
					else c = "";
				}
			}
		},
		Storage = {
			session: commons(s),
			local: commons(l),
			cookie: {
				set: function (n, v, d) {
					var date = new Date();
					d = d || 7;
					date.setDate(date.getDate() + d);
					c = n + "=" + encodeURIComponent(v) + ((d == null) ? "" : ";expires=" + date.toGMTString());
					return true;
				},
				get: function (n) {
					if (c.length > 0) {
						var c1 = c.indexOf(n + "=");
						if (c1 > -1) {
							c1 += (n.length + 1);
							var c2 = c.indexOf(";", c1);
							if (c2 == -1) c2 = c.length;
							return decodeURIComponent(c.substring(c1, c2));
						} else return false;
					}
				},
				del: function (n) {
					var date = new Date();
					date.setTime(date.getTime() - 10000);
					c = n + "=;expires=" + date.toGMTString();
				}
			}
		}
	return Storage;
});