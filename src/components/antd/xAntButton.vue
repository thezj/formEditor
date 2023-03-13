<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw, defineAsyncComponent } from "vue";
/**
 * 计算属性值
 */
import cUtile from "@/utils/cUtile";
let ieval = (expression, needType) => {
    return eval(cUtile.ieval);
};
const params = defineProps(["modelValue", "ipageSetting", "iprops", "iData", "iStore", "item", "xindex"]);
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

let handleChange = (value) => {
    $emit("update:modelValue", value);
};

// 组件内简短访问属性
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
    <a-button class="width100" :htmlType="iprops.htmlType" :type="iprops.type" :size="iprops.size" @click="$emit('emited', { eventName: 'click' })">{{ ieval(iprops.label) }}</a-button>
</template>

<style scoped>
.width100 {
    width: 100%;
}
</style>
