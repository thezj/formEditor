<template>
    <div>
        <van-field
            readonly
            clickable
            :name="formItem.controlName" :disabled="replaceVal(formItem.disabled,props.iData)"
            v-model="result" :placeholder="formItem.placeholder"
            :rules="formItem.rules" @click="initShowPicker"
        >
            <template #label>
                <div>
                    <span class="title">{{ formItem.label }}</span>
                    <span v-if="formItem.rules && formItem.rules[0].required" style="color: red">*</span>
                </div>
            </template>
        </van-field>
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
                :columns="columns"
                @confirm="onConfirm"
                :columns-field-names="formItem.fieldNames || defaultFieldName"
                @cancel="showPicker = false"
            />
        </van-popup>
    </div>
</template>

<script setup>
import { replaceVal } from "../../utils/validate";
import {ref, reactive, getCurrentInstance} from 'vue';
const props = defineProps({
    modelValue: [String,Number],
    iprops: Object,
    iData: Object
})
const { proxy } = getCurrentInstance()

const $emits = defineEmits(['emited', 'update:modelValue'])

// 基本参数
let formItem = props.iprops || {}

const result = ref('');
const showPicker = ref(false);
const columns = ref([])
const defaultFieldName = reactive({ text: 'text', value: 'value', children: 'children' })

const onConfirm = ({selectedOptions}) => {
    result.value = selectedOptions[0]?.text;
    showPicker.value = false;
    $emits('update:modelValue', result.value)
    $emits('emited', {eventName: "change", value: result.value})
};

let initShowPicker = async () => {
    if(!replaceVal(formItem.disabled)) return false
    showPicker.value = true;
    let resource = [];
    if (formItem.options.length) {
        resource = formItem.options;
    } else {
        let action = formItem.method == "GET" ? "Get" : "Post";
        if (formItem.expr) {
            let context = props.iData || {};
            try {
                eval(formItem.expr);
            } catch (error) {
                console.log("执行picker表单项表达式", error, formItem.expr);
            }
        }
        let res = await proxy.$service[action](formItem.url, formItem.params);
        if (res && res.success && res.content) {
            if (formItem.dataContentPath) {
                try {
                    resource = eval("res." + formItem.dataContentPath);
                } catch (error) {
                    console.log(error);
                }
            } else {
                resource = res.content.options;
            }
            if (resource.length) {
                resource.map((item, index) => {
                    if (item.children && item.children.length == 0) {
                        item.children = null;
                    }
                });
            }
            columns.value = resource || [];
        }
    }
}


</script>

<style scoped>

</style>