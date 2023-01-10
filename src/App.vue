<script setup>
import { ref } from "vue"
// 序列化的表单数据
import formJson from "./formJson.js"

//定义事件
const emit = defineEmits(['submit'])

// 绑定相应对象
let formConfigs = ref(formJson)

// 点击提交事件
let onSubmit = async res => {
  /**
   * 验证信息，验证到一条不通过就可以返回了
   * 可使用异步接口进行验证
   */
  for (let index = 0; index < formConfigs.value.formFields.length; index++) {
    let field = formConfigs.value.formFields[index];
    if (field.validator.length) {
      for (let index = 0; index < field.validator.length; index++) {
        let rule = field.validator[index];
        // 开始验证一条规则
        console.log("验证规则====", field.props.name, field.value, rule)
        let result = eval(`(()=>{${rule.code}})()`)
        console.log("验证结果====", result)
        if (!result) {
          //验证失败，提示信息，滚动到此项
          field.props.errorMessage = rule.hint
          document.querySelector(`#${field.type + field.props.name}`).scrollIntoView(false);
          // 不必继续验证，直接返回
          return
        }
      }
    }
  }



  let formConfigsRaw = JSON.parse(JSON.stringify(formConfigs.value.formFields))
  let inputInfo = formConfigsRaw.map(field => { return { name: field.props.name, value: field.originalValue ? field.originalValue : field.value } })

  // 最后处理提交信息的脚本
  if (formConfigs.value.beforSubmitCode) {
    eval(formConfigs.value.beforSubmitCode)
  }
  emit('submit', inputInfo)
}


</script>

<template>
  <div class="formRender">
    <van-form @submit="onSubmit">
      <div class="vanfield" v-for="item in formConfigs.formFields" :key="item.type + item.props.name"
        :id="item.type + item.props.name" @touchstart="item.props.errorMessage = ''">

        <!-- 填写表单项的提示信息 -->
        <div v-if="item.describe" class="describe">
          <van-icon name="info-o" />
          <span>{{ item.describe }}</span>
        </div>

        <!-- 渲染表单项 -->
        <template v-if="item.type == 'input'">
          <van-field v-model="item.value" v-bind="item.props" />
        </template>

        <!-- 渲染表单项 -->
        <template v-if="item.type == 'picker'">
          <van-field v-model="item.value" v-bind="item.props" is-link readonly @click="item.showPicker = true" />
          <van-popup v-model:show="item.showPicker" position="bottom">
            <van-picker :columns="item.columns"
              @confirm="({ selectedOptions }) => { item.value = selectedOptions[0]?.text; item.originalValue = selectedOptions; item.showPicker = false }"
              @cancel="item.showPicker = false" />
          </van-popup>
        </template>

      </div>

      <!-- 底部按钮 -->
      <div class="formBottom">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
