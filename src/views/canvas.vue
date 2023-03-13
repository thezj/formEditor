<script setup>
import useUserInfo from "../store/modules/userInfo";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, toRaw, watch, getCurrentInstance, computed } from "vue";
import less from "less";

// 是否启用smartRem
import setSmartRem from "@/utils/smartRem.js";

// 布局插件
import { GridStack } from "gridstack";
import utils from "../utils/cUtile";

// 序列化的组件库
import componentLibrary from "../utils/componentLibrary";

/**
 * 定义ref
 */
//组件库
let icomponentLibrary = ref(componentLibrary);
// 当前页面中的组件
let icomponentList = ref([]);
// 页面的dataList
let ipageDataList = ref([]);
// 当前页面的setting
let pageSettingRaw = {
    pageStyle: "",
    onload: "()=>{}",
    pageWitdh: window.innerWidth - 500,
    pageDescribe: "这里是页面描述",
    pageId: "pageid",
    applicationId: "applicationId",
    // 是否是表单页
    isFormPage: false,
    formType: "ant",
    formPageOnSubmit: "",
    formPageOnFinish: "",
    // 是否使用rem
    setSmartRem: false,
};
let ipageSetting = ref(pageSettingRaw);
//设置page的样式
if ($("style#pageStyle").length == 0) {
    $('<style id="pageStyle"><style>').text("").appendTo(document.head);
}
watch(
    () => ipageSetting.value.pageStyle,
    (newValue, oldValue) => {
        less.render(newValue, (err, cssData) => {
            if (err) {
                err;
            } else {
                $("style#pageStyle").text(cssData.css);
            }
        });
    }
);
// 计算rem的根fontSize
watch(
    () => {
        if (ipageSetting.value.setSmartRem) return ipageSetting.value.pageWitdh;
    },
    (newVal, oldVal) => {
        // newVal当前设置的页面宽度
        setSmartRem(newVal);
    }
);

// 页面使用的function
let ipageFunctionList = ref([]);
// 页面使用的Data
let iData = ref({});
// 右侧的编辑模式
let settingMode = ref("pageConfig");
// 当前编辑组件
let currentSettingComponent = ref(null);
// monaco的显示
let codeEditorContainer = ref(false);
// 当前编辑的function
let currentSettingFunction = ref(null);
// 显示选择布局模式
let showLayoutTypeChoose = ref(false);
// 布局模式
let layoutType = ref("");

// 路由对象
const route = useRoute();
const router = useRouter();

// 获取上下文
const { proxy } = getCurrentInstance();

// store的引用
const iStore = ref({});

// 添加sotre
iStore.value.userInfo = useUserInfo();

/**
 * 添加全局变量
 */
// 画布对象
let grid;
// 代码编辑器
let monacoEditor;
// 序列化的页面
let ipageConfig;
// 记录当前拖拽组件
let currentDraggedComponent;

/**
 * 计算条件表达式
 */
let ieval = (expression, item, index) => {
    try {
        eval(expression);
    } catch (error) {
        return false;
    }
    return eval(expression);
};

/**
 * 处理组件发出的事件
 */
let catchComponentEvent = (component, ievent, item, index) => {
    let componentEventHanler = component.schema.handlers[ievent.eventName];
    if (componentEventHanler) {
        let pageFunction = ipageFunctionList.value.find((f) => f.name == componentEventHanler);
        if (pageFunction) {
            let functionString = pageFunction.code;
            eval(`(
        ${functionString}
      )(component,ievent,item,index)`);
        }
    }
};

/**
 * 初始化画布
 */
let initCanvas = () => {
    showLayoutTypeChoose.value = false;
    layoutType.value = "absolute";

    // 初始化grid
    let gridOptions = {
        // 画布自动变高
        float: true,
        // Accept widgets dragged from other grids or from outside
        acceptWidgets: true,
        // 单元高度
        cellHeight: 4,
        // 单元格间隔大小
        margin: 4,
        // 栅格大小
        column: 12,
        // 禁止整体宽度小于minW时column变成1
        disableOneColumnMode: true,
    };

    // 设置可拖拽到布局的div
    grid = GridStack.init(gridOptions, ".formRender");

    // 新添加元素信息
    grid.on("added", function (e) {
        let layoutInfo = e.detail[0];
        // 排除已经具备id的元素
        let isExist = layoutInfo.id;
        if (!isExist) {
            grid.removeWidget(layoutInfo.el);
            // 添加组件到现有组件列表
            let currentCom = icomponentLibrary.value.getComponentByType(currentDraggedComponent);
            console.log("新添加的元素信息====", layoutInfo, currentCom);
            // 添加布局信息
            currentCom.layout["gs-id"] = `com${(Math.random() * 10000000000000).toFixed()}`;
            currentCom.layout["gs-x"] = layoutInfo.x;
            currentCom.layout["gs-y"] = layoutInfo.y;
            icomponentList.value.push(currentCom);
            setTimeout(() => {
                let addedDom = document.querySelector(`[gs-id=${currentCom.layout["gs-id"]}]`);
                grid.makeWidget(addedDom);
            }, 10);
        }
    });

    // 删除元素信息
    grid.on("removed", function (e) {
        console.log("删除元素====", e);
        let layoutInfo = e.detail[0];
        icomponentList.value = icomponentList.value.filter((x) => x.layout["gs-id"] != layoutInfo.id);
    });

    // 修改元素大小
    grid.on("resize", function (event, el) {
        console.log("修改元素大小====", event.target.gridstackNode, el.id);
        let com = icomponentList.value.find((x) => x.layout["gs-id"] == el.id);
        com.layout["gs-w"] = event.target.gridstackNode.w;
        com.layout["gs-h"] = event.target.gridstackNode.h;
    });

    setTimeout(() => {
        //初始化拖拽元素进入画布
        GridStack.setupDragIn(".componentLibrary .grid-stack-item", {
            handle: ".grid-stack-item-content",
            appendTo: "body",
            // 拖动时显示的dom
            helper: function (event) {
                return utils.getParentNode(event.target, "grid-stack-item-content").parentElement.cloneNode(true);
            },
            // 开始拖拽的元素
            start: function (event) {
                console.log("开始拖拽组件====", event);
                currentDraggedComponent = event.target.dataset.comtype;
            },
        });
    }, 10);
};

