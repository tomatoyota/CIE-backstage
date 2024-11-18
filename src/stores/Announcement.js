import { defineStore } from 'pinia';

export const userAnnouncementStore = defineStore('announcementdb', {
  state: () => ({
    searchCondition: {
      announcementTitle: '',
      publishDate: [],
      department: '',
      createDate: [],
      sortDirection: '',
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      type: 1
    },
    editViewData: {},
    editViewTableItem: [],
    // paginations: {
    //   currentPage: 1,
    //   totalCount: 0,
    //   totalPages: 1
    // },
    paginations: [
      {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      }
    ],
    editStatus: [],
    checkItem: []
  }),
  actions: {
    updateSearchCondition(newCondition) {
      this.searchCondition = newCondition;
    },
    updateType(newType) {
      this.searchCondition.type = newType;
    },
    updateEditViewTableItem(editViewTableItem) {
      this.editViewTableItem = editViewTableItem;
    },
    updatePagination(paginations, type) {
      this.paginations[type - 1] = paginations;
    },
    updateEditStatus(editStatus) {
      this.editStatus = editStatus;
    },
    updateCurrentPage(currentPage, type) {
      this.paginations[type - 1].currentPage = currentPage;
    },
    updateChecklistItem(checkItem) {
      this.checkItem = checkItem;
    }
  }
});
