import React, { useState, useEffect } from "react";
import ReactTypingEffect from "react-typing-effect";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import { FaHeart, FaStar } from "react-icons/fa";
import { FaDoorOpen, FaDoorClosed } from "react-icons/fa";
import { BsFillLightbulbFill, BsFan } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { SketchPicker } from "react-color";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";
import apiService from "../api/api";

const predefinedColors = [
  { name: "red", hex: "#FF0000" },
  { name: "orange", hex: "#FFA500" },
  { name: "yellow", hex: "#FFFF00" },
  { name: "green", hex: "#008000" },
  { name: "blue", hex: "#0000FF" },
  { name: "indigo", hex: "#4B0082" },
  { name: "purple", hex: "#800080" },
];

const Home = () => {
  document.body.style.backgroundColor = "gray";
  document.body.style.backgroundSize = "120% auto";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [fanLevel, setFanLevel] = useState(1);
  const [lightLevel, setLightLevel] = useState(1);
  const [sensorTemp, setSensorTemp] = useState(true);
  const [sensorHumidity, setSensorHumidity] = useState(true);
  const [sensorLight, setSensorLight] = useState(true);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0].name);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(65);
  const [light, setLight] = useState(500);

  const [showTempAlert, setShowTempAlert] = useState(false);
  const [showHumidityAlert, setShowHumidityAlert] = useState(false);
  const [showLightAlert, setShowLightAlert] = useState(false);

  // State cho dữ liệu biểu đồ
  const [tempData, setTempData] = useState([
    20, 28, 32, 24, 30, 23, 25, 24, 22,
  ]);
  const [humidityData, setHumidityData] = useState([
    60, 70, 69, 59, 68, 62, 65, 63, 60,
  ]);
  const [lightData, setLightData] = useState([
    29, 45, 50, 60, 70, 75, 80, 65, 30,
  ]);
  const [chartLabels, setChartLabels] = useState([
    "00:00",
    "3:00",
    "06:00",
    "9:00",
    "12:00",
    "15:00",
    "18:00",
    "21:00",
    "23:59",
  ]);

  // Theo dõi alert
  useEffect(() => {
    if (temperature > 30) {
      setShowTempAlert(true);
    } else {
      setShowTempAlert(false);
    }
  }, [temperature]);

  useEffect(() => {
    if (humidity > 80) {
      setShowHumidityAlert(true);
    } else {
      setShowHumidityAlert(false);
    }
  }, [humidity]);

  useEffect(() => {
    if (light > 1000) {
      setShowLightAlert(true);
    } else {
      setShowLightAlert(false);
    }
  }, [light]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchDataByDate = async () => {
      const today = new Date().toISOString().split("T")[0]; // Ngày hôm nay: YYYY-MM-DD

      try {
        // Lấy dữ liệu nhiệt độ
        const tempResponse = await apiService.getTemperatureByDate(today);
        const tempItems = tempResponse.data || [];
        if (tempItems.length > 0) {
          setTempData(tempItems.map((item) => item.value));
          setChartLabels(tempItems.map((item) => item.date.slice(11, 16))); // Lấy HH:mm
          setTemperature(tempItems[tempItems.length - 1].value); // Giá trị mới nhất
        }

        // Lấy dữ liệu độ ẩm (giả sử định dạng tương tự)
        const humidityResponse = await apiService.getHumidityByDate(today);
        const humidityItems = humidityResponse.data || [];
        if (humidityItems.length > 0) {
          setHumidityData(humidityItems.map((item) => item.value));
          setHumidity(humidityItems[humidityItems.length - 1].value);
        }

        // Lấy dữ liệu ánh sáng (giả sử định dạng tương tự)
        const lightResponse = await apiService.getLightByDate(today);
        const lightItems = lightResponse.data || [];
        if (lightItems.length > 0) {
          setLightData(lightItems.map((item) => item.value));
          setLight(lightItems[lightItems.length - 1].value);
        }
      } catch (error) {
        console.error("Error fetching data by date:", error);
      }
    };

    fetchDataByDate();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      // apiService.getTemperatureStream().then((response) => {
      //   console.log(response.data);
      //   setTemperature(response.data.value);
      // });
      // apiService.getHumidityStream().then((response) => {
      //   console.log(response.data);
      //   setHumidity(response.data.value);
      // });
      // apiService.getLightStream().then((response) => {
      //   console.log(response.data);
      //   setLight(response.data.value);
      // });
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (isOn) => (isOn ? "#28a745" : "#dc3545");
  const handleColorSelect = (color) => {
    setSelectedColor(color.name);
    apiService
      .controlLight("on", lightLevel, color.name)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error changing light color:", error);
      });
  };

  return (
    <Container fluid className="p-4">
      {showTempAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowTempAlert(false)}
          dismissible
        >
          Cảnh báo: Nhiệt độ vượt ngưỡng 30°C! Hiện tại:{" "}
          {temperature.toFixed(1)}°C
        </Alert>
      )}
      {showHumidityAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowHumidityAlert(false)}
          dismissible
        >
          Cảnh báo: Độ ẩm vượt ngưỡng 80%! Hiện tại: {humidity.toFixed(1)}%
        </Alert>
      )}
      {showLightAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowLightAlert(false)}
          dismissible
        >
          Cảnh báo: Ánh sáng vượt ngưỡng 1000 lx! Hiện tại: {light} lx
        </Alert>
      )}

      <Row>
        <Col md={2}>
          <Card className="p-3 text-center shadow-sm">
            <h4>Hi, Master</h4>
            <ReactTypingEffect
              text={["Have a good day!"]}
              speed={100}
              eraseDelay={2000}
              className="typing-text"
            />
            <div className="d-flex justify-content-center">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  color: ["#ff0000", "#ff6347", "#ff4500", "#ff0000"],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaHeart className="m-2" size={24} />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  color: ["#ffd700", "#ffea00", "#ffc107", "#ffd700"],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaStar className="m-2" size={24} />
              </motion.div>
            </div>
          </Card>
          <Card className="p-3 mt-3 shadow-sm text-center">
            <h5>Current Conditions</h5>

            <motion.h4
              animate={{ color: getColor(sensorTemp) }}
              transition={{ duration: 0.5 }}
            >
              Temperature: {sensorTemp ? `${temperature.toFixed(1)}°C` : "Off"}
            </motion.h4>

            <motion.h4
              animate={{ color: getColor(sensorHumidity) }}
              transition={{ duration: 0.5 }}
            >
              Humidity: {sensorHumidity ? `${humidity.toFixed(1)}%` : "Off"}
            </motion.h4>

            <motion.h4
              animate={{ color: getColor(sensorLight) }}
              transition={{ duration: 0.5 }}
            >
              Light: {sensorLight ? `${light} lx` : "Off"}
            </motion.h4>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Temperature & Humidity & Light History</h5>
            <Line
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Temperature (°C)",
                    data: tempData,
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: "Humidity (%)",
                    data: humidityData,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: "Light Level (lx)",
                    data: lightData,
                    borderColor: "#FFC107",
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Quick Control</h5>
            <Row className="mt-2">
              <Col xs={4}>
                <Button
                  variant={lightOn ? "warning" : "secondary"}
                  className="w-100"
                  onClick={() => {
                    if (!lightOn) {
                      setLightOn(true);
                      apiService
                        .controlLight("on", lightLevel, selectedColor)
                        .then((response) => {
                          console.log(response);
                        });
                    } else {
                      setLightOn(false);
                      apiService.controlLight("off").then((response) => {
                        console.log(response);
                      });
                    }
                  }}
                >
                  <BsFillLightbulbFill
                    size={18}
                    className="me-1"
                    style={{ position: "relative", top: "-2px" }}
                  />{" "}
                  Light
                </Button>
              </Col>
              <Col xs={4}>
                <Button
                  variant={fanOn ? "primary" : "secondary"}
                  className="w-100"
                  onClick={() => {
                    if (!fanOn) {
                      setFanOn(true);
                      apiService.controlFan("on", fanLevel).then((response) => {
                        console.log(response);
                      });
                    } else {
                      setFanOn(false);
                      apiService.controlFan("off").then((response) => {
                        console.log(response);
                      });
                    }
                  }}
                >
                  <BsFan
                    size={18}
                    className="me-1"
                    style={{ position: "relative", top: "-2px" }}
                  />{" "}
                  Fan
                </Button>
              </Col>
              <Col xs={4}>
                <Button
                  variant={doorOpen ? "info" : "secondary"}
                  className="w-100"
                  onClick={() => {
                    if (!doorOpen) {
                      setDoorOpen(true);
                      apiService.controlDoor("open").then((response) => {
                        console.log(response);
                      });
                    } else {
                      setDoorOpen(false);
                      apiService.controlDoor("close").then((response) => {
                        console.log(response);
                      });
                    }
                  }}
                >
                  {doorOpen ? (
                    <FaDoorOpen
                      size={18}
                      className="me-1"
                      style={{ position: "relative", top: "-2px" }}
                    />
                  ) : (
                    <FaDoorClosed
                      size={18}
                      className="me-1"
                      style={{ position: "relative", top: "-2px" }}
                    />
                  )}{" "}
                  Door
                </Button>
              </Col>
            </Row>

            <div style={{ minHeight: "100px" }}>
              {fanOn && (
                <>
                  <Form.Label className="mt-3">Fan Speed</Form.Label>
                  <div className="d-flex justify-content-around">
                    <Button
                      variant={fanLevel === 1 ? "primary" : "outline-primary"}
                      onClick={() => {
                        setFanLevel(1);
                        apiService.controlFan("on", 1).then((response) => {
                          console.log(response);
                        });
                      }}
                    >
                      Low
                    </Button>
                    <Button
                      variant={fanLevel === 2 ? "primary" : "outline-primary"}
                      onClick={() => {
                        setFanLevel(2);
                        apiService.controlFan("on", 2).then((response) => {
                          console.log(response);
                        });
                      }}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={fanLevel === 3 ? "primary" : "outline-primary"}
                      onClick={() => {
                        setFanLevel(3);
                        apiService.controlFan("on", 3).then((response) => {
                          console.log(response);
                        });
                      }}
                    >
                      High
                    </Button>
                  </div>
                </>
              )}

              {lightOn && (
                <>
                  <Form.Label className="mt-3">Light Brightness</Form.Label>
                  <div className="d-flex justify-content-around">
                    <Button
                      variant={lightLevel === 1 ? "warning" : "outline-warning"}
                      onClick={() => {
                        setLightLevel(1);
                        apiService
                          .controlLight("on", 1, selectedColor)
                          .then((response) => {
                            console.log(response);
                          });
                      }}
                    >
                      Low
                    </Button>
                    <Button
                      variant={lightLevel === 2 ? "warning" : "outline-warning"}
                      onClick={() => {
                        setLightLevel(2);
                        apiService
                          .controlLight("on", 2, selectedColor)
                          .then((response) => {
                            console.log(response);
                          });
                      }}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={lightLevel === 3 ? "warning" : "outline-warning"}
                      onClick={() => {
                        setLightLevel(3);
                        apiService
                          .controlLight("on", 3, selectedColor)
                          .then((response) => {
                            console.log(response);
                          });
                      }}
                    >
                      Highs
                    </Button>
                  </div>
                  <Card className="p-2 mt-3 shadow-sm text-center">
                    <h5>Light Color</h5>
                    <Button
                      className="mb-2"
                      onClick={() => setShowColorPicker(true)}
                    >
                      Select Color
                    </Button>
                    <Modal
                      show={showColorPicker}
                      onHide={() => setShowColorPicker(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Choose Light Color</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            justifyContent: "center",
                          }}
                        >
                          {predefinedColors.map((color) => (
                            <div
                              key={color.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: color.hex,
                                cursor: "pointer",
                                border:
                                  selectedColor === color.name
                                    ? "3px solid black"
                                    : "1px solid gray",
                              }}
                              onClick={() => handleColorSelect(color)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        backgroundColor: selectedColor,
                        margin: "10px auto",
                        border: "2px solid white",
                      }}
                    ></div>
                  </Card>
                </>
              )}
            </div>

            <Row className="mt-3">
              <Col>
                <Button
                  variant={sensorTemp ? "success" : "secondary"}
                  className="w-100"
                  onClick={() => setSensorTemp(!sensorTemp)}
                >
                  Temp Sensor
                </Button>
              </Col>
              <Col>
                <Button
                  variant={sensorHumidity ? "success" : "secondary"}
                  className="w-100"
                  onClick={() => setSensorHumidity(!sensorHumidity)}
                >
                  Humidity Sensor
                </Button>
              </Col>
              <Col>
                <Button
                  variant={sensorLight ? "success" : "secondary"}
                  className="w-100"
                  onClick={() => setSensorLight(!sensorLight)}
                >
                  Light Sensor
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
