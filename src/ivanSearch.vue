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
</script>

<template>
    <van-search v-model="value" show-action :label="params.props.label" :placeholder="params.props.placeholder"
        @search="onSearch">
        <template #action>
            <div @click="onClickButton">{{ params.props.actionButtonTxt }}</div>
        </template>
    </van-search>
</template>
