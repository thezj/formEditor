<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted,toRaw } from "vue"

// 布局插件
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import utils from './utils';



// 序列化的组件库
import componentLibrary from "./componentLibrary"

// 添加ref
let icomponentLibrary = ref(componentLibrary)
let icomponentList = ref([])
let ipageDataList = ref([])
let ipageFunctionList = ref([])
let iData = ref({})
let settingMode = ref("pageData")
let currentSettingComponent = ref(null)
let codeEditorContainer = ref(false)
let currentSettingFunction = ref(null)
const route = useRoute();
const router = useRouter();
let ipageConfig


/**
 * 添加全局变量 
 */
// 画布对象
let grid
let monacoEditor

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
    cellHeight: 4,
    // 单元格间隔大小
    margin: 4,
    // 栅格大小
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

  // 如果当前正在设置component,则显示pageData
  if (settingMode.value == "com") {
    if (currentSettingComponent.value.layout['gs-id'] == gsid) {
      settingMode.value = "pageData"
      currentSettingComponent.value = null
    }
  }
}

/**
 * 组件设置
 */
let settingComponent = com => {
  settingMode.value = "com"
  currentSettingComponent.value = com
}

/**
 * 组件 map layout
 */
let serializeComponentList = () => {
  let itemsLayout = grid.getGridItems().map(x => x.gridstackNode)
  itemsLayout.forEach(layout => {
    let item = icomponentList.value.find(x => x.layout['gs-id'] == layout.id)
    item.layout['gs-x'] = layout.x
    item.layout['gs-y'] = layout.y
    item.layout['gs-h'] = layout.h
    item.layout['gs-w'] = layout.w
  })
  return icomponentList
}

/**
 * 处理组件发出的事件
 */
