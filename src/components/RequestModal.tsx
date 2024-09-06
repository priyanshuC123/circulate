import React, { useState } from 'react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phoneNumber: string, daysToBorrow?: number) => void;
  action: 'buy' | 'borrow';
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, onConfirm, action }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [daysToBorrow, setDaysToBorrow] = useState<number>(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }
    onConfirm(phoneNumber, daysToBorrow);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center pt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm {action === 'buy' ? 'Purchase' : 'Borrow'}</h2>
        <label className="block text-gray-700 mb-2">Phone Number:</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Enter your phone number"
        />
        {action === 'borrow' && (
          <>
            <label className="block text-gray-700 mb-2">Borrow Duration (days):</label>
            <input 
              type="number" 
              value={daysToBorrow} 
              onChange={(e) => setDaysToBorrow(Number(e.target.value))} 
              className="w-20 p-2 border border-gray-300 rounded-md mb-4"
            />
          </>
        )}
        <div className="flex space-x-4">
          <button 
            onClick={handleConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
          <button 
            onClick={onClose} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
