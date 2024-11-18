<template>
  <div class=" pb-10 mb-10 vh-100">
    <v-row class="mb-4" align="center" no-gutters>
      <v-icon class="mr-2" size="x-large" @click="backToList">mdi mdi-chevron-left</v-icon>
      <div class="title">新增文章</div>
    </v-row>
    <v-form v-model="validation" class="mb-4">
      <v-col class="mb-3 width">
        <div class="bold">標題</div>
        <v-text-field placeholder="請輸入標題" variant="outlined" flat v-model="formData.announcementTitle" :rules="rules"></v-text-field>

        <v-col class="width2">
          <div class="bold">類別</div>
          <v-select
            placeholder="請選擇類別"
            density="compact"
            :items="[
              { label: '最新消息', value: 1 },
              { label: '公告事項', value: 2 },
              { label: '季刊公告', value: 3 },
              { label: '活動剪影', value: 4 }
            ]"
            variant="outlined"
            flat
            v-model="formData.type"
            item-title="label"
            item-value="value"
          ></v-select>
        </v-col>
        <v-row class="mb-3">
          <v-col>
            <div class="bold">發佈日期</div>
            <VueDatePicker
              label="發布日期"
              :max-date="formData.expiredAt ? dateFormat(formData.expiredAt, 'max') : null"
              v-model="formData.releaseAt"
              :teleport="true"
              format="yyyy/MM/dd"
              placeholder="發布日期"
              :enable-time-picker="false"
            >
            </VueDatePicker>
          </v-col>
          <v-col>
            <div class="bold">到期日期</div>
            <VueDatePicker
              label="下架日期"
              :min-date="formData.releaseAt ? dateFormat(formData.releaseAt, 'min') : null"
              v-model="formData.expiredAt"
              :teleport="true"
              format="yyyy/MM/dd"
              placeholder="下架日期"
              :enable-time-picker="false"
            >
            </VueDatePicker>
          </v-col>
        </v-row>
        
        <div v-if="formData.type === 4">
          <div class="bold">相簿連結</div>
          <v-text-field placeholder="請輸入相簿連結" variant="outlined" flat v-model="formData.albumUrl" :rules="albumUrlRules"
          :required="isAlbumUrlRequired"></v-text-field>
        </div>
      </v-col>
    </v-form>
    <quill-editor v-if="formData.type !== 4" v-model="formData.content" ref="myQuillEditor" :options="editorOptions" @text-change="handleTextChange"></quill-editor>
    <div class="buttonGroup text-center mt-8">
      <v-btn flat color="#F5F5F5" class="mr-2" @click="backToList()"> 返回列表 </v-btn>
      <v-btn v-if="formData.type !== 4" flat color="#F5F5F5" class="mr-2" @click="openPreview"> 預覽 </v-btn>
      <v-btn v-if="!isEdit" variant="flat" color="success" class="mr-2" :disabled="!validation" @click="postAnnouncement('post')">
        儲存
      </v-btn>
      <v-btn v-else variant="flat" color="success" class="mr-2" :disabled="!validation" @click="postAnnouncement('put')"> 儲存 </v-btn>

      <!-- 新增相簿 -->
      <v-btn v-if="formData.type === 4 && !isEdit" @click="submitAlbum('post')">儲存post</v-btn>

      <!-- 編輯相簿 -->
      <v-btn v-if="formData.type === 4 && isEdit" @click="submitAlbum('put')">儲存</v-btn>

    </div>

    <!-- 預覽對話框 -->
    <v-dialog v-model="previewDialog" max-width="800px">
      <v-card>
        <v-card-text>
          <div class="title-underline">
    <h4 class="announcement-title">{{ previewData.announcementTitle }}</h4>
    <div class="release-date">{{ dateFormat(previewData.releaseAt) }}</div>
  </div>
          <div class="announcement-content" v-html="previewData.content"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="previewDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
import Quill from 'quill';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import announcementSrv from '@/service/announcement.js';
import { CloseOutlined } from '@ant-design/icons-vue';
import { userAnnouncementStore } from '@/stores/Announcement.js';

