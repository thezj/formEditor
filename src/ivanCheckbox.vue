<script setup>
import { ref, onMounted, onUpdated, watch } from "vue"
const params = defineProps(['modelValue', "iprops"])
const $emit = defineEmits(['update:modelValue'])


let initValue = ref(null)
onUpdated(() => {
      if (params.modelValue !== undefined) {
            initValue.value = params.modelValue
      }
})
let onchange = checkState => {
      $emit('update:modelValue', checkState)
}


onMounted(() => {
})

</script>

<template>


      
      <van-checkbox v-model="initValue" @change="onchange">{{ iprops.label }}</van-checkbox>
</template>
