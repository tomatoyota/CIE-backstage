import { api } from '../utils/axios.js'
// import userHelper from '../utils/helpers/user.js';

export default {
  //
  async test() {
    try {
      const res = await api.get('/test')
      if (res === null || res.data === null) {
        return null
      }

      if (res.data.rtnCode !== '0000') {
        return {
          isSuccess: false,
          msg: res.data.rtnMsg
        }
      }

      // userHelper.setUser(res.data.data.userData);
      // userHelper.isLogin();

      return {
        isSuccess: true,
        data: res.data
      }
    } catch (error) {
      return {
        isSuccess: false,
        msg: error.response.data.rtnMsg
      }
    }
  },
  
}
