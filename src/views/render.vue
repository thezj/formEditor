<script setup>
import useUserInfo from "../store/modules/userInfo";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, toRaw, getCurrentInstance } from "vue";
import less from "less";
import { GridStack } from "gridstack";
import utils from "../utils/cUtile";
// 是否启用smartRem
import setSmartRem from "@/utils/smartRem.js";

const params = defineProps(["iprops"]);
//获取上下文
const { proxy } = getCurrentInstance();

// 添加ref
const icomponentList = ref([]);
const ipageDataList = ref([]);
const ipageFunctionList = ref([]);
const ipageSetting = ref({ pageStyle: "" });
const layoutType = ref("absolute");
const iData = ref({});
const iStore = ref({});
let grid = ref(null);

// 添加全局sotre
iStore.value.userInfo = useUserInfo();

const route = useRoute();
const router = useRouter();

/**
 * 计算组件容器的样式
 */
let calculateComponentStyle = (com) => {
    if (layoutType.value == "absolute") {
        return `
    position:absolute;
    top:${com.layout["gs-y"] * 4}px;
    left:${(com.layout["gs-x"] / 12) * 100}%;
    height:${com.layout["gs-h"] * 4}px;
    width:${(com.layout["gs-w"] / 12) * 100}%;
    `;
    } else {
        // 开启循环后高度直接auto
        let minHeight = com.layout.flowHeight + "px";
        if (com.schema.loop) {
            minHeight = "auto";
        }
        return `
    vertical-align: top;
    min-height:${minHeight};
    width:${com.layout["gs-x"] * 100}%;
    ${com.layout.inlineBlock ? "display:inline-block;" : ""}
    margin:${com.layout.marginTop}px ${com.layout.marginRight}px ${com.layout.marginBottom}px ${com.layout.marginLeft}px;`;
    }
};

/**
 * 计算条件表达式
 */
let ieval = (expression, item, index) => {
    try {
        return eval(expression);
    } catch (error) {
        return false;
    }
};

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
 * 处理表单事件
 */
let catchFromSubmit = (values) => {
    let componentEventHanler = ipageSetting.value.formPageOnSubmit;
    let pageFunction = ipageFunctionList.value.find((f) => f.name == componentEventHanler);
    if (pageFunction) {
        let functionString = pageFunction.code;
        eval(`(
        ${functionString}
      )(values)`);
    }
};
let catchFromFinish = (values) => {
    let componentEventHanler = ipageSetting.value.formPageOnFinish;
    let pageFunction = ipageFunctionList.value.find((f) => f.name == componentEventHanler);
    if (pageFunction) {
        let functionString = pageFunction.code;
        eval(`(
        ${functionString}
      )(values)`);
    }
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
 * 初始化每个组件的css
 */
let initComponentCss = (com) => {
    if (com?.schema?.style) {
        let lessString = com.schema.style;
        //替换id
        lessString = lessString.replace("#Id", "#component_" + com.layout["gs-id"]);
        // 编译less
        less.render(lessString, (e, d) => {
            // 更新或者初始化组件的样式
            if ($(`style#${com.layout["gs-id"]}`).length) {
                $(`style#${com.layout["gs-id"]}`).text(d.css);
            } else {
                $(`<style id="${com.layout["gs-id"]}"><style>`).text(d.css).appendTo(document.head);
            }
        });
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
    // 检查是否存在属性
    if (idataPath.includes(".") || iData.value.hasOwnProperty(idataPath)) {
        try {
            let modelvalue = eval(`iData.value.${idataPath} = newValue`);
        } catch (error) {}
    }
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
 * 拉取页面配置
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

            // 初始化data
            dynamicDefinePageData(config.ipageDataList);
            ipageDataList.value = config.ipageDataList;
            // 初始化function
            ipageFunctionList.value = config.ipageFunctionList;
            // 初始化组件
            icomponentList.value = config.icomponentList;
            icomponentList.value.forEach((com) => {
                initComponentCss(com);
            });
            // 页面设置
            ipageSetting.value = config.ipageSetting;
            if (config.ipageSetting.setSmartRem) {
                setSmartRem(config.ipageSetting.pageWitdh);
            }
            layoutType.value = config.layoutType;
            // 执行onload
            setTimeout(() => {
                try {
                    eval(`(${ipageSetting.value.onload})()`);
                } catch (error) {}
            }, 10);
        }
    }
};

onMounted(async () => {
    fetchPageConfig();
});
let submit = () => {};

// 暴露内部属性到template上的instance
defineExpose({
    route,
    router,
});
</script>

