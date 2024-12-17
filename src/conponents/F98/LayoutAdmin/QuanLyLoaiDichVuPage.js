import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Quanlyloaidv = () => {

    const tentk = sessionStorage.getItem('tenTK');
    const loaitk = sessionStorage.getItem("loaitk")

    const navigate = useNavigate();

    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const handleOpenSecondModal = () => {
        setIsSecondModalOpen(true);
    };
    const handleCloseSecondModal = () => {
        setIsSecondModalOpen(false);
    };

    const [trangThai] = useState();
    const [loaiDichVuList, setloaiDichVuList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const handleSearch = (term) => {
        // Gọi hàm tìm kiếm với từ khóa
        searchDichVu(term);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value.trim()) {
            fetchLoaiDichVu(); // Gọi hàm để reset danh sách
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            return; // Dừng lại ở đây, không cần tiếp tục tìm kiếm
        }
        // Debounce để giảm số lần tìm kiếm
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timeout = setTimeout(() => {
            handleSearch(value);
        }, 200); // Tìm kiếm sau 500ms
        setTypingTimeout(timeout);
    };


    const [loaidv, setLoaiDichVu] = useState({
        tenDichVu: '',
        gia: '',
        moTa: '',
        trangThai: true,

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoaiDichVu({
            ...loaidv,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    useEffect(() => {
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
        fetchData(trangThai);
    }, [trangThai]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/DichVu/getAllDichVu`);
            setloaiDichVuList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setloaiDichVuList([]);
        }
    };

    //tìm kiếm
    const searchDichVu = async () => {


        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/DichVu/search?searchTerm=${searchTerm}&tentk=${tentk}`);
            setloaiDichVuList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setloaiDichVuList([]);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DichVu/ThemDichVu?tentk=${tentk}`, {
                tenDichVu: loaidv.tenDichVu,
                gia: loaidv.gia,
                moTa: loaidv.moTa,
                trangThai: loaidv.trangThai,

            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm loại dịch vụ thành công',
                });
                fetchLoaiDichVu();
                handleCloseSecondModal();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thêm loại dịch vụ thất bại',
                });
                handleCloseSecondModal();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Lỗi từ API: Tên dịch vụ đã tồn tại
                const errorMessage = error.response.data || 'Loại dịch vụ này đã tồn tại!';
                Swal.fire('Lỗi!', errorMessage, 'error');
            } else {
                // Các lỗi khác
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi thêm dịch vụ.', 'error');
            }
        }
    };

    //kiểm lỗi validation
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};

        if (!loaidv.tenDichVu) {
            newErrors.tenDichVu = 'Tên loại dịch vụ không được để trống.';
        }
        else if (loaidv.tenDichVu.length>50) {
            newErrors.tenDichVu = 'Tên dịch vụ không quá 50 ký tự.';
        }
        if (!loaidv.gia) {
            newErrors.gia = 'Giá không được để trống.';
        } else if (isNaN(loaidv.gia)) {
            newErrors.gia = 'Giá phải là số.';
        }
        else if (loaidv.gia<=0) {
            newErrors.gia = 'Giá không được nhỏ hoặc hơn bằng 0.';
        }
        if (!loaidv.moTa) {
            newErrors.moTa = 'Mô tả không được để trống.';
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };



    //hàm sửa
    const [editingItem, setEditingItem] = useState(null); // Lưu dữ liệu đang chỉnh sửa
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mở modal chỉnh sửa và điền dữ liệu
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

    // Cập nhật dữ liệu sau khi sửa
    const handleUpdate = async (e) => {
        e.preventDefault();
        // if (!validateForm()) return;
        if(editingItem.gia <=0){
            Swal.fire(
                'Lỗi!',
                'Gía không thể nhỏ hoặc bằng 0.',
                'error'
            );
            return;
        }
        try {
            await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DichVu/SuaDichVu?id=${editingItem.maDichVu}&tentk=${tentk}`, editingItem);
            Swal.fire(
                'Thành công!',
                'Cập nhật loại dịch vụ thành công.',
                'success'
            );
            fetchLoaiDichVu();
            handleCloseEditModal(); // Đóng modal
        } catch (error) {
            console.error("Lỗi khi cập nhật loại dịch vụ:", error);
            Swal.fire(
                'Lỗi!',
                'Không thể cập nhật loại dịch vụ này.',
                'error'
            );
        }
    };

    // Cập nhật giá trị trong form sửa
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: value });

        // setErrors({
        //     ...errors,
        //     [name]: '',
        // });
    };


    //hàm xóa
    const handleDelete = async (maDichVu) => {

        const result = await Swal.fire({
            title: 'Bạn có chắc muốn chuyển trạng thái loại dịch vụ này?',
            text: "Hành động này sẽ không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'hủy',
            confirmButtonText: 'Đồng ý'

        });
        if (result.isConfirmed) {

            try {
                await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DichVu/${maDichVu}?tentk=${tentk}`);
                setloaiDichVuList((prevList) =>
                    prevList.filter((item) => item.maDichVu !== maDichVu)
                );
                Swal.fire(
                    'Thành công!',
                    'Chuyện trạng thái loại dịch vụ thành công.',
                    'success'
                );
                fetchLoaiDichVu();
            } catch (error) {
                console.error("Lỗi khi chuyển loại dịch vụ:", error);
                Swal.fire(
                    'Lỗi!',
                    'Đã xảy ra lỗi ki chuyển loại dịch vụ.',
                    'error'
                );
            }


        }

    };

    //phân trang
    const [pageIndex, setPageIndex] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(8); // Số mục trên mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    // Hàm gọi API để lấy dữ liệu
    const fetchLoaiDichVu = async () => {

        try {
            const response = await axios.get("https://naton69587-001-site1.mtempurl.com/api/DichVu/PhanTrang", {
                params: { pageIndex, pageSize },
            });
            const { data, totalPages } = response.data;
            setloaiDichVuList(data.$values || []);
            // setloaiDichVuList(data.data.$values || []);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    // Gọi API mỗi khi `pageIndex` hoặc `pageSize` thay đổi
    useEffect(() => {
        fetchLoaiDichVu();
    }, [pageIndex, pageSize]);

    // Hàm chuyển trang
    const handlePageChange = (newPageIndex) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
        }
    };

    return (
        <div className="container" style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <h2 className="text-center mb-4">Quản lý loại dịch vụ</h2>
            <br />
            <div class="row">
                <div class="col-sm-11">
                    <div>
                        <input
                            style={{ width: '300px', height: '43px', borderRadius: '13px' }}
                            type="text"
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder="Tìm kiếm loại dịch vụ..."
                        />

                    </div>
                </div>
                <div class="col-sm-1">


                    <button
                        style={{ backgroundColor: 'black', color: 'white', marginLeft: -6 }}
                        className="btn btn-primary"
                        onClick={handleOpenSecondModal}
                    >
                        Thêm
                    </button>


                </div>
            </div>

            <br />
            <div>
                <table >
                    <thead >
                        <tr>
                            <th style={{ color: 'black', fontWeight: 'bold' }}>Tên dịch vụ</th>
                            <th style={{ color: 'black', fontWeight: 'bold' }}>Giá</th>
                            <th style={{ color: 'black', fontWeight: 'bold' }}>Mô tả</th>
                            <th style={{ color: 'black', fontWeight: 'bold' }}>Trạng thái</th>
                            <th style={{ color: 'black', fontWeight: 'bold' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {loaiDichVuList.length === 0 ? (
                            <tr className="no-data">
                                <td colSpan="5">Không có loại dịch vụ nào.</td>
                            </tr>
                        ) : (
                            loaiDichVuList.map((dk) => (
                                <tr key={dk.maDichVu}>
                                    <td>{dk.tenDichVu}</td>
                                    <td>{dk.gia}</td>
                                    <td>{dk.moTa}</td>
                                    <td>
                                        <span
                                            className={`badge ${dk.trangThai ? "bg-success" : "bg-danger"}`}
                                            style={{ fontWeight: "bold" }}
                                        >
                                            {dk.trangThai ? "Còn" : "Hết"}
                                        </span>
                                    </td>
                                  

                                    <td className='d-flex gap-3'>
                                        <button type="button" className="btn btn-primary btn-sm"
                                            title='Sửa'
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(dk)}
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </button>
                                        <button type="button" className="btn btn-primary btn-sm"
                                            title='Chuyển trạng thái'
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDelete(dk.maDichVu)}
                                        >
                                            <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <br />
                {/* phân trang */}

                <div className="pagination">
                    <button
                        style={{
                            height: '40px',
                            width: '50px',
                            backgroundColor: 'black', color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handlePageChange(pageIndex - 1)}
                        disabled={pageIndex === 1}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white' }} />
                    </button>
                    <span style={{ margin: '5px' }}>
                        {pageIndex} / {totalPages}
                    </span>
                    <button
                        style={{
                            height: '40px',
                            width: '50px',
                            backgroundColor: 'black', color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handlePageChange(pageIndex + 1)}
                        disabled={pageIndex === totalPages}
                    >
                        <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white' }} />
                    </button>
                </div>



            </div>



            {/* sửa */}
            {isEditModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Chỉnh sửa loại dịch vụ</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseEditModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3 mt-3">
                                        <label>Tên loại dịch vụ</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.tenDichVu ? 'is-invalid' : ''}`}
                                            name="tenDichVu"
                                            value={editingItem?.tenDichVu || ""}
                                            onChange={handleEditInputChange}
                                            required

                                        />
                                        {errors.tenDichVu && <div className="text-danger">{errors.tenDichVu}</div>}
                                        <label>Giá</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.gia ? 'is-invalid' : ''}`}
                                            name="gia"
                                            value={editingItem?.gia || ""}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                        {errors.gia && <div className="text-danger">{errors.gia}</div>}

                                        <label>Mô tả</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="moTa"
                                            value={editingItem?.moTa || ""}
                                            onChange={handleEditInputChange}

                                        />


                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-success">
                                            Lưu
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCloseEditModal}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* thêm */}
            {isSecondModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                
                                <h4 className="modal-title">Thêm loại dịch vụ</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseSecondModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">

                                        <div className="mb-3 mt-3">
                                            <label>Tên loại dịch vụ</label>
                                            <input type="text" id="name" name="tenDichVu" value={loaidv.tenDichVu} onChange={handleInputChange} className={`form-control ${errors.tenDichVu ? 'is-invalid' : ''}`} />
                                            {errors.tenDichVu && <div className="text-danger">{errors.tenDichVu}</div>}
                                            <label>Giá</label>
                                            <input type="text" id="gia" name="gia" value={loaidv.gia} onChange={handleInputChange} className={`form-control ${errors.gia ? 'is-invalid' : ''}`} />
                                            {errors.gia && <div className="text-danger">{errors.gia}</div>}
                                            <label>Mô tả</label>
                                            <input type="text" id="moTa" name="moTa" value={loaidv.moTa} onChange={handleInputChange} className={`form-control ${errors.moTa ? 'is-invalid' : ''}`} />
                                            {errors.moTa && <div className="text-danger">{errors.moTa}</div>}
                                        </div>
                                    </div>
                                    <div className="modal-footer">

                                        <button type="submit" className="btn btn-primary" >Thêm</button>

                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default Quanlyloaidv;