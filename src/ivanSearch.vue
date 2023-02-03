<script setup>
import { ref, onMounted } from "vue"
const params = defineProps(['props'])

const value = ref(params.props.value)

onMounted(() => {
})


let onSearch = e => {
    console.log(e)
}

let onClickButton = () => {
    console.log(value.value)
}

let onClear = ()=>{
    console.log("清空搜索框")
}
</script>

<template>
    <van-search v-model="value" show-action :label="params.props.label" :placeholder="params.props.placeholder"
        @search="onSearch"
        @clear="onClear">
        <template #action>
            <div @click="onClickButton">{{ params.props.actionButtonTxt }}</div>
        </template>
    </van-search>
</template>
