import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

const QuanlyLichsu = () => {

    const [trangThai] = useState();
    const [LichSuList, setlichsuList] = useState([]);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const handleSearch = (term) => {
        // Gọi hàm tìm kiếm với từ khóa
        searchlichsu(term);
    };
    useEffect(()=>{
        const tentk = sessionStorage.getItem("tenTK");
        const loaitk = sessionStorage.getItem("loaitk")
        if (tentk === null) {
            navigate('/dangky-dangnhap')
        }
        if (loaitk === "2") {
            navigate('/')
        }
    })
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            fetchLoailichsu(); // Gọi hàm để reset danh sách
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            return; // Dừng lại ở đây, không cần tiếp tục tìm kiếm
        }

        // Debounce để giảm số lần tìm kiếm
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timeout = setTimeout(() => {
            handleSearch(value);
        }, 200); // Tìm kiếm sau 500ms
        setTypingTimeout(timeout);
    };

    // useEffect(() => {
    //     fetchData(trangThai);
    // }, [trangThai]);

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/LichSu/getAllLichsu`);
    //         setlichsuList(response.data.$values || []);
    //     } catch (error) {
    //         console.error("Lỗi khi tải dữ liệu:", error);
    //         setlichsuList([]);
    //     }

    // };

    //tìm kiếm
    const searchlichsu = async () => {

        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/LichSu/search?searchTerm=${searchTerm}`);
            setlichsuList(response.data.$values || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setlichsuList([]);
        }
    };


    // //hàm xóa
    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xóa lịch sử thao tác này?',
            text: "Hành động này sẽ không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'hủy',
            confirmButtonText: 'Xóa'

        });
        if (result.isConfirmed) {

            try {
                await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/LichSu/${id}`);
                setlichsuList((prevList) =>
                    prevList.filter((item) => item.id !== id)
                );
                Swal.fire(
                    'Thành công!',
                    'Xóa lịch sử thành công.',
                    'success'
                );
                fetchLoailichsu();


            } catch (error) {
                console.error("Lỗi khi xóa lịch sử này:", error);
                Swal.fire(
                    'Lỗi!',
                    'Không thể xóa lịch sử này.',
                    'error'
                );
            }


        }

    };

    const [pageIndex, setPageIndex] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(8); // Số mục trên mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    // Hàm gọi API để lấy dữ liệu
    const fetchLoailichsu = async () => {

        try {
            const response = await axios.get(`https://naton69587-001-site1.mtempurl.com/api/LichSu/PhanTrang`, {
                params: { pageIndex, pageSize },
            });
            const { data, totalPages } = response.data;
            setlichsuList(data.$values || []);
            setTotalPages(totalPages);


        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    // Gọi API mỗi khi `pageIndex` hoặc `pageSize` thay đổi
    useEffect(() => {
        fetchLoailichsu();
    }, [pageIndex, pageSize]);

    // Hàm chuyển trang
    const handlePageChange = (newPageIndex) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
        }
    };

    //định dạng datetime
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime); // Chuyển chuỗi DateTime thành đối tượng Date
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
    };

    return (
        <div className="container" style={{ width: 1300, marginLeft: 250, backgroundColor: 'white', borderRadius: '15px' }}>
            <h2 className="text-center mb-4">Lịch sử thao tác Admin</h2>
            <div class="row">
                <div class="col-sm-12">
                    <div>
                        <input
                            style={{ width: '300px', height: '43px', borderRadius: '13px' }}
                            type="text"
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder="Tìm kiếm..."
                        />

                    </div>
                </div>

            </div>

            <br/>
            <div>
                <table >
                    <thead >
                        <tr style={{ textAlign: 'center',backgroundColor:'black'}}>
                            <th style={{color:'black', fontWeight:'bold'}}>Người thao tác</th>
                            <th style={{color:'black', fontWeight:'bold'}}>Thao tác</th>
                            <th style={{color:'black', fontWeight:'bold'}}>Nội dung</th>
                            <th style={{color:'black', fontWeight:'bold'}}>Nơi thao tác</th>
                            <th style={{color:'black', fontWeight:'bold'}}>Thời gian</th>
                            <th style={{color:'black', fontWeight:'bold'}}></th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {LichSuList.length === 0 ? (
                            <tr className="no-data">
                                <td colSpan="5">Không có lịch sử nào.</td>
                            </tr>
                        ) : (
                            LichSuList.map((dk) => (
                                <tr key={dk.id}>
                                    <td style={{ textAlign: 'center' }}>{dk.nguoiThucHien}</td>
                                    <td style={{ textAlign: 'center' }}>{dk.loaiThaoTac}</td>
                                    <td style={{ textAlign: 'center' }}>{dk.noiDungThaoTac}</td>
                                    <td style={{ textAlign: 'center' }}>{dk.entityName}</td>
                                    <td style={{ textAlign: 'center' }}>{formatDateTime(dk.thoiGian)}</td>
                                    <td className="text-center" style={{ textAlign: 'center' }}>
                                        <button type="button" className="btn btn-danger btn-sm"
                                            
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={() => handleDelete(dk.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <br />
                {/* Phân trang */}


                <div className="pagination">
                    <button
                        style={{ height: '40px', width: '50px', backgroundColor: 'black',color:'white', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => handlePageChange(pageIndex - 1)}
                        disabled={pageIndex === 1}

                    >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white' }} />
                    </button>
                    <span style={{ margin: '5px' }}>
                        {pageIndex} / {totalPages}
                    </span>
                    <button
                        style={{ height: '40px', width: '50px', backgroundColor: 'black',color:'white', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => handlePageChange(pageIndex + 1)}
                        disabled={pageIndex === totalPages}
                    >
                        <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white' }} />
                    </button>
                </div>


            </div>

        </div>
    );
};

export default QuanlyLichsu;