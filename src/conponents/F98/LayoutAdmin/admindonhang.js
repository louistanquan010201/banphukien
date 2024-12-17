import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { Table, Button, Form, Tabs, Tab, Modal, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './donhang.css'
const DonHangComponent = () => {
    const [donHang, setDonHang] = useState([]);
    const [chiTietDH, setChiTietDH] = useState([]);
    const [selectedHD, setSelectedHD] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showbackmodal, setShowbackModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTrangThai, setActiveTrangThai] = useState("Chưa duyệt");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [phiShip, setPhiShip] = useState(0)
    const navigate = useNavigate();
    const [lydoHoantra, setLydoHoantra] = useState("");
    const [hinhanh, setHinhanh] = useState([]);
    const [video, setVideo] = useState(null);
    const [showModalhoantra, setShowModalhoantra] = useState(false);
    const [returnDetails, setReturnDetails] = useState(null);
    const loaitk = sessionStorage.getItem("loaitk")
    const [tiendonhang, setTiendonhang] = useState(0);
    const [tienship, setTienship] = useState(0);
    const [tiengiam, settiengiam] = useState(0);
    const headers = {
        // Thêm các header cần thiết nếu có
        'Token': '16db96ff-456b-11ef-a6bf-6ae11fb09515', // Thay thế bằng token của bạn
    };
    const tentk = sessionStorage.getItem('tenTK');
    const [diachisua, setdiachisua] = useState({
        tinh: '',
        tinhname: '',
        huyen: '',
        huyenname: '',
        xa: '',
        xaname: '',
        diachict: '',
        phiShip: 0,
    })
    const [idhoantra, setidhoantra] = useState({
        idHD: 0
    })
    const [lydohuy, setLydohuy] = useState({
        iddh: '',
        lydohuyct: '',
    });
    const handleChange = (key, value) => {
        setLydohuy((prevData) => ({
            ...prevData,
            [key]: value,
        }));
        console.log("id", lydohuy.iddh)
        console.log("lydohuy", lydohuy.lydohuy)
        console.log("lydohuyct", lydohuy.lydohuyct)
    };
    const [diachibandau, setdiachibandau] = useState({
        idHD: '',
        tenNguoiNhan: '',
        sdt: '',
        ghiChu: '',
        phiShip: 0,
        diachibd: '',
    })
    const [editData, setEditData] = useState({
        idHD: '',
        tenNguoiNhan: '',
        sdt: '',
        ghiChu: '',
        dichi: '',
        phiShip: 0,
    });

    const [formdiachi, setFormdiachi] = useState({
        diachi: '', // Biến duy nhất để lưu địa chỉ đầy đủ
        province: '',
        district: '',
        ward: '',
        detailAddress: '' // Địa chỉ chi tiết nhập từ input
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {

        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
        const loadDonHang = async (trangThai) => {
            try {
                const response = await axios.post(
                    `https://naton69587-001-site1.mtempurl.com/api/DonHang/Laydshoadon`,
                    {
                        TT: trangThai,
                        tentk: tentk
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    setDonHang(response.data.$values);
                } else {
                    console.error('Không thể lấy danh sách đơn hàng, mã trạng thái:', response.status);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách đơn hàng:', error);
            }
        };

        loadDonHang(activeTrangThai);
    }, [activeTrangThai]);

    const handleXemChiTiet = async (idHD) => {
        try {
            const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DonHang/Laychitiet?IDhd=${idHD}`);
            const tongTien = response.data.$values.reduce((total, item) => total + item.gia * item.sl, 0);
            console.log("Tổng tiền:", tongTien);
            const chiTietList = response.data.$values;
            console.log("chi tiết", chiTietList);
            const laydl = donHang.find(dh => dh.idHD === idHD);
            setTiendonhang(tongTien);
            settiengiam((tongTien + laydl.phiship) - laydl.tongtien || 0)
            setTienship(laydl.phiship)
            console.log("tiendonhang", tiendonhang)
            console.log("tienship", tienship)
            console.log("tiemgiam", tiengiam)
            console.log("laydl", laydl)

            setChiTietDH(chiTietList);
            setSelectedHD(idHD);
            setShowModal(true);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        }
    };

    const handleEditClick = async (dh) => {
        const diaChiParts = dh.diaChi.split(", ");
        const tinh = diaChiParts.pop();
        const huyen = diaChiParts.pop();
        const xa = diaChiParts.pop();
        const diaChiChiTiet = diaChiParts.join(", ");

        // console.log("Tỉnh:", tinh, " Huyện:", huyen, " Xã:", xa, " ĐCCT:", diaChiChiTiet);



        // Cập nhật dữ liệu vào state
        setEditData({
            idHD: dh.idHD,
            tenNguoiNhan: dh.tenNguoiNhan,
            sdt: dh.sdt,
            diaChi: dh.diaChi,
            tinh: tinh,
            huyen: huyen,
            xa: xa,
            ghiChu: dh.ghiChu,
            phiship: dh.phiship
        });
        setdiachibandau({
            idHD: dh.idHD,
            tenNguoiNhan: dh.tenNguoiNhan,
            sdt: dh.sdt,
            ghiChu: dh.ghiChu,
            phiship: dh.phiship,
            diachibd: dh.diaChi
        })


        // Hiển thị modal chỉnh sửa
        setShowEditModal(true);
    };
    const handleEditClickhuy = async (dh) => {

        lydohuy.iddh = dh;
        // Hiển thị modal chỉnh sửa
        setShowCancelModal(true);
    };

    const handleEditClickback = async (dh) => {
        // Gán dữ liệu vào setidhoantra
        setidhoantra({ idHD: dh.idHD });
        // Hiển thị modal chỉnh sửa

        setShowbackModal(true);
    };

    // Lấy danh sách tỉnh khi component được tải
    useEffect(() => {
        getProvinces();
    }, []);

    // Hàm gọi API lấy danh sách Tỉnh
    const getProvinces = async () => {
        try {
            const response = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                { headers }
            );
            setProvinces(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching provinces:', error);
            setProvinces([]);
        }
    };

    // Hàm gọi API lấy danh sách Huyện dựa trên provinceId
    const getDistricts = async (provinceId) => {
        try {
            const response = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                { params: { province_id: provinceId }, headers }
            );
            const filteredDistricts = Array.isArray(response.data.data)
                ? response.data.data.filter(district => district.DistrictName !== 'Quận Đặc Biệt')
                : [];
            setDistricts(filteredDistricts);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        }
    };

    // Hàm gọi API lấy danh sách Xã dựa trên districtId
    const getWard = async (districtId) => {
        try {
            const response = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
                { headers }
            );
            setWards(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
        }
    };

    // Xử lý thay đổi khi chọn Tỉnh
    const handleProvinceChange = async (e) => {
        const selectedProvinceId = e.target.value;
        setdiachisua((prev) => ({
            ...prev,
            tinh: selectedProvinceId,
            tinhname: provinces.find(p => p.ProvinceID === Number(selectedProvinceId))?.ProvinceName || '',
            huyen: '',
            huyenname: '',
            xa: '',
            xaname: '',
            diachict: '',
        }));

        // Reset các trường huyện, xã, và địa chỉ chi tiết
        setDistricts([]);
        setWards([]);
        await getDistricts(selectedProvinceId);
    };

    const handleDistrictChange = async (e) => {
        const selectedDistrictId = e.target.value;
        setdiachisua((prev) => ({
            ...prev,
            huyen: selectedDistrictId,
            huyenname: districts.find(d => d.DistrictID === Number(selectedDistrictId))?.DistrictName || '',
            xa: '',
            xaname: '',
            diachict: '',
        }));

        setWards([]);
        await getWard(selectedDistrictId);
    };

    const handleWardChange = async (e) => {
        const selectedWardId = e.target.value;
        setdiachisua((prev) => ({
            ...prev,
            xa: selectedWardId,
            xaname: wards.find(w => w.WardCode === selectedWardId)?.WardName || '', diachict: '',
        }));
    };

    const handleDetailAddressChange = (e) => {
        const detailAddress = e.target.value;
        setdiachisua((prev) => ({
            ...prev,
            diachict: detailAddress,
        }));
        setEditData((prev) => ({
            ...prev,
            dichi: `${diachisua.tinhname}, ${diachisua.huyenname}, ${diachisua.xaname}, ${detailAddress}`, // Cộng địa chỉ chi tiết với tỉnh, huyện, xã
        }));
        getPhiGiaoHang();
    };
    useEffect(() => {
        // Gọi hàm khi có sự thay đổi về địa chỉ
        // console.log("Địa chỉ đã thay đổi:", diachisua);

        // Lưu vào sessionStorage mỗi khi diachisua thay đổi
        sessionStorage.setItem("diachisua", JSON.stringify(diachisua));

    }, [diachisua]);



    const updatelaidichisua = () => {
        const selectedProvince = provinces.find(p => p.ProvinceID === Number(diachisua.tinh));
        const selectedDistrict = districts.find(p => p.DistrictID === Number(diachisua.huyen));
        const selectedWard = wards.find(p => p.WardCode === String(diachisua.xa));

        // Đảm bảo kiểm tra dữ liệu tồn tại trước khi sử dụng
        const provinceName = selectedProvince ? selectedProvince.ProvinceName : '';
        const districtName = selectedDistrict ? selectedDistrict.DistrictName : '';
        const wardName = selectedWard ? selectedWard.WardName : '';

        setdiachisua({ tinhname: provinceName, huyenname: districtName, xaname: wardName, })
        // console.log("Địa chỉ đầy đủ:", `${diachisua.tinhname}, ${diachisua.huyenname}, ${diachisua.xaname}, ${diachisua.diaChiChiTiet}`);
        getPhiGiaoHang()
    };


    // Xử lý phí phip
    const getPhiGiaoHang = async () => {
        const item = [{
            "name": "TEST1",
            "quantity": 1,
            "weight": 10
        }, {
            "name": "TEST2",
            "quantity": 3,
            "weight": 10
        }];
        const savedDiaChi = sessionStorage.getItem("diachisua");
        const diachisuane = JSON.parse(savedDiaChi);
        try {
            const response = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                {
                    "service_type_id": 5,
                    "from_district_id": 1552,
                    "to_district_id": Number(diachisuane.huyen), // Đây có thể là giá trị từ `editData.huyen` hoặc trực tiếp từ địa chỉ đã chọn
                    "to_ward_code": diachisuane.xa, // Dùng giá trị từ `editData.xa`
                    "weight": 30,
                    "items": item
                },
                { headers: headers }
            );

            // console.log("response", response);

            let totalFee = response.data.data.total;

            if (totalFee >= 100000 && totalFee <= 200000) {
                totalFee -= 50000; // Giảm phí ship nếu tổng trong khoảng 100000 - 200000
            }
            if (totalFee >= 200000) {
                totalFee -= 100000; // Giảm phí ship nếu tổng >= 200000
            }

            setPhiShip(totalFee); // Cập nhật lại phí ship vào state
            setEditData(prevState => ({
                ...prevState,
                phiShip: totalFee // Cập nhật phí ship vào editData
            }));
            setdiachisua(prevState => ({
                ...prevState,
                phiShip: totalFee
            }));

        } catch (error) {
            console.error('Error fetching shipping fee:', error);

        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editData.tenNguoiNhan.trim()) newErrors.tenNguoiNhan = 'Tên người nhận không được để trống';
        if (!editData.sdt.trim()) newErrors.sdt = 'Số điện thoại không được để trống';
        if (!editData.diaChi.trim()) newErrors.diaChi = 'Địa chỉ không được để trống';
        return newErrors;
    };
    const validatePhoneNumber = (phoneNumber) => {
        // Biểu thức chính quy kiểm tra số điện thoại: bắt đầu bằng 0 và có đúng 10 chữ số
        const regex = /^0\d{9}$/;
        return regex.test(phoneNumber);
    };
    const handleSaveEdit = async () => {
        const newErrors = validateForm();
        const savedDiaChi = sessionStorage.getItem("diachisua");
        const diachisuane = JSON.parse(savedDiaChi);
        // console.log("không thay đổi địa chỉ", " idhd", editData.idHD, "tên", editData.tenNguoiNhan, "sdt", editData.sdt, "ghichu", editData.ghiChu, "diachi", diachibandau.diachibd, "phiship", editData.phiShip)

        // console.log("idhd", editData.idHD, "tên", editData.tenNguoiNhan, "sdt", editData.sdt, "ghichu", editData.ghiChu, "diachi", editData.dichi, "phiship", editData.phiShip)

        const regex = /^0\d{9}$/; // Biểu thức chính quy cho số điện thoại bắt đầu bằng 0 và có 10 chữ số
        if (!editData.tenNguoiNhan) {
            Swal.fire({
                title: "Lỗi",
                text: "Bạn phải nhập tên người nhận",
                icon: "error"
            });
            return;  // Dừng hàm nếu người dùng không nhập tên người nhận
        }
        // Kiểm tra nếu số điện thoại không hợp lệ
        if (!regex.test(editData.sdt)) {
            Swal.fire({
                title: "Lỗi",
                text: "Bạn phải nhập đúng kiểu số điện thoại (bắt đầu bằng 0 và có 10 chữ số)",
                icon: "error"
            });
            return;  // Dừng hàm nếu có lỗi về số điện thoại
        }



        // Kiểm tra nếu có thay đổi địa chỉ
        if (diachisuane.tinhname && diachisuane.huyenname && diachisuane.xaname && diachisuane.diachict && diachisuane.phiShip) {
            const dulieugui = {
                idHD: editData.idHD,
                tenNguoiDung: editData.tenNguoiNhan,
                sdt: editData.sdt,
                diaChi: editData.dichi,
                ghiChu: editData.ghiChu ?? "",
                phiShip: editData.phiShip ?? 0
            };

            try {
                const response = await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DonHang/update?tentk=${tentk}`, dulieugui);

                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Sửa địa chỉ thành công",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();  // Tải lại trang sau khi thành công
                    });
                } else {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Sửa địa chỉ không thành công",
                        icon: "error"
                    });
                    console.log(tentk)
                }
            } catch (error) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Có lỗi xảy ra khi gửi yêu cầu thay đổi địa chỉ !",
                    icon: "error"
                });
                console.error(error);
                console.log(tentk)
            }
        } else {
            const dulieugui = {
                idHD: editData.idHD,
                tenNguoiDung: editData.tenNguoiNhan,
                sdt: editData.sdt,
                diaChi: diachibandau.diachibd,
                ghiChu: editData.ghiChu ?? "",
                phiShip: editData.phiship ?? 0
            };
            if (
                dulieugui.tenNguoiDung === diachibandau.tenNguoiNhan &&
                dulieugui.sdt === diachibandau.sdt &&
                dulieugui.diaChi === diachibandau.diachibd &&
                dulieugui.ghiChu === diachibandau.ghiChu &&
                dulieugui.phiShip === diachibandau.phiship
            ) {
                Swal.fire({
                    title: "Thông báo",
                    text: "Không có thay đổi nào để cập nhật!",
                    icon: "info"
                });
                return;
            }
            try {
                const response = await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DonHang/update?tentk=${tentk}`, dulieugui);

                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Sửa địa chỉ thành công",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Sửa địa chỉ không thành công!",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Có lỗi xảy ra khi gửi yêu cầu khôn thay đổi đc!",
                    icon: "error"
                });
                console.error(error);
                // console.log("không thay đổi địa chỉ", " idhd", editData.idHD, "tên", editData.tenNguoiNhan, "sdt", editData.sdt, "ghichu", editData.ghiChu, "diachi", diachibandau.diachibd, "phiship", editData.phiship)
                // console.log("dữ liệu gửi đi", dulieugui)
            }
        }
    };
    // xử lý hoàn trả hàng 
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Chuyển đổi FileList thành mảng
        setHinhanh((prevImages) => [...prevImages, ...files]); // Thêm ảnh mới vào mảng
    };
    const handleRemoveImage = (index) => {
        setHinhanh((prevImages) => prevImages.filter((_, i) => i !== index)); // Loại bỏ ảnh tại index
    };

    const handleSubmit = async () => {
        const result = await Swal.fire({
            title: "Bạn có muốn trả hàng?",
            showDenyButton: true,
            confirmButtonText: "Trả hàng",
            denyButtonText: "Không trả",
        });

        if (result.isConfirmed) {
            if (!lydoHoantra || hinhanh.length === 0) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            const formData = new FormData();
            formData.append("lydohoantra", lydoHoantra);
            formData.append("idhd", idhoantra.idHD); // Thay bằng ID hóa đơn thực tế

            // Thêm hình ảnh vào FormData
            hinhanh.forEach((image) => {
                formData.append("hinhanh", image); // Dùng hinhanh để gửi các tệp hình ảnh
            });

            try {
                const response = await axios.post("https://naton69587-001-site1.mtempurl.com/api/DonHang/hoantra", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Trả hàng thành công",
                        icon: "success"
                    }).then(() => {
                        setShowbackModal(false);
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Có lỗi xảy ra khi trả hàng!");
            }
        }
    };



    const getChiTietDH = () => {
        return chiTietDH;
    };
    const handleDuyetDon = async (idHD) => {
        const result = await Swal.fire({
            title: "Bạn có muốn duyệt đơn hàng này ",
            showDenyButton: true,
            confirmButtonText: "Duyệt",
            denyButtonText: `Không duyệt`,
        });
        if (result.isConfirmed) {
            try {
                const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DonHang/duyetdon?IDhd=${idHD}&tentk=${tentk}`);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Đã duyệt !",
                        text: "Đơn hàng đã được duyệt",
                        icon: "success"
                    })
                        .then(() => {
                            window.location.reload();
                        });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Có lỗi xảy ra',
                    text: error.response.data,
                    icon: 'error'
                });
                console.log("id", idHD);
                console.log("tentk", tentk);
            }
        }

    };
    const handledatlai = async (idHD) => {
        const result = await Swal.fire({
            title: "Bạn có muốn đặt lại đơn hàng này?",
            showDenyButton: true,
            confirmButtonText: "Đặt",
            denyButtonText: `Không `,
        });
        if (result.isConfirmed) {


            try {
                const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DonHang/datlai?IDhd=${idHD}`);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Đã đặt !",
                        text: "Đơn hàng đã được đặt lại",
                        icon: "success"
                    })
                        .then(() => {
                            window.location.reload();
                        });
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            }
        }
    }
    const handleHuyDon = async (idHD) => {
        if (lydohuy.lydohuyct === "") {
            Swal.fire({
                title: "Lỗi",
                text: "Bạn phải nhập lý do hủy",
                icon: "error"
            })
            return
        }
        const result = await Swal.fire({
            title: "Bạn có muốn hủy đơn hàng này?",
            showDenyButton: true,
            confirmButtonText: "Không ",
            denyButtonText: ` Hủy`,
        });
        if (!result.isConfirmed) {

            const dulieugui = {
                idhd: lydohuy.iddh,
                tentk: tentk,
                lydohuy: lydohuy.lydohuyct,

            };
            try {
                const response = await axios.post(`https://naton69587-001-site1.mtempurl.com/api/DonHang/Huydon`, dulieugui);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Đã hủy !",
                        text: "Đơn hàng đã được hủy",
                        icon: "success"
                    })
                        .then(() => {
                            window.location.reload();
                        });
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            }
        }

    };
    // hoàn trả
    const handleViewDetails = async (idhd) => {
        try {
            // Tạo đối tượng FormData và thêm tham số vào đó
            const formData = new FormData();
            formData.append('idhd', idhd); // Thêm idhd vào FormData

            // Gửi yêu cầu POST với FormData
            const response = await axios.post('https://naton69587-001-site1.mtempurl.com/api/DonHang/laydlhoantra', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đảm bảo header Content-Type đúng
                },
            });

            // Kiểm tra phản hồi thành công
            if (response.status === 200) {
                setReturnDetails(response.data); // Lưu thông tin trả hàng vào state
                setShowModalhoantra(true); // Hiển thị modal
                console.log("dâta", response.data)
            }
        } catch (error) {
            console.error(error);
            alert("Không thể lấy dữ liệu hoàn trả!");
        }
    };


    const filterDonHang = (donHang, searchTerm) => {
        const searchValue = searchTerm.toLowerCase();
        return donHang.filter(dh => {
            const idHD = dh.idHD ? dh.idHD.toString() : "";
            const tenNguoiDat = dh.tenNguoiNhan ? dh.tenNguoiNhan.toLowerCase() : "";
            const diaChi = dh.diaChi ? dh.diaChi.toLowerCase() : "";
            const tongTien = dh.tongtien ? dh.tongtien.toString() : "";
            const ngayDat = dh.ngayDat ? new Date(dh.ngayDat).toLocaleDateString() : "";
            const ptThanhToan = dh.ptThanhToan ? dh.ptThanhToan.toLowerCase() : "";
            if (idHD !== "" && tongTien === "") {
                return (
                    idHD.includes(searchValue)
                )
            }
            return (
                idHD.includes(searchValue) ||
                tenNguoiDat.includes(searchValue) ||
                diaChi.includes(searchValue) ||
                tongTien.includes(searchValue) ||
                ngayDat.includes(searchValue) ||
                ptThanhToan.includes(searchValue)
            );
        });
    };

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10;
    const renderDonHangTable = (activeTrangThai) => {
        let filteredDH = donHang;
        if (searchTerm) {
            filteredDH = filterDonHang(donHang, searchTerm);
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredDH.slice(startIndex, endIndex);

        // Tổng số trang
        const totalPages = Math.ceil(filteredDH.length / itemsPerPage);

        return (
            <div className="table-container">
                <div className="pagination-donhang">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            variant={index + 1 === currentPage ? "primary" : "light"}
                            onClick={() => setCurrentPage(index + 1)}
                            className="pagination-button"
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
                <Table striped bordered hover>
                    <thead className="table-header-donhang">
                        <tr>
                            <th>Thông tin người nhận</th>
                            {activeTrangThai === "Đã hủy" ? (
                                <th>Ngày Hủy</th>
                            ) : activeTrangThai === "Đã duyệt" ? (
                                <th>Ngày Đặt</th>
                            ) : activeTrangThai === "Đang giao" ? (
                                <th>Ngày Giao</th>
                            ) : activeTrangThai === "Đã nhận" ? (
                                <th>Ngày Nhận</th>
                            ) : activeTrangThai === "Hoàn trả" ? (
                                <th>Ngày Trả</th>
                            ) : (
                                <th>Ngày Đặt</th>
                            )}
                            {activeTrangThai === "Đã hủy" && <th>Lý do</th>}
                            <th>Tổng Tiền</th>
                            <th>Phí Ship</th>
                            <th>Phương thức thanh toán</th>
                            <th>Thanh toán</th>
                            <th>Chức Năng</th>
                        </tr>
                    </thead>


                    <tbody className="tbody-donhang">
                        {paginatedData.map((dh) => (
                            <tr key={dh.idHD}>
                                <td className="" onClick={() => handleXemChiTiet(dh.idHD)}>
                                    <div>
                                        <strong>ID: {dh.idHD}</strong>
                                        <br />
                                        <strong>Tên: {dh.tenNguoiNhan}</strong>
                                        <br />
                                        SĐT: {dh.sdt}
                                        <br />
                                        Địa chỉ: {dh.diaChi}
                                        <br />
                                        Ghi chú: {dh.ghiChu}
                                    </div>
                                </td>
                                <td onClick={() => handleXemChiTiet(dh.idHD)}>
                                    {new Date(
                                        activeTrangThai === "Đã hủy"
                                            ? dh.ngayHuy
                                            : activeTrangThai === "Đã duyệt"
                                                ? dh.ngayDat
                                                : activeTrangThai === "Đang giao"
                                                    ? dh.ngayGiao
                                                    : activeTrangThai === "Đã nhận"
                                                        ? dh.ngayNhan
                                                        : dh.ngayDat
                                    ).toLocaleDateString()}
                                </td >
                                {activeTrangThai === "Đã hủy" && <td>{dh.lydohuy}</td>}
                                <td onClick={() => handleXemChiTiet(dh.idHD)}>{dh.tongtien.toLocaleString()} VND</td>
                                <td onClick={() => handleXemChiTiet(dh.idHD)}>{dh.phiship.toLocaleString()} VND</td>
                                <td onClick={() => handleXemChiTiet(dh.idHD)}>{dh.ptThanhToan}</td>
                                <td onClick={() => handleXemChiTiet(dh.idHD)}>{dh.ttThanhToan}</td>
                                <td >
                                    <Dropdown className="dropdown-donhang">
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                            <i className="bi bi-wrench"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {loaitk === "1" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEditClick(dh)}
                                                    >
                                                        Sửa
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Hoàn trả" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-details"
                                                        onClick={() => handleViewDetails(dh.idHD)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Đã nhận" && loaitk === "1" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-return"
                                                        onClick={() => handleEditClickback(dh)}
                                                    >
                                                        Hoàn trả
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Đã hủy" && loaitk === "1" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-reorder"
                                                        onClick={() => handledatlai(dh.idHD)}
                                                    >
                                                        Đặt lại
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai !== "Đã nhận" && activeTrangThai !== "Đã hủy" && loaitk === "1" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-cancel"
                                                        onClick={() => handleEditClickhuy(dh.idHD)}
                                                    >
                                                        Hủy
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Chưa duyệt" && activeTrangThai !== "Đã nhận" && activeTrangThai !== "Đã hủy" && activeTrangThai !== "Hoàn trả" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleDuyetDon(dh.idHD)}
                                                    >
                                                        Duyệt
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Đã duyệt" && activeTrangThai !== "Đã nhận" && activeTrangThai !== "Đã hủy" && activeTrangThai !== "Hoàn trả" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleDuyetDon(dh.idHD)}
                                                    >
                                                        Giao
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                            {activeTrangThai === "Đang giao" && activeTrangThai !== "Đã nhận" && activeTrangThai !== "Đã hủy" && activeTrangThai !== "Hoàn trả" && (
                                                <Dropdown.Item>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleDuyetDon(dh.idHD)}
                                                    >
                                                        Đã nhận
                                                    </button>
                                                </Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

        );
    };


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Danh Sách Đơn Hàng</h2>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm theo ID, địa chỉ, tổng tiền hoặc ngày đặt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>

            <Tabs
                defaultActiveKey="Chưa duyệt"
                activeKey={activeTrangThai}
                onSelect={(trangThai) => setActiveTrangThai(trangThai)}
                className="mb-3 custom-tabs-addonhang" // Thêm class mới
            >
                {["Chưa duyệt", "Đã duyệt", "Đang giao", "Đã nhận", "Đã hủy", "Hoàn trả"].map(
                    (trangThai, index) => (
                        <Tab eventKey={trangThai} title={trangThai} key={index}>
                            {renderDonHangTable(trangThai)}
                        </Tab>
                    )
                )}
            </Tabs>


            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Đơn Hàng #{selectedHD}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Đơn Giá</th>
                                <th>Thành Tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getChiTietDH().map((ct, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={`/${ct.hinhAnh}`} alt={ct.tenSP} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            <div>
                                                <div>{ct.tenSP}</div>
                                                <small className="text-muted">Màu: {ct.mauSac}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{ct.sl}</td>
                                    <td>{ct.gia.toLocaleString()} VNĐ</td>
                                    <td>{(ct.sl * ct.gia).toLocaleString()} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>Tạm tính: {(tiendonhang).toLocaleString()} VNĐ</div>
                        <div style={{ fontWeight: 'bold' }}>Giảm giá: - {(tiengiam).toLocaleString()} VNĐ</div>
                        <div style={{ fontWeight: 'bold' }}>Phí ship: {tienship.toLocaleString()} VNĐ</div>
                        <div style={{ fontWeight: 'bold' }}>Tổng thanh toán: {(tiendonhang + tienship - tiengiam).toLocaleString()} VNĐ</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{ width: '1800px' }} backdrop="static">
                <Modal.Header >
                    <Modal.Title>Sửa Thông Tin Đơn Hàng #{editData.idHD}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên người nhận</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.tenNguoiNhan}
                                onChange={(e) => setEditData({ ...editData, tenNguoiNhan: e.target.value })}
                                isInvalid={!!errors.tenNguoiNhan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.tenNguoiNhan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.sdt}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\D/g, '').substring(0, 10);
                                    setEditData({ ...editData, sdt: newValue });
                                }}
                                isInvalid={!!errors.sdt}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.sdt}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            {editData.isEditingAddress ? (
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Control as="select" value={diachisua.tinh} onChange={handleProvinceChange} className="mb-3" isInvalid={!!errors.tinh}>
                                                <option value="">Chọn tỉnh</option>
                                                {provinces.map((province) => (
                                                    <option key={province.ProvinceID} value={province.ProvinceID}>
                                                        {province.ProvinceName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tinh}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control as="select" value={diachisua.huyen} onChange={handleDistrictChange} disabled={false} className="mb-3" isInvalid={!!errors.huyen}>
                                                <option value="">Chọn Huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.DistrictID} value={district.DistrictID}>
                                                        {district.DistrictName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.huyen}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control as="select" value={diachisua.xa} onChange={handleWardChange} className="mb-3" isInvalid={!!errors.xa}>
                                                <option value="">Chọn Xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.WardCode} value={ward.WardCode}>
                                                        {ward.WardName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.xa}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Form.Label>Địa chỉ chi tiết</Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={diachisua.diachict}
                                        onChange={handleDetailAddressChange} // Sử dụng hàm handleDetailAddressChange ở đây
                                        isInvalid={!!errors.diachict}
                                    />

                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            setEditData({
                                                ...editData,
                                                diaChi: `${editData.diaChi}`,
                                                isEditingAddress: false
                                            });
                                            setdiachisua({ phiShip: 0 });
                                            setdiachisua({ tinh: '', huyen: '', xa: '', phiShip: 0 });

                                            // Xóa dữ liệu khỏi localStorage khi người dùng hoàn tác
                                            sessionStorage.removeItem("diachisua"); // Xóa dữ liệu khỏi sessionStorage nếu cần

                                            // console.log("editta", editData);
                                            // console.log("diachisua", diachisua);
                                        }}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Hoàn tác
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Form.Control
                                        type="text"
                                        defaultValue={editData.diaChi}
                                        disabled
                                    />
                                    <Button style={{ marginTop: "10px" }} variant="primary" onClick={() => setEditData({ ...editData, isEditingAddress: true })}>
                                        Sửa
                                    </Button>
                                </>
                            )}
                        </Form.Group>
                        {editData.isEditingAddress && (
                            <Form.Group className="mb-3">
                                <Form.Label>Phí ship mới</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={diachisua.phiShip}
                                    onChange={(e) => setEditData({ ...editData, phiShip: e.target.value })}
                                    isInvalid={!!errors.phiShip}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phiShip}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}
                        {!editData.isEditingAddress && (
                            <Form.Group className="mb-3">
                                <Form.Label>Phí ship</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editData.phiship}
                                    onChange={(e) => setEditData({ ...editData, phiShip: e.target.value })}
                                    isInvalid={!!errors.phiShip}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phiShip}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editData.ghiChu}
                                onChange={(e) => setEditData({ ...editData, ghiChu: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowEditModal(false);
                            // Xóa dữ liệu khỏi localStorage khi người dùng hủy
                            sessionStorage.removeItem("diachisua");
                            setdiachisua({ tinh: '', huyen: '', xa: '', phiShip: 0 }); // Nếu bạn muốn xóa dữ liệu khỏi sessionStorage
                        }}
                    >
                        Hủy
                    </Button>

                    <Button variant="primary" onClick={handleSaveEdit}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* model Lý do hủy */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Lý do hủy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form style={{ width: '100%', height: '100%' }}>


                        <Form.Group className="mb-3">
                            <Form.Label>Lý do hủy khác</Form.Label>
                            <Form.Control
                                type="text"
                                value={lydohuy.lydohuyct}
                                onChange={(e) => handleChange('lydohuyct', e.target.value)}
                                required

                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={() => handleHuyDon(false)} >
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* model Hoàn trả sản phẩm */}
            <Modal show={showbackmodal} onHide={() => setShowbackModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Hoàn trả sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form style={{ width: '100%', height: '100%' }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Lý do hoàn trả</Form.Label>
                            <Form.Control
                                type="text"
                                value={lydoHoantra}
                                onChange={(e) => setLydoHoantra(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <div className="d-flex flex-wrap" style={{ gap: '10px', marginTop: '10px' }}>
                                {/* Hiển thị các ảnh đã chọn */}
                                {hinhanh.length > 0 &&
                                    hinhanh.map((image, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'relative',
                                                width: '100px',
                                                height: '100px',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: '5px',
                                                backgroundColor: '#f8f8f8',
                                            }}
                                        >
                                            <img
                                                src={URL.createObjectURL(image)} // Tạo URL từ file
                                                alt={`Preview ${index}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            {/* Nút Xóa hình ảnh */}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    right: '0',
                                                    borderRadius: '50%',
                                                    padding: '2px 6px',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}

                                {/* Nút để mở cửa sổ chọn ảnh */}
                                <Button
                                    variant="primary"
                                    onClick={() => document.getElementById('fileInput').click()}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    Thêm ảnh
                                </Button>
                            </div>

                            {/* Input file ẩn */}
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleFileChange}
                                multiple // Cho phép chọn nhiều ảnh
                                style={{ display: 'none' }} // Ẩn input file
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowbackModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* model Chi tiết hoàn trả */}
            <Modal show={showModalhoantra} onHide={() => setShowModalhoantra(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết hoàn trả</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {returnDetails ? (
                        <>
                            <p><strong>Lý do hoàn trả:</strong> {returnDetails.lydoHoantra}</p>
                            {returnDetails.hinhAnh && returnDetails.hinhAnh.$values && returnDetails.hinhAnh.$values.length > 0 && (
                                <div>
                                    <strong>Hình ảnh:</strong>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                                        {returnDetails.hinhAnh.$values.map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={`https://localhost:44330${imageUrl}`}
                                                alt={`Hình ảnh hoàn trả ${index + 1}`}
                                                style={{
                                                    width: "70px",
                                                    height: "auto",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => window.open(`https://localhost:44330${imageUrl}`, '_blank')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalhoantra(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default DonHangComponent;
