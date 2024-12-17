import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ChatAI = () => {
    const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
    const [rating, setRating] = useState(0); // Lưu số sao được chọn
    const [hover, setHover] = useState(0);  // Lưu trạng thái hover
    const [review, setReview] = useState(""); // Lưu nội dung đánh giá
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Lưu chỉ số hình ảnh hiện tại
    const [selectedImage, setSelectedImage] = useState(null);  // Lưu hình ảnh được chọn
    const navigate = useNavigate();
    const tentk = sessionStorage.getItem("tenTK")
    const productId = localStorage.getItem('selectedProductId');
    const idtBao = sessionStorage.getItem("idtBao")
    console.log("idtBao",idtBao)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/SanPham/${productId}`);
                setProduct(response.data);
                const responseRating = response.data.danhGia || 0;
                setRating(responseRating);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file.name); // Lưu tên file thay vì base64
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn số sao!',
                text: 'Bạn chưa chọn số sao để đánh giá sản phẩm.',
                confirmButtonText: 'Đóng'
            });
            return;
        }
    
        const reviewData = {
            IdSanPham: product.id,
            SaoDanhGia: rating,
            MieuTaDanhGia: review || "",
            HinhAnh: selectedImage || "",  // Lưu tên file thay vì base64
            TaiKhoan: tentk, // Tài khoản mặc định
            idtBao:idtBao
        };
        console.log(reviewData)
        try {
            const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/QuanLy/themDanhGia', reviewData);

            Swal.fire({
                icon: 'success',
                title: 'Đánh giá thành công!',
                text: 'Cảm ơn bạn đã đánh giá sản phẩm!',
                confirmButtonText: 'Đóng'
            }).then(() => {
                sessionStorage.removeItem("idtBao")
                navigate('/');
            });
    
            setRating(0);
            setReview("");
            setSelectedImage(null);  // Reset hình ảnh
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            alert("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    if (!product) {
        return <p>Đang tải thông tin sản phẩm...</p>;
    }

    return (
        <div className="danhgia-container" style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
        <h2>Đánh giá sản phẩm: {product.tenSanPham}</h2>

        {product.hinhAnh && product.hinhAnh.$values && product.hinhAnh.$values.length > 0 && (
            <div className="product-images">
                <img
                    src={product.hinhAnh.$values[currentImageIndex]}
                    alt={product.tenSanPham}
                    style={{ width: "50%", height: "400px", marginBottom: "20px" }}
                />
                <div className="thumbnail-images">
                    {product.hinhAnh.$values.slice(0, 3).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={product.tenSanPham}
                            onClick={() => setCurrentImageIndex(index)}
                            style={{
                                width: "60px",
                                height: "60px",
                                margin: "5px",
                                cursor: "pointer",
                                border: index === currentImageIndex ? "2px solid #000" : "1px solid #ccc"
                            }}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* Phần đánh giá sao */}
        <div className="rating-stars" style={{ margin: "10px 0" }}>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        style={{ cursor: "pointer", fontSize: "24px", color: starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9" }}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                );
            })}
        </div>

        <form onSubmit={handleSubmit}>
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                placeholder="Hãy viết đánh giá của bạn tại đây..."
                style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginBottom: "10px",
                }}
            ></textarea>

            <div className="image-upload-container" style={{ marginBottom: "20px", textAlign: "center" }}>
                <label htmlFor="image-upload" className="image-upload-label" style={{
                    display: "inline-block",
                    backgroundColor: "#f8f9fa",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "1px dashed #007bff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                }}>
                    <i className="fa fa-camera" style={{ fontSize: "30px", color: "#007bff" }}></i>
                    <span style={{ display: "block", marginTop: "5px", color: "#007bff" }}>Thêm hình ảnh</span>
                </label>
                <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: "none" }}
                />
                {selectedImage && (
                    <div className="selected-image-preview" style={{ marginTop: "10px" }}>
                        <span>{selectedImage}</span>  {/* Hiển thị tên file */}
                    </div>
                )}
            </div>

            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Gửi đánh giá
            </button>
        </form>
    </div>
    );
};

export default ChatAI;
