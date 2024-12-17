import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Sidebar.module.css';

const Sidebar = () => {

  //đóng mở slidebar con
  const [activeMenu, setActiveMenu] = useState(null);
  const toggleSubmenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };
  useEffect(() => {
    console.log(`Current active menu: ${activeMenu}`);
  }, [activeMenu]);
  const loaitk = sessionStorage.getItem("loaitk")
  return (

    <div id="sidebar" className="active">
      <div className="sidebar-wrapper active" style={{ width: "260px" }}>
        <div className="sidebar-header">
          <div className="d-flex justify-content-between">
            <div className="logo">
              <Link to="/">
                <img src="/img/bg-img/logo.jpg" alt="Logo" style={{ height: '100px', width: '130px' }} />
              </Link>
            </div>
            <div className="toggler">
              <a href="#" className="sidebar-hide d-xl-none d-block">
                <i className="bi bi-x bi-middle" />
              </a>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu" >
            <li className="sidebar-title">Menu</li>
            <li className="sidebar-item active ">
              <Link to="/admin/" className="sidebar-link">
                <i className="bi bi-grid-fill" />
                <span>Trang chủ</span>
              </Link>
            </li>

            <li className="sidebar-item ">

              {/* Mục Sản phẩm */}
              <li style={{ cursor: 'pointer' }} className={`sidebar-item parent-item ${activeMenu === "products" ? "active" : ""}`}>
                <div className="sidebar-link parent-link" onClick={() => toggleSubmenu("products")}>
                  <i className="bi bi-folder-fill"></i>
                  <span style={{ cursor: 'pointer' }}>Sản phẩm</span>
                </div>
                <ul className="submenu" style={{ display: activeMenu === "products" ? "block" : "none" }}>
                  <li className="sidebar-item">
                    <Link to="/admin/quanlysanpham/" className="sidebar-link">
                      <i className="bi bi-collection-fill"></i>
                      <span>Quản lý sản phẩm</span>
                    </Link>
                  </li>
                  {loaitk === "1" ? (
                    <li className="sidebar-item">
                      <Link to="/admin/quanlyloaisanpham/" className="sidebar-link">
                        <i className="bi bi-collection-fill"></i>
                        <span>Quản lý loại sản phẩm</span>
                      </Link>
                    </li>
                  ) : null}
                  {loaitk === "1" ? (
                    <li className="sidebar-item">
                      <Link to="/admin/quanlyloaixe/" className="sidebar-link">
                        <i className="bi bi-collection-fill"></i>
                        <span>Quản lý loại xe</span>
                      </Link>
                    </li>
                  ) : null}
                  {loaitk === "1" ? (
                    <li className="sidebar-item">
                      <Link to="/admin/quanlymau/" className="sidebar-link">
                        <i className="bi bi-collection-fill"></i>
                        <span>Quản lý màu</span>
                      </Link>
                    </li>
                  ) : null}

                </ul>
              </li>

              {/* Mục Dịch vụ */}
              <li style={{ cursor: 'pointer' }} className={`sidebar-item parent-item ${activeMenu === "services" ? "active" : ""}`}>
                <div className="sidebar-link parent-link" onClick={() => toggleSubmenu("services")}>
                  <i className="bi bi-folder-fill"></i>
                  <span style={{ cursor: 'pointer' }}>Dịch vụ</span>
                </div>
                <ul className="submenu" style={{ display: activeMenu === "services" ? "block" : "none" }}>
                  <li className="sidebar-item">
                    <Link to="/admin/quanlydichvudangky/" className="sidebar-link">
                      <i className="bi bi-grid-1x2-fill"></i>
                      <span>Quản lý đơn đặt lịch</span>
                    </Link>
                  </li>
                  {loaitk === "1" ? (
                    <li className="sidebar-item">
                      <Link to="/admin/quanlyloaidichvu/" className="sidebar-link">
                        <i className="bi bi-grid-1x2-fill"></i>
                        <span>Quản lý loại dịch vụ</span>
                      </Link>
                    </li>
                  ) : null}


                </ul>
              </li>
              {loaitk === "1" ? (
                <li className="sidebar-item">
                  <Link to="/admin/quanlynhacungcap/" className='sidebar-link'>
                    <i className="bi bi-grid-1x2-fill"></i>
                    <span>Quản lý nhà cung cấp</span>
                  </Link>
                </li>
              ) : null}

              <li className="sidebar-item">
                <Link to="/admin/donhang/" className='sidebar-link'>
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>Danh sách đặt hàng</span>
                </Link>
              </li>

              {loaitk === "1" ? (
                <li className="sidebar-item">
                  <Link to="/admin/voucher" className='sidebar-link'>
                    <i className="bi bi-tags"></i>
                    <span>Quản lý mã giảm giá</span>
                  </Link>
                </li>
              ) : null}
              {loaitk === "1" ? (
                <li className="sidebar-item">
                  <Link to="/admin/quanlytaikhoan/" className='sidebar-link'>
                    <i className="bi bi-person"></i>
                    <span>Quản lý tài khoản</span>
                  </Link>
                </li>
              ) : null}
              {loaitk === "1" ? (<li style={{ cursor: 'pointer' }} className={`sidebar-item parent-item ${activeMenu === "lichsu" ? "active" : ""}`}>
                <div className="sidebar-link parent-link" onClick={() => toggleSubmenu("lichsu")}>
                  <i className="bi bi-folder-fill"></i>
                  <span style={{ cursor: 'pointer' }}>Lịch sử</span>
                </div>
                <ul className="submenu" style={{ display: activeMenu === "lichsu" ? "block" : "none" }}>
                  <li className="sidebar-item">
                    <Link to="/admin/qllichsu/" className='sidebar-link'>
                      <i className="bi bi-grid-1x2-fill"></i>
                      <span>Lịch sử Admin</span>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link to="/admin/qllichsunv/" className='sidebar-link'>
                      <i className="bi bi-grid-1x2-fill"></i>
                      <span>Lịch sử nhân viên</span>
                    </Link>
                  </li>

                </ul>
              </li>) : null}


              {/* {loaitk === "1" ? (
                <li className="sidebar-item">
                  <Link to="/admin/thongke/" className='sidebar-link'>
                    <i className="bi bi-bar-chart-fill"></i>
                    <span>Thống kê</span>
                  </Link>

                </li>
              ) : null} */}
            </li>
          </ul>
        </div>
        <button className="sidebar-toggler btn x">
          <i data-feather="x" />
        </button>
      </div>
    </div>

  );

};

export default Sidebar;
