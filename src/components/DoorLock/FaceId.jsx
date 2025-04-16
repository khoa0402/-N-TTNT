import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { color, motion } from "framer-motion";
import apiService from "../../api/api";
const streamImageMessage = (ws, webcamRef) => {
    // Capture a screenshot from the webcam
    const imageSrc = webcamRef.current.getScreenshot();
    //Print webcam is null or not
    if (imageSrc) {
        // Send the screenshot to the WebSocket server
        ws?.send(JSON.stringify({ image: imageSrc }));
    }
}
const waitForScreenshot = async (webcamRef, timeout = 5000, interval = 100) => {
    const start = Date.now();

    return new Promise((resolve, reject) => {
        const check = () => {
            const screenshot = webcamRef.current?.getScreenshot();
            if (screenshot) {
                resolve(screenshot);
            } else if (Date.now() - start >= timeout) {
                reject(new Error("Timed out waiting for screenshot"));
            } else {
                setTimeout(check, interval);
            }
        };
        check();
    });
};
const WebcamCapture = ({ webcamRef }) => {
    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center mb-5">
            <div className="position-relative">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    width={480}
                    height={360}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="rounded border border-light"
                />
                <motion.div
                    className="position-absolute w-100"
                    style={{
                        height: "6px",
                        background:
                            "linear-gradient(to right, transparent, lime, transparent)",
                        opacity: 0.8,
                        boxShadow: "0 0 12px lime",
                    }}
                    animate={{ top: ["0%", "90%"] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </div>
        </div>
    );
}

const registerFace = async (token, websocketRef, webcamRef, setFacePrompt, setStreaming, setAction) => {
    const response = await fetch('http://localhost:8070/api/face/register', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        console.error('Authorization failed:', response.statusText);
        return;
    }

    websocketRef.current = new WebSocket(`ws://localhost:8000/client/face/register?token=${token}`);
    console.log('WebSocket server running on ws://localhost:8000');

    websocketRef.current.onopen = () => {
        console.log('WebSocket connection opened');
        streamImageMessage(websocketRef.current, webcamRef);
    };

    websocketRef.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (message.data.status === 0) {
            streamImageMessage(websocketRef.current, webcamRef);
            setFacePrompt({ text: "Face ID not matched", color: "text-red-500" });
        }
        else if (message.data.status === 1) {
            console.log('Image streamed successfully:', message.image);
            setStreaming(false);
            setFacePrompt({ text: "Update Face ID successfully. Try to press button \"Identify\" to open door!", color: "text-green-500" });
            setAction(0);
            await apiService.controlDoor("open");
        } else if (message.data.status === 2) {
            streamImageMessage(websocketRef.current, webcamRef);
            setFacePrompt({ text: "Come closer to the camera!", color: "text-red-500" });
        } else if (message.data.status === 3) {
            setFacePrompt({ text: "Move slightly away from the camera!", color: "text-green-500" });
            streamImageMessage(websocketRef.current, webcamRef);
        } else if (message.data.status === 4) {
            setFacePrompt({ text: "Time out!", color: "text-red-500" });
            setStreaming(false);
        } else if (message.data.status === -1) {
            console.log('Error:', message.error);
            setStreaming(false);
        }
    };

    websocketRef.current.onerror = (error) => {
        console.log('WebSocket error:', error);
    };

    websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
    };
}
const identifyFace = async (token, websocketRef, webcamRef, setFacePrompt, setStreaming, setAction) => {
    const response = await fetch('http://localhost:8070/api/face/identify', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        console.error('Authorization failed:', response.statusText);
        return;
    }
    console.log(webcamRef.current.getScreenshot());
    websocketRef.current = new WebSocket(`ws://localhost:8000/client/face/identify?token=${token}`);
    console.log('WebSocket server running on ws://localhost:8000');

    websocketRef.current.onopen = () => {
        console.log('WebSocket connection opened');
        streamImageMessage(websocketRef.current, webcamRef);
    };

    websocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (message.data.status === 0) {
            streamImageMessage(websocketRef.current, webcamRef);
            setFacePrompt({ text: "Face ID not matched", color: "text-red-500" });
        }
        else if (message.data.status === 1) {
            console.log('Image streamed successfully:', message.image);
            setStreaming(false);
            setFacePrompt({ text: "Face ID matched successfully. Door unlocked!", color: "text-green-500" });
            setAction(0);
        } else if (message.data.status === 2) {
            streamImageMessage(websocketRef.current, webcamRef);
            setFacePrompt({ text: "Come closer to the camera!", color: "text-red-500" });
        } else if (message.data.status === 3) {
            setFacePrompt({ text: "Move slightly away from the camera!", color: "text-green-500" });
            streamImageMessage(websocketRef.current, webcamRef);
        } else if (message.data.status === 4) {
            setFacePrompt({ text: "Time out!", color: "text-red-500" });
            setStreaming(false);
        } else if (message.data.status === -1) {
            console.log('Error:', message.error);
            setStreaming(false);
        }
    };

    websocketRef.current.onerror = (error) => {
        console.log('WebSocket error:', error);
    };

    websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