/**
 * 初始化流式布局
 */

let initFlowLayout = () => {
    showLayoutTypeChoose.value = false;
    layoutType.value = "flow";
    // 初始化拖拽元素进入画布
    $(".formRender").sortable();
};

/**
 *  添加组件到flow布局
 */

let addComponentToFlow = (com) => {
    let currentCom = JSON.parse(JSON.stringify(toRaw(com)));
    console.log("添加组件到flow====", currentCom);
    currentCom.layout["gs-id"] = `com${(Math.random() * 10000000000000).toFixed()}`;
    currentCom.layout["gs-x"] = 1;
    icomponentList.value.push(currentCom);
};

/**
 * 当组件库拖动时
 */
let draggedComponent;
let onPresetComponentDrag = (component, $event) => {
    console.log("当前添加组件====", component, $event);
    draggedComponent = component;
};
/**
 * 组件画布中悬浮
 */
let onPresetComponentDragover = (event) => {
    event.preventDefault();
};
/**
 * 组件被放入画布
 */
let onPresetComponentDrop = (event) => {
    event.preventDefault();
    if (draggedComponent) {
        addComponentToFlow(draggedComponent);
        draggedComponent = null;
    }
};

/**
 * 折叠组件库目录
 */
let collapseCategory = (category) => {
    icomponentLibrary.value.list[category].isCollapse = !icomponentLibrary.value.list[category].isCollapse;
};

/**
 * 改变组件大小
 */
let flowResizeStartAxis;
let flowResizeStartSize;
let flowResizeDistance;
let currentResizeCom;

let beginResizeComponent = (com, event) => {
    currentResizeCom = com;
    console.log("开始改变组件大小====", com, event);
    let { screenX, screenY } = event;
    flowResizeStartAxis = {
        screenX,
        screenY,
    };
    let dom = $(event.target).closest(".flowContainer")[0];
    flowResizeStartSize = {
        h: dom.offsetHeight,
        w: dom.offsetWidth,
    };
    $(".formRender").sortable("disable");
};

/**
 * 计算拖动距离
 */
let detectSizeDistance = (event) => {
    if (flowResizeStartAxis && currentResizeCom) {
        let { screenX, screenY } = event;
        flowResizeDistance = {
            x: screenX - flowResizeStartAxis.screenX,
            y: screenY - flowResizeStartAxis.screenY,
        };
        currentResizeCom.layout.flowHeight = flowResizeStartSize.h + flowResizeDistance.y;
        currentResizeCom.layout["gs-x"] = ((flowResizeStartSize.w + flowResizeDistance.x) / document.querySelector(".formRender").offsetWidth).toFixed(2);

        if (currentResizeCom.layout["gs-x"] > 1) {
            currentResizeCom.layout["gs-x"] = 1;
        }
    }
};

/**
 * 结束拖动组件大小
 */
let endResizeComponent = (event) => {
    if (flowResizeStartAxis && currentResizeCom) {
        detectSizeDistance(event);
        console.log("停止改变组件大小====", currentResizeCom, event);
        currentResizeCom.layout.flowHeight = flowResizeStartSize.h + flowResizeDistance.y;
        currentResizeCom.layout["gs-x"] = ((flowResizeStartSize.w + flowResizeDistance.x) / document.querySelector(".formRender").offsetWidth).toFixed(2);
        if (currentResizeCom.layout["gs-x"] > 1) {
            currentResizeCom.layout["gs-x"] = 1;
        }
        flowResizeStartAxis = null;
        currentResizeCom = null;
        $(".formRender").sortable("enable");
    }
};

/**
 * 计算组件的大小
 */
let calculateComponentStyle = (com) => {
    return `
    vertical-align: top;
    min-height:${com.layout.flowHeight}px;
    width:${parseInt(com.layout["gs-x"] * 100)}%;
    ${com.layout.inlineBlock ? "display:inline-block;" : ""}
    margin:${com.layout.marginTop}px ${com.layout.marginRight}px ${com.layout.marginBottom}px ${com.layout.marginLeft}px;`;
};

/**
 * 移除组件
 */
let removeComponent = (gsid) => {
    if (layoutType.value == "flow") {
        icomponentList.value = icomponentList.value.filter((x) => x.layout["gs-id"] != gsid);
    } else {
        let removeDom = document.querySelector(`[gs-id=${gsid}]`);
        grid && grid.removeWidget(removeDom);
    }

    // 如果当前正在设置component,则显示pageData
    if (settingMode.value == "com" && currentSettingComponent.value.layout["gs-id"] == gsid) {
        settingMode.value = "pageData";
        currentSettingComponent.value = null;
    }
};

/**
 * 组件设置
 */
let settingComponent = (com) => {
    console.log("当前编辑组件====", com);
    settingMode.value = "com";
    currentSettingComponent.value = com;
};

/**
 * 组件 map layout
 */
