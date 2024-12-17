import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ServiceRevenueTable = () => {
  const [serviceRevenues, setServiceRevenues] = useState([]);

  useEffect(() => {
    const fetchServiceRevenue = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/dashboard/service-usage');
        console.log('Service Revenue Data:', response.data); // Xem dữ liệu trả về
        setServiceRevenues(response.data.$values || []);
      } catch (error) {
        console.error('Error fetching service revenue', error);
      }
    };

    fetchServiceRevenue();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h4>Doanh Thu Dịch Vụ</h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã Dịch Vụ</th>
                <th>Tên Dịch Vụ</th>
                <th>Tổng Doanh Thu</th>
              </tr>
            </thead>
            <tbody>
              {serviceRevenues.map((service, index) => (
                <tr key={index}>
                  <td>{service.maDichVu}</td>
                  <td>{service.tenDichVu}</td>
                  <td>{service.tongDoanhThu.toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);
  console.log(data);


  const [chartData, setChartData] = useState({
    revenueChart: {
      labels: [],
      datasets: [
        {
          label: 'Doanh thu',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    },
  });

  const [timePeriod, setTimePeriod] = useState('day'); // 'day' or 'month'

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (timePeriod === 'day') {
          response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Statistical/get-statictical-last-7-days');
        } else {
          response = await axios.get('https://naton69587-001-site1.mtempurl.com/api/Statistical/get-statistical-last-7-month');
        }

        const result = response.data.$values;
        console.log('Chart Data:', result); // Kiểm tra dữ liệu từ API

        if (result) {
          // Cập nhật chart data
          setChartData({
            revenueChart: {
              labels: result.map(item => item.period), // Lấy 'period' làm nhãn
              datasets: [
                {
                  label: 'Doanh thu',
                  data: result.map(item => item.revenue), // Lấy 'revenue' làm dữ liệu
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
              ],
            },
          });
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [timePeriod]);

  return (
    <div id="main">
      <div className="page-heading1">
        <h3>Trang chủ</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            {data && (
              <div className="row">
                <div className="col-6 col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body px-3 py-4-5">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="stats-icon purple">
                            <i className="iconly-boldBag 2" />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h6 className="text-muted font-semibold">Sản phẩm</h6>
                          <h6 className="font-extrabold mb-0">{data.productCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body px-3 py-4-5">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="stats-icon blue">
                            <i className="iconly-boldProfile" />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h6 className="text-muted font-semibold">Thành viên</h6>
                          <h6 className="font-extrabold mb-0">{data.memberCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body px-3 py-4-5">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="stats-icon green">
                            <i className="iconly-boldDocument" />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h6 className="text-muted font-semibold">Danh sách đặt hàng</h6>
                          <h6 className="font-extrabold mb-0">{data.orderListCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body px-3 py-4-5">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="stats-icon red">
                            <i className="iconly-boldGraph" />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h6 className="text-muted font-semibold">Doanh thu ngày</h6>
                          <h6 className="font-extrabold mb-0"> {data.dailyRevenue ? `${data.dailyRevenue.toLocaleString()} vnđ` : '0 vnđ'}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              {/* Select box nằm trên */}
              <div className="col-12 mb-3" style={{ width: '40%' }}>
                <select
                  className="form-select"
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                >
                  <option value="day">Theo Ngày</option>
                  <option value="month">Theo Tháng</option>
                </select>
              </div>

              <div className="col-12 col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h4>Doanh thu</h4>
                  </div>
                  <div className="card-body">
                    <Bar data={chartData.revenueChart} height={132} />
                  </div>
                </div>
              </div>

              {/* ServiceRevenueTable nằm ngang với chart */}
              <div className="col-12 col-lg-4">
                <ServiceRevenueTable />
              </div>
            </div>


          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
