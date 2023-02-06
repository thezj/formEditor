
export default {
    getParentNode(currentNode, parentName) {

        let matchClass = currentNode.classList.contains(parentName)
        if (matchClass) {
            return currentNode
        } else {
            return this.getParentNode(currentNode.parentElement, parentName)
        }
    },
    JSONCopy(obj){
        return JSON.parse(JSON.stringify(obj))
    }
};