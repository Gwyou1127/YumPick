import React from 'react';

interface CaptureProviderProps {
  children: React.ReactNode;
}

export const CaptureWrapper: React.FC<CaptureProviderProps> = ({ children }) => {
  return <>{children}</>;
};
