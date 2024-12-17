import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

const QuanLyLoaiXe = () => {
    const [loaiXes, setLoaiXes] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newLoaiXe, setNewLoaiXe] = useState({
        tenLoaiXe: '',
        trangThai: 'Đang hoạt động',
    });
    const [filterStatus, setFilterStatus] = useState('Đang hoạt động');

    useEffect(() => {
        const fetchLoaiXes = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/QuanLy/laydsloaixe');
                console.log('Loại Xe fetched:', response.data);
                if (Array.isArray(response.data.$values)) {
                    setLoaiXes(response.data.$values);
                } else {
                    console.error('Dữ liệu trả về không phải mảng $values:', response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách loại xe:', error);
            }
        };

        fetchLoaiXes();
    }, []);

    const handleAddLoaiXe = () => {
        setIsFormVisible(true);
        setIsEditing(false);
        setNewLoaiXe({
            tenLoaiXe: '',
            trangThai: 'Đang hoạt động',
        });
    };

    const handleEditLoaiXe = (loai) => {
        setIsFormVisible(true);
        setIsEditing(true);
        setEditId(loai.id);
        setNewLoaiXe({
            tenLoaiXe: loai.tenLoaiXe,
            trangThai: loai.trangThai || 'Đang hoạt động',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLoaiXe((prevLoaiXe) => ({
            ...prevLoaiXe,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra tên loại xe không để trống
        if (!newLoaiXe.tenLoaiXe.trim()) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Tên loại xe không được để trống!',
                icon: 'error',
            });
            return;
        }
    
        try {
            if (isEditing) {
                // Cập nhật loại xe
                const response = await axios.put(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaixe/${editId}`, newLoaiXe);
                console.log('Cập nhật loại xe thành công:', response.data);
    
                setLoaiXes((prevLoaiXes) =>
                    prevLoaiXes.map((loai) =>
                        loai.id === editId ? { ...loai, ...newLoaiXe } : loai
                    )
                );
    
                // Thông báo cập nhật thành công
                Swal.fire({
                    title: 'Thành công',
                    text: 'Cập nhật loại xe thành công!',
                    icon: 'success',
                });
            } else {
                // Thêm loại xe mới
                const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/QuanLy/themloaixe', newLoaiXe);
                console.log('Thêm loại xe thành công:', response.data);
                setLoaiXes((prevLoaiXes) => [...prevLoaiXes, response.data]);
    
                // Thông báo thêm mới thành công
                Swal.fire({
                    title: 'Thành công',
                    text: 'Thêm loại xe mới thành công!',
                    icon: 'success',
                });
            }
    
            // Đặt lại trạng thái và form sau khi hoàn thành
            setIsFormVisible(false);
            setIsEditing(false);
            setNewLoaiXe({ tenLoaiXe: '', trangThai: 'Đang hoạt động' });
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật loại xe:', error);
    
            // Kiểm tra nếu lỗi là do trùng tên hoặc các lỗi khác từ API
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    title: 'Lỗi',
                    text: error.response.data || 'Loại xe này đã tồn tại.',
                    icon: 'error',
                });
            } else {
                // Thông báo lỗi chung khi không phải lỗi trùng tên
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi thêm/cập nhật loại xe!',
                    icon: 'error',
                });
            }
        }
    };

    const handleDeleteLoaiXe = async (id) => {
        // Hiển thị hộp thoại xác nhận xóa
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa loại xe này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Gửi yêu cầu xóa tới API
                    await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaixe/${id}`);
                    console.log('Xóa loại xe thành công:', id);
    
                    // Cập nhật lại danh sách loại xe sau khi xóa
                    setLoaiXes((prevLoaiXes) => prevLoaiXes.filter((loai) => loai.id !== id));
    
                    // Thông báo xóa thành công
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Loại xe đã được xóa!',
                        icon: 'success',
                    }).then(() => {
                        // Tải lại trang sau khi xóa thành công
                        window.location.reload();
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa loại xe:', error);
    
                    // Thông báo lỗi khi xóa
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Có lỗi xảy ra khi xóa loại xe!',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Đang hoạt động' ? 'Ngưng hoạt động' : 'Đang hoạt động';
        try {
            await axios.put(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaixe/${id}`, { trangThai: newStatus });
            setLoaiXes((prevLoaiXes) =>
                prevLoaiXes.map((loai) =>
                    loai.id === id ? { ...loai, trangThai: newStatus } : loai
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };
    const handleBanLai = async (id) => {
        // Hiển thị hộp thoại xác nhận
        Swal.fire({
            title: 'Xác nhận',
            text: 'Bạn có chắc chắn muốn chuyển trạng thái sang "Đang hoạt động"?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Gửi yêu cầu PATCH tới API để cập nhật trạng thái
                    const response = await fetch(`https://naton69587-001-site1.mtempurl.com/api/quanly/loaixe/${id}/hoatdong`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
    
                    // Kiểm tra nếu API trả về lỗi
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Không thể chuyển trạng thái');
                    }
    
                    // Nếu thành công, thông báo và cập nhật lại giao diện
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Sản phẩm đã được chuyển sang "Đang hoạt động".',
                        icon: 'success',
                    }).then(() => {
                        // Tải lại trang sau khi thông báo thành công
                        window.location.reload();
                    });
    
                } catch (error) {
                    console.error('Lỗi khi chuyển trạng thái:', error);
    
                    // Thông báo lỗi
                    Swal.fire({
                        title: 'Lỗi',
                        text: error.message || 'Có lỗi xảy ra khi chuyển trạng thái.',
                        icon: 'error',
                    });
                }
            }
        });
    };
    const filteredLoaiXes = loaiXes.filter((loai) => loai.trangThai === filterStatus);

    return (
        <div>
            <div className="them-loai-container">
                <h2 onClick={handleAddLoaiXe} className="add-product-header" style={{ marginBottom: '15px', textDecoration: 'none' }}>
                    Thêm Loại Xe
                </h2>

                {isFormVisible && (
                    <div className="overlay">
                        <div className="form-popup">
                            <button className="close-button" onClick={() => setIsFormVisible(false)}>
                                X
                            </button>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên loại xe:</label>
                                    <input
                                        type="text"
                                        name="tenLoaiXe"
                                        value={newLoaiXe.tenLoaiXe}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên loại xe"
                                        required
                                    />
                                </div>

                                <button type="submit">{isEditing ? 'Cập nhật loại xe' : 'Thêm loại xe'}</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="dssp">
                <style>
                    {`
           .tabs {
                display: flex;
                margin-bottom: 15px;
            }

            .tab-btn {
                color:black;
                padding: 10px 20px;
                border: none;
                background-color: #f1f1f1;
                cursor: pointer;
                transition: 0.3s;
                margin-right: 5px;
            }

            .tab-btn.active {
                background-color: black;
                color: white;
                font-weight: bold;
            }

            .tab-btn:hover {
                background-color: black;
                color: white;
            }
        `}
                </style>
                <h2>Danh Sách Loại Xe</h2>
                <div className="tabs" style={{ paddingLeft: 140 }}>
                    <button
                        className={`tab-btn ${filterStatus === 'Đang hoạt động' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('Đang hoạt động')}
                    >
                        Đang hoạt động
                    </button>
                    <button
                        className={`tab-btn ${filterStatus === 'Ngưng hoạt động' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('Ngưng hoạt động')}
                    >
                        Ngưng hoạt động
                    </button>
                </div>

                <table className="table table-bordered" style={{ margin: '0 auto', width: '80%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Loại Xe</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLoaiXes.map((loai) => (
                            <tr key={loai.id}>
                                <td>{loai.id}</td>
                                <td>{loai.tenLoaiXe}</td>
                                <td>{loai.trangThai}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleEditLoaiXe(loai)}
                                        style={{ marginRight: "5px" }}
                                    >
                                        Sửa
                                    </button>
                                    {loai.trangThai === "Ngưng hoạt động" ? (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleBanLai(loai.id)}
                                            style={{ marginRight: "5px" }}
                                        >
                                            Hoạt động
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteLoaiXe(loai.id)}
                                            style={{ marginRight: "5px" }}
                                        >
                                            Ngưng hoạt động
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuanLyLoaiXe;
