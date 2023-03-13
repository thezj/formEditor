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
// 更新绑定的vModel数据
let updateModelValue = (inputValue) => {
    inputValue = inputValue.target.value;
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
    <template v-if="ipageSetting.isFormPage">
        <a-form-item :label="iprops.label" :labelCol="ieval(iprops.labelCol, 'object')" :wrapperCol="ieval(iprops.wrapperCol, 'object')" :name="iprops.controlName" :rules="ieval(iprops.rules, 'array')">
            <template v-if="iprops.rowSize == 1">
                <a-input show-count :maxlength="iprops.maxlength" :value="initValue" @change="updateModelValue" :placeholder="iprops.placeholder" />
            </template>
            <template v-else>
                <a-textarea show-count :maxlength="iprops.maxlength" :auto-size="{ minRows: iprops.rowSize, maxRows: iprops.rowSize }" :value="initValue" @change="updateModelValue" :placeholder="iprops.placeholder" />
            </template>
        </a-form-item>
    </template>
    <template v-else>
        <template v-if="iprops.rowSize == 1">
            <a-input class="width100" show-count :maxlength="iprops.maxlength" :value="initValue" @change="updateModelValue" :placeholder="iprops.placeholder" />
        </template>
        <template v-else>
            <a-textarea class="width100" show-count :maxlength="iprops.maxlength" :auto-size="{ minRows: iprops.rowSize, maxRows: iprops.rowSize }" :value="initValue" @change="updateModelValue" :placeholder="iprops.placeholder" />
        </template>
    </template>
</template>
<style scoped>
.width100 {
    width: 100%;
}
</style>
