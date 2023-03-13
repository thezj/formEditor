<script setup>
import { ref, createApp, defineAsyncComponent, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
    <render :key="route.query.pageId" :iprops="{ applicationId: route.query.pageId, pageId: route.query.pageId }"></render>
</template>
