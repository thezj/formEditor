<script setup>
import { ref } from 'vue';
import { useRoute} from 'vue-router'
const route = useRoute();

let  a = ref(2)

</script>

<template>
    <render :iprops="{ pageId: route.query.pageId }" style="height:500px;width:600px"></render>
</template>
