<script setup>
import { ref, onMounted, onUpdated } from "vue"
const params = defineProps(['modelValue', "iprops"])
const $emit = defineEmits(['update:modelValue', 'emited'])

let initValue = ref(null)
onUpdated(() => {
    if (params.modelValue !== undefined) {
        initValue.value = params.modelValue
    }
})
let updateValue = inputValue => {
    $emit('update:modelValue', inputValue)
}


let onSearch = e => {
    console.log(e)
}

let onClickButton = () => {
    // 向外传递标准事件
    $emit('emited', { eventName: "search", detail: initValue.value })
}

let onClear = () => {
    console.log("清空搜索框")
}


onMounted(() => {
})
</script>

<template>
    <van-search v-model="initValue" show-action :label="params.iprops.label" :placeholder="params.iprops.placeholder"
        @search="onSearch" @clear="onClear" @update:model-value="updateValue">
        <template #action>
            <div @click="onClickButton">{{ params.iprops.actionButtonTxt }}</div>
        </template>
    </van-search>
</template>
