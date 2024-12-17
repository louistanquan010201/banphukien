import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

const QuanLyMauSac = () => {
    const [mauSacs, setMauSacs] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newMauSac, setNewMauSac] = useState({
        tenMau: '',
        trangThai: 'Đang hoạt động',
    });
    const [filterStatus, setFilterStatus] = useState('Đang hoạt động');

    useEffect(() => {
        const fetchMauSacs = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/QuanLy/laydsmau');
                console.log('Màu Sắc fetched:', response.data);
                if (Array.isArray(response.data.$values)) {
                    setMauSacs(response.data.$values);
                } else {
                    console.error('Dữ liệu trả về không phải mảng $values:', response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách màu sắc:', error);
            }
        };

        fetchMauSacs();
    }, []);

    const handleAddMauSac = () => {
        setIsFormVisible(true);
        setIsEditing(false);
        setNewMauSac({
            tenMau: '',
            trangThai: 'Đang hoạt động',
        });
    };

    const handleEditMauSac = (mau) => {
        setIsFormVisible(true);
        setIsEditing(true);
        setEditId(mau.id);
        setNewMauSac({
            tenMau: mau.tenMau,
            trangThai: mau.trangThai || 'Đang hoạt động',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMauSac((prevMauSac) => ({
            ...prevMauSac,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Kiểm tra xem tên màu sắc có hợp lệ không
        if (!newMauSac.tenMau.trim()) {
            alert('Tên màu sắc không được để trống!');
            return;
        }
      
        try {
            if (isEditing) {
                const response = await axios.put(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/mau/${editId}`, newMauSac);
                console.log('Cập nhật màu sắc thành công:', response.data);
      
                // Cập nhật danh sách màu sắc sau khi cập nhật thành công
                setMauSacs((prevMauSacs) =>
                    prevMauSacs.map((mau) =>
                        mau.id === editId ? { ...mau, ...newMauSac } : mau
                    )
                );
      
                // Hiển thị thông báo thành công
                Swal.fire({
                    title: 'Cập nhật thành công',
                    text: 'Màu sắc đã được cập nhật!',
                    icon: 'success',
                });
            } else {
                const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/QuanLy/themmau', newMauSac);
    
                // Nếu màu sắc đã tồn tại, API sẽ trả về lỗi với mã 400
                if (response.status === 400) {
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Màu sắc này đã tồn tại.',
                        icon: 'error',
                    });
                    return;
                }
    
                console.log('Thêm màu sắc thành công:', response.data);
                setMauSacs((prevMauSacs) => [...prevMauSacs, response.data]);
      
                // Hiển thị thông báo thành công
                Swal.fire({
                    title: 'Thêm mới thành công',
                    text: 'Màu sắc đã được thêm!',
                    icon: 'success',
                });
            }
      
            setIsFormVisible(false);
            setIsEditing(false);
            setNewMauSac({ tenMau: '', trangThai: 'Đang hoạt động' });
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật màu sắc:', error);
      
            // Kiểm tra xem lỗi có phải là do màu sắc đã tồn tại không
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Màu sắc này đã tồn tại.',
                    icon: 'error',
                });
            } else {
                // Hiển thị thông báo lỗi chung
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi thêm/cập nhật màu sắc',
                    icon: 'error',
                });
            }
        }
    };
    
    

    const handleDeleteMauSac = async (id) => {

        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa màu sắc này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Gửi yêu cầu xóa tới API
                    await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/mau/${id}`);
                    console.log('Xóa màu sắc thành công:', id);
    
                    // Cập nhật lại danh sách màu sắc sau khi xóa
                    setMauSacs((prevMauSacs) => prevMauSacs.filter((mau) => mau.id !== id));
    
                    // Thông báo xóa thành công
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Màu sắc đã được xóa!',
                        icon: 'success',
                    }).then(() => {
                        // Tải lại trang sau khi xóa thành công
                        window.location.reload();
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa màu sắc:', error);
    
                    // Thông báo lỗi khi xóa
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Có lỗi xảy ra khi xóa màu sắc!',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const handleBanLai = async (id) => {
        // Hiển thị hộp thoại xác nhận trước khi chuyển trạng thái
        Swal.fire({
            title: 'Xác nhận chuyển trạng thái',
            text: 'Bạn có chắc chắn muốn chuyển trạng thái màu sắc này sang "Đang hoạt động"?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chuyển trạng thái',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Gửi yêu cầu PATCH để cập nhật trạng thái màu sắc
                    const response = await fetch(`https://naton69587-001-site1.mtempurl.com/api/quanly/mau/${id}/hoatdong`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to update color status');
                    }
    
                    // Thông báo trạng thái đã được chuyển thành công
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Màu sắc đã được chuyển sang "Đang hoạt động"',
                        icon: 'success',
                    });
    
                    // Cập nhật lại trạng thái trong state
                    setMauSacs((prevMauSacs) =>
                        prevMauSacs.map((mau) =>
                            mau.id === id ? { ...mau, trangThai: 'Đang hoạt động' } : mau
                        )
                    );
                } catch (error) {
                    console.error('Lỗi khi chuyển trạng thái:', error);
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Có lỗi xảy ra khi chuyển trạng thái màu sắc!',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const filteredMauSacs = mauSacs.filter((mau) => mau.trangThai === filterStatus);

    return (
        <div>
             <div className="them-loai-container">
                <h2 onClick={handleAddMauSac} className="add-product-header" style={{ marginBottom: '15px', textDecoration: 'none' }}>
                    Thêm Màu Sắc
                </h2>

                {isFormVisible && (
                    <div className="overlay">
                        <div className="form-popup">
                            <button className="close-button" onClick={() => setIsFormVisible(false)}>
                                X
                            </button>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên màu sắc:</label>
                                    <input
                                        type="text"
                                        name="tenMau"
                                        value={newMauSac.tenMau}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên màu sắc"
                                        required
                                    />
                                </div>

                                <button type="submit">{isEditing ? 'Cập nhật màu sắc' : 'Thêm màu sắc'}</button>
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
                <h2>Danh Sách Màu Sắc</h2>
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
                            <th>Tên Màu Sắc</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMauSacs.map((mau) => (
                            <tr key={mau.id}>
                                <td>{mau.id}</td>
                                <td>{mau.tenMau}</td>
                                <td>{mau.trangThai}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleEditMauSac(mau)}
                                        style={{ marginRight: "5px" }}
                                    >
                                        Sửa
                                    </button>
                                    {mau.trangThai === "Ngưng hoạt động" ? (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleBanLai(mau.id)}
                                            style={{ marginRight: "5px" }}
                                        >
                                            Hoạt động
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteMauSac(mau.id)}
                                            style={{ marginRight: "5px" }}
                                        >
                                            Xóa
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

export default QuanLyMauSac;
