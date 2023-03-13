 /* eslint-disable */
import moment from "moment";
const _moment = moment;

let generic = {
    /**
     * 执行配置中需要eval的字段
     * @param config Array  配置
     * @param context Object  原数据
     */
    replaceEval(config, context = {}) {
        config = JSON.parse(JSON.stringify(config))
        if (config.length == 0) return config
        try {
            config.forEach((item) => {
                if (item.replaceEvalPath) {
                    // 精确定位需要eval的字段
                    item.replaceEvalPath.forEach((path) => {
                        let arr = path.split('/')
                        if (arr.length == 1) {
                            try {
                                item[arr[0]] = eval(item[arr[0]])
                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            arr.unshift('item')
                            // 目标key
                            let goalKey = arr.pop()
                            let tmp = arr.reduce((left, right) => {
                                try {

                                    return eval(left)[right]

                                } catch (error) {
                                    console.log(error);
                                }
                            })
                            try {


                                tmp[goalKey] = eval(tmp[goalKey])
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
        return config
    },
    /**
     * 执行配置中需要eval的字段
     * @param config Array  配置
     * @param context Object  原数据
     */
    replaceEvalSingle(config, context = {}) {
        config = JSON.parse(JSON.stringify(config))
        if (config.length == 0) return config
        config.forEach((item) => {
            if (item.replaceEvalPath) {
                // 精确定位需要eval的字段
                item.replaceEvalPath.forEach((path) => {
                    let arr = path.split('/')
                    if (arr.length == 1) {
                        try {
                     
                            item[arr[0]] = eval(item[arr[0]])
                       
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        arr.unshift('item')
                        // 目标key
                        let goalKey = arr.pop()
                        let tmp = arr.reduce((left, right) => {
                            try {
                     
                       
                                return eval(left)[right]
                            } catch (error) {
                                console.log(error);
                            }
                        })
                        try {
                     
                       
                            tmp[goalKey] = eval(tmp[goalKey])
                        } catch (error) {
                            console.log(error);
                        }
                    }
                })
            }
        })
        return config[0].params.metas[0]
    },
    /**
     * 执行配置中需要eval的字段
     * @param config Array  配置
     * @param context Object  原数据
     */
    replaceEvalObject(object, context = {}) {
        object = JSON.parse(JSON.stringify(object))
        if (object.replaceEvalPath && object.replaceEvalPath.length) {
            object.replaceEvalPath.forEach((path) => {
                let arr = path.split('/')
                if (arr.length == 1) {
                    try {
                        object[arr[0]] = eval(object[arr[0]])
                    } catch (error) {
                        console.log(error,object[arr[0]]);
                    }
                } else {
                    arr.unshift('object')
                    // 目标key
                    let goalKey = arr.pop()
                    let tmp = arr.reduce((left, right) => {
                        try {
                     
                            return eval(left)[right]
                       
                        } catch (error) {
                            console.log(error,left);
                        }
                    })
                    try {
                     
                        tmp[goalKey] = eval(tmp[goalKey])
                       
                    } catch (error) {
                        console.log(error,tmp[goalKey]);
                    }
                }
            })
        }
        return object
    }
}
export default generic;