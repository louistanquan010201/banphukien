const axios = require("axios");
const https = require("https");
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let savedRequestBody = null;
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

app.post("/payment", async (req, res) => {
    const {
        amount,
        orderId,
        orderInfo,
        returnUrl,
        SanPhams,
        TenNguoiDat,
        Sdt,
        DiaChi,
        GhiChu,
        HinhThucTT,
        TenTaiKhoan, // Thêm tenTaiKhoan vào dữ liệu nhận được// Thêm giảm giá vào dữ liệu nhận được
        phiShip,
        voucherId
    } = req.body;

    const partnerCode = "MOMO";
    const ipnUrl = "https://3a67-183-80-215-223.ngrok-free.app/callback";
    const requestType = "payWithMethod";
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";
    console.log("Received phiShip:", phiShip);
    // Thay đổi returnUrl về trang DonHangPage
    const updatedReturnUrl = "http://localhost:3000";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${updatedReturnUrl}&requestId=${orderId}&requestType=${requestType}`;

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    const requestBody = {
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: orderId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: updatedReturnUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    };

    // Save user data to use in callback
    savedRequestBody = {
        SanPhams,
        TenNguoiDat,
        Sdt,
        DiaChi,
        GhiChu,
        HinhThucTT: HinhThucTT || "bank-transfer",
        TenTaiKhoan,
        phiShip: phiShip || 0 ,
        voucherId: voucherId|| '',
    };

    const option = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(JSON.stringify(requestBody)),
        },
        data: requestBody,
    };

    try {
        const result = await axios(option);
        console.log("MoMo Response:", result.data);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(
            "Error:",
            error.response ? error.response.data : error.message
        );
        return res.status(500).json({
            statusCode: 500,
            message: "server error",
        });
    }
});

// Endpoint thanh toán
app.post("/callback", async (req, res) => {
    console.log("callback:: ");
    console.log("Request Body: ", req.body);
    console.log("Saved request body:", savedRequestBody);

    const { orderId, resultCode, signature, amount } = req.body;

    if (!orderId || !resultCode || !signature || !amount) {
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const calculatedSignature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        if (resultCode === 0) {
            // Kiểm tra và tạo mảng sanPhamDTOs
            let sanPhamDTOs = [];

            if (Array.isArray(savedRequestBody.SanPhams)) {
                // Trường hợp có nhiều sản phẩm
                sanPhamDTOs = savedRequestBody.SanPhams.map((product) => ({
                    Idpk: product.Idpk,
                    tenphukien: product.tenphukien,
                    soluong: product.soluong,
                    mausac: product.mausac,
                    hinhanh: product.hinhanh || '',
                }));
            } else {
                // Trường hợp chỉ có một sản phẩm
                const product = savedRequestBody.SanPhams; // Giả sử đây là đối tượng sản phẩm
                sanPhamDTOs = [{
                    Idpk: product.Idpk,
                    tenphukien: product.tenphukien,
                    soluong: product.soluong,
                    hinhanh: product.hinhanh || '',
                    mausac: product.mausac,
                }];
            }

            const formData = {
                TenNguoiDat: savedRequestBody.TenNguoiDat,
                Sdt: savedRequestBody.Sdt,
                DiaChi: savedRequestBody.DiaChi,
                GhiChu: savedRequestBody.GhiChu || "",
                HinhThucTT: savedRequestBody.HinhThucTT || "bank-transfer",
                TenTaiKhoan: savedRequestBody.TenTaiKhoan,
                phiShip: savedRequestBody.phiShip,
                voucherId:savedRequestBody.voucherId,
            };

            const orderData = {
                SanPhams: sanPhamDTOs,
                ...formData,
            };

            try {
                console.log("Sending order data to API:", orderData);

                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(
                    "https://naton69587-001-site1.mtempurl.com/api/Dathang/Dathanguser",
                    {
                        sanPhamDTOs: sanPhamDTOs, // Đảm bảo đây là danh sách sản phẩm
                        TenNguoiDat: savedRequestBody.TenNguoiDat,
                        Sdt: savedRequestBody.Sdt,
                        Diachi: savedRequestBody.DiaChi,
                        HinhThucTT: savedRequestBody.HinhThucTT || "bank-transfer",
                        TenTaiKhoan: savedRequestBody.TenTaiKhoan,
                        GhiChu: savedRequestBody.GhiChu || "",
                        phiShip: savedRequestBody.phiShip,
                        voucherId:savedRequestBody.voucherId,
                    },
                    { httpsAgent }
                );

                console.log("Order creation response:", response.data);
                return res.status(200).json({
                    message: "Order created successfully",
                    responseData: response.data,
                });
            } catch (error) {
                console.error(
                    "Error while creating order:",
                    error.response ? error.response.data : error.message
                );
                return res.status(500).json({
                    statusCode: 500,
                    message: "Error while creating order",
                });
            }
        } else {
            console.error("Transaction failed or not successful");
            return res.status(400).json({
                message: "Transaction failed or not successful",
            });
        }
    }
});


app.post("/transaction-status", async (req, res) => {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: "vi",
    });

    const option = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            "Content-Type": "application/json",
        },
        data: requestBody,
    };

    try {
        let result = await axios(option);
        console.log("Transaction Status Response:", result.data);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(
            "Transaction Status Error:",
            error.response ? error.response.data : error.message
        );
        return res.status(500).json({
            statusCode: 500,
            message: "server error",
        });
    }
});

app.listen(3000, () => {
    console.log("server run at port 3000");
});
