import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white shadow-sm rounded-xl ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        </div>
      )}
      <div className={title ? 'px-6 py-4' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
