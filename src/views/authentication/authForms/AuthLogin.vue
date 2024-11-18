<script setup lang="ts">
import { ref } from 'vue';
// icons
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';

const valid = ref(false);
const show1 = ref(false);
const password = ref('');
const account = ref('');
const passwordRules = ref([(v: string) => !!v || '密碼為必填',
  (v: string) => (v && v.length >= 8) || '密碼長度至少 8 位'
]);
const emailRules = ref([(v: string) => !!v || '帳號為必填']);

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();
  return authStore.userLogin(account.value, password.value)
    .then((res: any) => {
      if (!res.isSuccess) {
          setErrors({ apiError: res.msg });
          return
      }
      Swal.fire({
          toast: true,
          icon: 'success',
          position: 'center',
          title: '登入成功',
          showConfirmButton: false,
          timer: 2000,
          width: 500,
          background: '#F0F0F2',
          padding: 25
      });
    })
    .catch((error: any) => {
      setErrors({ apiError: error.response.data.rtnMsg || error })
    });
};
</script>

<template>
  <h3 class="text-h3 text-center mb-0">登入</h3>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label>帳號</v-label>
      <v-text-field
        aria-label="email address"
        v-model="account"
        :rules="emailRules"
        placeholder="請輸入帳號"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    <div>
      <v-label>密碼</v-label>
      <v-text-field
        aria-label="password"
        v-model="password"
        :rules="passwordRules"
        autocomplete
        required
        placeholder="請輸入密碼"
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2"
      >
        <template v-slot:append>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <v-btn color="primary" :loading="isSubmitting" block class="mt-8" variant="flat" size="large" :disabled="valid" type="submit">
      登入</v-btn
    >
    <div v-if="errors.apiError" class="mt-3">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
<style lang="scss">
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
