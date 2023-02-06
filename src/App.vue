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
// 页面的data数据
import pageDataList from "./pageDataList"

// 添加ref
let icomponentList = ref(componentList)
let icomponentLibrary = ref(componentLibrary)
let ipageDataList = ref(pageDataList)
let iData = ref({})
// 页面数据的类型
let pageDataTypes = ref([{
  value: 'Boolean',
  label: 'Boolean',
}, {
  value: 'String',
  label: 'String',
}])


/**
 * 添加全局变量 
 */
// 画布对象
let grid
let pageFunction = {}

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
  });

  //初始化拖拽元素进入画布
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

/**
 * 应用页面数据
 */
let applyPageData = () => {

  console.log("最新的pageDataList====", ipageDataList)
  dynamicDefinePageData(ipageDataList.value)

}

/**
 * 动态添加page中绑定数据
 */
let dynamicDefinePageData = pageDataList => {

  iData.value = {}

  pageDataList.forEach(item => {
    switch (item.type) {
      case "String":
        eval(`iData.value.${item.name} = "${item.default}"`)
        break;
      case "Boolean":
        eval(`iData.value.${item.name} = ${item.default}`)
        break;
    }

  })
}

/**
 * 页面数据类型改变后初始化该数据的一些字段
 */
let pageDataTypeChanged = pageData => {
  console.log('页面数据类型改变====', pageData)
  if (pageData.type == 'String') {
    pageData.default = ''
  }
  if (pageData.type == 'Boolean') {
    pageData.default = false
  }
}

/**
 * 删除页面数据
 */

let deletePageData = dataName => {
  ipageDataList.value = ipageDataList.value.filter(x => x.name != dataName)
}

/**
 * 添加页面数据
 */
let addPageData = () => {
  ipageDataList.value.push(
    {
      type: "String",
      name: `newData${(Math.random() * 100000000000).toFixed()}`,
      default: "default Data",
    }
  )
}



eval(`pageFunction.test = ()=>{console.log(iData.value.test = 111)}`)

onMounted(async () => {
  dynamicDefinePageData(pageDataList)
  initCanvas()
})

</script>

<template>
  <div class="componentLibrary">
    <template v-for="component in icomponentLibrary.list" :key="component.id">
      <div class="grid-stack-item" v-bind="component.layout" :data-ComType="component.schema.type">
        <div class="grid-stack-item-content library">
          <ion-icon :name="component.schema.icon"></ion-icon>
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
            <div @click="removeComponent(component.layout['gs-id'])" class="ui-setting-Btn" style="right:19px">
              <ion-icon name="trash-outline"></ion-icon>
            </div>
            <template v-if="component.schema.props.iModel !== undefined">
              <component :is="component.schema.type" :iprops="component.schema.props"
                v-model="iData[component.schema.props.iModel]"></component>
            </template>
            <template v-else>
              <component :is="component.schema.type" :iprops="component.schema.props"></component>
            </template>

          </div>
        </div>
      </template>
    </div>
    <div class="pageConfig">
      {{ iData }}<br />
      {{ ipageDataList }}<br />
      {{ pageDataList }}<br />
    </div>
    <!-- 浮动按钮 -->
    <div class="floatButton">
      <ion-icon name="newspaper-outline"></ion-icon>
      <span>页面Data</span>
    </div>
  </div>
  <div class="attributeBoard">
    <!-- 页面设置 -->
    <div class="pageSetting">
      <div class="title">页面Data设置</div>

      <template v-for="(pageData, index) in ipageDataList" :key="index">
        <div class="pageDataItem">

          <div class="delete" @click='deletePageData(pageData.name)'>
            <ion-icon name="close-circle-outline"></ion-icon>
          </div>

          <div class="label">属性名称：</div>
          <a-input v-model:value="pageData.name" />
          <div class="label">属性类型：</div>
          <a-select ref="select" v-model:value="pageData.type" style="width: 120px" :options="pageDataTypes"
            @change="pageDataTypeChanged(pageData)"></a-select>

          <!-- 字符串类型的配置 -->
          <template v-if="pageData.type == 'String'">
            <div class="label">初始值：</div>
            <a-input v-model:value="pageData.default" />
          </template>

          <template v-if="pageData.type == 'Boolean'">
            <div class="label">初始值：</div>
            <van-switch v-model="pageData.default" active-color="green" inactive-color="#dcdee0" style="zoom:0.8" />
          </template>
        </div>
      </template>

      <van-button icon="plus" type="primary" @click="addPageData" class="button">添加新属性</van-button>
      <van-button icon="down" type="primary" @click="applyPageData" class="button">应用到当前页面</van-button>
    </div>
  </div>
</template>
