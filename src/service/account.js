import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
  // 建立新的使用者
  async addAccount(obj) {
    try {
      const res = await axiosInstance.post(`/backend-users`, obj);
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
  // 搜尋使用者帳號
  async backendUsersGet(
    username,
    createdAtStart,
    createdAtEnd,
    updatedAtStart,
    updatedAtEnd,
    creator,
    editor,
    status,
    roleIds,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    try {
      const res = await axiosInstance.get(
        `/backend-users?username=${username}&createdAtStart=${createdAtStart}&createdAtEnd=${createdAtEnd}&creator=${creator}&updatedAtStart=${updatedAtStart}&updatedAtEnd=${updatedAtEnd}&editor=${editor}&status=${status}&roleIds=${roleIds}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortOrder}`
      );
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

  async getRole() {
    try {
      const res = await axiosInstance.get('/roles/active');
      if (res === null || res.data === null) {
        return null;
      }
      return {
        isSuccess: true,
        data: res.data.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        msg: error.response.data.rtnMsg
      };
    }
  },
  // 確認 bo admin 密碼
  async checkBOPassword(obj) {
    try {
      const res = await axiosInstance.post(`/auth/validate-boadmin-password`, obj);
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
  async changePassword(obj) {
    try {
      const res = await axiosInstance.post(`/backend-users/password`, obj);
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
  async patchRoleStatus(obj) {
    try {
      const res = await axiosInstance.post(`/backend-users/status`, obj);
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
  async getUser(obj) {
    try {
      const res = await axiosInstance.post(`/backend-users/account-info`, obj);
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
  async editAccount(obj) {
    try {
      const res = await axiosInstance.post(`/backend-users/update`, obj);
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