let serializeComponentList = () => {
    let itemsLayout = grid.getGridItems().map((x) => x.gridstackNode);
    itemsLayout.forEach((layout) => {
        let item = icomponentList.value.find((x) => x.layout["gs-id"] == layout.id);
        item.layout["gs-x"] = layout.x;
        item.layout["gs-y"] = layout.y;
        item.layout["gs-h"] = layout.h;
        item.layout["gs-w"] = layout.w;
    });
    return icomponentList;
};

/**
 * 应用页面数据
 */
let applyPageData = () => {
    console.log("最新的pageDataList====", ipageDataList);
    dynamicDefinePageData(ipageDataList.value);
};

/**
 * 快捷输入绑定data
 */
let linkToDataKey = (e) => {
    e.target.select();
    document.execCommand("copy");
};

/**
 * 动态添加page中绑定数据
 */
let dynamicDefinePageData = (pageDataList) => {
    iData.value = {};
    pageDataList.forEach((item) => {
        switch (item.type) {
            case "String":
                eval(`iData.value.${item.name} = "${item.default}"`);
                break;
            case "Boolean":
                eval(`iData.value.${item.name} = ${item.default}`);
                break;
            case "Array":
                eval(`iData.value.${item.name} = ${toRaw(item.default)}`);
                break;
            case "Object":
                eval(`iData.value.${item.name} = ${JSON.stringify(toRaw(item.default))}`);
                break;
            default:
                eval(`iData.value.${item.name} = ${item.default}`);
                break;
        }
    });
};

/**
 * 修改iData属性值
 */
let updateVmodalValue = (pageData, $event) => {
    try {
        let tempObject = null;
        eval(`tempObject = ${$($event.target).closest(".ant-input-group").find("input").val()}`);
        pageData.default = tempObject;
        utils.message.success("更新成功", 0.4);
    } catch (error) {
        utils.message.error("JSON格式错误", 0.4);
    }
};

/**
 * 动态显示绑定数据
 */

let expandModelValue = (idataPath, item, index) => {
    try {
        return eval(`iData.value.${idataPath}`);
    } catch (error) {
        return "";
    }
};
let expandItemModelValue = (bindPath, item) => {
    if (bindPath.match(/^item\./)) {
        // 检查是否存在数据源
        try {
            return eval(bindPath);
        } catch (error) {
            return undefined;
        }
    } else {
        return expandModelValue(bindPath);
    }
};

/**
 * 解析循环数据源
 */
let spreadLoopSource = (loopSource) => {
    if (loopSource.includes(".")) {
        let propertys = loopSource.split(".").filter((x) => x !== "");
        let parentObj = iData.value;
        let hasSource = true;
        propertys.every((currentProperty) => {
            if (parentObj.hasOwnProperty(currentProperty)) {
                parentObj = parentObj[currentProperty];
                return true;
            } else {
                //不存在属性，绑定循环源错误
                hasSource = false;
                return false;
            }
        });
        return eval(`iData.value.${propertys.join(".")}`);
    } else {
        if (iData.value.hasOwnProperty(loopSource)) {
            return iData.value[loopSource];
        }
    }
};

/**
 * 动态更新绑定数据
 */
let updateModelValue = (idataPath, newValue) => {
    try {
        eval(`iData.value.${idataPath} = newValue`);
    } catch (error) {}
};
let updateItemModelValue = (bindPath, newValue, item) => {
    if (bindPath.match(/^item\./)) {
        try {
            eval(`${bindPath} = newValue`);
        } catch (error) {}
    } else {
        updateModelValue(bindPath, newValue);
    }
};

/**
 * 页面数据类型改变后初始化该数据的一些字段
 */
let pageDataTypeChanged = (pageData) => {
    console.log("页面数据类型改变====", pageData);
    if (pageData.type == "String") {
        pageData.default = "";
    }
    if (pageData.type == "Boolean") {
        pageData.default = false;
    }
    if (pageData.type == "Number") {
        pageData.default = 1;
    }
    if (pageData.type == "Array") {
        pageData.default = "[]";
    }
    if (pageData.type == "Object") {
        pageData.default = {};
    }
};

/**
 * 删除页面数据
 */
let deletePageData = (dataName) => {
    ipageDataList.value = ipageDataList.value.filter((x) => x.name != dataName);
};

/**
 * 添加页面数据
 */
let addPageData = () => {
    ipageDataList.value.push({
        type: "String",
        name: `newData${(Math.random() * 100000000000).toFixed()}`,
        default: "default Data",
    });
};

/**
 * 显示页面数据
 */
let showPageData = () => {
    settingMode.value = "pageData";
    ipageDataList.value.forEach((idata) => {
        setTimeout(() => {
            $(`#pageData_${idata.name}`).val(JSON.stringify(idata.default));
        }, 1);
    });
};

/**
 * 添加页面方法
 */
let addPageFunction = () => {
    let newFunction = {
        name: `fun${(Math.random() * 10000000000000).toFixed()}`,
        code: `()=>{}`,
    };
    ipageFunctionList.value.push(newFunction);
};

/**
 * monaco编辑方法
 */
let assignment = "";
let monacoLanguage = "";
let openCodeWithMonaco = (assignmentString, language) => {
    assignment = assignmentString;
    monacoLanguage = language;
    // 打开monaco容器
    codeEditorContainer.value = true;
};

/**
 * 初始化monaco
 */
