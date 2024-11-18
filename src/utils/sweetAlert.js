import Swal from 'sweetalert2/dist/sweetalert2.js';

const swalWithCustomStyles = Swal.mixin({
  customClass: {
    confirmButton: 'swal-confirm-button', //sweetalert內定版型, scss也有一些css能調整
    cancelButton: 'swal-cancel-button',
    title: 'swal-title',
    htmlContainer: 'swal-text'
  },
  buttonsStyling: false, // 如果使用自訂樣式，這個需要設定成 false
  background: '#ffffff',
  backdrop: `rgba(34, 34, 34, 0.6)`, // swal 後面那塊透明的黑底
  width: '100%'
});

export default swalWithCustomStyles;