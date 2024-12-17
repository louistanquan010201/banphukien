import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DonHangComponent from './ListDonDatHangPage';
import Footer from './Footer';

const ListDonHang = () => (
  <div>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content />
    <meta name="author" content />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
    <title>Nước Hoa F98</title>
    {/* Additional CSS Files */}
    <link rel="stylesheet" href="/admin/assets/css/bootstrap.css"/>
    <link rel="stylesheet" type="text/css" href="assets/css/font-awesome.css" />
    <link rel="stylesheet" href="/admin/assets/vendors/iconly/bold.css"/>
    <link rel="stylesheet" href="admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.css"/>
    <link rel="stylesheet" href="/admin/assets/vendors/bootstrap-icons/bootstrap-icons.css"/>
    <link rel="stylesheet" href="/admin/assets/css/app.css"/>
    <link rel="shortcut icon" href="/admin/assets/images/favicon.svg" type="image/x-icon"/>
    <script src="/admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script>
    <script src="/admin/assets/js/bootstrap.bundle.min.js"></script>
    <script src="/admin/assets/vendors/apexcharts/apexcharts.js"></script>
    <script src="/admin/assets/js/pages/dashboard.js"></script>
    <script src="/admin/assets/js/main.js"></script>

    <div id="app">
      <Sidebar />
      <div id="main-content" style={{width:'1400px',marginLeft:'220px'}}>
        <Header />
        <DonHangComponent />
        <Footer />
      </div>
    </div>
  </div>
);

export default ListDonHang;
