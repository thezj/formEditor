<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
const params = defineProps(["modelValue", "iprops"]);
const $emit = defineEmits(["update:modelValue", "emited"]);

// 绑定传入组件的modelValue
let initValue = ref(null);
initValue.value = params.modelValue;
watch(
    () => params.modelValue,
    () => {
        initValue.value = params.modelValue;
    }
);

let updateValue = (inputValue) => {
    $emit("update:modelValue", inputValue);
};

let onClickButton = () => {
    $emit("emited", { eventName: "search", detail: initValue.value });
};

let onClear = () => {
    console.log("清空搜索框");
};

onMounted(() => {});
</script>

<template>
    <van-search v-model="initValue" show-action :label="params.iprops.label" :placeholder="params.iprops.placeholder" @clear="onClear" @update:model-value="updateValue">
        <template #action>
            <div @click="onClickButton">{{ params.iprops.actionButtonTxt }}</div>
        </template>
    </van-search>
</template>
