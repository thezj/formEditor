<script setup>
import { ref, onMounted, onUpdated } from "vue"
const params = defineProps(['modelValue', "iprops"])
const $emit = defineEmits(['update:modelValue'])

// 通过传入的model值初始化本地的model
let initValue = ref(null)
onUpdated(() => {
    if (initValue.value === null && params.modelValue !== undefined) {
        initValue.value = params.modelValue
    }
})

onMounted(() => {
})


let onSearch = e => {
    console.log(e)
}

let onClickButton = () => {
    console.log(initValue.value)
}

let onClear = () => {
    console.log("清空搜索框")
}

let updateValue = inputValue => {
    $emit('update:modelValue', inputValue)
}
</script>

<template>
    <van-search v-model="initValue" show-action :label="params.iprops.label" :placeholder="params.iprops.placeholder"
        @search="onSearch" @clear="onClear" @update:model-value="updateValue">
        <template #action>
            <div @click="onClickButton">{{ params.iprops.actionButtonTxt }}</div>
        </template>
    </van-search>
</template>
