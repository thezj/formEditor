
export default [
    {
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
            ['gs-id']: 's1',
            ['gs-x']: 1,
            ['gs-w']: 2
        },
        schema: {
            type: 'ivanCheckbox',
            props: {
                iModel:'test1',
                lable: "sdfsd",
            }
        }
    }
];