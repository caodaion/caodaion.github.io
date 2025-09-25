export interface NhanSu {
    id: string; // ID
    name: string; // Tên
    gender: 'male' | 'female'; // Giới Tính
    birthDate?: Date; // Ngày Sinh
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

export interface JoinDate {
    day?: number | null; // Ngày (1-31)
    month?: number | null; // Tháng (1-12)
    year?: string; // Năm (có thể là số hoặc âm lịch như "Canh Tý")
    display?: string; // Hiển thị đẹp (VD: "15 Tháng 5 2020")
}

/**
 * Converts raw form data to a NhanSu object
 * @param formValue The value object from saveForm (UntypedFormGroup)
 * @param baseData Optional base NhanSu data (e.g. for id)
 */
export function convertNhanSuFormData(formValue: any): NhanSu {
    const result: any = {};
    // Always include id, name, gender (with defaults)
    if (formValue.id) result.id = formValue.id;
    if (formValue.name) result.name = formValue.name;
    if (formValue.gender) result.gender = formValue.gender;
    // For other properties, only include if not null/undefined/empty
    const keys = [
        'birthDate', 'title', 'profession', 'job', 'address', 'phone', 'email',
        'citizenId', 'note', 'color', 'holyName', 'place', 'joinDate', 'classification', 'journey'
    ];
    for (const key of keys) {
        const value = formValue[key];
        if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
            result[key] = value;
        }
    }
    // Set default gender if not present
    if (!result.gender) result.gender = 'male';
    return result as NhanSu;
}