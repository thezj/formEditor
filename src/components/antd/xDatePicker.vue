<script setup>
import * as dayjs from "dayjs";
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
let initValue = ref(dayjs());

let setDateValue = () => {
    if (params.iprops.range) {
        if (params.modelValue.length) {
            initValue.value = [dayjs(params.modelValue[0]), dayjs(params.modelValue[1])];
        } else {
            initValue.value = [];
        }
    } else {
        if (params.modelValue) {
            initValue.value = dayjs(params.modelValue);
        } else {
            initValue.value = null;
        }
    }
};
setDateValue();
watch(() => params.modelValue, setDateValue);
// 更新绑定的vModel数据
let updateModelValue = (inputValue) => {
    let formatString = "YYYY-MM-DD";
    let dateValue = null;
    switch (params.iprops.showTime) {
        case "HH:mm:ss":
            formatString = "YYYY-MM-DD HH:mm:ss";
            break;
        case "HH:mm":
            formatString = "YYYY-MM-DD HH:mm";
            break;
        case "HH":
            formatString = "YYYY-MM-DD HH";
            break;
    }
    if (params.iprops.range) {
        if (inputValue) {
            dateValue = [inputValue[0].format(formatString), inputValue[1].format(formatString)];
        } else {
            dateValue = [];
        }
    } else {
        dateValue = inputValue.format(formatString);
        dateValue = dateValue == "Invalid Date" ? "" : dateValue;
    }

    $emit("update:modelValue", dateValue);
    $emit("emited", { eventName: "change", detail: dateValue });
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

let showTime = () => {
    switch (params.iprops.showTime) {
        case "HH:mm:ss":
            return { format: "HH:mm:ss" };
        case "HH:mm":
            return { format: "HH:mm" };
        case "HH":
            return { format: "HH" };

        default:
            return null;
    }
};
</script>

<template>
    <template v-if="ipageSetting.isFormPage">
        <a-form-item :label="iprops.label" :labelCol="ieval(iprops.labelCol, 'object')" :name="iprops.controlName" :rules="ieval(iprops.rules, 'array')">
            <div>
                <template v-if="params.iprops.range">
                    <a-range-picker :show-time="showTime()" class="width100" :value="initValue" @change="updateModelValue" />
                </template>
                <template v-else>
                    <a-date-picker :show-time="showTime()" class="width100" :value="initValue" @change="updateModelValue" />
                </template>
            </div>
        </a-form-item>
    </template>
    <template v-else>
        <div>
            <template v-if="params.iprops.range">
                <a-range-picker :show-time="showTime()" class="width100" :value="initValue" @change="updateModelValue" />
            </template>
            <template v-else>
                <a-date-picker :show-time="showTime()" class="width100" :value="initValue" @change="updateModelValue" />
            </template>
        </div>
    </template>
</template>
<style scoped>
.width100 {
    width: 100%;
}
</style>
