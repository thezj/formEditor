<script setup>
import { ref } from "vue"
import * as monaco from 'monaco-editor'

// 引入渲染组件
import render from "@/App.vue";

// 可用组件
let components = [{
    type: "input",
    title: "输入框",
    icon: "terminal-outline"
}, {
    type: "picker",
    title: "下拉框",
    icon: "reorder-four-outline"
}]
let componentsRef = ref(components)


// 开始拖拽
let drag = event => {
    console.log("开始拖拽组件====", event)
}

// handel submit
let onSubmit = e => {
}

// init jsonEditor
setTimeout(() => {
    monaco.editor.create(document.getElementById('jsoneditor'), {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: 'javascript',
        theme: 'vs-dark',
        minimap: {
            enabled: false
        }
    });
}, 10);

</script>

<template>
    <div class="formEditor">
        <div class="component">
            <div v-for="com in componentsRef" :key="com.id" class="com" draggable="true" @dragstart="drag(com)">
                <ion-icon :name="com.icon"></ion-icon>
                <span>{{ com.title }}</span>
            </div>
        </div>
        <div class="formShow">
            <div style="bg">
                <img src="./phonebg.jpg" alt="">
            </div>
            <div class="form">
                <render @submit="onSubmit"></render>
            </div>
        </div>
        <div class="attribute" id="jsoneditor" style="height:720px">
        </div>
    </div>
</template>
