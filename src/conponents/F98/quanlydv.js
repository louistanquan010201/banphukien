import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../F98/style/dangkydv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';

const Quanlydv = () => {
    const [trangThai, setTrangThai] = useState(1);
    const [dangKyDichVuList, setDangKyDichVuList] = useState([]);

    useEffect(() => {
        fetchData(trangThai);
    }, [trangThai]);

    const fetchData = async (status) => {
        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu/getByStatus/${status}`);
            setDangKyDichVuList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setDangKyDichVuList([]);
        }
    };

    const updateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 4 ? 4 : currentStatus + 1;

        // Hiển thị SweetAlert xác nhận
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn chuyển trạng thái?',
            text: "Hành động này sẽ không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, chuyển trạng thái!',
            cancelButtonText: 'Không, hủy!'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu/updateStatus/${id}`, newStatus, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                fetchData(trangThai); // Cập nhật lại danh sách sau khi cập nhật
                Swal.fire(
                    'Thành công!',
                    'Trạng thái đã được cập nhật.',
                    'success'
                );
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái:", error);
                Swal.fire(
                    'Lỗi!',
                    'Không thể cập nhật trạng thái.',
                    'error'
                );
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    return (
        <div className="container">
            <h2 className="title">Quản lý đăng ký dịch vụ</h2>
            <ul className="nav nav-tabs">
                <li className={trangThai === 1 ? "active tab" : "tab"} onClick={() => setTrangThai(1)}>
                    <a href="#">Chờ liên hệ</a>
                </li>
                <li className={trangThai === 2 ? "active tab" : "tab"} onClick={() => setTrangThai(2)}>
                    <a href="#">Đã liên hệ</a>
                </li>
                <li className={trangThai === 3 ? "active tab" : "tab"} onClick={() => setTrangThai(3)}>
                    <a href="#">Chờ thanh toán</a>
                </li>
                <li className={trangThai === 4 ? "active tab" : "tab"} onClick={() => setTrangThai(4)}>
                    <a href="#">Hoàn thành</a>
                </li>
            </ul>

            <div className="tab-content">
                <div className="tab-pane active">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>Họ tên</th>
                                <th>Dịch vụ</th>
                                <th>Email</th>
                                <th>Loại xe</th>
                                <th>Thời gian mong muốn</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {dangKyDichVuList.length === 0 ? (
                                <tr className="no-data">
                                    <td colSpan="8">Không có gói đăng ký dịch vụ nào ở trạng thái này.</td>
                                </tr>
                            ) : (
                                dangKyDichVuList.map((dk) => (
                                    <tr key={dk.maDangKy}>
                                        <td>{dk.hoTen}</td>
                                        <td>{dk.dichVu?.tenDichVu || "Không có"}</td>
                                        <td>{dk.email}</td>
                                        <td>{dk.loaiXe}</td>
                                        <td>{formatDate(dk.thoiGianMongMuon)}</td>
                                        <td>{dk.ghiChu}</td>
                                        <td>
                                            {dk.trangThai === 1 && "Chờ liên hệ"}
                                            {dk.trangThai === 2 && "Đã liên hệ"}
                                            {dk.trangThai === 3 && "Chờ thanh toán"}
                                            {dk.trangThai === 4 && "Hoàn thành"}
                                        </td>
                                        <td>
                                            {dk.trangThai < 4 && (
                                                <span
                                                    onClick={() => updateStatus(dk.maDangKy, dk.trangThai)}
                                                    className="icon-check"
                                                    title="Chuyển tiếp"
                                                >
                                                    <FontAwesomeIcon icon={faCircleCheck} />
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Quanlydv;
