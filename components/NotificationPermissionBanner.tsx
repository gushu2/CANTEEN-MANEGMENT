import React from 'react';

interface NotificationPermissionBannerProps {
  permissionStatus: NotificationPermission;
  onEnable: () => void;
}

const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({ permissionStatus, onEnable }) => {
  if (permissionStatus === 'granted') {
    return null;
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md mb-6" role="alert">
        <p className="font-bold">Notifications Blocked</p>
        <p className="text-sm">You have previously blocked notifications. To get real-time updates, please enable them in your browser settings (usually by clicking the 🔒 icon in the address bar).</p>
      </div>
    );
  }

  // 'default' state
  return (
    <div className="bg-indigo-100 border border-indigo-200 p-4 rounded-lg mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <p className="font-bold text-indigo-800">Stay Updated in Real-Time!</p>
        <p className="text-sm text-indigo-700">Enable push notifications for instant meal confirmations and reminders.</p>
      </div>
      <button
        onClick={onEnable}
        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-100 transition-colors duration-200 whitespace-nowrap"
      >
        Enable Notifications
      </button>
    </div>
  );
};

export default NotificationPermissionBanner;