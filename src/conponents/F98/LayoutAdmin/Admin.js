import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Footer from './Footer';

const Admin = () => (

  
  <div>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content />
    <meta name="author" content />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
    <title>Phụ kiện F98</title>
    {/* Additional CSS Files */}
    <link rel="stylesheet" href="assets/css/bootstrap.css"/>
    <link rel="stylesheet" type="text/css" href="assets/css/font-awesome.css" />
    <link rel="stylesheet" href="assets/vendors/iconly/bold.css"/>
    <link rel="stylesheet" href="/admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.css"/>
    <link rel="stylesheet" href="assets/vendors/bootstrap-icons/bootstrap-icons.css"/>
    <link rel="stylesheet" href="assets/css/app.css"/>
    <link rel="shortcut icon" href="assets/images/favicon.svg" type="image/x-icon"/>
    <script src="assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/vendors/apexcharts/apexcharts.js"></script>
    <script src="assets/js/pages/dashboard.js"></script>
    <script src="assets/js/main.js"></script>

  
    <div id="app">
      <Sidebar />
      <div id="main-content">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    </div>
  </div>
);

export default Admin;
