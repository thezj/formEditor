<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw, defineAsyncComponent } from "vue"
const params = defineProps(["iprops", "idata"])
const $emit = defineEmits(["emited"])


let onclick = value => {
    $emit('emited', { eventName: "click", detail: value })
}

let remoteCom = `
(()=>{
  return {
    props: ['idata'],
    methods: {
    },
    data() {
      return {
      };
    },
    template: \`${params.iprops.iText}\`
  }
})()
`;
const LocalComponent = defineAsyncComponent(
    () =>
        new Promise((resolve) => {
            resolve(eval(remoteCom));
        })
);


onMounted(() => {
})

</script>

<template>
    <div v-bind="iprops" @click="onclick">
        <LocalComponent :idata='params.idata' />
    </div>
</template>
