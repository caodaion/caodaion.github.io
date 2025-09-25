export interface NhanSu {
    id: string; // ID
    name: string; // Tên
    gender: 'male' | 'female'; // Giới Tính
    birthDate?: any; // Ngày Sinh
    title?: string; // Phẩm Đạo
    profession?: string; // Nghề Nghiệp
    job?: Array<string>; // Chức việc
    address?: string; // Địa Chỉ
    phone?: Array<string>; // Số Điện Thoại
    email?: Array<string>; // Email
    citizenId?: string; // Căn Cước Công Dân
    note?: string; // Ghi Chú
    color?: string; // Sắc phái
    holyName?: string; // Thánh Danh
    place?: string; // Hành Đạo tại
    joinDate?: any; // Ngày nhập môn
    classification?: 'hc' | 'hp' | 'tn' | 'cc'; // 4 hạng chức sắc
    journey?: Array<Journey>; // Lịch sử hành đạo
}

export interface Journey {
    title: string; // Chức việc
    date?: any; // Ngày
    note?: string; // Ghi chú
}