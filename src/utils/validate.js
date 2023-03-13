/**
 * 数据类型
 * @param obj
 * @returns {string|"undefined"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
 */
export function getObjType(obj) {
    var type = typeof obj;
    if (type !== 'object') {
        return type;
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}

/**
 * 执行eval表达式
 * @param evalStr     表达式
 * @param context     数据源
 * @returns {string|*}
 */
export function replaceVal (evalStr,context) {
    if (evalStr === undefined || evalStr.indexOf('context') == -1) return evalStr
    let val = ''
    try {
        val = eval(evalStr)
    } catch (error) {
        console.log(`${evalStr}_error`, error)
    }
    return val
}