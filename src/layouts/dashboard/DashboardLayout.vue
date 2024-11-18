<script setup>
import LoaderWrapper from './LoaderWrapper.vue';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import ListLayout from '@/layouts/dashboard/ListLayout.vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();

// 當前路由的路徑
const currentPath = route.path;
</script>

<template>
  <v-locale-provider>
    <v-app :class="[]">
      <VerticalSidebarVue v-if="currentPath !== '/admin/printPage', currentPath !== '/admin/printInvoicePage'" />
      <VerticalHeaderVue v-if="currentPath !== '/admin/printPage', currentPath !== '/admin/printInvoicePage'"  />

      <v-main class="page-wrapper">
        <div class="bg-white px-4 py-2">
          <!-- Loader start -->
          <LoaderWrapper />
          <!-- Loader end -->
           
          <RouterView />
        </div>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
