export const MENU = [
  {
    key: 'trang-chu',
    url: 'trang-chu',
    label: 'Trang chủ',
    icon: 'home',
    fullAssess: true,
    released: true,
    children: [
      {
        key: 'trang-chu.trang-chinh',
        url: 'trang-chinh',
        label: 'Trang chính',
        icon: 'fiber_manual_record',
        fullAssess: true,
        released: false,
      },
      {
        key: 'trang-chu.kinh',
        url: 'kinh',
        label: 'Kinh',
        icon: 'menu_book',
        fullAssess: true,
        released: true,
      },
      {
        key: 'trang-chu.thanh-ngon-hiep-tuyen',
        url: 'thanh-ngon-hiep-tuyen',
        label: 'Thánh Ngôn Hiệp Tuyển',
        icon: 'auto_stories',
        fullAssess: true,
        released: true
      },
      {
        key: 'trang-chu.thu-vien',
        url: 'thu-vien',
        label: 'Thư viện',
        icon: 'library_books',
        fullAssess: true,
        released: false,
      },
      {
        key: 'trang-chu.thanh-that',
        url: 'thanh-that',
        label: 'Thánh Thất',
        icon: 'location_city',
        fullAssess: true,
        released: false,
      }
    ]
  },
  {
    key: 'lich',
    url: 'lich',
    label: 'Lịch',
    icon: 'today',
    fullAssess: true,
    released: true,
    children: [
      {
        key: 'lich.su-kien',
        url: 'su-kien',
        label: 'Sự kiện',
        icon: 'bookmark_border',
        fullAssess: true,
        released: false,
      },
      {
        key: 'lich.tinh-tuan-cuu',
        url: 'tinh-tuan-cuu',
        label: 'Tính Tuần Cửu',
        icon: 'calculate',
        fullAssess: true,
        released: true,
      }
    ]
  },
  {
    key: 'tac-vu',
    url: 'tac-vu',
    label: 'Tác vụ',
    icon: 'commit',
    fullAssess: false,
    released: true,
    children: [
      {
        key: 'tac-vu.cau-sieu-vo-vi',
        url: 'cau-sieu-vo-vi',
        label: 'Cầu siêu vô vi',
        icon: 'circle',
        fullAssess: false,
        released: true,
        voViWorkspace: true,
      },
      {
        key: 'tac-vu.phong-le',
        url: 'phong-le',
        label: 'Phòng lễ',
        icon: 'circle',
        fullAssess: false,
        released: true,
      },
      {
        key: 'tac-vu.phong-tho',
        url: 'phong-tho',
        label: 'Phòng Thơ',
        icon: 'circle',
        fullAssess: false,
        released: true,
      },
    ]
  }
]
