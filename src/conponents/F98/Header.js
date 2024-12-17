import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import './style/header.css';
const Header = () => {
  const tenTK = sessionStorage.getItem('tenTK');
  const loaitk = sessionStorage.getItem('loaitk');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {

      if (!tenTK) {
        const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];
        setCartItems(localCart);
        return;
      }

      try {
        const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/GioHang/HienGioHang?tentk=${tenTK}`); // Truyền tentk vào URL// Kiểm tra cấu trúc của dữ liệu nhận được

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
  const totalAmount = cartItems.reduce((acc, item) => acc + item.soLuong, 0);
  sessionStorage.setItem('slgh',totalAmount)
  // console.log("bộ đếm", totalAmount)
  // console.log("cartItems", cartItems)
  // console.log("tenTK", tenTK)
  const handleLogout = () => {
    // Clear user data from localStorage or sessionStorage
    sessionStorage.removeItem('tenTK'); // Assuming 'tentk' stores the account info
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('loaitk');
    // If you're using session storage or any other state management system, clear those as well
    // sessionStorage.removeItem('tentk'); // Example for sessionStorage
    
    // Redirect the user to the login page or homepage
    window.location.href = '/'; // Redirect to login page
  };
  
  return (

    <header className="header_area">
      <div className="classy-nav-container breakpoint-off d-flex align-items-center justify-content-between">
        {/* Classy Menu */}
        <nav className="classy-navbar" id="essenceNav">
          {/* Logo */}
          <a className="nav-brand" href="/"><img src="img/bg-img/logo.jpg" alt="" style={{ height: '86px', width: '130px' }} /></a>
          {/* Navbar Toggler */}
          <div className="classy-navbar-toggler">
            <span className="navbarToggler"><span /><span /><span /></span>
          </div>
          {/* Menu */}
          <div className="classy-menu">
            {/* close btn */}
            <div className="classycloseIcon">
              <div className="cross-wrap"><span className="top" /><span className="bottom" /></div>
            </div>
            {/* Nav Start */}
            <div className="menu-phu-kien">
              <ul>
                <li>
                  <a href="/">Trang Chủ</a>
                </li>
                <li className="has-mega-menu">
                  <a href="/sanpham">Sản Phẩm</a>

                </li>
                <li>
                  <a href="/service">Dịch vụ</a>
                </li>
                <li>
                  <Link to="/random">Ô may mắn</Link>
                </li>

              </ul>
            </div>

            {/* Nav End */}
          </div>
        </nav>
        {/* Header Meta Data */}
        <div className="header-meta d-flex clearfix justify-content-end">
          {/* Search Area */}
          {/* <div className="search-area">
            <form action="#" method="post">
              <input type="search" name="search" id="headerSearch" placeholder="Tìm kiếm" />
              <button type="submit" style={{ left: 20 }}><i className="fa fa-search" aria-hidden="true" /></button>
            </form>
          </div> */}
          {/* Favourite Area */}
          {tenTK !== null ? (
            <div className="favourite-area">
              <a href="/listdh"><i class="bi bi-box2-heart" style={{ fontSize: '1.5rem' }}></i></a>
            </div>
          ) : null}
          {/* User Login Info */}
          {tenTK !== null ? (
            <div className="favourite-area">
              <div className="user-login-info-taikhoan">
                <a >
                  <img src="img/core-img/user.svg" alt="" />
                </a>
                <div className="dropdown-menu-taikhoan">
                  <ul>
                    <li><a href="/khachhang">Thông tin</a></li>
                    <li><a href="/Thongbao">Thông báo</a></li>
                    {loaitk === "1" ? (
                      <li><a href="/admin ">Admin</a></li>
                    ) : null}
                    {loaitk === "3" ? (
                      <li><a href="/admin">Nhân viên</a></li>
                    ) : null}
                    <li><a href="#" onClick={handleLogout}>Đăng xuất</a></li>
                  </ul>
                </div>
              </div>
            </div>

          ) : (
            <div className="favourite-area">
              <div className="user-login-info-taikhoan">
                <a href="/dangky-dangnhap">
                  <img src="img/core-img/user.svg" alt="" />
                </a>
              </div>
            </div>
          )}



          {/* Cart Area */}
          {tenTK !== null ? (
            <div className="cart-area">
              <a href="/giohang" id="essenceCartBtn"><i class="bi bi-cart-check-fill" style={{ fontSize: '1.5rem' }}></i><span>{totalAmount}</span></a>
            </div>
          ) :
            <div className="cart-area">
              <a href="/giohang" id="essenceCartBtn"><i class="bi bi-cart-check-fill" style={{ fontSize: '1.5rem' }}></i><span>{totalAmount}</span></a>
            </div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
