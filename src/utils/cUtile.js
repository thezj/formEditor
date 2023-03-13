import axios from 'axios';
import { message } from 'ant-design-vue';
export default {
    message,
    ihttp: axios,
    getParentNode(currentNode, parentName) {

        let matchClass = currentNode.classList.contains(parentName)
        if (matchClass) {
            return currentNode
        } else {
            return this.getParentNode(currentNode.parentElement, parentName)
        }
    },
    mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    },
    JSONCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    log(...arg) {
        console.log(...arg)
    },
    // 计算所需字段属性，根据所需类型返回默认值
    ieval: `(() => {

        try {
            let result 
            eval("result = "+expression);
            switch (needType) {
                case "object":
                    if (result instanceof Object) {
                        return result;
                    } else {
                        return {};
                    }
                case "array":
                    if (result instanceof Array) {
                        return result;
                    } else {
                        return [];
                    }
                default:
                    return result;
            }
        } catch (error) {
            switch (needType) {
                case "object":
                    return {};
                case "array":
                    return [];
                default:
                    return expression;
            }
        }
    })()`
};