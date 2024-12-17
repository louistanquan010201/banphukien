import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './style/ranDom.css';
import Swal from 'sweetalert2';

const Random = () => {
    const [result, setResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinIndex, setSpinIndex] = useState(null);
    const [randomVouchers, setRandomVouchers] = useState([]);
    const [maTaiKhoan, setMaTaiKhoan] = useState(null);
    const [luotQuay, setLuotQuay] = useState(0);

    // Lấy danh sách voucher random
    useEffect(() => {
        fetchRandomVouchers();
        // const idFromSession = sessionStorage.getItem('id');
        // if (idFromSession) {
        //     setMaTaiKhoan(idFromSession);
        // }
        // console.log(idFromSession);

        // const soDonDaDuyet = parseInt(sessionStorage.getItem('soDonDaDuyet') || '0');
        // const soLuotQuay = Math.floor(soDonDaDuyet / 2);
        // setLuotQuay(soLuotQuay);
        fetchLuotQuay();
    }, []);


    const fetchLuotQuay = async () => {
        const loaitk = sessionStorage.getItem("id")
        try {
            const response = await axios.get(
              "https://naton69587-001-site1.mtempurl.com/api/DangNhapDangKy/layluotquaytk",
              {
                params: { idtk: loaitk }, // Truyền tham số idtk vào URL
              }
            );
           if(response.status === 200){
            console.log("data",response.data.result.luotquay)
    
            setLuotQuay(response.data.result.luotquay)
           }
          }
        catch (error) {
            console.log(error);
        }
    }
    const fetchRandomVouchers = async () => {
        try {
            const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Voucher');
            const allVouchers = response.data.$values;
            // Lọc voucher random và đang hoạt động
            const activeRandomVouchers = allVouchers.filter(v =>
                v.discountType === 'random' &&
                v.status === 1 &&
                v.stock > 0 &&
                new Date(v.timeEnd) > new Date()
            );
            setRandomVouchers(activeRandomVouchers);
        } catch (error) {
            console.error('Lỗi khi lấy voucher:', error);
        }
    };

    // Hàm quay
    const spinRewards = async () => {
        if (luotQuay <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Không đủ lượt quay!',
                text: 'Bạn cần mua thêm đơn hàng để có lượt quay mới'
            });
            return;
        }

        if (randomVouchers.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Không có voucher!',
                text: 'Hiện không có voucher khả dụng'
            });
            return;
        }
        const loaitk = sessionStorage.getItem("id")

        try {
            const response = await axios.get(
              "https://naton69587-001-site1.mtempurl.com/api/DangNhapDangKy/truluotquay",
              {
                params: { idtk: loaitk }, // Truyền tham số idtk vào URL
              }
            );
            if(response.status === 200){
                setLuotQuay(prev => prev - 1);
                console.log(luotQuay - 1, "Lượt quay");
            }
          } catch (err) {

          } finally {

          }
   

        localStorage.setItem('luotQuay', luotQuay - 1);
        setIsSpinning(true);
        let currentIndex = 0;
        const spinInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % TOTAL_SLOTS;
            setSpinIndex(currentIndex);
        }, 200);

        const randomSpinTime = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
        setTimeout(async () => {
            clearInterval(spinInterval);
            const random = Math.random();
            let selectedIndex;
            if (random < 0.02) {
                selectedIndex = 0;
            } else {
                selectedIndex = Math.floor(Math.random() * (TOTAL_SLOTS - 1)) + 1;
            }
            if (selectedIndex === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Rất tiếc!',
                    text: 'Chúc bạn may mắn lần sau!'
                });
                setSpinIndex(0);
            } else {
                const selectedVoucher = randomVouchers[(selectedIndex - 1) % randomVouchers.length];
                try {
                    const updatedVoucher = {
                        ...selectedVoucher,
                        stock: selectedVoucher.stock - 1
                    };
                    const tenTK = sessionStorage.getItem('tenTK');
                    const idTaiKhoan = sessionStorage.getItem('id');

                    await axios.put(`https://naton69587-001-site1.mtempurl.com/api/Voucher/update-voucher/${tenTK}`, updatedVoucher);

                    const params = new URLSearchParams();

                    params.append('tentk', maTaiKhoan);
                    params.append('maVoucher', selectedVoucher.id);

                    await axios.post(`https://naton69587-001-site1.mtempurl.com/api/VoucherNguoiDung?idTaiKhoan=${idTaiKhoan}&maVoucher=${selectedVoucher.id}`)
                        .then(response => {
                            console.log('Cập nhật voucher thành công:', response.data);
                        })
                        .catch(error => {
                            console.error('Lỗi khi cập nhật voucher:', error);
                        });
                    Swal.fire({
                        icon: 'success',
                        title: 'Chúc mừng!',
                        text: `Bạn đã nhận được Voucher: Giảm ${selectedVoucher.discount}${selectedVoucher.discountType === 'percent' ? '%' : 'đ'}`
                    });
                    setSpinIndex(selectedIndex);

                    await fetchRandomVouchers();
                } catch (error) {
                    console.error('Lỗi khi cập nhật voucher:', error);
                    alert('Có lỗi xảy ra khi nhận voucher!');
                }
            }

            setIsSpinning(false);
        }, randomSpinTime);
    };

    const TOTAL_SLOTS = 8;

    return (
        <div className="vongquay-container">
            <div className="luot-quay-info">
                Số lượt quay còn lại: {luotQuay}
            </div>
            <div className="reward-box">
                {Array(TOTAL_SLOTS).fill(null).map((_, index) => {
                    const voucher = randomVouchers[index % randomVouchers.length];
                    return (
                        <div
                            key={index}
                            className="reward-item"
                            style={{
                                backgroundColor: spinIndex === index ? '#f1c40f' : '#ecf0f1',
                            }}
                        >
                            {index === 0
                                ? 'Chúc bạn may mắn lần sau'
                                : voucher
                                    ? `Giảm ${voucher.discount}${voucher.discountType === 'percent' ? '%' : 'đ'}`
                                    : 'Chưa có voucher'
                            }
                        </div>
                    );
                })}
            </div>
            <button
                className="spin-button"
                onClick={spinRewards}
                disabled={isSpinning || randomVouchers.length === 0 || luotQuay <= 0}
            >
                {randomVouchers.length === 0 ? 'Hết voucher' : luotQuay <= 0 ? 'Hết lượt quay' : 'Quay'}
            </button>
        </div>
    );
};

export default Random;