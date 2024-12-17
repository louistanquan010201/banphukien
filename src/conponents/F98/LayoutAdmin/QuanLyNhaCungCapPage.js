import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Quanlynhacungcap = () => {

    const tentk = sessionStorage.getItem('tenTK');
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const handleOpenSecondModal = () => {
        setIsSecondModalOpen(true);
    };
    const handleCloseSecondModal = () => {
        setIsSecondModalOpen(false);
    };
    const [trangThai] = useState();
    const [nhacungcapList, setnhacungcapList] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (term) => {
        // Gọi hàm tìm kiếm với từ khóa
        searchnhacungcap(term);
    };
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value.trim()) {
            fetchNhaCungCap(); // Gọi hàm để reset danh sách
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

    const [nhacc, setnhacc] = useState({
        tenNhaCungCap: '',
        diaChi: "",
        email: '',
        soDienThoai: '',
        maSoThue: '',
        xuatSu: '',
        tenHangPhuKien: '',
        tinhTrang: true,

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnhacc({
            ...nhacc,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    useEffect(() => {
        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
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
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/NhaCungCap`);
            setnhacungcapList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setnhacungcapList([]);
        }
    };

    //tìm kiếm
    const searchnhacungcap = async () => {
        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/NhaCungCap/search?searchTerm=${searchTerm}&tentk=${tentk}`);
            setnhacungcapList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setnhacungcapList([]);
        }
    };

    //ham sửa
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
        try {
            await axios.put(`https://naton69587-001-site1.mtempurl.com/api/NhaCungCap/${editingItem.id}?tentk=${tentk}`, editingItem);
            Swal.fire(
                'Thành công!',
                'Cập nhật nhà cung cấp thành công.',
                'success'
            );
            fetchNhaCungCap();
            handleCloseEditModal(); // Đóng modal
        } catch (error) {
            console.error("Lỗi khi cập nhật nhà cung cấp:", error);
            Swal.fire(
                'Lỗi!',
                'Không thể cập nhật nhà cung cấp này.',
                'error'
            );
        }
    };

    // Cập nhật giá trị trong form sửa
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {

            const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/NhaCungCap?tentk=${tentk}`, {
                tenNhaCungCap: nhacc.tenNhaCungCap,
                diaChi: nhacc.diaChi,
                email: nhacc.email,
                soDienThoai: nhacc.soDienThoai,
                maSoThue: nhacc.maSoThue,
                xuatSu: nhacc.xuatSu,
                tenHangPhuKien: nhacc.tenHangPhuKien,

                tinhTrang: nhacc.tinhTrang,

            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm nhà cung cấp thành công',
                });
                fetchNhaCungCap();
                handleCloseSecondModal();

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thêm nhà cung cấp thất bại',
                });
                handleCloseSecondModal();
            }

            console.log(response);
        } catch (error) {

            if (error.response && error.response.status === 400) {
                
                const errorMessage = error.response.data || 'Nhà cung cấp này đã tồn tại!';
                Swal.fire('Lỗi!', errorMessage, 'error');
            } else {
                // Các lỗi khác
                console.error("Lỗi khi thêm nhà cung cấp:", error);
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi thêm nhà cung cấp.', 'error');
            }

        }
    };

    //kiểm lỗi validation
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};

        if (!nhacc.tenNhaCungCap) {
            newErrors.tenNhaCungCap = 'Tên nhà cung cấp không được để trống.';
        }
        else if(nhacc.tenNhaCungCap.length>50){
            newErrors.tenNhaCungCap = 'Tên nhà cung cấp không được quá 50 ký tự.';
        }
        if (!nhacc.soDienThoai) {
            newErrors.soDienThoai = 'Số điện thoại không được để trống.';
        } else if (isNaN(nhacc.soDienThoai)) {
            newErrors.soDienThoai = 'Số điện thoại phải là số.';
        }
        else if (nhacc.soDienThoai.length<10||nhacc.soDienThoai.length>10) {
            newErrors.soDienThoai = 'Số điện thoại phải là 10 số.';
        }
        if (!nhacc.email) {
            newErrors.email = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nhacc.email)) {
            newErrors.email = 'Email không hợp lệ.';
        }
        if (!nhacc.diaChi) {
            newErrors.diaChi = 'Địa chỉ không được để trống.';
        }
        if (!nhacc.maSoThue) {
            newErrors.maSoThue = 'Mã số thuế không được để trống.';
        }
        else if (nhacc.maSoThue.length !== 10 && nhacc.maSoThue.length !== 12) {
            newErrors.maSoThue = 'Mã số thuế phải là 10 hoặc 12 số.';
        }        
        else if (isNaN(nhacc.maSoThue)) {
            newErrors.maSoThue = 'Mã số thuế phải là số.';
        }
        if (!nhacc.xuatSu) {
            newErrors.xuatSu = 'Xuất xứ không được để trống.';
        }
        else if(nhacc.xuatSu.length>50){
            newErrors.xuatSu = 'Xuất sứ không được quá 50 ký tự.';
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };

    //hàm xóa
    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: 'Bạn có chắc muốn chuyển trạng thái nhà cung cấp này?',
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
                await axios.post(`https://naton69587-001-site1.mtempurl.com/api/NhaCungCap/${id}?tentk=${tentk}`);
                setnhacungcapList((prevList) =>
                    prevList.filter((item) => item.id !== id)
                );
                Swal.fire(
                    'Thành công!',
                    'Chuyển trạng thái nhà cung cấp thành công.',
                    'success'
                );
                fetchNhaCungCap();
            } catch (error) {
                console.error("Lỗi khi chuyển nhà cung cấp:", error);
                Swal.fire(
                    'Lỗi!',
                    'Đã xảy ra lỗi khi chuyển trạng thái nhà cung cấp.',
                    'error'
                );
            }
        }
    };

    const [pageIndex, setPageIndex] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(8); // Số mục trên mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    // Hàm gọi API để lấy dữ liệu
    const fetchNhaCungCap = async () => {

        try {
            const response = await axios.get("https://naton69587-001-site1.mtempurl.com/api/NhaCungCap/PhanTrang", {
                params: { pageIndex, pageSize },
            });
            const { data, totalPages } = response.data;
            setnhacungcapList(data.$values || []);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    // Gọi API mỗi khi `pageIndex` hoặc `pageSize` thay đổi
    useEffect(() => {
        fetchNhaCungCap();
    }, [pageIndex, pageSize]);

    const handlePageChange = (newPageIndex) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
        }
    };

    // địa chỉ thêm
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Error fetching provinces:", error));
    }, []);
    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(response => setDistricts(response.data.districts || []))
                .catch(error => console.error("Error fetching districts:", error));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(response => setWards(response.data.wards || []))
                .catch(error => console.error("Error fetching wards:", error));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (editingItem?.diaChi) {
            const [ward, district, province] = editingItem.diaChi.split('/');
            // Tìm và thiết lập giá trị ban đầu cho tỉnh, quận, và phường mà không dùng .trim()
            const selectedProvinceObj = provinces.find((p) => p.name === province);
            const selectedDistrictObj = districts.find((d) => d.name === district);
            const selectedWardObj = wards.find((w) => w.name === ward);

            if (selectedProvinceObj) {
                setSelectedProvince(selectedProvinceObj.code.toString());
                setProvinceName(selectedProvinceObj.name);
            }
            if (selectedDistrictObj) {
                setSelectedDistrict(selectedDistrictObj.code.toString());
                setDistrictName(selectedDistrictObj.name);
            }
            if (selectedWardObj) {
                setSelectedWard(selectedWardObj.code.toString());
                setWardName(selectedWardObj.name);
            }
        }
    }, [editingItem, provinces, districts, wards]);

    useEffect(() => {
        const DiaChi = [wardName, districtName, provinceName].filter(Boolean).join('/');
        setnhacc(prevState => ({ ...prevState, diaChi: DiaChi })); // Cập nhật nhacc
        setEditingItem((prev) => ({ ...prev, diaChi: DiaChi }));
    }, [provinceName, districtName, wardName]);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const selectedProvince = provinces.find(p => p.code === parseInt(provinceCode));
        setSelectedProvince(provinceCode);
        setProvinceName(selectedProvince ? selectedProvince.name : "");
        setSelectedDistrict("");
        setSelectedWard("");
        setDistrictName("");
        setWardName("");
    };
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const selectedDistrict = districts.find(d => d.code === parseInt(districtCode));
        setSelectedDistrict(districtCode);
        setDistrictName(selectedDistrict ? selectedDistrict.name : "");
        setSelectedWard("");
        setWardName("");
    };
    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find(w => w.code === parseInt(wardCode));
        setSelectedWard(wardCode);
        setWardName(selectedWard ? selectedWard.name : "");
    };

    return (
        <div className="container" style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <h2 className="text-center mb-4">Quản lý nhà cung cấp</h2>
            <br />
            <div class="row">
                <div class="col-sm-11">
                    <div>
                        <input
                            style={{ width: '300px', height: '43px', borderRadius: '13px' }}
                            type="text"
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder="Tìm kiếm nhà cung cấp..."
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
            <table >
                <thead >
                    <tr style={{ textAlign: 'center', backgroundColor: 'black' }}>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Tên nhà cung cấp</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Số điện thoại</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Email</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Địa chỉ</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Mã số thuế</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}>Xuất xứ</th>
                        <th style={{ color: 'black', fontWeight:'bold'}}>Trạng thái</th>
                        <th style={{ color: 'black', fontWeight:'bold' }}></th>
                        
                    </tr>
                </thead>
                <tbody className="table-body">
                    {nhacungcapList.length === 0 ? (
                        <tr className="no-data">
                            <td colSpan="8">Không có nhà cung cấp nào .</td>
                        </tr>
                    ) : (
                        nhacungcapList.map((dk) => (
                            <tr key={dk.id} >
                                <td style={{ textAlign: 'center' }}>{dk.tenNhaCungCap}</td>
                                <td style={{ textAlign: 'center' }}>{dk.soDienThoai}</td>
                                <td style={{ textAlign: 'center' }}>{dk.email}</td>
                                <td style={{ textAlign: 'center' }}>{dk.diaChi}</td>
                                <td style={{ textAlign: 'center' }}>{dk.maSoThue}</td>
                                <td style={{ textAlign: 'center' }}>{dk.xuatSu}</td>
                                <td style={{ textAlign: 'center' }}>

                                    <span
                                        className={`badge ${dk.tinhTrang ? 'bg-success' : 'bg-danger'}`}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {dk.tinhTrang ? "Hoạt động" : "Ngừng hoạt động"}
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
                                        onClick={() => handleDelete(dk.id)}
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
            {/* Phân trang */}


            <div className="pagination">
                <button
                    style={{ height: '40px', width: '50px', backgroundColor: 'black', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 1}

                >
                    <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white' }} />
                </button>
                <span style={{ margin: '5px' }}>
                    {pageIndex} / {totalPages}
                </span>
                <button
                    style={{ height: '40px', width: '50px', backgroundColor: 'black', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex === totalPages}
                >
                    <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white' }} />
                </button>
            </div>


            {/* sửa */}
            {isEditModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Chỉnh sửa nhà cung cấp</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseEditModal}
                                ></button>
                            </div>

                            <form onSubmit={handleUpdate}>
                                <div className="modal-body row">
                                    <div className="col-sm-6">
                                        <p>
                                            <label style={{ color: 'black'}}>Tên nhà cung cấp</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="tenNhaCungCap"
                                                value={editingItem?.tenNhaCungCap || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p>
                                        <p>
                                            <label style={{ color: 'black'}}>Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="soDienThoai"
                                                value={editingItem?.soDienThoai || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p>
                                        <p>
                                            <label style={{ color: 'black'}}>email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                value={editingItem?.email || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p>

                                        <p>
                                            <label style={{ color: 'black'}}>Mã số thuế</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="maSoThue"
                                                value={editingItem?.maSoThue || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p>
                                    </div>

                                    <div className="col-sm-6">
                                        {/* <p>
                                            <label>Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="diaChi"
                                                value={editingItem?.diaChi || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p> */}

                                        <p>
                                            <label style={{ color: 'black'}}>Tỉnh/Thành phố</label>
                                            <select
                                                className="form-control"
                                                value={selectedProvince}
                                                onChange={handleProvinceChange}
                                                required
                                            >
                                                <option value="">Chọn tỉnh/thành</option>
                                                {provinces.map((province) => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </p>
                                        <p>
                                            <label style={{ color: 'black'}}>Quận/Huyện</label>
                                            <select
                                                className="form-control"
                                                value={selectedDistrict}
                                                onChange={handleDistrictChange}
                                                disabled={!selectedProvince}
                                                required
                                            >
                                                <option value="">Chọn quận/huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </p>
                                        <p>
                                            <label style={{ color: 'black'}}>Phường/Xã</label>
                                            <select
                                                className="form-control"
                                                value={selectedWard}
                                                onChange={handleWardChange}
                                                disabled={!selectedDistrict}
                                                required
                                            >
                                                <option value="">Chọn phường/xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </p>

                                        <p>
                                            <label style={{ color: 'black'}}>Xuất sứ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="xuatSu"
                                                value={editingItem?.xuatSu || ""}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </p>

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
                                </div>
                            </form>
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
                                <h4 className="modal-title">Thêm nhà cung cấp</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseSecondModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body row">
                                        <div className="col-sm-6">
                                            <p>
                                                <label style={{ color: 'black'}}>Tên nhà cung cấp</label>
                                                <input type="text" className={`form-control ${errors.tenNhaCungCap ? 'is-invalid' : ''}`} id="tenNhaCungCap" name="tenNhaCungCap" value={nhacc.tenNhaCungCap} onChange={handleInputChange} />
                                                {errors.tenNhaCungCap && <div className="text-danger">{errors.tenNhaCungCap}</div>}
                                            </p>

                                            {/* Tỉnh/Thành phố */}
                                            <p>
                                                <label style={{ color: 'black'}}>Tỉnh/Thành phố</label>
                                                <select
                                                    className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                                                    value={selectedProvince}
                                                    onChange={handleProvinceChange}
                                                >
                                                    <option value="">-- Chọn tỉnh/thành phố --</option>
                                                    {provinces.map(province => (
                                                        <option key={province.code} value={province.code}>
                                                            {province.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.province && <div className="text-danger">{errors.province}</div>}
                                            </p>

                                            {/* Quận/Huyện */}
                                            <p>
                                                <label style={{ color: 'black'}}>Quận/Huyện</label>
                                                <select
                                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                    value={selectedDistrict}
                                                    onChange={handleDistrictChange}
                                                    disabled={!selectedProvince}
                                                >
                                                    <option value="">-- Chọn quận/huyện --</option>
                                                    {districts.map(district => (
                                                        <option key={district.code} value={district.code}>
                                                            {district.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.district && <div className="text-danger">{errors.district}</div>}
                                            </p>

                                            {/* Xã/Phường */}
                                            <p>
                                                <label style={{ color: 'black'}}>Xã/Phường</label>
                                                <select
                                                    className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                                                    value={selectedWard}
                                                    onChange={handleWardChange}
                                                    disabled={!selectedDistrict}
                                                >
                                                    <option value="">-- Chọn xã/phường --</option>
                                                    {wards.map(ward => (
                                                        <option key={ward.code} value={ward.code}>
                                                            {ward.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.ward && <div className="text-danger">{errors.ward}</div>}
                                            </p>
                                        </div>

                                        <div className="col-sm-6">
                                            <p>
                                                <label style={{ color: 'black'}}>Số điện thoại</label>
                                                <input type="text" className={`form-control ${errors.soDienThoai ? 'is-invalid' : ''}`} id="soDienThoai" name="soDienThoai" value={nhacc.soDienThoai} onChange={handleInputChange} />
                                                {errors.soDienThoai && <div className="text-danger">{errors.soDienThoai}</div>}
                                            </p>
                                            <p>
                                                <label style={{ color: 'black'}}>Email</label>
                                                <input type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={nhacc.email} onChange={handleInputChange} />
                                                {errors.email && <div className="text-danger">{errors.email}</div>}                                           </p>

                                            <p>
                                                <label style={{ color: 'black'}}>Mã số thuế</label>
                                                <input type="text" className={`form-control ${errors.maSoThue ? 'is-invalid' : ''}`} id="maSoThue" name="maSoThue" value={nhacc.maSoThue} onChange={handleInputChange} />
                                                {errors.maSoThue && <div className="text-danger">{errors.maSoThue}</div>}
                                            </p>
                                            <p>
                                                <label style={{ color: 'black'}}>Xuất xứ</label>
                                                <input type="text" className={`form-control ${errors.xuatSu ? 'is-invalid' : ''}`} id="xuatSu" name="xuatSu" value={nhacc.xuatSu} onChange={handleInputChange} />
                                                {errors.xuatSu && <div className="text-danger">{errors.xuatSu}</div>}
                                            </p>
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

export default Quanlynhacungcap;