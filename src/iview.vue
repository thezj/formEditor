<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw } from "vue"
const params = defineProps(["iprops", "idata"])
const $emit = defineEmits(["emited"])


let onclick = value => {
    $emit('emited', { eventName: "click", detail: value })
}
let idata = params.idata

onUpdated(() => {
    if (params.idata !== undefined) {
        idata = params.idata
    }
})
let renderInnerText = () => {
    let template = `${params.iprops.iText}`
    // 匹配出本地变量的值
    let expressions = [...template.matchAll(/{{[^{}]*}}/g)]
    expressions.forEach(expMatched => {
        let expString = expMatched[0]
        let expValue
        try {
            expValue = eval(expString.substring(2, expString.length - 2))
        } catch (error) {
            expValue = ""
        }
        template = template.replace(expString, expValue)
    })

    if (`${compile(template)}`.includes('_resolveComponent')) {
        return h()
    } else {
        return h(compile(template))
    }

}

onMounted(() => {
})

</script>

<template>
    <div v-bind="iprops" @click="onclick">
        <renderInnerText :key="JSON.stringify(params.idata)"></renderInnerText>
    </div>
</template>
