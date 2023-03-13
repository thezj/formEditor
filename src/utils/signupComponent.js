import render from "@/views/render.vue";
// vant ui
import xVanCheckbox from '@/components/vant/xCheckbox.vue'
import xVanSearch from '@/components/vant/xSearch.vue'
import xVanButton from '@/components/vant/xButton.vue'
import xVanStepper from '@/components/vant/xStepper.vue'
import xApplicationItem from '@/components/vant/xApplicationItem.vue'
import xVanInput from '@/components/vant/xInput.vue'

// antd ui
import xSelect from '@/components/antd/xSelect.vue'
import xAntCascader from '@/components/antd/xCascader.vue'
import xCheckBox from '@/components/antd/xCheckBox.vue'
import xRadio from '@/components/antd/xRadio.vue'
import xDatePicker from '@/components/antd/xDatePicker.vue'
import xAntInput from '@/components/antd/xInput.vue'
import xAntInputNumber from '@/components/antd/xInputNumber.vue'
import xAntButton from '@/components/antd/xAntButton.vue'

// common
import xNormalInput from '@/components/xNormalInput.vue'
import xView from '@/components/xView.vue'
import xImage from '@/components/xImage.vue'



export function componentregister(ccApp) {
    ccApp.component('render', render)
    ccApp.component('xVanCheckbox', xVanCheckbox)
    ccApp.component('xVanSearch', xVanSearch)
    ccApp.component('xVanButton', xVanButton)
    ccApp.component('xVanStepper', xVanStepper)
    ccApp.component('xApplicationItem', xApplicationItem)
    ccApp.component('xVanInput', xVanInput)
    ccApp.component('xSelect', xSelect)
    ccApp.component('xNormalInput', xNormalInput)
    ccApp.component('xView', xView)
    ccApp.component('xImage', xImage)
    ccApp.component('xAntCascader', xAntCascader)
    ccApp.component('xCheckBox', xCheckBox)
    ccApp.component('xRadio', xRadio)
    ccApp.component('xDatePicker', xDatePicker)
    ccApp.component('xAntInput', xAntInput)
    ccApp.component('xAntInputNumber', xAntInputNumber)
    ccApp.component('xAntButton', xAntButton)

}