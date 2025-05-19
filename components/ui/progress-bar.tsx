import React from 'react';

const ProgressBar = ({
  progressPercentage = 0,
  size = 20,
  strokeWidth = 7,
  className = '',
  color = '#22c55e', // Tailwind green-500
  bgColor = '#e5e7eb', // Tailwind gray-200
  fill='#22c55e'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Background Circle */}
      <circle
        stroke={bgColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress Circle */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Text in center */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize={size * 0.2}
        fill={fill}
        fontWeight="bold"
      >
        {Math.round(progressPercentage)}%
      </text>
    </svg>
  );
};

export default ProgressBar;
