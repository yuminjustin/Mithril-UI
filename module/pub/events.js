define(function (require, exports, module) {
    var Events = {
            /*注册表*/
            register: [],
            on: function (obj, e, fn, once) { /*监听*/
                var t = this,
                    target;
                once = once || 0;
                for (var i = 0, l = t.register.length; i < l; i++) {
                    (t.register[i].target == obj || t.register[i].evtRes_id == obj.evtRes_id) && t.register[i].target.events.push({
                        e: e,
                        fn: fn,
                        once: once
                    });
                    if (target) break;
                }
                (!target) && t.register.push({
                    evtRes_id: (function () {
                        obj.evtRes_id = evtId();
                        return obj.evtRes_id;
                    })(),
                    target: obj,
                    events: [{
                        e: e,
                        fn: fn,
                        once: once
				}]
                })
            },
            trigger: function (obj, e) { /*触发*/
                var t = this;
                getTarget(t, obj, e, function (target, e, idx) {
                    e.fn && e.fn(target);
                    e.once && t.register.splice(idx, 1);
                })
            },
            once: function (obj, e, fn) { /*仅一次*/
                this.on(obj, e, fn, 1)
            },
            off: function (obj, e) { /*移除*/
                var t = this;
                getTarget(t, obj, e, function (target, e, idx) {
                    t.register.splice(idx, 1);
                })
            }
        },
        getTarget = function (t, obj, e, fn) {
            var target;
            for (var i = 0, l = t.register.length; i < l; i++) {
                (t.register[i].target == obj || t.register[i].target.evtRes_id == obj.evtRes_id) && (target = t.register[i]);
                if (target) {
                    for (var j = 0, l2 = target.events.length; j < l2; j++) {
                        target.events[j].e == e && fn && fn(target, target.events[j], i);
                    }
                    break;
                }
            }
        },
        evtId = function () {
            return "evt_" + Events.register.length;
        }
    window.Events = Events;
    return window.Events;
});