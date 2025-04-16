import { useState } from 'react';
import FaceId from './FaceId';

const buttonValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, "FaceID", 9, "Del"];

function PinButton({ value, handleClick }) {
    if (value === "Del") {
        return (
            <div
                className="d-flex justify-content-center align-items-center btn "
                style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                onClick={handleClick}
            >
                <img src="src/assets/delete.png" alt="Delete" style={{ width: '48px', height: '48px' }} />
            </div>
        );
    } else if (value === "FaceID") {
        return (
            <div
                className="d-flex justify-content-center align-items-center btn "
                style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                onClick={handleClick}
            >
                <img src="src/assets/face-id.png" alt="Face ID" style={{ width: '56px', height: '56px' }} />
            </div>
        );
    }
    return (
        <div
            className="d-flex justify-content-center align-items-center bg-light rounded-circle shadow-sm"
            style={{ width: '60px', height: '60px', fontSize: '28px', cursor: 'pointer' }}
            onClick={handleClick}
        >
            {value}
        </div>
    );
}

function PinSlot({ active }) {
    return (
        <div
            className={`mx-2 bg-dark transition-all`}
            style={{
                width: active ? '16px' : '32px',
                height: active ? '16px' : '4px',
                borderRadius: active ? '50%' : '6px',
                transition: 'all 0.3s ease-in-out',
                transform: active ? 'translateY(0)' : 'translateY(12px)',
            }}
        />
    );
}

export default function DoorLock({ onSuccess }) {
    const [value, setValue] = useState('');
    const [action, setActionState] = useState(0); // 0: pin, 1: faceid

    const handleNumberClick = (number) => {
        if (value.length < 4) {
            setValue(value + number);
        }
    };
    const handleDelete = () => {
        setValue(value.slice(0, -1));
    };

    return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100 p-3">
            {action === 0 && (
                <div className="d-flex flex-column align-items-center bg-white p-4">
                    <h1 className="h5 fw-bold mb-3">Enter PIN</h1>
                    <div className="d-flex justify-content-center align-items-center mb-4" style={{ height: '48px' }}>
                        {[0, 1, 2, 3].map((_, i) => (
                            <PinSlot key={i} active={i < value.length} />
                        ))}
                    </div>
                    <div className="row row-cols-3 g-4">
                        {buttonValue.map((val, index) => (
                            <div key={index} className="col d-flex justify-content-center">
                                <PinButton
                                    value={val}
                                    handleClick={() => {
                                        if (val === "Del") {
                                            handleDelete();
                                        } else if (val === "FaceID") {
                                            setActionState(1);
                                        } else {
                                            handleNumberClick(val);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {action === 1 && <FaceId />}
        </div>
    );
}
