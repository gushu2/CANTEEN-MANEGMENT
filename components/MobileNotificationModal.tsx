import React from 'react';

interface MobileNotificationModalProps {
  phoneNumber: string;
  message: string;
  onClose: () => void;
}

const MobileNotificationModal: React.FC<MobileNotificationModalProps> = ({ phoneNumber, message, onClose }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-gray-200 rounded-3xl border-4 border-gray-800 p-1.5 shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
        {/* Phone Notch */}
        <div className="bg-gray-800 w-32 h-5 mx-auto rounded-b-xl"></div>
        
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* WhatsApp Header */}
          <header className="bg-[#008069] text-white flex items-center p-2.5 shadow-md">
            <button onClick={onClose} className="mr-3 p-1 rounded-full hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
              <p className="font-semibold text-lg leading-tight">{phoneNumber}</p>
              <p className="text-xs text-gray-200 leading-tight">online</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            </div>
          </header>
          
          {/* Message Area */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-100" style={{ backgroundImage: 'url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
             <div className="flex flex-col items-end space-y-2">
                {/* Outgoing Message Bubble */}
                <div className="bg-[#dcf8c6] rounded-xl rounded-br-none py-2 px-3 max-w-xs break-words shadow-sm">
                  <p className="text-sm text-gray-800">{message}</p>
                   <div className="text-right text-xs text-gray-500 mt-1">
                      {currentTime}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  </div>
                </div>
            </div>
          </div>
          
          {/* Modal Actions */}
          <div className="bg-gray-100 p-2.5 border-t text-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationModal;
