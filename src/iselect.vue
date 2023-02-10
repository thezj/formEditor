<script setup>
import { ref, onMounted, onUpdated, watch } from "vue"
const params = defineProps(['modelValue', "iprops"])
const $emit = defineEmits(['update:modelValue', "emited"])


let handleChange = value => {
    console.log(value)
    $emit('update:modelValue', value)
}

onMounted(() => {
})

</script>

<template>
    <a-select 
    v-model:value="params.modelValue"
    mode="multiple"
    :style="params.iprops.style"
    :placeholder="params.iprops.placeholder" 
    :options="options1" 
    @change="handleChange">
    </a-select>
</template>
