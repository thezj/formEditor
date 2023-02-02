<script setup>
import { ref, onMounted } from "vue"
const params = defineProps(['props'])
onMounted(() => {
})
let onchange = e => {
      console.log(e)
}
const checked = ref(params.props.checked)
</script>

<template>
      <van-checkbox v-model="checked" @change="onchange">{{ params.props.lable }}</van-checkbox>
</template>
