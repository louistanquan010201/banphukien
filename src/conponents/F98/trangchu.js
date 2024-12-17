import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Trangchu = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'Đ';
  };
  const tentk = sessionStorage.getItem("tenTK")
  useEffect(() => {
    // Hàm fetch API sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham'); // Đổi URL này thành URL API của bạn
        console.log('Products fetched:', response.data); // Kiểm tra dữ liệu trả về
        if (response.data?.$values) {
          setProducts(response.data.$values); // Gán dữ liệu vào state
        } else {
          console.error('Expected $values array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts(); // Gọi hàm fetch API

    // Danh sách scripts cần tải
    const scripts = [
      'js/jquery/jquery-2.2.4.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js',
      'js/popper.min.js',
      'js/bootstrap.min.js',
      'js/plugins.js',
      'js/classy-nav.min.js',
      'js/active.js',
    ];

    // Hàm tải script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          console.log(`Loaded script: ${src}`);
          resolve();
        };
        script.onerror = () => {
          console.error(`Error loading script: ${src}`);
          reject(new Error(`Error loading script: ${src}`));
        };
        document.body.appendChild(script);
      });
    };

    // Tải tuần tự các script
    const loadScriptsSequentially = async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (error) {
          console.warn(error.message);
        }
      }

      // Kiểm tra nếu jQuery và jQuery Easing đã tải xong
      if (window.jQuery && window.jQuery.easing) {
        console.log("jQuery and jQuery Easing loaded successfully.");
      } else {
        console.warn("jQuery or jQuery Easing not loaded.");
      }
    };

    loadScriptsSequentially(); // Gọi hàm tải script

    // Cleanup scripts khi component bị unmount
    return () => {
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);
  // const tentk = sessionStorage.getItem("tenTK")
  // const id = sessionStorage.getItem("id")
  // const loaitk = sessionStorage.getItem("loaitk")
  // console.log("tentk",tentk)
  // console.log("id",id)
  // console.log("loaitk",loaitk)

  return (
    <div>

      {/* ##### Header Area End ##### */}
      {/* ##### Right Side Cart Area ##### */}
      <div className="cart-bg-overlay" />
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
                  <span className="product-remove"><i className="fa fa-close" aria-hidden="true" /></span>
                  <span className="badge">Mango</span>
                  <h6>Button Through Strap Mini Dress</h6>
                  <p className="size">Size: S</p>
                  <p className="color">Color: Red</p>
                  <p className="price">$45.00</p>
                </div>
              </a>
            </div>
            {/* Single Cart Item */}
            <div className="single-cart-item">
              <a href="#" className="product-image">
                <img src="img/product-img/product-2.jpg" className="cart-thumb" alt="" />
                {/* Cart Item Desc */}
                <div className="cart-item-desc">
                  <span className="product-remove"><i className="fa fa-close" aria-hidden="true" /></span>
                  <span className="badge">Mango</span>
                  <h6>Button Through Strap Mini Dress</h6>
                  <p className="size">Size: S</p>
                  <p className="color">Color: Red</p>
                  <p className="price">$45.00</p>
                </div>
              </a>
            </div>
            {/* Single Cart Item */}
            <div className="single-cart-item">
              <a href="#" className="product-image">
                <img src="img/product-img/product-3.jpg" className="cart-thumb" alt="" />
                {/* Cart Item Desc */}
                <div className="cart-item-desc">
                  <span className="product-remove"><i className="fa fa-close" aria-hidden="true" /></span>
                  <span className="badge">Mango</span>
                  <h6>Button Through Strap Mini Dress</h6>
                  <p className="size">Size: S</p>
                  <p className="color">Color: Red</p>
                  <p className="price">$45.00</p>
                </div>
              </a>
            </div>
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
      {/* ##### Right Side Cart End ##### */}
      {/* ##### Welcome Area Start ##### */}
      <section className="welcome_area bg-img background-overlay" style={{ backgroundImage: 'url(img/bg-img/xesh.png)' }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="hero-content">
                <h3 style={{ color: 'white' }}>Phụ Kiện F98</h3>
                <h3 style={{ color: 'white' }}>XIN CHÀO QUÝ KHÁCH</h3>
                {tentk === null ? (
                  <a href="dangky-dangnhap" className="btn essence-btn">Đăng nhập</a>

                ) : <a href="sanpham" className="btn essence-btn">Xem Sản Phẩm</a>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ##### Welcome Area End ##### */}
      {/* ##### Top Catagory Area Start ##### */}
      <div className="top_catagory_area section-padding-80 clearfix">
        <div className="container">
          <div className="row justify-content-center">
            {/* Single Catagory */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="single_catagory_area d-flex align-items-center justify-content-center bg-img" style={{ backgroundImage: 'url(img/bg-img/phuocnitron.jpg)' }}>
                <div className="catagory-content">
                  <a href="#">Phuộc</a>
                </div>
              </div>
            </div>
            {/* Single Catagory */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="single_catagory_area d-flex align-items-center justify-content-center bg-img" style={{ backgroundImage: 'url(img/bg-img/poxe.jpg)' }}>
                <div className="catagory-content">
                  <a href="#">Pô Xe</a>
                </div>
              </div>
            </div>
            {/* Single Catagory */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="single_catagory_area d-flex align-items-center justify-content-center bg-img" style={{ backgroundImage: 'url(img/bg-img/Brembo.jpg)' }}>
                <div className="catagory-content">
                  <a href="#">Heo Dầu</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ##### Top Catagory Area End ##### */}
      {/* ##### CTA Area Start ##### */}
      <div className="cta-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="cta-content bg-img background-overlay" style={{ backgroundImage: 'url(img/bg-img/vp.jpg)', height: 640 }}>
                <div className="h-100 d-flex align-items-center justify-content-end">
                  <div className="thoai">
                    <h2 style={{
                      fontSize: '40px',
                      marginBottom: '10px',
                      color: 'white',
                      textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)'
                    }}>Phụ kiện F98</h2>
                    <h6 style={{
                      fontSize: '16px',
                      color: 'white',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                    }}>Uy tín, chất lượng, dịch vụ tận tâm!</h6>
                    <h6 style={{
                      fontSize: '16px',
                      color: 'white',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                    }}>Tôn vinh phong cách, nâng tầm xế yêu!</h6>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ##### CTA Area End ##### */}
      {/* ##### New Arrivals Area Start ##### */}
      <section className="khu_vuc_san_pham_moi ">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <h2>Sản phẩm mới ra mắt</h2> {/* Tiêu đề */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="popular-products-slides owl-carousel">
                {products
                  .filter(product => product.trangThai !== 'Ngưng bán' && (new Date() - new Date(product.thoiGianTao)) <= (15 * 24 * 60 * 60 * 1000)) // Lọc sản phẩm trong 15 ngày và không bao gồm sản phẩm ngưng bán
                  .map(product => (
                    <div className="single-product-wrapper" key={product.id}>
                      {/* Product Image */}
                      <div className="product-img" style={{ height: 340 }}>
                        {/* Hình ảnh chính */}
                        {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 0 && (
                          <img src={product.hinhAnh.$values[0]} style={{ height: 350 }} alt={product.tenSanPham} />
                        )}
                        {/* Hình ảnh hover */}
                        {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 1 && (
                          <img className="hover-img" src={product.hinhAnh.$values[1]} style={{ height: 350 }} alt={product.tenSanPham} />
                        )}
                        {/* Product Badge */}
                        <div className="product-badge new-badge">
                          <span>New</span>
                        </div>
                        {/* Favourite */}
                      </div>
                      {/* Product Description */}
                      <div className="product-description">
                        <span>{product.loaiPhuKien}</span>
                        <a href="single-product-details.html">
                          <h6>{product.tenSanPham}</h6>
                        </a>
                        <p className="product-price">{formatCurrency(product.giaBan)}</p>
                        {/* Hover Content */}
                        <div className="hover-content">
                          <div className="add-to-cart-btn">
                            <button
                              onClick={() => {
                                localStorage.setItem('selectedProductId', product.id); // Lưu id sản phẩm vào localStorage
                                navigate(`/chitietsanpham`); // Chuyển hướng tới trang chi tiết sản phẩm
                              }}
                              className="btn essence-btn"
                            >
                              Xem sản phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="khu_vuc_san_pham_moi ">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <h2>Sản phẩm bán chạy</h2> {/* Tiêu đề */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="popular-products-slides owl-carousel">
                {products
                  .filter(product => product.trangThai !== 'Ngưng bán') // Lọc ra sản phẩm không ngưng bán
                  .sort((a, b) => b.soLuongDaBan - a.soLuongDaBan) // Sắp xếp theo số lượng đã bán (giảm dần)
                  .slice(0, 5) // Lấy top 5 sản phẩm
                  .map((product, index) => (
                    <div className="single-product-wrapper" key={product.id}>
                      {/* Product Image */}
                      <div className="product-img" style={{ height: 340 }}>
                        {/* Hình ảnh chính */}
                        {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 0 && (
                          <img src={product.hinhAnh.$values[0]} style={{ height: 350 }} alt={product.tenSanPham} />
                        )}
                        {/* Hình ảnh hover */}
                        {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 1 && (
                          <img className="hover-img" src={product.hinhAnh.$values[1]} style={{ height: 350 }} alt={product.tenSanPham} />
                        )}
                        {/* Product Badge */}
                        <div className={`product-badge top-badge`}>
                          <span>{`Top ${index + 1}`}</span> {/* Hiển thị Top 1, Top 2,... */}
                        </div>
                        {/* Favourite */}
                      </div>
                      {/* Product Description */}
                      <div className="product-description">
                        <span>{product.loaiPhuKien}</span>
                        <a href="single-product-details.html">
                          <h6>{product.tenSanPham}</h6>
                        </a>
                        <p className="product-price">{formatCurrency(product.giaBan)}</p>
                        {/* Hover Content */}
                        <div className="hover-content">
                          <div className="add-to-cart-btn">
                            <button
                              onClick={() => {
                                localStorage.setItem('selectedProductId', product.id); // Lưu id sản phẩm vào localStorage
                                navigate(`/chitietsanpham`); // Chuyển hướng tới trang chi tiết sản phẩm
                              }}
                              className="btn essence-btn"
                            >
                              Xem sản phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ##### New Arrivals Area End ##### */}
      {/* ##### Brands Area Start ##### */}
      <div className="brands-area d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/bg-img/logo1.png" alt="" />
        </div>
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/bg-img/logo2.png" alt="" />
        </div>
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/bg-img/logo3.png" alt="" />
        </div>
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/bg-img/logo4.png" alt="" />
        </div>
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/core-img/brand5.png" alt="" />
        </div>
        {/* Brand Logo */}
        <div className="single-brands-logo">
          <img src="img/bg-img/logo6.png" alt="" />
        </div>
      </div>
      {/* ##### Brands Area End ##### */}
      {/* ##### Footer Area Start ##### */}

      {/* ##### Footer Area End ##### */}
      {/* jQuery (Necessary for All JavaScript Plugins) */}
      {/* Popper js */}
      {/* Bootstrap js */}
      {/* Plugins js */}
      {/* Classy Nav js */}
      {/* Active js */}
    </div>

  );
}



export default Trangchu;