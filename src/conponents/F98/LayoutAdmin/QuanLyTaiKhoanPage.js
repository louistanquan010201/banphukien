import React, { useEffect, useState } from 'react';
import './Sidebar.module.css';
import Swal from 'sweetalert2';
import { getAllTaiKhoan, createTaiKhoan, updateStatusTaiKhoan, deleteTaiKhoan, updateTaiKhoan } from '../../../API/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function QuanLyTaiKhoanPage() {
    const [taiKhoanList, setTaiKhoanList] = useState([]); // State để lưu danh sách tài khoản
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Kiểm soát trạng thái thêm/sửa
    const [idTaiKhoan, setIdTaiKhoan] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tenTK: '',
        hoTen: '',
        email: '',
        diaChi: '',
        phone: '',
        roles: '',
        password: '',
    });

    //  kiểm lỗi
    const [errors, setErrors] = useState({
        tenTK: '',
        hoTen: '',
        password: '',
        email: '',
        phone: '',
        diaChi: '',
        roles: '',
    });

    const validateForm = () => {
        let valid = true;
        let errors = {};

        // Kiểm tra tên đăng nhập
        if (!formData.tenTK) {
            errors.tenTK = 'Tên đăng nhập không được để trống';
            valid = false;
        }

        // Kiểm tra mật khẩu
        if (!formData.password) {
            errors.password = 'Mật khẩu không được để trống';
            valid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            valid = false;
        }

        // Kiểm tra email
        if (!formData.email) {
            errors.email = 'Email không được để trống';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
            valid = false;
        }

        // Kiểm tra số điện thoại
        if (!formData.phone) {
            errors.phone = 'Số điện thoại không được để trống';
            valid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = 'Số điện thoại phải gồm 10 chữ số';
            valid = false;
        }

        // Kiểm tra địa chỉ
        if (!formData.diaChi) {
            errors.diaChi = 'Địa chỉ không được để trống';
            valid = false;
        }

        // Kiểm tra loại tài khoản
        if (!formData.roles) {
            errors.roles = 'Vui lòng chọn loại tài khoản';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    useEffect(()=>{
        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // Cập nhật giá trị tương ứng với name của input
        });
    };
    // Hàm xử lý submit form thêm tài khoản
    const handleSubmit = async (e) => {
        try {
            if (!validateForm()) {
                console.log('Form has errors');
                return;
            }
            e.preventDefault(); // Ngăn trang reload
            if (idTaiKhoan) {
                // Nếu idTaikhoan !== null thị update tài khoản 
                const taiKhoan = await updateTaiKhoan(idTaiKhoan, formData);
                if (taiKhoan) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật tài khoản thành công',
                    });
                    closeModal();
                    fetchData();
                }
                return;
            }

            // Nếu idTaikhoan === null thị thêm tài khoản
            const taiKhoan = await createTaiKhoan(formData);
            if (taiKhoan) {

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tạo tài khoản thành công',
                });
                closeModal();
                fetchData();
            }
        }
        catch (error) {
            console.log(error);

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tạo tài khoản',
            });

        }
    };
    // update trạng thái
    const updateTrangThai = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc muốn cập nhật trạng thái này?',
                text: "Hành động này sẽ không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'hủy',
                confirmButtonText: 'Đồng ý'

            });
            if (result.isConfirmed) {

                const taiKhoan = await updateStatusTaiKhoan(id);
                if (taiKhoan) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật trạng thái thành công',
                    });
                    setShowModal(false)
                    fetchData();
                }
            }


        }
        catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Cập nhật trạng thái thất bại',
            });

        }
    }
    // Hàm xóa tài khoản
    const deletTaiKhoan = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc muốn xóa tài khoản này?',
                text: "Hành động này sẽ không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'hủy',
                confirmButtonText: 'Đồng ý'

            });
            if (result.isConfirmed) {
                const taiKhoan = await deleteTaiKhoan(id);
                if (taiKhoan) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Xóa tài khoản thành công',
                    });
                    setShowModal(false)
                    fetchData();
                }
            }

        }
        catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Xóa tài khoản thất bại',
            });

        }
    }
    const openModal = async (item) => {
        setShowModal(true); // mở modal

        setIsEditing(true); // kiểm tra có phải update hay không

        setIdTaiKhoan(item.id); // Lưu id vào biến toàn cục

        setFormData({
            tenTK: item.tenTK || '', // Nếu item.tenTK không tồn tại, set giá trị mặc định là ''
            email: item.email || '',
            hoTen: item.hoTen || '',
            diaChi: item.diaChi || '',
            phone: item.sdt || '',
            roles: item.loaiTK || '',
            password: item.matkhau || '',
        });
    };
    const closeModal = () => {
        setShowModal(false); // mở modal
        setIsEditing(false); // kiểm tra có phải update hay không
        setIdTaiKhoan(null); // xoa id

        setFormData({
            tenTK: '', // Nếu item.tenTK không tồn tại, set giá trị mặc định là ''
            email: '',
            hoTen: '',
            diaChi: '',
            phone: '',
            roles: '',
            password: '',
        });

        setErrors({});
    };

    // Load data
    const fetchData = async () => {
        try {
            const taiKhoanList = await getAllTaiKhoan();
            setTaiKhoanList(taiKhoanList.$values); // Cập nhật state với dữ liệu từ API
        } catch (error) {
            console.error('Không thể lấy danh sách tài khoản:', error.message);
        } finally {
            setLoading(false); // Dù thành công hay lỗi, tắt trạng thái loading
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='content-wrapper' style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <div className='page-heading'>
                <h2 className="text-center mb-4">Quản lý tài khoản</h2>
                <button className='btn-create-user' onClick={() => setShowModal(true) && setIsEditing(false)} style={{marginRight:'20px',backgroundColor:'black'}}>
                    <i className="fa-solid fa-plus" style={{ marginRight: "10px" }}></i>
                    Thêm tài khoản mới
                </button>
            </div>

            {
                loading ? ( // Hiển thị loading nếu đang tải dữ liệu
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" style={{fontWeight:'bold'}}>#</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Họ tên</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Tên tài khoản</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Số điện thoại</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Email</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Địa chỉ</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Loại tài khoản</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Ngày thêm</th>
                                <th scope="col" style={{fontWeight:'bold'}}>Trạng thái</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {taiKhoanList.map((taiKhoan, index) => (
                                <tr key={taiKhoan.id}>
                                    <th>{index + 1}</th>
                                    <td>{taiKhoan.hoTen}</td>
                                    <td>{taiKhoan.tenTK}</td>
                                    <td>{taiKhoan.sdt}</td>
                                    <td>{taiKhoan.email}</td>
                                    <td>{taiKhoan.diaChi}</td>
                                    <td>
                                        {taiKhoan.loaiTK === 2 ? (
                                            <span className="badge bg-primary">Khách hàng</span>
                                        ) : taiKhoan.loaiTK === 3 ? (
                                            <span className="badge bg-warning">Nhân viên</span>
                                        ) : taiKhoan.loaiTK === 1 ? (
                                            <span className="badge bg-secondary">Admin</span>
                                        ) : <span className="badge bg-secondary">Không xác định</span>}
                                    </td>
                                    <td>{new Date(taiKhoan.ngayDK).toLocaleDateString()}</td>
                                    <td>
                                        {taiKhoan.trangthai ? (
                                            <span className="badge bg-success" style={{ cursor: "pointer" }} onClick={() => updateTrangThai(taiKhoan.id)} updateTrangThai>Đang hoạt động</span>
                                        ) : (
                                            <span className="badge bg-danger" style={{ cursor: "pointer" }} onClick={() => updateTrangThai(taiKhoan.id)} updateTrangThai>Ngừng hoạt động</span>
                                        )}
                                    </td>
                                    <td className='d-flex gap-3'>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => deletTaiKhoan(taiKhoan.id)} deletTaiKhoan>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(taiKhoan)} openModal>
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
            {
                showModal && (
                    <div className='modal-create'>
                        <div className='modal-create-content'>
                            <div className='modal-create-header'>
                                <h4>
                                    {isEditing ? ("Cập nhật thông tin tài khoản") : ("Thêm thông tin tài khoản")}
                                </h4>
                                <button className='btn-close' onClick={() => closeModal()}>
                                </button>
                            </div>
                            <div className='modal-create-body'>
                                <form>
                                    <div>
                                        <strong>Họ tên</strong>
                                        <div className="input-group flex-nowrap mt-2">
                                            <input
                                                type="text"
                                                name="hoTen"
                                                className="form-control"
                                                placeholder="Họ tên"
                                                value={formData.hoTen}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                    <div className='d-flex gap-3 mt-3'>
                                        <div className='flex-grow-1'>
                                            <strong>Tên đăng nhập</strong>
                                            <div className="input-group flex-nowrap mt-2">
                                                <input
                                                    type="text"
                                                    name="tenTK"
                                                    className="form-control"
                                                    placeholder="Tên đăng nhập"
                                                    value={formData.tenTK}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.tenTK && <div className="text-danger">{errors.tenTK}</div>}
                                        </div>
                                        <div className='flex-grow-1'>
                                            <strong>Mật khẩu</strong>
                                            <div className="input-group flex-nowrap mt-2">
                                                <input
                                                    type="password" // Thay đổi type thành password
                                                    name="password"
                                                    className="form-control"
                                                    placeholder="Mật khẩu"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.password && <div className="text-danger">{errors.password}</div>}
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <strong>Email</strong>
                                        <div className="input-group flex-nowrap mt-2">
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>

                                    <div className='mt-3'>
                                        <strong>Số điện thoại</strong>
                                        <div className="input-group flex-nowrap mt-2">
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                placeholder="Số điện thoại"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                    </div>

                                    <div className='mt-3'>
                                        <strong>Địa chỉ</strong>
                                        <div className="input-group flex-nowrap mt-2">
                                            <input
                                                type="text"
                                                name="diaChi"
                                                className="form-control"
                                                placeholder="Địa chỉ"
                                                value={formData.diaChi}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.diaChi && <div className="text-danger">{errors.diaChi}</div>}
                                    </div>

                                    <div className='mt-3'>
                                        <strong>Loại tài khoản</strong>
                                        <div className='d-flex gap-3 mt-2'>
                                            <div className="input-group flex-nowrap">
                                                <select
                                                    className="form-control"
                                                    name="roles"
                                                    value={formData.roles}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chọn loại tài khoản</option>
                                                    <option value="2">Khách hàng</option>
                                                    <option value="3">Nhân viên</option>
                                                </select>
                                            </div>
                                        </div>
                                        {errors.roles && <div className="text-danger">{errors.roles}</div>}
                                    </div>
                                </form>
                            </div>
                            <div className='modal-create-footer'>
                                <button className='btn btn-outline-danger' onClick={() => closeModal()}>
                                    Hủy
                                </button>

                                <button className='btn btn-primary' onClick={handleSubmit}>
                                    {isEditing ?
                                        (
                                            "Cập nhật"
                                        )
                                        : (
                                            "Thêm"
                                        )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    )
}
