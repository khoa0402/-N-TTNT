import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

// Hàm tạo dữ liệu ngẫu nhiên cho mỗi ngày trong khoảng 30 ngày gần đây
const generateRandomHistoryData = (days = 30) => {
  const historyData = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const currentDate = new Date();
    currentDate.setDate(now.getDate() - i);

    const formattedDate = currentDate.toISOString().split("T")[0];

    // Tạo số lượng bản ghi ngẫu nhiên trong một ngày (ví dụ: từ 5 đến 20 lần đóng/mở cửa)
    const recordCount = Math.floor(Math.random() * 16) + 5;

    for (let j = 0; j < recordCount; j++) {
      // Tạo thời gian ngẫu nhiên trong ngày (giờ:phút)
      const hour = Math.floor(Math.random() * 24)
        .toString()
        .padStart(2, "0");
      const minute = Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0");
      const time = `${formattedDate} ${hour}:${minute}`;

      // Trạng thái ngẫu nhiên
      const status = Math.random() < 0.5 ? "Open" : "Closed";

      historyData.push({ time, status });
    }
  }

  return historyData;
};

const DoorHistoryPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = "url(/src/assets/grey.jpg)";
    document.body.style.backgroundSize = "120% auto";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.overflow = "auto";
  }, []);

  const [searchDate, setSearchDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [historyData] = useState(generateRandomHistoryData()); // Tạo dữ liệu ngẫu nhiên một lần duy nhất

  const handleSearch = () => {
    const filtered = historyData.filter((item) => {
      const matchesDate = searchDate === "" || item.time.startsWith(searchDate);
      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;
      return matchesDate && matchesStatus;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="p-4">
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "3px",
          borderRadius: "8px",
        }}
      >
        <h3 className="text-center mb-2" style={{ color: "white" }}>
          Door Open & Close History
        </h3>
      </div>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex gap-4 mb-4">
            <Form.Control
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </Form.Select>
            <Button variant="primary" onClick={handleSearch}>
              <FaSearch className="mb-1" />
            </Button>
          </div>
          <div style={{ width: "1150px", height: "280px", overflow: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    Time
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.time}</td>
                      <td
                        style={{
                          color: item.status === "Open" ? "#008000" : "#FF0000",
                          fontWeight: "bold",
                        }}
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoorHistoryPage;
