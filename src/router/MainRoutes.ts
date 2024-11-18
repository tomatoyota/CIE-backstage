import { Components } from 'ant-design-vue/es/date-picker/generatePicker';
import { computed } from 'vue';

const MainRoutes = {
  path: '/admin',
  meta: {
    requiresAuth: true
  },
  redirect: '/admin/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: () => import('@/views/dashboard/DefaultDashboard.vue')
    },
    // 總資料庫區
    {
      name: 'AllDatabase',
      path: 'allDatabase',
      component: () => import('@/views/wordAdmin/database/AllDatabasePage.vue')
    },
    // 編輯區
    {
      name: 'DataEdit',
      path: 'dataEdit',
      component: () => import('@/views/wordAdmin/database/DataEditPage.vue')
    },
    // 編輯內頁
    {
      name: 'EditView',
      path: 'editView',
      component: () => import('@/views/wordAdmin/database/EditViewPage.vue')
    },
    // 批次匯入
    {
      name: 'ImportPage',
      path: 'importPage',
      component: () => import('@/views/wordAdmin/database/WordTextImportPage.vue')
    },
    // 檢核區
    {
      name: 'DataVerification',
      path: 'dataVerification',
      component: () => import('@/views/wordAdmin/database/DataVerificationPage.vue')
    },
    // 詳細頁
    {
      name: 'WordDetail',
      path: 'wordDetail/:wordId',
      component: () => import('@/views/wordAdmin/database/WordDetailPage.vue')
    },
    // 圖檔資料庫
    {
      name: 'ImageDatabase',
      path: 'imageDatabase',
      component: () => import('@/views/wordAdmin/ImageDatabasePage.vue')
    },
    // 圖檔批次上傳
    {
      name: 'UploadImage',
      path: 'uploadImage',
      component: () => import('@/views/wordAdmin/UploadImagePage.vue')
    },
    // 聲音檔資料庫管理
    {
      name: 'SoundFileDb',
      path: 'soundFileDb',
      component: () => import('@/views/wordAdmin/SoundFileDbPage.vue')
    },
    // 音檔批次上傳
    {
      name: 'UploadAudio',
      path: 'uploadAudio',
      component: () => import('@/views/wordAdmin/UploadAudioPage.vue')
    },
    // IP 管理
    {
      name: 'IPAdmin',
      path: 'IPAdmin',
      component: () => import('@/views/admin/IPAdminPage.vue')
    },
    // IP 內頁 (新增/編輯)
    {
      name: 'IPView',
      path: 'IPView',
      component: () => import('@/views/admin/IPViewPage.vue')
    },
    // 角色 / 權限管理
    {
      name: 'RolePermissionAdmin',
      path: 'rolePermissionAdmin',
      component: () => import('@/views/admin/rolePermissionAdminPage.vue')
    },
    // 新增角色
    {
      name: 'AddRole',
      path: 'AddRole',
      component: () => import('@/views/admin/AddRolePage.vue')
    },
    // 帳號管理
    {
      name: 'AccountAdmin',
      path: 'accountAdmin',
      component: () => import('@/views/admin/AccountAdminPage.vue')
    },
    // 新增帳號
    {
      name: 'AddAccount',
      path: 'addAccount',
      component: () => import('@/views/admin/AddAccountPage.vue')
    },
    // 資料管理者與審核者對應
    {
      name: 'UserRelations',
      path: 'userRelations',
      component: () => import('@/views/admin/UserRelationsAdminPage.vue')
    },
    // 帳號關係對應內頁
    {
      name: 'UserRelationsView',
      path: 'userRelationsView',
      component: () => import('@/views/admin/UserRelationsAdminPageView.vue')
    },
    // 最新消息列表
    {
      name: 'Announcement',
      path: 'announcement',
      component: () => import('@/views/bulletin/AnnouncementAdminPage.vue')
    },
    // 最新消息內頁
    {
      name: 'AnnouncementView',
      path: 'announcementView',
      component: () => import('@/views/bulletin/AnnouncementViewPage.vue')
    },
    // 字音對應表
    {
      name: 'Phonetics',
      path: 'phonetics',
      component: () => import('@/views/admin/PhoneticsAdminPage.vue')
    },
    // 字音對應表內頁
    {
      name: 'PhoneticsView',
      path: 'phoneticsView',
      component: () => import('@/views/admin/PhoneticsViewPage.vue')
    },
    // 批次修改
    {
      name: 'BatchEdit',
      path: 'batchEdit',
      component: () => import('@/views/wordAdmin/database/BatchEditPage.vue')
    },
    {
      name: 'Bulletin',
      path: 'bulletin',
      component: () => import('@/views/bulletin/Bulletin.vue')
    },
    {
      name: 'Publication',
      path: 'publication',
      component: () => import('@/views/publication/Publication.vue')
    },
    {
      name: 'Academic',
      path: 'academic',
      component: () => import('@/views/admin/AcademicAdminPage.vue')
    },
    {
      name: 'AcademicView',
      path: 'academicView',
      component: () => import('@/views/admin/AcademicViewPage.vue')
    },
    {
      name: 'Quarterly',
      path: 'quarterly',
      component: () => import('@/views/admin/QuarterlyAdminPage.vue')
    },
    {
      name: 'QuarterlyView',
      path: 'quarterlyView',
      component: () => import('@/views/admin/QuarterlyViewPage.vue')
    },
    {
      name: 'Member',
      path: 'member',
      component: () => import('@/views/member/Member.vue')
    },
    //新增/編輯個人會員頁面
    {
      name: 'PersonalView',
      path: 'personalView',
      component: () => import('@/views/member/PersonalViewPage.vue')
    },
    // 個人會員繳費紀錄
    {
      name: 'PersonalPaymentView',
      path: 'personalPaymentView',
      component: () => import('@/views/member/PersonalPaymentPage.vue')
    },
    // 影印標籤貼紙
    {
      name: 'PrintPage',
      path: 'PrintPage',
      component: () => import('@/views/member/PrintPage.vue')
    },
    // 影印收據
    {
      name: 'PrintInvoice',
      path: 'printInvoice',
      component: () => import('@/views/member/PrintInvoice.vue')
    },
    {
      name: 'GroupView',
      path: 'groupView',
      component: () => import('@/views/member/GroupViewPage.vue')
    },
    // 個人會員繳費紀錄
    {
      name: 'GroupPaymentView',
      path: 'groupPaymentView',
      component: () => import('@/views/member/GroupPaymentPage.vue')
    },
    {
      name: 'StudentView',
      path: 'studentView',
      component: () => import('@/views/member/StudentViewPage.vue')
    },
    // {
    //   name: 'MemberAdmin',
    //   path: 'memberAdmin',
    //   component: () => import('@/views/admin/MemberAdminPage.vue')
    // },
    // {
    //   name: 'MemberView',
    //   path: 'memberView',
    //   component: () => import('@/views/admin/MemberViewPage.vue')
    // },
  ]
};

export default MainRoutes;
