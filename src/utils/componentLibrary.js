let allComponent = {
    list: [
        {
            category: "HTML元素",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xNormalInput',
                describe: "原始input",
                props: {
                    iModel: '',
                },
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' }
            ]
        },
        {
            category: "其他",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xView',
                describe: "属性显示块",
                props: {
                    iText: "<div>全局属性字段{{iData}}</div>",
                },
                handlers: {
                    click: ""
                }
            },
            paramsSetting: [
                { label: '代码', val: 'iText', type: 'function' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'click', val: 'click', type: 'funcName' }
            ]
        },
        {
            category: "Vant4组件",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xVanCheckbox',
                describe: "vant复选框",
                props: {
                    iModel: '',
                    label: "复选框"
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'v-Model', val: 'iModel', type: 'string' }
            ]
        },
        {
            category: "Vant4组件",
            layout: {
                ['gs-h']: 16,
                ['gs-w']: 12,
                flowHeight: 64,
            },
            schema: {
                type: 'xVanSearch',
                describe: "vant搜索",
                props: {
                    iModel: '',
                    label: "搜索",
                    placeholder: "请输入关键词",
                    actionButtonTxt: "查找",
                },
                handlers: {
                    search: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'placeholder', val: 'placeholder', type: 'string' },
                { label: 'actionButtonTxt', val: 'actionButtonTxt', type: 'string' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'search', val: 'search', type: 'funcName' }
            ]
        },
        {
            category: "Vant4组件",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xVanButton',
                describe: "vant按钮",
                props: {
                    type: "primary",
                    size: "small",
                    label: "按钮",
                    nativeType: "button",
                },
                handlers: {
                    click: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                {
                    label: 'nativeType', val: 'nativeType', type: 'select',
                    options: [
                        {
                            value: 'button',
                            label: 'button',
                        },
                        {
                            value: 'submit',
                            label: 'submit',
                        }
                    ]
                },
                {
                    label: '样式', val: 'type', type: 'select',
                    options: [
                        {
                            value: 'primary',
                            label: 'primary',
                        },
                        {
                            value: 'success',
                            label: 'success',
                        },
                        {
                            value: 'warning',
                            label: 'warning',
                        },
                        {
                            value: 'danger',
                            label: 'danger',
                        }
                    ]
                },
                {
                    label: 'size', val: 'size', type: 'select',
                    options: [
                        {
                            value: 'mini',
                            label: 'mini',
                        },
                        {
                            value: 'small',
                            label: 'small',
                        },
                        {
                            value: 'large ',
                            label: 'large ',
                        }
                    ]
                },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'click', val: 'click', type: 'funcName' }
            ]
        },
        {
            category: "Vant4组件",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xVanStepper',
                describe: "vant步进器",
                props: {
                    iModel: '',
                    theme: "round",
                    min: 1,
                    max: 1,
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'min', val: 'min', type: 'number', min: Math.max(), max: Math.min() },
                { label: 'max', val: 'max', type: 'number', min: Math.max(), max: Math.min() },
                {
                    label: 'theme', val: 'theme', type: 'select',
                    options: [
                        {
                            value: 'round',
                            label: 'round',
                        },
                        {
                            value: 'square',
                            label: 'square',
                        }
                    ]
                },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "会引擎组件",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xVanInput',
                describe: "vant输入框",
                props: {
                    iModel: '',
                    type: "text",
                    label: "会议名称",
                    controlName: "",
                    placeholder: "请输入会议名称",
                    rules: [
                        {
                            required: true,
                            message: "请输入会议名称"
                        }
                    ]
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'placeholder', val: 'placeholder', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                {
                    label: 'type', val: 'type', type: 'select',
                    options: [
                        {
                            value: 'text',
                            label: 'text',
                        },
                        {
                            value: 'password',
                            label: 'password',
                        },
                        {
                            value: 'digit',
                            label: 'digit',
                        },
                        {
                            value: 'number',
                            label: 'number',
                        },
                        {
                            value: 'tel',
                            label: 'tel',
                        }
                    ]
                },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "会引擎组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xImage',
                describe: "图片显示",
                props: {
                    src: "https://sfc.vuejs.org/logo.svg"
                },
                handlers: {
                }
            },
            paramsSetting: [
                { label: 'src', val: 'src', type: 'string' }
            ]
        },
        {
            category: "会引擎组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120
            },
            schema: {
                type: 'xApplicationItem',
                describe: "applicationItem",
                props: {
                    color: '#fff',
                    icon: '',
                    name: '',
                    params: '',
                    path: '',
                    background: '#3875fe',
                    visible: ''
                },
                handlers: {
                    click: ''
                }
            },
            paramsSetting: [
                { label: 'visible', val: 'visible', type: 'string' },
                { label: 'name', val: 'name', type: 'string' },
                { label: 'params', val: 'params', type: 'string' },
                { label: 'path', val: 'path', type: 'string' },
                { label: 'icon', val: 'icon', type: 'string' },
                { label: 'color', val: 'color', type: 'string' },
                { label: 'background', val: 'background', type: 'string' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 13,
                ['gs-w']: 12,
                flowHeight: 52,
            },
            schema: {
                type: 'xSelect',
                describe: "ant下拉",
                props: {
                    iModel: '',
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "[]",
                    placeholder: "请选择，可搜索",
                    options: ""
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'placeholder', val: 'placeholder', type: 'string' },
                { label: 'options', val: 'options', type: 'string' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xAntCascader',
                describe: "Cascader级联选择",
                props: {
                    iModel: '',
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "[]",
                    placeholder: "请选择",
                    options: ""
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'placeholder', val: 'placeholder', type: 'string' },
                { label: 'options', val: 'options', type: 'string' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xCheckBox',
                describe: "Checkbox多选",
                props: {
                    iModel: '',
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "[]",
                    width: 12,
                    options: ""
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'width', val: 'width', type: 'number', min: 1, max: 24 },
                { label: 'options', val: 'options', type: 'string' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xRadio',
                describe: "Radio单选",
                props: {
                    iModel: '',
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "[]",
                    options: ""
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'options', val: 'options', type: 'string' },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xDatePicker',
                describe: "DatePicker日期时间",
                props: {
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "",
                    iModel: "",
                    range: false,
                    showTime: "",
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'range', val: 'range', type: 'boolean' },
                { label: 'v-Model', val: 'iModel', type: 'string' },
                {
                    label: 'showTime', val: 'showTime', type: 'select',
                    options: [
                        {
                            value: 'null',
                            label: 'null',
                        },
                        {
                            value: 'HH:mm:ss',
                            label: 'HH:mm:ss',
                        },
                        {
                            value: 'HH:mm',
                            label: 'HH:mm',
                        },
                        {
                            value: 'HH',
                            label: 'HH',
                        },

                    ]
                },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xAntInput',
                describe: "input输入框",
                props: {
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    wrapperCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "",
                    iModel: "",
                    placeholder: "请输入",
                    rowSize: 1,
                    maxlength: 100,
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'wrapperCol', val: 'wrapperCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'placeholder', val: 'placeholder', type: 'string' },
                { label: 'rowSize', val: 'rowSize', type: 'number', min: 1, max: 99 },
                { label: 'maxlength', val: 'maxlength', type: 'number', min: 1, max: 9999 },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },

        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xAntButton',
                describe: "Button按钮",
                props: {
                    label: '按钮',
                    type: "primary",
                    size: "large",
                    htmlType: "button"
                },
                handlers: {
                    click: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                {
                    label: 'htmlType', val: 'htmlType', type: 'select',
                    options: [
                        {
                            value: 'button',
                            label: 'button',
                        },
                        {
                            value: 'submit',
                            label: 'submit',
                        }
                    ]
                },
                {
                    label: 'size', val: 'size', type: 'select',
                    options: [
                        {
                            value: 'large',
                            label: 'large',
                        },
                        {
                            value: 'middle',
                            label: 'middle',
                        },
                        {
                            value: 'small',
                            label: 'small',
                        }
                    ]
                },
                {
                    label: 'type', val: 'type', type: 'select',
                    options: [
                        {
                            value: 'primary',
                            label: 'primary',
                        },
                        {
                            value: 'ghost',
                            label: 'ghost',
                        },
                        {
                            value: 'dashed',
                            label: 'dashed',
                        },
                        {
                            value: 'link',
                            label: 'link',
                        },
                        {
                            value: 'text',
                            label: 'text',
                        },
                        {
                            value: 'default',
                            label: 'default',
                        }
                    ]
                },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'click', val: 'click', type: 'funcName' }
            ]
        },
        {
            category: "Ant3组件",
            layout: {
                ['gs-h']: 30,
                ['gs-w']: 12,
                flowHeight: 120,
            },
            schema: {
                type: 'xAntInputNumber',
                describe: "Number输入框",
                props: {
                    label: '',
                    labelCol: "{span: 3, offset: 0}",
                    wrapperCol: "{span: 3, offset: 0}",
                    controlName: '',
                    rules: "",
                    iModel: "",
                    min: 1,
                    max: 10
                },
                handlers: {
                    change: ""
                }
            },
            paramsSetting: [
                { label: 'label', val: 'label', type: 'string' },
                { label: 'labelCol', val: 'labelCol', type: 'string' },
                { label: 'wrapperCol', val: 'wrapperCol', type: 'string' },
                { label: 'controlName', val: 'controlName', type: 'string' },
                { label: 'rules', val: 'rules', type: 'function' },
                { label: 'v-Model', val: 'iModel', type: 'string' },
                { label: 'min', val: 'min', type: 'number', min: Math.max(), max: Math.min() },
                { label: 'max', val: 'max', type: 'number', min: Math.max(), max: Math.min() },
                { val: 'event设置 (component,ievent,item,index)=> void', type: 'splitLine', desc: '分割线' },
                { label: 'change', val: 'change', type: 'funcName' }
            ]
        },
    ]
}

// 添加公共属性
allComponent.list.forEach(com => {
    // 添加公共样式属性
    Object.assign(com.layout, {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        inlineBlock: false,
    })
    // 添加公共组件配置
    Object.assign(com.schema, {
        renderCondition: "true",
        style: '#Id{}',
        loop: false,
        loopSource: "",
        loopUnikey: "id",
    })
})

// 添加分类title
allComponent.list = allComponent.list.reduce(function (r, a) {
    r[a.category
    ] = r[a.category
    ] || [];
    r[a.category
    ].push(a);
    return r;
}, Object.create(null));

allComponent.getComponentByType = (type) => {
    let com
    for (let key in allComponent.list) {
        com = allComponent.list[key].find(icom => icom.schema.type == type)
        if (com) {
            break;
        }
    }
    return JSON.parse(JSON.stringify(com))
}

export default allComponent