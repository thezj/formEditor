<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile } from "vue"
import * as Vue from "vue"
const params = defineProps(["iprops", "idata"])
const $emit = defineEmits(["emited"])


let onclick = value => {
    $emit('emited', { eventName: "click", detail: value })
}
let idata = params.idata

let renderInnerText = () => {

    let _Vue = Vue
    let template = `${params.iprops.iText}`
    let renderfunc = `${compile(template)}`
    renderfunc = renderfunc.substring(50)
    renderfunc = renderfunc.substring(0, renderfunc.length - 3)

    let evalResult = eval(`(()=>{
           return function render(_ctx, _cache) {
                try {
                    ${renderfunc}
                } catch (error) {
                    console.log(error)
                    return null
                }
            }
         })()`)

    console.log(renderfunc)


    return h(evalResult)
}

onMounted(() => {
})

</script>

<template>
    <div v-bind="iprops" @click="onclick">
        <renderInnerText></renderInnerText>
    </div>
</template>
