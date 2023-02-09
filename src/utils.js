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
    JSONCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    log(...arg) {
        console.log(...arg)
    }
};