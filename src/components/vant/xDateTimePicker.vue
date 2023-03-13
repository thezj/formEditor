<template>
    <div>
        <van-field
            readonly clickable
            :name="formItem.controlName" :disabled="replaceVal(formItem.disabled,props.iData)"
            v-model="result" :placeholder="formItem.placeholder"
            :rules="formItem.rules" @click="initShowPicker">
            <template #label>
                <div>
                    <span class="title">{{ formItem.label }}</span>
                    <span v-if="formItem.rules && formItem.rules[0].required" style="color: red">*</span>
                </div>
            </template>
        </van-field>
        <van-popup v-model:show="showPicker" position="bottom" get-container="#app" @click-overlay="showPicker = false">
            <van-picker-group
                :title="formItem.label"
                :tabs="['选择日期', '选择时间']"
                next-step-text="下一步"
                @confirm="onConfirm"
                @cancel="showPicker = false"
            >
                <van-date-picker
                    v-model="currentDate"
                    :min-date="minDate"
                    :max-date="maxDate"
                />
                <van-time-picker v-model="currentTime" :filter="timeFilter" />
            </van-picker-group>
        </van-popup>
    </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import { replaceVal } from "../../utils/validate";
const props = defineProps({
    modelValue: String,
    iprops: Object,
    iData: Object
})

const $emits = defineEmits(['emited', 'update:modelValue'])
// 获取上下文
const { proxy } = getCurrentInstance()

// 基本参数
let formItem = props.iprops || {
    controlName: 'test',
    label: '选择日期',
    placeholder: '选择日期',
    rules: [{ required: true, message: '选择日期' }]
}

const showPicker = ref(false)
const result = ref(props.modelValue || '')
const currentDate = ref([]);    // 选中的日期
const currentTime = ref([]);    // 选中的时间
const minDate = new Date()
const maxDate = new Date(new Date().getFullYear() + 1, new Date().getMonth(), 1)

const initShowPicker = () => {
    let dateTime = proxy.moment(props.modelValue || new Date()).format("YYYY/MM/DD HH:mm")
    currentDate.value = dateTime.split(" ")[0].split("/")
    currentTime.value = dateTime.split(" ")[1].split(":")
    showPicker.value = true
}

const onConfirm = () => {
    result.value = `${currentDate.value.join('/')} ${currentTime.value.join(':')}`
    showPicker.value = false
    $emits('update:modelValue', result.value)
    $emits('emited', {eventName: "change", value: result.value})
};

// 时间格式化，间隔10分钟
const timeFilter = (type, options) => {
    if (type === 'minute') {
        return options.filter((option) => Number(option.value) % 10 === 0);
    }
    return options;
};


</script>

<style scoped>

</style>