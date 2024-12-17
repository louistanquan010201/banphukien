import React, { useState } from 'react'
import './style/quenMatKhau.css'
import { forgerPassword, changePassWord } from '../../API/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function QuenMatKhau() {
    const [translateX, setTranslateX] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otpForm, setOtpForm] = useState('');

    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        newPassword: '',
        password: '',
    });

    // =========== gửi mã otp ==============
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleSenderEmail = async () => {
        try {
            setLoading(true);
            const data = {
                email: email,
                newPassword: ''
            }
            const otp = await forgerPassword(data);
            setLoading(false);
            if (!otp) {
                setLoading(false);
                throw new Error("Không thể gửi mã otp");
            }
            setTranslateX(-34);
            setOtp(otp);
        }
        catch (error) {
            console.log(error);
            alert("Xác nhận lại email");
            setLoading(false);
        }
    };
    // =========================================

    // ==================== Xác nhận otp ================
    const handleChangeOtp = (e) => {
        setOtpForm(e.target.value);
    };
    const handleCheckOtp = async () => {
        if (otpForm == otp) {
            setTranslateX(-69);
            return;
        }
        alert("Mã otp không đúng");
    }
    // ==================== Xác nhận otp ================

    // ========= cập nhật mật khẩu =========
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // Cập nhật giá trị tương ứng với name của input
        });
    };

    const handleUpdatePassword = async () => {
        if (formData.newPassword != formData.password) {
            alert("Xác nhận lại mật khẩu")
            return;
        }
        const data = {
            email: email,
            newPassword: formData.newPassword
        }

        try {
            const result = await changePassWord(data);
            if (result) {
                alert("Thay đổi mật khẩu thành công");
                navigate('/dangky-dangnhap');
            }
        }
        catch (error) {
            console.log(error);
            alert("Cập nhật mật khẩu thất bại")
        }
    }
    // ========= cập nhật mật khẩu =========


    return (
        <div className='container-quen-mat-khau'>
            <div className='contentQuenMK'>
                <div className='content-form' style={{ transform: `translateX(${translateX}rem)` }} >
                    <div className='content-email'>
                        <div className='content-email-item'>
                            <div className='title'>
                                <div className='email-icon'>
                                    <i class="fa-brands fa-squarespace"></i>
                                </div>
                                <h3>Quên mật khẩu</h3>
                                <p>Nhập email tài khoản của bạn</p>
                            </div>
                            <div className='input-box'>
                                <input type="text" placeholder='Email'
                                    value={email}
                                    onChange={handleChangeEmail} />
                                <MdEmail className='icon' />
                            </div>
                            <div>
                                <button className='btn-sender-otp' onClick={handleSenderEmail} disabled={isLoading}>
                                    {isLoading ? 'Đang gửi otp...' : 'Gữi mã otp'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='content-otp'>
                        <div className='content-email-item'>
                            <div className='title'>
                                <div className='email-icon'>
                                    <i class="fa-regular fa-envelope-open"></i>
                                </div>
                                <h3>Nhập mã OTP</h3>
                                <p>Nhập mã otp được gửi về tin nhắn</p>
                            </div>
                            <div className='input-box'>
                                <input type="text" placeholder='Nhập mã otp' value={otpForm} onChange={handleChangeOtp} />
                                <MdEmail className='icon' />
                            </div>
                            <div>
                                <button className='btn-sender-otp' onClick={handleCheckOtp}>
                                    Xác nhận otp
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='content-password'>
                        <div className='content-email-item'>
                            <div className='title'>
                                <div className='email-icon'>
                                    <i class="fa-solid fa-key"></i>
                                </div>
                                <h3>Thay đổi mật khẩu</h3>
                                <p>Thay đổi mật khẩu của bạn</p>
                            </div>

                            <div className='input-box'>
                                <input type="text" placeholder='Mật khẩu mới'
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <FaLock className='icon' />
                            </div>
                            <div className='input-box'>
                                <input type="text" placeholder='Xác nhận mật khẩu'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <button className='btn-sender-otp' onClick={handleUpdatePassword}>
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
