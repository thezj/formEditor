import request from "../utils/request";

export const httpService = {
    /**
     *
     * @param url      请求地址
     * @param params   请求参数
     * @returns {Promise<AxiosResponse<any>>}
     */
    Post: (url,params) => {
        return request.post(url,params)
    },
    /**
     *
     * @param url      请求地址
     * @param params   请求参数
     * @returns {Promise<AxiosResponse<any>>}
     */
    Get: (url,params) => {
        return request.get(url,params)
    },
    /**
     * tpm querySettings
     * @param params
     * @param header
     * @returns {Promise<AxiosResponse<any>>}
     */
    querySettings: (params,header) => {
        return request.post('/api/tpm/cfg/querysettings',params,header)
    },
    /**
     * tpm 插入
     * @param params
     * @param header
     * @returns {Promise<AxiosResponse<any>>}
     */
    xInsertDocument: (params,header) => {
        return request.post('/api/tpm/cfg/XInsertDocument',params,header)
    },

    // tpm 单条更新
    xUpdateDocument: (params,header) => {
        return request.post('/api/tpm/cfg/XUpdateDocument',params,header)
    },
    // 登陆
    login: (params, headers) => {
        return request.post("/foundation/passport/api/account/auth", params, headers);
    },
}