let initcodeEditor = () => {
    let editorContainer = document.querySelector("#monacoContainer");

    if (codeEditorContainer.value) {
        // 初始化monaco
        if (!monacoEditor && editorContainer) {
            monacoEditor = monaco.editor.create(editorContainer, {
                value: eval(assignment),
                language: monacoLanguage,
                theme: "vs-dark",
            });
            monacoEditor.onDidChangeModelContent((changeEvent) => {
                if (changeEvent.isFlush == false) {
                    eval(`${assignment} = monacoEditor.getValue()`);
                }
            });
        }

        // 重置code
        if (monacoEditor && editorContainer) {
            eval(`monacoEditor.setValue(${assignment})`);
        }
        // 格式化代码
        setTimeout(() => {
            monaco.editor.setModelLanguage(monacoEditor.getModel(), monacoLanguage);
            monacoEditor.trigger("editor", "editor.action.formatDocument");
        }, 20);
    } else {
        if (monacoEditor && editorContainer) {
            monacoEditor.setValue("");
        }
    }
};

/**
 * 删除页面数据
 */
let deletePageFunction = (ifunction) => {
    ipageFunctionList.value = ipageFunctionList.value.filter((x) => x.name != ifunction);
};

/**
 * 保存页面
 */
let savePage = async () => {
    let componentArray = [];
    if (layoutType.value == "absolute") {
        componentArray = serializeComponentList().value;
    } else {
        document.querySelectorAll(".flowContainer").forEach((i) => {
            componentArray.push(icomponentList.value.find((x) => x.layout["gs-id"] == i.id));
        });
    }

    let pageConfig = {
        ipageDataList: ipageDataList.value,
        ipageFunctionList: ipageFunctionList.value,
        icomponentList: componentArray,
        ipageSetting: ipageSetting.value,
        layoutType: layoutType.value,
    };

    if (ipageConfig) {
        // 更新
        let params = {
            ConnectionKey: "tpm",
            DB: "smartx-tpm",
            Collection: "cfg-generic-page",
            _id: ipageConfig._id,
            Set: pageConfig,
        };
        let res = await proxy.$service.xUpdateDocument(params);
        if (res && res.success && res.content) {
            utils.message.success("保存配置成功");
        }
    } else {
        // 保存
        let params = {
            ConnectionKey: "tpm",
            DB: "smartx-tpm",
            Collection: "cfg-generic-page",
            Doc: pageConfig,
        };
        let res = await proxy.$service.xInsertDocument(params);
        if (res && res.success && res.content) {
            utils.message.success("保存配置成功");
            console.log("插入页面配置成功====", res.content._id);
        }
    }
};

/**
 * 初始化每个组件的css
 */
let initComponentCss = (com) => {
    if (com?.schema?.style) {
        //替换id
        let lessString = com.schema.style;
        lessString = lessString.replace("#Id", "#component_" + com.layout["gs-id"]);
        // 编译less
        less.render(lessString, (e, d) => {
            if (e) {
                console.log("编译组件样式error====", e);
                return;
            }
            // 更新或者初始化组件的样式
            if ($(`style#${com.layout["gs-id"]}`).length) {
                $(`style#${com.layout["gs-id"]}`).text(d.css);
            } else {
                $(`<style id="${com.layout["gs-id"]}"><style>`).text(d.css).appendTo(document.head);
            }
        });
    }
};
//更新组件样式
watch(
    () => currentSettingComponent?.value?.schema?.style,
    () => {
        initComponentCss(currentSettingComponent.value);
    }
);

/**
 * 加载配置并初始化页面data,function,components
 */
let fetchPageConfig = async () => {
    let routeQuery = route.query;

    if (routeQuery.pageId) {
        let params = {
            db: "smartx-tpm",
            collection: "cfg-generic-page",
            filter: {
                "ipageSetting.pageId": routeQuery.pageId,
                "ipageSetting.applicationId": routeQuery.applicationId,
            },
        };
        let res = await proxy.$service.querySettings(params);
        if (res && res.success && res.content) {
            let config = res.content[0] || {};
            console.log("加载页面配置====", config);
            ipageConfig = config;

            // 初始化data
            dynamicDefinePageData(config.ipageDataList);
            ipageDataList.value = config.ipageDataList;
            // 初始化function
            ipageFunctionList.value = config.ipageFunctionList;
            // 初始化组件
            config.icomponentList.forEach((com) => {
                let originConfig = icomponentLibrary.value.getComponentByType(com.schema.type);
                com.paramsSetting = originConfig.paramsSetting;
            });
            icomponentList.value = config.icomponentList;
            icomponentList.value.forEach((com) => {
                initComponentCss(com);
            });
            // 页面设置
            Object.assign(ipageSetting.value, config.ipageSetting);
            layoutType.value = config.layoutType;
            if (config.layoutType == "absolute") {
                setTimeout(() => {
                    initCanvas();
                }, 100);
            } else {
                // 初始化流式布局
                initFlowLayout();
            }
        }
    } else {
        // 选择布局模式
        showLayoutTypeChoose.value = true;
    }

    setTimeout(() => {
        // 执行onload
        try {
            eval(`(${ipageSetting.value.onload})()`);
        } catch (error) {}
    }, 100);
};

onMounted(async () => {
    fetchPageConfig();
});
</script>

