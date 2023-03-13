/**
 *
 * @param clientWidth
 */
export default function setSmartRem (clientWidth) {
    const docEl = document.documentElement
    // 移除已添加的样式，考虑app跳转到pc的情况
    if (!clientWidth) {
        docEl.removeAttribute('style')
        return false;
    }
    const isPad = (clientWidth || window.innerWidth) >= 640; // 根据当前屏幕宽度判断是否为ipad
    isPad ? docEl.style.fontSize = 100 * (clientWidth / 640) + 'px' : docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
}