export default function FaceId() {
    const webcamRef = useRef(null);
    const [action, setActionState] = useState(0) //0 for nothing, 1 for identify , 2 for update
    const wss = useRef(null);
    const [facePrompt, setFacePrompt] = useState({ text: "Click to identify or update your face ID", color: "text-black" });
    const [streaming, setStreaming] = useState(false);

    useEffect(() => {
        const startStreaming = async () => {
            console.log('Starting webcam streaming...', streaming, webcamRef.current);
            if (streaming && webcamRef.current) {
                try {
                    console.log('Webcam is streaming...');
                    await waitForScreenshot(webcamRef, 5000, 1000);

                    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTc0NDgwNTkxMSwiZXhwIjoxNzQ0ODA5NTExfQ.0oGISLJJ0QI371H-gcU5jJC2s-6gUJiHYbpzfOUkyws";
                    if (action === 1) {
                        if (!token) {
                            console.error('Token not found in local storage');
                            return;
                        }
                        await identifyFace(token, wss, webcamRef, setFacePrompt, setStreaming, setActionState);
                    }
                    else if (action === 2) {
                        if (!token) {
                            console.error('Token not found in local storage');
                            return;
                        }
                        await registerFace(token, wss, webcamRef, setFacePrompt, setStreaming, setActionState);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        startStreaming();

        return () => {
            if (wss.current) {
                wss.current.close();
                wss.current = null;
                console.log('WebSocket server closed');
            }
        };
    }, [streaming]);

    const handleStream = () => {
        setStreaming(!streaming);
        console.log(streaming);
    };

    const identifyButtonHanle = () => {
        if (action === 2) return;
        if (action === 1) {
            setFacePrompt({ text: "Click to identify or update your face ID", color: "text-black" });
            setActionState(0);
            setStreaming(false);
        } else if (action === 0) {
            setActionState(1);
            setStreaming(true);
        }
    };

    const updateButtonHandle = () => {
        if (action === 1) return;
        handleStream();
        if (action === 2) {
            setFacePrompt({ text: "Click to identify or update your face ID", color: "text-black" });
            setActionState(0);
            setStreaming(false);
        }
        else if (action === 0) {
            setActionState(2);
            setStreaming(true);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center p-6 text-center bg-white">
            <h1 className="text-2xl font-bold mb-4">Face ID Authentication</h1>
            <p className={`mb-4 ${facePrompt.color}`} >{facePrompt.text}</p>

            {action === 0 && (
                <div
                    className="flex items-center justify-center mb-4" style={{ width: "200px", height: "200px" }}>
                    <img src="src/assets/face-id-1.png" alt="Face ID Placeholder" className="w-32 h-32" />
                </div>
            )}
            {(action === 1 || action == 2) && (
                <WebcamCapture webcamRef={webcamRef} />
            )}

            <div className="flex flex-row justify-between items-center w-full ">
                <button className="bg-blue-500 w-40 text-white px-4 py-2 rounded mr-2" onClick={() => identifyButtonHanle()}>
                    Identify
                </button>
                <button className="bg-blue-500 w-40 text-white px-4 py-2 rounded" onClick={() => updateButtonHandle()}>
                    Update
                </button>
            </div>
        </div>
    );
}