<template>
    <div class="componentLibrary">
        <!-- title -->
        <template v-for="(list, category) in icomponentLibrary.list" :key="category">
            <div class="title">
                <font-awesome-icon icon="fa-solid fa-box-open" />
                <div>{{ category }}</div>
                <div @click="collapseCategory(category)" class="icon">
                    <font-awesome-icon v-if="!list.isCollapse" icon="fa-solid fa-angles-up" />
                    <font-awesome-icon v-if="list.isCollapse" icon="fa-solid fa-angles-down" />
                </div>
            </div>
            <span v-if="!list.isCollapse">
                <template v-for="(component, index) in list" :key="index">
                    <template v-if="layoutType == 'absolute'">
                        <div class="grid-stack-item" v-bind="component.layout" :data-ComType="component.schema.type">
                            <div class="grid-stack-item-content library">
                                <p>{{ component.schema.describe }}</p>
                            </div>
                        </div>
                    </template>
                    <template v-if="layoutType == 'flow'">
                        <div class="grid-stack-item" draggable="true" @dragstart="onPresetComponentDrag(component, $event)">
                            <div class="grid-stack-item-content library">
                                <p>{{ component.schema.describe }}</p>
                            </div>
                        </div>
                    </template>
                </template>
            </span>
        </template>
    </div>

    <div class="formRenderContainer" @mousemove="detectSizeDistance" @mouseup="endResizeComponent" @dragover="onPresetComponentDragover" @drop="onPresetComponentDrop">
        <div :style="{ margin: '0 auto', width: ipageSetting.pageWitdh + 'px', overflowY: 'auto', overflowX: 'hidden', height: '100%' }">
            <div class="formRender" :style="ipageSetting.pageStyle">
                <div style="height: 0px; display: flex"></div>
                <!-- 根据组件列表渲染出格子 -->
                <template v-for="component in icomponentList" :key="component.layout['gs-id']">
                    <!-- 绝对布局 -->
                    <template v-if="layoutType == 'absolute'">
                        <div class="grid-stack-item" v-bind="component.layout" :id="component.layout['gs-id']">
                            <div class="grid-stack-item-content">
                                <!-- 显示高宽 -->
                                <div class="containerDimension">
                                    <font-awesome-icon icon="fa-solid fa-ruler-combined" />
                                    <div>W： {{ component.layout["gs-w"] }}/12</div>
                                    <div>H： {{ component.layout["gs-h"] * 4 }} px</div>
                                </div>
                                <!-- 操作按钮 -->
                                <div @click="settingComponent(component)" class="ui-setting-Btn" style="right: -1px">
                                    <van-icon name="setting-o" />
                                </div>
                                <div @click="removeComponent(component.layout['gs-id'])" class="ui-setting-Btn" style="right: 19px">
                                    <van-icon name="delete-o" />
                                </div>

                                <div class="ui-setting-Btn" style="right: 39px">
                                    <font-awesome-icon icon="fa-solid fa-arrows-up-down-left-right" />
                                </div>

                                <!-- 如果没有绑定页面data则取消v-model -->
                                <template v-if="component.schema.props.iModel">
                                    <component :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" v-model="iData[component.schema.props.iModel]" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore"> </component>
                                </template>
                                <template v-else>
                                    <component :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore"> </component>
                                </template>
                            </div>
                        </div>
                    </template>

                    <!-- 流式布局 -->
                    <template v-if="layoutType == 'flow'">
                        <div class="flowContainer" :id="component.layout['gs-id']" :style="calculateComponentStyle(component)">
                            <!-- 显示高宽 -->
                            <div class="containerDimension">
                                <font-awesome-icon icon="fa-solid fa-ruler-combined" />
                                <div>W： {{ parseInt(component.layout["gs-x"] * 100) }} %</div>
                                <div>H： {{ component.layout.flowHeight }} px</div>
                            </div>
                            <!-- 数据检查 -->
                            <div style="display: none">{{ component }}</div>
                            <!-- 操作按钮 -->
                            <div @click="settingComponent(component)" class="ui-setting-Btn" style="right: 0px">
                                <van-icon name="setting-o" />
                            </div>
                            <div @click="removeComponent(component.layout['gs-id'])" class="ui-setting-Btn" style="right: 19px">
                                <van-icon name="delete-o" />
                            </div>

                            <div @mousedown="beginResizeComponent(component, $event)" class="ui-setting-Btn" style="right: 0px; top: auto; bottom: 0; cursor: ne-resize">
                                <font-awesome-icon icon="fas fa-expand-alt" />
                            </div>

                            <!-- 如果是循环组件 -->
                            <template v-if="component.schema.loop">
                                <template v-for="(item, xindex) in spreadLoopSource(component.schema.loopSource)" :key="item[component.schema.loopUnikey] || xindex">
                                    <!-- 如果没有绑定页面data则取消v-model -->
                                    <template v-if="component.schema.props.iModel">
                                        <component :id="'component_' + component.layout['gs-id']" :ipageSetting="ipageSetting" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandItemModelValue(component.schema.props.iModel, item)" @update:modelValue="updateItemModelValue(component.schema.props.iModel, $event, item)" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                    <template v-else>
                                        <component :id="'component_' + component.layout['gs-id']" :ipageSetting="ipageSetting" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                </template>
                            </template>

                            <template v-else>
                                <!-- 如果没有绑定页面data则取消v-model -->
                                <template v-if="component.schema.props.iModel">
                                    <component :id="'component_' + component.layout['gs-id']" :ipageSetting="ipageSetting" v-if="ieval(component.schema.renderCondition)" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandModelValue(component.schema.props.iModel)" @update:modelValue="updateModelValue(component.schema.props.iModel, $event)" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                                <template v-else>
                                    <component :id="'component_' + component.layout['gs-id']" :ipageSetting="ipageSetting" v-if="ieval(component.schema.renderCondition)" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                            </template>
                        </div>
                    </template>
                </template>
            </div>
        </div>

        <!-- 浮动按钮 -->
        <div class="floatButtonContainer">
            <div class="floatButton" @click="settingMode = 'pageConfig'" style="background: #1989fa">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
                <span>页面设置</span>
            </div>
            <div class="floatButton" @click="showPageData" style="background: #fa6e19">
                <font-awesome-icon icon="fa-solid fa-cubes" />
                <span>属性字段</span>
            </div>
            <div class="floatButton" @click="settingMode = 'pageFunction'" style="background: #12bc2c">
                <font-awesome-icon icon="fa-solid fa-terminal" />
                <span>方法函数</span>
            </div>

            <div class="floatButton" @click="settingMode = 'formConfig'">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
                <span>表单设置</span>
            </div>
            <div class="floatButton" @click="savePage" style="left: 279px">
                <font-awesome-icon icon="fa-solid fa-inbox" />
                <span>保存页面</span>
            </div>
        </div>
    </div>

    <div class="attributeBoard">
        <!-- pageData设置 -->
        <div v-if="settingMode == 'pageData'" class="pageSetting">
            <div class="title">页面Data设置</div>

            <template v-for="(pageData, index) in ipageDataList" :key="index">
                <div class="pageDataItem">
                    <div class="delete" @click="deletePageData(pageData.name)">
                        <font-awesome-icon icon="fas fa-trash-alt" />
                    </div>

                    <div class="label">属性名称：</div>
                    <a-input v-model:value="pageData.name" />
                    <div class="label">属性类型：</div>
                    <a-select
                        ref="select"
                        v-model:value="pageData.type"
                        style="width: 100%"
                        :options="[
                            {
                                value: 'Boolean',
                                label: 'Boolean',
                            },
                            {
                                value: 'String',
                                label: 'String',
                            },
                            {
                                value: 'Number',
                                label: 'Number',
                            },
                            {
                                value: 'Array',
                                label: 'Array',
                            },
                            {
                                value: 'Object',
                                label: 'Object',
                            },
                        ]"
                        @change="pageDataTypeChanged(pageData)"
                    ></a-select>

                    <!-- 字符串类型的配置 -->
                    <template v-if="pageData.type == 'String'">
                        <div class="label">初始值：</div>
                        <a-input v-model:value="pageData.default" />
                    </template>

                    <!-- 字符串类型的配置 -->
                    <template v-if="pageData.type == 'Number'">
                        <div class="label">初始值：</div>
                        <a-input-number style="width: 100%" v-model:value="pageData.default" />
                    </template>

                    <!-- 数组类型的配置 -->
                    <template v-if="pageData.type == 'Array'">
                        <div class="label">初始值：</div>
                        <a-input v-model:value="pageData.default" />
                    </template>

                    <!-- 布尔类型的配置 -->
                    <template v-if="pageData.type == 'Boolean'">
                        <div class="label">初始值：</div>
                        <van-switch v-model="pageData.default" active-color="green" inactive-color="#dcdee0" style="zoom: 0.8" />
                    </template>

                    <!-- 对象类型的配置 -->
                    <template v-if="pageData.type == 'Object'">
                        <div class="label">初始值：</div>
                        <a-input-group compact style="width: 100%">
                            <input class="ant-input" :id="'pageData_' + pageData.name" style="width: calc(100% - 32px)" />
                            <a-button @click="updateVmodalValue(pageData, $event)" type="primary">
                                <template #icon>
                                    <sync-outlined />
                                </template>
                            </a-button>
                        </a-input-group>
                    </template>
                </div>
            </template>

            <van-button icon="plus" type="primary" @click="addPageData" class="button">添加新属性</van-button>
            <van-button icon="back-top" type="primary" @click="applyPageData" class="button">应用到当前页面</van-button>
        </div>

        <!-- 组件设置 -->
        <div v-if="settingMode == 'com'" class="pageSetting">
            <div class="title">component设置</div>

            <!-- 是否开启循环 -->
            <div class="pageDataItem" v-if="currentSettingComponent?.schema?.loop !== undefined" style="height: 40px">
                <div class="label" style="display: flex">开启循环：<van-checkbox v-model="currentSettingComponent.schema.loop" checked-color="rgb(50 194 72)"></van-checkbox></div>
            </div>

            <template v-if="currentSettingComponent.schema.loop">
                <!-- 循环数据 -->
                <div class="pageDataItem">
                    <div class="label">
                        数据源字段：
                        <a-popover>
                            <template #content>
                                <template v-for="(key, value) of iData" :key="key">
                                    <input @click="linkToDataKey" class="idataItem" :value="value" />
                                </template>
                            </template>
                            <font-awesome-icon icon="fa-solid fa-link" />
                        </a-popover>
                    </div>
                    <a-input placeholder="还未绑定页面属性字段" v-model:value="currentSettingComponent.schema.loopSource" />
                </div>
                <!-- 循环唯一key -->
                <div class="pageDataItem">
                    <div class="label">循环项唯一KEY：</div>
                    <a-input placeholder="还未绑定页面属性字段" v-model:value="currentSettingComponent.schema.loopUnikey" />
                </div>
            </template>

            <!-- 组件样式 -->
            <div class="pageDataItem" v-if="currentSettingComponent?.schema?.style !== undefined">
                <div class="label">
                    <span>组件样式：</span>
                    <a-button style="zoom: 0.9; position: absolute; right: 11px" size="small" @click="openCodeWithMonaco(`currentSettingComponent.value.schema.style`, `less`)">
                        <template #icon>
                            <CodeOutlined />
                        </template>
                        <span> 使用编辑器 </span>
                    </a-button>
                </div>
                <a-textarea style="height: 30px" v-model:value="currentSettingComponent.schema.style" placeholder="组件样式" />
            </div>

            <!-- 组件条件渲染 -->
            <div class="pageDataItem">
                <div class="label">
                    <span>组件v-if：</span>
                    <a-button style="zoom: 0.9; position: absolute; right: 11px" size="small" @click="openCodeWithMonaco(`currentSettingComponent.value.schema.renderCondition`, `javascript`)">
                        <template #icon>
                            <CodeOutlined />
                        </template>
                        <span> 使用编辑器 </span>
                    </a-button>
                </div>
                <a-textarea style="height: 30px" v-model:value="currentSettingComponent.schema.renderCondition" placeholder="组件条件渲染" />
            </div>

            <!-- 组件边距 -->
            <template v-if="layoutType == 'flow'">
                <div class="pageDataItem" v-if="currentSettingComponent?.layout['gs-x'] !== undefined">
                    <div class="label">容器宽度：(百分比)</div>
                    <a-input-number style="width: 100%" v-model:value="currentSettingComponent.layout['gs-x']" />
                </div>

                <div class="pageDataItem" v-if="currentSettingComponent?.layout?.flowHeight !== undefined">
                    <div class="label">容器高度：(像素)</div>
                    <a-input-number style="width: 100%" v-model:value="currentSettingComponent.layout.flowHeight" />
                </div>

                <div class="pageDataItem" v-if="currentSettingComponent?.layout?.marginLeft !== undefined" style="height: 130px">
                    <div class="label">边距设置：</div>
                    <font-awesome-icon class="showDistance" icon="fas fa-expand" style="top: 50px; left: 118px" />
                    <a-input-number class="tAlignRight" v-model:value="currentSettingComponent.layout.marginLeft" style="width: 60px; left: 30px; position: absolute; top: 50px" />
                    <a-input-number class="tAlignCenter" v-model:value="currentSettingComponent.layout.marginTop" style="width: 60px; position: absolute; top: 10px; left: 50%; transform: translateX(-50%)" />
                    <a-input-number v-model:value="currentSettingComponent.layout.marginRight" style="width: 60px; position: absolute; top: 50px; right: 30px" />
                    <a-input-number class="tAlignCenter" v-model:value="currentSettingComponent.layout.marginBottom" style="width: 60px; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%)" />
                </div>

                <div class="pageDataItem" v-if="currentSettingComponent?.layout?.inlineBlock !== undefined" style="height: 40px">
                    <div class="label" style="display: flex">是否浮动组件：<van-checkbox v-model="currentSettingComponent.layout.inlineBlock" checked-color="rgb(50 194 72)"></van-checkbox></div>
                </div>
            </template>
            <!-- 渲染组件属性 -->
            <template v-if="currentSettingComponent.paramsSetting">
                <template v-for="params in currentSettingComponent.paramsSetting" :key="params.val + params.type">
                    <!-- boolean 属性 -->
                    <div class="pageDataItem" v-if="params.type == 'boolean'">
                        <div class="label" style="display: flex">{{ params.label }}：<van-checkbox v-model="currentSettingComponent.schema.props[params.val]" checked-color="rgb(50 194 72)"></van-checkbox></div>
                    </div>
                    <!-- input 属性 -->
                    <div class="pageDataItem" v-if="params.type == 'string'">
                        <div class="label">
                            {{ params.label }}：
                            <a-popover>
                                <template #content>
                                    <template v-for="(key, value) of iData" :key="key">
                                        <input @click="linkToDataKey" class="idataItem" :value="value" />
                                    </template>
                                </template>
                                <font-awesome-icon icon="fa-solid fa-link" />
                            </a-popover>
                        </div>
                        <a-input v-model:value="currentSettingComponent.schema.props[params.val]" />
                    </div>
                    <!-- numberInput 属性 -->
                    <div class="pageDataItem" v-else-if="params.type == 'number'">
                        <div class="label">{{ params.label }}：</div>
                        <a-input-number v-model:value="currentSettingComponent.schema.props[params.val]" :min="params.min" :max="params.max" />
                    </div>
                    <!-- select 属性 -->
                    <div class="pageDataItem" v-else-if="params.type == 'select'">
                        <div class="label">{{ params.label }}：</div>
                        <a-select ref="select" v-model:value="currentSettingComponent.schema.props[params.val]" style="width: 100%" :options="params.options"></a-select>
                    </div>
                    <!-- function 属性 -->
                    <div class="pageDataItem" v-else-if="params.type == 'function'">
                        <div class="label">
                            <span>{{ params.label }}：</span>
                            <a-button style="zoom: 0.9; position: absolute; right: 11px" size="small" @click="openCodeWithMonaco(`currentSettingComponent.value.schema.props.${params.val}`, `javascript`)">
                                <template #icon>
                                    <CodeOutlined />
                                </template>
                                <span> 使用编辑器 </span>
                            </a-button>
                        </div>
                        <a-textarea style="height: 30px" v-model:value="currentSettingComponent.schema.props[params.val]" placeholder="内嵌vue组件模板" />
                    </div>
                    <!-- 分割线 -->
                    <div class="title" v-else-if="params.type == 'splitLine'">{{ params.val }}</div>
                    <!-- 组件冒上来的方法名 -->
                    <div class="pageDataItem" v-else-if="params.type == 'funcName'">
                        <div class="label">
                            {{ params.label }}：
                            <a-popover>
                                <template #content>
                                    <template v-for="func of ipageFunctionList" :key="func.name">
                                        <input @click="linkToDataKey" class="idataItem" :value="func.name" />
                                    </template>
                                </template>
                                <font-awesome-icon icon="fa-solid fa-link" />
                            </a-popover>
                        </div>
                        <a-input placeholder="还未绑定页面处理方法" v-model:value="currentSettingComponent.schema.handlers[params.val]" />
                    </div>
                </template>
            </template>
        </div>

        <!-- 页面方法设置 -->
        <div v-if="settingMode == 'pageFunction'" class="pageSetting">
            <div class="title">页面Function设置</div>

            <template v-for="(ifunction, index) in ipageFunctionList" :key="index">
                <div class="pageDataItem">
                    <div class="delete" @click="deletePageFunction(ifunction.name)">
                        <font-awesome-icon icon="fas fa-trash-alt" />
                    </div>
                    <div class="label">方法名：</div>
                    <a-input v-model:value="ifunction.name" />
                    <div class="label">
                        <span>代码Javascript：</span>
                        <a-button
                            style="zoom: 0.9; position: absolute; right: 11px"
                            size="small"
                            @click="
                                () => {
                                    currentSettingFunction = ifunction;
                                    openCodeWithMonaco(`currentSettingFunction.value.code`, `javascript`);
                                }
                            "
                        >
                            <template #icon>
                                <CodeOutlined />
                            </template>
                            <span> 使用编辑器 </span>
                        </a-button>
                    </div>
                    <a-textarea style="height: 30px" v-model:value="ifunction.code" placeholder="请编写方法代码" />
                </div>
            </template>

            <van-button icon="plus" type="primary" @click="addPageFunction" class="button">添加新方法</van-button>
        </div>

        <!-- 页面设置 -->
        <div v-if="settingMode == 'pageConfig'" class="pageSetting">
            <div class="title">页面设置</div>

            <div class="pageDataItem">
                <div class="label">applicationId：</div>
                <a-input v-model:value="ipageSetting.applicationId" />
            </div>

            <div class="pageDataItem">
                <div class="label">页面唯一Id：</div>
                <a-input v-model:value="ipageSetting.pageId" />
            </div>

            <div class="pageDataItem">
                <div class="label">页面描述：</div>
                <a-input v-model:value="ipageSetting.pageDescribe" />
            </div>

            <div class="pageDataItem">
                <div class="label">
                    <span>全局样式：</span>
                    <a-button style="zoom: 0.9; position: absolute; right: 11px" size="small" @click="openCodeWithMonaco('ipageSetting.value.pageStyle', `less`)">
                        <template #icon>
                            <CodeOutlined />
                        </template>
                        <span> 使用编辑器 </span>
                    </a-button>
                </div>
                <a-textarea style="height: 30px" v-model:value="ipageSetting.pageStyle" placeholder="请编写页面样式" />
            </div>

            <div class="pageDataItem">
                <div class="label">
                    <span>页面启动后执行函数：</span>
                    <a-button style="zoom: 0.9; position: absolute; right: 11px" size="small" @click="openCodeWithMonaco('ipageSetting.value.onload', `javascript`)">
                        <template #icon>
                            <CodeOutlined />
                        </template>
                        <span> 使用编辑器 </span>
                    </a-button>
                </div>
                <a-textarea style="height: 30px" v-model:value="ipageSetting.onload" placeholder="请编写页面加载后执行函数" />
            </div>

            <div class="pageDataItem">
                <div class="label">设计宽度：</div>
                <a-input-number style="width: 100%" v-model:value="ipageSetting.pageWitdh" />
            </div>
            <div class="pageDataItem">
                <div class="label">是否启用smartRem:</div>
                <van-switch v-model="ipageSetting.setSmartRem" active-color="green" inactive-color="#dcdee0" style="zoom: 0.8" />
            </div>
        </div>

        <!-- 表单设置 -->
        <div v-if="settingMode == 'formConfig'" class="pageSetting">
            <div class="title">表单设置</div>

            <div class="pageDataItem">
                <div class="label">激活页面表单配置:</div>
                <van-switch v-model="ipageSetting.isFormPage" active-color="green" inactive-color="#dcdee0" style="zoom: 0.8" />
            </div>
            <div class="pageDataItem">
                <div class="label">表单类型：</div>
                <a-select
                    v-model:value="ipageSetting.formType"
                    style="width: 100%"
                    :options="[
                        {
                            value: 'ant',
                            label: 'ant',
                        },
                        {
                            value: 'vant',
                            label: 'vant',
                        },
                    ]"
                ></a-select>
            </div>

            <template v-if="ipageSetting.formType == 'ant'">
                <div class="pageDataItem">
                    <div class="label">finish：</div>
                    <div class="label">(values: object)=>=> void：</div>
                    <a-input v-model:value="ipageSetting.formPageOnFinish" />
                </div>
            </template>

            <div class="pageDataItem">
                <div class="label">submit：</div>
                <div class="label">(values: object)=>=> void：</div>
                <a-input v-model:value="ipageSetting.formPageOnSubmit" />
            </div>
        </div>
    </div>

    <!-- monaco抽屉 -->
    <a-drawer class="monacoDrawer" v-model:visible="codeEditorContainer" @afterVisibleChange="initcodeEditor" title="编辑后自动保存" placement="right" width="700px">
        <div style="height: 100%" id="monacoContainer"></div>
    </a-drawer>

    <!-- 布局方式选择 -->
    <a-modal v-model:visible="showLayoutTypeChoose" :closable="false" :maskClosable="false" :footer="null" title="选择布局模式">
        <div class="layoutType">
            <div @click="initFlowLayout">
                <font-awesome-icon icon="fas fa-align-left" />
                <div>流式布局</div>
            </div>
            <div @click="initCanvas">
                <font-awesome-icon icon="fas fa-crosshairs" />
                <div>绝对定位</div>
            </div>
        </div>
    </a-modal>
</template>
