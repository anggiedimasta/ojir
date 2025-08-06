import React from 'react';

interface BankIconProps {
  bankCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BankIcon: React.FC<BankIconProps> = ({ 
  bankCode, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getBankColor = (code: string) => {
    const colors: Record<string, string> = {
      'mandiri': 'bg-blue-600',
      'bca': 'bg-blue-500',
      'bni': 'bg-yellow-500',
      'bri': 'bg-green-600',
      'cimb': 'bg-red-600',
      'dbs': 'bg-blue-700',
      'hsbc': 'bg-red-700',
      'ocbc': 'bg-blue-800',
      'uob': 'bg-green-700',
      'default': 'bg-gray-500'
    };
    
    return colors[code.toLowerCase()] || colors.default;
  };

  const getBankInitials = (code: string) => {
    const initials: Record<string, string> = {
      'mandiri': 'MD',
      'bca': 'BC',
      'bni': 'BN',
      'bri': 'BR',
      'cimb': 'CM',
      'dbs': 'DB',
      'hsbc': 'HS',
      'ocbc': 'OC',
      'uob': 'UB',
      'default': 'BK'
    };
    
    return initials[code.toLowerCase()] || initials.default;
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${getBankColor(bankCode)} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        text-xs
        ${className}
      `}
      title={`Bank ${bankCode.toUpperCase()}`}
    >
      {getBankInitials(bankCode)}
    </div>
  );
};