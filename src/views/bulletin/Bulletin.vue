<template>
  <div class="container">
    <Drawer class="fix" />
    <div class="w-100 my-2">
      <div class="title">公告管理</div>

      <!-- <div class="custom-container">
        <v-btn
          v-for="button in buttons"
          :key="button.id"
          :variant="button.variant"
          class="custom-btn"
          @click="handleButtonClick(button.id)"
          :class="{ active: activeButton === button.id }"
        >
          {{ button.label }}
        </v-btn>
      </div> -->

      <div>
        <!-- <AnnouncementAdminPage v-if="activeButton === 1" /> -->
        <!-- <AnnouncementAdminPage v-if="activeButton === 2" /> -->
        <!-- <AnnouncementAdminPage v-if="activeButton === 3" /> -->
        <AnnouncementAdminPage :type="activeButton" />
        <!-- <photo v-if="activeButton === 4" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
//   import news from '@/components/news.vue'
//   import announcements from '@/components/announcements.vue'
//   import photo from '@/components/photo.vue'
//   import newsquarterly from '@/components/newsquarterly.vue'
import AnnouncementAdminPage from '@/views/bulletin/AnnouncementAdminPage.vue';

export default {
  components: {
    AnnouncementAdminPage
  },
  data() {
    return {
      activeButton: 1, // 預設顯示的組件
      buttons: [
        { id: 1, label: '最新消息', variant: 'outlined' },
        { id: 2, label: '公告事項', variant: 'outlined' },
        { id: 3, label: '季刊公告', variant: 'outlined' },
        { id: 4, label: '活動剪影', variant: 'outlined' }
      ],

      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' }
      ],

      search: '',

      page: 1,
      pages: 10
    };
  },
  mounted() {
    if (this.$route.query.type) {
      const type = parseInt(this.$route.query.type);
      this.setActiveButtonByType(type);
    }
  },
  watch:{
    activeButton(){
      localStorage.setItem('pageType', this.activeButton);
    }
  },
  methods: {
    handleButtonClick(buttonId) {
      this.activeButton = buttonId;
      // 根據 activeButton 設定搜尋的 type
      const type = this.activeButton === 1 ? 0 : (this.activeButton - 1); 
      this.$router.push({ path: '/admin/bulletin', query: { type } });
    },
    setActiveButtonByType(type) {
      switch (type) {
        case 0:
          this.activeButton = 1; // 最新消息
          break;
        case 1:
          this.activeButton = 2; // 公告事項
          break;
        case 2:
          this.activeButton = 3; // 季刊公告
          break;
        case 3:
          this.activeButton = 4; // 活動剪影
          break;
        default:
          this.activeButton = 1; // 預設顯示
      }
    },
    editItem(item) {
      // 编辑逻辑
    },
    chargeItem(item) {
      // 繳費紀錄逻辑
    },
    deleteItem(item) {
      // 删除逻辑
    }
  },
  checkCheckbox() {
    if (this.checkAllItem) {
      this.checkItem = this.tableItems.map((item) => item.id);
    } else {
      this.checkItem = [];
    }
  },
  sortDBList(header) {
    // 排序邏輯
  },
  getStatusClass(status) {
    return {
      'text-success': status === '已編輯',
      'text-error': status !== '已編輯'
    };
  },
  transferStatus(status) {
    return status === '已編輯' ? '已編輯' : '未編輯';
  },
  formatDate(date) {
    return date;
  },
  previewWord(item) {
    // 預覽邏輯
  },
  editWord(item) {
    // 編輯邏輯
  },
  returnToAllDatabaseView(item) {
    // 返回總資料庫邏輯
  },
  historyView(wordId) {
    // 查看歷程邏輯
  },
  deleteView(item) {
    // 刪除邏輯
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  /* height: 100dvh; */
  background-color: #f8f8f8;
}
.title {
  font-size: 2.25rem; /* 36px */
  line-height: 56px;
  font-weight: 700;
  margin: 0px 0px 16px 0px;
}

.custom-btn {
  height: 48px;
  border-radius: 4px 4px 0px 0px;
  padding: 12px 24px 12px 24px;
  border-width: 1px 1px 0px 1px;
  margin-right: 16px !important;
}
.custom-btn:last-child {
  margin-right: 0 !important;
}

.custom-btn:focus,
.custom-btn.active {
  background-color: #222 !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

.custom-container {
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000;
  display: inline-block;
  /* margin-bottom: 30px; */
}

.flex-container {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addBtn {
  padding: 12px 24px 12px 24px;
  border-radius: 4px;
  width: 112px;
  height: 48px;
  background: #1b2482;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
}

.v-tab {
  background-color: transparent !important;
  padding: 8px 16px 8px 16px;
}
.v-tabs--density-default {
  --v-tabs-height: 40px;
}

.v-tab-item--selected,
.v-tab--selected {
  background-color: transparent !important;
}

.content {
  padding: 3px 0px 3px 0px;
  justify-content: center !important;
}

.v-toolbar {
  background-color: transparent !important;
  padding: 3px 0;
  width: 600px;
  display: flex;
  align-items: center;
  height: 40px !important;
}

.search-theme {
  background-color: #dddeea;
  width: 600px;
  margin-bottom: 26px;
  padding-left: 10px;
  border-radius: 4px;
  padding-bottom: 5px;
}

:deep(.v-input__control) {
  /* background-color: #DDDEEA !important; */
  min-height: 40px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
}

.v-text-field {
  background-color: #dddeea;
  width: 600px;
  margin-bottom: 26px;
  padding-left: 10px;
  border-radius: 4px;
}

.v-container {
  padding: 16px 16px 0px 0px;
}

/* :deep(.v-field__field){
    display: flex;
    justify-content: start;
    align-items: center;
   } */

/* .outer {
  margin: 8px 28px 8px 260px;
  height: 100vh;
  flex: auto;
} */

.fix {
  position: fixed;
  left: 0px;
}

.flex-container {
  margin-top: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
