import axios from 'axios';
import { router } from '../../router';
const { VITE_PATH } = import.meta.env;
import { useTabsStore } from '../../stores/Tabs.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const baseJwtURL = `/account/v1`;
const axiosInstanceJwt = axios.create({
    baseURL: baseJwtURL,
})

const baseURL = `/api/v1`;
const axiosInstance = axios.create({
    baseURL: baseURL,
})

async function callApi(method, url, data, headers) {

    try {
        // 檢查入參是否為空值
        if (!method || !url) {
            throw new Error("Invalid input parameters");
        }

        // 根據 method 呼叫對應的 HTTP 方法
        const res = await axiosInstance({
            method: method, // 使用入參 method
            url: url,
            data: data
        });
        
        if (!res) {
            return null
        }

        return {
            isSuccess: true,
            data: res.data
        };
    } catch (error) {
        return {
            isSuccess: false,
            data: error.response
        };
    }
}


function handleErrorResponse(err) {
    const store = useTabsStore();
    // ?非 200 或非 401 的狀態顯示(ex. 500 時顯示)
    if (err.response && (err.response.status.toString().startsWith('5'))) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: '伺服器異常，請聯絡管理人員！',
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
        })
        return
    }
    if (err.response && err.response.status === 404) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: `無法進行此動作，請重新整理頁面(${err.response.status})`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
        })
        return 
    }
        if (err.response && err.response.status === 403) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: `${err.response.data.rtnMsg}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
        }).then((result) => {
            if (result.isConfirmed) {
                store.clearTabsList(); // 清除
                router.push('/');
            }
        });
        return 
    }
    if (err.response && err.response.status !== 401) {
        return Promise.reject(err)
    }
    /* token 到期，導到登入頁 */
        if (err.response && err.response.status === 401) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: '登入逾期，請重新登入',
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            width: 500
        }).then((result) => {
            if (result.isConfirmed) {
                store.clearTabsList(); // 清除
                router.push('/');
            }
        })
        return
    }
}

axiosInstanceJwt.interceptors.response.use(
    config => config,
    err => handleErrorResponse(err)
);

axiosInstance.interceptors.response.use(
    config => config,
    err => handleErrorResponse(err)
);


//*axios
export { axiosInstanceJwt, axiosInstance, callApi  }
