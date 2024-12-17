import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './quanlydv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DichVuCRUD = () => {
  const [dichVuList, setDichVuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDichVu, setCurrentDichVu] = useState({
    tenDichVu: '',
    moTa: '',
    gia: '',
    trangThai: true,
    loaiDichVuId: ''
  });
  const navigate = useNavigate();

const tentk = sessionStorage.getItem('tenTK');
  const [isEditing, setIsEditing] = useState(false);
  // Lấy danh sách loại dịch vụ
  useEffect(() => {
      
  }, []);
  const fetchDichVu = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/DichVu/getAllDichVu');
      console.info(response)
      setDichVuList(response.data.$values || []);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách dịch vụ'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const tentk = sessionStorage.getItem("tenTK");
    const loaitk = sessionStorage.getItem("loaitk")
    if (tentk === null) {
        navigate('/dangky-dangnhap')
    }
    if (loaitk === "2") {
        navigate('/')
    }
    fetchDichVu();
  }, []);

  const handleAddNew = () => {
    setCurrentDichVu({
      tenDichVu: '',
      moTa: '',
      gia: '',
      trangThai: true,
      loaiDichVuId: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (dichVu) => {
    setCurrentDichVu(dichVu);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentDichVu((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`https://naton69587-001-site1.mtempurl.com/api/DichVu/SuaDichVu/${currentDichVu.maDichVu}&tentk=${tentk}`, currentDichVu);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật dịch vụ thành công'
        });
      } else {
        console.info(currentDichVu);
        await axios.post('https://naton69587-001-site1.mtempurl.com/api/DichVu/ThemDichVu?&tentk=${tentk}', currentDichVu);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm dịch vụ mới thành công'
        });
      }

      fetchDichVu();
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể lưu dịch vụ'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn chắc chắn?',
      text: 'Dịch vụ này sẽ bị xóa vĩnh viễn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://naton69587-001-site1.mtempurl.com/api/DichVu/XoaDichVu/${id}`);
        Swal.fire('Đã xóa!', 'Dịch vụ đã được xóa thành công.', 'success');
        fetchDichVu();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể xóa dịch vụ'
        });
      }
    }
  };

  const renderModal = () => (
    <div className={`modal ${isModalOpen ? 'd-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên Dịch Vụ</label>
                <input
                  type="text"
                  name="tenDichVu"
                  value={currentDichVu.tenDichVu}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
 
              <div className="mb-3">
                <label className="form-label">Mô Tả</label>
                <textarea
                  name="moTa"
                  value={currentDichVu.moTa}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Giá</label>
                <input
                  type="number"
                  name="gia"
                  value={currentDichVu.gia}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  name="trangThai"
                  checked={currentDichVu.trangThai}
                  onChange={handleInputChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Trạng Thái Hoạt Động</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderDichVuList = () => {
    if (loading) {
      return <div>Đang tải...</div>;
    }

    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4">Danh Sách Dịch Vụ</h2>
          <button onClick={handleAddNew} className="btn btn-success">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Thêm Dịch Vụ
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Mã Dịch Vụ</th>
                <th>Tên Dịch Vụ</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {dichVuList.map((dichVu) => (
                <tr key={dichVu.maDichVu}>
                  <td>{dichVu.maDichVu}</td>
                  <td>{dichVu.tenDichVu}</td>
                  <td>{dichVu.gia?.toLocaleString()} VNĐ</td>
                  <td>
                    <span
                      className={`badge ${
                        dichVu.trangThai ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {dichVu.trangThai ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(dichVu)}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(dichVu.maDichVu)}
                      className="btn btn-sm btn-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderDichVuList()}
      {renderModal()}
    </div>
  );
};

export default DichVuCRUD;
