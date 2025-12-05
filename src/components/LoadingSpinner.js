'use client';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className={`spinner ${sizes[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
