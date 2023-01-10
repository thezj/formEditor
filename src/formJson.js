
export default {
    // 验证通过后的脚本,上下文变量：inputInfo=提交信息
    beforSubmitCode: ` console.log(inputInfo) `,
    formFields: [
        {
            // 普通输入框
            type: "input",
            value: "",
            // 表单的验证脚本,上下文变量：field=当前表单项
            validator: [{
                code: ` return field.value != ''  `,
                hint: "你没填呢"
            }],
            // 表单项的显示配置
            props: {
                name: "name1",
                label: "名字",
                placeholder: "填写姓名",
                required: true,
                // 验证提示，需要提示时复制到此，点击表单项后隐藏
                errorMessage: ""
            },
            describe: "教你怎么填的提示"
        },
        {
            // 少量选项下拉单选
            type: "picker",
            value: "",
            // 对象类型的选项数据
            originalValue: {},
            showPicker: false,
            columns: [
                { text: '杭州', value: 'Hangzhou', sss: 2 },
                { text: '宁波', value: 'Ningbo' },
                { text: '温州', value: 'Wenzhou' },
                { text: '绍兴', value: 'Shaoxing' },
                { text: '湖州', value: 'Huzhou' },
            ],
            // 表单的验证脚本,
            validator: [{
                code: ` return field.value != ''  `,
                hint: "你没填呢2"
            }],
            props: {
                name: "city",
                label: "城市",
                placeholder: "选择城市",
                required: true,
                errorMessage: ""
            },
        }

    ]
}