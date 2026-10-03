import React, { useState, useEffect } from 'react';
import { MobileStudentView } from './MobileStudentView';
import { DesktopStudentView } from './DesktopStudentView';

export const StudentLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileStudentView /> : <DesktopStudentView />;
};
