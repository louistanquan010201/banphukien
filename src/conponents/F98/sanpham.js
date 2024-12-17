import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sanpham = () => {
  const formatCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'Đ';
  };
  const [sortOption, setSortOption] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Hàm sắp xếp sản phẩm
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'gia-cao-nhat':
        return b.giaBan - a.giaBan;
      case 'gia-thap-nhat':
        return a.giaBan - b.giaBan;
      case 'a-z':
        return a.tenSanPham.localeCompare(b.tenSanPham);
      case 'z-a':
        return b.tenSanPham.localeCompare(a.tenSanPham);
      default:
        return 0;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState(null); // Trạng thái để lưu loại phụ kiện đã chọn

  // Hàm xử lý khi người dùng chọn một loại phụ kiện
  const handleCategorySelect = (categoryName) => {
    // Kiểm tra nếu loại đang được chọn thì sẽ bỏ chọn (đặt là null), nếu không thì chọn loại mới
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái lưu từ khóa tìm kiếm

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Cập nhật từ khóa tìm kiếm
  };
  // Hàm xử lý khi người dùng chọn một nhà cung cấp
  const handleSupplierSelect = (supplierName) => {
    // Kiểm tra nếu nhà cung cấp đã được chọn thì sẽ bỏ chọn (đặt lại thành null), nếu không thì chọn nhà cung cấp mới
    setSelectedSupplier(selectedSupplier === supplierName ? null : supplierName);
  };
  // Lọc sản phẩm theo phạm vi giá đã chọn
  const filteredProducts = sortedProducts.filter(product => {
    if (selectedCategory && product.loaiPhuKien !== selectedCategory) {
      return false; // Loại sản phẩm không khớp với loại phụ kiện đã chọn
    }

    if (selectedSupplier && product.nhaCungCap !== selectedSupplier) {
      return false; // Nhà cung cấp không khớp với nhà cung cấp đã chọn
    }
    if (searchTerm && !product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false; // Nếu tên sản phẩm không chứa từ khóa tìm kiếm thì loại bỏ
    }
    // Lọc theo phạm vi giá
    if (selectedPriceRange.length === 0) return true; // Nếu không có gì chọn thì không lọc
    return selectedPriceRange.some(range => {
      switch (range) {
        case 'under-1-million':
          return product.giaBan < 1000000;
        case '1-to-2-million':
          return product.giaBan > 1000000 && product.giaBan < 2000000;
        case '2-to-3-million':
          return product.giaBan >= 2000000 && product.giaBan < 3000000;
        case '3-to-4-million':
          return product.giaBan >= 3000000 && product.giaBan < 4000000;
        case 'above-4-million':
          return product.giaBan >= 4000000;
        default:
          return false;
      }
    });
  });

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const productsPerPage = 9; // Số sản phẩm mỗi trang

  // Tính toán danh sách sản phẩm cần hiển thị từ filteredProducts (đã lọc)
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tổng số trang dựa trên số sản phẩm đã lọc
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Hàm xử lý khi người dùng chọn các checkbox lọc giá
  const handlePriceFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPriceRange(prevState =>
      checked ? [...prevState, value] : prevState.filter(item => item !== value)
    );
  };

  const [loaiPhuKiens, setLoaiPhuKiens] = useState([]);

  useEffect(() => {
    const fetchLoaiPhuKiens = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/loaiphukien');
        console.log('Dữ liệu loại phụ kiện:', response.data);
        if (Array.isArray(response.data.$values)) {
          setLoaiPhuKiens(response.data.$values);
        } else {
          setLoaiPhuKiens(response.data); // Nếu không có $values, có thể nó là mảng
        }
      } catch (error) {
        console.error('Lỗi khi lấy loại sản phẩm:', error);
      }
    };

    fetchLoaiPhuKiens();
  }, []);

  const [nhaCungCaps, setNhaCungCaps] = useState([]);

  // Lấy dữ liệu nhà cung cấp từ API
  useEffect(() => {
    const fetchNhaCungCaps = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham/nhacungcap');
        console.log('Dữ liệu nhà cung cấp:', response.data); // Kiểm tra dữ liệu

        // Nếu dữ liệu có dạng { $values: [...] }
        if (Array.isArray(response.data.$values)) {
          setNhaCungCaps(response.data.$values);
        } else {
          setNhaCungCaps(response.data); // Nếu không có $values, có thể nó là mảng
        }
      } catch (error) {
        console.error('Lỗi khi lấy nhà cung cấp:', error);
      }
    };

    fetchNhaCungCaps();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/SanPham'); // API endpoint của bạn
        console.log('Products fetched:', response.data); // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data.$values)) { // Kiểm tra xem $values có phải là mảng không
          setProducts(response.data.$values); // Gán giá trị mảng vào products
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Gọi hàm fetchProducts để lấy dữ liệu
    fetchProducts();

    const scripts = [
      'js/jquery/jquery-2.2.4.min.js', // jQuery phải ở đầu
      'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js', // Easing phải được tải sau jQuery
      'js/popper.min.js',
      'js/bootstrap.min.js',
      'js/plugins.js',
      'js/classy-nav.min.js',
      'js/active.js',
    ];

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true; // Thêm thuộc tính async để cải thiện hiệu suất
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

    const loadScriptsSequentially = async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (error) {
          console.warn(error.message);
        }
      }

      // Kiểm tra xem jQuery và jQuery Easing đã được tải thành công chưa
      if (window.jQuery && window.jQuery.easing) {
        console.log("jQuery and jQuery Easing loaded successfully.");
        console.log(window.jQuery.easing); // Kiểm tra nội dung của jQuery Easing
      } else {
        console.warn("jQuery or jQuery Easing not loaded.");
      }
    };

    // Gọi hàm loadScriptsSequentially sau khi DOM đã được tải
    document.addEventListener('DOMContentLoaded', loadScriptsSequentially);
    return () => {
      scripts.forEach(src => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);
  const navigate = useNavigate();
  <style>
    {`
           .out-of-stock {
  position: relative;
  overflow: hidden;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.out-of-stock:hover .out-of-stock-overlay {
  opacity: 1;
}
  
  
        `}
  </style>
  const [compareProducts, setCompareProducts] = useState([]); // Lưu sản phẩm để so sánh
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false); // Điều khiển việc mở modal so sánh

  // Hàm xử lý khi nhấn nút "So sánh"
  const handleCompare = (product) => {
    if (compareProducts.length >= 2) {
      alert('Bạn chỉ có thể so sánh tối đa 2 sản phẩm!');
      return;
    }
    if (compareProducts.find((p) => p.id === product.id)) {
      alert('Sản phẩm này đã được thêm vào so sánh!');
      return;
    }
    setCompareProducts([...compareProducts, product]); // Thêm sản phẩm vào danh sách so sánh

    // Mở modal khi có ít nhất 1 sản phẩm được chọn, nhưng không hiển thị bảng so sánh
    if (compareProducts.length === 1) {
      setIsCompareModalOpen(true); // Mở modal khi có ít nhất 1 sản phẩm
    }
  };

  // Hàm đóng modal so sánh
  const closeCompareModal = () => {
    setCompareProducts([]); // Xóa tất cả sản phẩm trong danh sách so sánh
    setIsCompareModalOpen(false); // Đóng modal
  };
  // Hàm xóa sản phẩm khỏi danh sách so sánh
  const removeFromCompare = (id) => {
    const updatedCompareProducts = compareProducts.filter((product) => product.id !== id);
    setCompareProducts(updatedCompareProducts);

    // Đóng modal nếu danh sách so sánh trống hoặc chỉ còn một sản phẩm
    if (updatedCompareProducts.length <= 1) {
      setIsCompareModalOpen(false); // Đóng modal khi còn ít hơn hoặc bằng 1 sản phẩm
    }
  };
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
      {/* ##### Breadcumb Area Start ##### */}
      <div className="breadcumb_area bg-img" style={{ backgroundImage: 'url(img/bg-img/breadcumb.jpg)' }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="page-title text-center">
                <h2>Sản phẩm</h2>
              </div>
            </div>
          </div>
          <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo tên sản phẩm"
              style={{
                width: '40%',
                padding: '10px',
                marginBottom: '20px',
                
              }}
            />
          </div>
        </div>
      </div>
      
      {/* ##### Breadcumb Area End ##### */}
      {/* ##### Shop Grid Area Start ##### */}
      <section className="shop_grid_area section-padding-80">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-3">
              <div className="shop_sidebar_area">
                {/* ##### Single Widget ##### */}
                <div className="widget catagory mb-50">
                  {/* Widget Title */}
                  <h6 className="widget-title mb-30">Danh Mục</h6>
                  {/* Categories */}
                  <div className="catagories-menu">
                    <ul id="menu-content2" className="menu-content collapse show">
                      {loaiPhuKiens
                        .filter((loai) => loai.trangThai === "Đang hoạt động")
                        .map((loai) => (
                          <li key={loai.Id} data-toggle="collapse" data-target={`#${loai.tenLoaiPhuKien}`}>
                            <a
                              style={{
                                color: selectedCategory === loai.tenLoaiPhuKien ? 'red' : 'black', // Màu đỏ khi chọn, đen khi không chọn
                              }}
                              href="#"
                              onClick={() => handleCategorySelect(loai.tenLoaiPhuKien)} // Gọi hàm khi nhấn vào loại
                            >
                              {loai.tenLoaiPhuKien}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                {/* ##### Single Widget ##### */}
                <div className="widget price mb-50">
                  <h6 className="widget-title mb-30">Lọc theo</h6>
                  <p className="widget-title2 mb-30">Giá</p>
                  <div className="widget-desc">
                    <div className="price-range">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="price"
                            value="under-1-million"
                            onChange={handlePriceFilterChange}
                          />
                          Dưới 1 triệu
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="price"
                            value="1-to-2-million"
                            onChange={handlePriceFilterChange}
                          />
                          Từ 1 triệu - 2 triệu
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="price"
                            value="2-to-3-million"
                            onChange={handlePriceFilterChange}
                          />
                          Từ 2 triệu - 3 triệu
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="price"
                            value="3-to-4-million"
                            onChange={handlePriceFilterChange}
                          />
                          Từ 3 triệu - 4 triệu
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="price"
                            value="above-4-million"
                            onChange={handlePriceFilterChange}
                          />
                          Trên 4 triệu
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ##### Single Widget ##### */}
                <div className="widget color mb-50">
                  {/* Widget Title 2 */}
                  {/* <p className="widget-title2 mb-30">Color</p>
                  <div className="widget-desc">
                    <ul className="d-flex">
                      <li><a href="#" className="color1" /></li>
                      <li><a href="#" className="color2" /></li>
                      <li><a href="#" className="color3" /></li>
                      <li><a href="#" className="color4" /></li>
                      <li><a href="#" className="color5" /></li>
                      <li><a href="#" className="color6" /></li>
                      <li><a href="#" className="color7" /></li>
                      <li><a href="#" className="color8" /></li>
                      <li><a href="#" className="color9" /></li>
                      <li><a href="#" className="color10" /></li>
                    </ul>
                  </div> */}
                </div>
                {/* ##### Single Widget ##### */}
                <div className="widget brands mb-50">
                  {/* Widget Title 2 */}
                  <p className="widget-title2 mb-30">Hãng</p>
                  <div className="widget-desc">
                    <ul>
                      {nhaCungCaps.length > 0 ? (
                        nhaCungCaps.map((ncc) => (
                          <li key={ncc.Id}>
                            <a
                              href="#"
                              onClick={() => handleSupplierSelect(ncc.tenNhaCungCap)} // Khi click chọn nhà cung cấp
                              style={{
                                color: selectedSupplier === ncc.tenNhaCungCap ? 'red' : 'black', // Hiển thị màu khi đã chọn
                              }}
                            >
                              {ncc.tenNhaCungCap}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>Không có nhà cung cấp</li> // Thông báo nếu không có dữ liệu
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <div className="shop_grid_product_area">

                <div className="row">
                  <div className="col-12">
                    <div className="product-topbar d-flex align-items-center justify-content-between">
                      <div className="total-products">
                        {/* <p><span>186</span> products found</p> */}
                      </div>
                      <div className="product-sorting d-flex">
                        <p>Sắp xếp:</p>
                        <form action="#" method="get">
                          <select name="select" id="sortByselect" value={sortOption} onChange={handleSortChange}>
                            <option value="gia-cao-nhat">Giá cao nhất</option>
                            <option value="gia-thap-nhat">Giá thấp nhất</option>
                            <option value="a-z">Từ A-Z</option>
                            <option value="z-a">Từ Z-A</option>
                          </select>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                        <div className="single-product-wrapper">
                          <div
                            className={`product-img ${product.soLuongMauSac === 0 ? 'out-of-stock' : ''}`}
                            style={{ height: 340, position: 'relative' }}
                          >
                            {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 0 && (
                              <img
                                src={product.hinhAnh.$values[0]}
                                style={{ height: 350 }}
                                alt={product.tenSanPham}
                              />
                            )}
                            {product.soLuongMauSac === 0 && (
                              <div className="out-of-stock-overlay">
                                <span>Hết hàng</span>
                              </div>
                            )}
                          </div>
                          <div className="product-description">
                            <span>{product.loaiPhuKien}</span>
                            <a href="single-product-details.html">
                              <h6>{product.tenSanPham}</h6>
                            </a>
                            <p className="product-price">{formatCurrency(product.giaBan)}</p>

                            {/* Hiển thị sao trung bình */}
                            <div className="product-rating">
                              <style>
                                {`
                                .product-rating .fa-star.filled {
                                  color: gold;
                                }

                                .product-rating .fa-star.empty {
                                  color: #ccc;
                                }
                              `}
                              </style>
                              {Array.from({ length: 5 }, (_, index) => (
                                <i
                                  key={index}
                                  className={`fa fa-star ${index < product.saoTrungBinh ? 'filled' : 'empty'}`}
                                />
                              ))}
                              <span style={{ fontSize: '16px' }}>{product.saoTrungBinh.toFixed(1)}</span>
                            </div>

                            {/* Hiển thị tên nhà cung cấp */}
                            <p className="product-supplier" style={{ display: "none" }}>
                              Nhà cung cấp: {product.nhaCungCap}
                            </p>

                            <div className="hover-content">
                              <div className="add-to-cart-btn">
                                <button
                                  onClick={() => {
                                    localStorage.setItem('selectedProductId', product.id);
                                    navigate(`/chitietsanpham`);
                                  }}
                                  className="btn essence-btn"
                                  disabled={product.soLuongMauSac === 0}
                                >
                                  {product.soLuongMauSac === 0 ? 'Hết hàng' : 'Xem sản phẩm'}
                                </button>
                              </div>
                              {/* Nút So sánh */}
                              <div className="compare-btn">
                                <button
                                  onClick={() => handleCompare(product)}
                              
                                  disabled={product.soLuongMauSac === 0}
                                >
                                  {compareProducts.find((p) => p.id === product.id)
                                    ? '✔️ Đã chọn'
                                    : '🔍 So sánh'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-products">
                      <p>Không có sản phẩm phù hợp với yêu cầu lọc.</p>
                    </div>
                  )}
                </div>

                {/* Modal So Sánh */}
                {isCompareModalOpen && (
                  <div className="compare-modal">
                    <div className="compare-modal-content">
                      <button className="close-btn" onClick={closeCompareModal}>
                        X
                      </button>
                      <h3>So sánh sản phẩm</h3>
                      <div className="compare-products">
                        {compareProducts.map((product) => (
                          <div key={product.id} className="compare-product">
                            <img
                              src={product.hinhAnh.$values[0]}
                              alt={product.tenSanPham}

                            />
                            <h4>{product.tenSanPham}</h4>
                            <button onClick={() => removeFromCompare(product.id)} className="remove-btn">
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                      {compareProducts.length === 2 && (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Thông tin</th>
                              {compareProducts.map((product) => (
                                <th key={product.id}>{product.tenSanPham}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Giá</td>
                              {compareProducts.map((product) => (
                                <td key={product.id}>{formatCurrency(product.giaBan)}</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Mô tả</td>
                              {compareProducts.map((product) => (
                                <td key={product.id}>{product.moTa}</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Chất Liệu</td>
                              {compareProducts.map((product) => (
                                <td key={product.id}>{product.chatLieu}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
                <style>
                  {`
                    button {
                      background-color: #000000; /* Màu đen */
                      color: #FFFFFF; /* Chữ màu trắng */
                    }

                    button:hover {
                      background-color: #FF0000; /* Màu đỏ khi hover */
                      color: #FFFFFF; /* Chữ vẫn là màu trắng khi hover */
                    }
                  `}
                </style>
              </div>
              {/* Pagination */}
              <nav aria-label="navigation" style={{marginLeft:"10px"}}>
                <ul className="pagination mt-50 mb-70">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="fa fa-angle-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link" style={{backgroundColor:"white", color:"black"}}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="fa fa-angle-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
      {/* ##### Shop Grid Area End ##### */}
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







export default Sanpham;