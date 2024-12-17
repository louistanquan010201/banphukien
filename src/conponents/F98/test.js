import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddressForm() {

    const [formdiachi, setFormdiachi] = useState({
        diachi: '', // Biến duy nhất để lưu địa chỉ đầy đủ
        province: '',
        district: '',
        ward: '',
        detailAddress: '' // Địa chỉ chi tiết nhập từ input
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [phiShip, setPhiShip] = useState(0);

    const headers = {
        // Thêm các header cần thiết nếu có
        'Token': '16db96ff-456b-11ef-a6bf-6ae11fb09515', // Thay thế bằng token của bạn
    };

    //#region GHN API

    // Lấy danh sách tỉnh/thành từ GHN API
    const getProvinces = async () => {
        try {
            const response = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                { headers }
            );
            // Xử lý dữ liệu từ GHN API

            setProvinces(Array.isArray(response.data.data) ? response.data.data : []);
            console.log("tỉnh",response.data.data)

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
            // Xử lý dữ liệu từ GHN API
            setDistricts(Array.isArray(response.data.data) ? response.data.data : []);
            console.log("huyện",response.data.data)
        } catch (error) {
            console.error('Error fetching provinces:', error);
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
            console.log("xã",response.data.data)
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
        },{
            "name": "TEST2",
            "quantity": 3,
            "weight": 10
        }]
        
        try{
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

            console.log(response.data.data);
            setPhiShip(response.data.data.total);
            
        }
        catch(error){
            console.error('Error fetching provinces:', error);
        }
        
    }
    //#endregion

    // Gọi API để lấy danh sách tỉnh/thành khi form được tải
    useEffect(() => {

        getProvinces();

        // axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
        //     .then(response => {
        //        console.log(response.data.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching provinces:', error);
        //         setProvinces([]);
        //     });

    }, []);

    // Gọi API để lấy danh sách quận/huyện khi người dùng chọn tỉnh/thành
    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setFormdiachi({ ...formdiachi, province: selectedProvince, district: '', ward: '' });
        getDistricts(selectedProvince);
    };

    // Gọi API để lấy danh sách phường/xã khi người dùng chọn quận/huyện
    const handleDistrictChange = (e) => {

        const selectedDistrict = e.target.value;

        setFormdiachi({ ...formdiachi, district: selectedDistrict, ward: '' });

        getWard(selectedDistrict);
    };

    // Cập nhật địa chỉ đầy đủ mỗi khi tỉnh/thành, quận/huyện, phường/xã hoặc địa chỉ chi tiết thay đổi
    const updateFullAddress = (updatedData) => {
        try {
            // Tìm thông tin tỉnh/thành phố
            const selectedProvince = provinces.find(p => p.ProvinceID === Number(updatedData.province));

            // Tìm thông tin quận/huyện (sửa lỗi updatedData.name thành updatedData.district)
            const selectedDistrict = districts.find(d => d.DistrictID === Number(updatedData.district));

            // Tìm thông tin phường/xã (sửa WardCode thành string để so sánh)
            const selectedWard = wards.find(w => w.WardCode === String(updatedData.ward));

            // Kiểm tra xem có đủ thông tin không
            if (!selectedProvince || !selectedDistrict || !selectedWard) {
                setFormdiachi({ ...updatedData, diachi: '' });
                return;
            }

            // Tạo địa chỉ đầy đủ với tên chính xác
            const fullAddress = [
                updatedData.detailAddress,
                selectedWard.WardName,
                selectedDistrict.DistrictName,
                selectedProvince.ProvinceName
            ].filter(Boolean).join(', ');

            setFormdiachi({ ...updatedData, diachi: fullAddress });
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
            setFormdiachi({ ...updatedData, diachi: '' });
        }
    };

    // Cập nhật khi thay đổi tỉnh/thành, quận/huyện, phường/xã, hoặc địa chỉ chi tiết
    const handleChange = (e) => {

        const { name, value } = e.target;

        const updatedData = { ...formdiachi, [name]: value };

        updateFullAddress(updatedData);
    };

    return (
        <div>
                    <form>
            <div className="form-group">
                <label htmlFor="province">Tỉnh/Thành phố:</label>
                <select
                    id="province"
                    name="province"
                    className="form-control"
                    value={formdiachi.province}
                    onChange={(e) => { handleProvinceChange(e); handleChange(e); }}
                    required
                >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((province) => (
                        <option key={province.ProvinceID} value={province.ProvinceID}>
                            {province.NameExtension[1]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="district">Quận/Huyện:</label>
                <select
                    id="district"
                    name="district"
                    className="form-control"
                    value={formdiachi.district}
                    onChange={(e) => { handleDistrictChange(e); handleChange(e); }}
                    required
                >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((district) => (
                        <option key={district.DistrictID} value={district.DistrictID}>
                            {district.DistrictName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="ward">Phường/Xã:</label>
                <select
                    id="ward"
                    name="ward"
                    className="form-control"
                    value={formdiachi.ward}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                        </option>
                    ))}
                </select>
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
                    onChange={handleChange}
                    onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập địa chỉ')}
                    onInput={(e) => e.target.setCustomValidity('')}
                />
            </div>

            <div className="form-group">
                <label htmlFor="fullAddress">Địa chỉ đầy đủ:</label>
                <input
                    type="text"
                    id="fullAddress"
                    name="diachi"
                    className="form-control"
                    value={formdiachi.diachi}
                    readOnly
                />
            </div>
        </form>
            <button onClick={getPhiGiaoHang}>Get Phi Giao Hang</button>
            <div>Phí giao hàng: {phiShip.toLocaleString('vi-VN')} VNĐ</div>
        </div>
    );
}

export default AddressForm;
