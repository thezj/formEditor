<script setup>
import { onMounted } from "vue"
const params = defineProps(["iprops"])
const $emit = defineEmits(['emited'])

onMounted(() => {
})

</script>

<template>
    <van-button :type="iprops.type" :size="iprops.size" @click="$emit('emited', { eventName: 'click' })">{{ iprops.label }}</van-button>
</template>
