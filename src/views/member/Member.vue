<template>
  <div class="">
    <!-- <Drawer class="fix" /> -->
    <div class="w-100 my-2">
      <!-- <v-text-field
        prepend-icon="mdi-magnify"
        hide-details
        single-line
        label="輸入公告關鍵字搜尋"
        density="comfortable"
        variant="plain"
        class="search-theme"
      ></v-text-field> -->

      <div class="title">會員管理</div>

      <div class="btn-container">
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
      </div>

      <div class="custom-table">
        <MemberProfile v-if="activeButton === 1"/>
        <Print v-if="activeButton === 2"/>
        <payments v-if="activeButton === 3"/>
        <!-- <newsquarterly v-if="activeButton === 3"/>
        <photo v-if="activeButton === 4"/> -->
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

// import personal from '@/components/personal.vue'
// import student from '@/components/student.vue'
// import Drawer from '@/components/Drawer.vue'
import MemberProfile from '@/views/member/MemberProfile.vue'
import Print from '@/views/member/Print.vue'
import Payments from '@/views/member/Payments.vue'
// import payments from '@/components/payments.vue'


export default {
  components: {
    MemberProfile,
    Print,
    Payments
  },
  data() {
    return {
      activeButton: 1, // 預設顯示的組件
      buttons: [
        { id: 1, label: '會員列表', variant: 'outlined' },
        { id: 2, label: '資料列印', variant: 'outlined' },
        { id: 3, label: '年費繳交註記', variant: 'outlined' }
      ],
      search: '',

      page: 1,
      pages: 10
    }
  },
  methods: {
    goToMember_add() {
      this.$router.push('/addmember')
    },
    handleButtonClick(buttonId) {
      this.activeButton = buttonId
    },
    getStatusClass(status) {
      return status === '已繳費' ? 'paid' : 'unpaid'
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
  handleButtonClick(buttonId) {
    this.activeButton = buttonId
  },

  checkCheckbox() {
    if (this.checkAllItem) {
      this.checkItem = this.tableItems.map((item) => item.id)
    } else {
      this.checkItem = []
    }
  },
  sortDBList(header) {
    // 排序邏輯
  },
  getStatusClass(status) {
    return {
      'text-success': status === '已編輯',
      'text-error': status !== '已編輯'
    }
  },
  transferStatus(status) {
    return status === '已編輯' ? '已編輯' : '未編輯'
  },
  formatDate(date) {
    return date
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
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100dvh;
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
  margin-right: 7px !important;
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

.btn-container {
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000;
  /* width: 383px; */
  display: inline-block;
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

.outer {
  margin: 8px 28px 8px 260px;
  height: 100vh;
  flex: auto;
}

.fix{
  position: fixed;
  left: 0px;
}

.custom-table {
  /* display: flex;
  flex-direction: column; */
}
</style>