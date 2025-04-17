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
import apiService from "../../api/api";

const TemperatureHumidityLightChart = () => {
  document.body.style.backgroundImage = "url(/src/assets/grey.jpg)";
  document.body.style.backgroundSize = "120% auto";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [todayData, setTodayData] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState([]);
  const [isTodayLoading, setIsTodayLoading] = useState(false); // Loading state for today
  const [isSelectedDateLoading, setIsSelectedDateLoading] = useState(false); // Loading state for selected date

  const [visibleLines, setVisibleLines] = useState({
    temperature: true,
    humidity: true,
    lightLevel: true,
  });

  const fetchDataByDate = async (date, setData, setLoading) => {
    setLoading(true); // Start loading
    try {
      // Fetch temperature data
      const tempResponse = await apiService.getTemperatureByDate(date);
      const tempItems = tempResponse.data || [];

      // Fetch humidity data
      const humidityResponse = await apiService.getHumidityByDate(date);
      const humidityItems = humidityResponse.data || [];

      // Fetch light level data
      const lightResponse = await apiService.getLightByDate(date);
      const lightItems = lightResponse.data || [];

      // Combine data for recharts
      const combinedData = tempItems.map((tempItem, index) => ({
        time: tempItem.date.slice(11, 16), // Extract HH:mm from timestamp
        temperature: tempItem.value,
        humidity: humidityItems[index]?.value || 0, // Fallback if data is missing
        lightLevel: lightItems[index]?.value || 0, // Fallback if data is missing
      }));

      setData(combinedData);
    } catch (error) {
      console.error(`Error fetching data for date ${date}:`, error);
      setData([]); // Set empty data on error
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchDataByDate(today, setTodayData, setIsTodayLoading);
  }, [today]);

  useEffect(() => {
    fetchDataByDate(
      selectedDate,
      setSelectedDateData,
      setIsSelectedDateLoading
    );
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
              {isTodayLoading ? (
                <div className="text-center mt-3">Loading...</div>
              ) : (
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
                      name="Light Level (%)"
                      strokeOpacity={visibleLines.lightLevel ? 1 : 0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
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
              {isSelectedDateLoading ? (
                <div className="text-center mt-3">Loading...</div>
              ) : (
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
                      name="Light Level (%)"
                      strokeOpacity={visibleLines.lightLevel ? 1 : 0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemperatureHumidityLightChart;
