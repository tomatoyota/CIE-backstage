import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
  // 代辦事項
  async todo() {
    try {
      const res = await axiosInstance.get(`/dashboard/todo`);
      if (res === null || res.data === null) {
        return null;
      }
      return {
        isSuccess: true,
        data: res.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        msg: error.response.data.rtnMsg
      };
    }
  },
  // 登入紀錄
  async loginRecord() {
    try {
      const res = await axiosInstance.post(`/dashboard/login`);
      if (res === null || res.data === null) {
        return null;
      }
      return {
        isSuccess: true,
        data: res.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        msg: error.response.data.rtnMsg
      };
    }
  }
};
