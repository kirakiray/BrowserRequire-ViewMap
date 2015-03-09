/**
    @fileoverview br.js的模块依赖视图化数据生成插件
*/
require.extend(function (baseResource, F, C, R, Global) {
    //展开C
    var Require = C.Require,
        BindEvent = C.BindEvent,
        GatherFunction = C.GatherFunction,
        CombRequire = C.CombRequire;

    //扩展主体数据
    var viewMapData = [];
    var outData = {
        v: '1',
        data: viewMapData
    };
    baseResource.br.viewMap = {
        expore: function () {
            console.log(JSON.stringify(outData));
        },
        outData: outData
    };

    //获取不重复的GroupId
    var getGroupId = function () {
        getGroupId.id++;
        return "G_" + getGroupId.id;
    };
    getGroupId.id = 0;

    //获取不重复的LoadId
    var getLoadId = function () {
        getLoadId.id++;
        return "L_" + getLoadId.id;
    };
    getLoadId.id = 0;

    //setModuleAgent替换
    //扩展tempM数据
    /**
        挂载tempM数据到setModuleAgent上，方便后面获取子groupId(childG)
    */
    var beforeSetModuleAgent = R.setModuleAgent;
    R.setModuleAgent = function (fileMapObj, loadModuleEvent, uri) {
        if (baseResource.tempM) {
            loadModuleEvent.tempM = baseResource.tempM;
        }
        beforeSetModuleAgent.apply(R, arguments);
    };

    //baseurl后的正则
    var baseurlReg = new RegExp('^' + baseResource.baseUrl);

    //loadAgent替换
    var beforeLoadAgent = R.loadAgent;
    R.loadAgent = function (moduleUri) {
        //继承旧的loadAgent方法
        var loadEvent = beforeLoadAgent.apply(R, arguments);
        var mapObj = F.create(loadEvent);
        //var mapObj = {};
        mapObj.start = new Date().getTime();
        mapObj.loadType = loadEvent.eventType;
        mapObj.loadId = getLoadId();

        //完成后运行的函数
        var readyFun = function (status) {
            //完成后添加加载完成时间
            mapObj.end = new Date().getTime();

            //去掉baseurl
            mapObj.uri = moduleUri.replace(baseurlReg, '');

            //载入时的资源引用
            mapObj.orginUri = loadEvent.uri;
            mapObj.groupId = loadEvent.groupEvent.groupId;

            //获取依赖子模块
            mapObj.childG = [];
            if (loadEvent.tempM && loadEvent.tempM.rel_arr) {
                for (var i = 0, len = loadEvent.tempM.rel_arr.length; i < len; i++) {
                    mapObj.childG.push(loadEvent.tempM.rel_arr[i]._argEvent.groupId);
                }
            }
            if (!mapObj.childG.length) {
                delete mapObj.childG;
            }
            if (loadEvent.groupEvent._combRequire.previousRequire) {
                var prevCombRequire = loadEvent.groupEvent._combRequire.previousRequire;
                if (prevCombRequire._argEvent.groupId) {
                    mapObj.prevGroupId = prevCombRequire._argEvent.groupId;
                }
            }

            //修正加载状态
            if (status == 'error') {
                mapObj.loadType = 3;
            }

            //console.log(mapObj);
            viewMapData.push(mapObj);
        }
        loadEvent.bind('ready', readyFun);
        loadEvent.bind('error', function () {
            readyFun('error');
        });
        return loadEvent;
    };

    //argRequire替换
    var beforeArgRequire = R.argRequire;
    R.argRequire = function (args) {
        var argEvent = beforeArgRequire.apply(R, arguments);
        argEvent.groupId = getGroupId();
        return argEvent;
    };

    //defindedRequire替换
    var beforeDefindedRequire = R.defindedRequire;
    R.defindedRequire = function () {
        //继承旧方法
        var requireObj = beforeDefindedRequire.apply(R, arguments);
        //判断是否有tempM，将队列1的require加入rel_arr数组
        if (baseResource.tempM) {
            if (!baseResource.tempM.rel_arr) {
                //第一级关系的对象
                baseResource.tempM.rel_arr = [];
            }
            baseResource.tempM.rel_arr.push(requireObj);
        }
        return requireObj;
    };
    //继承类方法
    F.extend(R.defindedRequire, beforeDefindedRequire);

}, 'viewMap');