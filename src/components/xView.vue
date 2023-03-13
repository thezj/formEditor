<script setup>
import { ref, onMounted, onUpdated, watch, computed, h, compile, toRaw, defineAsyncComponent } from "vue";
const params = defineProps(["modelValue", "iprops", "iData", "iStore", "item", "xindex"]);
const $emit = defineEmits(["update:modelValue", "emited"]);

// 组件内简短访问属性
let iData = computed(() => {
    return params.iData;
});
let iStore = computed(() => {
    return params.iStore;
});
let item = computed(() => {
    return params.item;
});
let index = computed(() => {
    return params.xindex;
});

let LocalComponent;
let LocalComponentReady = ref(null);
let initLocalComponent = () => {
    LocalComponentReady.value = 0;

    let remoteCom = `
    (()=>{
    return {
        props: ['iData','iStore','item','index' ],
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
    LocalComponentReady.value = 1;
};
watch(
    () => params.iprops.refreshKey,
    (newkey, oldkey) => {
        initLocalComponent();
    }
);

let onclick = (value) => {
    $emit("emited", { eventName: "click", detail: value });
};
onMounted(() => {
    initLocalComponent();
});
</script>

<template>
    <div v-bind="iprops" @click="onclick">
        <template v-if="LocalComponentReady">
            <LocalComponent :iData="params.iData" :iStore="params.iStore" :item="item" :index="index" />
        </template>
    </div>
</template>
