define(function (require, exports, module) {
    var m = require("mithril"),
        Tool = require("pub/tool"),
        Lang = require("pub/lang"),
        Table = function (opts) {
            this.opts = {
                title: null,
                data: null,
                width: 0,
                onChoose: null
            };
            Tool.extend(this.opts, opts);
            if (this.opts.title) {
                this.head_vm = vm_head(this.opts.title);
                this.choose = []; //选中
                this.mark = []; //标记
            } else return;
        },
        vm_head = function (arr) {
            var model = function (data) { /*单个对象*/
                    for (var i in data) {
                        this[i] = m.prop(data[i]);
                    }
                },
                collection = [];
            arr.map(function (v) {
                v.retract = v.retract || 0; //展开
                v.width = v.width || 48; //宽度
                var mm = new model(v);
                collection.push(mm);
            });
            return {
                collection: collection
            };
        },
        vm_data = function (arr) {
            var model = function (data) { /*单个对象*/
                    for (var i in data) {
                        this[i] = m.prop(data[i]);
                    }
                },
                collection = [];
            arr.map(function (v) {
                v.data = v.data.map(function (j) {
                    j.retract = j.retract || 0; //展开
                    return new model(j);
                });
                v.picked = v.picked || 0; //选中
                v.marked = v.marked || 0; //标记
                collection.push(new model(v));
            });
            return {
                collection: collection,
                retract: function (model, idx) {
                    this.collection.map(function (item) {
                        item.data()[idx].retract(model.retract());
                    });
                },
                asc: function (model, idx) {
                    this.collection = composition.asc(this.collection, idx)
                },
                desc: function (model, idx) {
                    this.collection = composition.desc(this.collection, idx)
                },
                chooseAll: function (t) {
                    t.choose.length = 0;
                    this.collection.map(function (item, k) {
                        item.picked(1);
                        composition.pickIt(t, k, 1);
                    });
                },
                chooseNone: function (t) {
                    t.choose.length = 0;
                    this.collection.map(function (item) {
                        item.picked(0);
                    });
                }
            };
        },
        composition = {
            asc: function (coll, idx) { //升序
                coll.sort(function (a, b) {
                    return Number(a.data()[idx].v()) - Number(b.data()[idx].v())
                })
                return coll;
            },
            desc: function (coll, idx) { //降序
                coll.sort(function (a, b) {
                    return Number(b.data()[idx].v()) - Number(a.data()[idx].v())
                })
                return coll;
            },
            sortBtns: function (t, model, k) {
                return m("div", {
                    class: "_smt_btn _smt_sort"
                }, [
				   m("i", {
                        class: "_icon _icon-caret-up",
                        title: Lang.tables[0],
                        onclick: function () {
                            t.data_vm.asc(model, k);
                        }
                    }),
				   m("i", {
                        class: "_icon _icon-caret-down",
                        title: Lang.tables[1],
                        onclick: function () {
                            t.data_vm.desc(model, k);
                        }
                    })
			   ])
            },
            retractBtns: function (t, model, k) {
                var btn = model.retract() ? m("i", {
                    class: "_icon _icon-arrow-salt",
                    title: Lang.tables[3],
                    onclick: function () {
                        model.retract(0);
                        t.data_vm.retract(model, k);
                    }
                }) : m("i", {
                    class: "_icon _icon-shrink",
                    title: Lang.tables[2],
                    onclick: function () {
                        model.retract(1);
                        t.data_vm.retract(model, k);
                    }
                })
                return m("div", {
                    class: "_smt_btn _smt_retract"
                }, btn)
            },
            headMaker: function (obj) {
                var t = this,
                    vm = obj.head_vm,
                    inner = vm.collection.map(function (model, k) {
                        var sort = model.sort() ? t.sortBtns(obj, model, k) : "",
                            width = model.width() + "px";
                        return m("th", {
                            class: model.retract() ? "_smt_retract_td" : "",
                            style: {
                                width: width
                            },
                            ondblclick: function () { //双击
                                model.retract(!model.retract());
                                obj.data_vm.retract(model, k);
                            }
                        }, [
						sort, t.retractBtns(obj, model, k), m("span", model.text())])
                    }),
                    pickAll = m("th", {
                        class: "_smt_check"
                    }, m("input", {
                        type: "checkbox",
                        config: function (elem) {
                            obj.pickAll = elem;
                        },
                        onclick: function (e) {
                            e.currentTarget.checked ? obj.data_vm.chooseAll(obj) : obj.data_vm.chooseNone(obj);
                            obj.opts.onChoose(obj.choose);
                        }
                    })),
                    trs = [];
                inner.unshift(pickAll);
                return m("tr", {
                    class: "_smt_t_title"
                }, inner);
            },
            dataRebuild: function (data, view) {
                var t = this,
                    re = [];
                data.forEach(function (v) {
                    var arr = [];
                    if (view) {
                        view.map(function (item) {
                            arr.push({
                                v: v[item],
                                n: item
                            });
                        });
                    } else {
                        for (var i in v) {
                            arr.push({
                                v: v[i],
                                n: i
                            });
                        }
                    }
                    re.push({
                        data: arr
                    });
                });

                return re;
            },
            isInclude: function (arr, name) {
                var re = false;
                arr.map(function (item) {
                    (!re) && (item == name) && (re = true);
                });
                return re;
            },
            analyze: function (arr) {
                var t = this,
                    re = [];
                arr.map(function (item, k) {
                    item.marked() && re.push(item);
                });
                arr.map(function (item, k) {
                    !item.marked() && re.push(item);
                });
                return re;
            },
            datasMaker: function (obj) {
                var t = this,
                    head = t.headMaker(obj),
                    trs = t.analyze(obj.data_vm.collection);
                trs = trs.map(function (model, k) {
                    return t.trMaker(model, k, obj);
                })
                return m("div", {
                    class: "_smt_t_inner"
                }, m("table", [head, trs]));
            },
            trMaker: function (model, k, t) {
                var _this = this,
                    pick = m("td", m("input", {
                        type: "checkbox",
                        checked: model.picked() ? "checked" : "",
                        onclick: function (e) {
                            model.picked(!model.picked());
                            (!model.picked()) && (t.pickAll.checked = false);
                            _this.pickIt(t, k, model.picked());
                            t.opts.onChoose(t.choose);
                        }
                    })),
                    tds = model.data().map(function (item, n) {
                        var mark = (n == model.data().length - 1) ? m("div", {
                                class: "_smt_compare pa",
                                title: model.marked() ? Lang.tables[5] : Lang.tables[4]
                            }, m("i", {
                                class: "_icon " + (model.marked() ? "_icon-pushpin" : "_icon-pushpin-o"),
                                onclick: function () {
                                    model.marked(!model.marked());
                                }
                            })) : "",
                            view = item.v();

                        t.translate && (function () {
                            for (var i in t.translate) {
                                (i == item.n()) && (view = t.translate[i](item.v()));
                            }
                        })();
                        return m("td", {
                            class: "pr" + (item.retract() ? " _smt_retract_td" : "")
                        }, [m("span", view), mark])
                    })
                tds.unshift(pick);
                return m("tr", {
                    class: model.marked() ? "_smt_picked" : ""
                }, tds);
            },
            pickIt: function (t, k, add) {
                var _this = this,
                    arr = t.choose,
                    re = t.data[k];
                add ? arr.push(re) : _this.del(arr, re);
            },
            del: function (arr, obj) {
                var n;
                arr.map(function (temp, k) {
                    Tool.objEqual(temp, obj) && (n = k);
                });
                arr.splice(n, 1)
            }
        },
        fn = Table.prototype;
    fn.init = function (data) {
        var t = this,
            head, datas, re;
        if (!data.data) return;
        t.data = t.data || data.data;
        t.data_vm = t.data_vm || vm_data(composition.dataRebuild(data.data, data.view));
        (data.translate) && (t.translate = data.translate);
        datas = composition.datasMaker(t, data.translate);

        return m("div", {
            class: "_smt_table",
            style: {
                width: (t.opts.width) ? t.opts.width + "px" : "100%",
                height: (t.opts.height) ? t.opts.height + "px" : "auto"
            },
            onscroll: function (e) {
                e.stopPropagation;
                t.head.style.top = e.srcElement.scrollTop + "px";
            }
        }, datas);
    }
    fn.rebuild = function (data) { /*重新渲染*/
        this.data = data.data;
        this.data_vm = vm_data(composition.dataRebuild(data.data, data.view));
    }
    return Table;
});