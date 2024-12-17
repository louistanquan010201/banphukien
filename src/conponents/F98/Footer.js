import React from 'react';

const Footer = () => {
  return (
    <footer className="footer_area ">
    <div className="container">
      <div className="row">
        {/* Khu Vực Widget */}
        <div className="col-12 col-md-6">
          <div className="single_widget_area d-flex mb-30">
            {/* Logo */}
            
            {/* Menu Footer */}
            <div className="footer_menu">
              <ul>
                <li><a href="shop.html">Cửa Hàng</a></li>
                <li><a href="blog.html">Tin Tức</a></li>
                <li><a href="contact.html">Liên Hệ</a></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Khu Vực Widget */}
        <div className="col-12 col-md-6">
          <div className="single_widget_area mb-30">
            <ul className="footer_widget_menu">
              <li><a href="#">Trạng Thái Đơn Hàng</a></li>
              <li><a href="#">Phương Thức Thanh Toán</a></li>
              <li><a href="#">Giao Hàng và Vận Chuyển</a></li>
              <li><a href="#">Hướng Dẫn</a></li>
              <li><a href="#">Chính Sách Bảo Mật</a></li>
              <li><a href="#">Điều Khoản Sử Dụng</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row align-items-end">
        {/* Khu Vực Widget */}
        <div className="col-12 col-md-6">
          <div className="single_widget_area">
            <div className="footer_heading mb-30">
              <h6>Đăng Ký Nhận Thông Tin</h6>
            </div>
            <div className="subscribtion_form">
              <form action="#" method="post">
                <input type="email" name="mail" className="mail" placeholder="Nhập email của bạn" />
                <button type="submit" className="submit"><i className="fa fa-long-arrow-right" aria-hidden="true" /></button>
              </form>
            </div>
          </div>
        </div>
        {/* Khu Vực Widget */}
        <div className="col-12 col-md-6">
          <div className="single_widget_area">
            <div className="footer_social_area">
              <a href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><i className="fa fa-facebook" aria-hidden="true" /></a>
              <a href="#" data-toggle="tooltip" data-placement="top" title="Instagram"><i className="fa fa-instagram" aria-hidden="true" /></a>
              <a href="#" data-toggle="tooltip" data-placement="top" title="Twitter"><i className="fa fa-twitter" aria-hidden="true" /></a>
              <a href="#" data-toggle="tooltip" data-placement="top" title="Pinterest"><i className="fa fa-pinterest" aria-hidden="true" /></a>
              <a href="#" data-toggle="tooltip" data-placement="top" title="Youtube"><i className="fa fa-youtube-play" aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </div>
      {/* Lời Cảm Ơn */}
      <div className="row">
        <div className="col-12 text-center mt-4">
          <p>Cảm ơn quý khách đã tin tưởng và ủng hộ chúng tôi. Chúc quý khách có trải nghiệm mua sắm tuyệt vời!</p>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
