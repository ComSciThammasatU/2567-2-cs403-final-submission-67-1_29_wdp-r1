import React from 'react';
import { AiOutlineDelete } from "react-icons/ai";

const ClearLocalStorageButton = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    alert('Local storage has been cleared.');
  };

  return (
    <div>
      <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-xl shadow w-[80px] flex justify-center "
       onClick={handleClearLocalStorage}>
        <AiOutlineDelete />
        </button>
    </div>
  );
};

export default ClearLocalStorageButton;