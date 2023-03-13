import axios from 'axios'
import netConfig from '@/config/net.js'
import store from '@/store'
import qs from 'qs'
import { useRouter } from 'vue-router'
import {getObjType} from '@/utils/validate'
import { message } from 'ant-design-vue';

const {
    baseURL,
    contentType,
    invalidCode,
    noPermissionCode,
    requestTimeout,
    successCode
} = netConfig
const router = useRouter()

/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
    switch (code) {
        case invalidCode:
            message.error(msg || `后端接口${code}异常`)
            // 刷新token
            // store.dispatch('user/resetAccessToken').catch(() => {})
            // 登陆拦截
            // if (loginInterception) {
            //     location.reload()
            // }
            break
        case noPermissionCode:
            router.push({path: '/401'}).catch(() => {
            })
            break
        default:
            message.error(msg || `后端接口${code}异常`)
            break
    }
}

const instance = axios.create({
    baseURL,
    timeout: requestTimeout,
    headers: {
        'Content-Type': contentType,
    },
})

instance.interceptors.request.use(
    (config) => {
        // TODO
        // if (store.getters['user/accessToken']) {
        //     config.headers['authorization'] = 'Bearer ' + store.getters['user/accessToken']
        // }
        // token 暂时写死
        config.headers['authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyOEQ3RTE1N0U4Mzg2NzcxNDg2RjY5NEY4QzYzNDBDIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NzY5NjU1MDksImV4cCI6MTcwODA2OTUwOSwiaXNzIjoiaHR0cDovL3Bhc3Nwb3J0Lms4cy1kZXYuc21hcnR4Y2xvdWQuY24iLCJhdWQiOlsic21hcnR4YXBwIiwic21hcnR4LWptaWNlLW9wZW4iXSwiY2xpZW50X2lkIjoiYXBwLTI0Iiwic3ViIjoiOTNkMTBlYzktOGE3Mi0xMWVjLTg5ZDItNmEwNjE2ZGZkZWU0IiwiYXV0aF90aW1lIjoxNjc2OTY1NTA5LCJpZHAiOiJsb2NhbCIsImlkIjoiOTNkMTBlYzktOGE3Mi0xMWVjLTg5ZDItNmEwNjE2ZGZkZWU0IiwibmFtZSI6Ill1blhpbmciLCJyb2xlX2NvZGVzIjoiQ0UuQWRtaW4uQ1NQQyxDRS5Pcmdhbml6ZXIuT3duZXIiLCJ0ZW5hbnRfaWQiOiI3ZmFmNTM5My04YTcwLTExZWMtODlkMi02YTA2MTZkZmRlZTQiLCJ0ZW5hbnRfY29kZSI6ImNyb3NzZXZlbnQiLCJqdGkiOiJBNkNFOUQ4MEU5RjAzM0VDOTU5RDhGRkQ1ODE0MDgzMSIsImlhdCI6MTY3Njk2NTUwOSwic2NvcGUiOlsic21hcnR4YXBwIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbImN1c3RvbSJdfQ.UDGyyrzS8enHXayTYN-ZlvPiwSo0Y134uh-IVebS-AHIll3iAi_RvXLQRqEimPWUR3xGRqiFEhfqWfsj1Umfm-NyWNR1UNhkL0sMDfBfDWhayztEdmaPZcajMx4KeYnDCwSysd2jeXRajJeXfV33nwUn36b4XO_lXyZjpkbIXsvUwWJfE7NB3ycC691csJqedavJQDpeXW8u8tpMsTVxQBwRqmyS509LHhAxWlHXS_N_XBVNin6LcaJcia7vF5JJJnAaEia6GWZvrskp3ljJTx51Dg6e__OhoGvFh6u2lx7aYNsipffTs787ZV2Zrumoch4IqUanaNCivcGafv0hBw'

        // get请求添加时间戳
        if (config.method === "get") {
            config.params = Object.assign(config.params || {}, {rnd: new Date().getTime()});
        }

        if (
            config.data &&
            config.headers['Content-Type'] ===
            'application/x-www-form-urlencoded;charset=UTF-8'
        )
            config.data = qs.stringify(config.data)

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        const {data, config} = response
        const {code, msg, success} = data
        // 操作正常Code数组
        const codeVerificationArray = getObjType(successCode) == 'Array'
            ? [...successCode]
            : [...[successCode]]
        // 是否操作正常
        if (codeVerificationArray.includes(code) && success) {
            return data
        } else {
            handleCode(code, msg)
            return Promise.reject(
                '请求异常拦截:' +
                JSON.stringify({url: config.url, code, msg}) || 'Error'
            )
        }
    },
    (error) => {
        const {response, message} = error
        if (error.response && error.response.data) {
            const {status, data} = response
            handleCode(status, data.msg || message)
            return Promise.reject(error)
        } else {
            let {message} = error
            if (message === 'Network Error') {
                message = '后端接口连接异常'
            }
            if (message.includes('timeout')) {
                message = '后端接口请求超时'
            }
            if (message.includes('Request failed with status code')) {
                const code = message.substr(message.length - 3)
                message = '后端接口' + code + '异常'
            }
            message.error(message || `后端接口未知异常`)
            return Promise.reject(error)
        }
    }
)

export default instance