import { useState } from 'react';
import FaceId from './FaceId';

const buttonValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, "FaceID", 9, "Del"];

function PinButton({ value, handleClick }) {
    if (value === "Del") {
        return (
            <div
                className="w-20 h-20 flex items-center justify-center font-bold cursor-pointer transition duration-200 ease-in-out hover:scale-110"
                onClick={handleClick}
            >
                <img src="src/assets/delete.png" alt="Delete" className="w-12 h-12" />
            </div>
        );
    } else if (value === "FaceID") {
        return (
            <div
                className="w-20 h-20 flex items-center justify-center font-bold cursor-pointer transition duration-200 ease-in-out hover:scale-110"
                onClick={handleClick}
            >
                <img src="src/assets/face-id.png" alt="Face ID" className="w-14 h-14" />
            </div>
        );
    }
    return (
        <div
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-black rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer transition duration-200 ease-in-out"
            onClick={handleClick}
        >
            <span className="text-3xl">{value}</span>
        </div>
    );

}
function PinSlot({ active }) {
    return (
        <div
            className={`
        bg-black
        transition-all duration-300 ease-in-out mx-4
        ${!active ? 'w-8 h-1 rounded-md translate-y-3' : 'w-4 h-4 rounded-full translate-y-0'}
      `}
        />
    );
}
export default function DoorLock({ onSuccess }) {
    const [value, setValue] = useState('');
    const [action, setActionState] = useState(0); //0: pin,1 : faceid,

    const handleNumberClick = (number) => {
        if (value.length < 4) {
            setValue(value + number);
        }
    }
    const handleDelete = () => {
        setValue(value.slice(0, -1));
    }
    return (
        <div className="flex items-center justify-center w-full h-full p-2">

            {action === 0 && (
                <div className=' flex flex-col items-center justify-center bg-white'>
                    <h1 className="text-xl font-bold mb-4">Enter PIN</h1>
                    <div className='flex flex-row items-center justify-center h-12 w-full mb-2'>
                        {[0, 1, 2, 3].map((_, i) => (
                            <PinSlot key={i} active={i < value.length} />
                        ))}
                    </div>
                    <div className='grid grid-cols-3 justify-items-center gap-y-6 gap-x-10'>
                        {buttonValue.map((value, index) => (
                            <PinButton
                                key={index}
                                value={value}
                                handleClick={() => {
                                    if (value === "Del") {
                                        handleDelete();
                                    }
                                    else if (value === "FaceID") {
                                        setActionState(1);
                                    } else {
                                        handleNumberClick(value);
                                    }
                                }}
                            />
                        ))}

                    </div>

                </div>)}
            {action === 1 && (
                <FaceId />)}
        </div>
    );
}