<template>
    <div class="renderPage" :style="{ margin: '0 auto', width: ipageSetting.pageWitdh + 'px' }">
        <!-- 根据组件列表渲染出格子 -->

        <template v-if="ipageSetting.isFormPage">
            <template v-if="ipageSetting.formType == 'ant'">
                <a-form :model="iData.formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @submit="catchFromSubmit" @finish="catchFromFinish">
                    <!-- 显示组件，绑定相应属性 -->
                    <template v-for="component in icomponentList" :key="component.layout['gs-id']">
                        <template v-if="!component.schema.loop">
                            <div class="layoutContainer" v-if="ieval(component.schema.renderCondition)" :id="component.layout['gs-id']" :style="calculateComponentStyle(component)">
                                <div style="display: none">{{ component }}</div>
                                <!-- 如果没有绑定页面data则取消v-model -->
                                <template v-if="component.schema.props.iModel">
                                    <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandModelValue(component.schema.props.iModel)" @update:modelValue="updateModelValue(component.schema.props.iModel, $event)" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                                <template v-else>
                                    <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                            </div>
                        </template>

                        <template v-else>
                            <div class="layoutContainer" :id="component.layout['gs-id']" v-if="spreadLoopSource(component.schema.loopSource).find((item, xindex) => ieval(component.schema.renderCondition, item, xindex))" :style="calculateComponentStyle(component)">
                                <div style="display: none">{{ component }}</div>
                                <!-- 如果是循环组件 -->
                                <template v-for="(item, xindex) in spreadLoopSource(component.schema.loopSource)" :key="item[component.schema.loopUnikey] || xindex">
                                    <!-- 如果没有绑定页面data则取消v-model -->
                                    <template v-if="component.schema.props.iModel">
                                        <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandItemModelValue(component.schema.props.iModel, item)" @update:modelValue="updateItemModelValue(component.schema.props.iModel, $event, item)" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                    <template v-else>
                                        <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                </template>
                            </div>
                        </template>
                    </template>
                    <!-- 显示组件，绑定相应属性 -->
                </a-form>
            </template>
            <template v-else>
                <van-form @submit="catchFromSubmit" style="display: inline">
                    <!-- 显示组件，绑定相应属性 -->
                    <template v-for="component in icomponentList" :key="component.layout['gs-id']">
                        <template v-if="!component.schema.loop">
                            <div class="layoutContainer" v-if="ieval(component.schema.renderCondition)" :id="component.layout['gs-id']" :style="calculateComponentStyle(component)">
                                <div style="display: none">{{ component }}</div>
                                <!-- 如果没有绑定页面data则取消v-model -->
                                <template v-if="component.schema.props.iModel">
                                    <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandModelValue(component.schema.props.iModel)" @update:modelValue="updateModelValue(component.schema.props.iModel, $event)" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                                <template v-else>
                                    <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                                </template>
                            </div>
                        </template>

                        <template v-else>
                            <div class="layoutContainer" :id="component.layout['gs-id']" v-if="spreadLoopSource(component.schema.loopSource).find((item, xindex) => ieval(component.schema.renderCondition, item, xindex))" :style="calculateComponentStyle(component)">
                                <div style="display: none">{{ component }}</div>
                                <!-- 如果是循环组件 -->
                                <template v-for="(item, xindex) in spreadLoopSource(component.schema.loopSource)" :key="item[component.schema.loopUnikey] || xindex">
                                    <!-- 如果没有绑定页面data则取消v-model -->
                                    <template v-if="component.schema.props.iModel">
                                        <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandItemModelValue(component.schema.props.iModel, item)" @update:modelValue="updateItemModelValue(component.schema.props.iModel, $event, item)" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                    <template v-else>
                                        <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                                    </template>
                                </template>
                            </div>
                        </template>
                    </template>
                    <!-- 显示组件，绑定相应属性 -->
                </van-form>
            </template>
        </template>
        <template v-else>
            <!-- 显示组件，绑定相应属性 -->
            <template v-for="component in icomponentList" :key="component.layout['gs-id']">
                <template v-if="!component.schema.loop">
                    <div class="layoutContainer" v-if="ieval(component.schema.renderCondition)" :id="component.layout['gs-id']" :style="calculateComponentStyle(component)">
                        <div style="display: none">{{ component }}</div>
                        <!-- 如果没有绑定页面data则取消v-model -->
                        <template v-if="component.schema.props.iModel">
                            <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandModelValue(component.schema.props.iModel)" @update:modelValue="updateModelValue(component.schema.props.iModel, $event)" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                        </template>
                        <template v-else>
                            <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event)" :iData="iData" :iStore="iStore" />
                        </template>
                    </div>
                </template>

                <template v-else>
                    <div class="layoutContainer" :id="component.layout['gs-id']" v-if="spreadLoopSource(component.schema.loopSource).find((item, xindex) => ieval(component.schema.renderCondition, item, xindex))" :style="calculateComponentStyle(component)">
                        <div style="display: none">{{ component }}</div>
                        <!-- 如果是循环组件 -->
                        <template v-for="(item, xindex) in spreadLoopSource(component.schema.loopSource)" :key="item[component.schema.loopUnikey] || xindex">
                            <!-- 如果没有绑定页面data则取消v-model -->
                            <template v-if="component.schema.props.iModel">
                                <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" :modelValue="expandItemModelValue(component.schema.props.iModel, item)" @update:modelValue="updateItemModelValue(component.schema.props.iModel, $event, item)" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                            </template>
                            <template v-else>
                                <component :ipageSetting="ipageSetting" :id="'component_' + component.layout['gs-id']" v-if="ieval(component.schema.renderCondition, item, xindex)" :is="component.schema.type" :iprops="component.schema.props" @emited="catchComponentEvent(component, $event, item, xindex)" :iData="iData" :iStore="iStore" :item="item" :xindex="xindex" />
                            </template>
                        </template>
                    </div>
                </template>
            </template>
            <!-- 显示组件，绑定相应属性 -->
        </template>
    </div>
</template>
