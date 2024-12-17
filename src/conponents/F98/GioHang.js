import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import './style/giohang.css'
const GioHang = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const tentk = sessionStorage.getItem('tenTK');

    useEffect(() => {
        const fetchCartItems = async () => {

            if (!tentk) {
                const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
                setCartItems(localCart);
                return;
            }

            try {
                const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/GioHang/HienGioHang?tentk=${tentk}`); // Truyền tentk vào URL// Kiểm tra cấu trúc của dữ liệu nhận được

                // Kiểm tra xem response.data có chứa $values hay không và lấy nó nếu có
                if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
                    setCartItems(response.data.$values); // Cập nhật giỏ hàng với mảng sản phẩm
                } else {
                    console.error('Dữ liệu không phải là mảng:', response.data);
                    setCartItems([]); // Nếu không có dữ liệu, đặt giỏ hàng thành rỗng
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
                Swal.fire({
                    title: 'Có lỗi xảy ra',
                    text: 'Không thể tải dữ liệu giỏ hàng',
                    icon: 'error'
                });
            }
        };

        fetchCartItems();
    }, []);



    const totalAmount = cartItems.reduce((acc, item) => acc + (item.gia * item.soLuong), 0);
    const nottentkAmount = cartItems.reduce((acc, item) => acc + (item.giaBan * item.soLuong), 0);

    const handleCheckout = async () => {
        // Kiểm tra trạng thái đăng nhập
        if (!tentk) {
            Swal.fire({
                title: 'Lỗi',
                text: "Bạn phải đăng nhập",
                icon: 'error',
            });
            return;
        }

        // Kiểm tra trạng thái giỏ hàng
        if (cartItems.length === 0) {
            Swal.fire({
                title: 'Lỗi',
                text: "Không có sản phẩm để thanh toán",
                icon: 'error',
            });
            return;
        }

        try {
            // Gửi yêu cầu kiểm tra giỏ hàng đến API
            const response = await axios.post(
                `https://naton69587-001-site1.mtempurl.com/api/GioHang/checkslgh?tentk=${encodeURIComponent(tentk)}`
            );

            // Kiểm tra phản hồi từ API
            if (response.status === 200) {
                // Swal.fire({
                //     title: 'Thành công',
                //     text: 'Đang chuyển đến trang thanh toán...',
                //     icon: 'success',
                //     timer: 1500,
                //     showConfirmButton: false,
                // });
                navigate('/thanhtoan'); // Điều hướng tới trang thanh toán
            }
        } catch (error) {
            // Xử lý lỗi
            if (error.response) {
                // Lỗi do API trả về (Bad Request hoặc khác)
                const errorMessage =
                    error.response.data?.message || 'Đã xảy ra lỗi trong quá trình xử lý giỏ hàng.';
                Swal.fire({
                    title: 'Lỗi',
                    text: errorMessage,
                    icon: 'error',
                });
            } else {
                // Các lỗi không phải từ API (ví dụ: lỗi mạng)
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
                    icon: 'error',
                });
            }
        }
    };


    // console.log("ss",cartItems)

    useEffect(() => {
        const scripts = [
            'js/jquery/jquery-2.2.4.min.js',
            'js/popper.min.js',
            'js/bootstrap.min.js',
            'js/plugins.js',
            'js/classy-nav.min.js',
            'js/active.js'
        ];

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.body.appendChild(script);
            });
        };

        const loadScriptsSequentially = async () => {
            for (const src of scripts) {
                await loadScript(src);
            }
        };

        loadScriptsSequentially();

        return () => {
            scripts.forEach(src => {
                const script = document.querySelector(`script[src="${src}"]`);
                if (script) {
                    document.body.removeChild(script);
                }
            });
        };
    }, []);

    const handleQuantityChange = (id, value, mausac) => {
        const quantity = Math.max(1, parseInt(value) || 1);
        
        // Kiểm tra số lượng tồn kho chỉ khi người dùng chưa đăng nhập (tentk === null)
        if (tentk === null) {
            const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
            const existingProductIndex = localCart.findIndex(item => item.Idpk === id && item.mausac === mausac);
            
            if (existingProductIndex !== -1) {
                // Gửi yêu cầu kiểm tra số lượng tồn kho từ API
                axios.post(`https://naton69587-001-site1.mtempurl.com/api/GioHang/checksl?IDpk=${id}&soluong=${quantity}&mausac=${mausac}`)
                    .then((response) => {
                        if (response.status === 200) {
                            
                            // Nếu kiểm tra số lượng thành công, cập nhật giỏ hàng trong sessionStorage
                            localCart[existingProductIndex].soLuong = quantity;
                            sessionStorage.setItem('localCart', JSON.stringify(localCart));
    
                            // Cập nhật trạng thái trong React
                            setCartItems(prevItems =>
                                prevItems.map(item =>
                                    item.Idpk === id && item.mausac === mausac ? { ...item, soLuong: quantity } : item
                                )
                            );
                        } else {
                            throw new Error("Số lượng vượt quá tồn kho");
                        }
                    })
                    .catch(error => {
                        // Kiểm tra lỗi 400 và hiển thị thông báo cụ thể
                        if (error.response && error.response.status === 400) {
                            Swal.fire({
                                title: 'Số lượng vượt quá',
                                text:  'Số lượng quá số lượng có hàng',
                                icon: 'error'
                            });
                        } else {
                            Swal.fire({
                                title: 'Có lỗi xảy ra',
                                text: error.response ? error.response.data.message : error.message,
                                icon: 'error'
                            });
                        }
    
                        // Reset số lượng về trạng thái trước đó nếu kiểm tra thất bại
                        setCartItems(prevItems =>
                            prevItems.map(item =>
                                item.Idpk === id && item.mausac === mausac ? { ...item, soLuong: item.soLuong } : item
                            )
                        );
                    });
            } else {
                console.log('Sản phẩm không tồn tại trong giỏ hàng');
            }
        }
    
        // Nếu người dùng đã đăng nhập (tentk !== null), không cần kiểm tra số lượng, chỉ cập nhật giỏ hàng trong React
        else {
            const requestData = {
                gioHangId: id,
                soLuongTang: quantity, // Quantity change
                tenTaiKhoan: tentk
            };
    
            axios.post('https://naton69587-001-site1.mtempurl.com/api/GioHang/Thay-soluong', requestData)
                .then((response) => {
                    // Debugging the response to check if the update is successful
                    console.log('API response:', response.data);
    
                    // Ensure response contains updated data or success confirmation
                    if (response.status === 200) {
                        setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, soLuong: quantity } : item ));
                    } else {
                        Swal.fire({
                            title: 'Có lỗi xảy ra',
                            text: 'Không thể cập nhật số lượng.',
                            icon: 'error'
                        });
                    }
                })
                .catch(error => {
                    // Kiểm tra lỗi 400 và hiển thị thông báo cụ thể
                    if (error.response && error.response.status === 400) {
                        Swal.fire({
                            title: 'Số lượng vượt quá',
                            text:  'Số lượng quá số lượng có hàng',
                            icon: 'error'
                        });
                    } else {
                        Swal.fire({
                            title: 'Có lỗi xảy ra',
                            text: error.response ? error.response.data : error.message,
                            icon: 'error'
                        });
                    }
    
                    // Revert to previous quantity if API fails
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.Idpk === id && item.mausac === mausac ? { ...item, soLuong: item.soLuong } : item
                        )
                    );
                });
        }
    };
    






    const handleIncreaseQuantity = async (id, mausac) => {
        if (tentk === null) {
            // console.log("id",id)
            // console.log("mausac",mausac)
            const sl = cartItems.find(item => item.Idpk === id && item.mausac === mausac).soLuong + 1;
            // console.log("sol",sl)
            const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
            const existingProductIndex = localCart.findIndex(item => item.Idpk === id && item.mausac === mausac);

            if (existingProductIndex !== -1) {
                try {
                    const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/GioHang/checksl?IDpk=${id}&soluong=${sl}&mausac=${mausac}`);
                    // console.log(response.data);  // Kiểm tra dữ liệu trả về từ API
                    if (response.status === 200) {
                        localCart[existingProductIndex].soLuong += 1;
                        sessionStorage.setItem('localCart', JSON.stringify(localCart));
                        setCartItems(prevItems =>
                            prevItems.map(item =>
                                item.Idpk === id && item.mausac === mausac ? { ...item, soLuong: item.soLuong + 1 } : item
                            )
                        );
                    } else if (response.status === 400) {
                        Swal.fire({
                            title: 'Có lỗi xảy ra',
                            text: response.data.message || 'Không thể kiểm tra số lượng',
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    // console.log("Error checking stock:", id,sl,mausac);
                    Swal.fire({
                        title: 'Có lỗi xảy ra',
                        text: 'Số lượng vượt quá trong kho',
                        icon: 'error'
                    });

                }
            } else {
                console.log('Sản phẩm không tồn tại trong giỏ hàng');
            }
        }
        if (tentk !== null) {
            try {
                const requestData = {
                    gioHangId: id,
                    soLuongTang: 1,
                    tenTaiKhoan: tentk
                };

                await axios.post('https://naton69587-001-site1.mtempurl.com/api/GioHang/tang-soluong', requestData);

                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === id ? { ...item, soLuong: item.soLuong + 1 } : item
                    )
                );
            } catch (error) {
                // Kiểm tra nếu có phản hồi lỗi từ server
                if (error.response) {

                    Swal.fire({
                        title: 'Có lỗi xảy ra',
                        text: error.response.data,
                        icon: 'error'
                    }); // Hiển thị thông báo lỗi
                } else {

                    Swal.fire({
                        title: 'Có lỗi xảy ra',
                        text: error,
                        icon: 'error'
                    });
                }
            }
        }
    };



    const handleDecreaseQuantity = async (id, mausac) => {
        if (tentk === null) {
            const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
            const existingProductIndex = localCart.findIndex(item => item.Idpk === id && item.mausac === mausac);

            if (existingProductIndex !== -1) {
                // Kiểm tra nếu số lượng lớn hơn 1 thì mới giảm
                if (localCart[existingProductIndex].soLuong > 1) {
                    // Cập nhật số lượng trong local cart
                    localCart[existingProductIndex].soLuong -= 1;
                    sessionStorage.setItem('localCart', JSON.stringify(localCart));

                    // Cập nhật trạng thái trong React
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.Idpk === id && item.mausac === mausac
                                ? { ...item, soLuong: item.soLuong - 1 }
                                : item
                        )
                    );
                    // console.log(localCart);
                } else {
                    Swal.fire({
                        title: 'Lỗi',
                        text: "Số lượng không thể nhỏ hơn 1",
                        icon: 'error'
                    });
                }
            } else {
                console.log('Sản phẩm không tồn tại trong giỏ hàng');
            }
        }

        if (tentk !== null) {
            try {
                // Lấy sản phẩm từ state hiện tại để kiểm tra số lượng
                const product = cartItems.find(item => item.id === id);

                if (product && product.soLuong > 1) {
                    // Dữ liệu để gửi đến API
                    const requestData = {
                        gioHangId: id, // ID giỏ hàng
                        soLuongTang: 1, // Số lượng tăng
                        tenTaiKhoan: tentk // Tên tài khoản
                    };

                    // Gửi yêu cầu POST đến API để giảm số lượng
                    await axios.post('https://naton69587-001-site1.mtempurl.com/api/GioHang/giam-soluong', requestData);

                    // Cập nhật trạng thái trong React
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.id === id ? { ...item, soLuong: item.soLuong - 1 } : item
                        )
                    );
                } else {
                    Swal.fire({
                        title: 'Không thể giảm số lượng',
                        text: 'Số lượng không thể nhỏ hơn 1',
                        icon: 'warning'
                    });
                }
            } catch (error) {
                // Kiểm tra nếu có phản hồi lỗi từ server
                if (error.response) {
                    Swal.fire({
                        title: 'Có lỗi xảy ra',
                        text: error.response.data,
                        icon: 'error'
                    });
                } else {
                    Swal.fire({
                        title: 'Có lỗi xảy ra',
                        text: error.message,
                        icon: 'error'
                    });
                }
            }
        }
    };



    const handleRemoveItem = async (id, mausac) => {
        // Kiểm tra nếu người dùng không đăng nhập (tentk === null)
        if (tentk === null) {
            const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
            // Tìm index của sản phẩm cần xóa
            const existingProductIndex = localCart.findIndex(item => item.Idpk === id && item.mausac === mausac);
            const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm này?",
                showDenyButton: true,
                confirmButtonText: "Xóa",
                denyButtonText: `Không xóa`,
            });
            if (result.isConfirmed) {
                if (existingProductIndex !== -1) {
                    // Nếu tìm thấy sản phẩm, xóa sản phẩm trong localCart
                    localCart.splice(existingProductIndex, 1);
                    // Cập nhật lại giỏ hàng trong sessionStorage
                    sessionStorage.setItem('localCart', JSON.stringify(localCart));

                    // Cập nhật lại giỏ hàng trong state của React
                    setCartItems(prevItems => prevItems.filter(item => item.Idpk !== id || item.mausac !== mausac));

                    Swal.fire({
                        title: "Đã xóa!",
                        text: "Sản phẩm đã được xóa khỏi giỏ hàng",
                        icon: "success"
                    })
                        .then(() => {
                            window.location.reload();
                        });
                } else {
                    Swal.fire({
                        title: "Sản phẩm không tồn tại trong giỏ hàng",
                        icon: "warning"
                    });
                }
            }
        } else {
            try {
                // Hiển thị thông báo xác nhận xóa
                const result = await Swal.fire({
                    title: "Bạn có muốn xóa sản phẩm này?",
                    showDenyButton: true,
                    confirmButtonText: "Xóa",
                    denyButtonText: `Không xóa`,
                });

                if (result.isConfirmed) {
                    // Gửi yêu cầu API để xóa sản phẩm khỏi giỏ hàng
                    await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/GioHang/xoa/${id}/${tentk}`);

                    // Cập nhật lại giỏ hàng trong state React sau khi xóa
                    setCartItems(prevItems => prevItems.filter(item => item.Idpk !== id));

                    Swal.fire({
                        title: "Đã xóa!",
                        text: "Sản phẩm đã được xóa khỏi giỏ hàng",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Có lỗi xảy ra',
                    text: error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng.',
                    icon: 'error'
                });
            }
        }
    };



    return (
        <div>



            <div className="cart-area section-padding-100">
                <div className="container">
                    <div className="row align-items-start">
                        {/* Cart Table Area */}
                        <div className="col-md-9">
                            <div className="cart-table table-responsive mt-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <table className="table table-bordered text-center" style={{ tableLayout: 'fixed' }}>
                                    <thead className="thead-light" style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}>
                                        <tr>
                                            <th style={{ width: "30%" }}>Sản phẩm</th>
                                            <th style={{ width: "15%" }}>Giá</th>
                                            <th style={{ width: "30%" }}>Số lượng</th>
                                            <th style={{ width: "15%" }}>Tổng</th>
                                            <th style={{ width: "10%" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tentk !== null &&
                                            cartItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img src={item.hinhAnh} alt={item.tenSanPham} className="img-thumbnail" style={{ width: "80px", marginRight: "15px", flexShrink: 0 }} />
                                                            <div className="d-flex flex-column" style={{ overflow: 'hidden' }}>
                                                                <span className="text-left text-truncate">{item.tenSanPham }</span>
                                                                <span className="text-left text-muted text-truncate">Màu {item.mausac}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{item.gia.toLocaleString()}đ</span></td>
                                                    <td className="qty">
                                                        <div className="input-group justify-content-center align-items-center custom-qty-container">
                                                            <button
                                                       
                                                                className="custom-qty-btn decrease-btn"
                                                                onClick={() => handleDecreaseQuantity(item.id)}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                           
                                                                type="number"
                                                                className="custom-qty-input"
                                                                value={item.soLuong}
                                                                min="1"
                                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                            />
                                                            <button
                                                                className="custom-qty-btn increase-btn"
                                                                onClick={() => handleIncreaseQuantity(item.id)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>


                                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{(item.gia * item.soLuong).toLocaleString()}đ</span></td>
                                                    <td>
                                                        <button className="custom-delete-btn" onClick={() => handleRemoveItem(item.id)}>
                                                            Xóa
                                                        </button>
                                                    </td>


                                                </tr>
                                            ))}
                                        {tentk === null &&
                                            cartItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img src={item.hinhAnh} alt={item.tenphukien} className="img-thumbnail" style={{ width: "80px", marginRight: "15px", flexShrink: 0 }} />
                                                            <div className="d-flex flex-column" style={{ overflow: 'hidden' }}>
                                                                <span className="text-left text-truncate">{item.tenphukien + " " + item.Idpk}</span>
                                                                <span className="text-left text-muted text-truncate">Màu {item.mausac}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{item.giaBan.toLocaleString()}đ</span></td>
                                                    <td className="qty">
                                                        <div className="input-group justify-content-center align-items-center" style={{ width: "120px", margin: "0 auto" }}>
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => handleDecreaseQuantity(item.Idpk, item.mausac)}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                className="form-control text-center mx-2"
                                                                value={item.soLuong}  // Sử dụng số lượng từ state cartItems
                                                                min="1"
                                                                onChange={(e) => handleQuantityChange(item.Idpk, Math.max(1, parseInt(e.target.value)), item.mausac)}
                                                                style={{ width: "50px", padding: "2px" }}
                                                            />

                                                            <button
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => handleIncreaseQuantity(item.Idpk, item.mausac)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{(item.giaBan * item.soLuong).toLocaleString()}đ</span></td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleRemoveItem(item.Idpk, item.mausac)}>Xóa</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {cartItems.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center">Không có sản phẩm nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {cartItems.length === 0 && (
                                    <div className="text-center">
                                        <button className="btn btn-primary" onClick={() => navigate('/sanpham')}>Xem sản phẩm</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-3 pt-4 pl-4">
                            <div className="cart-total-area">
                                <h5>Tổng giỏ hàng</h5>
                                <ul className="cart-total-list">
                                    <li>
                                        <span>Tổng tiền:</span>
                                        {tentk !== null ? (
                                            <span>{totalAmount.toLocaleString()}đ</span>
                                        ) : (
                                            <span>{nottentkAmount.toLocaleString()}đ</span>
                                        )}
                                    </li>
                                </ul>
                                <button onClick={handleCheckout} className="checkout-button">
                                    Thanh toán
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default GioHang;
