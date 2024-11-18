export interface menu {
  header?: string;
  title?: string;
  name?: string;
  // icon?: object;
  to?: string;
  permissionId?: string,
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  icon? : String;
}

const sidebarItem: menu[] = [
  // {
  //     title: '首頁',
  //     name: 'Dashboard',
  //     to: '/admin/dashboard',
  //     permissionId: '',
  // },
  {
    title: '會員管理',
    name: 'Dashboard',
    to: '/admin/dashboard',
    permissionId: '',
    icon: 'mdi-account'
  },
  {
    title: '會員管理施工中',
    name: 'Member',
    to: '/admin/Member',
    permissionId: '',
    icon: 'mdi-account'
  },
  {
    title: '出版品管理',
    name: 'Publication',
    to: '/admin/publication',
    permissionId: '',
    icon: 'mdi-book-open-variant'
  },
  {
    title: '公告管理',
    name: 'Bulletin',
    to: '/admin/Bulletin',
    permissionId: '',
    icon: 'mdi-volume-source'
  },

  // {
  //   title: '前台網頁管理',
  //   children:[
  //     {
  //       title: '最新消息',
  //       name: 'Announcement',
  //       to: '/admin/Announcement',
  //       permissionId: '18',
  //     },
  //   ]
  // },
  
];

export default sidebarItem;
