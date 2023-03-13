<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw, defineAsyncComponent } from "vue";
/**
 * 计算属性值
 */
import cUtile from "@/utils/cUtile";
let ieval = (expression, needType) => {
    return eval(cUtile.ieval);
};
const params = defineProps(["modelValue", "iprops", "iData", "iStore", "item", "xindex"]);
const $emit = defineEmits(["update:modelValue", "emited"]);

let iData = computed(() => {
    return params.iData;
});
let iStore = computed(() => {
    return params.iStore;
});
let item = computed(() => {
    return params.item;
});
let index = computed(() => {
    return params.xindex;
});


onMounted(() => {});
</script>

<template>
    <van-button :type="iprops.type" :native-type="iprops.nativeType" :size="iprops.size" @click="$emit('emited', { eventName: 'click' })">{{ ieval(iprops.label) }}</van-button>
</template>
