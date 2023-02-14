<script setup>
import { ref, createApp, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();
</script>

<template>
    <render :iprops="{ pageId: route.query.pageId }" style="height:500px;width:600px"></render>
</template>
