<template>
    <div class="form-item">
        <img :src="props.modelValue || formItem.src" alt="">
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: String,
    iprops: Object,
    iData: Object
})

let formItem = props.iprops || {}
</script>

<style scoped lang="less">
.form-item {
    width: 100%;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>