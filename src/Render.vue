<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onUpdated, watch } from "vue"

import utils from './utils';

// 添加ref
const icomponentList = ref([])
const icomponentLayoutList = ref({})
const ipageFunctionList = ref([])
const iData = ref({})
const route = useRoute();
const router = useRouter();


/**
 * 处理组件发出的事件
 */
let catchComponentEvent = (component, ievent) => {
    let componentEventHanler = component.schema.handlers[ievent.eventName]
    if (componentEventHanler) {
        let pageFunction = ipageFunctionList.value.find(f => f.name == componentEventHanler)
        if (pageFunction) {
            let functionString = pageFunction.code
            eval(`(
        ${functionString}
      )(component,ievent)`)
        }
    }
}


/**
 * 动态添加page中绑定数据
 */
let dynamicDefinePageData = pageDataList => {

    iData.value = {}

    pageDataList.forEach(item => {
        switch (item.type) {
            case "String":
                eval(`iData.value.${item.name} = "${item.default}"`)
                break;
            case "Boolean":
                eval(`iData.value.${item.name} = ${item.default}`)
                break;
        }

    })
}

/**
 * 解析组件布局
 */
let layoutArrange = () => {
    if (icomponentList.value) {
        icomponentList.value.forEach(component => {
            let style = {}
            style.top = `${component.layout['gs-y'] * 4}px`
            style.left = `${component.layout['gs-x'] / 12 * 100}%`
            style.height = `${component.layout['gs-h'] * 4}px`
            style.width = `${component.layout['gs-w'] / 12 * 100}%`
            icomponentLayoutList.value[component.layout['gs-id']] = style
        })
    }
}


/**
 * 拉取页面配置
 */
let fetchPageConfig = async () => {
    let routeQuery = route.query

    let config = await utils.ihttp.post('http://192.168.1.147:1688/ieventConfigDev', {
        "db": "smartx-tpm",
        "collection": "cfg-generic-page",
        "query": {
            "_id": routeQuery.pageId
        }
    })

    console.log("加载页面配置====", config.data)
    // 初始化data
    dynamicDefinePageData(config.data.ipageDataList)
    // 初始化function
    ipageFunctionList.value = config.data.ipageFunctionList
    // 初始化组件
    icomponentList.value = config.data.icomponentList

}

watch(route, (newRoute, oldRoute) => {
    fetchPageConfig()
})

watch(icomponentList, (newCom, oldCom) => {
    layoutArrange()
})

onMounted(async () => {
    fetchPageConfig()
})

// 暴露内部属性到template上的instance
defineExpose({
    route,
    router
})
</script>

<template>
    <div class="renderPage">
        <!-- 根据组件列表渲染出格子 -->
        <template v-for="component in icomponentList" :key="component.layout['gs-id']">
            {{ component.layout }}
            <div class="comContainer" :style="icomponentLayoutList[component.layout['gs-id']]">
                <!-- 如果没有绑定页面data则取消v-model -->
                <template v-if="component.schema.props.iModel !== undefined">
                    <component :is="component.schema.type" :iprops="component.schema.props"
                        v-model="iData[component.schema.props.iModel]" @emited="catchComponentEvent(component, $event)">
                    </component>
                </template>
                <template v-else>
                    <component :is="component.schema.type" :iprops="component.schema.props"
                        @emited="catchComponentEvent(component, $event)">
                    </component>
                </template>
            </div>
        </template>
    </div>
</template>
