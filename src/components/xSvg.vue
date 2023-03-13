<template>
    <svg :style="{width: size / 100 + 'rem', height: size / 100 + 'rem'}" aria-hidden="true">
        <use :fill="color" :xlink:href="'#' + name"></use>
    </svg>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        default: ""
    },
    size: {
        type: Number,
        default: 20
    },
    color: {
        type: String,
        default: "#90939A"
    }
});
</script>

<style scoped>

</style>