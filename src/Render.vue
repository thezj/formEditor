<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from "vue"

import utils from './utils';

// 添加ref
const iutils = ref(utils)
const icomponentList = ref([])
const ipageDataList = ref([])
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
 * 拉取页面配置
 */
let fetchPageConfig = () => {
    console.log(route)
}

watch(route, (newRoute, oldRoute) => {
    console.log(newRoute, oldRoute)
})

onMounted(async () => {
    fetchPageConfig()
    dynamicDefinePageData(ipageDataList.value)
})

defineExpose({
    route,
    router
})
</script>

<template>
    <div class="renderPage">
        {{ route.query }}
        <!-- 根据组件列表渲染出格子 -->
        <template v-for="component in icomponentList" :key="component.layout['gs-id']">
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

        </template>
    </div>
</template>
