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

// 绑定传入组件的modelValue
let initValue = ref(null);
initValue.value = params.modelValue;
watch(
    () => params.modelValue,
    () => {
        initValue.value = params.modelValue;
    }
);
// 更新绑定的vModel数据
let updateModelValue = (inputValue) => {
    $emit("update:modelValue", inputValue);
    $emit("emited", { eventName: "change", detail: inputValue });
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

</script>

<template>
    <input class="width100" :value="initValue" @input="updateModelValue($event.target.value)" />
</template>
<style scoped>
.width100 {
    width: 100%;
}
</style>
