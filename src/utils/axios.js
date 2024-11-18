import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import router from '@/router/router.js';
// import userHelper from '@/utils/helpers/user';
// import { createPinia } from 'pinia';
// import { LoginStore } from '../stores/LoginStore.js';

const { VITE_PATH } = import.meta.env;

//Axios 工具
const link = VITE_PATH;

const basURL = `${link}/api/v1`;
const api = axios.create({
    baseURL: basURL,
    timeout: 5000, 
})

function handleErrorResponse(err) {
    if (err.code === 'ECONNABORTED') {
        // 針對超時錯誤的處理
        Swal.fire({
          title: '請求超時，請稍後重試！',
          confirmButtonText: '確認',
        });
        return;
      }    
    // ?非 200 或非 401 的狀態顯示(ex. 500 時顯示)
    if (err.response && (err.response.status.toString().startsWith('5'))) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: '伺服器異常，請聯絡管理人員！',
            confirmButtonColor: '#247F27',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400,
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.focus();
                if (confirmButton) {
                    confirmButton.setAttribute('tabindex', '1');
                }
            }
        })
        return
    }
    if (err.response && err.response.status === 404) {
        Swal.fire({
            toast: true,
            position: 'center',
            title: `無法進行此動作，請重新整理頁面(${err.response.status})`,
            confirmButtonColor: '#247F27',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400,
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.focus();
                if (confirmButton) {
                    confirmButton.setAttribute('tabindex', '1');
                }
            }
        })
        return 
    };

    if (err.response && err.response.status !== 401) {
        return Promise.reject(err)
    }

    // const store = LoginStore();
    // if (err.response && err.response.status === 401) {
    //     Swal.fire({
    //         toast: true,
    //         position: 'center',
    //         title: '請先登入',
    //         confirmButtonColor: '#247F27',
    //         confirmButtonText: '確認',
    //         confirmButtonAriaLabel: '確認',
    //         width: 500,
    //         didOpen: () => {
    //             const confirmButton = Swal.getConfirmButton();
    //             confirmButton.focus();
    //             if (confirmButton) {
    //                 confirmButton.setAttribute('tabindex', '1');
    //             }
    //         }
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             router.push('/userlogin');
    //             store.setRedirectUrl(window.location.pathname); // 記錄前一頁面
    //             userHelper.removeInfo();
    //             store.getIsLogin();
    //             store.getUserEmail();
    //             store.fromSocialhandler();
    //         }
    //     })
    //     return Promise.reject(err)
    // }
}

api.interceptors.response.use(
    config => config,
    err => handleErrorResponse(err)
);

//*axios
export { api }
