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
    onClickButton(inputValue);
};

// change event
let onClickButton = (inputValue) => {
    $emit("emited", { eventName: "change", detail: inputValue });
};
</script>

<template>
    <template v-if="ipageSetting.isFormPage">
        <a-form-item :label="iprops.label" :labelCol="ieval(iprops.labelCol, 'object')" :name="iprops.controlName" :rules="ieval(iprops.rules, 'array')">
            <a-cascader class="width100" :options="ieval(iprops.options, 'array')" :value="initValue" @change="updateModelValue" />
        </a-form-item>
    </template>
    <template v-else>
        <a-cascader class="width100" :options="ieval(iprops.options, 'array')" :value="initValue" @change="updateModelValue" />
    </template>
</template>
<style scoped>
.width100 {
    width: 100%;
}
</style>
