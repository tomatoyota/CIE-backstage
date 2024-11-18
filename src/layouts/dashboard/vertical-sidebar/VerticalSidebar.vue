<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="60"
    mobile-breakpoint="lg"
    app
    class="leftSidebar drawerWidth"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!-- <div class="px-5 py-2 w-100">
      <Logo />
    </div> -->
    <v-list-item class="my-2 round">
      <v-list-item-title class="text-style">
        <v-icon color="#1B2482" class="mr-2">mdi mdi-chevron-left</v-icon> 退出控制台
      </v-list-item-title>
    </v-list-item>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="">
      <v-list aria-busy="true" aria-label="menu list" class="text-style"
      >
        <!---Menu Loop -->
        <template v-for="(item, i) in renderSidebarMenu" :key="i">
          <!---Item Sub Header -->
          <!-- <NavGroup :item="item" v-if="item.header" class="bg-primary text-white" :key="item.title" /> -->
          <!---Item Divider -->
          <v-divider class="bg-primary py-3" v-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" class="text-style" v-else/>
          <!---End Single Item-->
        </template>
      </v-list>
    </perfect-scrollbar>
    <a href="#" @click.prevent="logout" class="logout d-block text-center text-lightprimary text-decoration-none py-3">
      登出
    </a>
  </v-navigation-drawer>
</template>

<script setup>
import { shallowRef, onMounted, ref } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTabsStore } from '@/stores/Tabs.js';
import { useAuthStore } from '@/stores/auth';
import sidebarItems from './sidebarItem';
import Swal from 'sweetalert2/dist/sweetalert2.js';

// import NavGroup from './NavGroup/NavGroup.。vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoDark.vue';
import { WindowsFilled } from '@ant-design/icons-vue';

const customizer = useCustomizerStore();
const tabsStore = useTabsStore();
const sidebarMenu = shallowRef(sidebarItems);

const { tabsList } = storeToRefs(tabsStore);
const tabs = ref(tabsList); // 列表

const route = useRoute();
const router = useRouter();

function setTabsList () {
  sidebarMenu.value.forEach(item => {
      // 檢查是否有子項目
      if (item.children) {
          item.children.forEach(child => {
            if (child.to === route.path) {
              tabs.value.push(child);
            };
          });
      } else {
          // 如果沒有子項目，直接檢查當前項目的路徑是否與目標路徑匹配
          if (item.to === route.path) {
            tabs.value.push(item);
          }
      };
  });

  // 編輯內頁 editView, 批次匯入 importPage --> 導回編輯區 dataEdit
  if (route.path.includes('editView')|| route.path.includes('importPage')) {
    tabs.value.push({
      title: '編輯區',
      to: '/admin/dataEdit'
    });
    router.replace('/admin/dataEdit');
  };
};

onMounted(() => {
  // 找尋一樣路由，放到 tabsList 內
  setTabsList();
});

// 登出
const authStore = useAuthStore();
const logout = () => {
  authStore.logout().then((res) => {
    if (!res.isSuccess) {
          Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.msg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
          });
          return
      };
      Swal.fire({
          toast: true,
          icon: 'success',
          position: 'center',
          title: `登出成功`,
          showConfirmButton: false,
          timer: 2000,
          width: 500,
          background: '#F0F0F2',
          padding: 25
      });
      tabsStore.clearTabsList(); // 清除
      router.push('/');
  });
}

onMounted(() => {
  // 取得頁面權限
  // const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
  // getPagePermission(user);
  renewSidebarMenu()
});

// 取得頁面權限
const pagePermissions = ref([]);
const getPagePermission = (user) => {

  // 如果account status === -1 (最高權限) 則賦予全部權限
  if(user.accountStatus === -1){
    sidebarMenu.value.forEach(g => {
      if(g.permissionId){
        pagePermissions.value.push(Number(g.permissionId))
      }
      if(g.children && g.children.length > 0){
        g.children.forEach(i => {
          pagePermissions.value.push(Number(i.permissionId))
        })
      }
    })
  }else{
    user.permissions.forEach(i => {
      if (i.permissionId !== '') {
        pagePermissions.value.push(Number(i.permissionId));
      }
    });
  }
  renewSidebarMenu()
}


const renderSidebarMenu = ref([]);
const renewSidebarMenu = () => {
  // renderSidebarMenu.value = [];
  renderSidebarMenu.value = sidebarMenu.value;
  
  // sidebarMenu.value.forEach(g => {
  //   if (g.children) {
  //     const filteredChildren = g.children.filter(i => {
  //       if (i.permissionId === '') {
  //         return true; // 不用特別檢查
  //       } else {
  //         return pagePermissions.value.includes(Number(i.permissionId));
  //       }
  //     });

  //     // 如果大項目裡面的子項目有權限，則將該大項目及子項目推送到 renderSidebarMenu
  //     if (filteredChildren.length > 0) {
  //       renderSidebarMenu.value.push({
  //         ...g,
  //         children: filteredChildren
  //       });
  //     }
  //   }
  // });
};


</script>
<style scoped>
.align-center {
  display: flex;
  align-items: center;
}

.drawerWidth {
  width: 240px !important;
  background-color: #fff;
  height: 100%;
}

.text-style {
  font-size: 16px;
  font-weight: 700;
  color: #1b2482;
  margin-left: 8px;
}
.v-list-item {
  width: 216px;
  border-radius: 4px !important;
}
.bgc:focus,
.bgc:active {
  background: #1b24821f;
}

.frame5352 {
  margin-bottom: 4px;
}
</style>
