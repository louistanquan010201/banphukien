import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './voucher.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Voucher = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const tentk = sessionStorage.getItem('tenTK');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        timeStart: '',
        timeEnd: '',
        // timeCreated: new Date().toISOString(),
        discountType: '',
        discount: 0,
        min_Order_Value: 0,
        max_Discount: 0,
        stock: 0,
        status: 1,
        Describe: ''
    });
    const [errors, setErrors] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [tableVisibility, setTableVisibility] = useState({
        active: true,
        inactive: true
    });

    useEffect(() => {
        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
        fetchVouchers();
    }, []);
    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Voucher');
            setVoucherData(response.data.$values);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu voucher:', error);
            toast.error('Không thể lấy danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdowns = {};
            const now = new Date().getTime();
            let needUpdate = false;
            voucherData.forEach(async voucher => {
                const start = new Date(voucher.timeStart).getTime();
                const end = new Date(voucher.timeEnd).getTime();
                const timeRemaining = end - now;

                if (voucher.status === 0) {
                    newCountdowns[voucher.id] = {
                        status: 'paused',
                        time: 'Tạm dừng'
                    };
                    return;
                }

                if (voucher.status === 1) {
                    if (timeRemaining <= 0 && timeRemaining > -1000) {
                        try {
                            const updatedVoucher = {
                                ...voucher,
                                status: 0
                            };
                            await axios.patch(`https://naton69587-001-site1.mtempurl.com/api/Voucher/update-voucher?tentk=${tentk}`, updatedVoucher);
                            needUpdate = true;
                        } catch (error) {
                            console.error('Lỗi khi cập nhật trạng thái voucher hết hạn:', error);
                        }
                    }

                    if (now < start) {
                        newCountdowns[voucher.id] = {
                            status: 'waiting',
                            time: formatCountdown(start - now)
                        };
                    } else if (now >= start && now < end) {
                        newCountdowns[voucher.id] = {
                            status: 'running',
                            time: formatCountdown(timeRemaining)
                        };
                    } else {
                        newCountdowns[voucher.id] = {
                            status: 'expired',
                            time: 'Đã kết thúc'
                        };
                    }
                }
            });

            setCountdowns(newCountdowns);
            if (needUpdate) {
                fetchVouchers();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [voucherData]);

    const formatCountdown = (milliseconds) => {
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${days} ngày ${hours} : ${minutes} : ${seconds}`;
    };

    const renderCountdown = (voucher) => {
        const countdown = countdowns[voucher.id];
        if (!countdown) return null;
        if (voucher.status === 0) {
            return (
                <div className="countdown countdown-paused">
                    <span className="countdown-time">Tạm dừng</span>
                </div>
            );
        }

        let statusText = '';
        let statusClass = '';

        switch (countdown.status) {
            case 'waiting':
                statusText = 'Bắt đầu sau:';
                statusClass = 'countdown-waiting';
                break;
            case 'running':
                statusText = 'Kết thúc sau:';
                statusClass = 'countdown-running';
                break;
            case 'expired':
                statusClass = 'countdown-expired';
                break;
        }

        return (
            <div className={`countdown ${statusClass}`}>
                <div className="countdown-status">{statusText}</div>
                <span className="countdown-time">{countdown.time}</span>
            </div>
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Tên Voucher là bắt buộc';
        }

        if (!formData.discount) {
            newErrors.discount = 'Giá trị giảm giá là bắt buộc';
        } else if (formData.discount < 0) {
            newErrors.discount = 'Giá trị giảm giá không được âm';
        }

        if (!formData.min_Order_Value) {
            newErrors.min_Order_Value = 'Giá trị đơn hàng tối thiểu là bắt buộc';
        } else if (formData.min_Order_Value < 0) {
            newErrors.min_Order_Value = 'Giá trị đơn hàng tối thiểu không được âm';
        }

        if (!formData.max_Discount) {
            newErrors.max_Discount = 'Giảm giá tối đa là bắt buộc';
        } else if (formData.max_Discount < 0) {
            newErrors.max_Discount = 'Giảm giá tối đa không được âm';
        }

        if (!formData.stock) {
            newErrors.stock = 'Số lượng là bắt buộc';
        } else if (formData.stock <= 0) {
            newErrors.stock = 'Số lượng phải lớn hơn 0';
        }

        if (!formData.timeStart) {
            newErrors.timeStart = 'Ngày bắt đầu là bắt buộc';
        }
        if (!formData.timeEnd) {
            newErrors.timeEnd = 'Ngày kết thúc là bắt buộc';
        }
        if (formData.timeStart && formData.timeEnd && formData.timeStart > formData.timeEnd) {
            newErrors.timeEnd = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowErrors(true);
        if (!validate()) return;

        const formattedData = {
            ...formData,
            timeStart: new Date(formData.timeStart).toISOString(),
            timeEnd: new Date(formData.timeEnd).toISOString(),
            discount: parseInt(formData.discount),
            min_Order_Value: parseInt(formData.min_Order_Value),
            max_Discount: parseInt(formData.max_Discount),
            stock: parseInt(formData.stock),
            status: parseInt(formData.status),
            Describe: formData.Describe
        };

        try {
            setSelectedVoucher(formattedData);
            if (isEditing) {
                await axios.put(`https://naton69587-001-site1.mtempurl.com/api/Voucher/update-voucher/${tentk}`, formattedData);
                Swal.fire({
                    title: "Thành công!",
                    text: "Cập nhật voucher thành công",
                    icon: "success"
                });
                // console.log(formattedData);

            } else {
                // console.log(formattedData);
                await axios.post(`https://naton69587-001-site1.mtempurl.com/api/Voucher/create-voucher?tentk=${tentk}`, formattedData);
                Swal.fire({
                    title: "Thành công!",
                    text: "Thêm voucher thành công",
                    icon: "success"
                });
            }

            await fetchVouchers();

            if (isEditing) {
                setShowForm(false);
                setShowDetails(true);
            } else {
                setShowForm(false);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            Swal.fire({
                title: "Lỗi!",
                text: isEditing ? 'Cập nhật thất bại' : 'Thêm mới thất bại',
                icon: "error"
            });
        }
    };

    const handleToggleStatus = async (voucher) => {
        const now = new Date().getTime();
        const end = new Date(voucher.timeEnd).getTime();

        if (now >= end && voucher.status === 0) {
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể kích hoạt voucher đã hết hạn",
                icon: "error"
            });
            return;
        }

        const newStatus = voucher.status === 1 ? 0 : 1;
        const confirmMessage = voucher.status === 1
            ? 'Bạn có chắc chắn muốn ngưng hoạt động voucher này?'
            : 'Bạn có chắc chắn muốn kích hoạt lại voucher này?';

        const result = await Swal.fire({
            title: "Xác nhận",
            text: confirmMessage,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy"
        });

        if (result.isConfirmed) {
            try {
                const updatedVoucher = {
                    ...voucher,
                    status: newStatus
                };

                console.log('Cập nhật voucher:', updatedVoucher);

                await axios.put(`https://naton69587-001-site1.mtempurl.com/api/Voucher/update-voucher/${tentk}`, updatedVoucher);

                Swal.fire({
                    title: "Thành công!",
                    text: voucher.status === 1 ? 'Đã ngưng hoạt động voucher thành công' : 'Đã kích hoạt voucher thành công',
                    icon: "success"
                });

                fetchVouchers();
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái:', error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Không thể cập nhật trạng thái voucher",
                    icon: "error"
                });
            }
        }
    };

    const renderForm = () => (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header" style={{ padding: '0rem 0rem 1rem 0rem' }}>
                    <h4>{isEditing ? 'Cập nhật Voucher' : 'Thêm Voucher mới'}</h4>
                    <button onClick={() => {
                        if (isEditing) {
                            setShowForm(false);
                            setShowDetails(true);
                        } else {
                            setShowForm(false);
                        }
                    }} className="close-buttonvoucher" style={{backgroundColor:"red"}}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="voucher-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên Voucher</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={showErrors && errors.name ? 'error' : ''}
                            />
                            {showErrors && errors.name && <p className="error-message">{errors.name}</p>}
                        </div>

                        <div className="form-group">
                            <label>Phương thức giảm giá</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="discountType"
                                        value="random"
                                        checked={formData.discountType === 'random'}
                                        onChange={handleChange}
                                    />
                                    <span>Voucher random</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="discountType"
                                        value="user"
                                        checked={formData.discountType === 'user'}
                                        onChange={handleChange}
                                    />
                                    <span>Voucher người dùng</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                {formData.discountType === 'random'
                                    ? 'Số tiền giảm (VNĐ)'
                                    : formData.discountType === 'user'
                                        ? 'Số tiền giảm (VNĐ)'
                                        : 'Giá trị giảm giá'}
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (formData.discountType === 'percent' && value > 100) {
                                        return;
                                    }
                                    handleChange(e);
                                    console.log(`${formData.discountType === 'random' ? 'Phần trăm' : 'Số tiền'} giảm giá:`, value);
                                }}
                                className={showErrors && errors.discount ? 'error' : ''}
                                min="0"
                                // max={formData.discountType === 'random' ? "100" : undefined}
                            />
                            {showErrors && errors.discount && <p className="error-message">{errors.discount}</p>}
                        </div>

                        <div className="form-group">
                            <label>Giá trị đơn hàng tối thiểu</label>
                            <input
                                type="number"
                                name="min_Order_Value"
                                value={formData.min_Order_Value}
                                onChange={handleChange}
                                className={showErrors && errors.min_Order_Value ? 'error' : ''}
                            />
                            {showErrors && errors.min_Order_Value && <p className="error-message">{errors.min_Order_Value}</p>}
                        </div>

                        <div className="form-group">
                            <label>Giảm giá tối đa</label>
                            <input
                                type="number"
                                name="max_Discount"
                                value={formData.max_Discount}
                                onChange={handleChange}
                                className={showErrors && errors.max_Discount ? 'error' : ''}
                            />
                            {showErrors && errors.max_Discount && <p className="error-message">{errors.max_Discount}</p>}
                        </div>

                        <div className="form-group">
                            <label>Số lượng</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className={showErrors && errors.stock ? 'error' : ''}
                            />
                            {showErrors && errors.stock && <p className="error-message">{errors.stock}</p>}
                        </div>

                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="timeStart"
                                value={formData.timeStart.split('T')[0]}
                                onChange={handleChange}
                            />
                            {showErrors && errors.timeStart && <p className="error-message">{errors.timeStart}</p>}
                        </div>

                        <div className="form-group">
                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                name="timeEnd"
                                value={formData.timeEnd.split('T')[0]}
                                onChange={handleChange}
                            />
                            {showErrors && errors.timeEnd && <p className="error-message">{errors.timeEnd}</p>}
                        </div>

                        <div className="form-group full-width">
                            <label>Mô tả</label>
                            <textarea
                                name="Describe"
                                value={formData.Describe}
                                onChange={handleChange}
                                rows="4"
                                className={showErrors && errors.Describe ? 'error' : ''}
                                placeholder="Nhập mô tả cho voucher..."
                            />
                            {showErrors && errors.Describe && <p className="error-message">{errors.Describe}</p>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => {
                                if (isEditing) {
                                    setShowForm(false);
                                    setShowDetails(true);
                                } else {
                                    setShowForm(false);
                                }
                            }}
                            className="button secondary"
                        >
                            Hủy
                        </button>
                        <button type="submit" className="button primary">
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );

    const handleAddNew = () => {
        setIsEditing(false);
        setShowErrors(false);
        setFormData({
            id: '',
            name: '',
            timeStart: '',
            timeEnd: '',
            discountType: '',
            discount: 0,
            min_Order_Value: 0,
            max_Discount: 0,
            stock: 0,
            status: 1,
            Describe: ''
        });
        setShowForm(true);
    };

    const renderStatus = (voucher) => {
        const now = new Date().getTime();
        const end = new Date(voucher.timeEnd).getTime();
        if (now < end && voucher.status === 1) {
            return (
                <button
                    onClick={() => handleToggleStatus(voucher)}
                    className="status-button active"
                >
                    Đang hoạt động
                </button>
            );
        }
        return (
            <button
                onClick={() => handleToggleStatus(voucher)}
                className="status-button inactive"
                disabled={now >= end}
            >
                Ngưng hoạt động
            </button>
        );
    };

    //modal chi tiết
    const renderDetailModal = () => (
        <div className="modal-overlay">
            <div className="modal-container" style={{ margin: '50px' }}>
                <div className="modal-header">
                    <h4>Chi tiết Voucher: {selectedVoucher.name}</h4>
                    <button onClick={() => setShowDetails(false)} className="close-button">×</button>
                </div>
                <div className="voucher-details">
                    <p style={{ color: 'black' }}><strong>Mã voucher:</strong> {selectedVoucher.id}</p>
                    <p style={{ color: 'black' }}><strong>Tên voucher:</strong> {selectedVoucher.name}</p>
                    <p style={{ color: 'black' }}><strong>Mô tả:</strong> {selectedVoucher.Describe || 'Không có mô tả'}</p>
                    <p style={{ color: 'black' }}><strong>Phương thức giảm giá:</strong> {
                        selectedVoucher.discountType === 'random' ? 'Voucher random' : 'Voucher người dùng'
                    }</p>
                    <p style={{ color: 'black' }}><strong>Giá trị giảm:</strong> {
                        selectedVoucher.discountType === 'percent'
                            ? `${selectedVoucher.discount}%`
                            : `${selectedVoucher.discount.toLocaleString('vi-VN')} VNĐ`
                    }</p>
                    <p style={{ color: 'black' }}><strong>Giá trị đơn hàng tối thiểu:</strong> {selectedVoucher.min_Order_Value.toLocaleString('vi-VN')} VNĐ</p>
                    <p style={{ color: 'black' }}><strong>Giảm giá tối đa:</strong> {selectedVoucher.max_Discount.toLocaleString('vi-VN')} VNĐ</p>
                    <p style={{ color: 'black' }}><strong>Thời gian bắt đầu:</strong> {new Date(selectedVoucher.timeStart).toLocaleDateString('vi-VN')}</p>
                    <p style={{ color: 'black' }}><strong>Thời gian kết thúc:</strong> {new Date(selectedVoucher.timeEnd).toLocaleDateString('vi-VN')}</p>
                    <p style={{ color: 'black' }}><strong>Số lượng còn lại:</strong> {selectedVoucher.stock}</p>

                    <div className="detail-actions">
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setSelectedVoucherId(selectedVoucher.id);
                                setFormData({
                                    ...selectedVoucher,
                                    timeStart: new Date(selectedVoucher.timeStart).toISOString().slice(0, 16),
                                    timeEnd: new Date(selectedVoucher.timeEnd).toISOString().slice(0, 16),
                                });
                                setShowDetails(false);
                                setShowForm(true);
                            }}
                            className="button primary"
                        >
                            Sửa Voucher
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Thêm hàm lọc voucher
    const filterVouchers = () => {
        const userVouchers = voucherData.filter(voucher =>
            voucher.discountType === 'user'
        );

        const randomVouchers = voucherData.filter(voucher =>
            voucher.discountType === 'random'
        );

        return { userVouchers, randomVouchers };
    };

    const toggleTableVisibility = (tableType) => {
        setTableVisibility(prev => ({
            ...prev,
            [tableType]: !prev[tableType]
        }));
    };

    // Table Voucher
    const renderVoucherTable = (vouchers, title, tableType) => (
        <div className="table-section">
            <div className="table-headerVoucher" onClick={() => toggleTableVisibility(tableType)}>
                <h3>{title}</h3>
                <span className={`dropdown-arrow ${tableVisibility[tableType] ? 'open' : ''}`}>
                    ▼
                </span>
            </div>
            {tableVisibility[tableType] && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Voucher</th>
                                <th>Giá trị đơn hàng</th>
                                <th>Số lượng</th>
                                <th>Giảm tối đa</th>
                                <th>Thời gian</th>
                                <th>Tình trạng</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.id}>
                                    <td>{voucher.id}</td>
                                    <td>{voucher.name}</td>
                                    <td>{voucher.min_Order_Value.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{voucher.stock}</td>
                                    <td>
                                        {voucher.discountType === 'percent'
                                            ? `${voucher.discount}%`
                                            : `${voucher.discount.toLocaleString('vi-VN')} VNĐ`
                                        }
                                    </td>
                                    <td>{renderCountdown(voucher)}</td>
                                    <td>{renderStatus(voucher)}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                setShowDetails(true);
                                            }}
                                            className="button view"
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="voucher-container">
            {showForm ? (
                renderForm()
            ) : showDetails ? (
                renderDetailModal()
            ) : (
                <div className="content-wrapper">
                    <div className="header">
                        <h2 className="text-center mb-4">Danh sách Voucher</h2>
                        <div className="header-actions">
                            <button
                                onClick={handleAddNew}
                                className="button primary add-voucher-btn"
                            >
                                Thêm Voucher mới
                            </button>
                        </div>
                    </div>

                    {renderVoucherTable(filterVouchers().userVouchers, 'Voucher Người dùng', 'user')}
                    {renderVoucherTable(filterVouchers().randomVouchers, 'Voucher Random', 'random')}
                </div>
            )}
        </div>
    );
}

export default Voucher;
