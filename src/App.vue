<script setup>
import { ref, onMounted } from "vue"

// 布局插件
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import utils from './utils';


// 序列化的组件库
import componentLibrary from "./componentLibrary"
// 序列化的组件数据
import componentList from "./componentList"

// 添加ref
let icomponentList = ref(componentList)
let icomponentLibrary = ref(componentLibrary)

/**
 * 添加全局变量 
 */
// 画布对象
let grid

/**
 * 初始化画布
 */
let initCanvas = () => {

  // 记录当前拖拽组件
  let currentDraggedComponent


  // 初始化grid
  let gridOptions = {
    // 画布自动变高
    float: true,
    // Accept widgets dragged from other grids or from outside 
    acceptWidgets: true,
    // 单元高度
    cellHeight: 80,
    // 单元格间隔大小
    margin: 10,
    //栅格大小
    column: 12,
    // 禁止整体宽度小于minW时column变成1
    disableOneColumnMode: true
  }

  // 设置可拖拽到布局的div

  grid = GridStack.init(gridOptions, ".formRender");

  /**
   * 画布事件绑定
   */

  // 新添加元素信息
  grid.on('added', function (e) {
    let layoutInfo = e.detail[0]
    // 排除已经具备id的元素
    let isExist = layoutInfo.id
    if (!isExist) {

      grid.removeWidget(layoutInfo.el);
      // 添加组件到现有组件列表
      let currentCom = icomponentLibrary.value.getComponentByType(currentDraggedComponent)
      console.log("新添加的元素信息====", layoutInfo, currentCom)
      // 添加布局信息
      currentCom.layout['gs-id'] = `com${(Math.random() * 10000000000000).toFixed()}`
      currentCom.layout['gs-x'] = layoutInfo.x
      currentCom.layout['gs-y'] = layoutInfo.y
      icomponentList.value.push(currentCom)
      setTimeout(() => {
        let addedDom = document.querySelector(`[gs-id=${currentCom.layout['gs-id']}]`)
        grid.makeWidget(addedDom);
      }, 10);
    }
  });

  // 删除元素信息
  grid.on('removed', function (e) {
    console.log("删除元素====", e);
    let layoutInfo = e.detail[0]
    icomponentList.value = icomponentList.value.filter(x => x.layout['gs-id'] != layoutInfo.id)
    setTimeout(() => {
      console.log(icomponentList)
    }, 10);
  });

  GridStack.setupDragIn(
    '.componentLibrary .grid-stack-item',
    {
      handle: '.grid-stack-item-content',
      appendTo: 'body',
      // 拖动时显示的dom
      helper: function (event) {
        return utils.getParentNode(event.target, 'grid-stack-item-content').parentElement.cloneNode(true);
      },
      // 开始拖拽的元素
      start: function (event) {
        console.log("开始拖拽组件====", event);
        currentDraggedComponent = event.target.dataset.comtype
      }
    }
  );
}

/**
 * 移除组件
 */
let removeComponent = gsid => {
  let removeDom = document.querySelector(`[gs-id=${gsid}]`)
  grid.removeWidget(removeDom);
}

onMounted(() => {
  initCanvas()
})

</script>

<template>
  <div class="componentLibrary">
    <template v-for="component in icomponentLibrary.list" :key="component.id">
      <div class="grid-stack-item" v-bind="component.layout" :data-ComType="component.schema.type">
        <div class="grid-stack-item-content library">
          <ion-icon name="settings-outline"></ion-icon>
          <p>{{ component.schema.describe }}</p>
        </div>
      </div>
    </template>
  </div>
  <div class="formRenderContainer">
    <div class="formRender">
      <!-- 根据组件列表渲染出格子 -->
      <template v-for="component in icomponentList" :key="component.layout['gs-id']">
        <div class="grid-stack-item" v-bind="component.layout">
          <div class="grid-stack-item-content">
            <div class="ui-setting-Btn" style="right:-1px"><ion-icon name="settings-outline"></ion-icon></div>
            <div @click="removeComponent(component.layout['gs-id'])" class="ui-setting-Btn" style="right:15px">
              <ion-icon name="trash-outline"></ion-icon>
            </div>
            <component :is="component.schema.type" :props="component.schema.props"></component>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
