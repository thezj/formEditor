<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
const params = defineProps(["modelValue", "iprops"]);
const $emit = defineEmits(["update:modelValue"]);

let initValue = ref(null);
initValue.value = params.modelValue;
watch(
    () => params.modelValue,
    () => {
        console.log("更新", params.modelValue);
        initValue.value = params.modelValue;
    }
);
let onchange = (checkState) => {
    $emit("update:modelValue", checkState);
};

onMounted(() => {});
</script>

<template>
    <van-checkbox v-model="initValue" @change="onchange">{{ iprops.label }}</van-checkbox>
</template>
