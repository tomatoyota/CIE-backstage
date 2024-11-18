<script setup lang="ts">
import Logo from '@/layouts/dashboard/logo/LogoDark.vue';
import AuthRegister from '../authForms/AuthRegister.vue';
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <!---Register Part-->
    <v-col cols="12" lg="12" class="d-flex align-center bg-primary">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 32px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <div class="mb-5">
                <Logo />
              </div>
              <v-card elevation="0" class="loginBox">
                <v-card elevation="24">
                  <v-card-text class="pa-sm-10 pa-6">
                    <!---Register Form-->
                    <AuthRegister />
                    <!---Register Form-->
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
.blur-logo {
  position: absolute;
  filter: blur(18px);
  bottom: 0;
  transform: inherit;
}
</style>
