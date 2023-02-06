<script setup>
import { ref, onMounted, onUpdated } from "vue"
const params = defineProps(['modelValue', "iprops"])
const $emit = defineEmits(['update:modelValue'])

let initValue = ref(null)

onMounted(() => {
})
onUpdated(() => {
      if (initValue.value === null && params.modelValue !== undefined) {
            initValue.value = params.modelValue
      }
})
let onchange = checkState => {
      $emit('update:modelValue', checkState)
}

</script>

<template>
      <van-checkbox v-model="initValue" @change="onchange">{{ iprops.lable }}</van-checkbox>
</template>
