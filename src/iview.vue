<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw, defineAsyncComponent } from "vue"
const params = defineProps(["iprops", "idata"])
const $emit = defineEmits(["emited"])


let onclick = value => {
    $emit('emited', { eventName: "click", detail: value })
}

let LocalComponent
let LocalComponentReady = ref(null)
let initLocalComponent = () => {
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
    LocalComponent = defineAsyncComponent(
        () =>
            new Promise((resolve) => {
                resolve(eval(remoteCom));
            })
    );

    LocalComponentReady.value = 1

}



watch(() => params.iprops.refreshKey, (newkey, oldkey) => {
    initLocalComponent()
})

onMounted(() => {
    initLocalComponent()
})

</script>

<template>
    <div v-bind="iprops" @click="onclick">
        <template v-if="LocalComponentReady">
            <LocalComponent :idata='params.idata' />
        </template>
    </div>
</template>
