import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import './style/danhgia.css';
const Chitietsanpham = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({ DSMauSac: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [id, setId] = useState(null); // Khởi tạo state cho id
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);// Lưu trạng thái số sao được chọn
  const tenTK = sessionStorage.getItem('tenTK');
  const idspdg = sessionStorage.getItem('idsp');
  const idtk = sessionStorage.getItem('id');
  const idtBao = sessionStorage.getItem('idtBao');
  const [comment, setComment] = useState("");  // Lưu nội dung bình luận
  const [message, setMessage] = useState("");  // Thông báo sau khi lưu
  const [Danhgia, setdanhgia] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
 
  // console.log("idsp",idspdg)
  // console.log(tenTK);
  const handleOrderClick = async () => {
    if (selectedColor === null) {
      Swal.fire({
        title: 'Vui lòng chọn màu sắc',
        icon: 'warning',
      });
      return;
    }
    if (tenTK === null) {
      Swal.fire({
        title: 'Vui lòng đăng nhập',
        icon: 'warning',
      });
      return;
    }
    try {

      const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/GioHang/checksl?IDpk=${product.id}&soluong=${quantity}&mausac=${selectedColor}`);


      if (response.status === 200) {
        navigate('/thanhtoan', {
          state: {
            productId: product.id,
            quantity: quantity,
            selectedColor: selectedColor
          }
        });
      }
    } catch (error) {
      if (error.response) {
        // Nếu API trả về lỗi BadRequest
        Swal.fire({
          title: "Lỗi!",
          text: "Số lượng vượt quá trong kho",
          icon: "error"
        });
        // alert(error.response.data.message || "Không đủ số lượng sản phẩm!");
        // console.log("dữ liệu",product.id,selectedColor,quantity)
        return;

      } else {
        // Các lỗi khác
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
      }
    }

  };

  const ThemGH = async () => {
    if (selectedColor === null) {
      Swal.fire({
        title: 'Vui lòng chọn màu sắc',
        icon: 'warning',
      });
      return;
    }

    // Tạo đối tượng sản phẩm
    const sanPhamDTO = {
      Idpk: product.id,
      tenphukien: product.tenSanPham,
      soLuong: quantity,
      mausac: selectedColor,
      hinhAnh: product.hinhAnh?.$values[0] || 'default-image.jpg', // Đảm bảo lấy hình ảnh đầu tiên hoặc giá trị mặc định
      giaBan: product.giaBan || 0 // Lấy giá trị giaBan hoặc 0 nếu không có
    };


    // Phần còn lại của mã không thay đổi
    if (!tenTK) {
      try {
        const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/GioHang/checksl?IDpk=${product.id}&soluong=${quantity}&mausac=${selectedColor}`);
        if (response.status === 200) {
          const localCart = JSON.parse(sessionStorage.getItem('localCart')) || [];

          const existingProductIndex = localCart.findIndex(
            item => item.Idpk === sanPhamDTO.Idpk && item.mausac === sanPhamDTO.mausac
          );

          if (existingProductIndex !== -1) {
            localCart[existingProductIndex].soLuong += sanPhamDTO.soLuong;
          } else {
            localCart.push(sanPhamDTO);
          }

          sessionStorage.setItem('localCart', JSON.stringify(localCart));

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đã thêm vào giỏ hàng",
            text: `Đã thêm ${quantity} ${product.tenSanPham} vào giỏ hàng`,
            showConfirmButton: false,
            imageUrl: product.hinhAnh.$values[0],
            imageHeight: 200,
            imageAlt: "A tall image",
            timer: 1500
          });
          // console.log('gio hang', localCart);
        }
      } catch (error) {
        if (error.response) {
          // Nếu API trả về lỗi BadRequest
          Swal.fire({
            title: "Lỗi!",
            text: "Số lượng vượt quá trong kho",
            icon: "error"
          });
          // alert(error.response.data.message || "Không đủ số lượng sản phẩm!");
          // console.log("dữ liệu",product.id,selectedColor,quantity)
          return;

        } else {
          // Các lỗi khác
          alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
      }



    } else {
      try {
        const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/GioHang/ThemGioHang?tentk=${tenTK}`, sanPhamDTO);

        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thêm vào giỏ hàng thành công",
            text: `Đã thêm ${quantity} ${product.tenSanPham} vào giỏ hàng`,
            showConfirmButton: false,
            imageUrl: product.hinhAnh.$values[0],
            imageHeight: 200,
            imageAlt: "A tall image",
            timer: 1500
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Lỗi!",
          text: "Số lượng vượt quá trong kho",
          icon: "error"
        });
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  useEffect(() => {
    // Lấy id từ localStorage
    const fetchedId = localStorage.getItem('selectedProductId');
    if (fetchedId) {
      setId(fetchedId);
    }
  }, []);
  const getTextColor = (isSelected) => {
    // Nếu nút được chọn, chữ sẽ là màu trắng
    return isSelected ? 'white' : 'black'; // Trả về màu chữ trắng nếu được chọn, ngược lại là đen
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/SanPham/${id}`);
        setProduct(response.data); // Gán object sản phẩm vào state product       
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color); // Cập nhật màu đã chọn
  };
  // Xử lý khi chọn sao

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

  useEffect(() => {
    // Lọc các đánh giá theo số sao đã chọn, nếu không chọn sao nào thì hiển thị tất cả các đánh giá
    if (selectedRating === null) {
      setFilteredReviews(product.danhGias ? product.danhGias.$values.slice(0, 5) : []);
    } else {
      setFilteredReviews(
        product.danhGias
          ? product.danhGias.$values.filter((danhGia) => danhGia.saoDanhGia === selectedRating)
          : []
      );
    } 
  }, [selectedRating, product.danhGias]);

  const handleStarClick = (star) => {
    if (selectedRating === star) {
      setSelectedRating(null); // Nếu đã chọn sao đó rồi thì bỏ chọn
    } else {
      setSelectedRating(star); // Chọn sao
    }
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleCloseReviews = () => {
    setShowAllReviews(false);
  };
  // Hàm xử lý gửi đánh giá

  const handleShowAll = () => setShowAll(true);
  const handlecaneShowAll = () => setShowAll(false);
  return (
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet" />
      <title>Đơn Hàng</title>
      <link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" type="text/css" href="/assets/css/font-awesome.css" />
      <link rel="stylesheet" href="/assets/css/templatemo-hexashop.css" />
      <link rel="stylesheet" href="/assets/css/owl-carousel.css" />
      <link rel="stylesheet" href="/assets/css/lightbox.css" />
      <meta charSet="UTF-8" />
      <meta name="description" content />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {/* The above 4 meta tags *must* come first in the head; any other head content must come *after* these tags */}
      {/* Title  */}
      <title>Essence - Fashion Ecommerce Template</title>
      {/* Favicon  */}
      <link rel="icon" href="img/core-img/favicon.ico" />
      {/* Core Style CSS */}
      <link rel="stylesheet" href="css/core-style.css" />
      <link rel="stylesheet" href="style.css" />
      {/* ##### Header Area Start ##### */}

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
      <div>
        {/* Kiểm tra nếu product có dữ liệu thì hiển thị chi tiết */}
        {product ? (
          <section className="section" style={{ marginBottom: 60 }} id="product">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div className="left-images">
                    <div className="small-images">
                      {product.hinhAnh &&
                        product.hinhAnh.$values &&
                        product.hinhAnh.$values.length > 0 &&
                        (() => {
                          const imagesToDisplay = product.hinhAnh.$values.slice(0, 3); // Lấy tối đa 3 hình ảnh
                          // console.log("Hình ảnh hiển thị:", imagesToDisplay); // Ghi lại danh sách hình ảnh được hiển thị
                          return imagesToDisplay.map((img, index) => (
                            <img
                              key={index}
                              className="hover-img"
                              src={img}
                              alt={product.tenSanPham}
                              onClick={() => setCurrentImageIndex(index)} // Cập nhật chỉ số hình ảnh lớn khi nhấn vào hình nhỏ
                            />
                          ));
                        })()}
                    </div>
                    <div className="main-image">
                      {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 0 && (
                        <img
                          className="hover-img"
                          src={product.hinhAnh.$values[currentImageIndex]} // Sử dụng currentImageIndex để lấy hình ảnh lớn
                          style={{ height: 510, width: 400 }}
                          alt={product.tenSanPham}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="right-content">
                    <h4>{product.tenSanPham}</h4>
                    <span className="price">
                      {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(product.giaBan)} VND
                    </span>
                    <ul className="stars" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <li key={star} style={{ marginRight: '5px' }}>
                          <i
                            className={`fa fa-star ${star <= Math.round(product.saoTrungBinh) ? 'filled' : ''}`}
                            style={{
                              fontSize: '18px',
                              color: star <= Math.round(product.saoTrungBinh) ? '#ffcc00' : '#ddd',
                            }}
                          ></i>
                        </li>
                      ))}
                    </ul>
                    <div className="quantity-content">
                      <span style={{ marginTop: 1 }}>{product.moTa}</span>
                    </div>

                    <div className="mausac">
                      <h3>Chọn màu sắc:</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {product.dsMauSac?.$values?.map((mau, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorChange(mau.mauSac)}
                            disabled={mau.soLuongMau === 0}
                            style={{
                              backgroundColor: selectedColor === mau.mauSac ? 'black' : '#ffffff',
                              color: getTextColor(selectedColor === mau.mauSac),
                              border: '2px solid black',
                              padding: '10px 20px',
                              cursor: mau.soLuongMau === 0 ? 'not-allowed' : 'pointer',
                              opacity: mau.soLuongMau === 0 ? 0.5 : 1,
                            }}
                          >
                            {mau.mauSac}
                          </button>
                        ))}
                      </div>
                      <p>
                        {selectedColor
                          ? `Số lượng màu ${selectedColor}: ${product.dsMauSac?.$values.find((mau) => mau.mauSac === selectedColor)?.soLuongMau || 0
                          }`
                          : `Tổng số lượng sản phẩm: ${product.dsMauSac?.$values.reduce((total, mau) => total + mau.soLuongMau, 0)
                          }`}
                      </p>
                      <p>Màu sắc đã chọn: {selectedColor || 'Chưa chọn màu'}</p>
                    </div>

                    <div className="quantity-content">
                      <div className="left-content">
                        <h6>Số lượng</h6>
                      </div>
                      <div className="right-content">
                        <div className="quantity buttons_added">
                          <input type="button" value="-" className="minus" onClick={() => handleQuantityChange(quantity - 1)} />
                          <input type="number" value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)} className="input-text qty text" size={4} />
                          <input type="button" value="+" className="plus" onClick={() => handleQuantityChange(quantity + 1)} />
                        </div>
                      </div>
                    </div>
                    <div className="tongtien">
                      <h4>Tổng Tiền: {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(product.giaBan * quantity)} VND</h4>
                    </div>
                    <div className="total" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="main-border-button"><a href="#" onClick={ThemGH}>Thêm vào giỏ</a></div>
                      <div className="main-border-button"><a href="#" onClick={handleOrderClick}>Đặt hàng</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}
      </div>
      <div className="danhgia">
        <style jsx>{`
          .danhgia {
            margin-top: 30px;
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .danhgia h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #333;
          }

          .danhgia-item {
            display: flex;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          }

          .danhgia-header {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }

          .danhgia-star {
            margin-right: 10px;
          }

          .danhgia-star .fa-star {
            font-size: 18px;
          }

          .danhgia-img {
            width: 90px;
            height: 100px;
            
            object-fit: cover;
            margin-left: 10px;
          }

          .danhgia-content {
            flex: 1;
          }

          .danhgia-content p {
            font-size: 14px;
            color: #555;
          }

          .taiKhoan {
            font-size: 12px;
            color: #888;
          }

          .thoiGian {
            font-size: 12px;
            color: #bbb;
          }

          .filled {
            color: #ffcc00;
          }
        `}</style>


        <h3>Đánh giá sản phẩm:</h3>

        {/* Hiển thị số sao trung bình */}
        <span style={{ fontSize: '16px' }}>
          {product.saoTrungBinh ? product.saoTrungBinh.toFixed(1) : 'Chưa có đánh giá'} / 5
        </span>

        {/* Hiển thị các sao từ 5 đến 1 */}
        <ul className="stars" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
          {[1,2,3,4,5].map((star) => (
            <li key={star} style={{ marginRight: '5px' }}>
              <i
                className={`fa fa-star ${star <= Math.round(product.saoTrungBinh) ? 'filled' : ''}`}
                style={{
                  fontSize: '18px',
                  color: star <= Math.round(product.saoTrungBinh) ? '#ffcc00' : '#ddd',
                }}
              ></i>
            </li>
          ))}
        </ul>

        {/* Hiển thị các ô sao (lựa chọn sao) */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              style={{
                fontSize: '18px',
                marginRight: '10px',
                backgroundColor: selectedRating === star ? '#ffcc00' : '#ddd',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              {star} Sao
            </button>
          ))}
        </div>

        {/* Hiển thị các đánh giá đã lọc */}
        {filteredReviews && filteredReviews.length > 0 ? (
          filteredReviews.map((danhGia, index) => (
            <div key={index} className="danhgia-item">
              <div className="danhgia-content">
                <p>{danhGia.mieuTaDanhGia}</p>
                <small className="taiKhoan">{danhGia.taiKhoan}</small>
                <br />
                <div className="danhgia-header">
                  <div className="danhgia-star">
                    {[1,2,3,4,5].map((star) => (
                      <i
                        key={star}
                        className={`fa fa-star ${star <= danhGia.saoDanhGia ? 'filled' : ''}`}
                        style={{
                          fontSize: '14px',
                          color: star <= danhGia.saoDanhGia ? '#ffcc00' : '#ddd',
                        }}
                      ></i>
                    ))}
                  </div>
                  {danhGia.hinhAnh && <img src={danhGia.hinhAnh} alt="Hình đánh giá" className="danhgia-img" />}
                </div>
                <small className="thoiGian">
                  {new Date(danhGia.thoiGianTao).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho {selectedRating} sao.</p>
        )}

        {/* Nút Xem tất cả đánh giá */}
        <button onClick={handleShowAllReviews} style={{ marginTop: '20px' }}>
          Xem tất cả đánh giá
        </button>

        {/* Phần hiển thị tất cả đánh giá */}
        {showAllReviews && (
          <div className="reviews-container" style={{
            position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, padding: '20px', overflowY: 'auto'
          }}>
            <div className="reviews-content" style={{
              backgroundColor: '#fff', padding: '20px', maxWidth: '600px', width: '100%', borderRadius: '8px',
              height: '80vh', overflowY: 'scroll'
            }}>
              <h4>Tất cả đánh giá</h4>
              <button
                onClick={handleCloseReviews}
                style={{
                  backgroundColor: 'red',
                  position: 'relative',
                  left: '470px',
                  top: '-55px',
                  marginTop: '10px',
                  color: 'white', // Đặt màu chữ cho phù hợp với nền đỏ
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
              {product.danhGias && product.danhGias.$values && product.danhGias.$values.length > 0 ? (
                product.danhGias.$values.map((danhGia, index) => (
                  <div key={index} className="danhgia-item">
                    <div className="danhgia-content">
                      <p>{danhGia.mieuTaDanhGia}</p>
                      <small className="taiKhoan">{danhGia.taiKhoan}</small>
                      <br />
                      <div className="danhgia-header">
                        <div className="danhgia-star">
                          {[1,2,3,4,5].map((star) => (
                            <i
                              key={star}
                              className={`fa fa-star ${star <= danhGia.saoDanhGia ? 'filled' : ''}`}
                              style={{
                                fontSize: '14px',
                                color: star <= danhGia.saoDanhGia ? '#ffcc00' : '#ddd',
                              }}
                            ></i>
                          ))}
                        </div>
                        {danhGia.hinhAnh && danhGia.hinhAnh !==null && <img src={danhGia.hinhAnh} alt="Hình đánh giá" className="danhgia-img" />}
                      </div>
                      <small className="thoiGian">
                        {new Date(danhGia.thoiGianTao).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}

            </div>
          </div>
        )}
      </div>
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



export default Chitietsanpham;