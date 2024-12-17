import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import react-helmet

import Trangchu from './conponents/F98/trangchu';
import Sanpham from './conponents/F98/sanpham';
import Chitietsanpham from './conponents/F98/chitietsanpham';
import Thanhtoan from './conponents/F98/thanhtoan';
import Quanlysp from './conponents/F98/quanlysp';
import GioHang from './conponents/F98/GioHang';
import Dathang from './conponents/F98/thanhtoan';
import Test from './conponents/F98/test';
import DichVu from './conponents/F98/dichvu';
import QuanLyDV from './conponents/F98/quanlydv';
import DangKi from './conponents/F98/dangki';
import ListDh from './conponents/F98/ListDh';
import KhachHang from './conponents/F98/KhachHang';
import Quanlyloaisp from './conponents/F98/quanlyloaisp';
import QuanLyLoaiXe from './conponents/F98/quanlyloaixe';
import QuanLyLoaiMauSac from './conponents/F98/quanlymau';
import Random from './conponents/F98/Random';
import ThongBao from './conponents/F98/Thongbao';
import Danhgia from './conponents/F98/chatai';


import Admin from './conponents/F98/LayoutAdmin/Admin';
import QuanLySanP from './conponents/F98/LayoutAdmin/QuanLySanPham';
import QuanLLoaisanpham from './conponents/F98/LayoutAdmin/QuanLyLoaiSanPham';
import QLyLoaiXe from './conponents/F98/LayoutAdmin/QLLoaiXe';
import QuanLyMau from './conponents/F98/LayoutAdmin/QLLoaiMau';
import QuanLyDichVu from './conponents/F98/LayoutAdmin/QuanLyDichVu';
import MainVoucher from './conponents/F98/LayoutAdmin/MainVoucher';
import Maindonhang from './conponents/F98/LayoutAdmin/maindonhang';
import QuanLyTaiKhoan from './conponents/F98/LayoutAdmin/QuanLyTaiKhoan';
import ListDonHang from './conponents/F98/LayoutAdmin/ListDonDatHang';
import QuanLyLoaiDichVu from './conponents/F98/LayoutAdmin/QuanLyLoaiDichVu';
import QuanLyNhaCungCap from './conponents/F98/LayoutAdmin/QuanLyNhaCungCap';
import QLLichsu from './conponents/F98/LayoutAdmin/QLLichsu';
import QLLichsunv from './conponents/F98/LayoutAdmin/QLLichSuNhanVien';
import DichVuCRUD from './conponents/F98/LayoutAdmin/DichVuCRUD';

import Header from './conponents/F98/Header'; // Đảm bảo đường dẫn đúng
import Footer from './conponents/F98/Footer';
import QuenMatKhau from './conponents/F98/QuenMatKhau';
const App = () => {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin/');
  const isService = location.pathname === '/admin/quanlydichvu/';

  useEffect(() => {
    if (!isAdminPath && !isService) {
      import('./style.css');
    }


  }, [isAdminPath]);

  const className = isAdminPath ? '' : 'default-styles';


  return (
    <div className={className}>
      {/* Sử dụng Helmet để thay đổi các thẻ trong head */}
      {!(location.pathname.startsWith('/admin') || location.pathname === '/dangky-dangnhap' || location.pathname === '/quen-mat-khau') && (
        <>
          <Helmet>
            <meta charSet="UTF-8" />
            <meta name="description" content="Essence - Fashion Ecommerce Template" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Phụ kiện F98</title>
            <link rel="icon" href="img/core-img/favicon.ico" />
            <link rel="stylesheet" href="css/core-style.css" />
            <link rel="stylesheet" href="style.css" />
          </Helmet>
        </>
      )}


      {!(location.pathname.startsWith('/admin') || location.pathname === '/dangky-dangnhap' || location.pathname === '/quen-mat-khau') && (
        <>
          <Header />
        </>
      )}

      <Routes>
        <Route path="/" element={<Trangchu />} />
        <Route path="/sanpham" element={<Sanpham />} />
        <Route path="/chitietsanpham" element={<Chitietsanpham />} />
        <Route path="/thanhtoan" element={<Thanhtoan />} />
        <Route path="/quanlysp" element={<Quanlysp />} />
        <Route path="/giohang" element={<GioHang />} />
        <Route path="/dathang" element={<Dathang />} />
        <Route path="/test" element={<Test />} />
        <Route path="/service" element={<DichVu />} />
        <Route path="/quanlydv" element={<QuanLyDV />} />
        <Route path="/random" element={<Random />} />
        <Route path="/Thongbao" element={<ThongBao />} />
        <Route path="/Danhgia" element={<Danhgia />} />

        <Route path="/dangky-dangnhap" element={<DangKi />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

        <Route path="/listdh" element={<ListDh />} />
        <Route path="/khachhang" element={<KhachHang />} />
        <Route path="/quanlyloaisp" element={<Quanlyloaisp />} />
        <Route path="/quanlyloaixe" element={<QuanLyLoaiXe />} />
        <Route path="/quanlymau" element={<QuanLyLoaiMauSac />} />

        <Route path="/admin/" element={<Admin />} />
        <Route path="/admin/quanlysanpham" element={<QuanLySanP />} />
        <Route path="/admin/quanlyloaisanpham" element={<QuanLLoaisanpham />} />
        <Route path="/admin/quanlyloaixe" element={<QLyLoaiXe />} />
        <Route path="/admin/quanlymau" element={<QuanLyMau />} />
        <Route path="/admin/dsdondathang" element={<ListDonHang />} />
        <Route path="/admin/quanlydichvudangky" element={<QuanLyDichVu />} />
        <Route path="/admin/voucher" element={<MainVoucher />} />
        <Route path="/admin/donhang" element={<Maindonhang />} />
        <Route path="/admin/quanlytaikhoan" element={<QuanLyTaiKhoan />} />
        <Route path="/admin/quanlyloaidichvu" element={<QuanLyLoaiDichVu />} />
        <Route path="/admin/quanlynhacungcap" element={<QuanLyNhaCungCap />} />
        <Route path="/admin/qllichsu" element={<QLLichsu />} />
        <Route path="/admin/qllichsunv" element={<QLLichsunv />} />
        <Route path="/admin/quanlydichvu" element={<DichVuCRUD />} />
      </Routes>
      {!(location.pathname.startsWith('/admin') || location.pathname === '/dangky-dangnhap' || location.pathname === '/quen-mat-khau') && (
        <>
          <Footer />
        </>
      )}

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
