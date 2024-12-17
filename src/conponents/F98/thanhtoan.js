import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

const Thanhtoan = () => {
    useEffect(() => {
        // const scripts = [
        //     'js/jquery/jquery-2.2.4.min.js',
        //     'js/popper.min.js',
        //     'js/bootstrap.min.js',
        //     'js/plugins.js',
        //     'js/classy-nav.min.js',
        //     'js/active.js'
        // ];

        // const loadScript = (src) => {
        //     return new Promise((resolve, reject) => {
        //         const script = document.createElement('script');
        //         script.src = src;
        //         script.async = true;
        //         script.onload = () => resolve();
        //         script.onerror = () => reject();
        //         document.body.appendChild(script);
        //     });
        // };

        // const loadScriptsSequentially = async () => {
        //     for (const src of scripts) {
        //         await loadScript(src);
        //     }
        // };

        // loadScriptsSequentially();

        // return () => {
        //     scripts.forEach(src => {
        //         const script = document.querySelector(`script[src="${src}"]`);
        //         if (script) {
        //             document.body.removeChild(script);
        //         }
        //     });
        // };
    }, []);

    const location = useLocation();
    const { productId, quantity, selectedColor } = location.state || {};
    const [productData, setProductData] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [phiShip, setPhiShip] = useState(0)
    const [Checkward, setCheckward] = useState(0);
    const navigate = useNavigate();
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [checkvoucher, setcheckvoucher] = useState([]);
    const headers = {
        // Thêm các header cần thiết nếu có
        'Token': '16db96ff-456b-11ef-a6bf-6ae11fb09515', // Thay thế bằng token của bạn
    };
    const tenTK = sessionStorage.getItem('tenTK');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const fetchProductData = async (id) => {
        try {
            const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/Dathang/Layspid`, null, {
                params: { id: id }
            });
            setProductData(response.data);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };


    const fetchCartDataOnCheckout = async () => {
        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/GioHang/HienGioHang?tentk=${tenTK}`);
            if (response.data && response.data.$values) {
                setCartProducts(response.data.$values);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm từ giỏ hàng:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductData(productId);
        } else {
            fetchCartDataOnCheckout();
            if (productData === null && cartProducts === null) {
                navigate('/')
            }
        }

    }, [productId]);

    const [formData, setFormData] = useState({
        tenNguoiDat: '',
        diachi: '',
        sdt: '',
        ghiChu: '',
        hinhThucTT: '',
        tenTaiKhoan: tenTK,
        phiShip: 0,
        voucherId: ''
    });
    const [formdiachi, setFormdiachi] = useState({
        diachi: '', // Biến duy nhất để lưu địa chỉ đầy đủ
        province: '',
        district: '',
        ward: '',
        detailAddress: '' // Địa chỉ chi tiết nhập từ input
    });
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'voucher') {
            if (!value) {
                // Nếu không có voucher (value = null hoặc không có giá trị), reset dữ liệu liên quan tới voucher
                setFormData({
                    ...formData,
                    voucherId: '', // Xóa voucherId
                });
                setSelectedVoucher(null); // Xóa thông tin voucher đã chọn
                setDiscountAmount(0); // Reset số tiền giảm giá
                Swal.fire({
                    title: "Thông báo",
                    text: "Voucher đã được xóa.",
                    icon: "info"
                });
                return;
            }

            // Tìm voucher dựa trên ID
            const selectedVoucher = vouchers.find(voucher => voucher.id === value);

            if (!selectedVoucher) {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Mã voucher không hợp lệ hoặc đã hết hạn",
                    icon: "error"
                });
                return;
            }

            const totalAmount = calculateTotalAmount();

            if (totalAmount < selectedVoucher.min_Order_Value) {
                Swal.fire({
                    title: "Lỗi!",
                    text: `Giá trị đơn hàng tối thiểu phải từ ${selectedVoucher.min_Order_Value.toLocaleString()} VND`,
                    icon: "error"
                });
                return;
            }

            // Tính toán số tiền giảm giá
            let discount = 0;
            if (selectedVoucher.discountType === 'percent') {
                // Tính phần trăm giảm giá và giới hạn bởi max_Discount
                const percentDiscount = (totalAmount * selectedVoucher.discount) / 100;
                discount = Math.min(percentDiscount, selectedVoucher.max_Discount);
            } else {
                discount = selectedVoucher.discount;
            }

            // Cập nhật formData và lưu thông tin voucher
            setFormData({
                ...formData,
                voucherId: value, // Lưu mã voucher vào formData
            });
            setSelectedVoucher(selectedVoucher);
            setDiscountAmount(discount);

            Swal.fire({
                title: "Thành công!",
                text: "Áp dụng voucher thành công!",
                icon: "success"
            });
        } else {
            // Xử lý các trường khác
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };




    // GIẢM GIÁ
    useEffect(() => {
        fetchVouchers();

    }, []);

    // Hàm lấy danh sách voucher
    const fetchVouchers = async () => {
        try {
            // Lấy danh sách voucher từ API chung
            const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Voucher');
            const dsvoucher = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/VoucherNguoiDung/layds?tentk=${tenTK}`);

            // Danh sách voucher của người dùng
            const voucherkh = dsvoucher.data.$values;

            // Lọc danh sách voucher chung để chỉ giữ những voucher phù hợp và có trong danh sách người dùng
            const activeVouchers = response.data.$values.filter(voucher =>
                voucher.status === 1 &&
                new Date(voucher.timeEnd) > new Date() &&
                new Date(voucher.timeStart) <= new Date() &&
                voucher.stock > 0 &&
                voucherkh.some(vkh => vkh.maVoucher === voucher.id) // Kiểm tra voucher có trong voucherkh
            );

            // Lưu danh sách voucher hợp lệ
            setVouchers(activeVouchers);

            // In log để kiểm tra
            console.log("activeVouchers", activeVouchers);
            console.log("voucherkh", voucherkh);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách voucher:', error);
        }
    };

    const calculateTotalAmount = () => {
        if (productData) {
            return productData.giaBan * quantity;
        } else if (cartProducts.length > 0) {
            return cartProducts.reduce((total, product) => total + (product.gia * product.soLuong), 0);
        }
        return 0;
    };
    // const handleApplyVoucher = async () => {
    //     const voucherCode = checkvoucher;
    //     const voucher = vouchers.find(v => v.id === voucherCode);

    //     if (!voucher) {
    //         Swal.fire({
    //             title: "Lỗi!",
    //             text: "Mã voucher không hợp lệ hoặc đã hết hạn",
    //             icon: "error"
    //         });
    //         console.log("voucherCode", voucherCode)
    //         console.log("vouchers", vouchers)
    //         console.log("voucher", voucher)
    //         return;
    //     }

    //     const totalAmount = calculateTotalAmount();

    //     if (totalAmount < voucher.min_Order_Value) {
    //         Swal.fire({
    //             title: "Lỗi!",
    //             text: `Giá trị đơn hàng tối thiểu phải từ ${voucher.min_Order_Value.toLocaleString()} VND`,
    //             icon: "error"
    //         });
    //         return;
    //     }

    //     // Tính toán số tiền giảm dựa trên loại voucher
    //     let discount = 0;
    //     if (voucher.discountType === 'percent') {
    //         // Nếu là phần trăm, tính số tiền giảm và giới hạn bởi max_Discount
    //         const percentDiscount = (totalAmount * voucher.discount) / 100;
    //         discount = Math.min(percentDiscount, voucher.max_Discount);
    //         // console.log("totalAmount", totalAmount)
    //         // console.log("voucher.discount", voucher.discount)
    //         // console.log("discount", discount)
    //     } else {
    //         discount = voucher.discount;
    //         // console.log("discount", discount)
    //     }
    //     setFormData({
    //         ...formData,
    //         voucherId: voucherCode,  // Lưu mã voucher vào formData
    //     });
    //     setSelectedVoucher(voucher);
    //     setDiscountAmount(discount);

    //     Swal.fire({
    //         title: "Thành công!",
    //         text: "Áp dụng voucher thành công!",
    //         icon: "success"
    //     });
    // };

    const handleOrderConfirmation = async () => {
        let sanPhamDTOs = [];
        let totalAmount = 0;

        if (productData) {
            // Ensure quantity is a valid number
            const validQuantity = Number(quantity) || 0; // Fallback to 0 if quantity is invalid
            totalAmount = validQuantity * (productData.giaBan || 0); // Fallback to 0 if price is invalid
            sanPhamDTOs.push({
                Idpk: productData.id,
                tenphukien: productData.tenSanPham,
                soluong: validQuantity,
                hinhanh: productData.hinhAnhSanPhams?.$values?.[0]?.linkAnh || '',
                mausac: selectedColor,
            });
        } else if (cartProducts.length > 0) {
            // Tính toán tổng tiền nếu có nhiều sản phẩm trong giỏ hàng
            sanPhamDTOs = cartProducts.map(product => {
                const productAmount = (product.gia || 0) * (product.soLuong || 0); // Calculate amount safely
                totalAmount += productAmount; // Accumulate total amount
                return {
                    Idpk: product.idSanPham,
                    tenphukien: product.tenSanPham,
                    soluong: product.soLuong || 0, // Ensure quantity is valid
                    hinhanh: product.hinhAnh || '',
                    mausac: product.mausac,
                };
            });
        }


        try {
            // Kiểm tra các trường bắt buộc
            if (!formData.tenNguoiDat || !formData.sdt || !formData.diachi || !formData.hinhThucTT) {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Vui lòng điền đầy đủ thông tin bắt buộc (Tên người đặt, Số điện thoại, Địa chỉ và Hình thức thanh toán)",
                    icon: "error"
                });
                return;
            }
            if (!formdiachi.detailAddress || formdiachi.detailAddress === '') {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Vui lòng điền đầy đủ thông tin bắt buộc (Địa chỉ chi tiết)",
                    icon: "error"
                });
                return;
            }
            // Kiểm tra danh sách sản phẩm
            if (!sanPhamDTOs || sanPhamDTOs.length === 0) {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Không có sản phẩm nào trong đơn hàng",
                    icon: "error"
                });
                return;
            }

            const orderData = {
                SanPhams: sanPhamDTOs,
                TenNguoiDat: formData.tenNguoiDat.trim(),
                Sdt: formData.sdt.trim(),
                DiaChi: formData.diachi.trim(),
                GhiChu: formData.ghiChu?.trim() || '',
                HinhThucTT: formData.hinhThucTT,
                TenTaiKhoan: formData.tenTaiKhoan || tenTK,
                phiShip: formData.phiShip || 0,
                voucherId: formData.voucherId || ''
            };
            console.log("Phi ship:", formData.phiShip);
            console.log("dữ liệu gửi", formData);
            if (formData.hinhThucTT === 'MOMO') {
                const response = await fetch("http://localhost:3000/payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: (totalAmount-discountAmount||0) + phiShip, // Use the calculated total amount
                        orderId: new Date().getTime(),
                        orderInfo: `Thanh toán cho đơn hàng ${orderData.SanPhams.map(
                            (sp) => sp.tenphukien
                        ).join(", ")}, Phí ship: ${orderData.phiShip.toLocaleString()} VND`,
                        returnUrl: window.location.href,
                        ...orderData,
                    }),
                });

                const responseData = await response.json();


                if (responseData.resultCode === 0) {
                    window.location.href = responseData.payUrl;
                } else {
                    alert("Có lỗi xảy ra với giao dịch thanh toán.");
                }
            }
            else if (formData.hinhThucTT === 'Shipcode') {
                try {
                    const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/Dathang/Dathanguser', {
                        sanPhamDTOs,
                        ...formData
                    });

                    // Check the response from the API
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Thành công!",
                            text: "Đặt hàng thành công!",
                            icon: "success"
                        });
                        setTimeout(() => {

                            navigate('/', { replace: true, state: null }); // Điều hướng về trang chủ
                        }, 1500);
                    } else {
                        throw new Error("Phản hồi không thành công từ API");
                    }
                } catch (error) {
                    Swal.fire({

                        title: "Lỗi!",
                        text: "Có lỗi xảy ra khi đặt hàng",
                        icon: "error"
                    });
                    // console.log("sanPhamDTOs:", sanPhamDTOs);
                    // console.log("formData:", formData);
                    console.error("Chi tiết lỗi:", error);
                    console.log("voucher", formData.voucherId)
                }
            }
            else if (formData.hinhThucTT === 'VNPAY') {
                try {

                    const data = dataDatHangVnpay();

                    const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/Dathang/vnpay', data);

                    window.location.href = `${response.data}`
                }
                catch (error) {
                    console.log(error);
                }
            }

        } catch (error) {
            console.error("Lỗi:", error);
            Swal.fire({
                title: "Lỗi!",
                text: "Có lỗi xảy ra khi xử lý đơn hàng",
                icon: "error"
            });
        }
    };

    const generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    const dataDatHangVnpay = () => {
        let sanPhamDTOs = [];
        let totalAmount = 0;

        if (productData) {
            const validQuantity = Number(quantity) || 0; // Fallback to 0 if quantity is invalid
            totalAmount = validQuantity * (productData.giaBan || 0); // Fallback to 0 if price is invalid
            sanPhamDTOs.push({
                Idpk: productData.id,
                tenphukien: productData.tenSanPham,
                soluong: validQuantity,
                hinhanh: productData.hinhAnhSanPhams?.$values?.[0]?.linkAnh || '',
                mausac: selectedColor,
            });
        } else if (cartProducts.length > 0) {
            // Tính toán tổng tiền nếu có nhiều sản phẩm trong giỏ hàng
            sanPhamDTOs = cartProducts.map(product => {
                const productAmount = (product.gia || 0) * (product.soLuong || 0); // Calculate amount safely
                totalAmount += productAmount; // Accumulate total amount
                return {
                    Idpk: product.idSanPham,
                    tenphukien: product.tenSanPham,
                    soluong: product.soLuong || 0, // Ensure quantity is valid
                    hinhanh: product.hinhAnh || '',
                    mausac: product.mausac,
                };
            });
        }

        const request = {
            sanPhamDTOs: sanPhamDTOs,
            TenNguoiDat: formData.tenNguoiDat.trim(),
            Sdt: formData.sdt.trim(),
            DiaChi: formData.diachi.trim(),
            GhiChu: formData.ghiChu?.trim() || '',
            HinhThucTT: formData.hinhThucTT,
            TenTaiKhoan: formData.tenTaiKhoan || tenTK,
            phiShip: formData.phiShip || 0,
            voucherId: formData.voucherId || ''
        }
        console.log(request);
        return request;

    }


    // Gọi API để lấy danh sách tỉnh/thành khi form được tải
    const getProvinces = async () => {
        try {
            const response = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                { headers }
            );
            // Xử lý dữ liệu từ GHN API

            setProvinces(Array.isArray(response.data.data) ? response.data.data : []);

        } catch (error) {
            console.error('Error fetching provinces:', error);
            setProvinces([]);
        }
    };

    const getDistricts = async (provinceId) => {
        try {
            const response = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                {
                    params: {
                        province_id: provinceId
                    },
                    headers: headers
                }
            );

            // Lọc dữ liệu và loại bỏ quận có tên là 'quận đặc biệt'
            const filteredDistricts = Array.isArray(response.data.data)
                ? response.data.data.filter(district => district.DistrictName !== 'Quận Đặc Biệt')
                : [];

            // Cập nhật districts với mảng đã lọc
            setDistricts(filteredDistricts);

        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        }
    };


    const getWard = async (districtId) => {
        try {
            const response = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
                {
                    headers: headers
                }
            );
            // Xử lý dữ liệu từ GHN API
            setWards(Array.isArray(response.data.data) ? response.data.data : []);
            if (wards.length > 0) {

            }
            else {

                getPhiGiaoHang();
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
            setProvinces([]);
        }

    };

    const getPhiGiaoHang = async () => {

        let item = [{
            "name": "TEST1",
            "quantity": 1,
            "weight": 10
        }, {
            "name": "TEST2",
            "quantity": 3,
            "weight": 10
        }]

        try {
            const response = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                {
                    "service_type_id": 5,
                    "from_district_id": 1552,
                    "to_district_id": Number(formdiachi.district),
                    "to_ward_code": formdiachi.ward,
                    "weight": 30,
                    "items": item
                },
                // Headers nên được đặt trong config object
                {
                    headers: headers
                }
            );


            // console.log("response", response);
            if (response.data.data.total >= 100000 && response.data.data.total <= 200000) {
                response.data.data.total = response.data.data.total - 50000;
                setPhiShip(response.data.data.total);
            }
            if (response.data.data.total >= 200000) {
                response.data.data.total = response.data.data.total - 100000;
                setPhiShip(response.data.data.total);
            }
            setPhiShip(response.data.data.total);
            setFormData(prevState => ({
                ...prevState,
                phiShip: response.data.data.total
            }));
        }
        catch (error) {
            console.error('Error fetching provinces:', error);
        }



    }
    //#endregion

    // Gọi API để lấy danh sách tỉnh/thành khi form được tải
    useEffect(() => {

        getProvinces();


    }, []);

    // Gọi API để lấy danh sách quận/huyện khi người dùng chọn tỉnh/thành
    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setFormdiachi({ ...formdiachi, province: selectedProvince, district: '', ward: '' });
        getDistricts(selectedProvince);
        // console.log(formdiachi.district);
    };

    // Gọi API để lấy danh sách phường/xã khi người dùng chọn quận/huyện
    const handleDistrictChange = (e) => {

        const selectedDistrict = e.target.value;

        setFormdiachi({ ...formdiachi, district: selectedDistrict, ward: '' });

        getWard(selectedDistrict);
        // console.log(formdiachi.district);
    };

    // Cập nhật địa chỉ đầy đủ mỗi khi tỉnh/thành, quận/huyện, phường/xã hoặc địa chỉ chi tiết thay đổi
    const updateFullAddress = (updatedData) => {
        try {
            // Tìm thông tin tỉnh/thành phố
            const selectedProvince = provinces.find(p => p.ProvinceID === Number(updatedData.province));
            const selectedDistrict = districts.find(d => d.DistrictID === Number(updatedData.district));
            const selectedWard = wards.find(w => w.WardCode === String(updatedData.ward));

            // Kiểm tra nếu tỉnh thay đổi, xóa dữ liệu huyện, xã, địa chỉ chi tiết và đặt phí ship về 0
            const previousProvince = formdiachi.province;
            if (previousProvince !== updatedData.province) {
                setFormdiachi({
                    ...updatedData,
                    district: '', // Xóa dữ liệu huyện
                    ward: '',     // Xóa dữ liệu xã
                    detailAddress: '', // Xóa dữ liệu địa chỉ chi tiết
                    diachi: ''    // Xóa địa chỉ đầy đủ
                });
                setPhiShip(0);
                return; // Thoát sớm nếu tỉnh thay đổi
            }

            // Kiểm tra nếu huyện thay đổi, xóa dữ liệu xã và địa chỉ chi tiết, phí ship về 0
            const previousDistrict = formdiachi.district;
            if (previousDistrict !== updatedData.district) {
                setFormdiachi({
                    ...updatedData,
                    ward: '',         // Xóa dữ liệu xã
                    detailAddress: '', // Xóa dữ liệu địa chỉ chi tiết
                    diachi: ''         // Xóa địa chỉ đầy đủ
                });
                setPhiShip(0);
                return;
            }

            // Kiểm tra nếu xã thay đổi, chỉ xóa địa chỉ chi tiết
            const previousWard = formdiachi.ward;
            if (previousWard !== updatedData.ward) {
                setFormdiachi({
                    ...updatedData,
                    detailAddress: '', // Xóa dữ liệu địa chỉ chi tiết
                    diachi: ''         // Xóa địa chỉ đầy đủ
                });
                setPhiShip(0);
                return;
            }

            // Kiểm tra nếu không có xã nhưng có địa chỉ chi tiết, đặt phí ship là 100000
            if (selectedProvince && selectedDistrict && updatedData.detailAddress && !selectedWard) {
                setPhiShip(100000); // Cập nhật phí ship là 100000 khi thiếu phường/xã
            } else if (!selectedProvince || !selectedDistrict || !selectedWard) {
                setFormdiachi({ ...updatedData, diachi: '' });
                setPhiShip(0);
                return;
            }

            // Tạo địa chỉ đầy đủ
            const fullAddress = [
                updatedData.detailAddress,
                selectedWard.WardName,
                selectedDistrict.DistrictName,
                selectedProvince.ProvinceName
            ].filter(Boolean).join(', ');

            // Cập nhật địa chỉ vào state
            setFormdiachi({ ...updatedData, diachi: fullAddress });
            setFormData({ ...formData, diachi: fullAddress });

            // Kiểm tra địa chỉ hợp lệ và cập nhật phí giao hàng
            if (updatedData.detailAddress && fullAddress) {
                getPhiGiaoHang();
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
            setFormdiachi({ ...updatedData, diachi: '' });
        }
    };







    // Cập nhật khi thay đổi tỉnh/thành, quận/huyện, phường/xã, hoặc địa chỉ chi tiết
    const handleChangediachi = (e) => {

        const { name, value } = e.target;

        const updatedData = { ...formdiachi, [name]: value };

        updateFullAddress(updatedData);
    };
    const ProductTable = ({ productData, cartProducts, quantity, selectedColor }) => {
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 3;

        // Tính số trang cần thiết dựa trên số sản phẩm và số sản phẩm trên mỗi trang
        const totalPages = Math.ceil(cartProducts.length / itemsPerPage);

        // Tính các sản phẩm sẽ được hiển thị trên trang hiện tại
        const currentProducts = cartProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        // Chuyển sang trang trước đó
        const handlePreviousPage = () => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
        };

        // Chuyển sang trang tiếp theo
        const handleNextPage = () => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        };


    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = cartProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm chuyển trang
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(cartProducts.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };



    return (
        <div>

            {/* ##### Header Area End ##### */}
            {/* ##### Right Side Cart Area ##### */}

            <section className="section" id="thanhToan" style={{ paddingTop: 20 }}>
                <div className="container">
                    <div className="thanhToan">
                        <div className="left">
                            <h2 className="section-title">Thông tin người mua</h2>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="tenNguoiNhan">Tên người nhận:</label>
                                    <input
                                        type="text"
                                        id="tenNguoiDat"
                                        name="tenNguoiDat"
                                        className="form-control"
                                        value={formData.tenNguoiDat}
                                        required
                                        onChange={handleChange}
                                        onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập tên người nhận')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="d-flex">
                                        <select
                                            id="province"
                                            name="province"
                                            className="form-control"
                                            value={formdiachi.province}
                                            onChange={(e) => { handleProvinceChange(e); handleChangediachi(e); }}
                                            required
                                            style={{ fontSize: '12px', marginRight: '10px' }}
                                        >
                                            <option value="">Chọn Tỉnh/TP</option>
                                            {provinces.map((province) => (
                                                <option key={province.ProvinceID} value={province.ProvinceID}>
                                                    {province.NameExtension[1]}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            id="district"
                                            name="district"
                                            className="form-control"
                                            value={formdiachi.district}
                                            onChange={(e) => { handleDistrictChange(e); handleChangediachi(e); }}
                                            required
                                            style={{ fontSize: '12px', marginRight: '10px' }}
                                        >
                                            <option value="">Chọn Quận/Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.DistrictID} value={district.DistrictID}>
                                                    {district.DistrictName}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className="form-control"
                                            id="ward"
                                            name="ward"
                                            value={formdiachi.ward}
                                            onChange={handleChangediachi}
                                            required
                                            style={{ fontSize: '12px' }}
                                        >
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.WardCode} value={ward.WardCode}>
                                                    {ward.WardName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="detailAddress">Địa chỉ chi tiết:</label>
                                    <input
                                        type="text"
                                        id="detailAddress"
                                        name="detailAddress"
                                        className="form-control"
                                        value={formdiachi.detailAddress}
                                        required
                                        onChange={handleChangediachi}
                                        onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập địa chỉ')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="soDienThoai">Số điện thoại:</label>
                                    <input
                                        type="text"
                                        id="sdt"
                                        name="sdt"
                                        className="form-control"
                                        value={formData.sdt}
                                        required
                                        pattern="[0-9]{10}"
                                        onChange={handleChange}
                                        onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập số điện thoại hợp lệ (10 số)')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ghiChu">Ghi chú:</label>
                                    <textarea
                                        id="ghiChu"
                                        name="ghiChu"
                                        className="form-control"
                                        value={formData.ghiChu}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="voucher">Mã voucher giảm giá:</label>
                                    <div className="d-flex">
                                        <select
                                            id="voucher"
                                            name="voucher"
                                            className="form-control mr-2"
                                            value={formData.voucherid}
                                            onChange={handleChange}


                                        >
                                            <option value="">Chọn voucher</option>
                                            {vouchers
                                                .filter(voucher => calculateTotalAmount() >= voucher.min_Order_Value)
                                                .map((voucher) => (
                                                    <option key={voucher.id} value={voucher.id}>
                                                        {voucher.name} - {voucher.discountType === 'percent'
                                                            ? `Giảm ${voucher.discount}% (tối đa ${voucher.max_Discount.toLocaleString()} VND)`
                                                            : `Giảm ${voucher.discount.toLocaleString()} VND`}
                                                    </option>
                                                ))}
                                        </select>
                                        {/* <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleApplyVoucher}
                                            disabled={!checkvoucher}
                                        >
                                            Áp dụng
                                        </button> */}
                                    </div>
                                    {vouchers.length > 0 && calculateTotalAmount() < Math.min(...vouchers.map(v => v.min_Order_Value)) && (
                                        <small className="text-muted">
                                            Đơn hàng cần tối thiểu {Math.min(...vouchers.map(v => v.min_Order_Value)).toLocaleString()} VND để sử dụng voucher
                                        </small>
                                    )}
                                </div>
                                <div className="">
                                    <label htmlFor="paymentMethod" className='font-bold'>Chọn phương thức thanh toán:</label>
                                    <div className="payment-options">
                                        {/* <div className="form-check">
                                            <input
                                                type="radio"
                                                id="vnpay"
                                                name="hinhThucTT"
                                                value="VNPAY"
                                                className="form-check-input"
                                                checked={formData.hinhThucTT === 'VNPAY'}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="vnpay" className="form-check-label">Thanh toán VNPAY</label>
                                        </div> */}
                                        <div className="form-check">
                                            <label htmlFor="momo" className="form-check-label font-bold">Thanh toán Momo</label>
                                            <input
                                                type="radio"
                                                id="momo"
                                                name="hinhThucTT"
                                                value="MOMO"
                                                className="form-check-input border-2 "
                                                checked={formData.hinhThucTT === 'MOMO'}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    console.log(formData);
                                                }}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </div>
                                        <div className="form-check">
                                            <label htmlFor="cod" className="form-check-label font-bold">VNPAY</label>
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="hinhThucTT"
                                                value="VNPAY"
                                                className="form-check-input "
                                                checked={formData.hinhThucTT === 'VNPAY'}
                                                onChange={handleChange}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </div>
                                        <div className="form-check">
                                            <label htmlFor="cod" className="form-check-label font-bold">Shipcode</label>
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="hinhThucTT"
                                                value="Shipcode"
                                                className="form-check-input "
                                                checked={formData.hinhThucTT === 'Shipcode'}
                                                onChange={handleChange}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="right">
                            <h2 className="section-title">Danh sách sản phẩm</h2>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Sản Phẩm</th>
                                        <th>Hình Ảnh</th>
                                        <th>Số Lượng</th>
                                        <th>Màu sắc</th>
                                        <th>Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productData ? (
                                        <tr>
                                            <td>{productData?.tenSanPham}</td>
                                            <td>
                                                {productData?.hinhAnhSanPhams?.$values?.[0]?.linkAnh ? (
                                                    <img
                                                        src={productData.hinhAnhSanPhams.$values[0].linkAnh}
                                                        alt={productData.tenSanPham}
                                                        style={{ width: '100px' }}
                                                    />
                                                ) : (
                                                    <span>Không có hình ảnh</span>
                                                )}
                                            </td>
                                            <td>{quantity}</td>
                                            <td>{selectedColor}</td>
                                            <td>{((productData?.giaBan || 0) * quantity).toLocaleString()} VND</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                        </tr>
                                    )}

                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product.tenSanPham}</td>
                                                <td>
                                                    {product.hinhAnh ? (
                                                        <img
                                                            src={product.hinhAnh}
                                                            alt={product.tenSanPham}
                                                            style={{ width: '100px' }}
                                                        />
                                                    ) : (
                                                        <span>Không có hình ảnh</span>
                                                    )}
                                                </td>
                                                <td>{product.soLuong}</td>
                                                <td>{product.mausac}</td>
                                                <td>{(product.gia * product.soLuong).toLocaleString()} VND</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        </tr>
                                    )}
                                </tbody>
                                {currentProducts.length > 0 ? (
                                    <tfoot>
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                    Trang trước
                                                </button>
                                                <span style={{ margin: '0 10px' }}>Trang {currentPage} / {Math.ceil(cartProducts.length / itemsPerPage)}</span>
                                                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(cartProducts.length / itemsPerPage)}>
                                                    Trang sau
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                ) : null}
                            </table>
                            <div className="total" style={{ display: 'flex', flexDirection: 'column' }}>
                                {productData && (
                                    <>
                                        <p>Tổng tiền: {(productData.giaBan * quantity).toLocaleString()} VND</p>
                                        <p>Tổng tiền được giảm:{(discountAmount).toLocaleString()} VND</p>
                                        <p>Phí giao hàng: {phiShip.toLocaleString('vi-VN')} VNĐ</p>
                                        <p>
                                            Tổng thanh toán:
                                            {(
                                                (productData.giaBan * quantity - (discountAmount || 0)) + phiShip
                                            ).toLocaleString()} VND
                                        </p>

                                    </>
                                )}
                                {cartProducts.length > 0 && (
                                    <>
                                        <p>Tổng tiền: {cartProducts.reduce((total, product) => total + (product.gia * product.soLuong), 0).toLocaleString()} VND</p>
                                        <p>Tổng tiền được giảm:{(discountAmount).toLocaleString()} VND</p>
                                        <p>Phí giao hàng: {phiShip.toLocaleString('vi-VN')} VNĐ</p>
                                        <p>Tổng thanh toán: {(cartProducts.reduce((total, product) => total + (product.gia * product.soLuong), - (discountAmount || 0), 0) + phiShip).toLocaleString()} VND</p>
                                    </>
                                )}
                            </div>
                            <button onClick={handleOrderConfirmation} className="btn-confirm-order">Xác nhận đặt hàng</button>
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

export default Thanhtoan;