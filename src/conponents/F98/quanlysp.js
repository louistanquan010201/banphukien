import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

const Quanlysp = () => {

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [sanPham, setSanPham] = useState({
        tenSanPham: '',
        loaiPhuKien: '',
        gia: '',
        soLuong: '',
        hinhAnh: [],
        soMauSac: [],
        mauSac: [], // sẽ chứa mảng màu sắc và số lượng tương ứng
        moTa: '', // Thêm mô tả sản phẩm
        thuongHieu: '', // Thêm trường thương hiệu
        chatLieu: '',
    });
    const handleAddProduct = () => {
        setSanPham({
            tenSanPham: '',
            loaiPhuKien: '',
            nhaCungCap: '',
            gia: '',
            thuongHieu: '',
            chatLieu: '',
            soHinhAnh: '',
            mauSac: [],
            moTa: '',
        });
        setIsEditing(false);
        setIsFormVisible(true);
    };
    const [loaiPhuKiens, setloaiPhuKiens] = useState([]);
    useEffect(() => {
        const fetchloaiPhuKiens = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/loaiphukien');
                console.log('Dữ liệu loại phụ kiện:', response.data);
                // Giả sử response.data có dạng { $values: [...] }
                if (Array.isArray(response.data.$values)) {
                    setloaiPhuKiens(response.data.$values);
                } else {
                    setloaiPhuKiens(response.data); // Nếu không có $values, có thể nó là mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy loại sản phẩm:', error);
            }
        };

        fetchloaiPhuKiens();
    }, []);
    const [products, setProducts] = useState([]);
    const [trangThai, setTrangThai] = useState("DangBan");
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham');
            console.log('Products fetched:', response.data); // Kiểm tra dữ liệu trả về
            if (Array.isArray(response.data.$values)) { // Kiểm tra xem $values có phải là mảng không
                setProducts(response.data.$values); // Gán giá trị mảng vào products
            } else {
                console.error('Expected an array but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const filteredProducts = products.filter(product =>
        (trangThai === "DangBan" && product.trangThai === "Đang bán") ||
        (trangThai === "NgungBan" && product.trangThai === "Ngưng bán")
    );
    useEffect(() => {
        fetchProducts();
    }, []);
    const [loaiXes, setLoaiXes] = useState([]);

    useEffect(() => {
        const fetchLoaiXes = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/loaixe');
                console.log('Dữ liệu loại xe:', response.data); // Kiểm tra dữ liệu

                // Nếu dữ liệu có dạng { $values: [...] }
                if (Array.isArray(response.data.$values)) {
                    setLoaiXes(response.data.$values);
                } else {
                    setLoaiXes(response.data); // Nếu không có $values, có thể nó là mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy loại xe:', error);
            }
        };

        fetchLoaiXes();
    }, []);

    const [nhaCungCaps, setNhaCungCaps] = useState([]);

    useEffect(() => {
        const fetchNhaCungCaps = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/nhacungcap');
                console.log('Dữ liệu nhà cung cấp:', response.data); // Kiểm tra dữ liệu

                // Nếu dữ liệu có dạng { $values: [...] }
                if (Array.isArray(response.data.$values)) {
                    setNhaCungCaps(response.data.$values);
                } else {
                    setNhaCungCaps(response.data); // Nếu không có $values, có thể nó là mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy nhà cung cấp:', error);
            }
        };

        fetchNhaCungCaps();
    }, []);

    const [mauSacOptions, setMauSacOptions] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách màu sắc từ backend
        axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/mauSac')
            .then((response) => {
                console.log('Dữ liệu màu sắc:', response.data); // Kiểm tra dữ liệu nhận được

                // Nếu dữ liệu có dạng { $values: [...] }
                if (Array.isArray(response.data.$values)) {
                    setMauSacOptions(response.data.$values);
                } else {
                    setMauSacOptions(response.data); // Nếu không có $values, có thể nó là mảng
                }
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách màu sắc:", error);
            });
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSanPham((prevSanPham) => ({
            ...prevSanPham,
            [name]: value,
        }));
    };
    const [localSanPham, setLocalSanPham] = useState(sanPham);

    useEffect(() => {
        setSanPham((prevSanPham) => {
            const updatedHinhAnh = Array.isArray(prevSanPham.hinhAnh) ? [...prevSanPham.hinhAnh] : [];

            // Thêm hoặc bớt số lượng ảnh dựa trên `soHinhAnh`
            if (prevSanPham.soHinhAnh > updatedHinhAnh.length) {
                for (let i = updatedHinhAnh.length; i < prevSanPham.soHinhAnh; i++) {
                    updatedHinhAnh.push(null);
                }
            } else if (prevSanPham.soHinhAnh < updatedHinhAnh.length) {
                updatedHinhAnh.length = prevSanPham.soHinhAnh;
            }

            return {
                ...prevSanPham,
                hinhAnh: updatedHinhAnh,
            };
        });
    }, [sanPham.soHinhAnh]);

    useEffect(() => {
        setSanPham((prevSanPham) => {
            const updatedMauSac = Array.isArray(prevSanPham.mauSac) ? [...prevSanPham.mauSac] : [];

            // Thêm hoặc bớt số lượng màu sắc dựa trên `soMauSac`
            if (prevSanPham.soMauSac > updatedMauSac.length) {
                for (let i = updatedMauSac.length; i < prevSanPham.soMauSac; i++) {
                    updatedMauSac.push({ mau: '', soLuong: '' }); // Mặc định
                }
            } else if (prevSanPham.soMauSac < updatedMauSac.length) {
                updatedMauSac.length = prevSanPham.soMauSac; // Giảm số lượng màu
            }

            return {
                ...prevSanPham,
                mauSac: updatedMauSac,
            };
        });
    }, [sanPham.soMauSac]);
    const handleImageCountChange = (num) => {
        setSanPham((prevSanPham) => {
            const updatedHinhAnh = Array.isArray(prevSanPham.hinhAnh) ? [...prevSanPham.hinhAnh] : [];

            if (num > updatedHinhAnh.length) {
                // Thêm phần tử vào mảng nếu số lượng tăng
                for (let i = updatedHinhAnh.length; i < num; i++) {
                    updatedHinhAnh.push(null); // Để trống hoặc giá trị mặc định
                }
            } else if (num < updatedHinhAnh.length) {
                // Giảm số lượng phần tử trong mảng nếu số lượng giảm
                updatedHinhAnh.length = num;
            }

            return {
                ...prevSanPham,
                soHinhAnh: num,
                hinhAnh: updatedHinhAnh
            };
        });
    };
    const removeImage = (index) => {
        const updatedHinhAnh = sanPham.hinhAnh.filter((_, i) => i !== index); // Xóa ảnh tại vị trí index
        setSanPham({ ...sanPham, hinhAnh: updatedHinhAnh });
    };
    const handleMauSacChange = (e, index, field) => {
        const value = e.target.value;

        // Kiểm tra giá trị đầu vào cho trường 'soLuong'
        if (field === 'soLuongMau') {
            // Chỉ chấp nhận số nguyên dương hoặc '0'
            const isValidNumber = value === '' || /^\d+$/.test(value); // Kiểm tra số nguyên dương
            if (!isValidNumber) return; // Nếu không phải số dương, ngừng cập nhật
        }

        // Cập nhật giá trị mới cho trường đã thay đổi
        const newMauSac = [...sanPham.mauSac];
        newMauSac[index] = {
            ...newMauSac[index],
            [field]: value === '' ? '0' : value  // Nếu giá trị trống, gán '0'
        };

        // Cập nhật lại state với danh sách mới
        setSanPham({
            ...sanPham,
            mauSac: newMauSac
        });
    };

    const handleCheckboxChange = (e) => {
        const num = parseInt(e.target.value, 10);
        const newMauSac = Array(num).fill({ mau: '', soLuong: '' });
        setSanPham({
            ...sanPham,
            soMauSac: num,
            mauSac: newMauSac
        });
    };

    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = (product) => {
        console.log("Editing Product:", product); // Kiểm tra giá trị của product

        // Thiết lập giá trị cho sản phẩm
        const updatedSanPham = {
            id: product.id,
            tenSanPham: product.tenSanPham,
            loaiPhuKien: product.loaiPhuKien,
            loaiXe: product.loaiXe,
            nhaCungCap: product.nhaCungCap,
            gia: product.giaBan,
            thuongHieu: product.thuongHieu,
            chatLieu: product.chatLieu,
            moTa: product.moTa,
            hinhAnh: product.hinhAnh || [],
            soHinhAnh: product.soLuongHinhAnh || 1,
            mauSac: product.dsMauSac.$values.map(item => ({
                mauSac: item.mauSac,
                soLuongMau: item.soLuongMau || '', // Khởi tạo với giá trị rỗng nếu không có
            })) || [],
            soMauSac: product.soLuongMauSac || 1,
        };

        setSanPham(updatedSanPham); // Cập nhật trạng thái với giá trị tạm thời

        console.log("SanPham State:", updatedSanPham); // Kiểm tra giá trị sau khi cập nhật

        setIsEditing(true);
        setIsFormVisible(true);
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!confirmDelete) return;

        try {
            // Gọi API xóa sản phẩm
            const response = await fetch(`https://naton69587-001-site1.mtempurl.com/api/SanPham/${productId}`, { // Thay 'API_URL_HERE' bằng URL endpoint thực tế
                method: 'DELETE',
            });

            if (response.status === 204) {
                Swal.fire({
                    title: "Thành công",
                    text: "Sản phẩm đã ngưng hoạt động",
                    icon: "success",
                  }).then(() => {
                    window.location.reload();
                  });

                // Cập nhật lại danh sách sản phẩm sau khi xóa
                setProducts(products.filter((product) => product.id !== productId));
            } else {
                alert("Không thể xóa sản phẩm.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm.");
        }
    };
    const handleBanLai = async (productId) => {
        try {
            const response = await fetch(`https://naton69587-001-site1.mtempurl.com/api/SanPham/${productId}/banlai`, {
                method: 'PATCH', // Sử dụng PATCH để cập nhật
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire({
                title: "Thành công",
                text: "Sản phẩm đã hoạt động lại",
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            if (!response.ok) {
                throw new Error('Failed to update product status');
            }


            setProducts(products.map(product =>
                product.id === productId ? { ...product, trangThai: 'DangBan' } : product
            ));
            console.log(`Bán lại sản phẩm có ID: ${productId}`);
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };
    const handleImageChange = (e, index) => {
        const files = Array.from(e.target.files);
        const newSanPham = { ...sanPham };
        newSanPham.hinhAnh[index] = files[0]; // Lưu file hình ảnh vào mảng
        setSanPham(newSanPham);
    };
    const handleClickToAddImage = () => {
        setSanPham({
            ...sanPham,
            hinhAnh: [...sanPham.hinhAnh, null], // Thêm một ô vuông mới để chọn ảnh
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("tenSanPham", sanPham.tenSanPham);
        formData.append("loaiPhuKien", sanPham.loaiPhuKien);
        formData.append("loaiXe", sanPham.loaiXe);
        formData.append("nhaCungCap", sanPham.nhaCungCap);
        formData.append("gia", sanPham.gia);

        // Đưa hình ảnh vào FormData
        sanPham.hinhAnh.forEach((image, index) => {
            formData.append(`hinhAnh[${index}]`, image); // Đưa từng hình ảnh vào FormData
        });

        // Thêm số lượng hình ảnh vào FormData
        formData.append("soHinhAnh", sanPham.hinhAnh.length);

        formData.append("moTa", sanPham.moTa);
        formData.append("thuongHieu", sanPham.thuongHieu);
        formData.append("chatLieu", sanPham.chatLieu);

        // Đưa màu sắc vào FormData
        sanPham.mauSac.forEach((mauSac, index) => {
            formData.append(`mauSac[${index}][mau]`, mauSac.mauSac); // Thêm màu sắc
            formData.append(`mauSac[${index}][soLuong]`, mauSac.soLuongMau); // Thêm số lượng
        });

        // Thêm số lượng màu sắc vào FormData
        formData.append("soMauSac", sanPham.mauSac.length);

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Gửi yêu cầu tới API
        try {
            const apiUrl = isEditing ? 
                `https://naton69587-001-site1.mtempurl.com/api/SanPham/CapNhat/${sanPham.id}` : // URL cập nhật
                'https://naton69587-001-site1.mtempurl.com/api/SanPham/Them'; // URL thêm mới
        
            const response = await fetch(apiUrl, {
                method: isEditing ? 'PUT' : 'POST', // Sử dụng PUT nếu đang chỉnh sửa, POST nếu thêm mới
                body: formData
            });
        
            if (!response.ok) {
                const errorText = await response.text(); // Lấy nội dung phản hồi dưới dạng văn bản
                console.error('Lỗi từ máy chủ:', errorText); // In ra nội dung lỗi
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                    if (errorData.message) {
                        // Hiển thị thông báo lỗi từ máy chủ
                        Swal.fire({
                            title: "Lỗi",
                            text: errorData.message,
                            icon: "error",
                        });
                    }
                } catch (parseError) {
                    throw new Error('Đã xảy ra lỗi không xác định: ' + errorText);
                }
            } else {
                Swal.fire({
                    title: "Thành công",
                    text: isEditing ? "Sửa sản phẩm thành công" : "Thêm sản phẩm thành công",
                    icon: "success",
                }).then(() => {
                    window.location.reload();
                });
        
                const sanPhamMoi = await response.json(); // Đổi tên biến ở đây
                console.log('Sản phẩm đã được ' + (isEditing ? 'cập nhật' : 'thêm mới') + ':', sanPhamMoi);
            }
        } catch (error) {
            console.error('Lỗi:', error.message); // Hiển thị thông báo lỗi
            alert(error.message); // Hiển thị thông báo lỗi cho người dùng
        }
    };


    return (
        <div className={`container ${isFormVisible ? 'blur-background' : ''}`}>


            <div className="them-san-pham-container">
                <h2 onClick={handleAddProduct} className="add-product-header" style={{ textDecoration: 'none' }}>
                    Thêm Sản Phẩm
                </h2>
                {isFormVisible && (
                    <div className="overlay">
                        <div className="form-popup">
                            <button className="close-button" onClick={() => {
                                setIsFormVisible(false);
                                setSanPham((prevSanPham) => ({
                                    ...prevSanPham,
                                    hinhAnh: [], // Thiết lập lại danh sách hình ảnh
                                    soHinhAnh: 0, // Thiết lập lại số lượng hình ảnh
                                    mauSac: [], // Thiết lập lại danh sách màu sắc
                                    soMauSac: 0 // Thiết lập lại số lượng màu sắc
                                }));
                            }}>
                                X
                            </button>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên sản phẩm:</label>
                                    <input
                                        type="text"
                                        name="tenSanPham"
                                        value={sanPham.tenSanPham || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Loại sản phẩm:</label>
                                    <select
                                        name="loaiPhuKien"
                                        value={sanPham.loaiPhuKien || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        className="custom-select"
                                        required
                                    >
                                        <option value="">Chọn loại sản phẩm</option>
                                        {loaiPhuKiens
                                            .filter((loai) => loai.trangThai === 'Đang hoạt động') // Lọc loại sản phẩm có trạng thái "Đang hoạt động"
                                            .map((loai) => (
                                                <option key={loai.id} value={loai.tenLoaiPhuKien}>
                                                    {loai.tenLoaiPhuKien}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Loại xe:</label>
                                    <select
                                        name="loaiXe"
                                        value={sanPham.loaiXe || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        className="custom-select"
                                        required
                                    >
                                        <option value="">Chọn loại xe</option>
                                        {loaiXes
                                            .filter((loai) => loai.trangThai === 'Đang hoạt động') // Lọc loại xe có trạng thái "Đang hoạt động"
                                            .map((loai) => (
                                                <option key={loai.id} value={loai.tenLoaiXe}>
                                                    {loai.tenLoaiXe}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Nhà cung cấp:</label>
                                    <select
                                        name="nhaCungCap"
                                        value={sanPham.nhaCungCap || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        className="custom-select"
                                        required
                                    >
                                        <option value="">Chọn nhà cung cấp</option>
                                        {nhaCungCaps.map((nhaCungCap) => (
                                            <option key={nhaCungCap.id} value={nhaCungCap.tenNhaCungCap}>
                                                {nhaCungCap.tenNhaCungCap}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Giá:</label>
                                    <input
                                        type="text"
                                        name="gia"
                                        value={sanPham.gia || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        placeholder="Nhập giá sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Thương hiệu:</label>
                                    <input
                                        type="text"
                                        name="thuongHieu"
                                        value={sanPham.thuongHieu || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        placeholder="Nhập thương hiệu"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Chất liệu:</label>
                                    <input
                                        type="text"
                                        name="chatLieu"
                                        value={sanPham.chatLieu || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        placeholder="Nhập chất liệu"
                                        required
                                    />
                                </div>

                                <div className="chon">
                                    <label>Chọn hình ảnh</label>
                                    <div className="image-box-container">
                                        {Array.isArray(sanPham.hinhAnh) && sanPham.hinhAnh.map((image, index) => (
                                            <div
                                                key={index}
                                                className="image-box"
                                                onClick={() => document.getElementById(`fileInput${index}`).click()}
                                            >
                                                {image ? (
                                                    <div className="selected-image">
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Hình ảnh ${index + 1}`}
                                                            className="selected-image-thumbnail"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Ngăn chặn sự kiện click trên toàn bộ div
                                                                removeImage(index);
                                                            }}
                                                            className="remove-image-btn"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span>+</span> // Dấu cộng khi chưa chọn ảnh
                                                )}
                                                <input
                                                    type="file"
                                                    id={`fileInput${index}`}
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, index)}
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="image-box add-image-box"
                                            onClick={handleClickToAddImage}
                                        >
                                            <span>+</span> {/* Dấu cộng để thêm ô vuông chọn ảnh */}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Mô tả sản phẩm:</label>
                                    <textarea
                                        name="moTa"
                                        value={sanPham.moTa || ''} // Đảm bảo trường không bị undefined
                                        onChange={handleInputChange}
                                        placeholder="Nhập mô tả sản phẩm"
                                        rows={4}
                                        required
                                        style={{ width: '99%' }}
                                    />
                                </div>

                                <div className="chon" style={{ paddingBottom: '10px' }}>
                                    <label>Chọn màu sắc và số lượng:</label>
                                    {sanPham.mauSac.map((mauSacItem, index) => (
                                        <div key={index} className="form-group">
                                            <label>Màu sắc {index + 1}:</label>
                                            <select
                                                value={mauSacItem?.mauSac || ''}
                                                onChange={(e) => handleMauSacChange(e, index, 'mauSac')}
                                                className="custom-select"
                                                required
                                            >
                                                <option value="">Chọn màu sắc</option>
                                                {mauSacOptions
                                                    .filter((mau) => mau.trangThai === 'Đang hoạt động') // Lọc màu sắc có trạng thái "Đang hoạt động"
                                                    .map((mau) => (
                                                        <option key={mau.id} value={mau.tenMau}>
                                                            {mau.tenMau}
                                                        </option>
                                                    ))}
                                            </select>

                                            <label>Số lượng:</label>
                                            <input
                                                type="text"
                                                value={mauSacItem?.soLuongMau ?? '0'}
                                                onChange={(e) => handleMauSacChange(e, index, 'soLuongMau')}
                                                placeholder="Nhập số lượng"
                                                required
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            <div className="nutxoa" style={{ paddingTop: '10px' }}>
                                                {/* Nút xóa màu sắc */}
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        setSanPham((prevSanPham) => ({
                                                            ...prevSanPham,
                                                            mauSac: prevSanPham.mauSac.filter((_, i) => i !== index), // Loại bỏ màu sắc tại chỉ mục index
                                                        }));
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </div>

                                        </div>
                                    ))}

                                    {/* Nút thêm màu sắc */}
                                    <div style={{ marginTop: '20px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                // Lọc ra các màu sắc có trạng thái "Đang hoạt động"
                                                const activeColors = mauSacOptions.filter((mau) => mau.trangThai === 'Đang hoạt động');

                                                // Kiểm tra số lượng màu sắc đã chọn
                                                if (sanPham.mauSac.length < activeColors.length) {
                                                    setSanPham((prevSanPham) => ({
                                                        ...prevSanPham,
                                                        mauSac: [
                                                            ...prevSanPham.mauSac,
                                                            { mauSac: '', soLuongMau: '0' }, // Thêm màu sắc mới
                                                        ],
                                                    }));
                                                } else {
                                                    alert("Không thể thêm màu sắc. Bạn đã chọn đủ số lượng màu có trạng thái 'Đang hoạt động'.");
                                                }
                                            }}
                                        >
                                            Thêm màu sắc
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                >
                                    {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                                </button>
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
                <h2>Danh Sách Sản Phẩm</h2>
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab-btn ${trangThai === "DangBan" ? "active" : ""}`}
                        onClick={() => setTrangThai("DangBan")}
                    >
                        Đang bán
                    </button>
                    <button
                        className={`tab-btn ${trangThai === "NgungBan" ? "active" : ""}`}
                        onClick={() => setTrangThai("NgungBan")}
                    >
                        Ngưng bán
                    </button>
                </div>

                {/* Table */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sản Phẩm</th>
                            <th>Hình Ảnh</th>
                            <th>Số Lượng</th>
                            <th>Giá Bán</th>
                            <th>Thương Hiệu</th>
                            <th>Chất Liệu</th>
                            <th>Mô Tả</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.tenSanPham}</td>
                                    <td>
                                        <img
                                            src={product.hinhAnh.$values[0]}
                                            alt={product.tenSanPham}
                                            style={{ width: "100px" }}
                                        />
                                    </td>
                                    <td>{product.soLuong}</td>
                                    <td>{product.giaBan.toLocaleString("vi-VN")} VND</td>
                                    <td>{product.thuongHieu}</td>
                                    <td>{product.chatLieu}</td>
                                    <td>{product.moTa}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn btn-primary"
                                            style={{ marginRight: "5px" }}
                                        >
                                            Sửa
                                        </button>
                                        {trangThai === "NgungBan" ? (
                                            <button
                                                onClick={() => handleBanLai(product.id)}
                                                className="btn btn-success"
                                            >
                                                Bán lại
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn-danger"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Không có sản phẩm nào để hiển thị</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Quanlysp;
