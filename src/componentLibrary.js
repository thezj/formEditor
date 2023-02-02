
export default {
    getComponentByType(type) {
        return JSON.parse(JSON.stringify(this.list.find(x => x.schema.type == type)))
    },
    list: [
        {
            id: 'com1',
            /**
             * gs-autoPosition - 忽略x,y属性
             * gs-x, y：坐标
             * gs-w, h：尺寸
             * gs-maxW, minW, maxH, minH：尺寸限制
             * gs-locked：锁定不能被其他格子影响，但是可以手动改变
             * gs-noResize：尺寸不可改变
             * gs-noMove：不可移动
             * gs-id- (number | string) 用于快速识别
             * gs-content：html 内容
             * gs-subGrid?: GridStackOptions：嵌套格子
             * gs-subGridDynamic?: boolean：enable/disable the creation of sub-grids 
             * gs-on the fly by dragging items completely over others (nest) vs partially (push). 
             * gs-Forces DDDragOpt.pause=true to accomplish that.
             */
            layout: {
                ['gs-h']: 1,
                ['gs-w']: 2
            },
            schema: {
                type: 'ivanCheckbox',
                describe: "Checkbox 复选框",
                props: {
                    lable: "复选框",
                    checked: true
                }
            }
        },
        {
            id: 'com2',
            layout: {
                ['gs-h']: 1,
                ['gs-w']: 4
            },
            schema: {
                type: 'ivanSearch',
                describe: "Search 搜索",
                props: {
                    lable: "复选框",
                    placeholder: "请输入关键词",
                    actionButtonTxt: "查找",
                    checked: true
                }
            }
        },
    ]
};