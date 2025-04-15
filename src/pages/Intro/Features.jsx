import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateMockData = (date) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map((hour) => ({
    time: `${hour}:00`,
    temperature: Math.floor(Math.random() * 15) + 20,
    humidity: Math.floor(Math.random() * 50) + 30,
    lightLevel: Math.floor(Math.random() * 80) + 20,
    date,
  }));
};

const TemperatureHumidityLightChart = () => {
  document.body.style.backgroundImage = "url(/src/assets/grey.jpg)";
  document.body.style.backgroundSize = "120% auto";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [todayData, setTodayData] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState([]);

  const [visibleLines, setVisibleLines] = useState({
    temperature: true,
    humidity: true,
    lightLevel: true,
  });

  useEffect(() => {
    setTodayData(generateMockData(today));
  }, [today]);

  useEffect(() => {
    setSelectedDateData(generateMockData(selectedDate));
  }, [selectedDate]);

  const handleLegendClick = (event) => {
    if (!event || !event.dataKey) return;
    setVisibleLines((prev) => ({
      ...prev,
      [event.dataKey]: !prev[event.dataKey],
    }));
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "3px",
          borderRadius: "8px",
        }}
      >
        <h3 className="text-center mb-2" style={{ color: "white" }}>
          Temperature, Humidity & Light Chart
        </h3>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5 className="text-center">Today's Data ({today})</h5>
              <ResponsiveContainer width="100%" height={280} className="mt-3">
                <LineChart data={todayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend onClick={handleLegendClick} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff7300"
                    name="Temperature (°C)"
                    strokeOpacity={visibleLines.temperature ? 1 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#0088ff"
                    name="Humidity (%)"
                    strokeOpacity={visibleLines.humidity ? 1 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="lightLevel"
                    stroke="#FFD700"
                    name="Light Level (lx)"
                    strokeOpacity={visibleLines.lightLevel ? 1 : 0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5 className="text-center">Selected Date</h5>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-3 w-50 mx-auto"
              />
              <ResponsiveContainer width="100%" height={280} className="mt-3">
                <LineChart data={selectedDateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend onClick={handleLegendClick} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff7300"
                    name="Temperature (°C)"
                    strokeOpacity={visibleLines.temperature ? 1 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#0088ff"
                    name="Humidity (%)"
                    strokeOpacity={visibleLines.humidity ? 1 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="lightLevel"
                    stroke="#FFD700"
                    name="Light Level (lx)"
                    strokeOpacity={visibleLines.lightLevel ? 1 : 0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemperatureHumidityLightChart;
