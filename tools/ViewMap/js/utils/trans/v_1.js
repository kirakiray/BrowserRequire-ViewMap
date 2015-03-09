define(function () {
    /**
       需要使用的方法 
    */
    //获取loadId函数
    var getLoadId = function (str) {
        return parseInt(str.replace(/[GL]_/, ''));
    };

    //获取相应的load的颜色
    var getClor = function (type) {
        var color;
        type = parseInt(type);
        switch (type) {
        case 0:
            color = 'blue';
            break;
        case 1:
            color = 'yellow';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'red';
            break;
        }
        return color;
    };

    //获取标尺的方法
    var getScales = function (startTime, endTime) {
        //要返回的标尺数组对象，平均间隔时间
        var reObj = {
                scale: [],
                start: ""
            },
            useTime = endTime - startTime;

        //获取总长度
        var initLen = 10,
            blockCount = 5;
        while (useTime > initLen) {
            initLen = initLen * 10;
        }
        if (useTime <= (initLen / 2)) {
            initLen = initLen / 2;
            if (useTime <= (initLen / 2) && useTime > 5) {
                initLen = initLen / 2;
            }
        }

        //获取间距时间
        var spaceTime = initLen / blockCount;

        //获取头时间
        var start = startTime / spaceTime;
        start = Math.floor(start) * spaceTime;

        //修正刚好多一个spaceTime且超过总长度的bug
        if (start + initLen < endTime) {
            initLen = initLen + spaceTime;
            blockCount = 6;
        }


        //生成时间组
        //单位转换（根据总长度确定单位）
        //确定title信息
        var scale = reObj.scale;
        if (initLen < 5000) {
            //毫秒级
            for (var i = 0, len = blockCount + 1; i < len; i++) {
                var thisDate = new Date(start + (spaceTime * i)),
                    pushStr = "";
                pushStr = thisDate.getMilliseconds() + 'ms';
                scale.push(pushStr);
            }
        } else {
            //秒数级
            for (var i = 0, len = blockCount + 1; i < len; i++) {
                var thisDate = new Date(start + (spaceTime * i)),
                    pushStr = "";
                pushStr = thisDate.toTimeString().slice(0, 8);
                scale.push(pushStr);
            }
        }
        //标题
        reObj.title = new Date(start).toTimeString().slice(0, 8);
        //开始时间
        reObj.start = start;
        //花费时间
        reObj.total = initLen;
        return reObj;
    };


    //主体方法
    return function (viewMapData) {
        //视图化的数据数组、按组分的数据对象、排序loadId的数据数组
        var processData = [],
            groupDatas = {},
            sortDatas = [];

        //排序
        sortDatas = viewMapData.sort(function (a, b) {
            return getLoadId(a.loadId) - getLoadId(b.loadId);
        });

        /**
            首次遍历
            转换时间；
            分组groupId；
            为group添加前一个Require的Id(prev)
        */
        $(sortDatas).each(function (i, e) {
            //使用的时间
            e.useTime = e.end - e.start;

            //分组（按groupId），有prevGoupId的添加
            var groupElement = {
                arr: [],
                loads: []
                //next: "",
                //prev: "",
                //parent : ""
            };
            if (!groupDatas[e.groupId]) {
                groupDatas[e.groupId] = groupElement;
            } else {
                groupElement = groupDatas[e.groupId];
            }

            //添加group属性
            e.Group = groupElement;

            //添加前一个require的groupdId
            if (e.prevGroupId) {
                groupElement.prev = groupDatas[e.prevGroupId];
            }
            groupElement.arr.push(e);
            groupElement.loads.push(e.loadId);
        });

        /**
            二次遍历
            添加父模块id；
            添加子加载模块id；
            为group添加下一个Require的ID(next)
        */
        $(sortDatas).each(function (i, e) {
            //添加父loadId
            if (e.childG) {
                $(e.childG).each(function (index, element) {
                    groupDatas[element].parent = e;
                    groupDatas[element].parentGroupId = e.groupId;
                    if (!groupDatas[e.groupId].childGroup) {
                        groupDatas[e.groupId].childGroup = {};
                    }
                    groupDatas[e.groupId].childGroup[element] = groupDatas[element];
                });
            }

            //添加next
            if (e.prevGroupId) {
                if (!groupDatas[e.prevGroupId].next) {
                    groupDatas[e.prevGroupId].next = {};
                }
                groupDatas[e.prevGroupId].next[e.groupId] = groupDatas[e.groupId];
            }
        });

        /**
        三次遍历
            确定视图模块分组数据；
            确定最长时间和最短时间；
        */
        var viewgroupDatas = [],
            repeatArr = {},
            pushFun = function (groupId, groupObj, viewData) {
                $(groupObj.arr).each(function (i, e) {
                    //时间确认
                    if (!viewData.start) {
                        viewData.start = e.start;
                    } else if (viewData.start > e.start) {
                        viewData.start = e.start;
                    }
                    if (!viewData.end) {
                        viewData.end = e.end;
                    } else if (viewData.end < e.end) {
                        viewData.end = e.end;
                    }
                });

                //放入viewData
                viewData.loadGroup = viewData.loadGroup.concat(groupObj.arr);

                //记录遍历
                repeatArr[groupId] = true;

                //迭代childGroup
                if (groupObj.childGroup) {
                    $.each(groupObj.childGroup, function (i, e) {
                        pushFun(i, e, viewData);
                    });
                }

                //迭代next
                if (groupObj.next) {
                    $.each(groupObj.next, function (i, e) {
                        pushFun(i, e, viewData);
                    });
                }
            };
        $.each(groupDatas, function (i, e) {
            //已经查询过的group不参与遍历（优化）
            if (repeatArr[i]) {
                return;
            }
            //一个视图组
            var viewData = {
                //最小时间
                start: "",
                //最大时间
                end: "",
                //视图数据组
                loadGroup: []
            };
            //var viewGroups = [];

            //内部关系构造 
            pushFun(i, e, viewData);

            //添加入组数据
            viewgroupDatas.push(viewData);
        });

        /**
            确认并组装成视图数据
        */
        $(viewgroupDatas).each(function (i, e) {
            //获取标尺对象，标尺初始时间，标尺总时间
            var scaleObj = getScales(e.start, e.end),
                scaleStart = scaleObj.start,
                scaleTotal = scaleObj.total;
            //console.log(e);
            //console.log(scaleObj);
            //添加返回的对象
            var viewObj = {
                //标题
                title: scaleObj.title,
                //刻度数组
                scale: scaleObj.scale,
                //视图块数组
                data: []
            };
            processData.push(viewObj);
            $(e.loadGroup).each(function (index, element) {
                //添加图形数据
                viewObj.data.push({
                    len: element.useTime / scaleTotal * 100,
                    left: (element.start - scaleStart) / scaleTotal * 100,
                    text: element.useTime + 'ms',
                    name: element.orginUri,
                    nameTitle: element.orginUri + " &#10;" + element.uri,
                    color: getClor(element.loadType),
                    orginData: element
                });
            });
        });

        //返回视图数据
        return {
            processData: processData,
            groupDatas: groupDatas,
            sortDatas: sortDatas
        };
    };
});