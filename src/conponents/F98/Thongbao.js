import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import './style/thongbao.css';
const Thongbao = () => {
    const idtk = sessionStorage.getItem("id");
    const [dlthongbao, setdulieuthongbao] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        laydl();
    }, []);
    const laydl = async () => {
        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/ThongBao/LayDlThongbao?idtk=${idtk}`)
            setdulieuthongbao(response.data.$values)
            console.log(response.data.$values);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }
    const danhgia = async (idsp, idtBao) => {
        sessionStorage.setItem('idsp', idsp);
        sessionStorage.setItem('idtBao', idtBao);
        navigate('/chitietsanpham')
    }
    return (
        <div className="tab-container-thongbao">
            <h2 className="title-thongbao">Thông báo</h2>
            <table className="table-thongbao">
                <thead className="thead-thongbao">
                    <tr className="tr-thongbao">
                        <th className="th-thongbao">Tiêu đề</th>
                        <th className="th-thongbao">Nội dung</th>
                        <th className="th-thongbao">Ngày</th>
                        <th className="th-thongbao">Hoạt động</th>
                    </tr>
                </thead>
                <tbody className="tbody-thongbao">
                    {dlthongbao.length > 0 ? (
                        dlthongbao.map((thongbao, index) => (
                            <tr key={index} className="tr-thongbao">
                                <td
                                    className={`td-thongbao ${thongbao.tieude.includes("Mời bạn đánh giá") ? "yellow-box" : "green-box"}`}
                                    style={{ textAlign: 'center' }}>
                                    {thongbao.tieude} 
                                </td>
                                <td className="td-thongbao">{thongbao.noiDung}</td>
                                <td className="td-thongbao">{new Date(thongbao.ngayTb).toLocaleDateString()}</td>
                                <td>
                                    {thongbao.idsp && <button onClick={() => {
                                        localStorage.setItem('selectedProductId', thongbao.idsp);
                                        sessionStorage.setItem("idtBao",thongbao.idtBao) // Lưu id sản phẩm vào localStorage
                                        navigate('/Danhgia'); // Điều hướng đến trang ChatAI
                                    }} >Đánh giá </button>}
                                  
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="tr-thongbao">
                            <td colSpan="4" className="td-thongbao" style={{ textAlign: 'center' }}>Chưa có thông báo</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>



    );
}
export default Thongbao;