export default {
  components: {
    VueDatePicker,

  },
  data() {
    return {
      isEdit: false,
      formData: {
        announcementTitle: '',
        type: '',
        releaseAt: '',
        expiredAt: '',
        updatedAt: '',
        albumUrl: '',
        content: ''
      },
      transformedHTML: '',
      newsId: '',
      validation: false,
      previewDialog: false, // 預覽框狀態
      previewData: { // 預覽資料
        announcementTitle: '',
        releaseAt: '',
        expiredAt: '',
        content: ''
      },
      rules: [(v) => !!v || '此欄位為必填'],
      albumUrlRules: [],
      isAlbumUrlRequired: false,
      dateRules: {
        notNull: (v) => !!v || '此欄位不能為空'
      },
      editorOptions: {
        modules: {
          toolbar: [
            // ['bold', 'italic', 'underline', 'strike'],
            // [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            // [{ color: [] }],
            // [{ indent: '-1' }, { indent: '+1' }],
            // ['link', 'image']
            [{ header: '1' }, { header: '2' }, { font: [] }], // 標題和字體
            [{ color: [] }, { background: [] }], // 字體顏色和背景顏色
            ['bold', 'italic', 'underline', 'strike'], // 粗體、斜體、底線、刪除線
            ['link', 'image', 'video'], // 插入超連結、圖片和視頻
            [{ align: [] }], // 對齊
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表和無序列表
            [{ indent: '-1' }, { indent: '+1' }], // 增加或減少縮進
            ['blockquote', 'code-block'], // 引用和代碼塊
            [{ script: 'sub' }, { script: 'super' }], // 上標和下標
            ['clean'] // 清除格式
          ],
          clipboard: {
            matchers: [
              [
                Node.TEXT_NODE,
                function (node, delta) {
                  // 將每個空白字符轉換成 &nbsp;
                  delta.ops = delta.ops.map((op) => {
                    if (typeof op.insert === 'string') {
                      op.insert = op.insert.replace(/ /g, '\u00a0');
                    }
                    return op;
                  });
                  return delta;
                }
              ]
            ]
          }
        },
        theme: 'snow',
        placeholder: '請輸入公告內容'
      },
      editData: {}
    };
  },
  watch: {
    'formData.type': {
      handler(newType) {
        if (newType === 4) {
          this.formData.content = null; // 將 content 設為 null
        } else {
          this.formData.content = ''; // 或者設為空字串，根據需求而定
        }
      },
      immediate: true
    },
    'formData.announcementTitle': {
      handler(val) {
        if (val === '') {
          this.validation = false;
        }
      },
      deep: true
    },
    'formData.releaseAt': {
      handler(val) {
        if (val && this.formData.expiredAt === '') {
          this.validation = false;
        } else if (val && this.formData.expiredAt !== '') {
          this.validation = true;
        } else if (!val) {
          this.validation = false;
        }
      },
      deep: true
    },
    'formData.expiredAt': {
      handler(val) {
        if (val && this.formData.releaseAt === '') {
          this.validation = false;
        } else if (val && this.formData.releaseAt !== '') {
          this.validation = true;
        } else if (!val) {
          this.validation = false;
        }
      },
      deep: true
    },
    // 'formData.content': function (newValue) {
    //   console.log('formData.content has been updated:', newValue);
    // },
    'formData.type': 'validateAlbumUrl',
    validation: {
      handler(n) {
        if (
          this.formData.releaseAt === '' ||
          this.formData.expiredAt === '' ||
          this.formData.releaseAt === null ||
          this.formData.expiredAt === null ||
          this.formData.announcementTitle === ''
        ) {
          this.validation = false;
        } else {
          this.validation = true;
        }
      },
      immediate: true
    }
  },
  computed: {
    // activeTabType() {
    //   const store = userAnnouncementStore();
    //   return store.searchCondition.type;  // 獲取 store 中的 type 值
    // }
  },
  mounted() {
    const store = userAnnouncementStore();
    const pageTypeStore = store.searchCondition;
    const pageType = pageTypeStore.type;
    this.formData.type = pageType;

    const editData = JSON.parse(localStorage.getItem('editData'));
    const isEdit = JSON.parse(localStorage.getItem('isEdit'));
    this.isEdit = isEdit;
    if (editData) {
      this.getEdit(editData);
    } else {
      this.$refs.myQuillEditor.setContents([{ insert: '\n' }, { insert: '\n' }, { insert: '\n' }, { insert: '\n' }]);
    }
  },
  methods: {
    // setPageTitle(){
    //   const action = this.$route.query.action;
    //   let actionTitle = ''
    //   if(action === 'add'){
    //     actionTitle = '新增文章'
    //   }else if(action === 'edit'){
    //     actionTitle = '編輯文章'
    //     const store = useQuarterStore()
    //     const { editData } = storeToRefs(store);
        
    //     this.formData = editData
    //   }
    //   this.pageTitle = actionTitle
    //   this.$router.replace('/admin/quarterlyView')
    // },
    // triggerImageFileUpload() {
    //   this.$refs.fileInput.click()
    // },
    // triggerEbookFileUpload() {
    //   this.$refs.fileInputEbook.click()
    // },
    // onImageFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const fileName = encodeURIComponent(file.name);
    //     this.coverImage = file;
    //     this.uploadFile(1, fileName);
    //   }
    // },
    backToList() {
      const type = this.determineType();
      this.$router.push({ path: '/admin/Bulletin', query: { type } });
      // this.$router.push('/admin/Bulletin');
    },
    openPreview() {
      // 在這裡填充預覽資料
      this.previewData.announcementTitle = this.formData.announcementTitle;
      this.previewData.releaseAt = this.formData.releaseAt;
      this.previewData.expiredAt = this.formData.expiredAt;
      this.previewData.content = this.formData.content; // 如果需要處理HTML格式，可以使用其他方法
      // console.log("内容: ", this.formData.content); // 檢查用
      // console.log("Preview content:", this.previewData.content); // 調試輸出
      this.previewDialog = true; // 打開預覽框
    },
    
    determineType() {
      return '1';
    },
    getEdit(editData) {
      this.$refs.myQuillEditor.pasteHTML(editData.content);
      this.formData.announcementTitle = editData.title;
      this.formData.type = editData.type;
      this.formData.releaseAt = editData.releaseAt;
      this.formData.expiredAt = editData.expiredAt;
      this.formData.albumUrl = editData.albumUrl;
      this.newsId = editData.announcementsId;
      this.editData = editData;
      // console.log(editData)
    },
    handleTextChange() {
      const quillEditor = this.$refs.myQuillEditor;
      const text = quillEditor.getText();
      const html = quillEditor.getHTML();

      // 檢查是否有空白字符
      if (text.includes(' ')) {
        const newHtml = html.replace(/ /g, '&nbsp;');
        this.transformedHTML = newHtml;
      }
      // 確認內容是否更新
  this.formData.content = html; // 確保更新formData.content
  // console.log('Current content:', this.formData.content); // 調試輸出
    },
    postAnnouncement(action) {
      let content = this.transformedHTML;
      if (content === '') {
        const quillInstance = this.$refs.myQuillEditor;
        content = quillInstance.getHTML();
      }

      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1);
      }

      const imgTags = content.match(/<img [^>]*src="[^"]*"[^>]*>/g);
      if (imgTags && imgTags.length > 0) {
        this.imageHandler(content, imgTags).then(({ content, updatedImgTags, imgFiles }) => {
          this.finalizePost(content, imgFiles, action);
        });
      } else {
        this.finalizePost(content, [], action);
      }
    },
    finalizePost(content, imgFiles, action) {
      let releaseAt = String(this.formData.releaseAt);
      let expiredAt = String(this.formData.expiredAt);

      if (releaseAt.includes('GMT')) {
        releaseAt = this.dateFormat(releaseAt);
      } else if (releaseAt.includes('T')) {
        const dateStr = new Date(releaseAt);
        const year = dateStr.getFullYear();
        const month = String(dateStr.getMonth() + 1).padStart(2, '0');
        const day = String(dateStr.getDate()).padStart(2, '0');
        releaseAt = `${year}-${month}-${day}`;
      }

      if (expiredAt.includes('GMT')) {
        expiredAt = this.dateFormat(expiredAt);
      } else if (expiredAt.includes('T')) {
        const dateStr = new Date(expiredAt);
        const year = dateStr.getFullYear();
        const month = String(dateStr.getMonth() + 1).padStart(2, '0');
        const day = String(dateStr.getDate()).padStart(2, '0');
        expiredAt = `${year}-${month}-${day}`;
      }
      const obj = {
        title: this.formData.announcementTitle,
        content: content,
        releaseAt: releaseAt,
        expiredAt: expiredAt,
        type: this.formData.type,
        images: imgFiles
      };

      if (action === 'post') {
        announcementSrv.postAnnouncement(obj).then((res) => {
          if (res.data.rtnCode === '0000') {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push('/admin/Bulletin');
              }
            });
          } else {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          }
        });
      } else if (action === 'put') {
        obj.announcementsId = this.newsId;
        // console.log(obj)
        announcementSrv.putAnnouncement(obj).then((res) => {
          if (res.data.rtnCode === '0000') {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push('/admin/Bulletin');
              }
            });
          } else {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          }
        });
      }
    },
    dateFormat(date, action) {
      
      const dateStr = new Date(date);
      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, '0');
      const day = String(dateStr.getDate()).padStart(2, '0');
      const tmrDay = String(dateStr.getDate() + 1).padStart(2, '0');
      const yesterday = String(dateStr.getDate() - 1).padStart(2, '0');
      if (action === 'max') {
        return `${year}-${month}-${yesterday}`;
      } else if (action === 'min') {
        return `${year}-${month}-${tmrDay}`;
      } else {
        return `${year}-${month}-${day}`;
      }
    },
    validateAlbumUrl() {
      if (this.formData.type === 4) {
        this.isAlbumUrlRequired = true;
        this.albumUrlRules = [
          (v) => !!v || '此欄位為必填',
          (v) => /^https:\/\/.*/.test(v) || '必須是以 https:// 開頭的有效網址',
        ];
      } else {
        this.isAlbumUrlRequired = false;
        this.albumUrlRules = [];
        this.formData.albumUrl = ''; // 清空 albumUrl
      }
    },
    imageHandler(content, imgTags) {
      let imgFiles = [];
      return Promise.all(
        imgTags.map((imgTag) => {
          return new Promise((resolve) => {
            let tempElem = document.createElement('div');
            tempElem.innerHTML = imgTag;
            let imgElement = tempElem.querySelector('img');
            let src = imgElement.getAttribute('src');
            let base64Header = src.split(',')[0];
            let fileName = '';
            let blob = null;

            if (base64Header.includes('/media')) {
              // 處理路徑，代表是原本就有的圖片
              resolve(tempElem.innerHTML); // 添加 resolve，讓 Promise 正確完成
              return;
            } else {
              // 處理 base64，代表是新增的圖片
              let mimeType = base64Header.match(/:(.*?);/)[1];
              let base64Data = src.split(',')[1];
              blob = this.base64toBlob(base64Data, mimeType);
              let uuid = this.generateUUID();
              let extension = mimeType.split('/')[1];
              fileName = `${uuid}.${extension}`;
            }

            let file = this.blobToFile(blob, fileName);
            let formData = new FormData();
            formData.append('media', file);

            const currentUrl = window.location.href;
            let url;
            url = 'https://cieestage.gogotest.xyz/';
            // if (currentUrl.includes('http://localhost') || currentUrl.includes('https://devcieestage')) {
            //   url = 'https://devcieestage.gogotest.xyz/';
            // } else if (currentUrl.includes('https://cieestage')) {
            //   url = 'https://cieestage.gogotest.xyz/';
            // } else if (currentUrl.includes('https://dlearnmbo.naer.edu.tw')) {
            //   url = 'https://dlearnmbo.naer.edu.tw/';
            // }

            this.uploadMedia(formData).then((res) => {
              if (res.data.rtnCode === '0000') {
                let newSrc = url + 'public/announcement/' + res.data.files[0].originalname; // 假設 path 是返回的新圖片路徑
                imgElement.setAttribute('src', newSrc);
                const imageItem = {
                  originName: res.data.files[0].originalname,
                  realName: res.data.files[0].originalname
                };
                imgFiles.push(imageItem);
                resolve(tempElem.innerHTML);
              }
            });
          });
        })
      ).then((updatedImgTags) => {
        let updatedContent = this.updateContentWithNewImages(content, imgTags, updatedImgTags, imgFiles);
        return {
          content: updatedContent.content,
          updatedImgTags: updatedImgTags,
          imgFiles: updatedContent.imgFiles
        };
      });
    },
    generateUUID() {
      let d = new Date().getTime();
      let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
      return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = d > 0 ? (d + Math.random() * 16) % 16 | 0 : (d2 + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        d2 = Math.floor(d2 / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    updateContentWithNewImages(content, oldImgTags, newImgTags, imgFiles) {
      oldImgTags.forEach((oldTag, index) => {
        content = content.replace(oldTag, newImgTags[index]);
      });
      return { content, imgFiles };
    },
    base64toBlob(base64Data, mimeType) {
      let byteString = atob(base64Data);
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeType });
    },
    blobToFile(blob, fileName) {
      return new File([blob], fileName, { type: blob.type });
    },
    uploadMedia(formData) {
      return announcementSrv.uploadMedia(formData).then((res) => {
        return res;
      });
    },

    async submitAlbum(action){
      this.loading = true
      try{
        let releaseAt = String(this.formData.releaseAt);
        let expiredAt = String(this.formData.expiredAt);

        if (releaseAt.includes('GMT')) {
          releaseAt = this.dateFormat(releaseAt);
        } else if (releaseAt.includes('T')) {
          const dateStr = new Date(releaseAt);
          const year = dateStr.getFullYear();
          const month = String(dateStr.getMonth() + 1).padStart(2, '0');
          const day = String(dateStr.getDate()).padStart(2, '0');
          releaseAt = `${year}-${month}-${day}`;
        }

        if (expiredAt.includes('GMT')) {
          expiredAt = this.dateFormat(expiredAt);
        } else if (expiredAt.includes('T')) {
          const dateStr = new Date(expiredAt);
          const year = dateStr.getFullYear();
          const month = String(dateStr.getMonth() + 1).padStart(2, '0');
          const day = String(dateStr.getDate()).padStart(2, '0');
          expiredAt = `${year}-${month}-${day}`;
        }
        const obj = {
          title: this.formData.announcementTitle,
          releaseAt: releaseAt,
          expiredAt: expiredAt,
          type: this.formData.type,
          albumUrl: this.formData.albumUrl,
          content: '<template>/n</template>',
          images: []
        }

        let apiAction = ''
        if(action === 'post'){
          apiAction = 'postAnnouncement'
        }else if(action === 'put'){
          apiAction = 'putAnnouncement'
          obj.announcementsId = this.newsId
        }
        await announcementSrv[apiAction](obj).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              }).then((result) => {
                if(result.isConfirmed){
                  this.searchGroupMemberList()
                }
              });
            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          } else {
            // api 回傳失敗
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          }
        }).catch((error) => {
          // 處理錯誤情況
          console.error('Error:', error);
        }).finally(() => {
          // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
          this.loading = false;
        });
      }catch(error){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.vh-100 {
  min-height: calc(100vh - 48px);
}
.infoText {
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
  color: rgb(128, 128, 128);
}
.pageCheckbox {
  flex: none;
}

.bold {
  font-size: 16px;
  font-weight: 700;
}

.width {
  width: 440px;
}
.v-toolbar {
  background-color: transparent !important;
  padding: 3px 0;
  width: 600px;
  display: flex;
  align-items: center;
  height: 40px !important;
}

.width2 {
  width: 128px;
  padding: 0px !important;
}

.ql-toolbar.ql-snow {
  border: none;
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-top: none;
}

.announcement-section {
  margin-bottom: 20px;
  gap: 10px;
}

.title-underline {
  margin-bottom: 10px;
  font-weight: 600;
}

.title-underline h4 {
  margin-bottom: 12px;
}

.title-underline .release-date {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 400;
  color: #6e6e6e;
}

.title-underline::after {
  margin-top: 4px; 
  content: '';
  width: 100%;
  height: 4px;
  display: block;
  background: linear-gradient(90deg, #1b2482 0%, rgba(27, 36, 130, 0) 100%);
}
.announcement-title{
  font-weight: 700;
  font-size: 28px;
}

:deep(.dp__input) {
  background-color:#fff !important;
}
</style>