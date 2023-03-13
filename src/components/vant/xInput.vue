<template>
    <div class="form-item">
        <van-field :readonly="replaceVal(formItem.readonly,props.iData)"
                   :disabled="replaceVal(formItem.disabled,props.iData)"
                   :type="formItem.type" rows="1" autosize v-model="imodelValue"
                   @input="inputChange" :name="formItem.controlName" :maxlength="formItem.maxlength || null"
                   :formatter="formatter" :placeholder="formItem.placeholder" :rules="formItem.rules" show-word-limit>
            <template #label>
                <div>
                    <span class="title">{{ formItem.label }}</span>
                    <span v-if="formItem.rules && formItem.rules[0].required" style="color: red">*</span>
                </div>
            </template>
        </van-field>
    </div>
</template>

<script setup>
import {Field} from "vant";
import { replaceVal } from "../../utils/validate";
import {ref, watch, onUpdated} from "vue";
const props = defineProps({
    modelValue: [String, Number],
    iprops: Object,
    idata: Object,
});
const $emits = defineEmits(["update:modelValue", "emited"]);

let imodelValue = ref(null);

// props is readonly can not with v-model instruct
watch(
    () => props.modelValue,
    () => {
        imodelValue.value = props.modelValue;
    }
);

// 基本参数
let formItem = props.iprops || {};

// 执行formatter表达式
let formatter = (value) => {
    if (formItem.formatterExpr) {
        let _RegExp = new RegExp(formItem.formatterExpr, "g");
        return value.replace(_RegExp, "");
    } else {
        return value.trim();
    }
};


let inputChange = (e) => {
    $emits("update:modelValue", e.target.value);
    $emits("emited", {eventName: "change", value: e});
};
</script>

<style scoped lang="less">
@import "../../assets/formItem.less";
</style>
