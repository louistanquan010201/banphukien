import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dangkydv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClock, faTimesCircle, faEye } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Quanlydv = () => {
    const [trangThai, setTrangThai] = useState(1);
    const [dangKyDichVuList, setDangKyDichVuList] = useState([]);
    const [selectedDangKy, setSelectedDangKy] = useState(null);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [dichVuList, setDichVuList] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const navigate = useNavigate();

    const tentk = sessionStorage.getItem('tenTK');
    const loaitk = sessionStorage.getItem("loaitk")
    useEffect(() => {
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
        const fetchDichVuList = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/DichVu/getAllDichVu');
                setDichVuList(response.data.$values || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách dịch vụ:", error);
            }
        };

        fetchDichVuList();
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
        const newStatus = currentStatus === 5 ? 5 : currentStatus + 1;

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
                await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu/updateStatus/${id}?tentk=${tentk}`, newStatus, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                fetchData(trangThai);
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
    const cancelOrder = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn hủy đơn này?',
            text: "Hành động này sẽ chuyển trạng thái đơn sang 'Hủy'!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, hủy đơn!',
            cancelButtonText: 'Không, quay lại!'
        });

        if (result.isConfirmed) {
            try {
                // Assuming API endpoint to cancel order is similar to updateStatus
                await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu/updateStatus/${id}?tentk=${tentk}`, 5, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                fetchData(trangThai);
                Swal.fire(
                    'Đã hủy!',
                    'Đơn dịch vụ đã được hủy thành công.',
                    'success'
                );
            } catch (error) {
                console.error("Lỗi khi hủy đơn:", error);
                Swal.fire(
                    'Lỗi!',
                    'Không thể hủy đơn.',
                    'error'
                );
            }
        }
    };
    const openTimeUpdateModal = (dangKy) => {
        setSelectedDangKy(dangKy);
        setSelectedTime(dangKy.thoiGianMongMuon);
        setShowTimeModal(true);
    };

    const updateThoiGian = async () => {
        if (!selectedDangKy) return;

        try {
            await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu/updatethoigian/${selectedDangKy.maDangKy}?tentk=${tentk}`,
                JSON.stringify(selectedTime),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            fetchData(trangThai);
            setShowTimeModal(false);

            Swal.fire(
                'Thành công!',
                'Thời gian mong muốn đã được cập nhật.',
                'success'
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật thời gian:", error);
            Swal.fire(
                'Lỗi!',
                'Không thể cập nhật thời gian.',
                'error'
            );
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    const getServiceDetails = (serviceIds) => {
        console.info(dichVuList)
        if (!serviceIds) return [];

        const ids = serviceIds.split(',').map(id => id.trim());
        return ids.map(id => {
            const service = dichVuList.find(dv => dv.maDichVu.toString() === id);
            console.info(service)
            return service || { tenDichVu: 'Không xác định', giaDichVu: 0 };
        });
    };

    const calculateTotalServicePrice = (serviceIds) => {
        const services = getServiceDetails(serviceIds);
        return services.reduce((total, service) => total + (service.gia || 0), 0);
    };
    const openDetailsModal = (dangKy) => {

        setSelectedDangKy(dangKy);
        setShowDetailsModal(true);
    };
    return (
        <div className="container" style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <h2 className="text-center mb-4">Quản lý đăng ký dịch vụ</h2>
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
                <li className={trangThai === 5 ? "active tab" : "tab"} onClick={() => setTrangThai(5)}>
                    <a href="#">Hủy</a>
                </li>
            </ul>

            <div className="tab-content">
                <div className="tab-pane active">
                    <table className="table">
                        <thead className="table">
                            <tr>
                                <th>Họ tên</th>
                                <th>Dịch vụ</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Loại xe</th>
                                <th>Thời gian mong muốn</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body ">
                            {dangKyDichVuList.length === 0 ? (
                                <tr className="no-data">
                                    <td colSpan="8">Không có gói đăng ký dịch vụ nào ở trạng thái này.</td>
                                </tr>
                            ) : (
                                dangKyDichVuList.map((dk) => (
                                    <tr key={dk.maDangKy}>
                                        <td>{dk.hoTen}</td>
                                        <td>{dk.tenDichVu || "Không có"}</td>
                                        <td>{dk.soDienThoai}</td>
                                        <td>{dk.email}</td>
                                        <td>{dk.loaiXe}</td>
                                        <td>{new Date(dk.thoiGianMongMuon).toLocaleDateString('vi-VN')}</td>

                                        <td>{dk.ghiChu}</td>
                                        <td>
                                            {dk.trangThai === 1 && "Chờ liên hệ"}
                                            {dk.trangThai === 2 && "Đã liên hệ"}
                                            {dk.trangThai === 3 && "Chờ thanh toán"}
                                            {dk.trangThai === 4 && "Hoàn thành"}
                                            {dk.trangThai === 5 && "Hủy"}
                                        </td>
                                        <td>

                                            {dk.trangThai < 5 && (
                                                <>
                                                    <div className="action-icons">
                                                        <span
                                                            onClick={() => openDetailsModal(dk)}
                                                            className="icon-details"
                                                            title="Chi tiết dịch vụ"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </span>
                                                        <span
                                                            onClick={() => updateStatus(dk.maDangKy, dk.trangThai)}
                                                            className="icon-check"
                                                            title="Chuyển tiếp"
                                                        >
                                                            <FontAwesomeIcon icon={faCircleCheck} />
                                                        </span>
                                                        {loaitk === "1" ? (
                                                        <span
                                                            onClick={() => openTimeUpdateModal(dk)}
                                                            className="icon-clock"
                                                            title="Cập nhật thời gian"
                                                        >
                                                            <FontAwesomeIcon icon={faClock} />
                                                        </span>
                                                         ) : null}
                                                        {loaitk === "1" ? (
                                                            <span
                                                                onClick={() => cancelOrder(dk.maDangKy)}
                                                                className="icon-cancel"
                                                                title="Hủy đơn"
                                                            >
                                                                <FontAwesomeIcon icon={faTimesCircle} />
                                                            </span>
                                                        ) : null}

                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal cập nhật thời gian */}
            {showTimeModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật thời gian mong muốn</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowTimeModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={selectedTime ? new Date(selectedTime).toISOString().slice(0, 10) : ''} // Chỉ lấy ngày (yyyy-mm-dd)
                                    onChange={(e) => setSelectedTime(new Date(e.target.value).toISOString())}
                                />

                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowTimeModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={updateThoiGian}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDetailsModal && selectedDangKy && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết đăng ký dịch vụ</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body ">
                                <div className="row ">
                                    {/* <div className="col-12 ">
                                        
                                        <strong>Thông tin khách hàng:</strong>
                                        <p className='text-black-dvpage'>Họ tên: {selectedDangKy.hoTen}</p>
                                        <p className='text-black-dvpage'>Số điện thoại: {selectedDangKy.soDienThoai}</p>
                                        <p className='text-black-dvpage'>Email: {selectedDangKy.email}</p>
                                        <p className='text-black-dvpage'>Loại xe: {selectedDangKy.loaiXe}</p>
                                    </div> */}
                                    <div className="col-12">
                                        <strong>Chi tiết dịch vụ:</strong>
                                        {getServiceDetails(selectedDangKy.maDichVu).map((service, index) => (
                                            <div key={index}>
                                                <p className='text-black-dvpage'>
                                                    Dịch vụ {index + 1}: {service.tenDichVu}
                                                </p>
                                                <p className='text-black-dvpage'>
                                                    Giá: {formatCurrency(service.gia)}
                                                </p>
                                            </div>
                                        ))}
                                        <p className='text-black-dvpage'>
                                            <strong >Tổng giá: {formatCurrency(calculateTotalServicePrice(selectedDangKy.maDichVu))}</strong>
                                        </p>
                                        <p className='text-black-dvpage'>Thời gian mong muốn: {formatDate(selectedDangKy.thoiGianMongMuon)}</p>
                                        <p className='text-black-dvpage'>Ghi chú: {selectedDangKy.ghiChu || "Không có"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quanlydv;