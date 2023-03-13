<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
const params = defineProps(["modelValue", "iprops"]);
const $emit = defineEmits(["update:modelValue", "emited"]);

let initValue = ref(null);
initValue.value = params.modelValue;
watch(
    () => params.modelValue,
    () => {
        console.log("更新", params.modelValue);
        initValue.value = params.modelValue;
    }
);
let onchange = (value) => {
    $emit("update:modelValue", value);
    $emit("emited", { eventName: "change", detail: value });
};

onMounted(() => {});
</script>

<template>
    <van-stepper v-model="initValue" @change="onchange" :theme="iprops.theme" :min="iprops.min" :max="iprops.max" />
</template>
