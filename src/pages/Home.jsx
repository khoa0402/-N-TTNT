import React, { useState, useEffect, useRef } from "react";
import ReactTypingEffect from "react-typing-effect";
import {
  Container, Row, Col, Card, Button, Form, Modal
} from "react-bootstrap";
import {
  FaHeart, FaStar, FaDoorOpen, FaDoorClosed, FaMicrophone, FaUserCircle
} from "react-icons/fa";
import { BsFillLightbulbFill, BsFan } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { SketchPicker } from "react-color";
import Webcam from "react-webcam";
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
  const [lightBrightness, setLightBrightness] = useState(100);
  const [sensorTemp, setSensorTemp] = useState(true);
  const [sensorHumidity, setSensorHumidity] = useState(true);
  const [sensorLight, setSensorLight] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#FFD700");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(65);
  const [lightLevel, setLightLevel] = useState(500);

  const [showFaceScan, setShowFaceScan] = useState(false);
  const [faceScanComplete, setFaceScanComplete] = useState(false);

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcriptList, setTranscriptList] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchData = () => {
      setTemperature((prev) => Math.max(20, Math.min(30, prev + (Math.random() * 2 - 1))));
      setHumidity((prev) => Math.max(50, Math.min(80, prev + (Math.random() * 5 - 2.5))));
      setLightLevel(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    };
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (isOn) => (isOn ? "#28a745" : "#dc3545");

  const handleStartFaceScan = () => {
    setFaceScanComplete(false);
    setShowFaceScan(true);
  
    const scanDuration = 10000;
  
    setTimeout(() => {
      setFaceScanComplete(true);
      setShowFaceScan(false);
    }, scanDuration);
  };
  
  useEffect(() => {
    if (faceScanComplete) {
      const timer = setTimeout(() => {
        setFaceScanComplete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [faceScanComplete]);
  

  useEffect(() => {
    if (faceScanComplete) {
      const timer = setTimeout(() => {
        setFaceScanComplete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [faceScanComplete]);

  const handleOpenVoiceModal = () => {
    setTranscriptList([]);
    setShowVoiceModal(true);
  };

  const toggleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!isListening) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN"; 
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const newTranscript = event.results[0][0].transcript;
        setTranscriptList(prev => [...prev, newTranscript]);
      };

      recognition.onerror = (event) => {
        setTranscriptList(prev => [...prev, "Error: " + event.error]);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row>
        {/* Sidebar */}
        <Col md={2}>
          <Card className="p-3 text-center shadow-sm">
            <h4>Hi, Master</h4>
            <ReactTypingEffect text={["Have a good day!"]} speed={100} eraseDelay={2000} />
            <div className="d-flex justify-content-center">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }} animate={{ color: ["#ff0000", "#ff6347", "#ff4500", "#ff0000"] }} transition={{ repeat: Infinity, duration: 2 }}>
                <FaHeart className="m-2" size={24} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -10 }} animate={{ color: ["#ffd700", "#ffea00", "#ffc107", "#ffd700"] }} transition={{ repeat: Infinity, duration: 2 }}>
                <FaStar className="m-2" size={24} />
              </motion.div>
            </div>
          </Card>
          <Card className="p-3 mt-3 shadow-sm text-center">
            <h5>Current Conditions</h5>
            <motion.h4 animate={{ color: getColor(sensorTemp) }}>Temperature: {sensorTemp ? `${temperature.toFixed(1)}°C` : "Off"}</motion.h4>
            <motion.h4 animate={{ color: getColor(sensorHumidity) }}>Humidity: {sensorHumidity ? `${humidity.toFixed(1)}%` : "Off"}</motion.h4>
            <motion.h4 animate={{ color: getColor(sensorLight) }}>Light: {sensorLight ? `${lightLevel} lx` : "Off"}</motion.h4>
          </Card>
        </Col>

        {/* Chart + Control */}
        <Col md={6}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Temperature & Humidity & Light History</h5>
            <Line data={{
              labels: ["00:00", "3:00", "06:00", "9:00", "12:00", "15:00", "18:00", "21:00", "23:59"],
              datasets: [
                { label: "Temperature (°C)", data: [20, 28, 32, 24, 30, 23, 25, 24, 22], borderColor: "red", borderWidth: 2 },
                { label: "Humidity (%)", data: [60, 70, 69, 59, 68, 62, 65, 63, 60], borderColor: "blue", borderWidth: 2 },
                { label: "Light Level (lx)", data: [29, 45, 50, 60, 70, 75, 80, 65, 30], borderColor: "#FFC107", borderWidth: 2 }
              ]
            }} />
          </Card>
          <Card className="p-3 mt-3 text-center shadow-sm">
            <h5>Security & Recognition</h5>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <Button variant="info" onClick={handleStartFaceScan} className="d-flex align-items-center gap-2">
                <FaUserCircle /> Face Recognition
              </Button>
              <Button variant="dark" onClick={handleOpenVoiceModal} className="d-flex align-items-center gap-2">
                <FaMicrophone /> Voice Command
              </Button>
            </div>
          </Card>
        </Col>

        {/* Quick Controls */}
        <Col md={4}>
          <Card className="p-3 text-center shadow-sm">
            <h5>Quick Control</h5>
            <Row className="mt-2">
              <Col xs={4}><Button variant={lightOn ? "warning" : "secondary"} className="w-100" onClick={() => setLightOn(!lightOn)}><BsFillLightbulbFill className="me-1" /> Light</Button></Col>
              <Col xs={4}><Button variant={fanOn ? "primary" : "secondary"} className="w-100" onClick={() => setFanOn(!fanOn)}><BsFan className="me-1" /> Fan</Button></Col>
              <Col xs={4}><Button variant={doorOpen ? "info" : "secondary"} className="w-100" onClick={() => setDoorOpen(!doorOpen)}>{doorOpen ? <FaDoorOpen className="me-1" /> : <FaDoorClosed className="me-1" />} Door</Button></Col>
            </Row>
            <div style={{ minHeight: "100px" }}>
              {fanOn && (
                <>
                  <Form.Label className="mt-3">Fan Speed</Form.Label>
                  <div className="d-flex justify-content-around">
                    {[30, 60, 100].map(speed =>
                      <Button key={speed} variant={fanSpeed === speed ? "primary" : "outline-primary"} onClick={() => setFanSpeed(speed)}>
                        {speed === 30 ? "Low" : speed === 60 ? "Medium" : "High"}
                      </Button>
                    )}
                  </div>
                </>
              )}
              {lightOn && (
                <>
                  <Form.Label className="mt-3">Light Brightness</Form.Label>
                  <div className="d-flex justify-content-around">
                    {[30, 60, 100].map(level =>
                      <Button key={level} variant={lightBrightness === level ? "warning" : "outline-warning"} onClick={() => setLightBrightness(level)}>
                        {level === 30 ? "Low" : level === 60 ? "Medium" : "High"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
            <Row className="mt-3">
              <Col><Button variant={sensorTemp ? "success" : "secondary"} className="w-100" onClick={() => setSensorTemp(!sensorTemp)}>Temp Sensor</Button></Col>
              <Col><Button variant={sensorHumidity ? "success" : "secondary"} className="w-100" onClick={() => setSensorHumidity(!sensorHumidity)}>Humidity Sensor</Button></Col>
              <Col><Button variant={sensorLight ? "success" : "secondary"} className="w-100" onClick={() => setSensorLight(!sensorLight)}>Light Sensor</Button></Col>
            </Row>
          </Card>
          <Card className="p-2 mt-3 shadow-sm text-center">
            <h5>Light Color</h5>
            <Button className="mb-2" onClick={() => setShowColorPicker(true)}>Select Color</Button>
            <Modal show={showColorPicker} onHide={() => setShowColorPicker(false)} centered>
              <Modal.Header closeButton><Modal.Title>Choose Light Color</Modal.Title></Modal.Header>
              <Modal.Body><SketchPicker color={selectedColor} onChangeComplete={(color) => setSelectedColor(color.hex)} /></Modal.Body>
              <Modal.Footer><Button variant="secondary" onClick={() => setShowColorPicker(false)}>Close</Button></Modal.Footer>
            </Modal>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: selectedColor, margin: "10px auto", border: "2px solid white" }}></div>
          </Card>
        </Col>
      </Row>

      {/* Face Scan UI */}
      {showFaceScan && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 z-3">
          <div className="position-relative">
            <Webcam
              width={480}  
              height={360}  
              videoConstraints={{ facingMode: "user" }}
              className="rounded border border-light"
            />
            <motion.div
              className="position-absolute w-100"
              style={{
                height: "6px",  
                background: "linear-gradient(to right, transparent, lime, transparent)",
                opacity: 0.8,
                boxShadow: "0 0 12px lime"
              }}
              animate={{ top: ["0%", "90%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="text-white text-center mt-2">Scanning face...</div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {faceScanComplete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3">
          <div className="text-white p-4 rounded shadow" style={{ backgroundColor: "rgba(40, 167, 69, 0.7)" }}>
            Face recognized successfully!
          </div>
        </div>
      )}
      {/* Voice Recognition Modal */}
      <Modal show={showVoiceModal} onHide={() => setShowVoiceModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Voice Command</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Button variant={isListening ? "danger" : "primary"} onClick={toggleVoiceRecognition} className="mb-3">
              <FaMicrophone size={24} className="me-2" />
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            <div
              className="border p-3 rounded bg-light"
              style={{
                height: "150px", 
                textAlign: "left",
                overflowY: "auto", 
              }}
            >
              {transcriptList.length === 0 ? "Press microphone and speak..." : transcriptList.map((t, idx) => <div key={idx}>• {t}</div>)}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVoiceModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;
