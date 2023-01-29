
// 添加图标库
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
document.head.appendChild(script);


import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);


import { createApp } from 'vue'
import './style.less'
import router from './router'

let ccApp = createApp({ template: '<router-view></router-view>' })
ccApp.use(router)
ccApp.mount('#app')
window.ccApp = ccApp
