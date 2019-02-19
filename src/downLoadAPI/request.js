/**
 * Created by dx on 18/6/7.
 */
import  axios from 'axios'
const service = axios.create({
    timeout: 3000 * 10,
    withCredentials: true,
    baseURL: process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' :  process.env.API_URL,
})
export default service
