import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';
import './style/Register.css';
import { FaUser, FaPhone, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";

const RegisterForm = () => {
    const [tenTK, setTenTK] = useState('');
    const [email, setEmail] = useState('');
    const [matkhau, setMatKhau] = useState('');
    const [sdt, setSdt] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [tenTK1, setTenTK1] = useState('');
    const [matkhau1, setMatKhau1] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Quản lý trạng thái form
    const [errors, setErrors] = useState({}); // Lưu trữ lỗi
    const navigate = useNavigate();
    const [test, setTest] = useState('');
    const validateRegisterForm = () => {
        const newErrors = {};

        // Kiểm tra tài khoản không trống
        if (!tenTK) newErrors.tenTK = "Tên tài khoản không được để trống.";

        // Kiểm tra email không trống và đúng định dạng
        if (!email) {
            newErrors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email không đúng định dạng.";
        }

        // Kiểm tra mật khẩu không trống
        if (!matkhau) newErrors.matkhau = "Mật khẩu không được để trống.";

        // Kiểm tra số điện thoại không trống và đúng định dạng
        if (!sdt) {
            newErrors.sdt = "Số điện thoại không được để trống.";
        } else if (!/^0\d{9}$/.test(sdt)) {
            newErrors.sdt = "Số điện thoại không hợp lệ.";
        }

        // Kiểm tra địa chỉ không trống
        if (!diaChi) newErrors.diaChi = "Địa chỉ không được để trống.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLoginForm = () => {
        const newErrors = {};

        // Kiểm tra tài khoản không trống
        if (!tenTK) newErrors.tenTK = "Tên tài khoản không được để trống.";

        // Kiểm tra mật khẩu không trống
        if (!matkhau) newErrors.matkhau = "Mật khẩu không được để trống.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateRegisterForm()) {
            return; // Nếu form không hợp lệ thì không gửi yêu cầu
        }

        // Tiến hành đăng ký
        try {
            const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/DangNhapDangKy/Register', {
                tenTK,
                email,
                matkhau,
                sdt,
                diaChi,
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    text: 'Bạn có thể đăng nhập ngay.',
                    showConfirmButton: true,
                }).then(() => {
                    setIsLogin(true); // Chuyển về form đăng nhập
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng ký thất bại!',
                    text: 'Vui lòng kiểm tra lại thông tin đã nhập.',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Đăng ký thất bại!',
                text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                showConfirmButton: true,
            });
            console.error('Đăng ký thất bại:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return; // Nếu form không hợp lệ thì không gửi yêu cầu
        }

        // Tiến hành đăng nhập
        try {
            const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/DangNhapDangKy/login', {
                tenTK,
                matkhau,
            });

            if (response.status === 200) {
                const { loaiTK } = response.data;

                // Lưu tên tài khoản vào sessionStorage
                sessionStorage.setItem('tenTK', tenTK);
                sessionStorage.setItem('id', response.data.id);
                sessionStorage.setItem('loaitk', response.data.loaiTK);

                // Kiểm tra và gửi giỏ hàng về server nếu có
                const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
                if (localCart.length > 0) {
                    try {
                        const requestData = {
                            TGH: localCart.map(item => ({
                                idpk: item.Idpk,
                                tenphukien: item.tenphukien,
                                hinhanh: item.hinhAnh,
                                mausac: item.mausac,
                                soluong: item.soLuong
                            })),
                            tentk: tenTK
                        };

                        axios.post('https://naton69587-001-site1.mtempurl.com/api/GioHang/ThemGioHangDN',

                            requestData,
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => {
                                console.log("Giỏ hàng đã được thêm thành công", response);
                                sessionStorage.removeItem('localCart');
                            })
                            .catch(error => {
                                if (error.response) {
                                    // Lỗi trả về từ server
                                    console.error("Lỗi từ server:", error.response.status);
                                    console.error("Dữ liệu trả về:", requestData);
                                } else if (error.request) {
                                    // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                                    console.error("Không nhận được phản hồi từ server:", error.request);
                                } else {
                                    // Lỗi khác trong quá trình tạo yêu cầu
                                    console.error("Lỗi trong khi gửi yêu cầu:", error.message);
                                }
                            });



                    } catch (error) {

                        console.error('Lỗi khi gửi giỏ hàng:', error);
                    }
                }

                // Hiển thị thông báo thành công và chuyển hướng
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: 'Bạn sẽ được chuyển hướng đến trang của mình ngay lập tức.',
                    showConfirmButton: false,
                    timer: 1500,
                });

                setTimeout(() => {
                    if (loaiTK === 2) {
                        navigate('/'); // Dành cho người dùng thường
                    } else if (loaiTK === 3) {
                        navigate('/'); // Dành cho nhân viên
                    } else if (loaiTK === 1) {
                        navigate('/'); // Dành cho admin
                    } else {
                        console.log('Loại tài khoản không hợp lệ');
                    }
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại!',
                    text: 'Vui lòng kiểm tra lại tên tài khoản và mật khẩu của bạn.',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại!',
                text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                showConfirmButton: true,
            });
            console.error('Đăng nhập thất bại:', error);
        }
    };



    return (
        <body className='body-container'>
            <div className={`wrapper ${!isLogin ? 'active' : ''}`}>
                {/* Form Đăng Nhập */}
                {isLogin ? (
                    <div className='form-box login'>
                        <form onSubmit={handleLogin}>
                            <h1>Đăng nhập</h1>
                            <div className='input-box'>
                                <input
                                    type='text'
                                    placeholder='Tên đăng nhập'
                                    value={tenTK}
                                    onChange={(e) => setTenTK(e.target.value)}
                                    required
                                />
                                <FaUser className='icon' />
                                {errors.tenTK && <span className="error-text">{errors.tenTK}</span>}
                            </div>
                            <div className='input-box'>
                                <input
                                    type='password'
                                    placeholder='Mật khẩu'
                                    value={matkhau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    required
                                />
                                <FaLock className='icon' />
                                {errors.matkhau && <span className="error-text">{errors.matkhau}</span>}
                            </div>
                            <div className='remember-forgot'>
                                <label style={{color:'black'}}><input type='checkbox' />Lưu đăng nhập</label>
                                <a href="/quen-mat-khau" style={{color:'black'}}>Quên mật khẩu?</a>
                            </div>
                            <button type='submit' className='btn-register'>Đăng nhập</button>
                            <div className='register-link'>
                                <p>Bạn chưa có tài khoản? <a style={{color:'black'}} href='#' onClick={() => setIsLogin(false)}>
                                    Đăng ký
                                </a></p>
                            </div>
                            <div className='register-link'>
                                <p>Quay lại trang chủ <a style={{color:'black'}} href='/' >
                                    Trang chủ
                                </a></p>
                            </div>
                        </form>
                    </div>
                ) : (
                    // Form Đăng Ký
                    <div className='form-box register'>
                        <form onSubmit={handleRegister}>
                            <h1>Đăng ký</h1>
                            <div className='input-box'>
                                <input
                                    type='text'
                                    placeholder='Tên đăng nhập'
                                    value={tenTK}
                                    onChange={(e) => setTenTK(e.target.value)}
                                    required
                                />
                                <FaUser className='icon' />
                                {errors.tenTK && <span className="error-text">{errors.tenTK}</span>}
                            </div>
                            <div className='input-box'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <MdEmail className='icon' />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                            <div className='input-box'>
                                <input
                                    type='password'
                                    placeholder='Mật khẩu'
                                    value={matkhau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    required
                                />
                                <FaLock className='icon' />
                                {errors.matkhau && <span className="error-text">{errors.matkhau}</span>}
                            </div>
                            <div className='input-box'>
                                <input
                                    type='text'
                                    placeholder='Số điện thoại'
                                    value={sdt}
                                    onChange={(e) => setSdt(e.target.value)}
                                    required
                                />
                                <FaPhone className='icon' />
                                {errors.sdt && <span className="error-text">{errors.sdt}</span>}
                            </div>
                            <div className='input-box'>
                                <input
                                    type='text'
                                    placeholder='Địa chỉ'
                                    value={diaChi}
                                    onChange={(e) => setDiaChi(e.target.value)}
                                    required
                                />
                                <AiFillHome className='icon' />
                                {errors.diaChi && <span className="error-text">{errors.diaChi}</span>}
                            </div>
                            <button type='submit' className='btn-register'>Đăng ký</button>
                            <div className='register-link'>
                                <p>Bạn đã có tài khoản? <a href='#' style={{color:'black'}} onClick={() => setIsLogin(true)}>Đăng nhập</a></p>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </body>
    );
};

export default RegisterForm;
