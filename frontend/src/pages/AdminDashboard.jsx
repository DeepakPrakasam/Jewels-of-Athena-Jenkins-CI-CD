import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: "78,250",
      change: "70.5%",
      changeType: "up",
      extra: "8,900",
      badgeClass: "success",
    },
    {
      title: "Total Orders",
      value: "18,800",
      change: "27.4%",
      changeType: "down",
      extra: "1,943",
      badgeClass: "warning",
    },
    {
      title: "Total Sales",
      value: "$35,078",
      change: "27.4%",
      changeType: "down",
      extra: "$20,395",
      badgeClass: "danger",
    },
    {
      title: "Total Page Views",
      value: "442,236",
      change: "59.3%",
      changeType: "up",
      extra: "35,000",
      badgeClass: "primary",
    },
  ];

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Earnings ($)',
        data: [1200, 1500, 1800, 1000, 2300, 1750, 1650],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4bc0c0',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      {/* Stat Cards */}
      <div className="row">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-xl-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h6 className="mb-2 text-muted">{stat.title}</h6>
                <h4 className="mb-3">
                  {stat.value}{" "}
                  <span
                    className={`badge bg-light-${stat.badgeClass} border border-${stat.badgeClass}`}
                  >
                    <i
                      className={`bi bi-trending-${
                        stat.changeType === "up" ? "up" : "down"
                      }`}
                    ></i> {stat.change}
                  </span>
                </h4>
                <p className="mb-0 text-muted small">
                  You made an extra <span className={`text-${stat.badgeClass}`}>{stat.extra}</span> this year
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Income Overview - Bar Chart */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="mb-3">📊 Income Overview</h5>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats[2].value}</p>
          <div style={{ height: "300px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <h4 className="mt-5">🧾 Recent Orders</h4>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Tracking No.</th>
            <th>Product Name</th>
            <th>Total Order</th>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {[
            { tracking: "84564564", product: "Camera Lens", total: 40, status: "Rejected", amount: "$40,570" },
            { tracking: "84564564", product: "Laptop", total: 300, status: "Pending", amount: "$180,139" },
            { tracking: "84564564", product: "Mobile", total: 355, status: "Approved", amount: "$180,139" },
          ].map((order, index) => (
            <tr key={index}>
              <td>{order.tracking}</td>
              <td>{order.product}</td>
              <td>{order.total}</td>
              <td>
                <span className={`badge ${
                  order.status === "Approved" ? "bg-success" :
                  order.status === "Pending" ? "bg-warning text-dark" : "bg-danger"
                }`}>
                  {order.status}
                </span>
              </td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
