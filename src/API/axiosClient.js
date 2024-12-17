import axios from 'axios';

const api = axios.create({
  baseURL: 'https://naton69587-001-site1.mtempurl.com/api/',
  timeout: 30000,
});
const tentk = sessionStorage.getItem('tenTK');
export const getAllTaiKhoan = async () => {
  try {
    const response = await api.get(`/DangNhapDangKy`); // Endpoint cụ thể
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
}

export const createTaiKhoan = async (data) => {
  try {
    const response = await api.post(`/DangNhapDangKy/create?tentk=${tentk}`, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
}

export const updateTaiKhoan = async (id, data) => {
  try {
    const response = await api.put(`/DangNhapDangKy/update/${id}?tentk=${tentk}`, data);
    return response.data;
  }
  catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
}

export const updateStatusTaiKhoan = async (id) => {
  try {
    const response = await api.patch(`/DangNhapDangKy/status/${id}?tentk=${tentk}`);
    return response.data;
  }
  catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
}

export const deleteTaiKhoan = async (id) => {
  try {
    const response = await api.delete(`/DangNhapDangKy/${id}?tentk=${tentk}`);
   
    return response.data;
  }
  catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    console.log(id,tentk)
    throw error;
  }
}

export const forgerPassword = async (data) => {
  try {
    const response = await api.post(`/DangNhapDangKy/sender-otp`, data);
    return response.data;
  }
  catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
}

export const changePassWord = async (data) => {
  try {
    const response = await api.post(`/DangNhapDangKy/change-password`, data);
    return response.data;
  }
  catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
}

export default api;