<template>
    <div class="applicationItem" @click="applicationClick" v-if="formItem.visible">
        <div class="itemSvg" :style="{ background: formItem.background }">
            <xSvg :name="formItem.icon" :color="formItem.color" />
        </div>
        <div class="itemDesc">{{ formItem.name }}</div>
    </div>
</template>

<script setup>
import xSvg from '../xSvg.vue'
import { useRoute } from 'vue-router'
import generic from "../../utils/generic";

const props = defineProps({
    modelValue: [String,Number],
    iprops: Object,
    iData: Object
})
const $emits = defineEmits(['emited'])

let _data = props.iprops || {}
let route = useRoute()
// 设置需要替换的字段的路径
_data.replaceEvalPath = [
    'visible'
]
// 数据源
let context = Object.assign(props.iData || {}, route.query)
let formItem = generic.replaceEvalObject(_data,context)

const applicationClick = () => {
    $emits('emited', { type: 'click', value: formItem })
}

</script>

<style scoped lang="less">
.applicationItem {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.15rem;
    .itemSvg {
        width: 0.5rem;
        height: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        position: relative;
    }
    .itemDesc {
        margin-top: 0.05rem;
        font-size: 0.12rem;
    }
}
</style>