import { defineStore } from 'pinia';
import { router } from '@/router';
import { axiosInstance } from '@/utils/helpers/fetch-wrapper';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('cieebo-admin-user')),
    returnUrl: null
  }),
  actions: {
    async userLogin(account: string, password: string) {
      const user = await axiosInstance.post(`/backend-users/login`, { account, password });

      if (user.data.rtnCode !== '0000') {
        return {
          isSuccess: false,
          msg: user.data.rtnMsg
        }
      }

      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('cieebo-admin-user', JSON.stringify(user.data.data.userData));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/admin/dashboard');
      return {
        isSuccess: true
      }
    },
    async logout() {
      const user = await axiosInstance.post(`/backend-users/logout`);
      if (user.data.rtnCode !== '0000') {
        return {
          isSuccess: false,
          msg: user.data.rtnMsg
        }
      }
      this.user = null;
      localStorage.removeItem('cieebo-admin-user');
      
      return {
        isSuccess: true
      }
    }
  }
});