let catchComponentEvent = (component, ievent) => {
  let componentEventHanler = component.schema.handlers[ievent.eventName]
  if (componentEventHanler) {
    let pageFunction = ipageFunctionList.value.find(f => f.name == componentEventHanler)
    if (pageFunction) {
      let functionString = pageFunction.code
      eval(`(
        ${functionString}
      )(component,ievent)`)
    }
  }
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
      case "Array":
        eval(`iData.value.${item.name} = ${toRaw(item.default)}`)
        break;
      default:
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
  if (pageData.type == 'Number') {
    pageData.default = 1
  }
  if (pageData.type == 'Array') {
    pageData.default = []
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

/**
 * 添加页面方法
 */
let addPageFunction = () => {
  let newFunction = {
    name: `fun${(Math.random() * 10000000000000).toFixed()}`,
    code: `(param)=>{}`
  }

  ipageFunctionList.value.push(newFunction)
}

/**
 * monaco编辑方法
 */
let openCodeWithMonaco = ifunction => {
  currentSettingFunction.value = ifunction
  // 打开monaco容器
  codeEditorContainer.value = true
}

/**
 * 初始化monaco
 */
let initcodeEditor = () => {

  let editorContainer = document.querySelector('#monacoContainer')

  if (codeEditorContainer.value) {

    // 初始化monaco
    if (!monacoEditor && editorContainer) {
      monacoEditor = monaco.editor.create(editorContainer, {
        value: currentSettingFunction.value.code,
        language: 'javascript',
        theme: 'vs-dark'
      });

      monacoEditor.onDidChangeModelContent(changeEvent => {
        if (changeEvent.isFlush == false) {
          currentSettingFunction.value.code = monacoEditor.getValue()
        }
      });
    }

    // 重置code
    if (monacoEditor && editorContainer) {
      monacoEditor.setValue(currentSettingFunction.value.code)
    }
    setTimeout(() => {
      monacoEditor.trigger("editor", "editor.action.formatDocument");
    }, 10);

  } else {
    if (monacoEditor && editorContainer) {
      monacoEditor.setValue("")
    }
  }
}


/**
 * 删除页面数据
 */
let deletePageFunction = ifunction => {
  ipageFunctionList.value = ipageFunctionList.value.filter(x => x.name != ifunction)
}

/**
 * 保存页面
 */
let savePage = async () => {

  if (ipageConfig) {

    let pageConfig = {
      ipageDataList: ipageDataList.value,
      ipageFunctionList: ipageFunctionList.value,
      icomponentList: serializeComponentList().value
    }
    let query = {
      "db": "smartx-tpm",
      "collection": "cfg-generic-page",
      "query": { _id: ipageConfig._id },
      "document": pageConfig
    }
    let config = await utils.ihttp.post('http://192.168.1.147:1688/cfgGenericPageUpdate', query)
    if (config?.data?.acknowledged) {
      utils.message.success('保存配置成功')
      console.log("保存页面配置成功====", config?.data)
    }

  } else {

    let pageConfig = {
      ipageDataList: ipageDataList.value,
      ipageFunctionList: ipageFunctionList.value,
      icomponentList: serializeComponentList().value
    }
    let query = {
      "db": "smartx-tpm",
      "collection": "cfg-generic-page",
      "document": pageConfig
    }
    let config = await utils.ihttp.post('http://192.168.1.147:1688/cfgGenericPageInsertOne', query)
    if (config?.data?.insertedId) {
      utils.message.success('保存配置成功')
      console.log("插入页面配置成功====", config?.data?.insertedId)
    }

  }
}

let fetchPageConfig = async () => {
  let routeQuery = route.query

  if (routeQuery.pageId) {
    let config = await utils.ihttp.post('http://192.168.1.147:1688/ieventConfigDev', {
      "db": "smartx-tpm",
      "collection": "cfg-generic-page",
      "query": {
        "_id": routeQuery.pageId
      }
    })
    console.log("加载页面配置====", config.data)
    ipageConfig = config.data

    // 初始化data
    dynamicDefinePageData(config.data.ipageDataList)
    ipageDataList.value = config.data.ipageDataList
    // 初始化function
    ipageFunctionList.value = config.data.ipageFunctionList
    // 初始化组件
    icomponentList.value = config.data.icomponentList
  }
  setTimeout(() => {
    initCanvas()
  }, 100);

}


onMounted(async () => {
  fetchPageConfig()
})

</script>

<template>
  <div class="componentLibrary">
    <template v-for="(component, index) in icomponentLibrary.list" :key="index">
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
            <div @click="settingComponent(component)" class="ui-setting-Btn" style="right:-1px">
              <ion-icon name="settings-outline"></ion-icon>
            </div>
            <div @click="removeComponent(component.layout['gs-id'])" class="ui-setting-Btn" style="right:19px">
              <ion-icon name="trash-outline"></ion-icon>
            </div>

            <!-- 如果没有绑定页面data则取消v-model -->
            <template v-if="component.schema.props.iModel !== undefined">
              <component :is="component.schema.type" :iprops="component.schema.props"
                v-model="iData[component.schema.props.iModel]" @emited="catchComponentEvent(component, $event)" :idata="iData">
              </component>
            </template>
            <template v-else>
              <component :is="component.schema.type" :iprops="component.schema.props"
                @emited="catchComponentEvent(component, $event)" :idata="iData">
              </component>
            </template>

          </div>
        </div>
      </template>
    </div>
    <div class="pageConfig">
      -----------页面Data-----------
      <pre>{{ iData }}</pre>
      <pre>{{ ipageDataList }}</pre>

      -----------页面function-----------
      <pre>{{ ipageFunctionList }}</pre>

      -----------页面Component-----------
      <pre>{{ icomponentList }}</pre>
    </div>
    <!-- 浮动按钮 -->
    <div class="floatButton" @click="settingMode = 'pageData'">
      <ion-icon name="newspaper-outline"></ion-icon>
      <span>页面Data</span>
    </div>

    <div class="floatButton" @click="settingMode = 'pageFunction'" style="left:115px">
      <ion-icon name="terminal-outline"></ion-icon>
      <span>页面Function</span>
    </div>

    <div class="floatButton" @click="savePage" style="left:220px">
      <ion-icon name="save-outline"></ion-icon>
      <span>保存页面</span>
    </div>
  </div>
  <div class="attributeBoard">
    <!-- 页面设置 -->
    <div v-if="settingMode == 'pageData'" class="pageSetting">
      <div class="title">页面Data设置</div>

      <template v-for="(pageData, index) in ipageDataList" :key="index">
        <div class="pageDataItem">

          <div class="delete" @click='deletePageData(pageData.name)'>
            <ion-icon name="close-circle-outline"></ion-icon>
          </div>

          <div class="label">属性名称：</div>
          <a-input v-model:value="pageData.name" />
          <div class="label">属性类型：</div>
          <a-select ref="select" v-model:value="pageData.type" style="width: 120px" :options="[{
            value: 'Boolean',
            label: 'Boolean',
          }, {
            value: 'String',
            label: 'String',
          }, {
            value: 'Number',
            label: 'Number',
          }, {
            value: 'Array',
            label: 'Array',
          }]" @change="pageDataTypeChanged(pageData)"></a-select>

          <!-- 字符串类型的配置 -->
          <template v-if="pageData.type == 'String'">
            <div class="label">初始值：</div>
            <a-input v-model:value="pageData.default" />
          </template>

          <!-- 字符串类型的配置 -->
          <template v-if="pageData.type == 'Number'">
            <div class="label">初始值：</div>
            <a-input-number style="width:100%" v-model:value="pageData.default" />
          </template>

          <!-- 字符串类型的配置 -->
          <template v-if="pageData.type == 'Array'">
            <div class="label">初始值：</div>
            <input style="width:100%" :value="pageData.default" />
          </template>

          <!-- 布尔类型的配置 -->
          <template v-if="pageData.type == 'Boolean'">
            <div class="label">初始值：</div>
            <van-switch v-model="pageData.default" active-color="green" inactive-color="#dcdee0" style="zoom:0.8" />
          </template>
        </div>
      </template>

      <van-button icon="plus" type="primary" @click="addPageData" class="button">添加新属性</van-button>
      <van-button icon="back-top" type="primary" @click="applyPageData" class="button">应用到当前页面</van-button>
    </div>

    <!-- 组件设置 -->
    <div v-if="settingMode == 'com'" class="pageSetting">
      <div class="title">component设置</div>

      <template v-if="currentSettingComponent.schema.type == 'ivanButton'">
        <div class="pageDataItem">
          <div class="label">Label：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.label" />
          <div class="label">Type：</div>
          <a-select ref="select" v-model:value="currentSettingComponent.schema.props.type" style="width: 120px"
            :options="[{
              value: 'primary',
              label: 'primary',
            }, {
              value: 'success',
              label: 'success',
            }, {
              value: 'warning',
              label: 'warning',
            }, {
              value: 'danger',
              label: 'danger',
            }]"></a-select>
          <div class="label">Size：</div>
          <a-select ref="select" v-model:value="currentSettingComponent.schema.props.size" style="width: 120px"
            :options="[{
              value: 'mini',
              label: 'mini',
            }, {
              value: 'small',
              label: 'small',
            }, {
              value: 'large ',
              label: 'large ',
            }]"></a-select>
        </div>

        <div class="title">event设置 (component,ievent)=> void</div>
        <div class="pageDataItem">
          <div class="label">点击按钮时触发页面方法：</div>
          <a-input placeholder="还未绑定页面处理方法" v-model:value="currentSettingComponent.schema.handlers.click" />
        </div>
      </template>

      <template v-if="currentSettingComponent.schema.type == 'ivanCheckbox'">
        <div class="pageDataItem">
          <div class="label">Label：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.label" />
        </div>
        <div class="pageDataItem">
          <div class="label">v-Model：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.iModel" />
        </div>
      </template>

      <template v-if="currentSettingComponent.schema.type == 'ivanSearch'">
        <div class="pageDataItem">
          <div class="label">Label：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.label" />
        </div>
        <div class="pageDataItem">
          <div class="label">v-Model：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.iModel" />
        </div>
        <div class="pageDataItem">
          <div class="label">placeholder：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.placeholder" />
        </div>
        <div class="pageDataItem">
          <div class="label">actionButtonTxt：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.actionButtonTxt" />
        </div>

        <div class="title">event设置 (component,ievent)=> void</div>
        <div class="pageDataItem">
          <div class="label">确定搜索时触发页面方法：</div>
          <a-input placeholder="还未绑定页面处理方法" v-model:value="currentSettingComponent.schema.handlers.search" />
        </div>
      </template>

      <template v-if="currentSettingComponent.schema.type == 'ivanStepper'">
        <div class="pageDataItem">
          <div class="label">theme：</div>
          <a-select ref="select" v-model:value="currentSettingComponent.schema.props.theme" style="width: 120px"
            :options="[{
              value: 'round',
              label: 'round',
            }, {
              value: 'square',
              label: 'square',
            }]"></a-select>
        </div>
        <div class="pageDataItem">
          <div class="label">v-Model：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.iModel" />
        </div>
        <div class="pageDataItem">
          <div class="label">min：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.min" />
        </div>
        <div class="pageDataItem">
          <div class="label">max：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.max" />
        </div>

        <div class="title">event设置 (component,ievent)=> void</div>
        <div class="pageDataItem">
          <div class="label">加减时触发页面方法：</div>
          <a-input placeholder="还未绑定页面处理方法" v-model:value="currentSettingComponent.schema.handlers.change" />
        </div>
      </template>

      <template v-if="currentSettingComponent.schema.type == 'iview'">
        <div class="pageDataItem">
          <div class="label">iText:</div>
          <a-input v-model:value="currentSettingComponent.schema.props.iText" />
        </div>
        <div class="pageDataItem">
          <div class="label">inlineStyle：</div>
          <a-input v-model:value="currentSettingComponent.schema.props.style" />
        </div>

        <div class="title">event设置 (component,ievent)=> void</div>
        <div class="pageDataItem">
          <div class="label">点击时触发页面方法：</div>
          <a-input placeholder="还未绑定页面处理方法" v-model:value="currentSettingComponent.schema.handlers.click" />
        </div>
      </template>
    </div>

    <!-- 页面方法设置 -->
    <div v-if="settingMode == 'pageFunction'" class="pageSetting">
      <div class="title">页面Function设置</div>

      <template v-for="(ifunction, index) in ipageFunctionList" :key="index">
        <div class="pageDataItem">
          <div class="delete" @click='deletePageFunction(ifunction.name)'>
            <ion-icon name="close-circle-outline"></ion-icon>
          </div>
          <div class="label">方法名：</div>
          <a-input v-model:value="ifunction.name" />
          <div class="label">
            <span>代码Javascript：</span>
            <a-button style="zoom:0.9;position: absolute;right: 11px;" size='small'
              @click="openCodeWithMonaco(ifunction)">
              <template #icon>
                <CodeOutlined />
              </template>
              <span>
                使用编辑器
              </span>
            </a-button>
          </div>
          <a-textarea style="height:120px" v-model:value="ifunction.code" placeholder="请编写方法代码" />
        </div>
      </template>

      <van-button icon="plus" type="primary" @click="addPageFunction" class="button">添加新方法</van-button>
    </div>
  </div>

  <!-- monaco抽屉 -->
  <a-drawer class="monacoDrawer" v-model:visible="codeEditorContainer" @afterVisibleChange="initcodeEditor" title="编辑方法"
    placement="right" width="700px">
    <div style="height:100%" id="monacoContainer"></div>
  </a-drawer>
</template>
