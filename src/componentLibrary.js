
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
export default {
    getComponentByType(type) {
        return JSON.parse(JSON.stringify(this.list.find(x => x.schema.type == type)))
    },
    list: [
        {
            layout: {
                ['gs-h']: 10,
                ['gs-w']: 2
            },
            schema: {
                type: 'iview',
                describe: "view 显示块",
                icon: 'tv-outline',
                props: {
                    iText: "",
                    style: "",
                },
                handlers: {
                    click: ""
                }
            }
        },
        {

            layout: {
                ['gs-h']: 8,
                ['gs-w']: 1
            },
            schema: {
                type: 'ivanCheckbox',
                describe: "Checkbox 复选框",
                icon: 'checkmark-circle-outline',
                props: {
                    iModel: '',
                    label: "复选框"
                }
            }
        },
        {
            layout: {
                ['gs-h']: 16,
                ['gs-w']: 4
            },
            schema: {
                type: 'ivanSearch',
                describe: "Search 搜索",
                icon: 'search-circle-outline',
                props: {
                    iModel: '',
                    label: "搜索",
                    placeholder: "请输入关键词",
                    actionButtonTxt: "查找",
                },
                handlers: {
                    search: ""
                }
            }
        },
        {
            layout: {
                ['gs-h']: 11,
                ['gs-w']: 1
            },
            schema: {
                type: 'ivanButton',
                describe: "Button 按钮",
                icon: 'tablet-landscape-outline',
                props: {
                    type: "primary",
                    size: "small",
                    label: "按钮",
                },
                handlers: {
                    click: ""
                }
            }
        },
        {
            layout: {
                ['gs-h']: 10,
                ['gs-w']: 2
            },
            schema: {
                type: 'ivanStepper',
                describe: "Stepper 步进器",
                icon: 'add-circle-outline',
                props: {
                    iModel: '',
                    theme: "round",
                    min: 1,
                    max: 1,
                },
                handlers: {
                    change: ""
                }
            }
        }, {
            layout: {
                ['gs-h']: 11,
                ['gs-w']: 3
            },
            schema: {
                type: 'iselect',
                describe: "select 下拉",
                icon: 'menu-outline',
                props: {
                    iModel: '',
                    mode:"",
                    style:"width: 140px",
                    placeholder: "请选择，可搜索",
                    optionsKey:""
                },
                handlers: {
                    change: ""
                }
            }
        },
    ]
};