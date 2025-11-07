import React, { useEffect } from 'react';

interface SmsToastProps {
  message: string;
  onClose: () => void;
}

const SmsToast: React.FC<SmsToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 7000); // Auto-close after 7 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm w-11/12 z-50 animate-slide-in">
      <div className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <div className="flex-1">
          <p className="font-bold">SMS Notification Sent</p>
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 -mr-2 -mt-2 p-2 text-white hover:bg-green-700 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SmsToast;