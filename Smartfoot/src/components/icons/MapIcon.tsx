import React from 'react';

interface MapIconProps {
  className?: string;
}

const MapIcon: React.FC<MapIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Map Base */}
      <path
        d="M2 9.3C2 14.1 7 21 12 21C17 21 22 14.1 22 9.3C22 4.5 17.5 1 12 1C6.5 1 2 4.5 2 9.3Z"
        fill="#FF4B55"
      />
      {/* Center Circle */}
      <circle
        cx="12"
        cy="9"
        r="3"
        fill="#FFE8D9"
      />
      {/* Map Sections */}
      <path
        d="M2 9.3C2 14.1 7 21 12 21V1C6.5 1 2 4.5 2 9.3Z"
        fill="#FF6B6B"
      />
      <path
        d="M12 21V1C17.5 1 22 4.5 22 9.3C22 14.1 17 21 12 21Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#FF4B55"
      />
    </svg>
  );
};

export default MapIcon; 