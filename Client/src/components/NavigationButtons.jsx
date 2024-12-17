import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTheme } from '../utils/ThemeContext';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const showBackButton = location.key !== 'default';
  const showForwardButton = window.history.length > 2;

  const buttonStyle = {
    position: 'fixed',
    top: '80px', // Ajustar la posición para estar un poco más abajo del Nav
    zIndex: 1000,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#e0e0e0',
    borderColor: isDarkMode ? '#3a3a3a' : '#e0e0e0',
    color: isDarkMode ? '#ffffff' : '#333333',
  };

  return (
    <>
      {showBackButton && (
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ ...buttonStyle, left: '10px' }}
        >
          Atrás
        </Button>
      )}
      {showForwardButton && (
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={() => navigate(1)}
          style={{ ...buttonStyle, right: '10px' }}
        >
          Adelante
        </Button>
      )}
    </>
  );
};

export default NavigationButtons;