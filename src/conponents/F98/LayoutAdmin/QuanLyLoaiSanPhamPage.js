import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const Quanlyloaisanpham = () => {
    const [loaiSanPhams, setLoaiSanPhams] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Trạng thái cho biết có đang chỉnh sửa hay không
    const [editId, setEditId] = useState(null); // Lưu ID của sản phẩm đang chỉnh sửa
    const [newLoai, setNewLoai] = useState({
        tenLoaiPhuKien: '',
        trangThai: 'Đang hoạt động', // Mặc định trạng thái là Đang hoạt động
    });
    const [filterStatus, setFilterStatus] = useState('Đang hoạt động'); // Trạng thái lọc
    const navigate = useNavigate();

    // Lấy danh sách loại sản phẩm khi component được load
    useEffect(() => {
        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
        const fetchLoaiSanPhams = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaiphukien');
                console.log('Loai San Phams fetched:', response.data);
                if (Array.isArray(response.data.$values)) {
                    setLoaiSanPhams(response.data.$values);
                } else {
                    console.error('Dữ liệu trả về không phải mảng $values:', response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy loại sản phẩm:', error);
            }
        };

        fetchLoaiSanPhams();
    }, []);

    // Mở form để thêm mới loại phụ kiện
    const handleAddLoaiPhuKien = () => {
        setIsFormVisible(true);
        setIsEditing(false); // Đặt trạng thái là thêm mới
        setNewLoai({
            tenLoaiPhuKien: '',
            trangThai: 'Đang hoạt động', // Đảm bảo trạng thái mặc định khi thêm mới
        });
    };

    // Mở form để chỉnh sửa loại phụ kiện
    const handleEditLoaiPhuKien = (loai) => {
        setIsFormVisible(true);
        setIsEditing(true); // Đặt trạng thái là chỉnh sửa
        setEditId(loai.id); // Lưu ID của sản phẩm đang chỉnh sửa
        setNewLoai({
            tenLoaiPhuKien: loai.tenLoaiPhuKien,
            trangThai: loai.trangThai || 'Đang hoạt động', // Giữ trạng thái cũ hoặc mặc định "Đang hoạt động"
        });
    };

    // Xử lý thay đổi input của form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Regular expression to allow only letters and spaces
        const regex = /[!@#$%^&*()_+=[\]/{};':"\\|,.<>?~-]/;
        if (regex.test(value)) {
            Swal.fire({
                title: 'Lỗi nhập liệu',
                text: 'Tên loại phụ kiện chỉ được chứa chữ cái và không được có số hoặc ký tự đặc biệt.',
                icon: 'error',
            });
            return; // Stop further processing
        }

        setNewLoai((prevLoai) => ({
            ...prevLoai,
            [name]: value,
        }));
    };

    // Xử lý khi submit form thêm hoặc cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem tên loại phụ kiện có hợp lệ không
        if (!newLoai.tenLoaiPhuKien.trim()) {
            Swal.fire({
                title: "Lỗi",
                text: "Tên loại phụ kiện không được để trống!",
                icon: "error",
            });
            return; // Ngừng việc gửi dữ liệu nếu không hợp lệ
        }

        try {
            if (isEditing) {
                // Gọi API PUT để cập nhật loại phụ kiện
                const response = await axios.put(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaiphukien/${editId}`, newLoai);

                // Kiểm tra nếu lỗi trả về từ server
                if (response.data === "Tên loại phụ kiện đã tồn tại.") {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Tên loại phụ kiện đã tồn tại.",
                        icon: "error",
                    });
                    return;
                }

                console.log('Cập nhật loại phụ kiện thành công:', response.data);

                // Cập nhật danh sách loại phụ kiện sau khi cập nhật thành công
                setLoaiSanPhams((prevLoaiSanPhams) =>
                    prevLoaiSanPhams.map((loai) =>
                        loai.id === editId
                            ? { ...loai, tenLoaiPhuKien: newLoai.tenLoaiPhuKien, trangThai: newLoai.trangThai }
                            : loai
                    )
                );

                // Hiển thị thông báo thành công khi cập nhật
                Swal.fire({
                    title: "Thành công",
                    text: "Cập nhật loại phụ kiện thành công!",
                    icon: "success",
                });
            } else {
                // Gọi API POST để thêm loại phụ kiện mới
                const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/QuanLy/themLoaiPhuKien', newLoai);

                // Kiểm tra nếu lỗi trả về từ server
                if (response.data === "Tên loại phụ kiện đã tồn tại.") {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Tên loại phụ kiện đã tồn tại.",
                        icon: "error",
                    });
                    return;
                }

                console.log('Thêm loại phụ kiện thành công:', response.data);

                setLoaiSanPhams((prevLoaiSanPhams) => [...prevLoaiSanPhams, response.data]);

                // Hiển thị thông báo thành công khi thêm mới
                Swal.fire({
                    title: "Thành công",
                    text: "Thêm loại phụ kiện thành công!",
                    icon: "success",
                });
            }

            setIsFormVisible(false); // Đóng form sau khi thêm/cập nhật
            setIsEditing(false); // Đặt lại trạng thái sau khi thêm/cập nhật thành công
            setNewLoai({ tenLoaiPhuKien: '', trangThai: 'Đang hoạt động' }); // Reset form với trạng thái mặc định
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật loại phụ kiện:', error);

            // Hiển thị thông báo lỗi
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi thêm/cập nhật loại phụ kiện!",
                icon: "error",
            });
        }
    };


    // Xử lý khi xóa loại phụ kiện
    const handleDeleteLoaiPhuKien = async (id) => {
        Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa loại phụ kiện này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaiphukien/${id}`);
                    console.log('Xóa loại phụ kiện thành công:', id);

                    Swal.fire({
                        title: "Thành công",
                        text: "Loại phụ kiện đã được xóa thành công!",
                        icon: "success",
                    }).then(() => {
                        // Tải lại trang sau khi thông báo xóa thành công
                        window.location.reload();
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa loại phụ kiện:', error);

                    Swal.fire({
                        title: "Lỗi",
                        text: "Có lỗi xảy ra khi xóa loại phụ kiện!",
                        icon: "error",
                    });
                }
            }
        });
    };

    // Cập nhật trạng thái loại phụ kiện
    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Đang hoạt động' ? 'Ngưng hoạt động' : 'Đang hoạt động';
        try {
            await axios.put(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/loaiphukien/${id}`, { trangThai: newStatus });
            setLoaiSanPhams((prevLoaiSanPhams) =>
                prevLoaiSanPhams.map((loai) =>
                    loai.id === id ? { ...loai, trangThai: newStatus } : loai
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };
    const handleBanLai = async (id) => {
        try {
            // Hiển thị hộp thoại xác nhận
            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn chuyển trạng thái sản phẩm này sang "Đang hoạt động"?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });

            if (result.isConfirmed) {
                // Nếu người dùng nhấn "Có", thực hiện yêu cầu PATCH tới API
                const response = await fetch(`https://naton69587-001-site1.mtempurl.com/api/QuanLy/${id}/hoatdong`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Kiểm tra nếu API trả về lỗi
                if (!response.ok) {
                    throw new Error('Failed to update product status');
                }

                // Cập nhật trạng thái trên giao diện
                setLoaiSanPhams((prevLoaiSanPhams) =>
                    prevLoaiSanPhams.map((loai) =>
                        loai.id === id ? { ...loai, trangThai: 'Đang hoạt động' } : loai
                    )
                );

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: 'Thành công',
                    text: 'Sản phẩm đã được chuyển sang "Đang hoạt động"',
                    icon: 'success',
                });
            } else {
                // Người dùng nhấn "Không", không làm gì cả
                Swal.fire({
                    title: 'Hủy bỏ',
                    text: 'Hành động đã bị hủy',
                    icon: 'info',
                });
            }
        } catch (error) {
            console.error('Lỗi khi chuyển trạng thái:', error);

            // Hiển thị thông báo lỗi
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra khi chuyển trạng thái sản phẩm',
                icon: 'error',
            });
        }
    };
    // Lọc các loại sản phẩm theo trạng thái
    const itemsPerPage = 10; // Số lượng loại phụ kiện mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm


    // Lọc danh sách loại phụ kiện theo trạng thái và từ khóa tìm kiếm
    const filteredLoaiSanPhams = loaiSanPhams
        .filter((loai) => loai.trangThai === filterStatus)
        .filter((loai) => loai.tenLoaiPhuKien.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tính toán các loại phụ kiện cần hiển thị trong trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLoaiSanPhams = filteredLoaiSanPhams.slice(indexOfFirstItem, indexOfLastItem);

    // Tính toán số trang
    const totalPages = Math.ceil(filteredLoaiSanPhams.length / itemsPerPage);

    // Chuyển sang trang trước đó
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Chuyển sang trang tiếp theo
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <div className="them-loai-container">





                {isFormVisible && (
                    <div className="overlay">
                        <div className="form-popup">
                            <button className="close-button" onClick={() => setIsFormVisible(false)}>
                                X
                            </button>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên loại phụ kiện:</label>
                                    <input
                                        type="text"
                                        name="tenLoaiPhuKien"
                                        value={newLoai.tenLoaiPhuKien}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên loại phụ kiện"
                                        required
                                    />
                                </div>

                                <button type="submit">{isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
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
                    color: black;
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
                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 20px;
                    gap: 10px;
                }
                .pagination button {
                    padding: 10px 15px;
                    border: 1px solid #333;
                    background-color: black;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .pagination button:hover {
                    background-color: #444;
                }
                .pagination button:disabled {
                    background-color: #666;
                    cursor: not-allowed;
                }
                `}
                </style>
                <br />
                <h2 className="text-center mb-4">Quản lý loại sản phẩm</h2>
                <dib className="row">
                    <div className='col-md-10'>

                    </div>
                    <div className='col-md-2'>
                        <button onClick={handleAddLoaiPhuKien} className="add-product-header btn btn-primary" style={{ textDecoration: 'none', backgroundColor: 'black', color: 'white', }}>
                            Thêm Loại sản phẩm
                        </button>
                    </div>
                </dib>
                {/* Tabs */}

                <div className="search-container" style={{ marginBottom: "20px", paddingLeft: "140px" }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên loại phụ kiện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: "10px",
                            width: "300px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <div className="tabs" style={{ paddingLeft: 140 }}>
                    <button
                        className={`tab-btn ${filterStatus === "Đang hoạt động" ? "active" : ""}`}
                        onClick={() => setFilterStatus("Đang hoạt động")}
                    >
                        Đang hoạt động
                    </button>
                    <button
                        className={`tab-btn ${filterStatus === "Ngưng hoạt động" ? "active" : ""}`}
                        onClick={() => setFilterStatus("Ngưng hoạt động")}
                    >
                        Ngưng hoạt động
                    </button>
                </div>

                {/* Title */}
                <h3 style={{ paddingLeft: 140 }}>
                    {filterStatus === "Đang hoạt động"
                        ? "Danh sách loại phụ kiện đang hoạt động"
                        : "Danh sách loại phụ kiện ngưng hoạt động"}
                </h3>

                {/* Table */}
                <table className="table table-bordered" style={{ margin: "0 auto", width: "80%" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Loại Sản Phẩm</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLoaiSanPhams.map((loai) => (
                            <tr key={loai.id}>
                                <td>{loai.id}</td>
                                <td>{loai.tenLoaiPhuKien}</td>
                                <td>{loai.trangThai}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleEditLoaiPhuKien(loai)}
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
                                            onClick={() => handleDeleteLoaiPhuKien(loai.id)}
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
                {/* Phân trang */}
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
                <br />
            </div>
        </div>
    );
};

export default Quanlyloaisanpham;
