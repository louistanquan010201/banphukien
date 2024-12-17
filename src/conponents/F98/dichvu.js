
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import Select from 'react-select';


const DichVu = () => {

    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        loaiXe: '',
        thoiGianMongMuon: '',
        ghiChu: '',
        service: '',
        soDienThoai: '',
    });

    const [serviceOptions, setServiceOptions] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceDetails, setServiceDetails] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
// Danh sách icon để random
const RANDOM_ICONS = [
    "fa fa-wrench", 
    "fa fa-cogs", 
    "fa fa-motorcycle", 
    "fa fa-tools", 
    "fa fa-car-battery", 
    "fa fa-oil-can", 
    "fa fa-car-crash"
];

// Hàm random icon
const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_ICONS.length);
    return RANDOM_ICONS[randomIndex];
};
const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData((prevFormData) => {
        const currentServices = prevFormData.service ? prevFormData.service.split(',') : [];
        
        let updatedServices;
        if (checked) {
            updatedServices = [...new Set([...currentServices, value])];
        } else {
            updatedServices = currentServices.filter((service) => service !== value);
        }
        return {
            ...prevFormData,
            service: updatedServices.join(',')
        };

      
    });
    
};

    // Fetch data from API
    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/DichVu/getAllDichVu');
                const services = response.data.$values.map(service => ({
                    id: service.maDichVu,
                    name: service.tenDichVu,
                    description: service.moTa || "Không có mô tả chi tiết",
                    icon: getRandomIcon(),
                    details: service.chiTiet ? service.chiTiet.split(';') : []
                }));

                setServiceDetails(services);
                
                // Tạo options cho Select
                const options = services.map(service => ({
                    value: service.id,
                    label: service.name
                }));
                setServiceOptions(options);

            } catch (error) {
                console.error("Lỗi khi tải dịch vụ:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.'
                });
            }
        };

        fetchServiceDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({
            ...formData,
            service: selectedOption ? selectedOption.value : '',
        });
    };
    const handleServiceClick = (service) => {
        setSelectedService(service);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hoTen || !formData.email || !formData.loaiXe || !formData.service || !formData.thoiGianMongMuon || !formData.soDienThoai) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Tất cả các trường không được để trống!',
            });
            return;
        }
    
        // Kiểm tra định dạng email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Địa chỉ email không hợp lệ!',
            });
            return;
        }
    
        // Kiểm tra số điện thoại
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(formData.soDienThoai)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại di động 10 số bắt đầu bằng 03, 05, 07, 08 hoặc 09.',
            });
            return;
        }
    
        // Kiểm tra thời gian mong muốn phải lớn hơn ngày hiện tại ít nhất 3 ngày
        const currentDate = new Date();
        const selectedDate = new Date(formData.thoiGianMongMuon);
        const diffTime = selectedDate - currentDate;
        const diffDays = diffTime / (1000 * 3600 * 24);
        if (diffDays < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Thời gian mong muốn phải lớn hơn ngày hiện tại ít nhất 3 ngày!',
            });
            return;
        }
    
        try {
            const isoDate = selectedDate.toISOString();
            const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/DangKyDichVu', {
                hoTen: formData.hoTen,
                email: formData.email,
                loaiXe: formData.loaiXe,
                thoiGianMongMuon: isoDate,
                ghiChu: formData.ghiChu,
                idDichVu: formData.service,
                soDienThoai: formData.soDienThoai,
            });
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đăng ký dịch vụ thành công',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đăng ký dịch vụ thất bại',
                });
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi đăng ký dịch vụ.', 'error');
        }
    };



    return (
        <div>
            <meta charSet="UTF-8" />
            <meta name="description" content="" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="icon" href="img/core-img/favicon.ico" />
            <link rel="stylesheet" href="/assets/css/core-style.css" />
            <link rel="stylesheet" href="style.css" />

            {/* Right Side Cart Area */}
            <div className="cart-bg-overlay"></div>

            <div className="right-side-cart-area">
                {/* Cart Button */}
                <div className="cart-button">
                    <a href="#" id="rightSideCart"><img src="img/core-img/bag.svg" alt="" /> <span>3</span></a>
                </div>

                <div className="cart-content d-flex">
                    {/* Cart List Area */}
                    <div className="cart-list">
                        {/* Single Cart Item */}
                        <div className="single-cart-item">
                            <a href="#" className="product-image">
                                <img src="img/product-img/product-1.jpg" className="cart-thumb" alt="" />
                                {/* Cart Item Desc */}
                                <div className="cart-item-desc">
                                    <span className="product-remove"><i className="fa fa-close" aria-hidden="true"></i></span>
                                    <span className="badge">Mango</span>
                                    <h6>Button Through Strap Mini Dress</h6>
                                    <p className="size">Size: S</p>
                                    <p className="color">Color: Red</p>
                                    <p className="price">$45.00</p>
                                </div>
                            </a>
                        </div>

                        {/* Other Cart Items */}
                        {/* ... Similar structure for each cart item ... */}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-amount-summary">
                        <h2>Summary</h2>
                        <ul className="summary-table">
                            <li><span>subtotal:</span> <span>$274.00</span></li>
                            <li><span>delivery:</span> <span>Free</span></li>
                            <li><span>discount:</span> <span>-15%</span></li>
                            <li><span>total:</span> <span>$232.00</span></li>
                        </ul>
                        <div className="checkout-btn mt-100">
                            <a href="checkout.html" className="btn essence-btn">check out</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Wrapper Area Start */}
            <div className="single-blog-wrapper">
                {/* Blog Post Thumb */}
                <div className="single-blog-post-thumb">
                    <img src="img/bg-img/dvf98.jpg" style={{ width: "100%" }} alt="" />
                </div>

                {/* Blog Content Wrap */}
                <div className="single-blog-content-wrapper d-flex">
                    {/* Blog Content */}
                    <div className="single-blog--text">
                        <h2>Dịch Vụ Sửa Chữa Và Bảo Dưỡng Tại F98</h2>
                        <p>F98 cung cấp các dịch vụ sửa chữa, bảo dưỡng và nâng cấp xe máy chuyên nghiệp...</p>

                        <blockquote>
                            <h6><i className="fa fa-quote-left" aria-hidden="true"></i> "F98 cam kết mang đến cho khách hàng..."</h6>
                        </blockquote>

                        <p>Hãy đặt lịch ngay hôm nay...</p>
                        <div className="row">
                {/* Sidebar Dịch Vụ */}
                <div className="col-md-3 bg-light p-4">
                    <h4 className="mb-4">Các Dịch Vụ</h4>
                    {serviceDetails.map((service) => (
                        <div 
                            key={service.id} 
                            className={`service-item mb-3 p-3 ${selectedService?.id === service.id ? 'bg-primary text-white' : 'bg-white'}`}
                            style={{ 
                                cursor: 'pointer', 
                                borderRadius: '8px', 
                                transition: 'all 0.3s ease' 
                            }}
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="d-flex align-items-center">
                                <i className={`${service.icon} mr-3`}></i>
                                <h5 className="m-0">{service.name}</h5>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chi Tiết Dịch Vụ */}
                <div className="col-md-9">
                    {selectedService ? (
                        <div className="service-details p-4">
                            <h2 className="mb-4">Tên dịch vụ: {selectedService.name}</h2>
                            <p className="lead">Mô tả: {selectedService.description}</p>
                            
                            <div className="row">
                                {/* <div className="col-md-6">
                                    <h5>Chi Tiết Dịch Vụ:</h5>
                                    <ul className="list-unstyled">
                                        {selectedService.details.map((detail, index) => (
                                            <li key={index} className="mb-2">
                                                <i className="fa fa-check-circle text-success mr-2"></i>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <div className="service-image">
                                        <img 
                                            src={`/img/services/${selectedService.id}.jpg`} 
                                            alt={selectedService.name} 
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <h3>Chọn Dịch Vụ Để Xem Chi Tiết</h3>
                            <p>Vui lòng chọn một dịch vụ từ danh sách bên trái để xem thông tin chi tiết.</p>
                        </div>
                    )}

                    {/* Form đăng ký dịch vụ như code ban đầu */}
                    <div className="service-registration mt-4">
                      
                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Họ và tên:</label>
                                <input type="text" className="form-control" id="name" name="hoTen" value={formData.hoTen} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="text" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="SoDienThoai">Số điện thoại:</label>
                                <input type="text" className="form-control" id="soDienThoai" name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="biketype">Loại xe:</label>
                                <input type="text" className="form-control" id="biketype" name="loaiXe" value={formData.loaiXe} onChange={handleInputChange} required />
                            </div>


                            <div className="form-group">
    <label htmlFor="service">Dịch vụ:</label>
    <div className="service-checkbox-group">
        {serviceOptions.map((option) => (
            <div 
                key={option.value} 
                className="service-checkbox-item"
                style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
            >
                <input
                    type="checkbox"
                    id={`service-${option.value}`}
                    value={option.value}
                    onChange={handleCheckboxChange}
                    className="form-check-input my-2 ml-2"
                    style={{ 
                        marginRight: '10px',
                        width: '20px', 
                        height: '20px' 
                    }}
                />
                <label
                    htmlFor={`service-${option.value}`}
                    className="form-check-label ml-5"
                    style={{
                        flex: 1,
                        cursor: 'pointer'
                    }}
                >
                    {option.label}
                </label>
            </div>
        ))}
    </div>
</div>



                            <div className="form-group">
                                <label htmlFor="timewish">Thời gian mong muốn:</label>
                                <input type="date" className="form-control" id="timewish" name="thoiGianMongMuon" value={formData.thoiGianMongMuon} onChange={handleInputChange} required />
                            </div>




                            <div className="form-group">
                                <label htmlFor="note">Ghi chú:</label>
                                <input type="text" className="form-control" id="note" name="ghiChu" value={formData.ghiChu} onChange={handleInputChange} />
                            </div>

                            <button type="submit" className="btn btn-primary">Gửi thông tin</button>
                        </form>
                    </div>
                </div>
            </div>
                    </div>

                    {/* Related Blog Post */}
                    <div class="related-blog-post">
                        <div class="single-related-blog-post">
                            <img src="img/bg-img/dv1.jpg" alt="" />
                            <a href="#">
                                <h5>Khám phá dịch vụ bảo trì xe máy chuyên nghiệp và tận tâm.</h5>
                            </a>
                        </div>
                        <div className="single-related-blog-post">
                            <img src="img/bg-img/dv2.jpg" alt="" />
                            <a href="#">
                                <h5>Đưa xe của bạn lên một tầm cao mới với dịch vụ nâng cấp phụ kiện.</h5>
                            </a>
                        </div>
                        <div className="single-related-blog-post">
                            <img src="img/bg-img/dv3.jpg" alt="" />
                            <a href="#">
                                <h5>Hãy để chúng tôi chăm sóc chiếc xe của bạn với dịch vụ sửa chữa tận nơi.</h5>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Area Start */}


            {/* Scripts */}
            {/* <script src="js/jquery/jquery-2.2.4.min.js"></script>
            <script src="js/popper.min.js"></script>
            <script src="js/bootstrap.min.js"></script>
            <script src="js/plugins.js"></script>
            <script src="js/classy-nav.min.js"></script>
            <script src="js/active.js"></script> */}
        </div>
    );
};

export default DichVu;
