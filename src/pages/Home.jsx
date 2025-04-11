import React, { useState, useEffect } from "react";
import ReactTypingEffect from "react-typing-effect";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { FaHeart, FaStar } from "react-icons/fa";
import { FaDoorOpen, FaDoorClosed } from "react-icons/fa";
import { BsFillLightbulbFill, BsFan } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { SketchPicker } from "react-color";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";

const Home = () => {
  document.body.style.backgroundImage = "url(/src/assets/background2.png)";
  document.body.style.backgroundSize = "120% auto";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(1);
  const [lightBrightness, setLightBrightness] = useState(100); // State for light brightness
  const [sensorTemp, setSensorTemp] = useState(true);
  const [sensorHumidity, setSensorHumidity] = useState(true);
  const [sensorLight, setSensorLight] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#FFD700");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(65);
  const [lightLevel, setLightLevel] = useState(500);

  useEffect(() => {
    const fetchData = () => {
      setTemperature((prev) => Math.max(20, Math.min(30, prev + (Math.random() * 2 - 1))));
      setHumidity((prev) => Math.max(50, Math.min(80, prev + (Math.random() * 5 - 2.5))));
      setLightLevel(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const lightColors = ["#FF0000", "#FF4500", "#FFA500", "#FFFF00", "#008000", "#00CED1", "#1E90FF", "#8A2BE2", "#FF1493"];

  const getColor = (isOn) => (isOn ? "#28a745" : "#dc3545");

  return (
    <Container fluid className="p-4">
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
                animate={{ color: ["#ff0000", "#ff6347", "#ff4500", "#ff0000"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaHeart className="m-2" size={24} />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                animate={{ color: ["#ffd700", "#ffea00", "#ffc107", "#ffd700"] }}
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
              Light: {sensorLight ? `${lightLevel} lx` : "Off"}
            </motion.h4>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Temperature & Humidity & Light History</h5>
            <Line
              data={{
                labels: ["00:00", "3:00", "06:00", "9:00", "12:00", "15:00", "18:00", "21:00", "23:59"],
                datasets: [
                  {
                    label: "Temperature (°C)",
                    data: [20, 28, 32, 24, 30, 23, 25, 24, 22],
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: "Humidity (%)",
                    data: [60, 70, 69, 59, 68, 62, 65, 63, 60, 61],
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: "Light Level (lx)", 
                    data: [29, 45, 50, 60, 70, 75, 80, 65, 30],
                    borderColor: "#FFC107",
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
            />
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Quick Control</h5>
            <Row className="mt-2">
              <Col xs={4}>
                <Button variant={lightOn ? "warning" : "secondary"} className="w-100" onClick={() => setLightOn(!lightOn)}>
                  <BsFillLightbulbFill size={18} className="me-1" style={{ position: "relative", top: "-2px" }}/> Light
                </Button>
              </Col>
              <Col xs={4}>
                <Button variant={fanOn ? "primary" : "secondary"} className="w-100" onClick={() => setFanOn(!fanOn)}>
                  <BsFan size={18} className="me-1" style={{ position: "relative", top: "-2px" }}/> Fan
                </Button>
              </Col>
              <Col xs={4}>
                <Button variant={doorOpen ? "info" : "secondary"} className="w-100" onClick={() => setDoorOpen(!doorOpen)}>
                  {doorOpen ? <FaDoorOpen size={18} className="me-1" style={{ position: "relative", top: "-2px" }}/> : <FaDoorClosed size={18} className="me-1" style={{ position: "relative", top: "-2px" }}/>} Door
                </Button>
              </Col>
            </Row>

            <div style={{ minHeight: "100px" }}>
              {fanOn && (
                <>
                  <Form.Label className="mt-3">Fan Speed</Form.Label>
                    <div className="d-flex justify-content-around">
                      <Button
                        variant={fanSpeed === 30 ? "primary" : "outline-primary"}
                        onClick={() => setFanSpeed(30)}
                      >
                        Low
                      </Button>
                      <Button
                        variant={fanSpeed === 60 ? "primary" : "outline-primary"}
                        onClick={() => setFanSpeed(60)}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={fanSpeed === 100 ? "primary" : "outline-primary"}
                        onClick={() => setFanSpeed(100)}
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
                        variant={lightBrightness === 30 ? "warning" : "outline-warning"}
                        onClick={() => setLightBrightness(30)}
                      >
                        Low
                      </Button>
                      <Button
                        variant={lightBrightness === 60 ? "warning" : "outline-warning"}
                        onClick={() => setLightBrightness(60)}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={lightBrightness === 100 ? "warning" : "outline-warning"}
                        onClick={() => setLightBrightness(100)}
                      >
                        Highs
                      </Button>
                    </div>
                </>
              )}
            </div>

            <Row className="mt-3">
              <Col>
                <Button variant={sensorTemp ? "success" : "secondary"} className="w-100" onClick={() => setSensorTemp(!sensorTemp)}>
                  Temp Sensor
                </Button>
              </Col>
              <Col>
                <Button variant={sensorHumidity ? "success" : "secondary"} className="w-100" onClick={() => setSensorHumidity(!sensorHumidity)}>
                  Humidity Sensor
                </Button>
              </Col>
              <Col>
                <Button variant={sensorLight ? "success" : "secondary"} className="w-100" onClick={() => setSensorLight(!sensorLight)}>
                  Light Sensor
                </Button>
              </Col>
            </Row>
          </Card>

          <Card className="p-2 mt-3 shadow-sm text-center">
            <h5>Light Color</h5>
            <Button className="mb-2" onClick={() => setShowColorPicker(true)}>
              Select Color
            </Button>
            <Modal show={showColorPicker} onHide={() => setShowColorPicker(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Choose Light Color</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <SketchPicker
                  color={selectedColor}
                  onChangeComplete={(color) => setSelectedColor(color.hex)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowColorPicker(false)}>Close</Button>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
