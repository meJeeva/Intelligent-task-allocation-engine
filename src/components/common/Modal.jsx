import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'large'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} relative max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
