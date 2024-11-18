<template>
  <div class="">
    <!-- <Drawer class="fix"/> -->

    <div class="my-2">
      <div class="title">出版品管理</div>

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
        <JournalAdminPage v-if="activeButton === 2" />
        <QuarterlyAdminPage v-if="activeButton === 1" />
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import JournalAdminPage from '@/views/admin/AcademicAdminPage.vue'
import QuarterlyAdminPage from '@/views/admin/QuarterlyAdminPage.vue'


export default {
  components: {
    JournalAdminPage,
    QuarterlyAdminPage
  },
  data() {
    return {
      activeButton: 1, // 預設顯示的組件
      buttons: [
        { id: 1, label: '會刊管理', variant: 'outlined' },
        { id: 2, label: '學刊管理', variant: 'outlined' }
      ]
    }
  },
  methods: {
    
    handleButtonClick(buttonId) {
      this.activeButton = buttonId
    }
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

.custom-container {
  display: grid;
  grid-template-columns: 80px 120px;
  gap: 0.25rem; /* 4px */
  justify-content: space-between;
  align-items: center;
}

:deep(.v-selection-control--density-default) {
  --v-selection-control-size: 30px !important;
}
:deep(.v-selection-control__input) {
  align-items: center;
  display: flex;
  flex: none;
  justify-content: start;
  position: relative;
  border-radius: 50%;
  padding: 0px !important;
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
.v-field--focused {
}

.v-container {
  padding: 16px 16px 0px 0px;
}

.outer {
  margin: 8px 28px 8px 260px;
  height: 100vh;
  flex: auto;
}

.fix{
  position: fixed;
  left: 0px;
}

.select-width {
  width: 196px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  justify-items: center;
}

.bold {
  font-size: 16px;
  font-weight: 700;
}
</style>
