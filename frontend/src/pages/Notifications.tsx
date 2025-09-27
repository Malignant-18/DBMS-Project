import React from 'react';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400">This page is under construction</p>
        </div>

        {/* No Notifications State */}
        <div className="text-center py-16">
          {/* <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.07 7.07 0 01-6-7c0-3.87 3.13-7 7-7s7 3.13 7 7a7.07 7.07 0 01-6 7v5z" />
            </svg>
          </div> */}
          <h3 className="text-xl font-semibold text-white mb-2">Why are you here</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Go fuck yourself
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;